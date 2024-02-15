const kyber = require("crystals-kyber");
const { toNum, toHex } = require("./helper/keyConverter");

const handleFriendRequest = async (req, res) => {
  if (!req.body.username) return res.status(400).json({ msg: "invalid username" });
  try {
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();
      try {
        const query = "SELECT id, public_key FROM users WHERE username = ?";
        const values = [req.body.username];
        const [results] = await conn.execute(query, values);
        if (!results.length) {
          return res.status(404).json({ msg: "user not found" });
        }
        try {
          const id = results[0].id;
          const pk = toNum(results[0].public_key);
          const [c, ss] = kyber.Encrypt768(pk);
          const iv = crypto.randomBytes(16);
          const key = crypto.createHash("sha512").update(req.session.user.password).digest("hex").substring(0, 32);
          const cipher = crypto.createCipheriv(process.env.encryptionMethod, key, iv);

          const encryptedSs = cipher.update(ss.toString("hex"), "hex", "hex");
          const query =
            "INSERT INTO friends (requester_id, requestee_id, requester_encrypted_ss, requester_iv, encapsulation) VALUES (?, ?, ?, ?, ?)";
          const values = [req.session.user.id, id, encryptedSs, iv, toHex(c)];
          await conn.execute(query, values);
        } catch (err) {
          logError(err);
          conn.rollback();
          conn.release();
          return res.status(500).json({ msg: "could not add friend" });
        }
      } catch (err) {
        logError(err);
        conn.rollback();
        conn.release();
        return res.status(500).json({ msg: "could not get user id" });
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
module.exports = handleFriendRequest;
