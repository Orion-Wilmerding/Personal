/*
This code was developed by @ArinSime and AgilityFeat for an O'Reilly video course on WebRTC basics.  

You are welcome to use it at your own risk as starter code for your applications, 
but please be aware that this is not a complete code example with all the necessary 
security and privacy considerations implemented that a production app would require.  

It is for educational purposes only, and any other use is done at your own risk.
*/

//webrtc.js:  This is where we will put the bulk of the webrtc related code

////////SIGNALING CODE/////////////
io = io.connect();
var myName = "";
var theirName = "";
var myUserType = "";

io.on('signal', function(data) {
	if (data.user_type == "doctor" && data.command == "joinroom") {
		console.log("The doctor is here!");
		if (myUserType == "patient") {
			theirName = data.user_name;
			document.querySelector("#messageOutName").textContent = theirName;
			document.querySelector("#messageInName").textContent = myName;
		}
		//Switch to the doctor listing
		document.querySelector("#requestDoctorForm").style.display = 'none';
		document.querySelector("#waitingForDoctor").style.display = 'none';
		document.querySelector("#doctorListing").style.display = 'block';
	}
	else if (data.user_type == "patient" && data.command == "calldoctor") {
		console.log("Patient is calling");
		if (myUserType == "doctor") {
			theirName = data.user_name;
			document.querySelector("#messageOutName").textContent = theirName;
			document.querySelector("#messageInName").textContent = myName;
		}
		document.querySelector("#doctorSignup").style.display = 'none';
		document.querySelector("#videoPage").style.display = 'block';
	}
}); 
