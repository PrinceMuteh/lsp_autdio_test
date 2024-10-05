"use client";
import "./globals.css";
// import AudioCapture from "../components/AudioCapture";
import BAckup from "../components/backup2";
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
        <BAckup />
        {/* <AudioWave /> */}
      </main>
    </div>
  );
}
