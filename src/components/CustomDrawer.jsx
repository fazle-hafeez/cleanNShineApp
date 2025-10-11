import React, { useContext } from 'react';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { View, Text, TouchableOpacity } from 'react-native';
import { AuthContext } from '../context/AuthContexts';
import { useRouter } from 'expo-router';
import Ionicons from "@expo/vector-icons/Ionicons";

export default function CustomDrawerContent(props) {
    const { logout } = useContext(AuthContext);
    const router = useRouter()
    const handleLogout = async () => {
        await logout();
        router.replace("/")

    };

    return (
        <DrawerContentScrollView {...props} className="flex-1 bg-white pt-6">
            <DrawerItemList {...props} />

            {/* Logout Button */}
            <View className="mt-6 ">
                <TouchableOpacity
                    className="bg-blue w-26 rounded-md p-2 absolute self-center"
                    onPress={handleLogout}
                >
                    <View className="flex-row justify-center items-center">
                        <Text className="text-white text-2xl">logout</Text>
                        <Ionicons
                            className="ml-1"
                            name="log-out-outline"
                            size={25}
                            color="white"
                        />
                    </View>
                </TouchableOpacity>
            </View>

        </DrawerContentScrollView>
    );
}
