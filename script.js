const video = document.getElementById('video')

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('./models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('./models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('./models'),
  faceapi.nets.faceExpressionNet.loadFromUri('./models')
]).then(startVideo)

function startVideo() {
  navigator.getUserMedia(
    { video: {} },
    stream => video.srcObject = stream,
    err => console.error(err)
  )
}

video.addEventListener('play', () => {
  const canvas = faceapi.createCanvasFromMedia(video);
  document.body.append(canvas);
  const displaySize = { width: video.width, height: video.height };
  faceapi.matchDimensions(canvas, displaySize);

  setInterval(async () => {
    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions();

    // Initialize variables to track the highest scoring emotion and its score
    let maxScore = -Infinity;
    let dominantEmotion = "";

    detections.forEach(result => {
      const expressions = result.expressions;
      for (let emotion in expressions) {
        if (expressions[emotion] > maxScore) {
          maxScore = expressions[emotion];
          dominantEmotion = emotion;
        }
      }
    });

    // Print detected emotion and its score to the console
    console.log(`Dominant Emotion: ${dominantEmotion}, Score: ${maxScore}`);

    const resizedDetections = faceapi.resizeResults(detections, displaySize);
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
  }, 5000);
});
