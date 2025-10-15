import { Drawer } from 'expo-router/drawer';
import CustomDrawerContent from '../../src/components/CustomDrawer';
import { FontAwesome,MaterialIcons,FontAwesome5,FontAwesome6,MaterialCommunityIcons   } from '@expo/vector-icons';
const commonItemStyle = {
  backgroundColor: 'lightyellow',
  marginVertical: 13,
};

const commonLabelStyle = {
  textAlign: 'center',
  width: '100%',
  color: "dark",
  fontWeight: 500
};

export default function DashboardLayout() {
  return (
    <Drawer
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        drawerStyle: {
          backgroundColor: 'black',
          width: 280,
          borderTopRightRadius: 0,
          borderBottomRightRadius: 0
        },
        headerShown: false,
        drawerType: 'front',
        sceneContainerStyle: {
          backgroundColor: 'lightblue',
        },
      }}
    >
      <Drawer.Screen
        name="dashboardPage"
        options={{
          drawerLabel: 'Dashboard',
          drawerItemStyle: commonItemStyle,
          drawerLabelStyle: commonLabelStyle,
          drawerIcon: ({  size }) => (
            <MaterialCommunityIcons name="view-dashboard-variant-outline" size={size} color={"dark"} />
          ),
        }}
      />
       <Drawer.Screen
        name="shiftsData"
        options={{
          drawerLabel: 'Shifts Data',
          drawerItemStyle: commonItemStyle,
          drawerLabelStyle: commonLabelStyle,
          drawerIcon: ({ color, size }) => (
            <MaterialIcons name="watch-later" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="tripsData"
        options={{
          drawerLabel: 'Trips Data',
          drawerItemStyle: commonItemStyle,
          drawerLabelStyle: commonLabelStyle,
          drawerIcon: ({ color, size }) => (
            <FontAwesome6 name="code-compare" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="fuelRefills"
        options={{
          drawerLabel: 'Fuel Refills',
          drawerItemStyle: commonItemStyle,
          drawerLabelStyle: commonLabelStyle,
          drawerIcon: ({ color, size }) => (
            <FontAwesome5  name="gas-pump" size={size} color={color} />
          ),
        }}
      />
     
      
    </Drawer>
  );
}
