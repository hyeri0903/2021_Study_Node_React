const {User} = require("../models/User")

let auth = (req, res, next) => {
	//인증 처리를 하는 곳

	// Client Cookie에서 token 가져옴
	let token = req.cookies.x_auth;

	//Decode token, find user id from Server
	User.findByToken(token, (err,user)=> {
		//User가 있으면 인증 OK, User가 없으면 인증 No
		if(err) throw err;
		if(!user) return res.json({isAuth : false, error: true })

		req.token = token;
		req.user = user;
		next()

	})
}

module.exports = { auth };