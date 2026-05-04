module.exports.checkAuth = function (req, res, next) {
  const userId = req.session.userId;

  if (!userId) {
    req.flash("message", "Faça login para acessar esta página.");

    return res.redirect("/login");
  }

  next();
};
