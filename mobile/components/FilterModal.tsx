import React, { useState } from 'react';
import { Modal, Pressable } from 'react-native';
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Button, ButtonText } from "@/components/ui/button";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Heading } from "@/components/ui/heading";
import { Icon } from "@/components/ui/icon";
import { Checkbox, CheckboxIndicator, CheckboxIcon, CheckboxLabel } from "@/components/ui/checkbox";
import { CheckIcon } from "@/components/ui/icon";
import { X } from 'lucide-react-native';

interface FilterModalProps {
    isOpen: boolean;
    onClose: () => void;
    onApply: (filters: any) => void;
    currentFilters: any;
}

export const FilterModal = ({ isOpen, onClose, onApply, currentFilters }: FilterModalProps) => {
    const [priceRange, setPriceRange] = useState(currentFilters.priceRange || 'all');
    const [rating, setRating] = useState(currentFilters.rating || 'all');
    const [inStock, setInStock] = useState(currentFilters.inStock || false);

    const handleApply = () => {
        onApply({ priceRange, rating, inStock });
        onClose();
    };

    return (
        <Modal visible={isOpen} animationType="slide" transparent>
            <Box className="flex-1 bg-black/50 justify-end">
                <Box className="bg-white rounded-t-2xl p-4 h-[70%]">
                    <HStack className="justify-between items-center mb-4">
                        <Heading className="text-md">Filters</Heading>
                        <Pressable onPress={onClose}>
                            <Icon as={X} className="w-6 h-6" />
                        </Pressable>
                    </HStack>

                    <VStack className="gap-6 flex-1">
                        <VStack className="gap-4">
                            <Text className="font-bold">Price Range</Text>
                            <HStack className="gap-4 flex-wrap">
                                {['all', '0-50', '50-100', '100+'].map((range) => (
                                    <Button
                                        key={range}
                                        size="sm"
                                        variant={priceRange === range ? 'solid' : 'outline'}
                                        onPress={() => setPriceRange(range)}
                                        className="mb-2"
                                    >
                                        <ButtonText>{range === 'all' ? 'All' : `$${range}`}</ButtonText>
                                    </Button>
                                ))}
                            </HStack>
                        </VStack>

                        <VStack className="gap-4">
                            <Text className="font-bold">Rating</Text>
                            <HStack className="gap-4 flex-wrap">
                                {['all', '4', '3'].map((r) => (
                                    <Button
                                        key={r}
                                        size="sm"
                                        variant={rating === r ? 'solid' : 'outline'}
                                        onPress={() => setRating(r)}
                                        className="mb-2"
                                    >
                                        <ButtonText>{r === 'all' ? 'All' : `${r}+ Stars`}</ButtonText>
                                    </Button>
                                ))}
                            </HStack>
                        </VStack>

                        <VStack className="gap-4">
                            <Text className="font-bold">Availability</Text>
                            <Checkbox
                                value="instock"
                                isChecked={inStock}
                                onChange={(isSelected: boolean) => setInStock(isSelected)}
                            >
                                <CheckboxIndicator className="mr-2">
                                    <CheckboxIcon as={CheckIcon} />
                                </CheckboxIndicator>
                                <CheckboxLabel>In Stock Only</CheckboxLabel>
                            </Checkbox>
                        </VStack>
                    </VStack>

                    <Button onPress={handleApply} className="mt-4">
                        <ButtonText>Apply Filters</ButtonText>
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};
