import {
    Box,
    Container,
    Heading,
    Text,
    Link,
    VStack,
    UnorderedList,
    ListItem,
    Switch,
    FormControl,
    FormLabel,
    Stack
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { API_URL } from './App';

const Privacy = () => {
    const [lastUpdated, setLastUpdated] = useState('');
    const [consentSettings, setConsentSettings] = useState({
        necessary: true,
        analytics: true,
        aiProcessing: true,
        personalization: true,
        socialFeatures: false
    });

    useEffect(() => {
        const fetchLastUpdate = async () => {
            try {
                const response = await fetch(`${API_URL}/api/privacy/last-updated`);
                const data = await response.json();
                setLastUpdated(new Date(data.lastUpdated).toLocaleDateString());
            } catch {
                setLastUpdated(new Date().toLocaleDateString());
            }
        };
        fetchLastUpdate();
    }, []);

    const handleConsentChange = async (setting) => {
        const newSettings = { ...consentSettings, [setting]: !consentSettings[setting] };
        setConsentSettings(newSettings);
        try {
            await fetch(`${API_URL}/api/privacy/consent`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ setting, value: newSettings[setting] })
            });
        } catch (error) {
            console.error('Error updating privacy settings:', error);
        }
    };

    return (
        <Container maxW="container.lg" py={8}>
            <VStack spacing={6} align="stretch">
                <Heading as="h1" size="xl">
                    Privacy Policy
                </Heading>
                <Text>Last Updated: {lastUpdated}</Text>
                <Box>
                    <Heading as="h2" size="lg" mb={4}>
                        Information Collected
                    </Heading>
                    <UnorderedList spacing={2} mb={4}>
                        <ListItem>
                            Usage data, such as recipes you search for, create, and save.
                        </ListItem>
                        <ListItem>Device and browser information.</ListItem>
                        <ListItem>Cookies and similar tracking technologies.</ListItem>
                        <ListItem>
                            User account information if you register, such as username and email.
                        </ListItem>
                        <ListItem>Feedback and communication you provide to us.</ListItem>
                    </UnorderedList>
                </Box>
                <Box>
                    <Heading as="h2" size="lg" mb={4}>
                        Use of Information
                    </Heading>
                    <UnorderedList spacing={2} mb={4}>
                        <ListItem>
                            To provide and improve our recipe generation and platform services.
                        </ListItem>
                        <ListItem>
                            To personalize your experience, such as recommending recipes.
                        </ListItem>
                        <ListItem>To analyze usage and trends to enhance our platform.</ListItem>
                        <ListItem>To respond to your inquiries and provide user support.</ListItem>
                        <ListItem>
                            To send you updates and promotional materials (if you opt-in).
                        </ListItem>
                    </UnorderedList>
                </Box>
                <Box>
                    <Heading as="h2" size="lg" mb={4}>
                        AI Processing and Data Usage
                    </Heading>
                    <UnorderedList spacing={2} mb={4}>
                        <ListItem>
                            AI algorithms are used to generate recipes based on your prompts and
                            preferences.
                        </ListItem>
                        <ListItem>
                            AI processing helps in understanding user preferences to improve recipe
                            recommendations.
                        </ListItem>
                        <ListItem>
                            Anonymized and aggregated data may be used to train and improve our AI
                            models.
                        </ListItem>
                    </UnorderedList>
                </Box>
                <Box>
                    <Heading as="h2" size="lg" mb={4}>
                        Data Retention and Deletion
                    </Heading>
                    <Text mb={4}>
                        We retain your personal data only for as long as necessary to fulfill the
                        purposes outlined in this Privacy Policy, or as required by law. You can
                        request deletion of your account and associated data by contacting us.
                    </Text>
                </Box>
                <Box>
                    <Heading as="h2" size="lg" mb={4}>
                        Data Security
                    </Heading>
                    <Text mb={4}>
                        We implement reasonable security measures to protect your personal
                        information from unauthorized access, use, or disclosure. These measures
                        include encryption, firewalls, and secure server facilities.
                    </Text>
                </Box>
                <Box>
                    <Heading as="h2" size="lg" mb={4}>
                        Third-Party Disclosure
                    </Heading>
                    <Text mb={4}>
                        We may share your information with third-party service providers who assist
                        us in operating our platform, conducting our business, or serving you. These
                        providers are contractually obligated to protect your information. We do not
                        sell your personal information to third parties.
                    </Text>
                </Box>
                <Box>
                    <Heading as="h2" size="lg" mb={4}>
                        Your Rights
                    </Heading>
                    <Text mb={4}>
                        You have the right to access, correct, or delete your personal data. You may
                        also have the right to object to or restrict certain processing of your
                        data. To exercise these rights or for any privacy-related inquiries, please
                        contact us at{' '}
                        <Link href="mailto:privacy@myhealthy.food" color="blue.500">
                            privacy@myhealthy.food
                        </Link>
                        .
                    </Text>
                </Box>
                <Box>
                    <Heading as="h2" size="lg" mb={4}>
                        Policy Modifications
                    </Heading>
                    <Text mb={4}>
                        We may update this Privacy Policy from time to time. We will notify you of
                        any significant changes by posting the new policy on our platform and
                        updating the &quot;Last Updated&quot; date.
                    </Text>
                </Box>
                <Box>
                    <Heading as="h2" size="lg" mb={4}>
                        Your Privacy Choices
                    </Heading>
                    <Stack spacing={4}>
                        <FormControl display="flex" alignItems="center">
                            <FormLabel htmlFor="necessary" mb="0">
                                Essential Services
                            </FormLabel>
                            <Switch
                                id="necessary"
                                isChecked={consentSettings.necessary}
                                isDisabled
                            />
                        </FormControl>
                        <FormControl display="flex" alignItems="center">
                            <FormLabel htmlFor="analytics" mb="0">
                                Analytics
                            </FormLabel>
                            <Switch
                                id="analytics"
                                isChecked={consentSettings.analytics}
                                onChange={() => handleConsentChange('analytics')}
                            />
                        </FormControl>
                        <FormControl display="flex" alignItems="center">
                            <FormLabel htmlFor="aiProcessing" mb="0">
                                AI Processing
                            </FormLabel>
                            <Switch
                                id="aiProcessing"
                                isChecked={consentSettings.aiProcessing}
                                onChange={() => handleConsentChange('aiProcessing')}
                            />
                        </FormControl>
                        <FormControl display="flex" alignItems="center">
                            <FormLabel htmlFor="personalization" mb="0">
                                Personalization
                            </FormLabel>
                            <Switch
                                id="personalization"
                                isChecked={consentSettings.personalization}
                                onChange={() => handleConsentChange('personalization')}
                            />
                        </FormControl>
                        <FormControl display="flex" alignItems="center">
                            <FormLabel htmlFor="socialFeatures" mb="0">
                                Social Features
                            </FormLabel>
                            <Switch
                                id="socialFeatures"
                                isChecked={consentSettings.socialFeatures}
                                onChange={() => handleConsentChange('socialFeatures')}
                            />
                        </FormControl>
                    </Stack>
                </Box>
                <Box>
                    <Heading as="h2" size="lg" mb={4}>
                        Contact Us
                    </Heading>
                    <Text mb={4}>
                        If you have any questions or concerns about this Privacy Policy or our data
                        practices, please contact us at{' '}
                        <Link href="mailto:privacy@myhealthy.food" color="blue.500">
                            privacy@myhealthy.food
                        </Link>
                        .
                    </Text>
                </Box>
            </VStack>
        </Container>
    );
};

export default Privacy;
