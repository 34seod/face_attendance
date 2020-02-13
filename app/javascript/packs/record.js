// https://github.com/muaz-khan/RecordRTC
document.addEventListener('DOMContentLoaded', () => {
    // Store a reference of the preview video element and a global reference to the recorder instance
    var video = document.getElementById('my-preview');
    var recorder;

    // When the user clicks on start video recording
    document.getElementById('btn-start-recording').addEventListener("click", function(){
        // Disable start recording button
        this.disabled = true;

        // Request access to the media devices
        navigator.mediaDevices.getUserMedia({
            audio: false,
            video: true
        }).then(function(stream) {
            // Display a live preview on the video element of the page
            setSrcObject(stream, video);

            // Start to display the preview on the video element
            // and mute the video to disable the echo issue !
            video.play();
            video.muted = true;

            // Initialize the recorder
            recorder = new RecordRTCPromisesHandler(stream, {
                mimeType: 'video/webm',
            });

            // Start recording the video
            recorder.startRecording().then(function() {
                console.info('Recording video ...');
            }).catch(function(error) {
                console.error('Cannot start video recording: ', error);
            });

            // release stream on stopRecording
            recorder.stream = stream;

            // Enable stop recording button
            document.getElementById('btn-stop-recording').disabled = false;
        }).catch(function(error) {
            console.error("Cannot access media devices: ", error);
        });
    }, false);

    // When the user clicks on Stop video recording
    document.getElementById('btn-stop-recording').addEventListener("click", function(){
        this.disabled = true;

        recorder.stopRecording().then(function() {
            console.info('stopRecording success');

            // Retrieve recorded video as blob and display in the preview element
            let result = {}
            recorder.getBlob().then((re) => {
              // result.blob = re
            }).then(() => {
              recorder.getDataURL().then((re) => {
                result.data = re
              }).then((re) => {
                console.log(result)
                sendToServer(result)
              })
            })



            // Stop the device streaming
            recorder.stream.stop()

            // Enable record button again !

            document.getElementById('btn-start-recording').disabled = false;
        }).catch(function(error) {
            console.error('stopRecording failure', error);
        });
    }, false);
})

// https://stackoverflow.com/questions/7203304/warning-cant-verify-csrf-token-authenticity-rails
function sendToServer(json) {
  $.ajax({
    type: "POST",
    url: "/save",
    beforeSend: function(xhr) {xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))},
    data: json,
    success: () => {console.log("saved")}
  })
}
// https://jsfiddle.net/9b2e1p0t/2/