import React from "react";
import { Box, Stack } from "@mui/material";
import Logo from "../public/logo.png";
function App() {
  return (
    <Box>
      <Stack direction="row" justifyContent="center">
        <Box>
          <img src={Logo} alt="logo" />
          <Typography component="h3" variant="body1">
            HelpMe Out
          </Typography>
        </Box>
        <Box>Settings</Box>
      </Stack>
    </Box>
  );
}

export default App;
