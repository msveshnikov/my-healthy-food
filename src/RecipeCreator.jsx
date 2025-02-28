import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Heading,
    Textarea,
    Button,
    Select,
    VStack,
    FormControl,
    FormLabel,
    useToast
} from '@chakra-ui/react';
import { API_URL } from './App';

const RecipeCreator = () => {
    const [prompt, setPrompt] = useState('');
    const [language, setLanguage] = useState('en');
    const [model, setModel] = useState('gemini-2.0-flash-thinking-exp-01-21');
    const [loading, setLoading] = useState(false);
    const [imageSource, setImageSource] = useState('unsplash');
    const toast = useToast();
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/api/generate-recipe`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ prompt, language, model, deepResearch: true, imageSource })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to generate recipe');
            }

            const data = await response.json();
            toast({
                title: 'Recipe generated!',
                description: 'Your AI recipe has been created.',
                status: 'success',
                duration: 5000,
                isClosable: true
            });
            if (data && data.slug) {
                navigate(`/recipe/${data.slug}`);
            } else {
                console.warn('Recipe slug not found in response, cannot redirect to recipe page.');
            }
        } catch (error) {
            console.error('Error generating recipe:', error);
            toast({
                title: 'Error generating recipe.',
                description: error.message,
                status: 'error',
                duration: 5000,
                isClosable: true
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <VStack align="stretch" spacing={8} p={8} maxW="container.xl" mx="auto">
            <Heading as="h2" size="xl" textAlign="center">
                Recipe Creator
            </Heading>
            <form onSubmit={handleSubmit} width="100%">
                <VStack align="stretch" spacing={6}>
                    <FormControl id="prompt">
                        <FormLabel>Enter Recipe Prompt</FormLabel>
                        <Textarea
                            placeholder="e.g., Vegan pasta recipe with summer vegetables"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            required
                        />
                    </FormControl>

                    <FormControl id="language">
                        <FormLabel>Language</FormLabel>
                        <Select value={language} onChange={(e) => setLanguage(e.target.value)}>
                            <option value="en">English</option>
                            <option value="es">Spanish</option>
                            <option value="pt">Portuguese</option>
                            <option value="fr">French</option>
                            <option value="de">German</option>
                            <option value="ru">Russian</option>
                            <option value="it">Italian</option>
                        </Select>
                    </FormControl>

                    <FormControl id="model">
                        <FormLabel>AI Model</FormLabel>
                        <Select value={model} onChange={(e) => setModel(e.target.value)}>
                            <option value="gemini-2.0-flash-thinking-exp-01-21">
                                Gemini Flash Thinking
                            </option>
                            <option value="gpt-4o-mini">GPT-4o Mini</option>
                            <option value="deepseek-reasoner">Deepseek Reasoner</option>
                            <option value="claude-3-7-sonnet-20250219">Claude 3.5 Sonnet</option>
                            <option value="grok-2-latest">Grok 2</option>
                        </Select>
                    </FormControl>

                    <FormControl id="imageSource">
                        <FormLabel>Image Source</FormLabel>
                        <Select
                            value={imageSource}
                            onChange={(e) => setImageSource(e.target.value)}
                        >
                            <option value="unsplash">Unsplash</option>
                            <option value="google">Google Images</option>
                        </Select>
                    </FormControl>

                    <Button type="submit" colorScheme="primary" isLoading={loading}>
                        Generate Recipe
                    </Button>
                </VStack>
            </form>
        </VStack>
    );
};

export default RecipeCreator;
