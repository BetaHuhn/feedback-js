<div align="center">

# feedback-js

[![Build](https://github.com/BetaHuhn/feedback-js/workflows/Build/badge.svg)](https://github.com/BetaHuhn/feedback-js/actions?query=workflow%3ABuild) [![GitHub](https://img.shields.io/github/license/mashape/apistatus.svg)](https://github.com/BetaHuhn/feedback-js/blob/master/LICENSE) ![David](https://img.shields.io/david/betahuhn/feedback-js) [![npm](https://img.shields.io/npm/v/@betahuhn/feedback-js)](https://www.npmjs.com/package/@betahuhn/feedback-js) [![npm bundle size](https://img.badgesize.io/betahuhn/feedback-js/master/dist/feedback-js.min.js?compression=gzip)](https://github.com/BetaHuhn/feedback-js)

Simple self-hosted feedback modal for any website

![preview](https://cdn.mxis.ch/assets/feedback-js/preview.gif)

[🔮 Live Demo]()
<br/>

</div>

## 👋 Introduction

[feedback-js](https://github.com/BetaHuhn/feedback-js) lets you add a feedback modal to any website. Just include the script below to your website and run the [example]() Node.js server to handle the form submission.

## 🚀 Get started

### JSDelivr

Add this to your HTML page:

```html
<script src="https://cdn.jsdelivr.net/npm/feedback-js/dist/feedback-js.min.js"></script>
<script>
    function addFeedback() {
        const options = {
            id: 'example', // id to identify the form on the backend
            endpoint: 'https://example.com/feedback' // enpoint of your backend to handle the submission
        }
        
        new Feedback(options).attach();
    }
    window.addEventListener('load', addFeedback);
</script>
```

### NPM

Install [feedback-js](https://github.com/BetaHuhn/feedback-js) using NPM

```sh
npm install feedback-js
```

Then add the following JavaScript code:

```javascript
import Feedback from 'feedback-js';

const options = {
    id: 'example', // id to identify the form on the backend
    endpoint: 'https://example.com/feedback' // enpoint of your backend to handle the submission
}

new Feedback(options).attach();
```

By default [feedback-js](https://github.com/BetaHuhn/feedback-js) will add a feedback button to the bottom right corner of your page with the default colors and text. This can be configured using the [options](https://github.com/BetaHuhn/feedback-js#options) object.

## 📚 Setup

If you include [feedback-js](https://github.com/BetaHuhn/feedback-js) via the cdn or as an npm package and run: 

```js
const options = {
    id: 'example', // id to identify the form on the backend
    endpoint: 'https://example.com/feedback' // enpoint of your backend to handle the submission
}

new Feedback(options).attach();
```

[feedback-js](https://github.com/BetaHuhn/feedback-js) will automatically add the feedback form to your page.

You will have to handle the submission on the backend yourself. [feedback-js](https://github.com/BetaHuhn/feedback-js) will make a POST request to your specified endpoint with the following body:

```json
{
    "id": "example",
    "email": "hello@mxis.ch",
    "feedbackType": "issue",
    "url": "https://example.com",
    "message": "When I click x nothing happens."
}
```

Node.js example:

```js
const express = require('express')
const app = express()
const port = 3000

app.post('/feedback', async (req, res) => {
	const { id, feedbackType, message, email, url } = req.body

	console.log(`New ${ feedbackType } feedback for form ${ id } from user ${ email } on page ${ url }: ${ message }`)
	// do something with feedback

	res.send('ok')
})

app.listen(port, () => {
	console.log(`Listening at http://localhost:${ port }`)
})
```

## 🛠️ Manuall usage

If you don't want to show the button and send feedback programatically you can use the method `sendFeedback()`:

```javascript
const feedback = new Feedback(options);
feedback.send('feedbackType', 'message', 'url', 'email');
```

## ⚙️ Options

You can customize [feedback-js](https://github.com/BetaHuhn/feedback-js) by passing a options object to `new Feedback()`:

```js
const options = {
    id: 'feedback', // id to identify the form on the backend
    endpoint: 'https://example.com/feedback', // enpoint of your backend to handle the submission
    emailField: true, // show email input field, default: false
    btnTitle: 'Feedback', // title of button
    title: 'Company Feedback', // text at the top
    contactText: 'Or send an email!', // text for other contact option
    contactLink: 'mailto:hello@mxis.ch', // link for other contact option
    typeMessage: 'What feedback do you have?', // message for selecting feedback type
    success: 'Thanks! 👊', // message displayed on successfull submission
    failedTitle: 'Oops, an error ocurred!', // title displayed on error
    failedMessage: 'Please try again. If this keeps happening, try to send an email instead.', // default error message if backend doesn't return one
    position: 'right', // position of button lef/right
    primary: 'rgb(53, 222, 118)', // primary color
    background: '#fff', // background color
    color: '#000' // font color
}

const feedback = new Feedback(options);
feedback.attach();
```

## 💻 Development

Issues and PRs are very welcome!

The actual source code of this library is in the `feedback.js` file in the `src` folder.

- run `yarn lint` or `npm run lint` to run eslint.
- run `yarn watch` or `npm run watch` to watch for changes and build to the `dist` folder.
- run `yarn build` or `npm run build` to produce a production version of [feedback-js](https://github.com/BetaHuhn/feedback-js) in the `dist` folder.

## ❔ About

This library was developed by me ([@betahuhn](https://github.com/BetaHuhn)) in my free time. If you want to support me:

[![Donate via PayPal](https://img.shields.io/badge/paypal-donate-009cde.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=394RTSBEEEFEE)

### Credits

The design of the feedback form was inspired by [@kangabru's](https://github.com/kangabru/) feedback form on the [Panda Snap](https://pandasnap.io/) dashboard.

### License

Copyright 2020 Maximilian Schiller

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
