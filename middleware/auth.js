function requireLogin(req, res, next) {
  if (!req.session.user) {
    return res.redirect('/auth/login');
  }

  next();
}

function requireAdmin(req, res, next) {
  if (!req.session.user) {
    return res.redirect('/auth/login');
  }

  if (!req.session.user.roles.includes('Admin')) {
    return res.status(403).send('Forbidden');
  }

  next();
}

module.exports = {
  requireLogin,
  requireAdmin
};