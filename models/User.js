const mongoose = require('mongoose');
//const bcrypt = require('bcrypt');
//const saltRounds = 10;

const userSchema = mongoose.Schema({
	name: {
		type : String,
		maxlength: 50
	},
	email: {
		type : String,
		trim : true, /*space 없애주는 역할*/
		unique: 1
	},
	password: {
		type : String,
		minlength: 5
	},
	lastname: {
		type : String,
		maxlength : 50
	},
	role: {
		type: Number,
		default: 0
	},
	image: String,
	token: {
		type : String
	},
	/*token 유효기간*/
	tokenExp: {
		type : Number
	}
})

/*
userSchema.pre('save', function(next){
	var user = this;
	//비밀번호 바꿀때만 암호화하도록 조건 설정
	if(user.isModified('password')) {
		bcrypt.genSalt(saltRounds, function(err, salt) {
			if(err) return next(err)
			//Encrypt password. 
			// Store hash in your password DB.
		    bcrypt.hash(user.password, salt, function(err, hash) {
		        if(err) return next(err)
		        user.password = hash
		    	next()
			})
		})
	}
})
*/

const User = mongoose.model('User', userSchema)

module.exports = {User}