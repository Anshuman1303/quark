const kyber = require("crystals-kyber");
const crypto = require("node:crypto");
const { toNum, toHex } = require("./helper/keyConverter");
const { logError } = require("../middleware/logger");
const { pool } = require("../config/mySQL");
const handleGetFriends = async (req, res) => {
  try {
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();
      try {
        // get the user
        const query =
          "SELECT receiver_id, max(msg_timestamp) AS msg_timestamp, users.username FROM (SELECT msgs.receiver_id, max(msgs.msg_timestamp) AS msg_timestamp FROM msgs WHERE msgs.sender_id = :id GROUP BY msgs.receiver_id UNION SELECT msgs.sender_id, max(msgs.msg_timestamp) AS msg_timestamp FROM msgs WHERE msgs.receiver_id = :id GROUP BY msgs.sender_id ) AS abc INNER JOIN users ON users.id = abc.receiver_id GROUP by receiver_id,users.username ORDER BY msg_timestamp DESC";
        const values = { id: req.session.user.id };
        const [results] = await conn.execute(query, values);
        conn.commit();
        conn.release();
        const friends = results.map((row) => {
          return row.username;
        });
        return res.status(200).json({ friends: friends });
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
  return res.sendStatus(200);
};
module.exports = handleGetFriends;
