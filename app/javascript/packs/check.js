import { RecordRTCPromisesHandler } from "recordrtc"

// https://github.com/muaz-khan/RecordRTC
document.addEventListener('DOMContentLoaded', () => {
  // Store a reference of the preview video element and a global reference to the recorder instance
  const video = document.getElementById('preview')
  let recorder

  // When the user clicks on start video recording
  document.getElementById('face-check').addEventListener("click", (e) => {
    if ($("#email").val() == "") {
      e.stopPropagation()
      e.preventDefault()
      $("#email_error").text("This is required field.")
    } else {
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
        setTimeout(() => {
          $(".recording").addClass("d-none")
          recorder.stopRecording().then(() => {
            let result = {}
            recorder.getBlob().then(() => {
              recorder.getDataURL().then((re) => {
                result.data = re
              }).then(() => {
                result.email = $("#email").val()
                sendToServer(result)
              })
            })
            console.info('stopRecording success')
            recorder.stream.stop()
          })
        }, 4000)
      }).catch((error) => console.error("Cannot access media devices: ", error))
    }
  }, false)
})

function sendToServer(json) {
  $.ajax({
    type: "POST",
    url: "/check",
    beforeSend: (xhr) => {
      xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))
      $('.loading-bg').removeClass('d-none')
    },
    complete: () => $('.loading-bg').addClass('d-none'),
    data: json,
    success: (res) => {
      const accurate = !!res.accurate ? `(${res.accurate}%)` : ""
      const txt = `${res.name} ${accurate}`
      alert(txt)
      $('.loading-bg').addClass('d-none')
      $("[data-dismiss=modal]").trigger({ type: "click" })
    },
  })
}
