import { Box, Container, Heading, Text, VStack } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { API_URL } from './App';

const Terms = () => {
    const [lastUpdated, setLastUpdated] = useState('');

    useEffect(() => {
        const fetchLastUpdate = async () => {
            try {
                const response = await fetch(`${API_URL}/api/terms/last-updated`);
                const data = await response.json();
                setLastUpdated(new Date(data.lastUpdated).toLocaleDateString());
            } catch (error) {
                console.error('Error fetching terms update:', error);
                setLastUpdated(new Date().toLocaleDateString());
            }
        };
        fetchLastUpdate();
    }, []);

    return (
        <Container maxW="container.lg" py={10}>
            <VStack spacing={6} align="stretch">
                <Heading as="h1" size="xl">
                    Terms of Service - My Healthy Food
                </Heading>
                <Text>Last Updated: {lastUpdated}</Text>

                <Box>
                    <Heading as="h2" size="lg" mb={4}>
                        1. Acceptance of Terms
                    </Heading>
                    <Text mb={4}>
                        By accessing and using My Healthy Food, you agree to comply with these Terms
                        of Service and acknowledge that this agreement represents a legally binding
                        contract between you and My Healthy Food. If you do not agree with these
                        terms, please do not use the platform.
                    </Text>
                </Box>

                <Box>
                    <Heading as="h2" size="lg" mb={4}>
                        2. Use License
                    </Heading>
                    <Text mb={4}>
                        Permission is granted to temporarily access and use the recipes and
                        materials on My Healthy Food for personal, non-commercial transitory viewing
                        only. This constitutes a license to use the platform and its content under
                        the terms specified herein, not a transfer of title.
                    </Text>
                </Box>

                <Box>
                    <Heading as="h2" size="lg" mb={4}>
                        3. AI Recipe Generation Services
                    </Heading>
                    <Text mb={4}>
                        Our platform employs advanced AI algorithms to generate recipes based on
                        user prompts. While we strive to provide helpful and creative recipes, My
                        Healthy Food does not warrant that the AI-generated recipes will be
                        error-free, suitable for specific dietary needs, or to your personal taste.
                        Recipes are suggestions only and should be reviewed for ingredients and
                        preparation methods before use.
                    </Text>
                </Box>

                <Box>
                    <Heading as="h2" size="lg" mb={4}>
                        4. Recipe Accuracy & Dietary Information
                    </Heading>
                    <Text mb={4}>
                        My Healthy Food endeavors to provide helpful and relevant recipe content.
                        However, we make no guarantees regarding the accuracy, completeness, or
                        suitability of the recipes for any particular dietary needs or restrictions.
                        Users are responsible for ensuring that any recipe is appropriate for their
                        diet, allergies, and health conditions. Always check ingredients and
                        preparation methods and consult with a healthcare professional or dietician
                        if you have specific dietary concerns.
                    </Text>
                </Box>

                <Box>
                    <Heading as="h2" size="lg" mb={4}>
                        5. Features and Functionality
                    </Heading>
                    <Text mb={4}>
                        My Healthy Food offers features such as AI-powered recipe generation,
                        multi-language support, recipe rendering, social sharing, and image
                        integration. These features are subject to periodic updates, modifications,
                        and potential removal without prior notice. We strive to maintain platform
                        availability but do not guarantee uninterrupted access.
                    </Text>
                </Box>

                <Box>
                    <Heading as="h2" size="lg" mb={4}>
                        6. Liability Disclaimer
                    </Heading>
                    <Text mb={4}>
                        The recipes and content provided on My Healthy Food are for informational
                        and creative purposes only. In no event shall My Healthy Food or its
                        suppliers be liable for any direct, indirect, incidental, consequential, or
                        punitive damages arising from your use of, or inability to use, the recipes
                        or materials on this platform, including but not limited to health issues,
                        dietary problems, or unsatisfactory results from following a recipe. Your
                        use of the platform and reliance on any recipes is at your own risk.
                    </Text>
                </Box>

                <Box>
                    <Heading as="h2" size="lg" mb={4}>
                        7. Changes to Terms
                    </Heading>
                    <Text mb={4}>
                        We reserve the right to modify or replace these Terms at any time at our
                        sole discretion. We will endeavor to provide notice of significant changes.
                        Continued use of the platform following any changes signifies your
                        acceptance of the new Terms. It is your responsibility to review these Terms
                        periodically.
                    </Text>
                </Box>

                <Box>
                    <Heading as="h2" size="lg" mb={4}>
                        8. Governing Law
                    </Heading>
                    <Text mb={4}>
                        These Terms shall be governed by and construed in accordance with the laws
                        of the jurisdiction in which My Healthy Food operates, without regard to its
                        conflict of law provisions.
                    </Text>
                </Box>

                <Box>
                    <Heading as="h2" size="lg" mb={4}>
                        9. Dispute Resolution
                    </Heading>
                    <Text mb={4}>
                        Any disputes arising out of or related to these Terms or your use of My
                        Healthy Food shall be resolved through good faith negotiation. If
                        negotiation fails, disputes may be subject to binding arbitration in
                        accordance with the rules of a mutually agreed upon arbitration body, or in
                        the courts of jurisdiction governing these terms.
                    </Text>
                </Box>

                <Box>
                    <Heading as="h2" size="lg" mb={4}>
                        10. Intellectual Property Rights
                    </Heading>
                    <Text mb={4}>
                        All content, trademarks, and other intellectual property on My Healthy Food,
                        including but not limited to the platform design, logos, text, graphics, and
                        software, are owned by or licensed to My Healthy Food and are protected by
                        applicable intellectual property laws. Recipes generated by the AI are
                        provided for your personal, non-commercial use.
                    </Text>
                </Box>

                <Box>
                    <Heading as="h2" size="lg" mb={4}>
                        11. Indemnification
                    </Heading>
                    <Text mb={4}>
                        You agree to indemnify, defend, and hold harmless My Healthy Food, its
                        affiliates, officers, directors, employees, and agents from any claims,
                        damages, liabilities, costs, or expenses (including reasonable
                        attorneys&apos; fees) arising from or related to your use of the platform,
                        your recipes created or accessed through the platform, your user content, or
                        your violation of these Terms.
                    </Text>
                </Box>

                <Box>
                    <Heading as="h2" size="lg" mb={4}>
                        12. Termination
                    </Heading>
                    <Text mb={4}>
                        We reserve the right to terminate or suspend your access to My Healthy Food,
                        without prior notice or liability, for any reason, including but not limited
                        to a breach of these Terms, violation of community guidelines, or for any
                        conduct that we, in our sole discretion, believe is harmful to other users,
                        My Healthy Food, or our business interests.
                    </Text>
                </Box>
            </VStack>
        </Container>
    );
};

export default Terms;
