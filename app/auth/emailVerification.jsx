import { Link, useLocalSearchParams, useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StatusBar, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import HeroSection from "../../src/components/HeroSection";
import Button from "../../src/components/Button";
import LoadingComponent from "../../src/components/LoadingComponent";
import ModalComponent from "../../src/components/ModalComponent";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useApi } from "../../src/hooks/useApi";

const EmailVerification = () => {
    const router = useRouter();
    const { post, put, loading } = useApi();
    const {
        trimmedEmail,
        changePassword,
        enableBtn,
        reastartEmail,
        resetEmail,
    } = useLocalSearchParams();

    const [code, setCode] = useState("");
    const [otpError, setOtpError] = useState("");
    const [wrongAttempts, setWrongAttempts] = useState(0);
    const [isBlocked, setIsBlocked] = useState(false);
    const [blockTimer, setBlockTimer] = useState(180); // 3 min block
    const [resendTimer, setResendTimer] = useState(60);
    const [restartTimer, setRestartTimer] = useState(30);
    const [canResend, setCanResend] = useState(false);
    const [canRestart, setCanRestart] = useState(false);

    const [modalVisibility, setModalVisibility] = useState(false);
    const [modalMess, setModalMess] = useState("");
    const [modalErrorType, setModalErrorType] = useState("");
    const [isButton, setIsButton] = useState(true);

    const isAllDisabled = isBlocked || loading;

    // Format mm:ss
    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? "0" : ""}${s}`;
    };

    // Timers
    useEffect(() => {
        const resendInterval = setInterval(() => {
            setResendTimer((prev) => {
                if (prev <= 1) {
                    clearInterval(resendInterval);
                    setCanResend(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(resendInterval);
    }, []);

    useEffect(() => {
        const restartInterval = setInterval(() => {
            setRestartTimer((prev) => {
                if (prev <= 1) {
                    clearInterval(restartInterval);
                    setCanRestart(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(restartInterval);
    }, []);

    // 3-min block timer
    useEffect(() => {
        let interval;
        if (isBlocked) {
            interval = setInterval(() => {
                setBlockTimer((prev) => {
                    if (prev <= 1) {
                        clearInterval(interval);
                        setIsBlocked(false);
                        setWrongAttempts(0);
                        setBlockTimer(180);
                        return 180;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isBlocked]);

    // Submit OTP
    const submitCode = async () => {
        if (isBlocked) return;
        if (!code.trim()) {
            setOtpError("Field is required!");
            return;
        }

        try {
            const response = await post("/register/verify-email/", { code });
            console.log(response);

            if (response.status === "success") {
                setModalMess(response.data || "Email verified successfully!");
                setModalErrorType("success");
                setModalVisibility(true);
                setIsButton(false);

                const tokens = {
                    accessToken: response?.tokens?.access,
                    accessExpires: response?.tokens?.accessExpires,
                    issuedAt: response?.tokens?.issuedAt,
                };

                await AsyncStorage.setItem("tokens", JSON.stringify(tokens));

                setTimeout(() => {
                    setModalVisibility(false);
                    router.push({
                        pathname: changePassword
                            ? "/auth/changePassword"
                            : "/auth/compeleteRegistration",
                        params: { trimmedEmail: changePassword ? resetEmail : trimmedEmail },
                    });
                }, 2000);
            } else if (response.status === "error") {
                setWrongAttempts((prev) => {
                    const next = prev + 1;
                    if (next >= 3) {
                        setIsBlocked(true);
                        setModalMess(
                            "You’ve entered the wrong code 3 times. Try again after 3 minutes."
                        );
                    } else {
                        setModalMess(response.data || "Invalid OTP. Please try again.");
                    }
                    setModalErrorType("error");
                    setModalVisibility(true);
                    setIsButton(true);
                    return next;
                });
            } else {
                setModalMess("Unexpected response from server.");
                setModalErrorType("error");
                setModalVisibility(true);
                setIsButton(true);
            }
        } catch (error) {
            console.log("Verify Email Error:", error.message);
            setModalMess(error.message || "Something went wrong. Try again later.");
            setModalErrorType("error");
            setModalVisibility(true);
            setIsButton(true);
        }
    };

    // Restart
    const restart = () => {
        router.push({
            pathname: "/auth/login",
            params: { show: true, trimmedEmail, resetEmail },
        });
    };

    // Resend email
    const sendEmailCode = async () => {
        try {
            const result = await put("/register/resend-email/");
            if (result.status === "success") {
                setModalMess("Verification email sent successfully!");
                setModalErrorType("success");
                setModalVisibility(true);
            } else {
                setModalMess(result.data || "Failed to resend verification email.");
                setModalErrorType("error");
                setModalVisibility(true);
                setIsButton(true);
            }
        } catch (error) {
            console.log("Resend Email Error:", error.message);
            setModalMess("Failed to resend verification email. Try again later.");
            setModalErrorType("error");
            setIsButton(true);
            setModalVisibility(true);
        }
    };


    return (
        <SafeAreaView className="flex-1 bg-white">
            <StatusBar barStyle="light-content" backgroundColor="#0000ff" />
            <HeroSection />

            <View className=" p-4 mx-auto bg-white">
                <View className={`bg-[rgba(255,255,255,0.9)] rounded-xl p-6 ${Platform.OS === "ios" ? " shadow-sm" : ''
                    }`}
                    style={{ marginTop: -300, elevation: 5 }}>
                    <Text className="text-headercolor text-2xl font-medium mb-2">
                        Verify your email address
                    </Text>
                    <Text className="text-md text-headercolor">
                        We've sent a 6-digit code to {trimmedEmail || reastartEmail || resetEmail} from
                        register@trackingdudes.com. Please enter it below.
                    </Text>

                    <Text className="text-2xl mt-4 mb-2 text-headercolor">Enter code here</Text>
                    <TextInput
                        autoFocus
                        keyboardType="numeric"
                        maxLength={6}
                        className={`text-center border rounded-md px-3 py-2 text-lg text-headercolor ${otpError ? "border-red-500" : "border-gray-400"
                            }`}
                        value={code}
                        onChangeText={(text) => {
                            setCode(text);
                            setOtpError("");
                        }}
                    />

                    {otpError ? <Text className="text-red-500 text-sm mt-2">{otpError}</Text> : null}

                    {isBlocked && (
                        <Text className="text-red-500 text-sm mt-1">
                            You are blocked for {formatTime(blockTimer)} due to too many failed attempts.
                        </Text>
                    )}

                    <View className="mt-2">
                        <Button title="Submit" onClickEvent={submitCode} disabled={isAllDisabled} />
                    </View>

                    <View className="border border-gray-400 my-4"></View>

                    <Text className="text-2xl text-headercolor mb-2">Didn't receive the email?</Text>

                    <View className="flex-row justify-between items-center">
                        <TouchableOpacity
                            disabled={isAllDisabled || (!canResend && !enableBtn)}
                            className={`border rounded-md h-12 pt-1 ${canResend || enableBtn ? "border-blue" : "border-gray-400"
                                }`}
                            onPress={sendEmailCode}
                        >
                            <Text
                                className={`p-2 ${canResend || enableBtn ? "text-blue" : "text-gray-400"
                                    }`}
                            >
                                Resend Email {!enableBtn && !canResend && `| in ${formatTime(resendTimer)}`}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            disabled={isAllDisabled || (!canRestart && !enableBtn)}
                            onPress={restart}
                            className={`border rounded-md h-12 pt-1 ${canRestart || enableBtn ? "border-blue" : "border-gray-400"
                                }`}
                        >
                            <Text
                                className={`p-2 ${canRestart || enableBtn ? "text-blue" : "text-gray-400"
                                    }`}
                            >
                                Restart {!enableBtn && !canRestart && `| in ${formatTime(restartTimer)}`}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View className="mt-3 px-3">
                    <Text className="text-2xl text-headercolor">
                        Already Registered?{" "}
                        <TouchableOpacity disabled={isAllDisabled} onPress={() => router.push("/otherPages/home")} className="pt-2">
                            <Text className="text-blue underline text-xl">Login here</Text>
                        </TouchableOpacity>
                    </Text>
                </View>

                <View className="px-3 mt-2">
                    <Text>
                        Please ensure that your email service provider does not block our emails. If you attempt to send emails from this page multiple times in a short period of time, they may end up in your spam folder. Therefore, please double-check all folders, including spam, before resending another email. Thank you.
                    </Text>
                </View>
            </View>

            <LoadingComponent visible={loading} />

            <ModalComponent
                visible={modalVisibility}
                onClose={() => setModalVisibility(false)}
                message={modalMess}
                errorType={modalErrorType}
                isButton={isButton}
            />
        </SafeAreaView>
    );
};

export default EmailVerification;
