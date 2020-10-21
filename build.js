const { writeFile } = require('fs').promises
const js = require('rosid-handler-js')

js('src/index.js', {

	optimize: true,
	browserify: {
		standalone: 'feedback-js'
	}

}).then((data) => {

	return writeFile(`dist/feedback-js.min.js`, data)

})