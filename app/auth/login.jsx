import React, { useState, useEffect, useContext } from "react";
import { View, Text, TextInput, StatusBar, Platform } from "react-native";
import Checkbox from "expo-checkbox";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import HeroSection from "../../src/components/HeroSection";
import Button from "../../src/components/Button";
import ModalComponent from "../../src/components/ModalComponent";
import LoadingComponent from "../../src/components/LoadingComponent";
import PasswordInputField from "../../src/components/ToggleField";
import { AuthContext } from "../../src/context/AuthContexts";
import { useApi } from "../../src/hooks/useApi"; 

const Login = () => {
  const [username, setUserName] = useState("");
  const [usernameError, setUserNameError] = useState("");
  const [password, setPassword] = useState("");
  const [passError, setPassError] = useState("");
  const [remember, setRemember] = useState(true);
  const [keepLoggedIn, setKeepLoggedIn] = useState(true);
  const [modalMess, setModalMess] = useState("");
  const [modalVisibility, setModalVisibility] = useState(false);
  const [modalErrorType, setModalErrorType] = useState("");
  const [isButton, setIsButton] = useState(true);

  const router = useRouter();
  const { login } = useContext(AuthContext);
  const { post, loading } = useApi(); //our custom hook handles API logic

  useEffect(() => {
    (async () => {
      try {
        const savedName = await AsyncStorage.getItem("rememberedEmail");
        if (savedName) setUserName(savedName);
      } catch (err) {
        console.warn("Failed to load remembered name:", err);
      }
    })();
  }, []);


  useEffect(() => {
    (async () => {
      try {
        const savedUser = await AsyncStorage.getItem("user");
        if (savedUser) {
          const parsed = JSON.parse(savedUser);
          if (parsed?.username) setUserName(parsed.username);
        }
      } catch (err) {
        console.warn("Failed to load user:", err);
      }
    })();
  }, []);

  //  Handle Login
  const handleLogin = async () => {
    let hasError = false;

    if (username.trim() === "") {
      setUserNameError("Field is required");
      hasError = true;
    }
    if (password.trim() === "") {
      setPassError("Field is required");
      hasError = true;
    }

    if (hasError) return;

    try {
      const cleanUsername = username.trim().replace(/\s+/g, "");
      const payload = {
        username: cleanUsername,
        password: password,
        keep_logged_in: keepLoggedIn,
      };

      const result = await post("/tokens/refresh/", payload);

      if (result.status === "success" && result.tokens) {
        // Save tokens
        await AsyncStorage.setItem("tokens", JSON.stringify(result.tokens));

        // Remember username if checked
        if (remember) {
          await AsyncStorage.setItem("rememberedEmail", cleanUsername);
        } else {
          await AsyncStorage.removeItem("rememberedEmail");
        }

        setModalErrorType("success");
        setModalMess(result.data || "Login successful!");
        setModalVisibility(true);
        setIsButton(false);

        // Redirect after short delay
        setTimeout(() => {
          setModalVisibility(false);
          router.push("/dashboard/dashboardPage");
        }, 2000);
      } else {
        setModalErrorType("error");
        setModalMess(result.data || "Invalid username or password");
        setModalVisibility(true);
      }
    } catch (error) {
      setModalErrorType("error");
      setModalMess("Something went wrong. Please try again.");
      setModalVisibility(true);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="light-content" backgroundColor="#0000ff" />
      <HeroSection />

      <View className="flex-1 p-4">
        <View
          className={`bg-[rgba(255,255,255,0.9)] rounded-xl p-6 ${
            Platform.OS === "ios" ? " shadow-sm" : ""
          }`}
          style={{ marginTop: -230, elevation: 5 }}
        >
          <Text className="text-xl mb-2 text-headercolor">Enter your user name</Text>
          <TextInput
            className={`rounded-md text-lg text-headercolor border ${
              usernameError ? "border-red-500" : "border-gray-400"
            }`}
            placeholder="Type your username here"
            keyboardType="email-address"
            autoCapitalize="none"
            value={username}
            onChangeText={(val) => {
              setUserName(val);
              setUserNameError("");
            }}
          />
          {usernameError && (
            <Text className="text-sm text-red-500 my-1">{usernameError}</Text>
          )}

          <Text className="text-xl mb-2 text-headercolor mt-2">Enter your password</Text>
          <PasswordInputField
            password={password}
            setPassword={setPassword}
            passwordError={passError}
            setPasswordError={setPassError}
            placeholder="Type your password here"
          />

          <View className="flex-row items-center my-3">
            <Checkbox
              value={remember}
              onValueChange={setRemember}
              color={remember ? "#0000ff" : ""}
            />
            <Text className="text-lg ml-2 text-headercolor">Remember username</Text>
          </View>

          <View className="flex-row items-center">
            <Checkbox
              value={keepLoggedIn}
              onValueChange={setKeepLoggedIn}
              color={keepLoggedIn ? "#0000ff" : ""}
            />
            <Text className="text-lg ml-2 text-headercolor">Keep logged in</Text>
          </View>

          <View className="mt-2">
            <Button title="Submit" onClickEvent={handleLogin} />
          </View>

          <View className="mt-2 items-center">
            <Text className="text-lg text-headercolor">
              No account yet?{" "}
              <Link className="text-blue underline" href="/auth/signup">
                Sign up
              </Link>
            </Text>
            <Text className="mt-1 text-lg text-headercolor">
              Forgot password?{" "}
              <Link className="text-blue underline" href="/auth/resetPassword">
                Reset
              </Link>
            </Text>
          </View>
        </View>

        <View className="mt-3 pl-2">
          <View className="flex-row">
            <Link href="/otherPages/home" className="text-blue underline text-lg">
              Help
            </Link>
            <Link
              href="/otherPages/home"
              className="text-blue underline ml-2 text-lg"
            >
              Terms of use
            </Link>
          </View>
          <Text className="text-lg text-headercolor">
            Logging into your tracker account
          </Text>
        </View>
      </View>

      {/* Modals */}
      <ModalComponent
        visible={modalVisibility}
        onClose={() => setModalVisibility(false)}
        message={modalMess}
        errorType={modalErrorType}
        isButton={isButton}
      />

      {/* Loading Spinner */}
      <LoadingComponent visible={loading} />
    </SafeAreaView>
  );
};

export default Login;
