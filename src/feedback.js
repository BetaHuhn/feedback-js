export const IS_BROWSER = typeof window !== 'undefined'

export default class Feedback {
	/**
	 * Feedback item
	 * @param {object} options - object containing feedback options
	 */
	constructor(options) {
		if (!IS_BROWSER) {
			console.warn('Detected environment without a `window` object')
			return
		}

		const defaultOptions = {
			id: 'feedback',
			endpoint: '',
			events: false,
			emailField: false,
			forceShowButton: false,
			btnTitle: 'Feedback',
			title: 'Feedback',
			contactText: 'Want to chat?',
			contactLink: '',
			typeMessage: 'What feedback do you have?',
			success: 'Thanks! 👊',
			inputPlaceholder: 'Your feedback goes here!',
			emailPlaceholder: 'Email address (optional)',
			submitText: 'Submit',
			backText: 'Back',
			failedTitle: 'Oops, an error ocurred!',
			failedMessage: 'Please try again. If this keeps happening, try to send an email instead.',
			position: 'right',
			primary: 'rgb(53, 222, 118)',
			background: '#fff',
			color: '#000',
			types: {
				general: {
					text: 'General Feedback',
					icon: '😁'
				},
				idea: {
					text: 'I have an idea',
					icon: '💡'
				},
				bug: {
					text: 'I found an issue',
					icon: '🐞'
				}
			}
		}

		// Parse the provided options and merge with defaults
		this.options = Object.assign({}, defaultOptions, options)

		// Create a new root element for feedback-js to place it's elements in
		const div = document.createElement('div')
		div.id = 'feedback-root'
		document.body.insertBefore(div, document.body.firstChild)
		this.root = div

		// Add a comment to the dom
		const comment = document.createComment('feedback-js modal code')
		document.body.insertBefore(comment, document.body.firstChild)

		// Add the required styles to the page
		this._addStyle()
	}

	/**
	 * Render the default button
	 */
	renderButton() {
		if (!this.root) return

		this.showDefaultBtn = true

		const html = `
			<div class="feedback-btn-wrapper">
				<button id="feedback-btn" title="Give feedback">
					<svg class="inline w-5 h-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z" clip-rule="evenodd"></path></svg>
					<span>${ this.options.btnTitle }</span>
				</button>
			</div>
		`

		this.root.innerHTML = html

		const button = document.getElementById('feedback-btn')
		button.addEventListener('click', () => {
			this.renderModal()
		})
	}

	/**
	 * Render the feedback modal
	 */
	renderModal() {
		if (!this.root) return

		const html = `
			<div class="feedback-wrapper">
				<div class="feedback-main">
					<div class="feedback-header">
						<p>${ this.options.title }</p>
						${ this.options.contactLink.length > 0 ? '<a href=' + this.options.contactLink + '>' + this.options.contactText + '</a>' : '' }
					</div>
					<div class="feedback-content">
						<p>${ this.options.typeMessage }</p>
						<div class="feedback-content-list">
							${ Object.entries(this.options.types).reduce((prev, [ id, item ]) => prev += `<button id="feedback-item-${ id }" class="feedback-item"><span>${ item.icon }</span>${ item.text }</button>`, '') }
						</div>
					</div>
				</div>
				<div class="feedback-close">
					<button id="feedback-close">
						<svg class="w-5 h-5" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M6 18L18 6M6 6l12 12"></path></svg>
					</button>
				</div>
			</div>
		`

		this.root.innerHTML = html

		const button = document.getElementById('feedback-close')
		button.addEventListener('click', () => {
			this.closeModal()
		})

		Object.keys(this.options.types).forEach((id) => {
			const elem = document.getElementById(`feedback-item-${ id }`)

			elem.onclick = () => {
				this.renderForm(id)
			}
		})
	}

	/**
	 * Render the form for the given feedback type.
	 *
	 * The type needs to be specified in the `types` option.
	 * @param {String} type Feedback Type
	 */
	renderForm(type) {
		if (!this.root) return

		const feedbackType = this.options.types[type]

		const html = `
			<div class="feedback-wrapper">
				<div class="feedback-main">
					<div class="feedback-header">
						<p>${ feedbackType.icon } ${ feedbackType.text }</p>
					</div>
					<div class="feedback-content">
							${ this.options.emailField ? `<input id="feedback-email" type="email" name="email" placeholder="${ this.options.emailPlaceholder }">` : '' }
							<textarea id="feedback-message" name="feedback" autofocus type="text" maxlength="500" rows="5" placeholder="${ this.options.inputPlaceholder }"></textarea>
							<div id="feedback-actions" class="feedback-actions">
								<button type="button" id="feedback-back">${ this.options.backText }</button>
								<button type="submit" id="feedback-submit">${ this.options.submitText }</button>
							</div>
					</div>
				</div>
				<div class="feedback-close">
					<button id="feedback-close">
						<svg class="w-5 h-5" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M6 18L18 6M6 6l12 12"></path></svg>
					</button>
				</div>
			</div>
		`

		this.current = type
		this.root.innerHTML = html

		document.getElementById('feedback-message').focus()

		const button = document.getElementById('feedback-close')
		button.addEventListener('click', () => {
			this.closeModal()
		})

		const back = document.getElementById('feedback-back')
		back.addEventListener('click', () => {
			this.renderModal()
		})

		const submit = document.getElementById('feedback-submit')
		submit.addEventListener('click', () => {
			this.submitForm()
		})
	}

	/**
	 * Close/hide the feedback modal.
	 *
	 * If the default button was rendered before, it will be shown again.
	 */
	closeModal() {
		this.root.innerHTML = ''

		if (this.showDefaultBtn) {
			this.renderButton()
		}
	}

	/**
	 * Submit the form.
	 *
	 * Will be called when the user clicks submit.
	 */
	submitForm() {
		const message = document.getElementById('feedback-message').value
		const email = this.options.emailField ? document.getElementById('feedback-email').value : undefined

		const data = {
			id: this.options.id,
			email: email,
			feedbackType: this.current,
			url: window.location.href,
			message: message
		}

		if (this.options.events) {
			const event = new CustomEvent('feedback-submit', { detail: data })
			window.dispatchEvent(event)
			this.renderSuccess()
			return
		}

		this.sendToEndpoint(data)
	}

	/**
	 * Send the given feedback to the specified endpoint.
	 * @param {Object} data - the feedback data
	 */
	sendToEndpoint(data) {
		this.renderLoading()

		const request = new XMLHttpRequest()
		request.open('POST', this.options.endpoint)
		request.setRequestHeader('Content-type', 'application/json')
		request.send(JSON.stringify(data))
		request.onreadystatechange = () => {
			if (request.readyState === 4) {
				if (request.status === 200) {
					return this.renderSuccess()
				}

				this.renderFailed()
			}
		}
	}

	/**
	 * Render the loading state.
	 */
	renderLoading() {
		if (!this.root) return

		const html = `
			<button id="feedback-loading"><div class="feedback-loader"><div></div><div></div><div></div><div></div></div>Loading</button>
		`

		document.getElementById('feedback-actions').innerHTML = html

		const button = document.getElementById('feedback-close')
		button.addEventListener('click', () => {
			this.closeModal()
		})
	}

	/**
	 * Render the success state.
	 */
	renderSuccess() {
		if (!this.root) return

		const html = `
			<div class="feedback-btn-wrapper">
				<button id="feedback-btn" title="Give feedback">
					<span>${ this.options.success }</span>
				</button>
			</div>
		`

		this.root.innerHTML = html

		setTimeout(() => {
			this.renderButton()
		}, 3000)
	}

	/**
	 * Render the failed state.
	 */
	renderFailed() {
		if (!this.root) return

		const html = `
			<div class="feedback-wrapper">
				<div class="feedback-main">
					<div class="feedback-header">
						<p>${ this.options.failedTitle }</p>
					</div>
					<div class="feedback-content">
						<p>${ this.options.failedMessage }</p>
					</div>
				</div>
				<div class="feedback-close">
					<button id="feedback-close">
						<svg class="w-5 h-5" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M6 18L18 6M6 6l12 12"></path></svg>
					</button>
				</div>
			</div>
		`

		this.root.innerHTML = html

		const button = document.getElementById('feedback-close')
		button.addEventListener('click', () => {
			this.closeModal()
		})
	}

	_addStyle() {
		const css = `
			#feedback-root{
				font-family: system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;
			}

			.feedback-wrapper{
				position: fixed;
				z-index: 1000;
				bottom: 0;
				${ this.options.position === 'left' ? 'left: 0' : 'right: 0' };
				margin: 2rem;
				width: 100%;
				max-width: 20rem;
			}

			.feedback-main{
				background-color: ${ this.options.background };
				color: ${ this.options.color };
				border-radius: 0.6rem;
				text-align: center;
				overflow: hidden;
				box-shadow: 0 10px 15px -3px rgba(0,0,0,.1), 0 4px 6px -2px rgba(0,0,0,.05);
			}

			.feedback-header{
				color: ${ this.options.background };
				background-color: ${ this.options.primary };
				padding: 0.8rem 1.25rem;
			}

			.feedback-header p{
				margin: 0;
				font-weight: 600;
				font-size: 1.2rem;
			}

			.feedback-header a{
				margin: 0;
				outline: 0;
				font-size: 1rem;
				margin-top: 0.5rem;
				display: block;
				color: ${ this.options.background };
				border: 2px solid ${ this.options.primary };
				text-decoration: none;
				padding: 5px 10px
			}

			.feedback-header a:hover{
				text-decoration: underline;
			}

			.feedback-header a:focus{
				border: 2px solid ${ this.options.background };
				border-radius: 5px;
			}

			.feedback-content{
				padding: 0.7rem 1.5rem;
				display: flex;
				align-items: center;
				flex-direction: column;
			}

			.feedback-content p{
				margin: 0;
				font-size: 1rem;
				font-weight: 600;
				margin-top: 0.5rem;
				margin-bottom: 0.6rem;
			}

			.feedback-content input{
				border: 3px solid ${ this.options.background };
				filter: brightness(95%);
				border-radius: 10px;
				outline: 0;
				padding: 10px;
				margin-bottom: 0.5rem;
				width: 100%;
				box-sizing: border-box;
				font-size: 1rem;
				font-family: system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;
			}

			.feedback-content textarea{
				overflow: auto;
				border: 3px solid ${ this.options.background };
				filter: brightness(95%);
				border-radius: 10px;
				outline: 0;
				padding: 10px;
				width: 100%;
				box-sizing: border-box;
				resize: none;
				font-size: 1rem;
				font-family: system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;
			}

			.feedback-content textarea:focus,
			.feedback-content input:focus{
				border: 3px solid ${ this.options.primary };
			}

			.feedback-actions{
				display: flex;
				margin-top: 1rem;
				width: 100%;
			}

			.feedback-actions button{
				padding: 0.5rem;
				border-radius: 10px;
				cursor: pointer;
				margin: 0;
				outline: 0;
				border: 3px solid rgba(255, 255, 255, 0);
				appearance: none;
				font-family: system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;
				user-select: none;
				box-shadow: 0 1px 3px 0 rgba(0,0,0,.1);
			}

			.feedback-actions button:focus {
				border: 3px solid ${ this.options.primary };
				filter: brightness(105%);
			}
			
			.feedback-actions button:active {
				transform: scale(0.95);
			}

			#feedback-back{
				background: ${ this.options.background };
				color: rgba(58,71,65);
			}

			#feedback-submit{
				margin-left: auto;
				background: ${ this.options.primary };
				color: ${ this.options.background };
				font-weight: 700;
			}

			#feedback-loading{
				margin-left: auto;
				background: ${ this.options.primary };
				color: ${ this.options.background };
				font-weight: 700;
			}

			.feedback-loader{
				display: inline-block;
				position: relative;
				width: 15px;
				height: 15px;
				margin-right: 1rem;
			}

			.feedback-loader div {
				box-sizing: border-box;
				display: block;
				position: absolute;
				width: 20px;
				height: 20px;
				margin: 0;
				border: 3px solid ${ this.options.background };
				border-radius: 50%;
				animation: feedback-loader 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
				border-color: ${ this.options.background } transparent transparent transparent;
			}

			.feedback-loader div:nth-child(1) {
				animation-delay: -0.45s;
			}

			.feedback-loader div:nth-child(2) {
				animation-delay: -0.3s;
			}

			.feedback-loader div:nth-child(3) {
				animation-delay: -0.15s;
			}

			@keyframes feedback-loader {
				0% {
					transform: rotate(0deg);
				}
				100% {
					transform: rotate(360deg);
				}
			}
			  
			.feedback-content-list{
				display: flex;
				flex-direction: column;
				align-items: flex-start;
				margin-left: auto;
				margin-right: auto;
				margin-bottom: 1rem;
			}

			.feedback-item {
				width: 100%;
				cursor: pointer;
				user-select:none;
				border:0;
				outline: 0;
				background: 0;
				font-size: 0.9rem;
				text-align: left;
				display: flex;
				align-items: center;
				flex-direction: row;
				color: ${ this.options.color };
				background-color: ${ this.options.background };
				border: 2px solid ${ this.options.background };
				border-radius: 10px;
				padding: 10px;
			}

			.feedback-item:hover{
				filter: brightness(95%);
			}

			.feedback-item:focus{
				border: 2px solid ${ this.options.primary };
				border-radius: 5px;
			}

			.feedback-item span{
				width: 1.5rem;
				margin-right: 0.2rem;
				display: block;
				text-align: center;
			}

			.feedback-close{
				margin-top: .75rem;
				display: flex;
				align-items: center;
				justify-content: ${ this.options.position === 'left' ? 'flex-start' : 'flex-end' };
				flex-direction: row;
			}

			.feedback-close button{
				box-shadow: 0 10px 15px -3px rgba(0,0,0,.1), 0 4px 6px -2px rgba(0,0,0,.05);
				cursor: pointer;
				user-select:none;
				border:0;
				outline: 0;
				border-radius: 9999px;
				padding: .5rem;
				background: ${ this.options.background };
				color: ${ this.options.color };
				border: 2px solid ${ this.options.background };
			}

			.feedback-close button:focus{
				border: 2px solid ${ this.options.primary };
			}

			.feedback-close button:hover{
				filter: brightness(95%);
			}

			.feedback-close button:active {
				transform: scale(0.95);
			}

			.feedback-close svg{
				display: block;
				width: 1.25rem;
				height: 1.25rem;
			}

			.feedback-btn-wrapper{
				position: fixed;
				z-index: 1000;
				bottom: 0;
				${ this.options.position === 'left' ? 'left: 0' : 'right: 0' };
				margin: 2rem;
			}

			#feedback-btn{
				height: 30px;
				display: flex;
				align-items: center;
				padding: 1.2rem 0.7rem;
				border-radius: 0.4rem;
				cursor: pointer;
				box-shadow: 0 10px 15px -3px rgba(0,0,0,.1), 0 4px 6px -2px rgba(0,0,0,.05);
				user-select:none;
				border:0;
				outline: 0;
				color: ${ this.options.background };
				background-color: ${ this.options.primary };
				transition: filter .4s ease;
			}

			#feedback-btn:hover, #feedback-btn:focus{
				filter: brightness(105%);
			}

			#feedback-btn:active {
				transform: scale(0.95);
			}

			#feedback-btn svg{
				width: 1.25rem;
				height: 1.25rem;
			}

			#feedback-btn span{
				font-weight: 700;
				font-size: 1rem;
				margin-left: .5rem;
			}
		`

		const comment = document.createComment('feedback-js stylesheet')
		document.head.appendChild(comment)

		const styleElement = document.createElement("style")
		styleElement.innerHTML = css  
		document.head.appendChild(styleElement)
	}
}
