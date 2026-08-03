const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// Le plugin garantit l'unicité de l'email et transforme l'erreur MongoDB
// en erreur de validation Mongoose lisible.
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);
