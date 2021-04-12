/**
 * @type {import('express').RequestHandler}
 */
module.exports = function app(req, res, next) {
  res.send({
    message: 'success111',
  });
};
