import Feedback, { IS_BROWSER } from './feedback'
export default Feedback

const detect = () => {
	const optsElem = document.querySelector('[data-feedback-opts]')
	const buttonElems = document.querySelectorAll('[data-feedback-trigger]')

	// If no attributes are found, assume programmatic usage and attach Feedback class to window
	if (!optsElem && buttonElems.length < 1) {
		window.Feedback = Feedback

		return
	}

	// Parse options specified in data-feedback-opts attribute
	const attributeValue = optsElem && optsElem.getAttribute('data-feedback-opts') || '{}'
	const options = JSON.parse(attributeValue)

	window.addEventListener('load', () => {
		window.feedback = new Feedback(options)

		const renderDefaultButton = buttonElems.length < 1

		// Initalize the feedback widget
		window.feedback.attach(renderDefaultButton)

		// Attach event listeners to data-drkmd-toggle elements
		if (!renderDefaultButton) {
			buttonElems.forEach((item) => {
				item.addEventListener('click', () => {
					window.feedback.renderModal()
				})
			})

			return
		}

		// Render default button
		window.feedback.renderButton()
	})
}

if (IS_BROWSER) {
	detect()
} else {
	console.warn('[feedback-js] Detected environment without a `window` object')
}