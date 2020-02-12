
document.addEventListener('DOMContentLoaded', () => {
  const video = document.querySelector('#videoElement');

  const takeSnapshot = (video) => {
    const img = document.createElement('img');
    let context;
    const width = video.offsetWidth
    const height = video.offsetHeight;

    canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, width, height);
    // const dataUrl = canvas.toDataURL('image/png');
    // console.log(dataUrl);
    img.src = canvas.toDataURL('image/jpeg');
    document.body.appendChild(img);
    console.log(dataURItoBlob(canvas.toDataURL('image/jpeg')))
  }

  const dataURItoBlob = (dataURI) => {
      const byteString = atob(dataURI.split(',')[1]);
      const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++)
      {
          ia[i] = byteString.charCodeAt(i);
      }

      const bb = new Blob([ab], { "type": mimeString });
      return bb;
  }

  if (navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(function (stream) {
        video.srcObject = stream;
        takeSnapshot(video)
      })
      .catch(function (err0r) {
        console.log(err0r)
        console.log("Something went wrong!");
      });
  }
});
// https://gist.github.com/anantn/1852070
// http://charlie0301.blogspot.com/2014/10/html5-canvas-blob-data-post-upload.html