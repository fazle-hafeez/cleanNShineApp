import React, { useState } from "react";
import { View, Text, TextInput, StatusBar, TouchableOpacity, Platform } from "react-native";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import HeroSection from "../../src/components/HeroSection";
import Button from "../../src/components/Button";
import ModalComponent from "../../src/components/ModalComponent";
import LoadingComponent from "../../src/components/LoadingComponent";
import { SafeAreaView } from "react-native-safe-area-context";
const RegisterPage = () => {
  const route = useLocalSearchParams();
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMess, setModalMess] = useState("");
  const [modalIcon, setModalIcon] = useState("");
  const [lastSubmittedEmail, setLastSubmittedEmail] = useState("");
  const [loadingModal, setLoadingModal] = useState(false);
  const [isButton, setIsButton] = useState(true)
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
    router.push("/dashboard/dashboardPage")
    let hasError = false;

    // Validate username
    if (username.trim() === "") {
      setUsernameError("Field is required");
      hasError = true;
    } else {
      setUsernameError("");
    }

    // Validate email
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
      setLoadingModal(true);
      const result = await fetch(
        "https://trackingdudes.com/apis/register/register-email/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: username,
            email: trimmedEmail,
          }),
        }
      );

      const response = await result.json();
      if (!result.ok) {
        if (
          response?.http_code === 409 &&
          response?.status === "error" &&
          response?.data
        ) {
          if (lastSubmittedEmail === trimmedEmail) {
            // Repeated submission
            setModalMess(
              "You are making too many request in a very short window of time. Please, make sure you don't overburden the server..."
            );
          } else {
            // First time this email was submitted
            setModalMess(response.data || "Another user is already registered with the email you provided.");
            setLastSubmittedEmail(trimmedEmail);
          }
          setLoadingModal(false)
          setModalIcon("error");
          setModalVisible(true);
          setIsButton(true)
          return;
        }

        // Other server-side error
        setModalMess("Something went wrong. Please try again.");
        setModalIcon("error");
        setModalVisible(true);
        setLoadingModal(false)
        setIsButton(true)
        return;
      }

      // Success
      setLoadingModal(false);
      setLastSubmittedEmail("");

      // Show success modal first
      setModalMess("Verification email sent successfully!");
      setModalIcon("success");
      setModalVisible(true);
      setIsButton(false)

      // Navigate after a short delay
      setTimeout(() => {
        setModalVisible(false);
        router.push({
          pathname: "/auth/emailVerification",
          params: { username, trimmedEmail },
        });
      }, 2000);
      setUsername("");
      setEmail("");
    } catch (error) {
      setLoadingModal(false);
      setModalMess("A server error occurred. Please try again later.");
      setModalIcon("error");
      setModalVisible(true);
      setIsButton(true);
    }
  };


  return (
    <SafeAreaView className="flex-1 bg-white ">
      <StatusBar barStyle="light-content" backgroundColor="#0000ff" />
      <HeroSection />

      <View className="h-full mx-auto p-4 w-full" >
        <View
          className={`bg-[rgba(255,255,255,0.9)] rounded-xl p-6 ${Platform.OS === "ios" ? " shadow-sm" : ''
            }`}
          style={{ marginTop: -200, elevation: 5 }}
        >
          <View className="mb-3">
            <Text className="text-headercolor text-2xl font-medium">
              Register
            </Text>
          </View>

          <Text className="text-xl mb-2 text-headercolor">Enter your name</Text>
          <TextInput
            className={`border  ${usernameError ? "border-red-500 " : "border-gray-400 "
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
            className={`border ${emailError ? "border-red-500 " : "border-gray-400"
              } rounded-md text-lg text-headercolor px-3 py-3`}
            placeholder="You will use this for account recovery "
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
              <Link href="/auth/signup" className="text-blue underline">
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

      {/* Modal Component */}
      <ModalComponent
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        message={modalMess}
        errorType={modalIcon}
        isButton={isButton}
      />

      {/*loading*/}
      <LoadingComponent
        visible={loadingModal}
      />

    </SafeAreaView>
  );
};

export default RegisterPage;
