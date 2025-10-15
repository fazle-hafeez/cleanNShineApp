import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Auto-load user on app start
  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");
        const storedToken = await AsyncStorage.getItem("token");
        const keepLoggedIn = await AsyncStorage.getItem("keepLoggedIn");

        if (storedUser && storedToken && keepLoggedIn === "true") {
          setUser(JSON.parse(storedUser));
          setToken(storedToken);
        } 
      } catch (err) {
        console.warn("Error loading user/token", err);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  //  Login and save user + token
  const login = async (userData, jwtToken, { remember, keepLoggedIn }) => {
  setUser(userData);
  setToken(jwtToken || null);

  //  Save user safely
  if (userData) {
    await AsyncStorage.setItem("user", JSON.stringify(userData));
  }

  //  Only save token if it's valid (non-null / non-empty)
  if (jwtToken) {
    await AsyncStorage.setItem("token", jwtToken);
  } else {
    await AsyncStorage.removeItem("token");
  }

  //  Handle remember email
  if (remember && userData?.username) {
    await AsyncStorage.setItem("rememberedEmail", userData.username);
  } else {
    await AsyncStorage.removeItem("rememberedEmail");
  }

  //  Handle keep logged in
  if (keepLoggedIn) {
    await AsyncStorage.setItem("keepLoggedIn", "true");
  } else {
    await AsyncStorage.removeItem("keepLoggedIn");
  }
};


  //  Logout and clear everything
  const logout = async () => {
    setUser(null);
    setToken(null);
    await AsyncStorage.multiRemove([
      "user",
      "token",
      "keepLoggedIn",
      "rememberedEmail",
    ]);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
