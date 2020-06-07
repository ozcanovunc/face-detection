init();

function init() {
    Promise
        .all([
            faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
            faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
            faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
            faceapi.nets.faceExpressionNet.loadFromUri('/models')
        ])
        .then(startVideo)
        .catch(onError);
}

function startVideo() {
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');

    navigator.getUserMedia(
        { video: {} },
        stream => video.srcObject = stream,
        onError
    );

    video.addEventListener('play', () => {
        const videoDimensions = {
            width: screen.width,
            height: screen.height
        }
        faceapi.matchDimensions(canvas, videoDimensions);
        setInterval(async () => {
            const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions());
            const resizedDetections = faceapi.resizeResults(detections, videoDimensions);
            canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
            faceapi.draw.drawDetections(canvas, resizedDetections);
        }, 500);
    })
}

function onError(e) {
    console.error(e);
}
