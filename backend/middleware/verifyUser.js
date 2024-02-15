const verifyUser = async (req, res, next) => {
  if (req.session?.user?.id) {
    next();
  } else {
    return res.sendStatus(401);
  }
};
module.exports = verifyUser;
