import { useState } from 'react';
import {
    Box,
    Heading,
    Textarea,
    Button,
    Select,
    VStack,
    FormControl,
    FormLabel,
    Spinner,
    Text,
    useToast
} from '@chakra-ui/react';
import { API_URL } from './App';

const RecipeCreator = () => {
    const [prompt, setPrompt] = useState('');
    const [language, setLanguage] = useState('en');
    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(false);
    const toast = useToast();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setRecipe(null);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/api/generate-recipe`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ prompt, language, deepResearch: true })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to generate recipe');
            }

            const data = await response.json();
            setRecipe(data);
            toast({
                title: 'Recipe generated!',
                description: 'Your AI recipe has been created.',
                status: 'success',
                duration: 5000,
                isClosable: true
            });
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
        <VStack align="stretch" spacing={8} p={8}>
            <Heading as="h2" size="xl" textAlign="center">
                Recipe Creator
            </Heading>
            <form onSubmit={handleSubmit}>
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
                            <option value="fr">French</option>
                            <option value="de">German</option>
                            <option value="zh">Chinese</option>
                            <option value="ja">Japanese</option>
                            <option value="ko">Korean</option>
                            <option value="ru">Russian</option>
                            <option value="ar">Arabic</option>
                            <option value="hi">Hindi</option>
                            <option value="pt">Portuguese</option>
                        </Select>
                    </FormControl>

                    <Button type="submit" colorScheme="primary" isLoading={loading}>
                        Generate Recipe
                    </Button>
                </VStack>
            </form>

            {loading && (
                <Box textAlign="center">
                    <Spinner size="lg" color="primary.500" />
                    <Text mt={2}>Generating recipe, please wait...</Text>
                </Box>
            )}

            {recipe && (
                <Box mt={10} p={5} shadow="md" borderWidth="1px" borderRadius="md">
                    <Heading as="h3" size="lg" mb={4} textAlign="center">
                        {recipe.title}
                    </Heading>
                    {recipe.description && <Text mb={4}>{recipe.description}</Text>}
                    {recipe.ingredients && recipe.ingredients.length > 0 && (
                        <Box mb={4}>
                            <Heading as="h4" size="md" mb={2}>
                                Ingredients
                            </Heading>
                            <ul>
                                {recipe.ingredients.map((ingredient, index) => (
                                    <li key={index}>{ingredient}</li>
                                ))}
                            </ul>
                        </Box>
                    )}
                    {recipe.instructions && recipe.instructions.length > 0 && (
                        <Box>
                            <Heading as="h4" size="md" mb={2}>
                                Instructions
                            </Heading>
                            <ol>
                                {recipe.instructions.map((instruction, index) => (
                                    <li key={index}>{instruction}</li>
                                ))}
                            </ol>
                        </Box>
                    )}
                    {recipe.images && recipe.images.length > 0 && (
                        <Box mt={4}>
                            <Heading as="h4" size="md" mb={2}>
                                Images
                            </Heading>
                            <Box display="flex" flexWrap="wrap">
                                {recipe.images.map((image, index) => (
                                    <Box key={index} width="150px" margin="5px">
                                        <img
                                            src={image}
                                            alt={`Recipe image ${index}`}
                                            style={{ maxWidth: '100%', height: 'auto' }}
                                        />
                                    </Box>
                                ))}
                            </Box>
                        </Box>
                    )}
                </Box>
            )}
        </VStack>
    );
};

export default RecipeCreator;
