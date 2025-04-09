import { useState } from 'react'
import { ChakraProvider, Box, Container, VStack, Input, Button, Text, Heading, useToast, SimpleGrid, Card, CardBody } from '@chakra-ui/react'
import Flashcard from './components/Flashcard'
import './styles/App.css'

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
      <Box className="app-container">
        <Container maxW="container.xl" centerContent>
          <VStack spacing={8} w="100%" align="stretch">
            <Box className="header">
              <Heading size="2xl" className="header-title">Flashcard Generator</Heading>
              <Text fontSize="xl" className="header-subtitle">Enter a topic or subject to generate flashcards</Text>
            </Box>
            
            <Box className="input-container">
              <VStack spacing={4}>
                <Input
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Enter your topic (e.g., 'Python programming basics')"
                  size="lg"
                  className="input-field"
                />
                
                <Button
                  colorScheme="blue"
                  size="lg"
                  onClick={generateFlashcards}
                  isLoading={loading}
                  loadingText="Generating flashcards..."
                  className="generate-button"
                >
                  Generate Flashcards
                </Button>
              </VStack>
            </Box>

            {flashcards.length > 0 && (
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6} className="flashcards-grid">
                {flashcards.map((card, index) => (
                  <Card 
                    key={index} 
                    className="flashcard-wrapper"
                  >
                    <CardBody p={0}>
                      <Flashcard
                        front={card.front}
                        back={card.back}
                      />
                    </CardBody>
                  </Card>
                ))}
              </SimpleGrid>
            )}
          </VStack>
        </Container>
      </Box>
    </ChakraProvider>
  )
}

export default App
