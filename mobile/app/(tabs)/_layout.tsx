import { Tabs } from 'expo-router';
import { Icon } from '@/components/ui/icon';
import { Home, Layers, ShoppingCart, User } from 'lucide-react-native';
import { useCart } from '../../context/CartContext';

export default function TabLayout() {
    const { itemCount } = useCart();

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: '#007185',
                tabBarInactiveTintColor: '#000000',
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    headerShown: false,
                    title: 'Home',
                    tabBarIcon: ({ color }) => <Icon as={Home} color={color} />,
                }}
            />
            <Tabs.Screen
                name="categories"
                options={{
                    headerShown: false,
                    // tabBarStyle: { display: 'none' },
                    title: 'Categories',
                    tabBarIcon: ({ color }) => <Icon as={Layers} color={color} />,
                }}
            />
            <Tabs.Screen
                name="cart"
                options={{
                    headerShown: false,
                    title: 'Cart',
                    tabBarIcon: ({ color }) => <Icon as={ShoppingCart} color={color} />,
                    tabBarBadge: itemCount > 0 ? itemCount : undefined,
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    headerShown: false,
                    title: 'Profile',
                    tabBarIcon: ({ color }) => <Icon as={User} color={color} />,
                }}
            />
            <Tabs.Screen
                name="search"
                options={{
                    headerShown: false,
                    href: null,
                    title: 'Search',
                    tabBarIcon: ({ color }) => <Icon as={User} color={color} />,
                }}
            />
        </Tabs>
    );
}
