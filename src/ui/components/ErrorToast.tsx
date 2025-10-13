/**
 * Error toast notification component
 */

import React, { useEffect, useState } from 'react'
import './ErrorToast.css'

interface ErrorToastProps {
  message: string | null
  duration?: number
  onDismiss: () => void
}

export const ErrorToast = ({ message, duration = 3000, onDismiss }: ErrorToastProps): React.ReactElement | null => {
  const [visible, setVisible] = useState(false)

  useEffect((): void | (() => void) => {
    if (message !== null) {
      setVisible(true)

      const timer = setTimeout(() => {
        setVisible(false)
        setTimeout(onDismiss, 300) // Allow fade-out animation
      }, duration)

      return (): void => {
        clearTimeout(timer)
      }
    } else {
      setVisible(false)
      return undefined
    }
  }, [message, duration, onDismiss])

  if (message === null) {
    return null
  }

  return (
    <div className={`error-toast error-message ${visible ? 'visible' : ''}`} role="alert">
      <div className="error-toast-content">
        <span className="error-toast-icon">⚠️</span>
        <span className="error-toast-text">{message}</span>
      </div>
    </div>
  )
}
