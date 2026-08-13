'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Play, Pause, RotateCcw, Volume2, FastForward, Repeat } from 'lucide-react'

interface AudioPlayerProps {
  src?: string
  audioSrc?: string
  title: string
  subtitle?: string
  onComplete?: () => void
}

export default function AudioPlayer({ src, audioSrc, title, subtitle = '', onComplete }: AudioPlayerProps) {
  const finalSrc = src || audioSrc || ''
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [playbackSpeed, setPlaybackSpeed] = useState(1)
  const [isLooping, setIsLooping] = useState(false)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const sliderRef = useRef<HTMLDivElement>(null)

  // Initialize audio
  useEffect(() => {
    if (!finalSrc) return
    const audio = new Audio(finalSrc)
    audioRef.current = audio

    const onTimeUpdate = () => setCurrentTime(audio.currentTime)
    const onLoadedMetadata = () => setDuration(audio.duration || 0)
    const onEnded = () => {
      if (isLooping) {
        audio.currentTime = 0
        audio.play().catch(() => setIsPlaying(false))
      } else {
        setIsPlaying(false)
        if (onComplete) onComplete()
      }
    }

    audio.addEventListener('timeupdate', onTimeUpdate)
    audio.addEventListener('loadedmetadata', onLoadedMetadata)
    audio.addEventListener('ended', onEnded)

    // Apply initial settings
    audio.playbackRate = playbackSpeed
    audio.loop = isLooping
    audio.volume = isMuted ? 0 : volume

    return () => {
      audio.pause()
      audio.removeEventListener('timeupdate', onTimeUpdate)
      audio.removeEventListener('loadedmetadata', onLoadedMetadata)
      audio.removeEventListener('ended', onEnded)
      audioRef.current = null
    }
  }, [src, onComplete])

  // Sync speed, loop, volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackSpeed
    }
  }, [playbackSpeed])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.loop = isLooping
    }
  }, [isLooping])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume
    }
  }, [volume, isMuted])

  const togglePlay = () => {
    if (!audioRef.current) return
    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(err => console.log('Audio playback blocked or failed:', err))
    }
  }

  const handleRewind = () => {
    if (!audioRef.current) return
    audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 10)
  }

  const handleForward = () => {
    if (!audioRef.current) return
    audioRef.current.currentTime = Math.min(duration, audioRef.current.currentTime + 10)
  }

  const handleSliderClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!sliderRef.current || !audioRef.current || duration === 0) return
    const rect = sliderRef.current.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const percentage = Math.max(0, Math.min(clickX / rect.width, 1))
    audioRef.current.currentTime = percentage * duration
    setCurrentTime(percentage * duration)
  }

  const cycleSpeed = () => {
    const speeds = [1, 1.25, 1.5, 0.75]
    const nextIdx = (speeds.indexOf(playbackSpeed) + 1) % speeds.length
    setPlaybackSpeed(speeds[nextIdx])
  }

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00'
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
  }

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <div className="nv-audio-player-container nv-premium-glass">
      <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
        <div>
          <h4 className="nv-audio-title text-sm font-bold text-[#e8e4dc] leading-tight m-0">{title}</h4>
          <p className="text-xs text-neutral-400 m-0 mt-0.5">{subtitle}</p>
        </div>

        {/* Animated Waveform Visualizer */}
        <div className={`nv-waveform ${isPlaying ? 'playing' : ''}`}>
          <div className="nv-wave-bar"></div>
          <div className="nv-wave-bar"></div>
          <div className="nv-wave-bar"></div>
          <div className="nv-wave-bar"></div>
          <div className="nv-wave-bar"></div>
        </div>
      </div>

      {/* Progress slider bar */}
      <div className="nv-audio-progress-bar-wrap">
        <span>{formatTime(currentTime)}</span>
        <div 
          className="nv-audio-slider-track" 
          ref={sliderRef}
          onClick={handleSliderClick}
        >
          <div 
            className="nv-audio-slider-fill" 
            style={{ width: `${progressPercentage}%` }}
          />
          <div 
            className="nv-audio-slider-thumb" 
            style={{ left: `${progressPercentage}%` }}
          />
        </div>
        <span>{formatTime(duration)}</span>
      </div>

      {/* Controls row */}
      <div className="nv-audio-controls-row">
        <div className="flex items-center gap-4">
          {/* Mute button */}
          <button 
            className="text-neutral-400 hover:text-white transition"
            onClick={() => setIsMuted(!isMuted)}
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            <Volume2 size={16} className={isMuted ? 'opacity-40' : ''} />
          </button>
          
          {/* Volume slider */}
          <input 
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={isMuted ? 0 : volume}
            onChange={(e) => {
              setVolume(parseFloat(e.target.value))
              setIsMuted(false)
            }}
            className="w-16 h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-[#d4a053]"
          />
        </div>

        {/* Audio buttons */}
        <div className="nv-audio-main-btns">
          <button className="nv-audio-btn" onClick={handleRewind} title="Mundur 10s">
            <RotateCcw size={16} />
          </button>
          <button className="nv-audio-btn nv-audio-btn-play" onClick={togglePlay}>
            {isPlaying ? <Pause size={20} /> : <Play size={20} style={{ marginLeft: '2px' }} />}
          </button>
          <button className="nv-audio-btn" onClick={handleForward} title="Maju 10s">
            <FastForward size={16} />
          </button>
        </div>

        {/* Playback rate & Loop options */}
        <div className="nv-audio-extra-row">
          <button 
            className={`nv-audio-badge-btn ${isLooping ? 'active' : ''}`}
            onClick={() => setIsLooping(!isLooping)}
            title="Loop Meditasi"
          >
            <Repeat size={12} className="inline mr-1" />
            {isLooping ? 'Looping' : 'Loop'}
          </button>
          <button 
            className="nv-audio-badge-btn"
            onClick={cycleSpeed}
          >
            {playbackSpeed}x
          </button>
        </div>
      </div>
    </div>
  )
}
