import React from "react";
import { Modal, View, Text, TouchableOpacity, Image } from "react-native";

const ModalComponent = ({ visible, onClose, message, errorType,isButton = true}) => {
  let imageSource;

  switch (errorType) {
    case "error":
      imageSource = require("../../assets/images/cross-markup.png");
      break;
    case "success":
      imageSource = require("../../assets/images/check-markup.png"); 
      break;
    default:
      imageSource = require("../../assets/images/check-markup.png"); 
  }

  return (
    <Modal transparent={true} visible={visible} animationType="fade">
      <View className="flex-1 justify-center items-center bg-black/75">
        <View className="bg-[rgba(255,255,255,0.9)] p-6 rounded-2xl w-11/12 max-w-sm items-center">
          <View className="mb-1">
            {errorType === "warning" ? (
            <View style={{
              width: 80,
              height: 80,
              borderRadius: 50,
              justifyContent: 'center',
              alignItems: 'center',
              borderWidth: 3,
              borderColor: '#FFA500'
            }}>
              <Text style={{ fontSize: 48, color: 'orange', fontWeight: 'bold' }}>!</Text>
            </View>
          ) : (
            <Image
              source={imageSource}
              style={{ width: 105, height: 105 }}
            />
          )}

          </View>
          <Text className="text-2xl mb-2 text-headercolor font-normal text-center">
            {message}
          </Text>
          {
            isButton ? (
              <TouchableOpacity onPress={onClose} className="mt-2 w-full bg-blue p-3 rounded-md mb-4"
              activeOpacity={0.6}>
            <Text className="font-semibold text-white text-center text-xl">Close</Text>
          </TouchableOpacity>
            ):""
          }
        </View>
      </View>
    </Modal>
  );
};

export default ModalComponent;
