var localStream, localPeerConnection, remotePeerConnection;

var localVideo = document.getElementById("localVideo");
var remoteVideo = document.getElementById("remoteVideo");

var startButton = document.getElementById("startButton");
var hangupButton = document.getElementById("hangupButton");

startButton.disabled = false;
hangupButton.disabled = true;

startButton.onclick = start;
hangupButton.onclick = hangup;

function log(text) {
	console.log("At time: " + (performance.now() / 1000).toFixed(3) + " --> " + text);
}

function start() {
	log("Requesting local stream");
	startButton.disabled = true;
	navigator.getUserMedia = navigator.getUserMedia ||
	navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
	navigator.getUserMedia({audio:true, video:true}, successCallback,
	function(error) {
		log("navigator.getUserMedia error: ", error);
	});
}

function successCallback(stream){
	log("Received local stream");
	if (window.URL) {
		localVideo.src = URL.createObjectURL(stream);
	} else {
		localVideo.src = stream;
	}
	localStream = stream;
	callButton.disabled = false;
}