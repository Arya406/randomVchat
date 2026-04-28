import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";

const socket = io("https://randomvchat-1.onrender.com");

function VoiceChat({ onGoHome }) {
  const [state, setState] = useState("idle");

  const localStream = useRef(null);
  const peerConnection = useRef(null);
  const isStarted = useRef(false);

  useEffect(() => {
    socket.on("matched", async ({ isCaller }) => {
      console.log("Matched:", isCaller);
      setState("connected");

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
        } else if (data.type === "answer") {
          await peerConnection.current.setRemoteDescription(data);
        } else if (data.candidate) {
          await peerConnection.current.addIceCandidate(data.candidate);
        }
      } catch (err) {
        console.error("Signal error:", err);
      }
    });

    socket.on("partner-disconnected", () => {
      setState("partner-disconnected");
      cleanup();
    });

    return () => {
      socket.off("matched");
      socket.off("signal");
      socket.off("partner-disconnected");
    };
  }, []);

  const start = async () => {
    try {
      setState("requesting-mic");
  
      const streamPromise = navigator.mediaDevices.getUserMedia({ audio: true });
  
      const timeout = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Mic timeout")), 5000)
      );
  
      localStream.current = await Promise.race([streamPromise, timeout]);
  
      console.log("Mic granted");
  
      setState("searching");
      socket.emit("start");
  
    } catch (err) {
      console.error("Mic failed:", err);
      setState("idle");
      alert("Microphone access failed. Please allow mic.");
    }
  };

  const startWebRTC = async (isCaller) => {
    console.log("Starting WebRTC");

    if (!localStream.current) {
      localStream.current = await navigator.mediaDevices.getUserMedia({ audio: true });
    }

    if (peerConnection.current) {
      peerConnection.current.close();
      peerConnection.current = null;
    }

    peerConnection.current = new RTCPeerConnection({
        iceServers: [
          {
            urls: "stun:stun.relay.metered.ca:80",
          },
          {
            urls: "turn:global.relay.metered.ca:80",
            username: "7978757a10e7eed91f95d651",
            credential: "A8bj1DAPaq+wxT+3",
          },
          {
            urls: "turn:global.relay.metered.ca:80?transport=tcp",
            username: "7978757a10e7eed91f95d651",
            credential: "A8bj1DAPaq+wxT+3",
          },
          {
            urls: "turn:global.relay.metered.ca:443",
            username: "7978757a10e7eed91f95d651",
            credential: "A8bj1DAPaq+wxT+3",
          },
          {
            urls: "turns:global.relay.metered.ca:443?transport=tcp",
            username: "7978757a10e7eed91f95d651",
            credential: "A8bj1DAPaq+wxT+3",
          },
        ],
      });

    localStream.current.getTracks().forEach((track) => {
      peerConnection.current.addTrack(track, localStream.current);
    });

    peerConnection.current.ontrack = (event) => {
      console.log("Receiving audio stream");

      let audio = document.getElementById("remoteAudio");
      if (!audio) {
        audio = document.createElement("audio");
        audio.id = "remoteAudio";
        audio.autoplay = true;
        audio.playsInline = true;
        document.body.appendChild(audio);
      }
      audio.srcObject = event.streams[0];
      audio.play().catch((e) => console.log("Audio play blocked:", e));
    };

    peerConnection.current.oniceconnectionstatechange = () => {
      console.log("ICE STATE:", peerConnection.current.iceConnectionState);
    };

    peerConnection.current.onicecandidate = (event) => {
      if (event.candidate) {
        console.log("CANDIDATE:", event.candidate.candidate);
        socket.emit("signal", { candidate: event.candidate });
      }
    };

    if (isCaller) {
      const offer = await peerConnection.current.createOffer();
      await peerConnection.current.setLocalDescription(offer);
      socket.emit("signal", offer);
    }
  };

  const next = () => {
    cleanup();
    setState("searching");
    socket.emit("next");
  };

  const stop = () => {
    socket.emit("stop");

    if (peerConnection.current) {
      peerConnection.current.close();
      peerConnection.current = null;
    }

    if (localStream.current) {
      localStream.current.getTracks().forEach((track) => track.stop());
      localStream.current = null;
    }

    isStarted.current = false;
    setState("ended");
  };

  const cleanup = () => {
    if (peerConnection.current) {
      peerConnection.current.close();
      peerConnection.current = null;
    }
    isStarted.current = false;
  };

  // ---- Render states exactly as in the beautiful UI ----

  const renderIdle = () => (
    <div className="text-center space-y-6">
      <div className="text-6xl">🎙️</div>
      <h2 className="text-2xl font-bold text-gray-800">Ready to talk?</h2>
      <p className="text-gray-500">Press the button and we’ll connect you with a random stranger.</p>
      <button
        onClick={start}
        className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold rounded-full shadow-lg hover:shadow-2xl hover:scale-105 transition-all"
      >
        Start Chatting
      </button>
    </div>
  );

  const renderRequestingMic = () => (
    <div className="text-center space-y-4">
      <div className="animate-spin text-4xl">🎤</div>
      <p className="text-gray-600 font-medium">Requesting microphone access…</p>
    </div>
  );

  const renderSearching = () => (
    <div className="text-center space-y-6">
      <div className="radar-container relative w-24 h-24 mx-auto">
        <div className="absolute inset-0 bg-purple-100 rounded-full animate-ping opacity-75" />
        <div className="absolute inset-2 bg-purple-200 rounded-full animate-ping opacity-50" style={{ animationDelay: "0.3s" }} />
        <div className="absolute inset-4 bg-purple-300 rounded-full animate-ping opacity-25" style={{ animationDelay: "0.6s" }} />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-3xl">🌐</span>
        </div>
      </div>
      <h2 className="text-xl font-semibold text-gray-800">Searching for a stranger…</h2>
      <p className="text-gray-400">Please wait, this might take a few seconds</p>
      <button
        onClick={stop}
        className="px-5 py-2 text-sm bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full transition"
      >
        Cancel
      </button>
    </div>
  );

  const renderConnected = () => (
    <div className="text-center space-y-6">
      <div className="flex justify-center items-center space-x-3">
        <div className="w-3 h-8 bg-gradient-to-t from-purple-500 to-pink-400 rounded-full animate-pulse" />
        <div className="w-3 h-12 bg-gradient-to-t from-purple-500 to-pink-400 rounded-full animate-pulse" style={{ animationDelay: "0.2s" }} />
        <div className="w-3 h-16 bg-gradient-to-t from-purple-500 to-pink-400 rounded-full animate-pulse" style={{ animationDelay: "0.4s" }} />
        <div className="w-3 h-12 bg-gradient-to-t from-purple-500 to-pink-400 rounded-full animate-pulse" style={{ animationDelay: "0.6s" }} />
        <div className="w-3 h-8 bg-gradient-to-t from-purple-500 to-pink-400 rounded-full animate-pulse" style={{ animationDelay: "0.8s" }} />
      </div>
      <h2 className="text-2xl font-bold text-gray-800">You're connected! 🎧</h2>
      <p className="text-gray-500">Speak freely — everything is anonymous.</p>
      <div className="flex justify-center gap-4">
        <button
          onClick={next}
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold rounded-full shadow-lg hover:scale-105 transition"
        >
          Next Stranger
        </button>
        <button
          onClick={stop}
          className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-full transition"
        >
          Leave
        </button>
      </div>
    </div>
  );

  const renderDisconnected = () => (
    <div className="text-center space-y-6">
      <div className="text-6xl">😢</div>
      <h2 className="text-2xl font-bold text-gray-800">Stranger left</h2>
      <p className="text-gray-500">Don't worry, you can meet someone new right away.</p>
      <button
        onClick={next}
        className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold rounded-full shadow-lg hover:scale-105 transition"
      >
        Find Next
      </button>
    </div>
  );

  const renderEnded = () => (
    <div className="text-center space-y-6">
      <div className="text-6xl">👋</div>
      <h2 className="text-2xl font-bold text-gray-800">Call ended</h2>
      <p className="text-gray-500">Whenever you’re ready, start a new conversation.</p>
      <button
        onClick={() => setState("idle")}
        className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold rounded-full shadow-lg hover:scale-105 transition"
      >
        Start Again
      </button>
    </div>
  );

  const renderContent = () => {
    switch (state) {
      case "idle":
        return renderIdle();
      case "requesting-mic":
        return renderRequestingMic();
      case "searching":
        return renderSearching();
      case "connected":
        return renderConnected();
      case "partner-disconnected":
        return renderDisconnected();
      case "ended":
        return renderEnded();
      default:
        return renderIdle();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-rose-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-gray-100 p-8 transition-all duration-300 relative">
        {/* Header with Home button */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={onGoHome}
            className="flex items-center text-gray-400 hover:text-gray-600 transition text-sm font-medium"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Home
          </button>
          <div className="text-center flex-1">
            <h1 className="text-3xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
              VibeTalk
            </h1>
            <p className="text-sm text-gray-400">anonymous voice chats</p>
          </div>
          <div className="w-12" /> {/* Spacer for alignment */}
        </div>
        {renderContent()}
      </div>
    </div>
  );
}

export default VoiceChat;