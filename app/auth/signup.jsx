
import React, { useState } from "react";
import { View, Text, TextInput, StatusBar, TouchableOpacity, Platform } from "react-native";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import HeroSection from "../../src/components/HeroSection";
import Button from "../../src/components/Button";
import ModalComponent from "../../src/components/ModalComponent";
import LoadingComponent from "../../src/components/LoadingComponent";
import { SafeAreaView } from "react-native-safe-area-context";
import { useApi } from "../../src/hooks/useApi"; //  import your custom hook

const signUp = () => {
  const route = useLocalSearchParams();
  const router = useRouter();
  const { post, loading } = useApi(); //  use our clean API hook

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMess, setModalMess] = useState("");
  const [modalIcon, setModalIcon] = useState("");
  const [lastSubmittedEmail, setLastSubmittedEmail] = useState("");
  const [isButton, setIsButton] = useState(true);

  const receivedCode = () => {
    router.push({
      pathname: "/auth/emailVerification",
      params: {
        enableBtn: true,
        trimmedEmail: route.trimmedEmail,
        resetEmail: route.resetEmail,
      },
    });
  };

  const handleLogin = async () => {
    let hasError = false;

    if (username.trim() === "") {
      setUsernameError("Field is required");
      hasError = true;
    } else {
      setUsernameError("");
    }

    const trimmedEmail = email.trim();
    if (trimmedEmail === "") {
      setEmailError("Field is required");
      hasError = true;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setEmailError("Email is not valid");
      hasError = true;
    } else {
      setEmailError("");
    }

    if (hasError) return;

    try {
      const response = await post(
        "/register/register-email/",
        { username: username, email: trimmedEmail },
        false // no token needed
      );

      if (response?.status === "success") {
        setLastSubmittedEmail("");
        setModalMess(response.data || "Verification email sent successfully!");
        setModalIcon("success");
        setModalVisible(true);
        setIsButton(false);

        setTimeout(() => {
          setModalVisible(false);
          router.push({
            pathname: "/auth/emailVerification",
            params: { username, trimmedEmail },
          });
        }, 2000);

        setUsername("");
        setEmail("");
      } else if (
        response?.http_code === 409 &&
        response?.status === "error"
      ) {
        if (lastSubmittedEmail === trimmedEmail) {
          setModalMess(
            "You are making too many request in a very short window of time. Please, make sure you don't overburden the server..."
          );
        } else {
          setModalMess(
            response?.data ||
            "Another user is already registered with that email."
          );
          setLastSubmittedEmail(trimmedEmail);
        }
        setModalIcon("error");
        setModalVisible(true);
        setIsButton(true);
      } else {
        setModalMess("Something went wrong. Please try again.");
        setModalIcon("error");
        setModalVisible(true);
        setIsButton(true);
      }
    } catch (error) {
      setModalMess("A server error occurred. Please try again later.");
      setModalIcon("error");
      setModalVisible(true);
      setIsButton(true);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="light-content" backgroundColor="#0000ff" />
      <HeroSection />

      <View className="h-full mx-auto p-4 w-full">
        <View
          className={`bg-[rgba(255,255,255,0.9)] rounded-xl p-6 ${Platform.OS === "ios" ? "shadow-sm" : ""
            }`}
          style={{ marginTop: -200, elevation: 5 }}
        >
          <Text className="text-headercolor text-2xl font-medium mb-3">
            Register
          </Text>

          <Text className="text-xl mb-2 text-headercolor">Enter your name</Text>
          <TextInput
            className={`border ${usernameError ? "border-red-500" : "border-gray-400"
              } rounded-md text-lg text-headercolor px-3 py-3`}
            placeholder="This is to call you with, in the email"
            value={username}
            onChangeText={(text) => {
              setUsername(text);
              setUsernameError("");
            }}
          />
          {usernameError ? (
            <Text className="text-red-500 text-sm mt-1">{usernameError}</Text>
          ) : null}

          <Text className="text-xl my-2 text-headercolor">
            Enter your email address
          </Text>
          <TextInput
            className={`border ${emailError ? "border-red-500" : "border-gray-400"
              } rounded-md text-lg text-headercolor px-3 py-3`}
            placeholder="You will use this for account recovery"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setEmailError("");
            }}
          />
          {emailError ? (
            <Text className="text-red-500 text-sm mt-1">{emailError}</Text>
          ) : null}

          <View className="mt-2">
            <Button title="Submit" onClickEvent={handleLogin} />
          </View>

          <View className="mt-2 mb-2">
            <Text className="text-lg text-headercolor font-normal">
              Already have an account?
              <Link href="/auth/login" className="text-blue underline">
                {" "}
                Sign up
              </Link>
            </Text>
          </View>
        </View>

        {route.show && (
          <View className="flex-row mt-3 pl-5 ml-1 items-center">
            <Text className="text-xl font-normal text-headercolor">
              I received the code?
            </Text>
            <TouchableOpacity onPress={receivedCode}>
              <Text className="text-lg underline text-blue font-normal">
                {" "}
                Verify now
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <ModalComponent
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        message={modalMess}
        errorType={modalIcon}
        isButton={isButton}
      />

      <LoadingComponent visible={loading} />
    </SafeAreaView>
  );
};

export default signUp;
