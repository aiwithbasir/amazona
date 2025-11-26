import React from 'react';
import { ScrollView } from 'react-native';
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { Button, ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Avatar, AvatarFallbackText } from "@/components/ui/avatar";
import { Icon } from "@/components/ui/icon";
import { Pressable } from "@/components/ui/pressable";
import { Divider } from "@/components/ui/divider";
import { Header } from '../../components';
import { useAuth } from '../../context/AuthContext';
import { router } from 'expo-router';
import { Package, MapPin, Heart, LogOut, ChevronRight } from 'lucide-react-native';

export default function ProfileScreen() {
    const { user, logout, isAuthenticated } = useAuth();

    const handleLogout = async () => {
        await logout();
        router.replace('/');
    };

    if (!isAuthenticated) {
        return (
            <Box className="flex-1 bg-white justify-center items-center p-4">
                <Heading className="text-xl mb-4">Profile</Heading>
                <Text className="mb-4 text-center">Sign in to view your profile, orders, and addresses.</Text>
                <Button onPress={() => router.push('/(auth)/login')} className="bg-yellow-400 w-full">
                    <ButtonText className="text-black">Sign In</ButtonText>
                </Button>
            </Box>
        );
    }

    const menuItems = [
        { icon: Package, label: 'Your Orders', route: '/orders' },
        { icon: Heart, label: 'Your Wish List', route: '/wishlist' },
        { icon: MapPin, label: 'Your Addresses', route: '/addresses' },
    ];

    return (
        <Box className="flex-1 bg-gray-100">
            <Header />
            <ScrollView>
                <Box className="bg-white p-4 mb-2">
                    <HStack className="gap-4 items-center">
                        <Avatar className="bg-gray-200" size="lg">
                            <AvatarFallbackText>{user?.name}</AvatarFallbackText>
                        </Avatar>
                        <VStack>
                            <Text className="text-lg font-bold">Hello, {user?.name}</Text>
                            <Text className="text-gray-500">{user?.email}</Text>
                        </VStack>
                    </HStack>
                </Box>

                <Box className="bg-white px-4 py-2 mb-2">
                    <Heading className="text-md mb-2">Your Account</Heading>
                    <VStack className="divide-y divide-gray-200">
                        {menuItems.map((item, index) => (
                            <Pressable
                                key={index}
                                onPress={() => router.push(item.route as any)}
                                className="py-4"
                            >
                                <HStack className="justify-between items-center">
                                    <HStack className="gap-4 items-center">
                                        <Icon as={item.icon} className="text-gray-600" />
                                        <Text className="text-md">{item.label}</Text>
                                    </HStack>
                                    <Icon as={ChevronRight} className="text-gray-400 w-4 h-4" />
                                </HStack>
                            </Pressable>
                        ))}
                    </VStack>
                </Box>

                <Box className="p-4">
                    <Button variant="outline" onPress={handleLogout} className="border-gray-300 bg-white">
                        <ButtonText className="text-black">Sign Out</ButtonText>
                    </Button>
                </Box>
            </ScrollView>
        </Box>
    );
}
