const { pool } = require("../config/mySQL");
const validator = require("validator");
const bcrypt = require("bcrypt");
const { logError } = require("../middleware/logger");
const kyber = require("crystals-kyber");
const crypto = require("node:crypto");
const { toHex } = require("./helper/keyConverter");
function checkUsername(username) {
  if (!username) {
    return false;
  }
  if (validator.isLength(username, { min: 4, max: 50 }) && validator.isAlphanumeric(username, "en-US", { ignore: "_" })) {
    return true;
  } else {
    return false;
  }
}

function checkPassword(password) {
  if (!password) {
    return false;
  }
  if (
    validator.isStrongPassword(password, { minSymbols: 0 }) &&
    !validator.contains(password, " ") &&
    validator.isLength(password, { min: 8, max: 20 })
  ) {
    return true;
  } else {
    return false;
  }
}

function checkConfirmPassword(password, confirmPassword) {
  if (!confirmPassword) {
    return false;
  }
  if (validator.equals(password, confirmPassword)) {
    return true;
  } else {
    return false;
  }
}

const handleRegister = async (req, res) => {
  if (!checkUsername(req.body.username)) {
    return res.status(400).json({ msg: "invalid username" });
  } else if (!checkPassword(req.body.password)) {
    return res.status(400).json({ msg: "invalid password" });
  } else if (!checkConfirmPassword(req.body.password, req.body.confirmPassword)) {
    return res.status(400).json({ msg: "passwords do not match" });
  }
  try {
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();
      try {
        const query = "SELECT id FROM users WHERE username = ?";
        const values = [req.body.username];
        const [results] = await conn.execute(query, values);
        if (results.length) {
          return res.status(409).json({ msg: "username unavailable" });
        }
        try {
          //
          const [pk, sk] = kyber.KeyGen768();
          const iv = crypto.randomBytes(16);
          const key = crypto.createHash("sha512").update(req.body.password).digest("hex").substring(0, 32);
          const cipher = crypto.createCipheriv(process.env.encryptionMethod, key, iv);
          const encryptedSk = cipher.update(toHex(sk), "hex", "hex");
          const hashedPass = await bcrypt.hash(req.body.password, 10);
          const query = "INSERT INTO users (username, password, public_key, encrypted_secret_key, sk_iv) VALUES (?, ?, ?, ?, ?)";
          const values = [req.body.username, hashedPass, toHex(pk), encryptedSk, iv.toString("hex")];
          await conn.execute(query, values);
          conn.commit();
          conn.release();
          return res.status(201).json({ msg: "user registered" });
        } catch (err) {
          logError(err);
          conn.rollback();
          conn.release();
          return res.status(500).json({ msg: "could not add user" });
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

module.exports = handleRegister;
