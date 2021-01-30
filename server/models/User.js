const mongoose = require('mongoose');
//const bcrypt = require('bcrypt');
//const saltRounds = 10;
const jwt = require('jsonwebtoken');

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
	}else{
		next()
	}
})
*/

userSchema.methods.comparePassword = function(plainPassword, cb){
	//비밀번호 비교 함수, (원래 비번, 콜백 함수)
	//plainpassword를 암호화하여 비교
	/*
	bcrypt.compare(plainPassword, this.password, function(err, isMatch) {
		if(err) return cb(err),
		cb(null, isMatch)
	})
	*/
	userSchema.compare(plainPassword, this.password, function(err, isMatch) {
		if(err) return cb(err),
		cb(null, isMatch)
	})
}

userSchema.methods.generateToken = function(cb){
	var user = this;
	//jsonwebtoken 을 이용하여 token 생성
	var token = jwt.sign(user._id.toHexString(), 'secretToken')
	//token = user._id + 'secretToken'
	user.token = token
	user.save(function(err, user) {
		if(err) return cb(err)
			cb(null, user)
	})
}

userSchema.statics.findByToken = function(token, cb){
	var user = this;
	//decode token
	jwt.verify(token, 'secretToken', function(err, decoded) {
		//유저 아이디를 이용해서 유저를 찾은 후
		//클라이언트에서 가져온 token과 DB에 보관된 토큰이 일치하는지 확인
		user.findOne({ "_id": decoded, "token" : token }, function(err, user) {
			if(err) return cb(err);
			cb(null, user)
		})
	})
}

const User = mongoose.model('User', userSchema)

module.exports = {User}