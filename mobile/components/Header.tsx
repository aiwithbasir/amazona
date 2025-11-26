import React from 'react';
import { Box } from "@/components/ui/box";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { Input, InputField, InputSlot, InputIcon } from "@/components/ui/input";
import { Pressable } from "@/components/ui/pressable";
import { Icon } from "@/components/ui/icon";
import { Search, ShoppingCart, Menu, Sparkle, Camera } from 'lucide-react-native';
import { router } from 'expo-router';
import { useCart } from '../context/CartContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Alert, View } from 'react-native';
import { showAlert } from '@/utils';

export const Header = () => {
    const { itemCount } = useCart();

    return (
        <View style={{ backgroundColor: '#0078d7' }} className="py-4">
            <SafeAreaView edges={['top']}>
                <Box className="px-4">
                    {/* Top Row: Logo & Icons */}
                    {/* <HStack className="justify-between items-center mb-4">
                        <HStack className="items-center gap-2">
                            <Icon as={Menu} className="text-white w-8 h-8" />
                            <Text className="text-white font-bold text-xl">Amazon</Text>
                        </HStack>

                        <HStack className="gap-4 items-center">
                            <Pressable onPress={() => router.push('/(tabs)/cart')}>
                                <Box className="relative">
                                    <Icon as={ShoppingCart} className="text-white w-8 h-8" />
                                    {itemCount > 0 && (
                                        <Box
                                            className="absolute -top-2 -right-2 bg-red-500 rounded-full w-5 h-5 justify-center items-center z-10"
                                        >
                                            <Text className="text-white text-xs font-bold">{itemCount}</Text>
                                        </Box>
                                    )}
                                </Box>
                            </Pressable>
                        </HStack>
                    </HStack> */}

                    {/* Search Bar */}

                    <Input className="bg-white rounded-full h-10"  >
                        <InputSlot className="ps-2">
                            <InputIcon as={Search} className="text-gray-500" />
                        </InputSlot>
                        <InputField placeholder="Search or ask a question" className="text-black" />

                        <InputSlot className="pe-2">
                            <Pressable onPress={() => showAlert('Find it with an image')}>
                                <InputIcon as={Camera} className="text-gray-500" />
                            </Pressable>
                        </InputSlot>
                    </Input>

                </Box>
            </SafeAreaView>
        </View>
    );
};
