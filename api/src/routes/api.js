const express = require('express');
const router = express.Router();
const createError = require("http-errors");
const jwt = require('jsonwebtoken');
const debug = require('debug')('api:route');

const { version: pkgVersion } = require('../../package.json');

const { AUTH_SECRET } = require('../config');

router.get('/version', function (req, res, next) {
  res.json({ version: pkgVersion });
});

function isAuth(req, res, next) {
  const bearerToken = req.header('Authorization');
  if (!bearerToken) throw createError(401); // Unauthorized
  const [ prefix, token ] = bearerToken.split(' ');
  if (prefix.toLowerCase()!=='bearer' || !token) {
    debug(`malformed authorization header: ${bearerToken}`);
    throw createError(401); // Unauthorized
  }
  let authorization;
  try {
    authorization = jwt.verify(token, AUTH_SECRET);
  } catch (err) {
    debug(err)
    throw createError(401); // Unauthorized
  }
  debug(authorization);
  req.authorization = authorization;
  next();
}

function hasRole(roleName) {
  return [isAuth,(req,res,next)=>{
    if (!req.authorization.roles.find(role => role === roleName)) {
      throw createError(403); // forbidden
    }
    next();
  }]
}

router.get('/secret', hasRole('admin'), (req,res,next)=> {
  res.json({secret: "sh...."});
})

module.exports = router;
