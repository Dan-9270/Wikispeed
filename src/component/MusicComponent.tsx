import React, { useState, useRef, useEffect } from 'react'
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

const useSound = (filePath: string, volume: number = 1) => {
  const soundRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
      soundRef.current = new Audio(filePath)
      if (soundRef.current) {
          soundRef.current.volume = volume // Ajuster le volume ici
      }
  }, [filePath, volume]) // Recharger l'audio si le volume change

  const playSound = () => {
      if (soundRef.current) {
          soundRef.current.currentTime = 0
          soundRef.current.play().catch((e) => console.error('Error playing sound', e))
      }
  }

  return playSound
}

interface SoundPlayerProps {
  hoverSound?: string
  clickSound?: string
  volume?: number  // Permet de définir le volume par défaut (1 = 100%)
  children: React.ReactNode
}

export const SoundPlayer: React.FC<SoundPlayerProps> = ({ hoverSound, clickSound, volume = 1, children }) => {
  const containerRef = useRef<HTMLDivElement>(null)

  const playHoverSound = hoverSound ? useSound(hoverSound, volume) : undefined
  const playClickSound = clickSound ? useSound(clickSound, volume) : undefined

  useEffect(() => {
      const element = containerRef.current

      if (element) {
          if (playHoverSound) {
              element.addEventListener('mouseenter', playHoverSound)
          }
          if (playClickSound) {
              element.addEventListener('click', playClickSound)
          }
      }

      return () => {
          if (element) {
              if (playHoverSound) {
                  element.removeEventListener('mouseenter', playHoverSound)
              }
              if (playClickSound) {
                  element.removeEventListener('click', playClickSound)
              }
          }
      }
  }, [playHoverSound, playClickSound])

  return <div ref={containerRef}>{children}</div>
}
