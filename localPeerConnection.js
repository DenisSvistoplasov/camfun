var localStream, localPeerConnection, remotePeerConnection;
var localVideo = document.getElementById("localVideo");
var remoteVideo = document.getElementById("remoteVideo");
var startButton = document.getElementById("startButton");
var callButton = document.getElementById("callButton");
var hangupButton = document.getElementById("hangupButton");

startButton.disabled = false;
callButton.disabled = true;
hangupButton.disabled = true;

startButton.onclick = start;
callButton.onclick = call;
hangupButton.onclick = hangup;

function log(text) {
	console.log("At time: " + (performance.now() / 1000).toFixed(3) + " --> " + text);
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

function call() {
	callButton.disabled = true;
	hangupButton.disabled = false;
	log("Starting call");
	if (navigator.webkitGetUserMedia) {
		if (localStream.getVideoTracks().length > 0) {
			log('Using video device: ' + localStream.getVideoTracks()[0].label);
		}
		if (localStream.getAudioTracks().length > 0) {
			log('Using audio device: ' + localStream.getAudioTracks()[0].label);
		}
	}
	if (navigator.webkitGetUserMedia) {
		RTCPeerConnection = webkitRTCPeerConnection;
	} else if(navigator.mozGetUserMedia){
		RTCPeerConnection = mozRTCPeerConnection;
		RTCSessionDescription = mozRTCSessionDescription;
		RTCIceCandidate = mozRTCIceCandidate;
	}
	log("RTCPeerConnection object: " + RTCPeerConnection);
	var servers = null;
	localPeerConnection = new RTCPeerConnection(servers);
	log("Created local peer connection object localPeerConnection");
	localPeerConnection.onicecandidate = gotLocalIceCandidate;
	remotePeerConnection = new RTCPeerConnection(servers);
	log("Created remote peer connection object remotePeerConnection");
	remotePeerConnection.onicecandidate = gotRemoteIceCandidate;
	remotePeerConnection.onaddstream = gotRemoteStream;
	localPeerConnection.addStream(localStream);
	log("Added localStream to localPeerConnection");
	localPeerConnection.createOffer(gotLocalDescription, onSignalingError);
}

function onSignalingError(error){
	console.log('Failed to create signaling message : ' + error.name);
}

function gotLocalDescription(description){
	localPeerConnection.setLocalDescription(description);
	log("Offer from localPeerConnection: \n" + description.sdp);
	remotePeerConnection.setRemoteDescription(description);
	remotePeerConnection.createAnswer(gotRemoteDescription, onSignalingError);
}

function gotRemoteDescription(description){
	remotePeerConnection.setLocalDescription(description);
	log("Answer from remotePeerConnection: \n" + description.sdp);
	localPeerConnection.setRemoteDescription(description);
}

function hangup() {
	log("Ending call");
	localPeerConnection.close();
	remotePeerConnection.close();
	localPeerConnection = null;
	remotePeerConnection = null;
	hangupButton.disabled = true;
	callButton.disabled = false;
}

function gotRemoteStream(event){
	if (window.URL) {
		remoteVideo.src = window.URL.createObjectURL(event.stream);
	} else {
		remoteVideo.src = event.stream;
	}
	log("Received remote stream");
}

function gotLocalIceCandidate(event){
if (event.candidate) {
// Add candidate to the remote PeerConnection
remotePeerConnection.addIceCandidate(new RTCIceCandidate(event.candidate));
log("Local ICE candidate: \n" + event.candidate.candidate);
}
}
// Handler to be called whenever a new remote ICE candidate becomes available
function gotRemoteIceCandidate(event){
	if (event.candidate) {
		localPeerConnection.addIceCandidate(new RTCIceCandidate(event.candidate));
		log("Remote ICE candidate: \n " + event.candidate.candidate);
	}
}