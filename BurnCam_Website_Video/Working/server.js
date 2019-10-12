// Server.js:  This is the core Node.js configuration code, and also used for
// Setting up signaling channels to be used by socket.io

// Import express.io
var express = require('express.io');				


/*
Express is a Node.js framework that handles web servers, sending/receiving signals,
setting up routes etc. It makes 
For more information, see https://www.programwitherik.com/getting-started-with-node-express/

Socket.io enables real time event-based communication between one or more clients and
a server over all platforms. It uses WebSockets. 
For more information, see https://www.programwitherik.com/getting-started-with-socket-io-node-js-and-express/

express.io is a combination of the two. 
*/

var app = express();								// Create express object
app.http().io();									// Builds realtime web app
var PORT = 3000;									// Generate port for local host
console.log('server started on port ' + PORT);		// Logs successful server startup on port

app.use(express.static(__dirname + '/public'));		// 

app.get('/', function(req, res){ 					//
	res.render('index.ejs');						// Starts on the index page
});

app.listen(process.env.PORT || PORT);				// Server will listen on port 3000 (local) or whatever port the web host uses

app.io.route('signal', function(req) {				// Set up signal route
	req.io.join(req.data)
	app.io.room(req.data).broadcast('signal', {		// Broadcast on socket.io room of the same name 'signal'
		user_type: req.data.user_type,				// Indicates if this is a message from patient or doc
		user_name: req.data.user_name,				// Pass user name
		user_data: req.data.user_data,				// Pass all other data
		command: req.data.command					
	})
})