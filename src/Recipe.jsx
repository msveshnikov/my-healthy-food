import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
    Box,
    Heading,
    Text,
    Image,
    List,
    ListItem,
    Divider,
    Container,
    Spinner,
    Flex,
    IconButton,
    useToast,
    Tag,
    Wrap,
    WrapItem
} from '@chakra-ui/react';
import { API_URL } from './App';
import { CopyIcon } from '@chakra-ui/icons';

const Recipe = () => {
    const { slug } = useParams();
    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const toast = useToast();

    useEffect(() => {
        const fetchRecipe = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(`${API_URL}/api/recipes/${slug}`);
                if (!response.ok) {
                    if (response.status === 404) {
                        setError('Recipe not found');
                    } else {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                }
                const data = await response.json();
                setRecipe(data);
            } catch (e) {
                console.error('Could not fetch recipe', e);
                setError('Failed to load recipe. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchRecipe();
    }, [slug]);

    const handleCopyToClipboard = async (text) => {
        try {
            await navigator.clipboard.writeText(text);
            toast({
                title: 'Recipe copied to clipboard!',
                status: 'success',
                duration: 3000,
                isClosable: true
            });
        } catch (err) {
            console.error('Failed to copy text: ', err);
            toast({
                title: 'Copy failed',
                description: 'Could not copy recipe to clipboard.',
                status: 'error',
                duration: 3000,
                isClosable: true
            });
        }
    };

    if (loading) {
        return (
            <Flex justify="center" align="center" height="80vh">
                <Spinner size="xl" />
            </Flex>
        );
    }

    if (error) {
        return (
            <Container textAlign="center" py={8}>
                <Heading as="h2" size="lg" mb={4}>
                    Error
                </Heading>
                <Text color="red.500">{error}</Text>
            </Container>
        );
    }

    if (!recipe) {
        return null;
    }

    return (
        <Container maxW="container.md" py={8}>
            <Box>
                <Flex justify="space-between" alignItems="center" mb={4}>
                    <Heading as="h1" size="2xl">
                        {recipe.title}
                    </Heading>
                    <IconButton
                        aria-label="Copy Recipe"
                        icon={<CopyIcon />}
                        onClick={() => handleCopyToClipboard(JSON.stringify(recipe, null, 2))}
                        size="md"
                    />
                </Flex>
                {recipe.description && (
                    <Text fontSize="md" color="gray.600" mb={5}>
                        {recipe.description}
                    </Text>
                )}
                {recipe.imageUrl && (
                    <Box mb={5}>
                        <Image
                            src={recipe.imageUrl}
                            alt={recipe.title}
                            borderRadius="md"
                            width="100%"
                            maxHeight="500px"
                            objectFit="cover"
                        />
                    </Box>
                )}

                <Divider mb={5} />

                <Box mb={5}>
                    <Heading as="h2" size="xl" mb={3}>
                        Description
                    </Heading>
                    <Text fontSize="lg">{recipe.description}</Text>
                </Box>

                {recipe.prepTime ||
                recipe.cookTime ||
                recipe.totalTime ||
                recipe.servings ||
                recipe.cuisine ||
                recipe.category ||
                recipe.dietaryRestrictions?.length > 0 ? (
                    <Box mb={5}>
                        <Heading as="h2" size="xl" mb={3}>
                            Details
                        </Heading>
                        <Wrap spacing="2" mt={2}>
                            {recipe.prepTime && (
                                <WrapItem>
                                    <Tag colorScheme="blue">Prep Time: {recipe.prepTime}</Tag>
                                </WrapItem>
                            )}
                            {recipe.cookTime && (
                                <WrapItem>
                                    <Tag colorScheme="blue">Cook Time: {recipe.cookTime}</Tag>
                                </WrapItem>
                            )}
                            {recipe.totalTime && (
                                <WrapItem>
                                    <Tag colorScheme="blue">Total Time: {recipe.totalTime}</Tag>
                                </WrapItem>
                            )}
                            {recipe.servings && (
                                <WrapItem>
                                    <Tag colorScheme="blue">Servings: {recipe.servings}</Tag>
                                </WrapItem>
                            )}
                            {recipe.cuisine && (
                                <WrapItem>
                                    <Tag colorScheme="blue">Cuisine: {recipe.cuisine}</Tag>
                                </WrapItem>
                            )}
                            {recipe.category && (
                                <WrapItem>
                                    <Tag colorScheme="blue">Category: {recipe.category}</Tag>
                                </WrapItem>
                            )}
                            {recipe.dietaryRestrictions &&
                                recipe.dietaryRestrictions.map((restriction, index) => (
                                    <WrapItem key={index}>
                                        <Tag colorScheme="blue">{restriction}</Tag>
                                    </WrapItem>
                                ))}
                        </Wrap>
                    </Box>
                ) : null}

                <Box mb={5}>
                    <Heading as="h2" size="xl" mb={3}>
                        Ingredients
                    </Heading>
                    <List spacing={3}>
                        {recipe.ingredients &&
                            recipe.ingredients.map((ingredient, index) => (
                                <ListItem key={index} fontSize="lg">
                                    {ingredient.quantity && ingredient.unit
                                        ? `${ingredient.quantity} ${ingredient.unit} ${ingredient.name}`
                                        : ingredient.name}
                                </ListItem>
                            ))}
                    </List>
                </Box>

                <Box mb={5}>
                    <Heading as="h2" size="xl" mb={3}>
                        Instructions
                    </Heading>
                    <List spacing={5} as="ol">
                        {recipe.instructions &&
                            recipe.instructions.map((instruction, index) => (
                                <ListItem key={index} fontSize="lg">
                                    {instruction}
                                </ListItem>
                            ))}
                    </List>
                </Box>
            </Box>
        </Container>
    );
};

export default Recipe;
