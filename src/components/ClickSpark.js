'use client'

import { useState, useRef, useEffect } from 'react'

export default function ClickSpark({ children, className = '', onClick }) {
  const [sparks, setSparks] = useState([])
  const containerRef = useRef(null)
  const styleIdRef = useRef(null)

  useEffect(() => {
    if (!styleIdRef.current) {
      const styleId = 'spark-animations'
      const existingStyle = document.getElementById(styleId)
      if (existingStyle) return

      const style = document.createElement('style')
      style.id = styleId
      
      const animations = Array.from({ length: 8 }, (_, i) => {
        const angle = (i * 360) / 8
        const rad = (angle * Math.PI) / 180
        const distance = 50
        const endX = Math.cos(rad) * distance
        const endY = Math.sin(rad) * distance
        
        return `
          @keyframes spark-${i} {
            0% {
              opacity: 1;
              transform: translate(-50%, -50%) translate(0, 0) scale(1);
            }
            100% {
              opacity: 0;
              transform: translate(-50%, -50%) translate(${endX}px, ${endY}px) scale(0);
            }
          }
        `
      }).join('')
      
      style.textContent = animations
      document.head.appendChild(style)
      styleIdRef.current = styleId
    }
  }, [])

  const handleClick = (e) => {
    if (!containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const newSparks = Array.from({ length: 8 }, (_, i) => ({
      id: `${Date.now()}-${i}`,
      x,
      y,
      index: i,
    }))

    setSparks(newSparks)

    setTimeout(() => {
      setSparks([])
    }, 600)

    if (onClick) {
      onClick(e)
    }
  }

  return (
    <div 
      ref={containerRef}
      className={`relative ${className}`} 
      onClick={handleClick}
    >
      {children}
      {sparks.map((spark) => (
        <div
          key={spark.id}
          className="absolute pointer-events-none"
          style={{
            left: `${spark.x}px`,
            top: `${spark.y}px`,
            animation: `spark-${spark.index} 600ms ease-out forwards`,
          }}
        >
          <div
            className="w-1.5 h-1.5 bg-blue-500 rounded-full"
            style={{
              boxShadow: '0 0 6px 2px rgba(59, 130, 246, 0.8)',
            }}
          />
        </div>
      ))}
    </div>
  )
}