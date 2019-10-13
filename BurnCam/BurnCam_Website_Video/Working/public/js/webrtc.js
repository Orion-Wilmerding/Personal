
////////SIGNALING CODE/////////////
io = io.connect();	// Tell socket.io to connect to the server
var myName = ""; // Declare global scope variable to hold names
var theirName = "";
var myUserType = "";

// VIDEO CONNECTION
var configuration = {
	'iceServers': [{
		'url': 'stun:stun.l.google.com:19302' // DO NOT GO TO PRODUCTION WITH THIS SERVER
	}]
};
var rtcPeerConn;
var mainVideoArea = document.querySelector("#mainVideoTag");
var smallVideoArea = document.querySelector("#smallVideoTag");

// CHAT
var dataChannelOptions = {
	ordered: false, //no guaranteed delivery, unreliable but faster 
	maxRetransmitTime: 1000, //milliseconds
};
var dataChannel;

// Case #1, a doctor joins the room. Change HTML & CSS to show this
io.on('signal', function(data) { 
	if (data.user_type == "doctor" && data.command == "joinroom") {
		console.log("The doctor is here!");
		if (myUserType == "patient") {
			theirName = data.user_name; // Store name
			document.querySelector("#messageOutName").textContent = theirName;
			document.querySelector("#messageInName").textContent = myName;
		}
		//Switch to the doctor listing
		document.querySelector("#requestDoctorForm").style.display = 'none';
		document.querySelector("#waitingForDoctor").style.display = 'none';
		document.querySelector("#doctorListing").style.display = 'block';
	}
	// Case #2, a patient joins the room Change HTML & CSS to show this
	else if (data.user_type == "patient" && data.command == "calldoctor") {
		console.log("Patient is calling");
		if (myUserType == "doctor") {
			theirName = data.user_name; // Store name
			document.querySelector("#messageOutName").textContent = theirName;
			document.querySelector("#messageInName").textContent = myName;
		}
		document.querySelector("#doctorSignup").style.display = 'none';
		document.querySelector("#videoPage").style.display = 'block';
	}
	else if (data.user_type == 'signaling') {
		if (!rtcPeerConn) startSignaling();
		var message = JSON.parse(data.user_data);
		if (message.sdp) {
			rtcPeerConn.setRemoteDescription(new RTCSessionDescription(message.sdp), function () {
				// if we received an offer, we need to answer
				if (rtcPeerConn.remoteDescription.type == 'offer') {
					rtcPeerConn.createAnswer(sendLocalDesc, logError);
				}
			}, logError);
		}
		else {
			rtcPeerConn.addIceCandidate(new RTCIceCandidate(message.candidate));
		}
	}
}); 


function startSignaling() {
	console.log("starting signaling...");
	rtcPeerConn = new webkitRTCPeerConnection(configuration);
//	dataChannel = rtcPeerConn.createDataChannel('textMessages'); // For some reason, the dataChannelOptions breaks this. Use defaults
//	dataChannel = rtcPeerConn.createDataChannel('textMessages', dataChannelOptions);
				
//	dataChannel.onopen = dataChannelStateChanged;
//	rtcPeerConn.ondatachannel = receiveDataChannel;
	
	// send any ice candidates to the other peer
	// When successful, use STUN/Turn servers to establish direct p2p connection
	rtcPeerConn.onicecandidate = function (evt) {
		if (evt.candidate)
			io.emit('signal',{
				"user_type":"signaling", 
				"command":"icecandidate", 
				"user_data": JSON.stringify({ 'candidate': evt.candidate 
			})});
		console.log("completed sending an ice candidate...");
	};
	
	// let the 'negotiationneeded' event trigger offer generation
	rtcPeerConn.onnegotiationneeded = function () {
		console.log("on negotiation called");
		rtcPeerConn.createOffer(sendLocalDesc, logError);
	};
	
	// once remote stream arrives, show it in the main video element
	rtcPeerConn.onaddstream = function (evt) {
		console.log("going to add their stream...");
		mainVideoArea.srcObject = evt.stream; //
		//mainVideoArea.src = URL.createObjectURL(evt.stream); // This code is depreciated
	};
	
	// get a local stream, show it in our video tag and add it to be sent
	navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
	navigator.getUserMedia({
		'audio': false,
		'video': true
	}, function (stream) {
		console.log("going to display my stream...");
		smallVideoArea.srcObject = stream; // Simplify to srcObject = stream and everything works
		//smallVideoArea.src = URL.createObjectURL(stream); // This code is depreciated
		rtcPeerConn.addStream(stream);
	}, logError);
			  
}

function sendLocalDesc(desc) {
	rtcPeerConn.setLocalDescription(desc, function () {
		console.log("sending local description");
		io.emit('signal',{"user_type":"signaling", "command":"SDP", "user_data": JSON.stringify({ 'sdp': rtcPeerConn.localDescription })});
	}, logError);
}
			
function logError(error) {
}


//////////MUTE/PAUSE STREAMS CODE////////////
var muteMyself = document.querySelector("#muteMyself");
var pauseMyVideo = document.querySelector("#pauseMyVideo");

muteMyself.addEventListener('click', function(ev){
	console.log("muting/unmuting myself");
	var streams = rtcPeerConn.getLocalStreams();
	for (var stream of streams) {
		for (var audioTrack of stream.getAudioTracks()) {
			if (audioTrack.enabled) { muteMyself.innerHTML = "Unmute" }
			else { muteMyself.innerHTML = "Mute Myself" }
			audioTrack.enabled = !audioTrack.enabled;
		}
		console.log("Local stream: " + stream.id);
	}
	ev.preventDefault();
}, false);

pauseMyVideo.addEventListener('click', function(ev){
	console.log("pausing/unpausing my video");
	var streams = rtcPeerConn.getLocalStreams();
	for (var stream of streams) {
		for (var videoTrack of stream.getVideoTracks()) {
			if (videoTrack.enabled) { pauseMyVideo.innerHTML = "Start Video" }
			else { pauseMyVideo.innerHTML = "Pause Video" }
			videoTrack.enabled = !videoTrack.enabled;
		}
		console.log("Local stream: " + stream.id);
	}
	ev.preventDefault();
}, false);

/////////////Data Channels Code///////////
var messageHolder = document.querySelector("#messageHolder");
var myMessage = document.querySelector("#myMessage");
var sendMessage = document.querySelector("#sendMessage");

function dataChannelStateChanged() {
	if (dataChannel.readyState === 'open') {
		console.log("Data Channel open");
		dataChannel.onmessage = receiveDataChannelMessage;
	}
}

function receiveDataChannel(event) {
	console.log("Receiving a data channel");
	dataChannel = event.channel;
	dataChannel.onmessage = receiveDataChannelMessage;
}

function receiveDataChannelMessage(event) {
	console.log("From DataChannel: " + event.data);
	appendChatMessage(event.data, 'message-out');
}

sendMessage.addEventListener('click', function(ev){
	dataChannel.send(myMessage.value);
	appendChatMessage(myMessage.value, 'message-in');
	myMessage.value = "";
	ev.preventDefault();
}, false);

function appendChatMessage(msg, className) {
	var div = document.createElement('div');
	div.className = className;
	div.innerHTML = '<span>' + msg + '</span>';
	messageHolder.appendChild(div);
}