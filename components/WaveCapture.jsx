"use client";

import { useState, useRef } from "react";

export default function WaveCapture() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioContext, setAudioContext] = useState(null);
  const [analyserNode, setAnalyserNode] = useState(null);
  const [audioDataArray, setAudioDataArray] = useState(null);
  const canvasRef = useRef(null);
  const rafIdRef = useRef(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);

      //   mediaRecorder.ondataavailable = (e) => {
      //     // Handle the audio data here if needed
      //   };

      mediaRecorder.onstop = () => {
        setIsRecording(false);
        stopWaveform();
      };

      mediaRecorder.start();
      setIsRecording(true);

      // Create AudioContext and AnalyserNode for visualizing the waveform
      const audioCtx = new AudioContext();
      const analyser = audioCtx.createAnalyser();
      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);
      analyser.fftSize = 2048;

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      setAudioContext(audioCtx);
      setAnalyserNode(analyser);
      setAudioDataArray(dataArray);

      drawWaveform();
    } catch (error) {
      console.error("Error starting audio stream:", error);
    }
  };

  const drawWaveform = () => {
    const canvas = canvasRef.current;
    const canvasCtx = canvas.getContext("2d");

    const draw = () => {
      if (!analyserNode || !audioDataArray) return;

      analyserNode.getByteTimeDomainData(audioDataArray);

      canvasCtx.fillStyle = "rgb(200, 200, 200)";
      canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

      canvasCtx.lineWidth = 2;
      canvasCtx.strokeStyle = "rgb(0, 0, 0)";

      canvasCtx.beginPath();

      const sliceWidth = (canvas.width * 1.0) / audioDataArray.length;
      let x = 0;

      for (let i = 0; i < audioDataArray.length; i++) {
        const v = audioDataArray[i] / 128.0;
        const y = (v * canvas.height) / 2;

        if (i === 0) {
          canvasCtx.moveTo(x, y);
        } else {
          canvasCtx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      canvasCtx.lineTo(canvas.width, canvas.height / 2);
      canvasCtx.stroke();

      // Continue drawing
      rafIdRef.current = requestAnimationFrame(draw);
    };

    draw();
  };

  const stopWaveform = () => {
    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current); // Stop animation
    }
    if (audioContext) {
      audioContext.close();
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    if (audioContext) {
      audioContext.close();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
      <h2 className="text-2xl font-semibold text-gray-800 mb-8">
        Audio Waveform Visualization
      </h2>
      <canvas ref={canvasRef} className="mb-8" width="400" height="100" />

      {!isRecording && (
        <button
          className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition"
          onClick={startRecording}
        >
          Start Recording
        </button>
      )}

      {isRecording && (
        <button
          className="w-full bg-red-500 text-white py-2 mt-2 rounded-md hover:bg-red-600 transition"
          onClick={stopRecording}
        >
          Stop Recording
        </button>
      )}
    </div>
  );
}
