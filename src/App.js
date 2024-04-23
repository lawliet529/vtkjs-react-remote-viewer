import { useState, useRef, useEffect } from "react";

import wslink from "./wslink";

import logo from "./assets/logo.png";

import "./App.css";

import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Slider,
  IconButton,
  LinearProgress,
} from "@mui/material";
import { CameraAlt } from "@mui/icons-material";
import RemoteRenderView from "./RemoteRenderingView";

function App() {
  const context = useRef({});
  const [resolution, setResolution] = useState(6);
  const [client, setClient] = useState(null);
  const [busy, setBusy] = useState(0);

  useEffect(() => {
    wslink.connect(context.current, setClient, setBusy);
  }, []);

  const updateResolution = (_event, newResolution) => {
    setResolution(newResolution);
    wslink.updateResolution(context.current, newResolution);
  };

  const resetCamera = () => {
    wslink.resetCamera(context.current);
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static"  color="inherit">
        <Toolbar>
          <img src={logo} alt="logo" className="logo"></img>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Application
          </Typography>

          <Slider
            value={resolution}
            onChange={updateResolution}
            min={4}
            max={60}
            step={1}
            sx={{ maxWidth: "300px" }}
          />
          <IconButton onClick={resetCamera}>
            <CameraAlt />
          </IconButton>
        </Toolbar>
        <LinearProgress sx={{opacity: !!busy ? 1 : 0}}/>
      </AppBar>
      <Box className="appContent">
        <div style={{ position: "relative", width: "100%", height: "100%" }}>
          <RemoteRenderView client={client}/>
        </div>
      </Box>
    </Box>
  );
}

export default App;
