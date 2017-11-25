// Initializes the `roles` service on path `/roles`
const createService = require('feathers-mongoose');
const createModel = require('../../models/roles.model');
const hooks = require('./roles.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'roles',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/base/roles', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('base/roles');

  service.hooks(hooks);
};
