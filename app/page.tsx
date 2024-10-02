"use client";
import "./globals.css";
import AudioCapture from "../components/AudioCapture";
// import AudioWave from "../components/WaveCapture";
// import type { Metadata } from "next";

// export const metadata: Metadata = {
//   title: "My Page Title",
// };

export default function Home() {
  return (
    <div>
      {/* <Head> */}
      {/* <title>Audio Capture App</title> */}
      <meta name="description" content="Capture audio from input device" />
      {/* </Head> */}
      <main>
        <AudioCapture />
        {/* <AudioWave /> */}
      </main>
    </div>
  );
}
