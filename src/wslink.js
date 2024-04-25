import vtkWSLinkClient from "vtk.js/Sources/IO/Core/WSLinkClient";
import SmartConnect from "wslink/src/SmartConnect";

import protocols from "./protocols";

import {
  connectImageStream,
  disconnectImageStream,
} from "vtk.js/Sources/Rendering/Misc/RemoteView";

vtkWSLinkClient.setSmartConnectClass(SmartConnect);

const wslink = {
  connect: (prevClient, setClient, setBusy) => {
    // Initiate network connection
    const config = { application: "cone" };

    // We suppose that we have dev server and that ParaView/VTK is running on port 1234
    config.sessionURL = `ws://${window.location.hostname}:1234/ws`;

    // Disconnect old client
    if (prevClient && prevClient.isConnected()) {
      // disconnectImageStream(prevClient.getConnection().getSession());
      prevClient.disconnect(-1);
    }

    let clientToConnect = vtkWSLinkClient.newInstance({ protocols });

    // Connect to busy store
    clientToConnect.onBusyChange((busy) => {
      setBusy(busy);
    });
    clientToConnect.beginBusy();

    // Error
    clientToConnect.onConnectionError((httpReq) => {
      const message =
        (httpReq && httpReq.response && httpReq.response.error) ||
        `Connection error`;
      console.error(message);
      console.log(httpReq);
    });

    // Close
    clientToConnect.onConnectionClose((httpReq) => {
      const message =
        (httpReq && httpReq.response && httpReq.response.error) ||
        `Connection close`;
      console.error(message);
      console.log(httpReq);
    });

    // Connect
    clientToConnect
      .connect(config)
      .then((validClient) => {
        connectImageStream(validClient.getConnection().getSession());
        setClient(validClient);
        clientToConnect.endBusy();

        // Now that the client is ready let's setup the server for us
        if (validClient) {
          console.log(validClient);
          validClient
            .getRemote()
            .Cone.createVisualization()
            .catch(console.error);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  },
  disconnect: (client, setClient) => {
    if (client && client.isConnected()) {
      disconnectImageStream(client.getConnection().getSession())
      client.disconnect(-1);
    }
    setClient(null);
    console.log("Disconnected");
  },
  updateResolution: (client, resolution) => {
    if (client) {
      // console.log(resolution);
      client.getRemote().Cone.updateResolution(resolution).catch(console.error);
    }
  },
  resetCamera: (client) => {
    if (client) {
      client.getRemote().Cone.resetCamera().catch(console.error);
    }
  },
};

export default wslink;
