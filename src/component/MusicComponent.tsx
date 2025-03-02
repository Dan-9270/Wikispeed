import React, { useState, useRef, useEffect } from 'react'
import { FaPlay, FaPause, FaVolumeUp, FaVolumeMute } from 'react-icons/fa'
import musicFile from '../assets/music/music1.mp3'

export const MusicPlayer: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement>(new Audio(musicFile))
  const [isPlaying, setIsPlaying] = useState<boolean>(true) 
  const [volume, setVolume] = useState<number>(0.5) 
  const [isMuted, setIsMuted] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    audioRef.current.volume = volume

    if (isPlaying) {
      audioRef.current.play()
    } else {
      audioRef.current.pause()
    }

    return () => {
      audioRef.current.pause()
    }
  }, [isPlaying, volume])
  const togglePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(event.target.value)
    setVolume(newVolume)
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
    setVolume(isMuted ? 0.5 : 0)
  }

  return (
    <div className="musicGestion">
      <div
        className="volumeControl"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="volumeIcon" onClick={toggleMute}>
          {isMuted ? (
            <FaVolumeMute size={24} color="red" />
          ) : (
            <FaVolumeUp size={24} />
          )}
        </div>

        {isHovered && (
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="volumeSlider"
          />
        )}
      </div>

      <button className="musicButton" onClick={togglePlayPause}>
        {isPlaying ? <FaPause size={24} /> : <FaPlay size={24} />}
      </button>
    </div>
  )
}