// Initializes the `roles` service on path `/roles`
const hooks = require('./roles.hooks');

module.exports = function () {
  const app = this;
  const paginate = app.get('paginate');
  const { extendBase } = app.get('helpers');

  const options = {
    name: 'roles',
    extend: 'base/roles',
    allowedMethods: ['create', 'find'],
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/roles', extendBase(options));
  app.associate('query', '/:user/roles', '/roles', 'user');

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('roles');

  service.hooks(hooks);
};
