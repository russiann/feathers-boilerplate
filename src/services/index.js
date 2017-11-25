const roles = require('./roles/roles.service.js');
const users = require('./users/users.service.js');
const featureone = require('./featureone/featureone.service.js');
module.exports = function () {
  const app = this;
  app.configure(roles);
  app.configure(users);
  app.configure(featureone);
};
