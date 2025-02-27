import { useState, useEffect } from 'react';
import {
    Box,
    VStack,
    Heading,
    Text,
    Spinner,
    Alert,
    AlertIcon,
    Input,
    InputGroup,
    InputLeftElement,
    SimpleGrid
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { SearchIcon } from '@chakra-ui/icons';
import { API_URL } from './App';

const RecipeList = () => {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            setDebouncedSearchQuery(searchQuery);
        }, 500);
        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery]);

    useEffect(() => {
        setLoading(true);
        setError(null);
        const fetchRecipes = async () => {
            try {
                const response = await fetch(
                    `${API_URL}/api/recipes?search=${debouncedSearchQuery}`
                );
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setRecipes(data);
                setLoading(false);
            } catch (e) {
                setError(e);
                setLoading(false);
            }
        };

        fetchRecipes();
    }, [debouncedSearchQuery]);

    if (loading) {
        return (
            <Box textAlign="center" py={10}>
                <Spinner size="lg" />
            </Box>
        );
    }

    if (error) {
        return (
            <Alert status="error" mt={4}>
                <AlertIcon />
                <Text>Error loading recipes: {error.message}</Text>
            </Alert>
        );
    }

    return (
        <VStack spacing={8} align="stretch">
            <Heading as="h2" size="lg">
                Explore Recipes
            </Heading>
            <InputGroup>
                <InputLeftElement pointerEvents="none">
                    <SearchIcon color="gray.300" />
                </InputLeftElement>
                <Input
                    placeholder="Search recipes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </InputGroup>
            {recipes.length === 0 && !loading ? (
                <Text>No recipes found.</Text>
            ) : (
                <SimpleGrid columns={{ sm: 1, md: 2, lg: 3 }} spacing={10}>
                    {recipes.map((recipe) => (
                        <Box key={recipe._id} p={5} shadow="md" borderWidth="1px" borderRadius="md">
                            <Link to={`/recipe/${recipe.slug || recipe._id}`}>
                                <Heading fontSize="xl">{recipe.title}</Heading>
                                <Text mt={4} noOfLines={3} color="gray.600">
                                    {recipe.description}
                                </Text>
                            </Link>
                        </Box>
                    ))}
                </SimpleGrid>
            )}
        </VStack>
    );
};

export default RecipeList;
