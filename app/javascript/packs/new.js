import { RecordRTCPromisesHandler } from "recordrtc"

// https://github.com/muaz-khan/RecordRTC
document.addEventListener('DOMContentLoaded', () => {
  // Store a reference of the preview video element and a global reference to the recorder instance
  const video = document.getElementById('preview')
  let recorder

  // When the user clicks on start video recording
  document.getElementById('face-regist').addEventListener("click", () => {
    // Request access to the media devices
    navigator.mediaDevices.getUserMedia({ audio: false, video: true }).then((stream) => {
      // Display a live preview on the video element of the page
      video.srcObject = stream
      // Start to display the preview on the video element
      // and mute the video to disable the echo issue !
      video.play()
      video.muted = true
      // Initialize the recorder
      recorder = new RecordRTCPromisesHandler(stream, { mimeType: 'video/webm' })
      // Start recording the video
      recorder.startRecording()
              .then(() => console.info('Recording video ...'))
              .catch((error) => console.error('Cannot start video recording: ', error))
      // release stream on stopRecording
      recorder.stream = stream
    }).then(() => {
      const recordingTime = 10
      let intervalTime = recordingTime + 1
      const interval = setInterval(() => {
        intervalTime--
        $("#timer").html(`Recording ${intervalTime}`)
      }, 1000)
      setTimeout(() => {
        clearInterval(interval)
        $("#timer").html("")
        $(".recording").addClass("d-none")
        recorder.stopRecording().then(() => {
          let result = {}
          recorder.getBlob().then(() => {
            recorder.getDataURL().then((re) => {
              result.data = re
            }).then(() => {
              result.name = $("#name").val()
              result.email = $("#email").val()
              sendToServer(result)
            })
          })
          console.info('stopRecording success')
          recorder.stream.stop()
        })
      }, recordingTime * 1000)
    }).catch((error) => console.error("Cannot access media devices: ", error))
  }, false)
})

// https://stackoverflow.com/questions/7203304/warning-cant-verify-csrf-token-authenticity-rails
function sendToServer(json) {
  $.ajax({
    type: "POST",
    url: "/save",
    beforeSend: (xhr) => {
      xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))
      $('.loading-bg').removeClass('d-none')
    },
    complete: () => $('.loading-bg').addClass('d-none'),
    data: json,
    success: () => {console.log("saved")},
    error: (res) => {
      $('.loading-bg').addClass('d-none')
      errorHandler(res.responseJSON)
    }
  })
}
// https://jsfiddle.net/9b2e1p0t/2/

function errorHandler(errors) {
  // 1. close modal
  $("[data-dismiss=modal]").trigger({ type: "click" })
  // 2. show error message
  $("#name_error").text(errors.name || "")
  $("#email_error").text(errors.email || "")
}
