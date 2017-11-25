// users-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const { ObjectId } = Schema.Types;

  const users = new Schema({
  
    name:       { type: String },
    email:      { type: String, unique: true },
    password:   { type: String },

    googleId:   { type: String },
    facebookId: { type: String },
    
    // relationships
    roles:    [{ type: ObjectId, ref: 'roles', required: true }]

  
  }, {
    timestamps: true
  });

  return mongooseClient.model('users', users);
};
