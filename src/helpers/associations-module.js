const extendBase  = require('./extend-base');
const { setSlug, debug } = require('feathers-hooks-common');

// associationType = 'query', 'populate', 'extension'

module.exports = function() {
  const app = this;



  app.associate = function (associationType = 'query', ...args) {
    switch (associationType) {
    case 'query':
      return createQueryAssociation(...args);
    case 'extension':
      return createExtensionAssociation(...args);
    }
  };



  const createExtensionAssociation = (options) => {
    // path = '/users/:id'
    // serviceName = '/users'
    // extensions = ['roles']
    const { path, serviceName } = options;
    let { extensions } = options;

    const allowedExtensions = extensions.map(extension => {
      const [path, populate] = extension.split(':');
      return { path, populate: !!populate };
    });

    extensions = extensions.map(extension => extension.split(':')[0] );

    const service = app.service(serviceName);

    if (!service) {
      throw new Error('Associations: invalid service!');
    }

    const _path = `${path}/:path`;

    app.use(_path, {
      options: {
        name: _path
      },
      find(params) {

        const query = {
          _id: params.route.id,
        };

        if (extensions.includes(params.route.path)) {
          const currentExtensionPath = allowedExtensions.find(i => i.path === params.route.path);
          if (currentExtensionPath.populate) {
            query.$populate = currentExtensionPath;
          }
        }

        return service
          .find({query})
          .then(result => result.data[0])
          .then(entity => entity[params.route.path]);
      }
    });

    app.service(_path)
      .hooks({
        before: {
          all: [
            setSlug('path')
          ]
        }
      });

  };



  const createQueryAssociation = (path, serviceName, slug) => {
    const service = app.service(serviceName);

    if (!service) {
      throw new Error('Associations: invalid service!');
    }

    const options = {
      name: path,
      extend: serviceName,
      allowedMethods: service.options.allowedMethods,
      paginate: service.options.paginate
    };

    app.use(path, extendBase(options));

    app.service(path)
      .hooks({
        before: {
          all: [setSlug(slug)]
        }
      });
  };



};