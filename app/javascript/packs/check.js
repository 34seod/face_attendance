document.addEventListener('DOMContentLoaded', () => {
  navigator.mediaDevices.getUserMedia({ video: true }).then(function (stream) {
    const video = document.querySelector('#videoElement')
    const btn = document.querySelector('#face-check')
    video.srcObject = stream
    btn.onclick = function() {
      takeSnapshot(video)
    }
  }).catch(function (err0r) {
    console.log(err0r)
  })
})

function takeSnapshot(video) {
  let context
  const width = video.offsetWidth
  const height = video.offsetHeight

  canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height

  context = canvas.getContext('2d')
  context.drawImage(video, 0, 0)
  const dataUrl = canvas.toDataURL('image/jpg')
  sendToServer(dataUrl)
}

function sendToServer(dataUrl) {
  $.ajax({
    type: "POST",
    url: "/check",
    beforeSend: function(xhr) {xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))},
    data: {data: dataUrl},
    success: (res) => {alert(`${res.name} (${res.accurate}%)`)}
  })
}
