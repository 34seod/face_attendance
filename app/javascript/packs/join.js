
document.addEventListener('DOMContentLoaded', () => {
  navigator.mediaDevices.getUserMedia({ video: true })
  .then(function (stream) {
      const video = document.querySelector('#videoElement');
      const btn = document.querySelector('#btn1');
      video.srcObject = stream;
      btn.onclick = function() {
        // takeSnapshot(video)
        const take = setInterval(() => takeSnapshot(video), 42);
        setTimeout(() => clearInterval(take), 3000)
      }
    })
    .catch(function (err0r) {
      console.log(err0r)
    });
});

function takeSnapshot(video) {
  // const img = document.createElement('img');
  let context;
  const width = video.offsetWidth;
  const height = video.offsetHeight;

  canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  context = canvas.getContext('2d');
  context.drawImage(video, 0, 0);
  const dataUrl = canvas.toDataURL('image/jpg');
  sendToServer(dataUrl)
  // img.src = canvas.toDataURL('image/jpg');
  // document.body.appendChild(img);
}

// https://stackoverflow.com/questions/7203304/warning-cant-verify-csrf-token-authenticity-rails
function sendToServer(dataUrl) {
  $.ajax({
    type: "POST",
    url: "/save",
    beforeSend: function(xhr) {xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))},
    data: {img: dataUrl},
    success: () => console.log("done!!")
  })
}
