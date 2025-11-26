import React, { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Spinner } from "@/components/ui/spinner";
import { Heading } from "@/components/ui/heading";
import { useLocalSearchParams } from 'expo-router';
import { Header, ProductCard } from '../../components';
import { productAPI } from '../../services/api';
import { Product } from '../../types';

export default function SearchScreen() {
    const { q, categoryId } = useLocalSearchParams();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                let response;
                if (categoryId) {
                    response = await productAPI.getByCategory(Number(categoryId));
                } else {
                    response = await productAPI.getAll();
                }

                let filtered = response.data;
                if (q) {
                    const query = (q as string).toLowerCase();
                    filtered = filtered.filter(p =>
                        p.name.toLowerCase().includes(query) ||
                        p.description.toLowerCase().includes(query)
                    );
                }
                setProducts(filtered);
            } catch (error) {
                console.error('Error searching products:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [q, categoryId]);

    return (
        <Box className="flex-1 bg-gray-100">
            <Header />
            <ScrollView>
                <Box className="p-4">
                    <Heading className="text-xl mb-4">
                        {q ? `Search results for "${q}"` : categoryId ? 'Category Results' : 'All Products'}
                    </Heading>

                    {loading ? (
                        <Box className="flex-1 justify-center items-center py-10">
                            <Spinner size="large" className="text-primary-500" />
                        </Box>
                    ) : products.length > 0 ? (
                        <Box className="flex-row flex-wrap">
                            {products.map(product => (
                                <Box key={product.id} className="w-1/2">
                                    <ProductCard product={product} />
                                </Box>
                            ))}
                        </Box>
                    ) : (
                        <Box className="flex-1 justify-center items-center py-10">
                            <Text className="text-gray-500">No products found.</Text>
                        </Box>
                    )}
                </Box>
            </ScrollView>
        </Box>
    );
}
