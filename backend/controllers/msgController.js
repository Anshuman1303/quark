const kyber = require("crystals-kyber");
const crypto = require("node:crypto");
const { toNum, toHex } = require("./helper/keyConverter");
const { logError } = require("../middleware/logger");
const { pool } = require("../config/mySQL");
const handleMsg = async (req, res) => {
  if (!req.body.username || !req.body.msg) {
    return res.status(400).json({ msg: "invalid request" });
  } else if (req.body.username.toUpperCase() === req.session.user.username.toUpperCase()) {
    return res.status(400).json({ msg: "invalid request" });
  } else if (Buffer.byteLength(req.body.msg, "hex") > 65535) {
    return res.status(400).json({ msg: "too many characters" });
  }
  try {
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();
      try {
        // get the user
        const query = "SELECT id, public_key FROM users WHERE username = ?";
        const values = [req.body.username];
        const [results] = await conn.execute(query, values);
        if (!results.length) {
          return res.status(404).json({ msg: "user not found" });
        }
        const receiver = results[0];
        try {
          const query =
            "SELECT requester_id, requestee_id, accepted, requester_encrypted_ss, requester_iv, requestee_encrypted_ss, requestee_iv, encapsulation FROM friends WHERE (requester_id = :rec AND requestee_id = :sen) OR (requester_id = :sen AND requestee_id = :rec)";
          const values = { sen: receiver.id, rec: req.session.user.id };
          const [results] = await conn.execute(query, values);
          let sender = {};
          if (!results.length) {
            // if first time message
            try {
              const id = receiver.id;
              const pk = toNum(receiver.public_key);
              const [c, ss] = kyber.Encrypt768(pk);
              const iv = crypto.randomBytes(16);
              const key = crypto.createHash("sha512").update(req.session.user.password).digest("hex").substring(0, 32);
              const cipher = crypto.createCipheriv(process.env.encryptionMethod, key, iv);
              const encryptedSs = cipher.update(ss.toString("hex"), "hex", "hex") + cipher.final("hex");
              const query =
                "INSERT INTO friends (requester_id, requestee_id, requester_encrypted_ss, requester_iv, encapsulation) VALUES (?, ?, ?, ?, ?)";
              const values = [req.session.user.id, id, encryptedSs, iv.toString("hex"), toHex(c)];
              await conn.execute(query, values);
              sender = { ...sender, ss: encryptedSs, iv: iv.toString("hex") };
            } catch (err) {
              logError(err);
              conn.rollback();
              conn.release();
              return res.status(500).json({ msg: "could not add friend" });
            }
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
            const iv = crypto.randomBytes(16);
            const cipher = crypto.createCipheriv(process.env.encryptionMethod, ss, iv);
            const encryptedMsg = cipher.update(req.body.msg, "utf8", "hex") + cipher.final("hex");
            const query = "INSERT INTO msgs (sender_id, receiver_id, msg, iv) VALUES (?, ?, ?, ?)";
            const values = [req.session.user.id, receiver.id, Buffer.from(encryptedMsg, "hex"), iv.toString("hex")];
            await conn.execute(query, values);
            conn.commit();
            conn.release();
            return res.sendStatus(200);
          } catch (err) {
            logError(err);
            conn.rollback();
            conn.release();
            return res.status(500).json({ msg: "could not send message" });
          }
        } catch (err) {
          logError(err);
          conn.rollback();
          conn.release();
          return res.status(500).json({ msg: "could not send message" });
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
};
module.exports = handleMsg;
