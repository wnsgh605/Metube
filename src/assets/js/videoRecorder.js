const recorderContainer = document.getElementById("jsRecordContainer");
const recordButton = document.getElementById("jsRecordButton");
const videoPreview = document.getElementById("jsVideoPreview");

let streamObj;
let videoRecorder;

const handleVideoData = (event) => {
  const { data: videoFile } = event;
  const link = document.createElement("a");
  link.href = URL.createObjectURL(videoFile);
  link.download = "recorded.mp4";
  document.body.appendChild(link);
  link.click();
};

const startRecording = () => {
  videoRecorder = new MediaRecorder(streamObj);
  videoRecorder.start();
  videoRecorder.addEventListener("dataavailable", handleVideoData);
  recordButton.addEventListener("click", stopRecording);
};

const stopRecording = () => {
  videoRecorder.stop();
  recordButton.removeEventListener("click", stopRecording);
  recordButton.addEventListener("click", getVideo);
  recordButton.innerHTML = "Start Recording";
};

const getVideo = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: { width: 1280, height: 720 },
    });
    videoPreview.srcObject = stream;
    videoPreview.muted = true;
    videoPreview.play();
    recordButton.innerHTML = "Stop Recording";
    streamObj = stream;
    startRecording();
  } catch (error) {
    console.log(error);
    recordButton.innerHTML = "Cannot Record";
  } finally {
    recordButton.removeEventListener("click", getVideo);
  }
};

function init() {
  recordButton.addEventListener("click", getVideo);
}

if (recorderContainer) {
  init();
}
