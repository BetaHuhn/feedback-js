const { writeFile } = require('fs').promises
const js = require('rosid-handler-js')

const pgk = require('./package.json')

js('src/index.js', {

	optimize: true,
	browserify: {
		standalone: pgk.name
	}

}).then((data) => {

	return writeFile(`dist/${ pgk.name }.min.js`, data)

})