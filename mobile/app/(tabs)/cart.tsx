import React from 'react';
import { ScrollView } from 'react-native';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { Button, ButtonText } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';
import { Divider } from '@/components/ui/divider';
import { Header, CartItem, EmptyState } from '../../components';
import { useCart } from '../../context/CartContext';
import { ShoppingCart } from 'lucide-react-native';
import { router } from 'expo-router';
import { useAuth } from '../../context/AuthContext';

export default function CartScreen() {
    const { items, totalAmount, itemCount } = useCart();
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return (
            <Box className="flex-1 bg-white">
                <Header />
                <EmptyState
                    icon={ShoppingCart}
                    title="Your Cart is Empty"
                    message="Sign in to see your cart items"
                    actionLabel="Sign In"
                    onAction={() => router.push('/(auth)/login')}
                />
            </Box>
        );
    }

    if (items.length === 0) {
        return (
            <Box className="flex-1 bg-white">
                <Header />
                <EmptyState
                    icon={ShoppingCart}
                    title="Your Amazon Cart is empty"
                    message="Shop today's deals"
                />
            </Box>
        );
    }

    return (
        <Box className="flex-1 bg-gray-100">
            <Header />
            <ScrollView>
                <VStack className="gap-2 p-4">
                    <Box className="bg-white p-4 rounded-md">
                        <HStack className="justify-between items-center mb-2">
                            <Text className="text-lg">Subtotal ({itemCount} items):</Text>
                            <Text className="text-xl font-bold">${totalAmount.toFixed(2)}</Text>
                        </HStack>
                        <Button
                            className="bg-yellow-400"
                            onPress={() => router.push('/checkout')}
                            size="lg"
                        >
                            <ButtonText className="text-black">Proceed to Checkout</ButtonText>
                        </Button>
                    </Box>

                    <VStack className="gap-1">
                        {items.map((item) => (
                            <CartItem key={item.productId} item={item} />
                        ))}
                    </VStack>
                </VStack>
            </ScrollView>
        </Box>
    );
}
