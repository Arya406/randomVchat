import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

function App() {
  const [status, setStatus] = useState("Click Start");

  const localStream = useRef(null);
  const peerConnection = useRef(null);
  const isStarted = useRef(false);

  useEffect(() => {
    socket.on("matched", async ({ isCaller }) => {
      console.log("Matched:", isCaller);

      setStatus("Connected 🎧");

      if (isStarted.current) return;
      isStarted.current = true;

      await startWebRTC(isCaller);
    });

    socket.on("signal", async (data) => {
      if (!peerConnection.current) return;

      try {
        if (data.type === "offer") {
          await peerConnection.current.setRemoteDescription(data);

          const answer = await peerConnection.current.createAnswer();
          await peerConnection.current.setLocalDescription(answer);

          socket.emit("signal", answer);
        }

        else if (data.type === "answer") {
          await peerConnection.current.setRemoteDescription(data);
        }

        else if (data.candidate) {
          await peerConnection.current.addIceCandidate(data.candidate);
        }
      } catch (err) {
        console.error("Signal error:", err);
      }
    });

    socket.on("partner-disconnected", () => {
      console.log("Partner left");

      setStatus("Stranger left 😢");
      cleanup();
    });

  }, []);

  // 🎤 START
  const start = async () => {
    try {
      setStatus("Requesting mic...");

      localStream.current = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      setStatus("Searching...");

      socket.emit("start");
    } catch (err) {
      console.error(err);
      setStatus("Mic permission denied ❌");
    }
  };

  // 🔥 WEBRTC
  const startWebRTC = async (isCaller) => {
    console.log("Starting WebRTC");

    // ✅ ensure mic exists
    if (!localStream.current) {
      try {
        localStream.current = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
      } catch (err) {
        console.error("Mic error:", err);
        return;
      }
    }

    // ✅ cleanup old
    if (peerConnection.current) {
      peerConnection.current.close();
      peerConnection.current = null;
    }

    peerConnection.current = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    // send audio
    localStream.current.getTracks().forEach((track) => {
      peerConnection.current.addTrack(track, localStream.current);
    });

    // receive audio
    peerConnection.current.ontrack = (event) => {
      const audio = new Audio();
      audio.srcObject = event.streams[0];
      audio.play();
    };

    // ICE
    peerConnection.current.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("signal", { candidate: event.candidate });
      }
    };

    // caller creates offer
    if (isCaller) {
      const offer = await peerConnection.current.createOffer();

      if (peerConnection.current.signalingState === "stable") {
        await peerConnection.current.setLocalDescription(offer);
        socket.emit("signal", offer);
      }
    }
  };

  // 🔄 NEXT
  const next = () => {
    console.log("Next clicked");

    cleanup();
    setStatus("Searching next...");

    socket.emit("next");
  };

  // 🧹 CLEANUP
  const cleanup = () => {
    if (peerConnection.current) {
      peerConnection.current.close();
      peerConnection.current = null;
    }

    isStarted.current = false;
  };

  return (
    <div style={styles.container}>
      <h1>🎙️ Random Voice Chat</h1>
      <p>{status}</p>

      <button onClick={start} style={styles.btn}>
        Start
      </button>

      <button onClick={next} style={styles.btn}>
        Next
      </button>
    </div>
  );
}

const styles = {
  container: {
    textAlign: "center",
    marginTop: "100px",
    fontFamily: "Arial",
  },
  btn: {
    margin: "10px",
    padding: "10px 20px",
    fontSize: "16px",
    cursor: "pointer",
  },
};

export default App;