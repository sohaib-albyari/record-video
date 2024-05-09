const frameeVideo = document.querySelector(".frameeVideo");
const circle = document.querySelector(".circle");
const btns = document.querySelector(".btns");
const btn = document.querySelectorAll(".btns button");
const imageSvg = document.querySelectorAll(".btns button img");
const btn_play_pause = document.querySelector(".btn_play_pause");
const video_container = document.querySelector(".video-container");
const videoElement = video_container.querySelector("#video");
const startRecordButton = document.getElementById("start");
const stopRecordButton = document.getElementById("stopRecord");
const pauseRecordButton = document.getElementById("pauseRecord");
const playRecordButton = document.getElementById("playRecord");
const downloadRecordButton = document.getElementById("downloadRecord");
const recordedVideo = document.createElement("video");
const userIcon = document.querySelector(".userIcon");

var mediaRecorder;
var recordedChunks = [];

const addBtn = `
<button class="btn" onclick="playRecord()" id="playRecord">
        <img src="assest/image/icon/Play.svg" /><span class="text"
          >تشغيل التسجيل</span
        >
      </button>
      <button class="btn" onclick="download()" id="downloadRecord">
        <img src="assest/image/icon/download.svg" /><span class="text"
          >تنزيل التسجيل</span
        >
      </button>
`;

btn.forEach((e, i) => {
  e.addEventListener("click", () => {
    switch (e.id) {
      case "start":
        e.style.display = "none";
        btn_play_pause.style.display = "flex";
        break;
      case "pauseRecord":
        imageSvg[i].src = "assest/image/icon/Play.svg";
        imageSvg[i].classList.toggle("stop");
        if (!imageSvg[i].classList.contains("stop")) {
          imageSvg[i].src = "assest/image/icon/pause.svg";
        }
        break;
      case "stopRecord":
        imageSvg[i].classList.toggle("stop");
        btns.innerHTML = "";
        btns.innerHTML = addBtn;
        break;
      case "camera":
        imageSvg[i].src = "assest/image/icon/S_Camera.svg";
        imageSvg[i].classList.toggle("stop");
        if (!imageSvg[i].classList.contains("stop")) {
          imageSvg[i].src = "assest/image/icon/Camera.svg";
        }
        break;
      case "microphone":
        imageSvg[i].src = "assest/image/icon/S_Microphone.svg";
        imageSvg[i].classList.toggle("stop");
        if (!imageSvg[i].classList.contains("stop")) {
          imageSvg[i].src = "assest/image/icon/Microphone.svg";
        }
        break;

      default:
        break;
    }
  });
});

// Request access to the webcam and microphone
navigator.mediaDevices
  .getUserMedia({ video: true, audio: true })
  .then((stream) => {
    videoElement.srcObject = stream;
    mediaRecorder = new MediaRecorder(stream);

    // console.log(mediaRecorder);
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
  frameeVideo.style.backgroundImage = "url(assest/image/RFG.svg)";
  circle.style.backgroundColor = "var(--green)";
  circle.style.display = "block";
  // document.body.style.backgroundImage = "none";
  // frameeVideo.classList.add("active");
  recordedChunks = [];
  mediaRecorder.start();
  startRecordButton.disabled = true;
  stopRecordButton.disabled = false;
});

stopRecordButton.addEventListener("click", () => {
  mediaRecorder.stop();
});

pauseRecordButton.addEventListener("click", () => {
  circle.classList.toggle("animation");
  if (imageSvg[1].classList.contains("stop")) {
    mediaRecorder.pause();
    circle.style.backgroundColor = "var(--red)";
  } else {
    mediaRecorder.resume();
    circle.style.backgroundColor = "var(--green)";
  }
});

function download() {
  const blob = new Blob(recordedChunks, { type: "video/mp4" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  document.body.appendChild(a);
  a.style = "display: none";
  a.href = url;
  a.download = "recording.mp4";
  a.click();
  window.URL.revokeObjectURL(url);
}

function playRecord() {
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
}

// -----------------
