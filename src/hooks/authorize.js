const { NotAuthenticated } = require('@feathersjs/errors');

module.exports = () => (context) => {

  if (!context.params.payload || !context.params.payload.permissions) {
    throw new Error('Invalid payload data!');
  }

  const { permissions } = context.params.payload;
  const { RoleActions } = context.app.get('enums');

  const serviceEnum = context.service.options.enum;
  const actionEnum = RoleActions.get(context.method);

  const [permission] = permissions
    .filter(p => serviceEnum.is(Number(p.kind)));

  if (!permission) {
    throw new NotAuthenticated('User has no authorization to use this service', { serviceName: context.service.options.name });
  }

  const authorized = permission.actions.includes(actionEnum.value.toString());

  if (!authorized) {
    throw new NotAuthenticated('User has no authorization to use this method', {
      service: context.service.options.name,
      method: context.method
    });
  }

  return context;
};