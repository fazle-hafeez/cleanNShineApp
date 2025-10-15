import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const PasswordInputField = ({ passwordError, password, setPassword, setPasswordError,placeholder }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View>
      <View
        style={{ position: "relative" }}
        className={`rounded-md border ${
          passwordError ? "border-red-500" : "border-gray-400"
        }`}
      >
        <TextInput
          className="rounded-md text-lg text-headercolor pr-10 p-3"
          placeholder={placeholder}
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={(val) => {
            setPassword(val);
            setPasswordError("");
          }}
          autoCapitalize="none"
          style={{ paddingRight: 40 }}
        />

        <TouchableOpacity
          onPress={() => setShowPassword((prev) => !prev)}
          style={styles.iconButton}
        >
          <Ionicons
            name={showPassword ? "eye" : "eye-off"}
            size={24}
            color="#646060ff"
          />
        </TouchableOpacity>
      </View>

      {passwordError ? (
        <Text className="text-sm text-red-500 my-1">{passwordError}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  iconButton: {
    position: "absolute",
    right: 8,
    top: "50%",
    transform: [{ translateY: -14 }],
    padding: 4,
  },
});

export default PasswordInputField;
