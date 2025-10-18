import { Redirect } from "expo-router";
import { useContext } from "react";
import { AuthContext } from "../src/context/AuthContexts";

export default function Index() {
  const { user } = useContext(AuthContext);
  if (user) return <Redirect href="/dashboard/dashboardPage" />;
  return <Redirect href="/auth/signup" />;
}
