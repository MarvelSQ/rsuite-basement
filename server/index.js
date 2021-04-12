const path = require('path');
/**
 *
 * @param {import('express').Application} app
 */
function registerApp(app) {
  app.use((req, res, next) => {
    if (req.url.startsWith('/api')) {
      const modulePath = path.resolve(__dirname, '../lib/index.js');
      try {
        delete require.cache[modulePath];
        const { handler } = require(modulePath);
        handler(req, res, next);
      } catch (err) {
        res.statusCode = 404;
        res.send({
          message: `no module found ${modulePath}`,
        });
      }
    }
    next();
  });
}

module.exports = {
  registerApp,
};
