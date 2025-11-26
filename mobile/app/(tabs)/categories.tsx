import React, { useEffect, useState } from 'react';
import { ScrollView, Pressable } from 'react-native';
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { Image } from "@/components/ui/image";
import { Heading } from "@/components/ui/heading";
import { Spinner } from "@/components/ui/spinner";
import { Header } from '../../components';
import { productAPI } from '../../services/api';
import { Category } from '../../types';
import { router } from 'expo-router';

export default function CategoriesScreen() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await productAPI.getCategories();
                setCategories(response.data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);

    if (loading) {
        return (
            <Box className="flex-1 justify-center items-center bg-white">
                <Spinner size="large" className="text-primary-500" />
            </Box>
        );
    }

    return (
        <Box className="flex-1 bg-white">
            <Header />
            <ScrollView contentContainerStyle={{ padding: 16 }}>
                <Heading className="text-xl mb-4">Shop by Category</Heading>
                <VStack className="gap-4">
                    {categories.map((category) => (
                        <Pressable
                            key={category.id}
                            onPress={() => router.push({ pathname: '/search', params: { categoryId: category.id } })}
                        >
                            <Box
                                className="bg-white p-4 rounded-lg shadow-sm flex-row items-center"
                            >
                                <Image
                                    source={{ uri: category.image }}
                                    alt={category.name}
                                    className="h-[60px] w-[60px] rounded-md mr-4"
                                />
                                <Text className="text-lg font-bold">{category.name}</Text>
                            </Box>
                        </Pressable>
                    ))}
                </VStack>
            </ScrollView>
        </Box>
    );
}
