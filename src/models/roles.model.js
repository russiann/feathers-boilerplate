const { createEnum } = require('../helpers');

module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;

  const RolePermissions = createEnum('RolePermissions', ['FeatureOne', 'FeatureTwo', 'FeatureThree'], app);
  const RoleActions = createEnum('RoleActions', ['Find', 'Get', 'Create', 'Update', 'Remove'], app);

  const schema = {

    name: { type: String, required: true },

    permissions: [{
      kind: { type: String, enum: RolePermissions },
      actions: [{ type: String, enum: RoleActions }]
    }]

  };

  const roles = new Schema(schema, { timestamps: true });
  return mongooseClient.model('roles', roles);
};
