import { useState } from 'react';
import {
    Box,
    Heading,
    FormControl,
    FormLabel,
    Select,
    NumberInput,
    NumberInputField,
    Button,
    Text,
    Spinner,
    Alert,
    AlertIcon,
    AlertDescription
} from '@chakra-ui/react';

const BulkCreator = () => {
    const [cuisine, setCuisine] = useState('');
    const [language, setLanguage] = useState('en');
    const [count, setCount] = useState(10);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleBulkGenerate = async () => {
        setLoading(true);
        setError('');
        setSuccessMessage('');

        try {
            const response = await fetch('/api/generate-bulk-recipes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    prompt: cuisine,
                    language: language,
                    model: 'gemini-2.0-flash-thinking-exp-01-21',
                    temperature: 0.7,
                    deepResearch: false,
                    imageSource: 'unsplash',
                    count: count
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to generate recipes.');
            }

            const data = await response.json();
            setSuccessMessage(`Successfully generated ${data.recipeCount} recipes.`);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box p={5} maxWidth="container.md" mx="auto">
            <Heading as="h2" size="lg" mb={4}>
                Bulk Recipe Creator
            </Heading>

            {error && (
                <Alert status="error" mb={4}>
                    <AlertIcon />
                    <AlertDescription>{error}</AlertDescription>
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

            <FormControl mb={4}>
                <FormLabel>Number of Recipes</FormLabel>
                <NumberInput
                    min={1}
                    max={50}
                    value={count}
                    onChange={(valueString) => setCount(parseInt(valueString, 10))}
                >
                    <NumberInputField />
                </NumberInput>
            </FormControl>

            <Button
                colorScheme="blue"
                onClick={handleBulkGenerate}
                isLoading={loading}
                loadingText="Generating Recipes"
            >
                Generate Bulk Recipes
            </Button>

            {loading && (
                <Box mt={4} textAlign="center">
                    <Spinner size="lg" />
                    <Text mt={2}>Generating recipes, please wait...</Text>
                </Box>
            )}
        </Box>
    );
};

export default BulkCreator;
