import { RecordRTCPromisesHandler } from "recordrtc"

document.addEventListener('DOMContentLoaded', () => {
  const btn = document.querySelector('#face-check')
  const video = document.querySelector('#videoElement')
  let recorder

  navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
    video.srcObject = stream
    video.play()
    video.muted = true
    recorder = new RecordRTCPromisesHandler(stream, { mimeType: 'video/webm' })
    btn.onclick = () => takeSnapshot(recorder, stream)
  }).catch((err0r) => console.log(err0r))
})

function takeSnapshot(recorder, stream) {
  // Start recording the video
  recorder.startRecording().then(() => {
      console.info('Recording video ...')
  }).catch((error) => console.error('Cannot start video recording: ', error))

  // release stream on stopRecording
  recorder.stream = stream

  setTimeout(() => {
    recorder.stopRecording().then(() => {
      console.info('stopRecording success')

      // Retrieve recorded video as blob and display in the preview element
      let result = {}
      recorder.getBlob().then(() => {
        recorder.getDataURL().then((re) => {
          result.data = re
          result.email = $("#email").val()
          sendToServer(result)
        })
      })
      // recorder.stream.stop()
    })
  }, 1500)
}

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
    success: (res) => {alert(`${res.name} (${res.accurate}%)`)}
  })
}
