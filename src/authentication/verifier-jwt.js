const { Verifier } = require('@feathersjs/authentication-jwt');

class JTWVerifier extends Verifier {
  verify(req, payload, done) {
    const id = payload[`${this.options.entity}Id`];

    if (id === undefined) {
      return done(null, {}, payload);
    }

    this.service.get(id)
      .then(entity => {
        return done(null, entity, payload);
      })
      .catch(error => {
        return done(null, {}, payload);
      });
  }
}

module.exports = JTWVerifier;