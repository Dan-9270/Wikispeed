import React, { createContext, useContext, useRef, useState, useEffect } from 'react'
import musicFile from '../assets/music/music1.mp3'

interface AudioContextType {
  isPlaying: boolean
  volume: number
  togglePlayPause: () => void
  setVolume: (volume: number) => void
}

const AudioContext = createContext<AudioContextType | undefined>(undefined)

export const useAudio = () => {
  const context = useContext(AudioContext)
  if (!context) throw new Error('useAudio must be used within AudioProvider')
  return context
}

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const audioRef = useRef(new Audio(musicFile))
  const [isPlaying, setIsPlaying] = useState<boolean>(
    localStorage.getItem('isPlaying') === 'true'
  )
  const [volume, setVolume] = useState<number>(
    parseFloat(localStorage.getItem('volume') || '0.5')
  )

  useEffect(() => {
    audioRef.current.volume = volume

    if (isPlaying) {
      audioRef.current.play().catch(() => {})
    } else {
      audioRef.current.pause()
    }

    localStorage.setItem('isPlaying', JSON.stringify(isPlaying))
    localStorage.setItem('volume', JSON.stringify(volume))
  }, [isPlaying, volume])

  const togglePlayPause = () => setIsPlaying(!isPlaying)

  return (
    <AudioContext.Provider value={{ isPlaying, volume, togglePlayPause, setVolume }}>
      {children}
    </AudioContext.Provider>
  )
}
