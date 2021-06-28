import Feedback, { IS_BROWSER } from './feedback'
export default Feedback

const detect = () => {
	const optsElem = document.querySelector('[data-feedback-opts]')

	// If no attributes are found, assume programmatic usage and attach Feedback class to window
	if (!optsElem) {
		window.Feedback = Feedback

		return
	}

	// Parse options specified in data-feedback-opts attribute
	const attributeValue = optsElem && optsElem.getAttribute('data-feedback-opts') || '{}'
	const options = JSON.parse(attributeValue)

	window.addEventListener('load', () => {
		window.feedback = new Feedback(options)

		// Attach the feedback button to the page
		window.feedback.attach()
	})
}

if (IS_BROWSER) {
	detect()
} else {
	console.warn('[feedback-js] Detected environment without a `window` object')
}