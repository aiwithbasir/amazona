import React, { useState } from 'react';
import { ScrollView, Alert } from 'react-native';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { Button, ButtonText } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';
import { Divider } from '@/components/ui/divider';
import { Input, InputField } from '@/components/ui/input';
import { FormControl, FormControlLabel, FormControlLabelText } from '@/components/ui/form-control';
import { Radio, RadioGroup, RadioIndicator, RadioIcon, RadioLabel } from '@/components/ui/radio';
import { CircleIcon } from '@/components/ui/icon';
import { Header } from '../components';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderAPI } from '../services/api';
import { router } from 'expo-router';

export default function CheckoutScreen() {
    const { items, totalAmount, clearCart } = useCart();
    const { user } = useAuth();
    const [address, setAddress] = useState({
        street: '123 Main St',
        city: 'Seattle',
        state: 'WA',
        zipCode: '98109',
        country: 'USA'
    });
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [loading, setLoading] = useState(false);

    const handlePlaceOrder = async () => {
        if (!user) return;
        setLoading(true);

        try {
            const orderData = {
                userId: user.id,
                items: items.map(item => ({
                    productId: item.productId,
                    quantity: item.quantity,
                    price: item.product?.price || 0,
                    productName: item.product?.name || '',
                    productImage: item.product?.images[0] || ''
                })),
                totalAmount,
                shippingAddress: { ...address, id: Date.now().toString() },
                status: 'pending',
                statusHistory: [{ status: 'pending', date: new Date().toISOString() }],
                paymentStatus: 'paid',
                createdAt: new Date().toISOString(),
                orderNumber: `AMZ-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(Math.random() * 10000)}`
            };

            await orderAPI.create(orderData);
            await clearCart();

            Alert.alert('Success', 'Your order has been placed!', [
                { text: 'OK', onPress: () => router.replace('/orders') }
            ]);
        } catch (error) {
            console.error('Error placing order:', error);
            Alert.alert('Error', 'Failed to place order. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box className="flex-1 bg-gray-100">
            <Header />
            <ScrollView>
                <VStack className="gap-2 p-4">
                    <Heading className="text-xl">Checkout</Heading>

                    <Box className="bg-white p-4 rounded-md">
                        <Heading className="text-md mb-2">1. Shipping Address</Heading>
                        <VStack className="gap-1">
                            <FormControl>
                                <FormControlLabel><FormControlLabelText>Street Address</FormControlLabelText></FormControlLabel>
                                <Input><InputField value={address.street} onChangeText={t => setAddress({ ...address, street: t })} /></Input>
                            </FormControl>
                            <HStack className="gap-2">
                                <FormControl className="flex-1">
                                    <FormControlLabel><FormControlLabelText>City</FormControlLabelText></FormControlLabel>
                                    <Input><InputField value={address.city} onChangeText={t => setAddress({ ...address, city: t })} /></Input>
                                </FormControl>
                                <FormControl className="flex-1">
                                    <FormControlLabel><FormControlLabelText>State</FormControlLabelText></FormControlLabel>
                                    <Input><InputField value={address.state} onChangeText={t => setAddress({ ...address, state: t })} /></Input>
                                </FormControl>
                            </HStack>
                            <HStack className="gap-2">
                                <FormControl className="flex-1">
                                    <FormControlLabel><FormControlLabelText>Zip Code</FormControlLabelText></FormControlLabel>
                                    <Input><InputField value={address.zipCode} onChangeText={t => setAddress({ ...address, zipCode: t })} /></Input>
                                </FormControl>
                                <FormControl className="flex-1">
                                    <FormControlLabel><FormControlLabelText>Country</FormControlLabelText></FormControlLabel>
                                    <Input><InputField value={address.country} onChangeText={t => setAddress({ ...address, country: t })} /></Input>
                                </FormControl>
                            </HStack>
                        </VStack>
                    </Box>

                    <Box className="bg-white p-4 rounded-md">
                        <Heading className="text-md mb-2">2. Payment Method</Heading>
                        <RadioGroup value={paymentMethod} onChange={setPaymentMethod}>
                            <VStack className="gap-1">
                                <Radio value="card">
                                    <RadioIndicator className="mr-2"><RadioIcon as={CircleIcon} /></RadioIndicator>
                                    <RadioLabel>Credit/Debit Card</RadioLabel>
                                </Radio>
                                <Radio value="cash">
                                    <RadioIndicator className="mr-2"><RadioIcon as={CircleIcon} /></RadioIndicator>
                                    <RadioLabel>Cash on Delivery</RadioLabel>
                                </Radio>
                            </VStack>
                        </RadioGroup>
                    </Box>

                    <Box className="bg-white p-4 rounded-md">
                        <Heading className="text-md mb-2">Order Summary</Heading>
                        <VStack className="gap-1">
                            <HStack className="justify-between">
                                <Text>Items:</Text>
                                <Text>${totalAmount.toFixed(2)}</Text>
                            </HStack>
                            <HStack className="justify-between">
                                <Text>Shipping:</Text>
                                <Text className="text-green-600">FREE</Text>
                            </HStack>
                            <Divider className="my-2" />
                            <HStack className="justify-between">
                                <Heading className="text-md text-red-600">Order Total:</Heading>
                                <Heading className="text-md text-red-600">${totalAmount.toFixed(2)}</Heading>
                            </HStack>
                        </VStack>

                        <Button
                            className="mt-4 bg-yellow-400"
                            onPress={handlePlaceOrder}
                            isDisabled={loading}
                        >
                            {loading ? (
                                <ButtonText className="text-black">Placing Order...</ButtonText>
                            ) : (
                                <ButtonText className="text-black">Place Your Order</ButtonText>
                            )}
                        </Button>
                    </Box>
                </VStack>
            </ScrollView>
        </Box>
    );
}
