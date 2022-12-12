module.exports = {
  AUTH_SECRET: process.env.AUTH_SECRET || 'change-me!',
  ADMIN_USER_NAME: process.env.ADMIN_USER_NAME || 'admin',
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || 'password!',
  SESSION_COOKIE_NAME: process.env.COOKIE_NAME || 'st',
  SESSION_DURATION: Number( process.env.SESSION_DURATION || 48 * 60 * 60), // 48 hours as seconds
  TOKEN_DURATION:  Number( process.env.TOKEN_DURATION || 30 * 60), // 30 minutes as seconds
};
