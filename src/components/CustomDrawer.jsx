import React, { useContext, useState } from 'react'; // Import useState
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { View, Text, TouchableOpacity,Linking  } from 'react-native';
import { AuthContext } from '../context/AuthContexts';
import { useRouter } from 'expo-router';
import { DrawerActions } from '@react-navigation/native';
import Ionicons from "@expo/vector-icons/Ionicons";

export default function CustomDrawerContent(props) {
    const { navigation } = props;
    const { logout } = useContext(AuthContext);
    const router = useRouter();
    const [isProfileExpanded, setIsProfileExpanded] = useState(false);

    const handleLogout = async () => {
        navigation.dispatch(DrawerActions.closeDrawer());
        await logout();
        router.replace("/");
    };
    
    const closeDrawer = () => {
        navigation.dispatch(DrawerActions.closeDrawer());
    };

    // Helper function to toggle the profile expansion state
    const toggleProfileExpansion = () => {
        setIsProfileExpanded(!isProfileExpanded);
    };

    const handleContactDetailsPress = () => {
        closeDrawer(); 
       Linking.openURL("https://cleannshine.us/trackers/contact/")
    };

    const handleMyProfilePress = () => {
        toggleProfileExpansion();
    };
    

    // Custom Account Item Component (for My Profile with dropdown)
    const AccountItemWithDropdown = ({ iconName, label, onPress, isExpanded }) => (
        <TouchableOpacity
            className="flex-row items-center px-5 py-3 justify-between bg-yellow-50 rounded-full"
            onPress={onPress}
        >
            <View className="flex-row items-center">
                <Ionicons name={iconName} size={24} color="dark" />
                <Text className="text-dark text-base ml-4">{label}</Text>
            </View>
            <Ionicons
                name={isExpanded ? "chevron-up-outline" : "chevron-down-outline"}
                size={20}
                color="dark"
            />
        </TouchableOpacity>
    );

    // Custom Sub-Item Component (for Contact Details)
    const SubDrawerItem = ({ iconName, label, onPress }) => (
        <TouchableOpacity
            className="flex-row items-center ml-10 pr-5 py-3 mt-2 rounded-full bg-yellow-50" 
            onPress={onPress}
        >
            <Ionicons name={iconName} size={22} color="dark"  className="ml-4"/>
            <Text className="text-dark text-sm ml-4">{label}</Text>
        </TouchableOpacity>
    );

    return (
        <DrawerContentScrollView {...props} className="flex-1 bg-black pt-6"> 
            <View className="border-b border-white mt-8"> 
                <TouchableOpacity
                    className="w-10 h-10 rounded-md p-2 self-end mr-4" 
                    onPress={closeDrawer}
                >
                    <Ionicons
                        name="close"
                        size={25}
                        color="white"
                    />
                </TouchableOpacity>
            </View>
            
            {/* Standard Drawer Items from DrawerItemList */}
            <DrawerItemList {...props} />

            <View className="border-b border-white mt-8"></View>

            <View className="mt-6 mb-2">
                <Text className="text-white text-lg font-semibold px-5">Account</Text> 
            </View>

            <AccountItemWithDropdown
                iconName="person-outline" 
                label="My Profile"
                onPress={handleMyProfilePress}
                isExpanded={isProfileExpanded}
            />

            
            {isProfileExpanded && (
                <SubDrawerItem
                    iconName="send-outline" 
                    label="Contact Details"
                    onPress={handleContactDetailsPress}
                />
            )}
            

            <View className="border-b border-white mt-8"></View>

            {/* Sign Out Button */}
            <TouchableOpacity
                className="flex-row items-center px-5 py-3 mt-4 bg-yellow-50 rounded-full"
                onPress={handleLogout}
            >
                <Ionicons
                    name="log-out-outline"
                    size={24}
                    color="dark"
                />
                <Text className="text-dark text-base ml-4">Sign out</Text>
            </TouchableOpacity>

        </DrawerContentScrollView>
    );
}