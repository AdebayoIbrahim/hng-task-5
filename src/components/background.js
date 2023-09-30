let mediaRecorder;
let recordedChunks = [];

chrome.runtime.onConnect.addListener((port) => {
  port.onMessage.addListener((msg) => {
    if (msg.action === "startRecording") {
      startRecording();
    } else if (msg.action === "stopRecording") {
      stopRecording(port.sender.tab.id);
    }
  });
});

function startRecording() {
  console.log(navigator.mediaDevices);
  if (navigator.mediaDevices) {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        mediaRecorder = new MediaRecorder(stream);

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            recordedChunks.push(event.data);
          }
        };

        mediaRecorder.onstop = () => {
          const blob = new Blob(recordedChunks, { type: "video/webm" });
          const url = URL.createObjectURL(blob);
          chrome.tabs.create({ url });
          recordedChunks = [];
        };

        mediaRecorder.start();
      })
      .catch((error) => {
        console.error("Error accessing media devices:", error);
      });
  }
}

function stopRecording(tabId) {
  if (mediaRecorder && mediaRecorder.state !== "inactive") {
    mediaRecorder.stop();
  }
}

// chrome://flags/#unsafely-treat-insecure-origin-as-secure
