import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { FontAwesome5, MaterialIcons, Entypo } from '@expo/vector-icons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { useNavigation } from '@react-navigation/native';
import { DrawerActions } from '@react-navigation/native';
import { useRouter } from 'expo-router';
export default function Dashboard() {
    const navigation = useNavigation(); //use for drawer hide show etc .....
    const router = useRouter() // use  for routing ....
    return (

        <ScrollView className="flex-1 bg-[#eef3f9]">
            <View className="flex-row items-center bg-blue px-4 py-3">
                <Entypo name="menu" size={24} color="white"  onPress={() => navigation.dispatch(DrawerActions.openDrawer())}/>
                <Text className="text-white text-lg ml-3">Menu</Text>
            </View>

            {/* Active Features */}
            <Section title="Active features">
                <Feature icon={<MaterialIcons name="access-time" size={33} color="blue" />} label="Shifts data"
                    onPress={() => router.push("dashboard/shiftsData")}
                />
                <Feature icon={<FontAwesome5 name="route" size={33} color="blue" />} label="Trips data"
                    onPress={() => router.push("dashboard/tripsData")}
                />
                <Feature icon={<FontAwesome5 name="gas-pump" size={33} color="blue" />} label="Fuel refills"
                    onPress={() => router.push("dashboard/fuelRefills")}
                />
            </Section>

            {/* User Preferences */}
            <Section title="User preferences">
                <Feature icon={<FontAwesome5 name="car" size={33} color="blue" />} label="My vehicles"
                    onPress={() => router.push("dashboard/myVehicles")}
                />
                <Feature icon={<FontAwesome5 name="file-alt" size={33} color="blue" />} label="My projects"
                    onPress={() => router.push("dashboard/myProjects")}
                />
            </Section>

            {/* Future Features */}
            <Section title="Future features">
                <Feature icon={<FontAwesome5 name="receipt" size={33} color="blue" />} label="Expenses"
                    onPress={() => router.push("dashboard/expenses")}
                />
                <Feature icon={<FontAwesome5 name="user-clock" size={33} color="blue" />} label="Time spent"
                    onPress={() => router.push("dashboard/timeSpent")}
                />
                <Feature icon={<FontAwesome5 name="cubes" size={33} color="blue" />} label="Inventory"
                    onPress={() => router.push("dashboard/inventory")}
                />
                <Feature icon={<FontAwesome6 name="circle-dollar-to-slot" size={33} color="blue" />} label="Savings"
                    onPress={() => router.push("dashboard/savings")}
                />

            </Section>
        </ScrollView>
    );
}

const Section = ({ title, children }) => (
    <View className="bg-white m-4 rounded-lg p-4 shadow">
        <Text className="text-xl font-medium border-b  border-orange-400 pb-2 mb-3">{title}</Text>
        <View className="flex-row flex-wrap">{children}</View>
    </View>
);

const Feature = ({ icon, label,onPress }) => (
    <TouchableOpacity className="w-[30%] bg-gray-100 rounded-lg p-4 ml-2 items-center mb-3 shadow-sm"
        onPress={onPress}
        activeOpacity={0.7}
    >
        {icon}
        <Text className="mt-2 text-center text-sm font-medium">{label}</Text>
    </TouchableOpacity>
);
