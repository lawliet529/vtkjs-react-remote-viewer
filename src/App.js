import { useState, useEffect } from "react";

import wslink from "./wslink";

import logo from "./assets/logo.png";

import "./App.css";

import {
  Box,
  AppBar,
  Grid,
  Switch,
  Tab,
  Tabs,
  Toolbar,
  Typography,
  IconButton,
  LinearProgress,
} from "@mui/material";
import {
  AutoAwesomeMosaic,
  CameraAlt,
  Landscape,
  ViewColumn,
} from "@mui/icons-material";
import RemoteRenderView from "./components/RemoteRenderingView";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from '@mui/material/CssBaseline';

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

function App() {
  const [client, setClient] = useState(null);
  const [busy, setBusy] = useState(0);
  const [showing, setShowing] = useState(true);

  const [tab, setTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  useEffect(() => {
    setClient((prevClient) => {
      wslink.connect(prevClient, setClient, setBusy);
    });
  }, []);

  const resetCamera = () => {
    wslink.resetCamera(client);
  };

  const handleChange = (event) => {
    if (event.target.checked) {
      setClient((prevClient) => {
        wslink.connect(prevClient, setClient, setBusy);
      });
      setShowing(event.target.checked);
    } else {
      setShowing(event.target.checked);
      wslink.disconnect(client, setClient);
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
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
          <div
            style={{
              display: "flex",
              flexGrow: 1,
              position: "relative",
              width: "100%",
              height: "100%",
            }}
          >
            <Box>
              <Tabs
                orientation="vertical"
                value={tab}
                onChange={handleTabChange}
                sx={{ borderRight: 1, borderColor: "divider" }}
              >
                <Tab icon={<ViewColumn />} />
                <Tab icon={<AutoAwesomeMosaic />} />
                <Tab icon={<Landscape />} />
              </Tabs>
            </Box>
            <CustomTabPanel value={tab} index={0} style={{ width: "100%" }}>
              {showing && (
                <Grid container style={{ width: "100%", height: "600px" }}>
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
            </CustomTabPanel>
            <CustomTabPanel value={tab} index={1} style={{ width: "100%" }}>
              {showing && (
                <Grid container style={{ width: "100%", height: "600px" }}>
                  <Grid item xs={6} sx={{ position: "relative" }}>
                    <RemoteRenderView client={client} viewId="1" />
                  </Grid>
                  <Grid
                    item
                    container
                    direction="column"
                    xs={6}
                    sx={{ position: "relative" }}
                  >
                    <Grid item xs={6} sx={{ position: "relative" }}>
                      <RemoteRenderView client={client} viewId="2" />
                    </Grid>
                    <Grid item xs={6} sx={{ position: "relative" }}>
                      <RemoteRenderView client={client} viewId="3" />
                    </Grid>
                  </Grid>
                </Grid>
              )}
            </CustomTabPanel>
            <CustomTabPanel value={tab} index={2}>
              <Box
                component="img"
                sx={{
                  width: "auto",
                  height: "auto",
                  maxWidth: 700,
                  maxHeight: 600,
                }}
                src="https://source.unsplash.com/random"
              />
            </CustomTabPanel>
          </div>
        </Box>
      </Box>{" "}
    </ThemeProvider>
  );
}

export default App;
