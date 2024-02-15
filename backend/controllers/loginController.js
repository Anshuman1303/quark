const { pool } = require("../config/mySQL");
const bcrypt = require("bcrypt");
const { logError } = require("../middleware/logger");
const crypto = require("node:crypto");
const { toNum } = require("./helper/keyConverter");

const handleLogin = async (req, res) => {
  if (!req.body.username) {
    return res.status(400).json({ msg: "invalid username" });
  } else if (!req.body.password) {
    return res.status(400).json({ msg: "invalid password" });
  }
  try {
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();
      try {
        const query = "SELECT id, username, password, encrypted_secret_key, sk_iv FROM users WHERE username = ?";
        const values = [req.body.username];
        const [results] = await conn.execute(query, values);
        conn.commit();
        conn.release();
        if (!results.length) {
          return res.status(401).json({ msg: "incorrect username/password" });
        }
        try {
          let user = results[0];
          const match = await bcrypt.compare(req.body.password, user.password);
          if (!match) {
            return res.status(401).json({ msg: "incorrect username/password" });
          }
          const key = crypto.createHash("sha512").update(req.body.password).digest("hex").substring(0, 32);
          const iv = Buffer.from(user.sk_iv, "hex");
          const decipher = crypto.createDecipheriv(process.env.encryptionMethod, key, iv);
          const sk_hex = decipher.update(user.encrypted_secret_key, "hex", "hex");
          const sk = toNum(sk_hex);
          req.session.user = {
            id: user.id,
            username: user.username,
            password: req.body.password,
            sk: sk,
          };
          return res.sendStatus(200);
        } catch (err) {
          logError(err);
          return res.status(500).json({ msg: "could not log in" });
        }
      } catch (err) {
        logError(err);
        conn.rollback();
        conn.release();
        return res.status(500).json({ msg: "could not get user" });
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

  //   console.log("POST REQUEST AT LOGIN");
  //   connection.execute("SELECT * FROM `users`", function (err, results, fields) {
  //     console.log(results); // results contains rows returned by server
  //     console.log(fields); // results contains rows returned by server
  //   });
  //   res.json({ msg: "done" });
};
module.exports = handleLogin;
