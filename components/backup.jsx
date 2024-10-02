"use client";

import { useEffect, useState } from "react";

export default function AudioCapture() {
  const [devices, setDevices] = useState([]);
  const [audioStreams, setAudioStreams] = useState([]);
  const [mediaRecorders, setMediaRecorders] = useState([]);
  const [blobs, setBlobs] = useState([]);

  useEffect(() => {
    const getAudioDevices = async () => {
      try {
        const deviceInfos = await navigator.mediaDevices.enumerateDevices();
        const audioDevices = deviceInfos.filter(
          (device) => device.kind === "audioinput"
        );
        setDevices(audioDevices);
      } catch (error) {
        console.error("Error accessing media devices:", error);
      }
    };

    getAudioDevices();
  }, []);

  const startRecording = async (deviceId, index) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { deviceId: deviceId ? { exact: deviceId } : undefined },
      });

      setAudioStreams((prevStreams) => {
        const newStreams = [...prevStreams];
        newStreams[index] = stream;
        return newStreams;
      });

      const mediaRecorder = new MediaRecorder(stream);
      const chunks = [];
      mediaRecorder.ondataavailable = (e) => {
        chunks.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/webm" });
        setBlobs((prevBlobs) => {
          const newBlobs = [...prevBlobs];
          newBlobs[index] = blob;
          return newBlobs;
        });
      };

      mediaRecorder.start();
      setMediaRecorders((prevRecorders) => {
        const newRecorders = [...prevRecorders];
        newRecorders[index] = mediaRecorder;
        return newRecorders;
      });
    } catch (error) {
      console.error("Error starting audio stream:", error);
    }
  };

  const stopRecording = (index) => {
    if (mediaRecorders[index]) {
      mediaRecorders[index].stop();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
      <h2 className="text-2xl font-semibold text-gray-800 mb-8">
        Select Audio Input Sources
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {[0, 1, 2, 3].map((index) => (
          <div
            key={index}
            className="bg-white shadow-md rounded-lg p-6 w-full max-w-sm mx-auto"
          >
            <h3 className="text-lg font-medium text-gray-700 mb-4">
              Source {index + 1}
            </h3>
            <select
              className="w-full p-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              onChange={(e) => startRecording(e.target.value, index)}
            >
              <option value="">Select Device</option>
              {devices.map((device) => (
                <option key={device.deviceId} value={device.deviceId}>
                  {device.label || `Microphone ${device.deviceId}`}
                </option>
              ))}
            </select>

            {audioStreams[index] && (
              <div className="mt-4">
                <button
                  className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition"
                  onClick={() => stopRecording(index)}
                >
                  Stop Recording
                </button>

                {blobs[index] && (
                  <div className="mt-4">
                    <audio controls className="w-full">
                      <source
                        src={URL.createObjectURL(blobs[index])}
                        type="audio/webm"
                      />
                    </audio>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}