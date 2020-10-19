import Feedback, { IS_BROWSER } from './feedback'
export default Feedback

if (IS_BROWSER) {
	(function(window) {
		window.Feedback = Feedback
	}(window))
}