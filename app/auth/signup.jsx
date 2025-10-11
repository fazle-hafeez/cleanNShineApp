import React, { useState, useEffect, useContext } from "react";
import { View, Text, TextInput, StatusBar, TouchableOpacity, Platform } from "react-native";
import Checkbox from "expo-checkbox";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import HeroSection from "../../src/components/HeroSection";
import Button from "../../src/components/Button";
import ModalComponent from "../../src/components/ModalComponent";
import { AuthContext } from "../../src/context/AuthContexts";

const SignUpPage = () => {
  const [username, setUsername] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passError, setPassError] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [keepLoggedIn, setKeepLoggedIn] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [modalMess, setModalMess] = useState("");
  const [modalVisibility, setModalVisibility] = useState(false);
  const [modalErrorType, setModalErrorType] = useState("");
  const [isButton, setIsButton] = useState(true)

  const router = useRouter();
  const { user, login } = useContext(AuthContext);
  useEffect(() => {
    const loadRemembered = async () => {
      try {
        const savedEmail = await AsyncStorage.getItem("rememberedEmail");
        if (savedEmail) {
          setUsername(savedEmail);
        }
      } catch (err) {
        console.warn(err);
      }
    };
    loadRemembered();
  }, []);

  const handleLogin = async () => {
    let hasError = false;
    const trimmedEmail = username.trim();

    if (trimmedEmail === "") {
      setUsernameError("field is required");
      hasError = true;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setUsernameError("Email is not valid");
      hasError = true;
    }

    if (password.trim() === "") {
      setPassError("field is required");
      hasError = true;
    }

    if (hasError) return;

    try {
      const response = await fetch(
        `http://10.79.207.163:3000/users?email=${trimmedEmail}&password=${password}`
      );
      const data = await response.json();

      if (data.length === 0) {
        setModalMess("Invalid email or password");
        setModalErrorType("error");
        setModalVisibility(true);
        return;
      }

      // Successful login
      const userData = data[0];

      await login(userData, result?.token, { remember, keepLoggedIn });

      setModalMess("you are logged in successfully!");
      setModalErrorType("success");
      setIsButton(false)
      setModalVisibility(true);
      setTimeout(() => {
        setModalVisibility(false);
        router.replace("/dashboard/dashboardPage");
      }, 2000);
    } catch (error) {
      console.error("Login error:", error);
      setModalMess("Something went wrong. Please try again later.");
      setModalErrorType("error");
      setModalVisibility(true);
    }
  };

  return (
    <View className="flex-1">
      <StatusBar barStyle="light-content" backgroundColor="#0000ff" />
      <HeroSection />
      <View className="p-4">
        <View
          className={`bg-[rgba(255,255,255,0.9)] rounded-xl p-6 ${Platform.OS === "ios" ? " shadow-sm" : ''
            }`}
          style={{ marginTop: -230, elevation: 5 }}
        >
          <Text className="text-xl mb-2 text-headercolor">Email address</Text>
          <TextInput
            className={`rounded-md text-lg text-headercolor border ${usernameError ? "border-red-500" : "border-gray-400"
              }`}
            placeholder="Enter your email address"
            autoFocus
            keyboardType="email-address"
            autoCapitalize="none"
            value={username}
            onChangeText={(val) => {
              setUsername(val);
              setUsernameError("");
            }}
          />
          {usernameError ? (
            <Text className="text-sm text-red-500 my-1">{usernameError}</Text>
          ) : null}

          <Text className="text-xl mb-2 text-headercolor mt-2">Password</Text>
          <View
            style={{ position: "relative" }}
            className={`rounded-md border ${passError ? "border-red-500" : "border-gray-400"
              }`}
          >
            <TextInput
              className="rounded-md text-lg text-headercolor pr-10 p-3"
              placeholder="Enter your password"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={(val) => {
                setPassword(val);
                setPassError("");
              }}
              autoCapitalize="none"
              style={{ paddingRight: 40 }}
            />
            <TouchableOpacity
              onPress={() => setShowPassword((s) => !s)}
              style={{
                position: "absolute",
                right: 8,
                top: "50%",
                transform: [{ translateY: -14 }],
                padding: 4,
              }}
            >
              <Ionicons
                name={showPassword ? "eye" : "eye-off"}
                size={24}
                color="#646060ff"
              />
            </TouchableOpacity>
          </View>
          {passError ? (
            <Text className="text-sm text-red-500 my-1">{passError}</Text>
          ) : null}

          <View className="flex-row items-center my-3">
            <Checkbox value={remember} onValueChange={setRemember} />
            <Text className="text-lg ml-2 text-headercolor">
              Remember username
            </Text>
          </View>

          <View className="flex-row items-center">
            <Checkbox value={keepLoggedIn} onValueChange={setKeepLoggedIn} />
            <Text className="text-lg ml-2 text-headercolor">
              Keep logged in
            </Text>
          </View>

          <View className="mt-2">
            <Button title="Submit" onClickEvent={handleLogin} />
          </View>

          <View className="mt-2 items-center">
            <Text className="text-lg text-headercolor">
              No account yet?{" "}
              <Link className="text-blue underline" href="/">
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
            <Link href="/dashboard/home" className="text-blue underline text-lg">
              Help
            </Link>
            <Link href="/dashboard/home" className="text-blue underline ml-2 text-lg">
              Terms of use
            </Link>
          </View>
          <Text className="text-lg text-headercolor">
            Logging into your tracker account
          </Text>
        </View>
      </View>

      <ModalComponent
        visible={modalVisibility}
        onClose={() => setModalVisibility(false)}
        message={modalMess}
        errorType={modalErrorType}
        isButton={isButton}
      />
    </View>
  );
};

export default SignUpPage;
