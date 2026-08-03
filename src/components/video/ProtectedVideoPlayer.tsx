import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";

type Props = {
  src: string;
  studentName: string;
  studentEmail: string;
  studentPhone: string;
};

export default function ProtectedVideoPlayer({
  src,
  studentName,
  studentEmail,
  studentPhone,
}: Props) {

  const videoRef = useRef<HTMLVideoElement>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const video = videoRef.current;

    if (!video) return;

    //----------------------------------
    // حماية
    //----------------------------------

    video.setAttribute(
      "disableRemotePlayback",
      "true"
    );

    const prevent = (e: Event) =>
      e.preventDefault();

    video.addEventListener(
      "contextmenu",
      prevent
    );

    //----------------------------------
    // لو الرابط HLS
    //----------------------------------

    let hls: Hls | null = null;

    if (
      src.endsWith(".m3u8") &&
      Hls.isSupported()
    ) {

      hls = new Hls({

        enableWorker: true,

        lowLatencyMode: true,

      });

      hls.loadSource(src);

      hls.attachMedia(video);

      hls.on(
        Hls.Events.MANIFEST_PARSED,
        () => {

          video.play();

        }
      );

    } else {

      video.src = src;

    }

    //----------------------------------
    // Loader
    //----------------------------------

    const loaded = () => {

      setLoading(false);

    };

    video.addEventListener(
      "loadeddata",
      loaded
    );

    //----------------------------------
    // Auto Reconnect
    //----------------------------------

    video.addEventListener(
      "stalled",
      () => {

        video.load();

        video.play();

      }
    );

    //----------------------------------
    // تنظيف
    //----------------------------------

    return () => {

      video.removeEventListener(
        "contextmenu",
        prevent
      );

      video.removeEventListener(
        "loadeddata",
        loaded
      );

      hls?.destroy();

    };

  }, [src]);

  return (

    <div className="relative overflow-hidden rounded-xl bg-black">

      {loading && (

        <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/70">

          <div className="text-white text-xl font-bold">

            جاري تحميل الفيديو...

          </div>

        </div>

      )}

      <video

        ref={videoRef}

        controls

        autoPlay

        playsInline

        className="w-full"

        disablePictureInPicture

        controlsList="nodownload noplaybackrate"

      />

      {/* Watermark */}

      <div className="absolute inset-0 pointer-events-none overflow-hidden">

        <div className="watermark">

          <div>{studentName}</div>

          <div>{studentEmail}</div>

          <div>{studentPhone}</div>

        </div>

      </div>

    </div>

  );

}