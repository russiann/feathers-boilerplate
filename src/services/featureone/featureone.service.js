// Initializes the `featureone` service on path `/featureone`
const createService = require('./featureone.class.js');
const hooks = require('./featureone.hooks');

module.exports = function () {
  const app = this;
  const paginate = app.get('paginate');
  const { RolePermissions } = app.get('enums');

  const options = {
    name: 'featureone',
    paginate,
    enum: RolePermissions.FeatureOne
  };

  // Initialize our service with any options it requires
  app.use('/featureone', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('featureone');

  service.hooks(hooks);
};
