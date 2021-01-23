const express = require('express')
const app = express()
const port = 5000
const bodyParser = require("body-parser");

const config = require("./config/key");


const {User} = require("./models/User");

//bodyparser: client의 정보를 서버에서 분석해서 가져올 수 있도록 함.
//application/x-www-form-urlencoded -> 이렇게 된 데이터를 분석해서 가져올 수 있게 함
app.use(bodyParser.urlencoded({extended: true}));
//application/json -> json 현태 데이터를 분석해서 가져올 수 있게 함
app.use(bodyParser.json());


/* application과 mongodb 연동*/
const mongoose = require('mongoose')
mongoose.connect(config.mongoURI, {	
	useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB Connected...'))
.catch(err => console.log(err))



app.get('/', (req, res) => { res.send('Hello World, 안녕하세요~! 오늘 하루도 화이팅!! 힘내자 아자!') })


app.post('/register', (req, res) => {
	//회원가입시 필요한 정보들을 client에서 가져오면 그것들을 디비에 넣어준다.

	const user = new User(req.body)
	//유저 모델에 저장, mongoDB method = save()
	user.save((err, userInfo) => {
		if(err) return res.json({success: false, err})
		return res.status(200).json({
			success: true
		})

	})
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})