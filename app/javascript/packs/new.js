import { RecordRTCPromisesHandler } from "recordrtc"

// https://github.com/muaz-khan/RecordRTC
document.addEventListener('DOMContentLoaded', () => {
    // Store a reference of the preview video element and a global reference to the recorder instance
    var video = document.getElementById('preview');
    var recorder;

    // When the user clicks on start video recording
    document.getElementById('face-regist').addEventListener("click", function(){
        // Request access to the media devices
        navigator.mediaDevices.getUserMedia({
            audio: false,
            video: true
        }).then(function(stream) {
            // Display a live preview on the video element of the page
            video.srcObject = stream;

            // Start to display the preview on the video element
            // and mute the video to disable the echo issue !
            video.play();
            video.muted = true;

            // Initialize the recorder
            recorder = new RecordRTCPromisesHandler(stream, { mimeType: 'video/webm' });

            // Start recording the video
            recorder.startRecording().then(function() {
                console.info('Recording video ...');
            }).catch(function(error) {
                console.error('Cannot start video recording: ', error);
            });

            // release stream on stopRecording
            recorder.stream = stream;
        }).then(function() {
            setTimeout(() => {
                recorder.stopRecording().then(function() {
                    console.info('stopRecording success');

                    // Retrieve recorded video as blob and display in the preview element
                    let result = {}
                    recorder.getBlob().then((re) => {
                    }).then(() => {
                      recorder.getDataURL().then((re) => {
                        result.data = re
                      }).then(() => {
                        result.name = $("#name").val()
                        result.company_id = $("#company_id").val()
                        result.nfc_id = $("#nfc_id").val()
                        sendToServer(result)
                      })
                    })

                    recorder.stream.stop()
                })
            }, 6000)
        }).catch(function(error) {
            console.error("Cannot access media devices: ", error);
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
    success: () => {console.log("saved")},
    error: (res) => {errorHandler(res.responseJSON)}
  })
}
// https://jsfiddle.net/9b2e1p0t/2/

function errorHandler(errors) {
    // 1. close modal
    $("[data-dismiss=modal]").trigger({ type: "click" });
    // 2. show error message
    console.log(errors)
}