import React from 'react'
import { Minus, Square, X } from 'lucide-react'

interface WindowControlsProps {
  onMinimize?: () => void
  onMaximize?: () => void
  onClose?: () => void
}

const WindowControls: React.FC<WindowControlsProps> = ({ onMinimize, onMaximize, onClose }) => {
  return (
    <div className="flex items-center -mr-2">
      <button
        onClick={onMinimize}
        className="p-2 hover:bg-deep-700 hover:rounded-md text-ocean-400 hover:text-ocean-300 transition-colors"
        title="Minimize"
      >
        <Minus size={16} />
      </button>
      <button
        onClick={onMaximize}
        className="p-2 hover:bg-deep-700 hover:rounded-md text-ocean-400 hover:text-ocean-300 transition-colors"
        title="Maximize"
      >
        <Square size={16} />
      </button>
      <button
        onClick={onClose}
        className="p-2 hover:bg-deep-700 hover:rounded-md text-ocean-400 hover:text-white transition-colors"
        title="Close"
      >
        <X size={16} />
      </button>
    </div>
  )
}

export default WindowControls
