const users = require('./users/users.service.js');
const roles = require('./roles/roles.service.js');
module.exports = function (app) {
  app.configure(users);
  app.configure(roles);
};
