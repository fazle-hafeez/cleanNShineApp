import { Link, useLocalSearchParams, useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StatusBar, Platform } from "react-native"
import HeroSection from "../../src/components/HeroSection";
import Button from "../../src/components/Button";
import LoadingComponent from "../../src/components/LoadingComponent";
import ModalComponent from "../../src/components/ModalComponent";
import AsyncStorage from "@react-native-async-storage/async-storage";

const EmailVerification = () => {
    const router = useRouter();

    const [code, setCode] = useState("");
    const [otpError, setOtpError] = useState("");
    const [wrongAttempts, setWrongAttempts] = useState(0);
    const [isBlocked, setIsBlocked] = useState(false);
    const [blockTimer, setBlockTimer] = useState(180); // 3 minutes
    const [resendTimer, setResendTimer] = useState(60);
    const [restartTimer, setRestartTimer] = useState(30);
    const [canResend, setCanResend] = useState(false);
    const [canRestart, setCanRestart] = useState(false);
    const [loading, setLoading] = useState(false);
    const [modalVisibility, setModalVisibility] = useState(false);
    const [modalMess, setModalMess] = useState("");
    const [modalErrorType, setModalErrorType] = useState("");
    const [isButton, setIsButton] = useState(true);
    const [token, setToken] = useState("")

    const { trimmedEmail, changePassword, enableBtn, reastartEmail, resetEmail } = useLocalSearchParams();

    // Disable all buttons during block or loading
    const isAllDisabled = isBlocked || loading;

    // Format seconds to mm:ss
    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? "0" : ""}${s}`;
    };

    // Timers
    useEffect(() => {
        const interval = setInterval(() => {
            setResendTimer((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    setCanResend(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setRestartTimer((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    setCanRestart(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    // 3-minute block timer
    useEffect(() => {
        let interval;
        if (isBlocked) {
            interval = setInterval(() => {
                setBlockTimer((prev) => {
                    if (prev <= 1) {
                        clearInterval(interval);
                        setIsBlocked(false);
                        setWrongAttempts(0);
                        setBlockTimer(180); // reset
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

        if (code.trim() === "") {
            setOtpError("OTP is required!");
            return;
        }

        setLoading(true);
        try {
            const result = await fetch("https://trackingdudes.com/apis/register/verify-email/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code }),
            });

            const response = await result.json();
            console.log(response);

            //  If backend says success
            if (response.status === "success") {
                setLoading(false);
                setModalMess(response.data || "Email verified successfully!");
                setModalErrorType("success");
                const tokenValue = response.token;  // get token from response
                setToken(tokenValue);
                try {
                    await AsyncStorage.setItem("refreshToken", tokenValue);
                    console.log("Token saved to AsyncStorage ");
                } catch (err) {
                    console.error("Failed to save token:", err);
                }
                // store in async storage
                setModalVisibility(true);
                setIsButton(false);
                setTimeout(() => {
                    setModalVisibility(false);
                    router.push({
                        pathname: changePassword ? "/auth/changePassword" : "/auth/registerNewUser",
                        params: { trimmedEmail: changePassword ? resetEmail : trimmedEmail },
                    });
                }, 2000);

                setCode(""); // clear the input
            }

            //  If backend says error
            else if (response.status === "error") {
                setLoading(false);
                setWrongAttempts((prev) => {
                    const next = prev + 1;
                    if (next >= 3) {
                        setIsBlocked(true);
                        setModalMess("You’ve entered the wrong code 3 times. Try again after 3 minutes.");
                        setModalErrorType("error");
                        setModalVisibility(true);
                    } else {
                        setModalMess(response.data || "Invalid OTP. Please try again.");
                        setModalErrorType("error");
                        setModalVisibility(true);
                    }
                    return next;
                });
            }
            //  Unexpected response
            else {
                setLoading(false);
                setModalMess("Unexpected response from server.");
                setModalErrorType("error");
                setModalVisibility(true);
                setIsButton(true)
            }
        } catch (error) {
            setLoading(false);
            setModalMess("Something went wrong. Try again later.");
            setModalErrorType("error");
            setModalVisibility(true);
        }
    };


    // Restart process
    const restart = () => {
        router.push({
            pathname: "/auth/login",
            params: { show: true, trimmedEmail, resetEmail },
        });
    };

    // Resend email
    const sendEmailCode = async () => {
        setLoading(true);
        try {
            const response = await fetch(`https://trackingdudes.com/apis/register/resend-email/`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
            });

            const result = await response.json();
            console.log(result);

            if (result.status === "success") {
                setLoading(false); //  enable buttons again
                setModalMess("Verification email sent successfully!");
                setModalErrorType("success");
                setModalVisibility(true);
                return;
            }

            //  Error case
            setLoading(false);
            setModalMess(result.data);
            setModalErrorType("error");
            setModalVisibility(true);
            setIsButton(true)
        } catch (error) {
            console.log(error);
            setLoading(false);
            setModalMess("Failed to resend verification email. Try again later.");
            setModalErrorType("error");
            setIsButton(true)
            setModalVisibility(true);
        }
    };


    return (
        <View>
            <StatusBar barStyle="light-content" backgroundColor="#0000ff" />
            <HeroSection />

            <View className="h-full p-4 mx-auto">
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
                        <TouchableOpacity disabled={isAllDisabled} onPress={() => router.push("/home")} className="pt-2">
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
        </View>
    );
};

export default EmailVerification;
