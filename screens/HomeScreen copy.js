import {
  View,
  Text,
  Image,
  SafeAreaView,
  TextInput,
  Platform,
  TouchableOpacity,
} from "react-native";

import { StatusBar } from "expo-status-bar";
import { theme } from "../theme";
import { MagnifyingGlassIcon } from "react-native-heroicons/outline";
import { CalendarDaysIcon, MapPinIcon } from "react-native-heroicons/solid";
import { useState } from "react";

const HomeScreen = (loc) => {
  const [toggleSearch, setToggleSearch] = useState(false);
  const [locations, setLocations] = useState(["Kamptee", "Nagpur", "Mumbai"]);

  const handleLocation = (loc) => {
    console.log("Location: ", loc);
  };

  return (
    <View className="flex-1 relative">
      <StatusBar style="light" />
      <Image
        blurRadius={70}
        source={require("../assets/images/bg.png")}
        className="absolute h-full w-full"
      />
      <SafeAreaView
        className="flex flex-1"
        style={{ paddingTop: Platform.OS === "android" ? 40 : 0 }}
      >
        {/* Search Area */}
        <View style={{ height: "7%" }} className="mx-4 relative z-50">
          <View
            className="flex-row justify-end items-center rounded-full"
            style={{
              backgroundColor: toggleSearch
                ? theme.bgWhite(0.2)
                : "transparent",
            }}
          >
            {toggleSearch ? (
              <TextInput
                placeholder="Search City..."
                placeholderTextColor={"lightgray"}
                className="pl-6 flex-1 h-10 text-base text-white"
              />
            ) : null}

            <TouchableOpacity
              onPress={() => setToggleSearch(!toggleSearch)}
              style={{ backgroundColor: theme.bgWhite(0.3) }}
              className="rounded-full p-3 m-1"
            >
              <MagnifyingGlassIcon size={24} color="#fff" />
            </TouchableOpacity>
          </View>
          {locations.length > 0 && toggleSearch ? (
            <View className="absolute w-full bg-gray-300 top-16 rounded-lg">
              {locations.map((loc, index) => {
                let showBorder = index + 1 != locations.length;
                let borderClass = showBorder
                  ? " border-b-2 border-b-gray-400"
                  : "";
                return (
                  <TouchableOpacity
                    onPress={() => handleLocation(loc)}
                    key={index}
                    className={
                      "flex-row items-center border-0 p-3 px-4" + borderClass
                    }
                  >
                    <MapPinIcon size="24" color="gray" />
                    <Text className="text-black text-lg ml-2">
                      London, United Kingdom
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          ) : null}
        </View>
        {/* Forecast */}
        <View className="flex flex-1 mx-4 mb-2">
          <Text className="text-white text-2xl font-bold text-center">
            Nagpur
          </Text>
          <Text className="text-lg text-center font-semibold text-gray-300">
            India
          </Text>
        </View>
        {/* Weather Icon */}
        <View className=" flex-row justify-center">
          <Image
            source={require("../assets/images/partlycloudy.png")}
            className="w-52 h-52 object-contain"
          />
        </View>
        {/* Temperature */}
        <View className="space-y-2">
          <Text className="text-center text-6xl ml-5 font-bold text-white">
            23&#176;
          </Text>
          <Text className="text-center text-white text-xl tracking-widest">
            Partly Cloudy
          </Text>
        </View>
        {/* Stats */}
        <View className="flex-row justify-between mx-4">
          <View>
            <Image
              source={require("../assets/icons/wind.png")}
              className="h-6 w-6"
            />
            <Text className="text-white font-semibold text-base">18Km</Text>
          </View>
          <View>
            <Image
              source={require("../assets/icons/drop.png")}
              className="h-6 w-6"
            />
            <Text className="text-white font-semibold text-base">23%</Text>
          </View>
          <View>
            <Image
              source={require("../assets/icons/sun.png")}
              className="h-6 w-6"
            />
            <Text className="text-white font-semibold text-base">6:05am</Text>
          </View>
        </View>
        {/* Forecast */}
        <View className="mb-2 space-y-3">
          <View className="flex-row items-center mx-5 space-x-2">
            <CalendarDaysIcon size="24" color="white" />
            <Text className="text-white">Daily Forecast</Text>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default HomeScreen;
