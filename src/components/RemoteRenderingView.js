import React, { useEffect, useRef } from "react";
import "./RemoteRenderingView.css";
import vtkRemoteView from "vtk.js/Sources/Rendering/Misc/RemoteView";

const RemoteRenderView = ({ viewId = "-1", client = null }) => {
  const viewRef = useRef(null);

  useEffect(() => {
    const view = vtkRemoteView.newInstance({
      rpcWheelEvent: "viewport.mouse.zoom.wheel",
    });
    // default of 0.5 causes 2x size labels on high-DPI screens. 1 good for demo, not for production.
    // if (window.location.hostname.split(".")[0] === "localhost") {
    //   view.current.setInteractiveRatio(1);
    // }

    view.setContainer(viewRef.current);
    window.addEventListener("resize", view.resize);

    if (client) {
      // console.log('RemoteRenderView', this.viewId);
      const session = client.getConnection().getSession();
      view.setSession(session);
      view.setViewId(viewId);
      view.render();
    }

    return () => {
      window.removeEventListener("resize", view.resize);
      if (client && client.isConnected() && view.getSession()) view.delete();
    };
  }, [client, viewId]);

  return <div ref={viewRef} className="container"></div>;
};

export default RemoteRenderView;
