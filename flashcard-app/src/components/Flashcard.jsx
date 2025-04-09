import { useState } from 'react'
import { Box, Text, useColorModeValue } from '@chakra-ui/react'
import { motion } from 'framer-motion'

const MotionBox = motion(Box)

const Flashcard = ({ front, back }) => {
  const [isFlipped, setIsFlipped] = useState(false)
  const bgColor = useColorModeValue('white', 'gray.700')
  const borderColor = useColorModeValue('gray.200', 'gray.600')

  return (
    <MotionBox
      w="100%"
      h="200px"
      perspective="1000px"
      onClick={() => setIsFlipped(!isFlipped)}
      cursor="pointer"
    >
      <MotionBox
        position="relative"
        w="100%"
        h="100%"
        transformStyle="preserve-3d"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6 }}
      >
        <Box
          position="absolute"
          w="100%"
          h="100%"
          backfaceVisibility="hidden"
          bg={bgColor}
          borderRadius="lg"
          p={6}
          boxShadow="md"
          border="1px solid"
          borderColor={borderColor}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Text fontSize="xl" textAlign="center">
            {front}
          </Text>
        </Box>
        <Box
          position="absolute"
          w="100%"
          h="100%"
          backfaceVisibility="hidden"
          bg={bgColor}
          borderRadius="lg"
          p={6}
          boxShadow="md"
          border="1px solid"
          borderColor={borderColor}
          display="flex"
          alignItems="center"
          justifyContent="center"
          transform="rotateY(180deg)"
        >
          <Text fontSize="xl" textAlign="center">
            {back}
          </Text>
        </Box>
      </MotionBox>
    </MotionBox>
  )
}

export default Flashcard 