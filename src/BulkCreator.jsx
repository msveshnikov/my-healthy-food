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
    ListItem,
    CheckboxGroup,
    Checkbox
} from '@chakra-ui/react';

const BulkCreator = () => {
    const [cuisine, setCuisine] = useState('');
    const [numTitles, setNumTitles] = useState(5);
    const [recipeTitles, setRecipeTitles] = useState([]);
    const [titleGenerating, setTitleGenerating] = useState(false);
    const [titlesError, setTitlesError] = useState('');

    const [languages, setLanguages] = useState(['en']);
    const [recipeGenerating, setRecipeGenerating] = useState(false);
    const [recipesError, setRecipesError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [generatedRecipeCount, setGeneratedRecipeCount] = useState(0);
    const [failedRecipes, setFailedRecipes] = useState([]);

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
                    cuisine: cuisine,
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
        setGeneratedRecipeCount(0);
        setFailedRecipes([]);

        if (recipeTitles.length === 0) {
            setRecipesError('No recipe titles generated. Please generate titles first.');
            setRecipeGenerating(false);
            return;
        }

        const totalRecipesToGenerate = recipeTitles.length * languages.length;
        if (totalRecipesToGenerate > 50) {
            setRecipesError(
                'Cannot generate more than 50 recipes in bulk. Reduce number of titles or selected languages.'
            );
            setRecipeGenerating(false);
            return;
        }

        let generatedCount = 0;
        let failures = [];

        for (const title of recipeTitles) {
            for (const lang of languages) {
                try {
                    const response = await fetch(API_URL + '/api/generate-recipe', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${localStorage.getItem('token')}`
                        },
                        body: JSON.stringify({
                            prompt: `${cuisine} ${title}`,
                            language: lang,
                            model: 'gemini-2.0-flash-thinking-exp-01-21',
                            temperature: 0.7,
                            deepResearch: false,
                            imageSource: 'unsplash'
                        })
                    });

                    if (!response.ok) {
                        const errorData = await response.json();
                        failures.push({
                            title: `${cuisine} ${title} (${lang})`,
                            error: errorData.error || 'Failed to generate recipe.'
                        });
                    } else {
                        generatedCount++;
                    }
                    setGeneratedRecipeCount(generatedCount);
                } catch (err) {
                    failures.push({ title: `${cuisine} ${title} (${lang})`, error: err.message });
                    setFailedRecipes(failures);
                }
            }
        }

        if (failures.length > 0) {
            setRecipesError(
                `Generated ${generatedCount} recipes with ${failures.length} failures. See details below.`
            );
            setFailedRecipes(failures);
        } else {
            setSuccessMessage(`Successfully generated ${generatedCount} recipes.`);
        }

        setRecipeGenerating(false);
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
                colorScheme="primary"
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
                        <FormLabel>Languages for Recipes</FormLabel>
                        <CheckboxGroup value={languages} onChange={(value) => setLanguages(value)}>
                            <VStack alignItems="start">
                                <Checkbox value="en">English</Checkbox>
                                <Checkbox value="es">Spanish</Checkbox>
                                <Checkbox value="pt">Portuguese</Checkbox>
                                <Checkbox value="fr">French</Checkbox>
                                <Checkbox value="de">German</Checkbox>
                                <Checkbox value="ru">Russian</Checkbox>
                                <Checkbox value="it">Italian</Checkbox>
                            </VStack>
                        </CheckboxGroup>
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
                    <Text mt={2}>
                        Generating recipes: {generatedRecipeCount} generated, please wait...
                    </Text>
                </Box>
            )}

            {failedRecipes.length > 0 && recipesError && (
                <Box mt={4}>
                    <Heading as="h3" size="sm" mb={2} color="red.500">
                        Failed Recipes:
                    </Heading>
                    <List spacing={1}>
                        {failedRecipes.map((failure, index) => (
                            <ListItem key={index} fontSize="sm" color="red.400">
                                {failure.title} - Error: {failure.error}
                            </ListItem>
                        ))}
                    </List>
                </Box>
            )}
        </Box>
    );
};

export default BulkCreator;
