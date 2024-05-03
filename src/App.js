import { useState, useEffect } from "react";

import wslink from "./wslink";

import logo from "./assets/logo.png";

import "./App.css";

import {
  Box,
  AppBar,
  Grid,
  Switch,
  Toolbar,
  Typography,
  IconButton,
  LinearProgress,
} from "@mui/material";
import { CameraAlt } from "@mui/icons-material";
import RemoteRenderView from "./components/RemoteRenderingView";

function App() {
  const [client, setClient] = useState(null);
  const [busy, setBusy] = useState(0);
  const [showing, setShowing] = useState(true);

  useEffect(() => {
    setClient((prevClient) => {
      wslink.connect(prevClient, setClient, setBusy);
    });
  }, []);

  const resetCamera = () => {
    wslink.resetCamera(client);
  };

  const handleChange = (event) => {
    // if (event.target.checked) {
    //   setClient((prevClient) => {
    //     wslink.connect(prevClient, setClient, setBusy);
    //   });
    // } else {
    //   wslink.disconnect(client, setClient);
    // }
    setShowing(event.target.checked);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" color="inherit">
        <Toolbar>
          <img src={logo} alt="logo" className="logo"></img>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Application
          </Typography>

          <Switch checked={showing} onChange={handleChange} />
          <IconButton onClick={resetCamera}>
            <CameraAlt />
          </IconButton>
        </Toolbar>
        <LinearProgress sx={{ opacity: !!busy ? 1 : 0 }} />
      </AppBar>
      <Box className="appContent">
        <div style={{ position: "relative", width: "100%", height: "100%" }}>
          {showing && (
            <Grid container>
              <Grid item xs={4} sx={{ position: "relative" }}>
                <RemoteRenderView client={client} viewId="1" />
              </Grid>
              <Grid item xs={4} sx={{ position: "relative" }}>
                <RemoteRenderView client={client} viewId="2" />
              </Grid>
              <Grid item xs={4} sx={{ position: "relative" }}>
                <RemoteRenderView client={client} viewId="3" />
              </Grid>
            </Grid>
          )}
        </div>
      </Box>
    </Box>
  );
}

export default App;
