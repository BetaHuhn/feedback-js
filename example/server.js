
const express = require('express')
const app = express()
const port = 3000

app.post('/feedback', async (req, res) => {
	const { id, feedbackType, message, email, url } = req.body

	console.log(`New ${ feedbackType } feedback for form ${ id } from user ${ email } on page ${ url }: ${ message }`)
	// do something with data

	res.send('ok')
})

app.listen(port, () => {
	console.log(`Listening at http://localhost:${ port }`)
})