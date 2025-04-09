import { useState } from 'react'
import { Box, Text } from '@chakra-ui/react'
import '../styles/Flashcard.css'

const Flashcard = ({ front, back }) => {
  const [isFlipped, setIsFlipped] = useState(false)

  return (
    <div 
      className={`flashcard ${isFlipped ? 'flipped' : ''}`}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div className="flashcard-inner">
        <div className="flashcard-face front">
          <Text className="flashcard-term">{front}</Text>
          <Text className="flip-instruction">(Click to flip)</Text>
        </div>
        <div className="flashcard-face back">
          <Text className="flashcard-definition">{back}</Text>
          <Text className="flip-instruction">(Click to flip back)</Text>
        </div>
      </div>
    </div>
  )
}

export default Flashcard 