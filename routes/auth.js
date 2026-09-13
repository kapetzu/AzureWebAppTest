const express = require('express');
const router = express.Router();
const APP_URL = process.env.APP_URL;

const { cca } = require('../auth');

router.get('/login', async function(req, res, next) {
  try {
    const authUrl = await cca.getAuthCodeUrl({
      scopes: ['openid', 'profile', 'email'],
      redirectUri: `${APP_URL}/auth/callback`
    });

    res.redirect(authUrl);
  } catch (error) {
    next(error);
  }
});

router.get('/callback', async function(req, res, next) {
  try {
    const tokenResponse = await cca.acquireTokenByCode({
      code: req.query.code,
      scopes: ['openid', 'profile', 'email'],
      redirectUri: `${APP_URL}/auth/callback`
    });

    console.log('Logged in user:', tokenResponse.account.username);

    req.session.user = {
      username: tokenResponse.account.username,
      name: tokenResponse.account.name,
      roles: tokenResponse.idTokenClaims?.roles || []
    };

    res.redirect('/');
  } catch (error) {
    next(error);
  }
});

router.get('/logout', function(req, res, next) {
  req.session.destroy(function(error) {
    if (error) {
      return next(error);
    }

    const logoutUrl =
      `https://login.microsoftonline.com/${process.env.ENTRA_TENANT_ID}/oauth2/v2.0/logout` +
      `?post_logout_redirect_uri=${encodeURIComponent(`${APP_URL}/auth/logged-out`)}`;

    res.redirect(logoutUrl);
  });
});

router.get('/logged-out', function(req, res) {
    res.render('logged-out'); 
});

module.exports = router;