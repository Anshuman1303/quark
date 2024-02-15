const { logError } = require("../middleware/logger");

const handleLogout = async (req, res) => {
  try {
    req?.session.destroy();
    return res.sendStatus(200);
  } catch (err) {
    logError(err);
    return res.sendStatus(500);
  }
};
module.exports = handleLogout;
