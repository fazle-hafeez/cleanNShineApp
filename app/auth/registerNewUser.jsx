import React, { useState, useContext, useEffect } from "react";
import { View, Text, TextInput, StatusBar, TouchableOpacity, StyleSheet, Platform } from "react-native";
import { Link, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import HeroSection from "../../src/components/HeroSection";
import Button from "../../src/components/Button";
import ModalComponent from "../../src/components/ModalComponent";
import { AuthContext } from "../../src/context/AuthContexts";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LoadingComponent from "../../src/components/LoadingComponent";
const SignUpPage = () => {
  const [username, setUsername] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [password, setPassword] = useState("");
  const [passError, setPassError] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPassError, setConfirmPassError] = useState("");
  const [remember, setRemember] = useState(true);
  const [keepLoggedIn, setKeepLoggedIn] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [modalMess, setModalMess] = useState("");
  const [modalVisibility, setModalVisibility] = useState(false);
  const [modalErrorType, setModalErrorType] = useState("");
  const [isButton, setIsButton] = useState(true);
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false)
  // const route = useLocalSearchParams()
  //    console.log(route.trimmedEmail);
  useEffect(() => {
    const getToken = async () => {
      try {
        const refreshToken = await AsyncStorage.getItem("refreshToken");

        if (refreshToken) {
          console.log(" Token found in registerNewUser:", refreshToken);
          setToken(refreshToken);
        } else {
          console.log(" No token found in AsyncStorage.");
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
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          username: trimmedUsername,
          password: trimmedPassword,
          confirm_password: trimmedConfirmPassword,
        }),
      });

      // const text = await response.text(); 
      // console.log("Raw response text:", text);

      // let result = null;
      // if (text && text.trim() !== "") {
      //   try {
      //     result = JSON.parse(text);
      //   } catch {
      //     console.log("Invalid JSON received:", text);
      //   }
      // }
      const result = await response.json()
      console.log(result);


      //  Handle even if result is null
      if (result.status === "success") {
        await login(
          { username: trimmedUsername },
          result?.token ?? null,  // safe fallback
          { remember: false, keepLoggedIn: false }
        );
        setLoading(false);
        setModalMess(result?.data || "User created successfully!");
        setModalErrorType("success");
        setModalVisibility(true);
        setIsButton(false);

        setTimeout(() => {
          setModalVisibility(false);
          router.push("/dashboard/dashboardPage");
        }, 2000);
      }else if(result.restart === true){
         setLoading(false);
        setModalMess(result?.data);
        setModalErrorType("error");
        setModalVisibility(true);
        setIsButton(false);
        setTimeout(() => {
          setModalVisibility(false);
          router.push("/");
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
    }

  }

  return (
    <View className="flex-1 bg-white">
      <StatusBar barStyle="light-content" backgroundColor="#0000ff" />
      <HeroSection />

      <View className="flex-1 f-full p-4">
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
          <View
            style={{ position: "relative" }}
            className={`rounded-md border ${passError ? "border-red-500" : "border-gray-400"
              }`}
          >
            <TextInput
              className="rounded-md text-lg text-headercolor pr-10 p-3"
              placeholder="Type your password here"
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
              style={styles.input}
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

          {/* Confirm password */}
          <Text className="text-xl mb-2 text-headercolor mt-2">Confirm password</Text>
          <View
            style={{ position: "relative" }}
            className={`rounded-md border ${confirmPassError ? "border-red-500" : "border-gray-400"
              }`}
          >
            <TextInput
              className="rounded-md text-lg text-headercolor pr-10 p-3"
              placeholder="Type your c-password here"
              secureTextEntry={!showConfirmPassword}
              value={confirmPassword}
              onChangeText={(val) => {
                setConfirmPassword(val);
                setConfirmPassError("");

                // Optional: clear mismatch error as user types
                if (val === password) {
                  setPassError("");
                }
              }}
              autoCapitalize="none"
              style={{ paddingRight: 40 }}
            />
            <TouchableOpacity
              onPress={() => setShowConfirmPassword((s) => !s)}
              style={styles.input}
            >
              <Ionicons
                name={showConfirmPassword ? "eye" : "eye-off"}
                size={24}
                color="#646060ff"
              />
            </TouchableOpacity>
          </View>
          {confirmPassError ? (
            <Text className="text-sm text-red-500 my-1">{confirmPassError}</Text>
          ) : null}


          {/* Submit button */}
          <View className="mt-2">
            <Button title="Submit" onClickEvent={handleLogin} />
          </View>
          <View className="border border-gray-200 my-2"></View>
          <View className="flex-row flex-nowrap">
            <Text className="text-xl font-medium text-headercolor">Already have an account? </Text>
            <Link href="/signup" className="text-blue underline text-xl">Login</Link>
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
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    position: "absolute",
    right: 8,
    top: "50%",
    transform: [{ translateY: -14 }],
    padding: 4,
  }
})
export default SignUpPage
