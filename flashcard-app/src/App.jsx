import { useState } from 'react'
import { ChakraProvider, Box, Container, VStack, Input, Button, Text, Heading, useToast } from '@chakra-ui/react'
import Flashcard from './components/Flashcard'

function App() {
  const [prompt, setPrompt] = useState('')
  const [flashcards, setFlashcards] = useState([])
  const [loading, setLoading] = useState(false)
  const toast = useToast()

  const generateFlashcards = async () => {
    if (!prompt.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a prompt',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      return
    }

    setLoading(true)
    try {
      const response = await fetch('http://localhost:3000/api/flashcards', {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain',
        },
        body: prompt,
      })

      if (!response.ok) {
        throw new Error('Failed to generate flashcards')
      }

      const data = await response.json()
      setFlashcards(data.flashcards)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to generate flashcards. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <ChakraProvider>
      <Box minH="100vh" bg="gray.50" py={8}>
        <Container maxW="container.lg">
          <VStack spacing={8}>
            <Heading>Flashcard Generator</Heading>
            <Text>Enter a topic or subject to generate flashcards</Text>
            
            <Input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter your topic (e.g., 'Python programming basics')"
              size="lg"
              width="100%"
            />
            
            <Button
              colorScheme="blue"
              onClick={generateFlashcards}
              isLoading={loading}
              loadingText="Generating flashcards..."
            >
              Generate Flashcards
            </Button>

            {flashcards.length > 0 && (
              <VStack spacing={4} width="100%">
                {flashcards.map((card, index) => (
                  <Flashcard
                    key={index}
                    front={card.front}
                    back={card.back}
                  />
                ))}
              </VStack>
            )}
          </VStack>
        </Container>
      </Box>
    </ChakraProvider>
  )
}

export default App
