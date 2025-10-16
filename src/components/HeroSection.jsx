import React, { useState } from 'react';
import { View, Text, ImageBackground } from 'react-native';

//  Define an array of all your image sources
const images = [
    require("../../assets/images/clean1.jpeg"),
    require("../../assets/images/clean2.png"),
    require("../../assets/images/clean3.jpeg"),
    require("../../assets/images/clean4.png"),
    require("../../assets/images/clean5.png"),
    require("../../assets/images/clean6.png"),
    require("../../assets/images/clean7.png"),
    require("../../assets/images/clean8.png"),

];

// Function to randomly select one image source
const getRandomImage = () => {
    const randomIndex = Math.floor(Math.random() * images.length);
    return images[randomIndex];
};

const HeroSection = () => {
    const [randomImage] = useState(getRandomImage);

    return (
        <ImageBackground
            source={randomImage}
            className="h-[400px] w-full"
            resizeMode={'cover'}
        >
            <View className="bg-blue p-4" >
                <Text className="text-white text-2xl text-center font-semibold ">
                    TRACKING DUDES LLC
                </Text>
            </View>
        </ImageBackground>
    );
};

export default HeroSection;