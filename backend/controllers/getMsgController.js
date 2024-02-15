const kyber = require("crystals-kyber");
const crypto = require("node:crypto");
const { toNum, toHex } = require("./helper/keyConverter");
const { logError } = require("../middleware/logger");
const { pool } = require("../config/mySQL");
const handleGetMsg = async (req, res) => {
  if (!req.body.username) {
    return res.status(400).json({ msg: "invalid request" });
  } else if (req.body.username.toUpperCase() === req.session.user.username.toUpperCase()) {
    return res.status(400).json({ msg: "cannot send message to self" });
  }
  try {
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();
      try {
        // get the user
        const query = "SELECT id FROM users WHERE username = ?";
        const values = [req.body.username];
        const [results] = await conn.execute(query, values);
        if (!results.length) {
          return res.status(404).json({ msg: "user not found" });
        }
        // let's say the user who is getting messages is sender and who's messages they are getting is receiver
        const receiver = results[0];
        try {
          const query =
            "SELECT requester_id, requestee_id, accepted, requester_encrypted_ss, requester_iv, requestee_encrypted_ss, requestee_iv, encapsulation FROM friends WHERE (requester_id = :rec AND requestee_id = :sen) OR (requester_id = :sen AND requestee_id = :rec)";
          const values = { rec: receiver.id, sen: req.session.user.id };
          const [results] = await conn.execute(query, values);
          let sender = {};
          if (!results.length) {
            return res.status(404).json({ msg: "no messages from provided user" });
          } else if (req.session.user.id === results[0].requestee_id && !results[0].accepted) {
            const ss = kyber.Decrypt768(toNum(results[0].encapsulation), req.session.user.sk);
            const iv = crypto.randomBytes(16);
            const key = crypto.createHash("sha512").update(req.session.user.password).digest("hex").substring(0, 32);
            const cipher = crypto.createCipheriv(process.env.encryptionMethod, key, iv);
            const encryptedSs = cipher.update(ss.toString("hex"), "hex", "hex");
            const query =
              "UPDATE friends SET accepted = 1, requestee_encrypted_ss = ?, requestee_iv = ?, encapsulation = null WHERE requestee_id = ? AND requester_id = ?";
            const values = [encryptedSs, iv.toString("hex"), req.session.user.id, receiver.id];
            await conn.execute(query, values);
            sender = { ...sender, ss: encryptedSs, iv: iv.toString("hex") };
          } else {
            if (req.session.user.id === results[0].requester_id) {
              sender = { ...sender, ss: results[0].requester_encrypted_ss, iv: results[0].requester_iv };
            } else {
              sender = { ...sender, ss: results[0].requestee_encrypted_ss, iv: results[0].requestee_iv };
            }
          }
          try {
            const key = crypto.createHash("sha512").update(req.session.user.password).digest("hex").substring(0, 32);
            const decipher = crypto.createDecipheriv(process.env.encryptionMethod, key, Buffer.from(sender.iv, "hex"));
            const ss = Buffer.from(decipher.update(sender.ss, "hex", "hex"), "hex");
            const query = `SELECT msg_timestamp, sender_id, receiver_id, msg, iv FROM msgs WHERE ((sender_id = :sen AND receiver_id = :rec) OR (sender_id = :rec AND receiver_id = :sen))${
              req.body.timeA ? " AND msg_timestamp > :timeA" : ""
            }`;
            const values = { sen: req.session.user.id, rec: receiver.id };
            if (req.body.timeA) values.timeA = new Date(req.body.timeA);
            const [encryptedMsgs] = await conn.execute(query, values);
            conn.commit();
            conn.release();
            const msgs = encryptedMsgs.map((msg) => {
              const decipherMsg = crypto.createDecipheriv(process.env.encryptionMethod, ss, Buffer.from(msg.iv, "hex"));
              const msgText = decipherMsg.update(msg.msg.toString("hex"), "hex", "utf8") + decipherMsg.final("utf8");
              return {
                msg: msgText,
                time: msg.msg_timestamp,
                sent: req.session.user.id === msg.sender_id,
              };
            });
            res.status(200).json({ msgs: msgs });
          } catch (err) {
            logError(err);
            conn.rollback();
            conn.release();
            return res.status(500).json({ msg: "could not get message" });
          }
        } catch (err) {
          logError(err);
          conn.rollback();
          conn.release();
          return res.status(500).json({ msg: "could not get message" });
        }
      } catch (err) {
        logError(err);
        conn.rollback();
        conn.release();
        return res.status(500).json({ msg: "could not find user" });
      }
    } catch (err) {
      logError(err);
      conn.release();
      return res.status(500).json({ msg: "could not begin transaction" });
    }
  } catch (err) {
    logError(err);
    return res.status(500).json({ msg: "could not get connection" });
  }
  // console.log(process.env.pk.length);
  // const publicKey = toNum(process.env.pk);
  // const secretKey = toNum(process.env.sk);
  // let [c, ss1] = kyber.Encrypt768(publicKey);
  // console.log(toHex(c).length);
  // let ss2 = kyber.Decrypt768(c, secretKey);
  // const iv = crypto.randomBytes(16);
  // console.log(ss1.toString("hex"));
  // const cipher = crypto.createCipheriv(process.env.encryptionMethod, ss1, iv);
  // const encrypted = cipher.update(req.body.msg, "utf8", "hex");
  // const decipher = crypto.createDecipheriv(process.env.encryptionMethod, ss2, iv);
  // const decrypted = decipher.update(encrypted, "hex", "utf8");
  // console.log(decrypted);
};
module.exports = handleGetMsg;
