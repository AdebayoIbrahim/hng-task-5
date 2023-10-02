import React, { useState } from "react";
import { Box, Button, Stack, Switch, Typography, styled } from "@mui/material";
import { LiaTimesCircle } from "react-icons/lia";
import { IoSettingsOutline } from "react-icons/io5";
import { FiMonitor } from "react-icons/fi";
import { TiTabsOutline } from "react-icons/ti";
import { BsCameraVideo } from "react-icons/bs";
import { AiFillAudio } from "react-icons/ai";
import Card from "./components/Card.jsx";
import Logo from "../public/logo.png";
const Flex = styled(Stack)({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  gap: "10px",
});

const MuiSlide = styled(Switch)({
  fontSize: "22px",
  cursor: "pointer",
  "& .MuiSwitch-switchBase.Mui-checked": {
    color: "white",
  },
  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
    backgroundColor: "#120B48",
    opacity: "1",
  },
});
const iconStyle = {
  fontSize: "22px",
  cursor: "pointer",
};
function App() {
  const [checkAud, setCheck] = useState(true);
  const [checkVid, setCheckVid] = useState(true);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [id, setId] = useState("");
  const hanleVid = () => {
    setCheckVid(!checkVid);
  };
  const handleAud = () => {
    setCheck(!checkAud);
  };
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: checkVid,
        audio: checkAud,
      });

      const recorder = new MediaRecorder(stream);

      recorder.ondataavailable = async (event) => {
        if (event.data.size > 0) {
          // Generate a unique ID for the chunk
          const chunkId = window.crypto.randomUUID();
          // Append the new chunk with the unique ID to the recordedChunks array
          setId(chunkId);
          setRecordedChunks((prevChunks) => [
            ...prevChunks,
            { id: chunkId, data: event.data },
          ]);

          // Send the chunk with the unique ID to the API
          const formData = new FormData();
          formData.append(
            "videoChunk",
            event.data,
            `recorded-chunk-${chunkId}.webm`
          );

          try {
            await fetch(
              "https://processing-video.onrender.com/processing_api/start_recording/",
              {
                method: "POST",
                body: formData,
              }
            );
          } catch (error) {
            console.error("Error sending chunk to API:", error);
          }
        }
      };

      recorder.onstop = async () => {
        // Combine all recorded chunks into a single Blob
        const blob = new Blob(
          recordedChunks.map((chunk) => chunk.data),
          {
            type: "video/webm",
          }
        );
        // Generate a unique ID for the entire video
        const uniqueId = window.crypto.randomUUID();
        // Send the entire video with the unique ID to the API
        const formData = new FormData();
        formData.append("video", blob, `recorded-video-${uniqueId}.webm`);

        try {
          await fetch(
            `https://processing-video.onrender.com/processing_api/stop_recording/${uniqueId}`,
            {
              method: "POST",
              body: formData,
            }
          );
          // Clear the recordedChunks array
          setRecordedChunks([]);
        } catch (error) {
          console.error("Error sending video to API:", error);
        }
      };

      recorder.start();
      setMediaRecorder(recorder);
    } catch (error) {
      console.error("Error accessing media devices:", error);
    }
  };

  const stopRecording = () => {
    console.log("Stopping recording");
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      mediaRecorder.stop();
      const newTab = window.open(
        `https://helpme-out.netlify.app/file/${id}`,
        "_blank"
      );
      if (newTab) {
        // Focus on the new tab if it was successfully opened
        newTab.focus();
      }
    }
  };

  return (
    <Box
      sx={{
        padding: "1.5rem",
        width: "300px",
        borderRadius: "1.5em",
        boxShadow: "0 0 1em rgb(0 0 0 / .7)",
        textAlign: "center",
        background: "white",
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Flex>
          <img className="logo" src={Logo} alt="logo" />
          <Typography
            component="h3"
            variant="body1"
            sx={{ color: "#120B48", fontWeight: "600" }}
          >
            HelpMe Out
          </Typography>
        </Flex>
        <Flex>
          <IoSettingsOutline style={iconStyle} />
          <LiaTimesCircle style={iconStyle} />
        </Flex>
      </Stack>
      <Typography pt={3} variant="body2">
        This extension helps you record and share help videos with ease.
      </Typography>
      <Flex mt={3} sx={{ gap: "25px !important" }}>
        <Box sx={{ opacity: ".6" }}>
          <FiMonitor style={iconStyle} />
          <Typography pt={1} variant="body2">
            Full Screen
          </Typography>
        </Box>
        <Box>
          <TiTabsOutline style={iconStyle} />
          <Typography
            pt={1}
            variant="body2"
            sx={{ color: "#120B48", fontWeight: "bolder" }}
          >
            Current Tab
          </Typography>
        </Box>
      </Flex>
      <Box pt={3}>
        <Card>
          <Stack direction="row" justifyContent="space-between">
            <Flex>
              <BsCameraVideo style={iconStyle} />
              <Typography variant="body2" sx={{ color: "#120B48" }}>
                Camera
              </Typography>
            </Flex>
            <MuiSlide checked={checkVid} onChange={hanleVid} />
          </Stack>
        </Card>
        <Card pt={2}>
          <Stack direction="row" justifyContent="space-between">
            <Flex>
              <AiFillAudio style={iconStyle} />
              <Typography variant="body2" sx={{ color: "#120B48" }}>
                Audio
              </Typography>
            </Flex>
            <MuiSlide checked={checkAud} onChange={handleAud} />
          </Stack>
        </Card>
      </Box>
      <Box pt={2}>
        <Button
          onClick={startRecording}
          sx={{
            background: "#120B48",
            paddingBlock: ".8rem !important",
            color: "white !important",
            borderRadius: ".6rem",
            textTransform: "capitalize",
            fontWeight: "500",
            "&:hover": {
              color: "white",
              background: "#120B44",
            },
          }}
          fullWidth
        >
          Start Recording
        </Button>
      </Box>
      <Box pt={1}>
        <Button
          onClick={stopRecording}
          sx={{
            textDecoration: "none",
            background: "rgb(220,5,10)",
            paddingBlock: ".8rem !important",
            color: "white !important",
            borderRadius: ".6rem",
            textTransform: "capitalize",
            fontWeight: "500",
            "&:hover": {
              color: "white",
              background: "rgb(220,5,10)",
            },
          }}
          fullWidth
        >
          Stop Recording
        </Button>
      </Box>
    </Box>
  );
}

export default App;
