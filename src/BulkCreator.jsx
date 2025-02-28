import { useState } from 'react';
import { API_URL } from './App';
import {
    Box,
    Heading,
    FormControl,
    FormLabel,
    NumberInput,
    NumberInputField,
    Button,
    Text,
    Spinner,
    Alert,
    AlertIcon,
    AlertDescription,
    VStack,
    Select,
    List,
    ListItem
} from '@chakra-ui/react';

const BulkCreator = () => {
    const [cuisine, setCuisine] = useState('');
    const [numTitles, setNumTitles] = useState(5);
    const [recipeTitles, setRecipeTitles] = useState([]);
    const [titleGenerating, setTitleGenerating] = useState(false);
    const [titlesError, setTitlesError] = useState('');

    const [language, setLanguage] = useState('en');
    const [count, setCount] = useState(1);
    const [recipeGenerating, setRecipeGenerating] = useState(false);
    const [recipesError, setRecipesError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleGenerateTitles = async () => {
        setTitleGenerating(true);
        setTitlesError('');
        setRecipeTitles([]);

        try {
            const response = await fetch(API_URL + '/api/generate-recipe-titles', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    prompt: cuisine,
                    count: numTitles,
                    model: 'gemini-2.0-flash-thinking-exp-01-21'
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to generate recipe titles.');
            }

            const data = await response.json();
            setRecipeTitles(data.titles);
        } catch (err) {
            setTitlesError(err.message);
        } finally {
            setTitleGenerating(false);
        }
    };

    const handleBulkGenerate = async () => {
        setRecipeGenerating(true);
        setRecipesError('');
        setSuccessMessage('');

        if (recipeTitles.length === 0) {
            setRecipesError('No recipe titles generated. Please generate titles first.');
            setRecipeGenerating(false);
            return;
        }

        try {
            const generatedRecipesCount = recipeTitles.length * parseInt(count, 10);
            if (generatedRecipesCount > 50) {
                setRecipesError(
                    'Cannot generate more than 50 recipes in bulk. Adjust number of titles or recipes per title.'
                );
                setRecipeGenerating(false);
                return;
            }

            const response = await fetch('/api/generate-bulk-recipes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    prompt: recipeTitles.join(', '), // Joining titles as prompt for bulk generation
                    language: language,
                    model: 'gemini-2.0-flash-thinking-exp-01-21',
                    temperature: 0.7,
                    deepResearch: false,
                    imageSource: 'unsplash',
                    count: count // Number of recipes per title (currently using count as total recipes, adjust as needed)
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to generate recipes.');
            }

            const data = await response.json();
            setSuccessMessage(`Successfully generated ${data.recipeCount} recipes.`);
        } catch (err) {
            setRecipesError(err.message);
        } finally {
            setRecipeGenerating(false);
        }
    };

    return (
        <Box p={5} maxWidth="container.md" mx="auto">
            <Heading as="h2" size="lg" mb={4}>
                Bulk Recipe Creator
            </Heading>

            {titlesError && (
                <Alert status="error" mb={4}>
                    <AlertIcon />
                    <AlertDescription>{titlesError}</AlertDescription>
                </Alert>
            )}

            {recipesError && (
                <Alert status="error" mb={4}>
                    <AlertIcon />
                    <AlertDescription>{recipesError}</AlertDescription>
                </Alert>
            )}

            {successMessage && (
                <Alert status="success" mb={4}>
                    <AlertIcon />
                    <AlertDescription>{successMessage}</AlertDescription>
                </Alert>
            )}

            <FormControl mb={4}>
                <FormLabel>Cuisine</FormLabel>
                <Select
                    placeholder="Select cuisine"
                    value={cuisine}
                    onChange={(e) => setCuisine(e.target.value)}
                >
                    <option value="Italian">Italian</option>
                    <option value="Mexican">Mexican</option>
                    <option value="Indian">Indian</option>
                    <option value="Chinese">Chinese</option>
                    <option value="French">French</option>
                    <option value="Japanese">Japanese</option>
                    <option value="Thai">Thai</option>
                    <option value="Greek">Greek</option>
                    <option value="Spanish">Spanish</option>
                    <option value="American">American</option>
                </Select>
            </FormControl>

            <FormControl mb={4}>
                <FormLabel>Number of Recipe Titles</FormLabel>
                <NumberInput
                    min={1}
                    max={10}
                    value={numTitles}
                    onChange={(valueString) => setNumTitles(parseInt(valueString, 10))}
                >
                    <NumberInputField />
                </NumberInput>
            </FormControl>

            <Button
                colorScheme="blue"
                onClick={handleGenerateTitles}
                isLoading={titleGenerating}
                loadingText="Generating Titles"
                mb={4}
            >
                Generate Recipe Titles
            </Button>

            {titleGenerating && (
                <Box mt={4} textAlign="center">
                    <Spinner size="lg" />
                    <Text mt={2}>Generating recipe titles, please wait...</Text>
                </Box>
            )}

            {recipeTitles.length > 0 && (
                <Box mb={4}>
                    <Heading as="h3" size="md" mb={2}>
                        Generated Recipe Titles:
                    </Heading>
                    <List spacing={3}>
                        {recipeTitles.map((title, index) => (
                            <ListItem key={index}>{title}</ListItem>
                        ))}
                    </List>
                </Box>
            )}

            {recipeTitles.length > 0 && (
                <VStack align="start" spacing={4} mb={4}>
                    <Heading as="h3" size="md" mb={2}>
                        Recipe Generation Options:
                    </Heading>

                    <FormControl>
                        <FormLabel>Language for Recipes</FormLabel>
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

                    <FormControl>
                        <FormLabel>Number of Recipes per Title</FormLabel>
                        <NumberInput
                            min={1}
                            max={5}
                            value={count}
                            onChange={(valueString) => setCount(parseInt(valueString, 10))}
                        >
                            <NumberInputField />
                        </NumberInput>
                    </FormControl>
                </VStack>
            )}

            {recipeTitles.length > 0 && (
                <Button
                    colorScheme="green"
                    onClick={handleBulkGenerate}
                    isLoading={recipeGenerating}
                    loadingText="Generating Recipes"
                    disabled={recipeTitles.length === 0}
                >
                    Generate Recipes
                </Button>
            )}

            {recipeGenerating && (
                <Box mt={4} textAlign="center">
                    <Spinner size="lg" />
                    <Text mt={2}>Generating recipes, please wait...</Text>
                </Box>
            )}
        </Box>
    );
};

export default BulkCreator;
