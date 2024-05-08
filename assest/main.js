const video_container = document.querySelector(".video-container");
const videoElement = video_container.querySelector("#video");
const startRecordButton = document.getElementById("startRecord");
const stopRecordButton = document.getElementById("stopRecord");
const playRecordButton = document.getElementById("playRecord");
const downloadRecordButton = document.getElementById("downloadRecord");
const recordedVideo = document.createElement("video");
const userIcon = document.querySelector(".userIcon");

var mediaRecorder;
var recordedChunks = [];

// Request access to the webcam and microphone
navigator.mediaDevices
  .getUserMedia({ video: true, audio: true })
  .then((stream) => {
    videoElement.srcObject = stream;
    mediaRecorder = new MediaRecorder(stream);

    console.log(mediaRecorder);
    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        recordedChunks.push(event.data);
      }
    };
  })
  .catch((error) => {
    console.error("Error accessing the webcam and microphone:", error);
  });

startRecordButton.addEventListener("click", () => {
  userIcon.style.display = "none";
  videoElement.style.display = "block";
  recordedChunks = [];
  mediaRecorder.start();
  startRecordButton.disabled = true;
  stopRecordButton.disabled = false;
});

stopRecordButton.addEventListener("click", () => {
  mediaRecorder.stop();
  startRecordButton.disabled = false;
  stopRecordButton.disabled = true;
});

downloadRecordButton.addEventListener("click", () => {
  const blob = new Blob(recordedChunks, { type: "video/mp4" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  document.body.appendChild(a);
  a.style = "display: none";
  a.href = url;
  a.download = "recording.mp4";
  a.click();
  window.URL.revokeObjectURL(url);
});

playRecordButton.addEventListener("click", () => {
  console.log(video_container);
  const blob = new Blob(recordedChunks, { type: "video/mp4" });
  const url = URL.createObjectURL(blob);
  video_container.innerHTML = "";
  if (blob.size != 0) {
    recordedVideo.controls = true;
    recordedVideo.autoplay = true;
    recordedVideo.src = url;
    recordedVideo.id = "video";
    recordedVideo.style.display = "block";
    video_container.appendChild(recordedVideo);
  }
});

// -----------------
