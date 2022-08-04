const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema(
	{
		name: { type: String, required: true},
		password: { type: String },
		rollNo:{type: String},
		email: { type: String, required: true, unique: true},
		class:{ type: String},
		yop: { type: String},
        faculty: { type: String}
	},
	{ collection: 'users' }
)

const userSchema = mongoose.model('UserSchema', UserSchema)

module.exports = userSchema