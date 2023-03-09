import React, { useRef, useState, useEffect } from "react";
import { MusicDetail } from "@/interfaces/music";
import { formatTime } from "@/utils/formatTime";
import { getRatio, getDraggingRatio } from "@/utils/radioCalc";

interface Props {
  currentMusic: MusicDetail | null;
  isMusicLoop: boolean;
  handleSkipMusic: (param: "next" | "last") => void;
}

export const ProgressBar = React.forwardRef(
  (
    { currentMusic, isMusicLoop, handleSkipMusic }: Props,
    musicPlayer: any
  ) => {
    const progressRef = useRef<HTMLDivElement>(null);
    const [currentPlayRadio, setCurrentPlayRadio] = useState(0);
    const [currentMusicTime, setCurrentMusicTime] = useState(0);
    const [currentDurationTime, setCurrentDurationTime] = useState(0);
    const [intervalId, setIntervalId] = useState<number | NodeJS.Timeout>(0);
    const [showThumb, setShowThumb] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [cachedRatio, setCachedRatio] = useState<number>(0);
    const CachedRatioRef = useRef<number>(cachedRatio);

    const handlePlay = () => {
      clearInterval(intervalId);
      setIntervalId(
        setInterval(() => {
          setCurrentMusicTime(musicPlayer.current?.currentTime);
          setCurrentDurationTime(musicPlayer.current?.duration);
          setCurrentPlayRadio(getRatio(musicPlayer));
        }, 1000)
      );
    };

    const handleEnd = () => {
      handleSkipMusic("next");
      clearInterval(intervalId);
    };

    useEffect(() => {
      if (isDragging) {
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
      }
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }, [isDragging]);

    const handleMouseMove = (e: any) => {
      if (!isDragging) return;
      handleProgress(e);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      musicPlayer.current!.currentTime = CachedRatioRef.current;
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      musicPlayer.current?.play();
    };

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(true);
      clearInterval(intervalId);
    };

    const handleProgress = (e: React.MouseEvent<HTMLDivElement>) => {
      const progressBarRect = progressRef.current?.getBoundingClientRect();
      const currentTime = musicPlayer.current!.currentTime;
      const duration = musicPlayer.current!.duration;
      if (!progressBarRect || !currentTime || !duration) return;

      const newRatio = getDraggingRatio(e, progressBarRect);
      setCurrentPlayRadio(newRatio);
      setCurrentMusicTime((duration * newRatio) / 100);
      setCachedRatio(
        () => {
          CachedRatioRef.current = (duration * newRatio) / 100;
          return (duration * newRatio) / 100;
        }
      )
    };

    return (
      <section>
        <audio
          ref={musicPlayer}
          src={currentMusic?.url}
          loop={isMusicLoop}
          onPlay={handlePlay}
          onPause={() => {
            clearInterval(intervalId);
          }}
          onEnded={handleEnd}
        />
        <div className="w-[800px] h-[10px] flex justify-around items-center my-2">
          <div className="w-[10%] text-center">
            <span>{formatTime(currentMusicTime)}</span>
          </div>
          <div
            className="w-full h-[21px] flex items-center"
            onMouseOver={() => setShowThumb(true)}
            onMouseOut={() => setShowThumb(false)}
            onMouseDown={handleMouseDown}
            onClick={handleProgress}
          >
            <div
              className="relative w-full bg-gray-600 rounded-full h-[5px]"
              ref={progressRef}
            >
              <div
                className={`bg-gray-200 ${showThumb ? "bg-green" : ""
                  } rounded-full h-[5px]`}
                style={{ width: `${currentPlayRadio}%` }}
              ></div>
              <div
                className={`absolute top-[1px] ${showThumb ? "" : "hidden"
                  } transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-gray-200 rounded-full cursor-pointer`}
                style={{ left: `${currentPlayRadio + 0.5}%` }}
              ></div>
            </div>
          </div>
          <div className="w-[10%] text-center">
            <span>{formatTime(currentDurationTime)}</span>
          </div>
        </div>
      </section>
    );
  }
);
