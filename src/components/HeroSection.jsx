//import liraries
import React from 'react';
import { View, Text ,ImageBackground} from 'react-native';

// create a component
const HeroSection = () => {
    return (
        <ImageBackground
                source={require("../../assets/images/clean3.jpeg")}
                className="h-[400px] w-full"
              >
        <View className="bg-blue p-3" >
            <Text className="text-white text-2xl text-center font-semibold">
                TRACKING DUDES LLC
            </Text>
        </View>
     </ImageBackground>
    );
};

export default HeroSection;
