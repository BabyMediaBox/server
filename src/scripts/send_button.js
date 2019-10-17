const request = require('request');
const Config = require('./../../config.json');

if(!process.argv[2])
{
	console.log("provide a button number: 1-7");
	process.exit();
}

let buttonNumber = process.argv[2];

let requestData = {
	url : `http://localhost:${Config.port}/button/${buttonNumber}`
};

console.log("sending button", buttonNumber);

request.post( requestData, function(err, httpResponse, body) {

	if( err )
	{
		console.log('error on button press request', err);
	}
	else
	{
		console.log("->", httpResponse);
	}
});
