import { Stack } from "expo-router";

export default function OtherPages() {
  return (
    <Stack screenOptions={{headerShown:false}}>
      <Stack.Screen  name="expenses"/>
      <Stack.Screen  name="home"/>
      <Stack.Screen  name="inventory"/>
      <Stack.Screen  name="myProjects"/>
      <Stack.Screen  name="myVehicles"/>
      <Stack.Screen  name="savings"/>
      <Stack.Screen  name="timeSpent"/>
    </Stack>
  );
}
