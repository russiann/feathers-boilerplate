const { Verifier } = require('@feathersjs/authentication-jwt');
const _ = require('lodash');

class JTWVerifier extends Verifier {
  verify(req, email, client, done) {
  
    const query = {
      email,
      $populate: 'roles'
    };

    this.service
      .find({ query })
      .then(result => {
        if (result.total === 0) {
          return done(null, null);
        }

        const [user] = result.data;

        const permissions = user.roles
          .reduce((data, role) => [...data, ...role.permissions], [])
          .map(permission => _.omit(permission, '_id'));

        const payload = {
          userId: user._id,
          permissions
        };

        done(null, user, payload)
      })
      .catch(() => done(null, {}, {}));
  }
}

module.exports = JTWVerifier;