// "use client";
// import { useEffect, useState } from "react";

// export default function AudioCapture() {
//   const [devices, setDevices] = useState([]);
//   const [selectedDevice, setSelectedDevice] = useState([]);
//   const [audioStreams, setAudioStreams] = useState([]);
//   const [mediaRecorders, setMediaRecorders] = useState([]);
//   const [blobs, setBlobs] = useState([]);
//   const [isRecording, setIsRecording] = useState([]);
//   const [isPaused, setIsPaused] = useState([]);
//   const [uploading, setUploading] = useState(false);
//   const [uploadStatus, setUploadStatus] = useState(""); // Track upload status messages

//   useEffect(() => {
//     const getAudioDevices = async () => {
//       try {
//         const deviceInfos = await navigator.mediaDevices.enumerateDevices();
//         const audioDevices = deviceInfos.filter(
//           (device) => device.kind === "audioinput"
//         );
//         setDevices(audioDevices);
//       } catch (error) {
//         console.error("Error accessing media devices:", error);
//       }
//     };

//     getAudioDevices();
//   }, []);

//   const startRecording = async (deviceId, index) => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({
//         audio: { deviceId: deviceId ? { exact: deviceId } : undefined },
//       });

//       setAudioStreams((prevStreams) => {
//         const newStreams = [...prevStreams];
//         newStreams[index] = stream;
//         return newStreams;
//       });

//       const mediaRecorder = new MediaRecorder(stream);
//       const chunks = [];
//       mediaRecorder.ondataavailable = (e) => {
//         chunks.push(e.data);
//       };

//       mediaRecorder.onstop = () => {
//         const blob = new Blob(chunks, { type: "audio/webm" });
//         setBlobs((prevBlobs) => {
//           const newBlobs = [...prevBlobs];
//           newBlobs[index] = blob;
//           return newBlobs;
//         });
//         setIsRecording((prev) => {
//           const updated = [...prev];
//           updated[index] = false;
//           return updated;
//         });
//       };

//       mediaRecorder.start();
//       setIsRecording((prev) => {
//         const updated = [...prev];
//         updated[index] = true;
//         return updated;
//       });

//       setMediaRecorders((prevRecorders) => {
//         const newRecorders = [...prevRecorders];
//         newRecorders[index] = mediaRecorder;
//         return newRecorders;
//       });
//     } catch (error) {
//       console.error("Error starting audio stream:", error);
//     }
//   };

//   const pauseRecording = (index) => {
//     if (mediaRecorders[index]) {
//       mediaRecorders[index].pause();
//       setIsPaused((prev) => {
//         const updated = [...prev];
//         updated[index] = true;
//         return updated;
//       });
//     }
//   };

//   const resumeRecording = (index) => {
//     if (mediaRecorders[index]) {
//       mediaRecorders[index].resume();
//       setIsPaused((prev) => {
//         const updated = [...prev];
//         updated[index] = false;
//         return updated;
//       });
//     }
//   };

//   const stopRecording = (index) => {
//     if (mediaRecorders[index]) {
//       mediaRecorders[index].stop();
//       // Stop all tracks to release resources
//       audioStreams[index].getTracks().forEach((track) => track.stop());
//     }
//   };

//   const uploadAudio = async (blob, index) => {
//     setUploading(true);

//     setUploadStatus(""); // Reset the status before uploading
//     var token =
//       "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3Mjc3OTEyNTYsImlhdCI6MTcyNzcwNDg1Niwic3ViIjozfQ.OWlNluWMhpQURSd9S0Zp-km-t3g3UqcLAnxVNjsoi7Xu7v0_89hhySo9jFUkHqbzljM3XqsCfdUjCk6h0cXaMYWtheY-Ojlb1Qlj-arOo2AoIKIJ8_XvvgnPhWHKLkbvPQWe3nxUMmJS7GfRtN_0bPBJ2G9Z4HMKFxbNnIeEL6oflfH5ILdigmcmCuabB-Bfqd9GbkszofTlEih9KnM0VxQA12hvZVo7LWYp6JlYgu7Yqd2jEWuJ93IjHtV5D-KTigySxbx0qAdAESkt4UpwBRWLvArYbS-Vh5aSUnDwAf-7C0aqTMmEPm7nxg43_m67RvTP1GOwibLcWUiwTmUxhSL1LvVsDqOepJWJcyMTsO_0s--14XM1y4LsVo5RI_gy8qvuLj3wwUy5FXIgFg8XwjdrtiyF5_J7Bu_lAhfPnSjd8OdXisGZRwEONwNq6exIP8HkqvtEpADYUAi8s8T9TBkW7by5Gekrm4g5UqWkeSXG5zMTGZpuN5MoD9u5dRxzcF3Ut-6AqNkPUn2m4Wyl0Mmv8zt5L8v3bxjnbdS768ybGaO1i8PVHXCl-fcwltbzr0WpiD_Blg6HpCq9nSsCHdiX_D013-lwHOIG_i-MVl3YmPl3ExtWnUzhO1L2glSUTf86xwTeoEGYxqfk-wPk02-pBNE49TeanJXyMUvON10";
//     try {
//       const formData = new FormData();
//       formData.append("file", blob, `audio-${index}.webm`);

//       const response = await fetch("http://192.168.1.119:3000/upload", {
//         method: "POST",
//         body: formData,
//         headers: {
//           Authorization: `Bearer ${token}`, // Add the Bearer token here
//         },
//       });

//       if (!response.ok) {
//         throw new Error("Failed to upload");
//       }

//       setUploadStatus("Upload successful!");
//     } catch (error) {
//       console.error("Upload failed:", error);
//       setUploadStatus("Failed to upload the audio");
//     } finally {
//       setUploading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
//       <h2 className="text-2xl font-semibold text-gray-800 mb-8">
//         Select Audio Input Sources
//       </h2>
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//         {[0, 1, 2, 3].map((index) => (
//           <div
//             key={index}
//             className="bg-white shadow-md rounded-lg p-6 w-full max-w-sm mx-auto"
//           >
//             <h3 className="text-lg font-medium text-gray-700 mb-4">
//               Source {index + 1}
//             </h3>
//             <select
//               className="w-full p-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
//               onChange={(e) => {
//                 setSelectedDevice((prev) => {
//                   const newSelected = [...prev];
//                   newSelected[index] = e.target.value;
//                   return newSelected;
//                 });
//               }}
//               value={selectedDevice[index] || ""}
//               disabled={isRecording[index]}
//             >
//               <option value="">Select Device</option>
//               {devices.map((device) => (
//                 <option key={device.deviceId} value={device.deviceId}>
//                   {device.label || `Microphone ${device.deviceId}`}
//                 </option>
//               ))}
//             </select>

//             {!isRecording[index] && selectedDevice[index] && (
//               <button
//                 className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition"
//                 onClick={() => startRecording(selectedDevice[index], index)}
//               >
//                 Start Recording
//               </button>
//             )}

//             {isRecording[index] && (
//               <div className="mt-4">
//                 {isPaused[index] ? (
//                   <button
//                     className="w-full bg-yellow-500 text-white py-2 rounded-md hover:bg-yellow-600 transition"
//                     onClick={() => resumeRecording(index)}
//                   >
//                     Resume Recording
//                   </button>
//                 ) : (
//                   <button
//                     className="w-full bg-yellow-500 text-white py-2 rounded-md hover:bg-yellow-600 transition"
//                     onClick={() => pauseRecording(index)}
//                   >
//                     Pause Recording
//                   </button>
//                 )}

//                 <button
//                   className="w-full bg-red-500 text-white py-2 mt-2 rounded-md hover:bg-red-600 transition"
//                   onClick={() => stopRecording(index)}
//                 >
//                   Stop Recording
//                 </button>
//               </div>
//             )}

//             <div className="mt-4">
//               {blobs[index] && (
//                 <audio controls className="w-full">
//                   <source
//                     src={URL.createObjectURL(blobs[index])}
//                     type="audio/webm"
//                   />
//                 </audio>
//               )}

//               <button
//                 className="w-full bg-blue-500 text-white py-2 mt-2 rounded-md hover:bg-blue-600 transition"
//                 onClick={() => uploadAudio(blobs[index], index)}
//                 disabled={uploading || !blobs[index]} // Disable if no recording available
//               >
//                 {uploading ? "Uploading..." : "Upload Audio"}
//               </button>

//               {uploadStatus && (
//                 <p className="mt-2 text-sm text-gray-600">{uploadStatus}</p>
//               )}
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }