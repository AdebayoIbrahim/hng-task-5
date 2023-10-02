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

// const sendVideoToExternalAPI = (videoBlob) => {
//   const formData = new FormData();
//   formData.append("video", videoBlob, "recorded-video.webm");

//   fetch("https://jsonplaceholder.typicode.com/posts", {
//     method: "POST",
//     body: formData,
//   })
//     .then((response) => response.json())
//     .then((data) => {
//       console.log("JSONPlaceholder API response:", data);
//       // Handle the response as needed
//     })
//     .catch((error) => {
//       console.error("Error sending video to JSONPlaceholder API:", error);
//     });
// };

// const showResult = "https://movie-pot.netlify.app/movies/240";
// window.open(showResult, "_blank");

// try {
//       const stream = await navigator.mediaDevices.getUserMedia({
//         video: checkVid,
//         audio: checkAud,
//       });

//       const recorder = new MediaRecorder(stream);

//       recorder.ondataavailable = (event) => {
//         if (event.data.size > 0) {
//           setRecordedChunks((prevChunks) => [...prevChunks, event.data]);
//         }
//       };

//       recorder.onstop = () => {
//         const blob = new Blob(recordedChunks, { type: "video/webm" });
//         const url = URL.createObjectURL(blob);
//         chrome.tabs.create({ url });
//         setRecordedChunks([]);
//       };

//       recorder.start();
//       setMediaRecorder(recorder);
//     } catch (error) {
//       console.error("Error accessing media devices:", error);
//     }
//   };

//   const stopRecording = () => {
//     if (mediaRecorder && mediaRecorder.state !== "inactive") {
//       mediaRecorder.stop();
//     }
//   };
