import { Box, Icon, Text } from '@chakra-ui/react';
import { Link, useLocation } from 'react-router-dom';
import { FiHome, FiEdit, FiUser } from 'react-icons/fi';

export const BottomNavigationBar = () => {
    const location = useLocation();

    const navItems = [
        {
            path: '/',
            icon: FiHome,
            label: 'Home'
        },
        {
            path: '/recipe/create',
            icon: FiEdit,
            label: 'Create'
        },
        {
            path: '/profile',
            icon: FiUser,
            label: 'Profile'
        }
    ];

    return (
        <Box
            position="fixed"
            bottom="0"
            left="0"
            right="0"
            height="50px"
            bg="white"
            borderTopWidth="1px"
            display="flex"
            justifyContent="space-around"
            alignItems="center"
            zIndex={1000}
            fontSize="sm"
            sx={{
                '@supports (backdrop-filter: blur(10px))': {
                    backdropFilter: 'blur(10px)',
                    bg: 'rgba(255, 255, 255, 0.9)'
                }
            }}
        >
            {navItems.map((item) => (
                <Box
                    key={item.path}
                    as={Link}
                    to={item.path}
                    p={2}
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    opacity={location.pathname === item.path ? 1 : 0.7}
                    _hover={{ opacity: 1 }}
                >
                    <Icon as={item.icon} boxSize={5} />
                    <Text fontSize="xs">{item.label}</Text>
                </Box>
            ))}
        </Box>
    );
};
