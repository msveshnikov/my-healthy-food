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
                        {recipe.recipeData?.title || recipe.title}
                    </Heading>
                    <IconButton
                        aria-label="Copy Recipe"
                        icon={<CopyIcon />}
                        onClick={() =>
                            handleCopyToClipboard(JSON.stringify(recipe.recipeData, null, 2))
                        }
                        size="md"
                    />
                </Flex>
                {recipe.recipeData?.seoDescription && (
                    <Text fontSize="md" color="gray.600" mb={5}>
                        {recipe.recipeData?.seoDescription}
                    </Text>
                )}
                {recipe.recipeData?.images && recipe.recipeData.images.length > 0 && (
                    <Box mb={5}>
                        <Image
                            src={recipe.recipeData.images[0]}
                            alt={recipe.recipeData?.title || recipe.title}
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
                    <Text fontSize="lg">{recipe.recipeData?.description}</Text>
                </Box>

                {recipe.recipeData?.prepTime ||
                    recipe.recipeData?.cookTime ||
                    recipe.recipeData?.totalTime ||
                    recipe.recipeData?.servings ||
                    recipe.recipeData?.cuisine ||
                    recipe.recipeData?.dishType ||
                    recipe.recipeData?.mealType ||
                    recipe.recipeData?.calories ||
                    (recipe.recipeData?.dietaryRestrictions &&
                        recipe.recipeData.dietaryRestrictions.length > 0 && (
                            <Box mb={5}>
                                <Heading as="h2" size="xl" mb={3}>
                                    Details
                                </Heading>
                                <Wrap spacing="2" mt={2}>
                                    {recipe.recipeData?.prepTime && (
                                        <WrapItem>
                                            <Tag colorScheme="blue">
                                                Prep Time: {recipe.recipeData.prepTime}
                                            </Tag>
                                        </WrapItem>
                                    )}
                                    {recipe.recipeData?.cookTime && (
                                        <WrapItem>
                                            <Tag colorScheme="blue">
                                                Cook Time: {recipe.recipeData.cookTime}
                                            </Tag>
                                        </WrapItem>
                                    )}
                                    {recipe.recipeData?.totalTime && (
                                        <WrapItem>
                                            <Tag colorScheme="blue">
                                                Total Time: {recipe.recipeData.totalTime}
                                            </Tag>
                                        </WrapItem>
                                    )}
                                    {recipe.recipeData?.servings && (
                                        <WrapItem>
                                            <Tag colorScheme="blue">
                                                Servings: {recipe.recipeData.servings}
                                            </Tag>
                                        </WrapItem>
                                    )}
                                    {recipe.recipeData?.cuisine && (
                                        <WrapItem>
                                            <Tag colorScheme="blue">
                                                Cuisine: {recipe.recipeData.cuisine}
                                            </Tag>
                                        </WrapItem>
                                    )}
                                    {recipe.recipeData?.dishType && (
                                        <WrapItem>
                                            <Tag colorScheme="blue">
                                                Dish Type: {recipe.recipeData.dishType}
                                            </Tag>
                                        </WrapItem>
                                    )}
                                    {recipe.recipeData?.mealType && (
                                        <WrapItem>
                                            <Tag colorScheme="blue">
                                                Meal Type: {recipe.recipeData.mealType}
                                            </Tag>
                                        </WrapItem>
                                    )}
                                    {recipe.recipeData?.calories && (
                                        <WrapItem>
                                            <Tag colorScheme="blue">
                                                Calories: {recipe.recipeData.calories}
                                            </Tag>
                                        </WrapItem>
                                    )}
                                    {recipe.recipeData?.dietaryRestrictions &&
                                        recipe.recipeData.dietaryRestrictions.map(
                                            (restriction, index) => (
                                                <WrapItem key={index}>
                                                    <Tag colorScheme="blue">{restriction}</Tag>
                                                </WrapItem>
                                            )
                                        )}
                                </Wrap>
                            </Box>
                        ))}

                <Box mb={5}>
                    <Heading as="h2" size="xl" mb={3}>
                        Ingredients
                    </Heading>
                    <List spacing={3}>
                        {recipe.recipeData?.ingredients &&
                            recipe.recipeData.ingredients.map((ingredient, index) => (
                                <ListItem key={index} fontSize="lg">
                                    {ingredient}
                                </ListItem>
                            ))}
                    </List>
                </Box>

                <Box mb={5}>
                    <Heading as="h2" size="xl" mb={3}>
                        Instructions
                    </Heading>
                    <List spacing={5} as="ol">
                        {recipe.recipeData?.instructions &&
                            recipe.recipeData.instructions.map((instruction, index) => (
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
