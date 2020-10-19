
const express = require('express')
const app = express()
const port = 3000

app.post('/feedback', async (req, res) => {
	const { id, feedbackType, message, user, url } = req.body

	console.log(`New ${ feedbackType } feedback for form ${ id } from user ${ user } on page ${ url }: ${ message }`)
	// do something with feedback

	res.send('ok')
})

app.listen(port, () => {
	console.log(`Listening at http://localhost:${ port }`)
})