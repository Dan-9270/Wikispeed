import React, { useState } from 'react'
import { FaPlay, FaPause, FaVolumeUp, FaVolumeMute } from 'react-icons/fa'
import { useAudio } from '../script/AudioContext'

export const MusicPlayer: React.FC = () => {
  const { isPlaying, volume, togglePlayPause, setVolume } = useAudio()
  const [isMuted, setIsMuted] = useState(volume === 0)
  const [isHovered, setIsHovered] = useState(false)

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(event.target.value)
    setVolume(newVolume)
    setIsMuted(newVolume === 0)
  }

  const toggleMute = () => {
    if (isMuted) {
      setVolume(0.5)
      setIsMuted(false)
    } else {
      setVolume(0)
      setIsMuted(true)
    }
  }

  return (
    <div className="musicGestion">
      <div
        className="volumeControl"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="volumeIcon" onClick={toggleMute}>
          {isMuted ? <FaVolumeMute size={24} color="red" /> : <FaVolumeUp size={24} />}
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
