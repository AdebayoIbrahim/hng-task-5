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
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recordchunks, setChunks] = useState([]);

  const startRecord = () => {
    console.log(mediaRecorder);
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        const recorder = new MediaRecorder(stream);
        setMediaRecorder(recorder);

        recorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            setChunks((prevChunks) => [...prevChunks, event.data]);
          }
        };

        recorder.onstop = () => {
          const blob = new Blob(recordchunks, { type: "video/webm" });
          const url = URL.createObjectURL(blob);
          chrome.tabs.create({ url });
          setChunks([]);
        };

        recorder.start();
      })
      .catch((error) => {
        console.error("Error accessing media devices:", error);
      });
  };

  //stop recording
  const stopRecoring = () => {
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      mediaRecorder.stop();
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
            <MuiSlide defaultChecked />
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
            <MuiSlide defaultChecked />
          </Stack>
        </Card>
      </Box>
      <Box pt={2}>
        <Button
          onClick={startRecord}
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
        <Button
          onClick={stopRecoring}
          sx={{
            background: "red",
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
          Stop Recording
        </Button>
      </Box>
    </Box>
  );
}

export default App;
