import React from "react";
import { Modal, View, ActivityIndicator } from "react-native";

const LoadingComponent = ({ visible }) => {
  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={visible}
      // statusBarTranslucent
    >
      <View className="flex-1 bg-black/80 justify-center items-center">
        <View className="">
          <ActivityIndicator size={80} color="white" />
        </View>
      </View>
    </Modal>
  );
};

export default LoadingComponent;
