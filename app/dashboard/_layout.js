import { Drawer } from 'expo-router/drawer';
import CustomDrawerContent from '../../src/components/CustomDrawer';

export default function DashboardLayout() {
  return (
    <Drawer
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        drawerStyle: {
          backgroundColor: 'black',
          width: 280,
          borderTopRightRadius: 0,
          borderBottomRightRadius:0
        },
        drawerType: 'front',
        sceneContainerStyle: {
          backgroundColor: 'transparent',
        },
        headerShown: false,
      }}
    >
      <Drawer.Screen
        name="dashboard"

        options={{ drawerLabel: 'Dashboard',
         }}
      />
    </Drawer>
  );
}
