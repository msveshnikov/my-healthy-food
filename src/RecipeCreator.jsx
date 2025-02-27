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
    useToast,
    Grid,
    GridItem,
    List,
    ListItem,
    Image,
    Flex,
    Divider,
    Tag,
    Wrap,
    WrapItem
} from '@chakra-ui/react';
import { API_URL } from './App';

const RecipeCreator = () => {
    const [prompt, setPrompt] = useState('');
    const [language, setLanguage] = useState('en');
    const [model, setModel] = useState('gemini-2.0-flash-thinking-exp-01-21');
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
                body: JSON.stringify({ prompt, language, model, deepResearch: true })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to generate recipe');
            }

            const data = await response.json();
            setRecipe(data.recipeData || data);
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

                    <Button type="submit" colorScheme="primary" isLoading={loading}>
                        Generate Recipe
                    </Button>
                </VStack>
            </form>

            {loading && (
                <Box textAlign="center" mt={8}>
                    <Spinner size="lg" color="primary.500" />
                    <Text mt={2}>Generating recipe, please wait...</Text>
                </Box>
            )}

            {recipe && (
                <Box mt={10} p={8} shadow="md" borderWidth="1px" borderRadius="md">
                    <Heading as="h3" size="2xl" mb={6} textAlign="center">
                        {recipe.title}
                    </Heading>

                    <Grid templateColumns={{ base: '1fr', md: '1fr 2fr' }} gap={6}>
                        <GridItem>
                            {recipe.imageUrl && (
                                <Box mb={4}>
                                    <Box mb={2} borderRadius="md" overflow="hidden">
                                        <Image
                                            src={recipe.imageUrl}
                                            alt={recipe.title}
                                            maxWidth="100%"
                                            maxHeight="300px"
                                            objectFit="cover"
                                        />
                                    </Box>
                                </Box>
                            )}
                        </GridItem>
                        <GridItem>
                            {recipe.description && (
                                <Text fontSize="lg" mb={6}>
                                    {recipe.description}
                                </Text>
                            )}

                            <Flex direction="column" mb={4}>
                                <Wrap spacing="2" mb={2}>
                                    {recipe.cuisine && (
                                        <WrapItem>
                                            <Tag colorScheme="gray">Cuisine: {recipe.cuisine}</Tag>
                                        </WrapItem>
                                    )}
                                    {recipe.category && (
                                        <WrapItem>
                                            <Tag colorScheme="gray">
                                                Category: {recipe.category}
                                            </Tag>
                                        </WrapItem>
                                    )}
                                </Wrap>
                                <Wrap spacing="2">
                                    {recipe.prepTime && (
                                        <WrapItem>
                                            <Tag colorScheme="gray">
                                                Prep Time: {recipe.prepTime}
                                            </Tag>
                                        </WrapItem>
                                    )}
                                    {recipe.cookTime && (
                                        <WrapItem>
                                            <Tag colorScheme="gray">
                                                Cook Time: {recipe.cookTime}
                                            </Tag>
                                        </WrapItem>
                                    )}
                                    {recipe.totalTime && (
                                        <WrapItem>
                                            <Tag colorScheme="gray">
                                                Total Time: {recipe.totalTime}
                                            </Tag>
                                        </WrapItem>
                                    )}
                                    {recipe.servings && (
                                        <WrapItem>
                                            <Tag colorScheme="gray">
                                                Servings: {recipe.servings}
                                            </Tag>
                                        </WrapItem>
                                    )}
                                </Wrap>
                            </Flex>
                            <Divider mb={4} />

                            {recipe.ingredients && recipe.ingredients.length > 0 && (
                                <Box mb={6}>
                                    <Heading as="h4" size="md" mb={3}>
                                        Ingredients
                                    </Heading>
                                    <List spacing={2}>
                                        {recipe.ingredients.map((ingredient, index) => (
                                            <ListItem key={index}>
                                                {ingredient.quantity && `${ingredient.quantity} `}
                                                {ingredient.unit && `${ingredient.unit} `}
                                                {ingredient.name}
                                            </ListItem>
                                        ))}
                                    </List>
                                </Box>
                            )}
                            <Divider mb={4} />

                            {recipe.instructions && recipe.instructions.length > 0 && (
                                <Box>
                                    <Heading as="h4" size="md" mb={3}>
                                        Instructions
                                    </Heading>
                                    <List spacing={3} as="ol">
                                        {recipe.instructions.map((instruction, index) => (
                                            <ListItem key={index} as="li" value={index + 1}>
                                                {instruction}
                                            </ListItem>
                                        ))}
                                    </List>
                                </Box>
                            )}
                        </GridItem>
                    </Grid>
                </Box>
            )}
        </VStack>
    );
};

export default RecipeCreator;
