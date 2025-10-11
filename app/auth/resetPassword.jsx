import React, { useState } from "react";
import { View, Text, TextInput, StatusBar,Platform } from "react-native";
import { useRouter } from "expo-router";
import HeroSection from "../../src/components/HeroSection";
import Button from "../../src/components/Button";
export default function ResetPassword() {
    const router = useRouter()
    const [resetEmail, setResetEmail] = useState("");
    const [resetEmailError, setResetEmailError] = useState(false);
    const [emailFieldMess, setEmailFieldMess] = useState("");
    const handleLogin = () => {
        let hasError = false;

        if (resetEmail.trim() === "") {
            setEmailFieldMess("email field is required");
            setResetEmailError(true);
            hasError = true
        }
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(resetEmail.trim())) {
            setEmailFieldMess("email field is required");
            setResetEmailError(true);
            hasError = true
        }
        if (hasError) return;
        router.push({ pathname: "/emailVerification", params: { changePassword: true, resetEmail } })
    };

    return (
        <View className="flex-1">
            <StatusBar barStyle="light-content" backgroundColor="#0000ff" />
            <HeroSection />
            <View className="p-4">
                <View className={`bg-[rgba(255,255,255,0.9)] rounded-xl p-6 ${Platform.OS === "ios" ? " shadow-sm" : ''
                    }`}
                    style={{ marginTop: -180, elevation: 5 }}>
                    <View >
                        <Text className="text-headercolor text-2xl font-medium">Rest password</Text>
                    </View>
                    <Text className="text-xl mb-2 text-headercolor mt-2" >Email address</Text>
                    <TextInput
                        className={`rounded-md text-lg text-headercolor border ${resetEmailError ? "border-red-500" : "border-gray-400"
                            }`}
                        placeholder="Enter your email address"
                        value={resetEmail}
                        onChangeText={(val) => {
                            setResetEmail(val);
                            setEmailFieldMess("");
                            setResetEmailError(false);
                        }}
                    />
                    {
                        resetEmailError ? (
                            <Text className="text-sm text-red-500 my-1">{emailFieldMess}</Text>
                        ) : null
                    }
                    <View className="mt-2">
                        <Button title="Submit" onClickEvent={handleLogin} />
                    </View>
                </View>
            </View>
        </View>
    );
}

