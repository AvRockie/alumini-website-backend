const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const User = require('./models/userSchema.js')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

app.use(cors())
app.use(express.json())

mongoose.connect('mongodb+srv://av:av@cluster0.fifwv.mongodb.net/?retryWrites=true&w=majority',{
	useUnifiedTopology: true,
	useNewUrlParser: true
})

app.get('/',(req,res)=>{
	res.send("Hello world)
})

app.post('/api/register', async (req, res) => {
	console.log(req.body)
	try {
		const newPassword = await bcrypt.hash(req.body.password, 10)
		const newUser = new User({
			name: req.body.name,
			email: req.body.email,
			password: newPassword,
			rollNo:req.body.rollNo,
			class:req.body.class,
			yop:req.body.yop,
			faculty:req.body.faculty
		})
		newUser.save()
		res.json({ status: 'ok' })
	} catch (err) {
		res.json({ status: 'error', error: 'Duplicate email' })
	}
})

app.post('/api/login', async (req, res) => {
	const user = await User.findOne({
		email: req.body.email,
	})

	if (!user) {
		return res.json({ status: 'error', error: 'Invalid login' })
	}

	const isPasswordValid = await bcrypt.compare(
		req.body.password,
		user.password
	)

	if (isPasswordValid) {
		const token = jwt.sign(
			{
				name: user.name,
				email: user.email,
			},
			'secret123'
		)

		return res.json({ status: 'ok', user: token })
	} else {
		return res.json({ status: 'error', user: false })
	}
})

app.get('/api/getusers', async (req, res) => {
	const token = req.headers['x-access-token']

	try {
		const decoded = jwt.verify(token, 'secret123')
		const email = decoded.email
		const user = await User.findOne({ email: email })
        
		return res.json({ status: 'ok', quote: user.quote })
	} catch (error) {
		console.log(error)
		res.json({ status: 'error', error: 'invalid token' })
	}
})

// app.post('/api/quote', async (req, res) => {
// 	const token = req.headers['x-access-token']

// 	try {
// 		const decoded = jwt.verify(token, 'secret123')
// 		const email = decoded.email
// 		await User.updateOne(
// 			{ email: email },
// 			{ $set: { quote: req.body.quote } }
// 		)

// 		return res.json({ status: 'ok' })
// 	} catch (error) {
// 		console.log(error)
// 		res.json({ status: 'error', error: 'invalid token' })
// 	}
// })

app.listen(5000, () => {
	console.log('Server started on 1337')
})
