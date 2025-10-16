import React, { useState, useContext, useEffect } from "react";
import { View, Text, TextInput, StatusBar, StyleSheet, Platform } from "react-native";
import { Link, useRouter } from "expo-router";
import HeroSection from "../../src/components/HeroSection";
import Button from "../../src/components/Button";
import ModalComponent from "../../src/components/ModalComponent";
import { SafeAreaView } from "react-native-safe-area-context";
import { AuthContext } from "../../src/context/AuthContexts";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LoadingComponent from "../../src/components/LoadingComponent";
import PasswordInputField from "../../src/components/ToggleField";
const SignUpPage = () => {
  const [username, setUsername] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [password, setPassword] = useState("");
  const [passError, setPassError] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPassError, setConfirmPassError] = useState("");
  const [modalMess, setModalMess] = useState("");
  const [modalVisibility, setModalVisibility] = useState(false);
  const [modalErrorType, setModalErrorType] = useState("");
  const [isButton, setIsButton] = useState(true);
  const [tokens, setTokens] = useState({});
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    const getToken = async () => {
      try {
        const getTokens = await AsyncStorage.getItem("tokens");
        const Tokens = JSON.parse(getTokens)
        const issuedTime = new Date(Number(Tokens.issuedAt) * 1000).toLocaleTimeString();
        const expiresTime = new Date(Number(Tokens.accessExpires) * 1000).toLocaleTimeString();
        console.log(" Issued at:", issuedTime);
        console.log(" Expires at:", expiresTime);
        if (Tokens) {
          setTokens(Tokens);
        }
      } catch (error) {
        console.log(" Failed to fetch token:", error);
      }
    };

    getToken();
  }, []);


  const router = useRouter();
  const { user, login } = useContext(AuthContext);

  const handleLogin = async () => {
    let hasError = false;
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();
    const trimmedConfirmPassword = confirmPassword.trim();

    // Username validation
    if (trimmedUsername === "") {
      setUsernameError("Field is required");
      hasError = true;
    }

    // Password validation
    if (trimmedPassword === "") {
      setPassError("Field is required");
      hasError = true;
    }

    // Confirm Password validation
    if (trimmedConfirmPassword === "") {
      setConfirmPassError("Field is required");
      hasError = true;
    }
    console.log(username, password, confirmPassword);

    // Password match validation
    if (
      trimmedPassword !== "" &&
      trimmedConfirmPassword !== "" &&
      trimmedPassword !== trimmedConfirmPassword
    ) {
      setConfirmPassError("Password and Confirm Password doesn't match");
      hasError = true;
    }

    if (hasError) return;
    setLoading(true);
    try {
      const response = await fetch("https://trackingdudes.com/apis/register/create-user/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(tokens ? { Authorization: `Bearer ${tokens?.accessToken}` } : {}),
        },
        body: JSON.stringify({
          username: trimmedUsername,
          password: trimmedPassword,
          confirm_password: trimmedConfirmPassword,
        }),
      });
      const result = await response.json()
      if (result.status === "success") {
        await login(
          { username: trimmedUsername },
          result?.token ?? null,
          { remember: false, keepLoggedIn: false }
        );
        setLoading(false);
        setModalMess(result?.data || "User created successfully!");
        setModalErrorType("success");
        setModalVisibility(true);
        setIsButton(false);

        setTimeout(() => {
          setModalVisibility(false);
          router.push("/auth/signup");
        }, 3000);
      } else if (result.restart === true) {
        setLoading(false);
        setModalMess(result?.data);
        setModalErrorType("error");
        setModalVisibility(true);
        setIsButton(true);
        setTimeout(() => {
          setModalVisibility(false);
          router.push("/auth/login");
        }, 2000);

      } else {
        setLoading(false);
        setModalMess(
          (result && result.data) ||
          "Something went wrong. Please try again later."
        );
        setModalErrorType("error");
        setModalVisibility(true);
      }
    } catch (error) {
      setLoading(false);
      console.log("Network or parse error:", error.message);
      setModalMess("Network error: " + error.message);
      setModalErrorType("error");
      setModalVisibility(true);
    } finally {
      setLoading(false)
    }

  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="light-content" backgroundColor="#0000ff" />
      <HeroSection />

      <View className="flex-1  p-4">
        <View
          className={`bg-[rgba(255,255,255,0.9)] rounded-xl p-6 ${Platform.OS === "ios" ? " shadow-sm" : ''
            }`}
          style={{ marginTop: -230, elevation: 5 }}
        >
          <View className="mb-3">
            <Text className="text-headercolor text-2xl font-medium">
              Complete Registration
            </Text>
          </View>
          {/* Username field */}
          <Text className="text-xl mb-2 text-headercolor">Enter your name</Text>
          <TextInput
            className={`rounded-md text-lg text-headercolor border ${usernameError ? "border-red-500" : "border-gray-400"
              }`}
            placeholder="Type your name here"
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

          {/* Password field */}
          <Text className="text-xl mb-2 text-headercolor mt-2">Enter your password</Text>
          <PasswordInputField
            password={password}
            setPassword={setPassword}
            passwordError={passError}
            setPasswordError={setPassError}
            placeholder={"Type your password here"}
          />

          {/* Confirm password */}
          <Text className="text-xl mb-2 text-headercolor mt-2">Confirm password</Text>

          <PasswordInputField
            password={confirmPassword}
            setPassword={setConfirmPassword}
            passwordError={confirmPassError}
            setPasswordError={setConfirmPassError}
            placeholder={"Type your C-password here"}
          />

          {/* Submit button */}
          <View className="mt-2">
            <Button title="Submit" onClickEvent={handleLogin} />
          </View>
          <View className="border border-gray-200 my-2"></View>
          <View className="flex-row flex-nowrap">
            <Text className="text-xl font-medium text-headercolor">Already have an account? </Text>
            <Link href="/auth/signup" className="text-blue underline text-xl">Login</Link>
          </View>
        </View>
      </View>

      {/* Modal */}
      <ModalComponent
        visible={modalVisibility}
        onClose={() => setModalVisibility(false)}
        message={modalMess}
        errorType={modalErrorType}
        isButton={isButton}
      />
      {/*loading modal */}
      <LoadingComponent
        visible={loading}
      />
    </SafeAreaView>
  );
};

export default SignUpPage
