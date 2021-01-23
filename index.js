const express = require('express')
const app = express()
const port = 5000
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const config = require("./config/key");

const {auth} = require("./middleware/auth");
const {User} = require("./models/User");

//bodyparser: client의 정보를 서버에서 분석해서 가져올 수 있도록 함.
//application/x-www-form-urlencoded -> 이렇게 된 데이터를 분석해서 가져올 수 있게 함
app.use(bodyParser.urlencoded({extended: true}));
//application/json -> json 현태 데이터를 분석해서 가져올 수 있게 함
app.use(bodyParser.json());
app.use(cookieParser());

/* application과 mongodb 연동*/
const mongoose = require('mongoose')
mongoose.connect(config.mongoURI, {	
	useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB Connected...'))
.catch(err => console.log(err))



app.get('/', (req, res) => { res.send('Hello World, 안녕하세요~! 오늘 하루도 화이팅!! 힘내자 아자!') })


app.post('/api/users/register', (req, res) => {
	//회원가입시 필요한 정보들을 client에서 가져오면 그것들을 디비에 넣어준다.

	const user = new User(req.body)

	//유저 모델에 저장, mongoDB method = save()
	//User.js -> next()
	user.save((err, userInfo) => {
		if(err) return res.json({success: false, err})
		return res.status(200).json({
			success: true
		})

	})
})

//Loign + create Token
app.post('/api/users/login', (req, res) => {
	//1.요청된 이메일을 디비에서 존재하는지 찾음
	User.findOne({email : req.body.email}, (err, user) => {
		if(!user){
			return res.json({
				loginSuccess : false,
				message: "입력한 이메일에 해당하는 유저가 없습니다."
			})
		}
		//2.존재하면 비밀번호 일치 여부 확인
		user.comparePassword(req.body.password, (err, isMatch) => {
			if(!isMatch) 
				return res.json({loginSuccess : false, message: "비밀번호가 틀렸습니다."})

			//3.일치하면 token 생성
			user.generateToken((err, user)=> {
				if(err) return res.status(400).send(err);

				// token을 저장한다. where? 쿠키, 로컬스토리지 등 , 여기선 쿠키에 저장
				res.cookie("x_auth", user.token)
				.status(200)
				.json({ loginSuccess: true, userId: user._id})

			})
		})

	})

})


//Auth
app.get('/api/users/auth', auth , (req, res)=> {

	//여기까지 middleware를 통과해 왔다는 얘기는 Authentication이 True라는 의미
	resstatus(200).json({
		_id: req.user._id,
		isAdmin: req.user.role === 0? false : true, //0이 아니면 관리자
		email : req.user.email
		name: req.user.name,
		lastname: req.user.lastname,
		role : req.user.role,
		image: req.user.image

	})
})


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})