const handleIsAuth = async (req, res, next) => {
  if (req.session?.user?.id) {
    return res.sendStatus(200);
  } else {
    return res.sendStatus(401);
  }
};
module.exports = handleIsAuth;
