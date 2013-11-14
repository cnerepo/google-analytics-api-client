google-analytics-api-client
===========================

A simple front-end HTML/JS based interface for the Google Analytics API.

#### Installation
1. Clone this repo and its HTML/JS files into the serving directory of any web server.
2. Create a `secrets.js` file in the `js` directory, which will contain your authentication information:

  ```javascript
  /**
  * Authorization information. This should be obtained through the Google APIs
  * developers console. https://code.google.com/apis/console/
  * Also there is more information about how to get these in the authorization
  * section in the Google JavaScript Client Library.
  * https://code.google.com/p/google-api-javascript-client/wiki/Authentication
  */
  window.clientId = 'yourapp.apps.googleusercontent.com'; // Your client ID
  window.apiKey = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'; // Your API Key

Then start your web server and navigate to any of the `.html` files in the root.

#### Usage
The interface queries the Management API via the Google javascript client.

1. Authenticate using OAuth via the Authorize button.
2. Select the web property and profile you wish to work with from the dropdowns.
3. Then run the query of your choosing below.

#### Notes

This client uses the following plugins:
 - Google API Javascript Client: https://code.google.com/p/google-api-javascript-client/
 - jQuery 2.0.3: http://jquery.com/
 - CodeMirror (for pretty syntax highlighting): http://codemirror.net/
 - JS-Beautify (for auto-expanding JSON results): https://github.com/einars/js-beautify
