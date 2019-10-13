//Server.js:  This is the core Node.js configuration code, and also used for
//setting up signaling channels to be used by socket.io

var express = require('express.io');				// Import express.io

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
	res.render('index.ejs');						//
});

app.listen(process.env.PORT || PORT);				// Server will listen on port 3000 (local) or whatever port the web host uses

app.io.route('signal', function(req) {
	req.io.join(req.data)
	app.io.room(req.data).broadcast('signal', {
		user_type: req.data.user_type,
		user_name: req.data.user_name,
		user_data: req.data.user_data,
		command: req.data.command
	})
})