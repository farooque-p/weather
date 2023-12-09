import {
  View,
  Text,
  Image,
  SafeAreaView,
  TextInput,
  Platform,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
} from "react-native";

import { StatusBar } from "expo-status-bar";
import { theme } from "../theme";
import { MagnifyingGlassIcon } from "react-native-heroicons/outline";
import { CalendarDaysIcon, MapPinIcon } from "react-native-heroicons/solid";
import { useState, useCallback, useEffect } from "react";
import { debounce } from "lodash";
import { fetchLocation, fetchWeatherForecast } from "../api/weather.js";
import { weatherImages } from "../constants/index.js";
import * as Progress from "react-native-progress";
import { getData, storeData } from "../utils/asyncStorage.js";

const HomeScreen = (loc) => {
  const [toggleSearch, setToggleSearch] = useState(false);
  const [locations, setLocations] = useState([]);
  const [weather, setWeather] = useState({});
  const [loading, setLoading] = useState(true);

  const handleLocation = (loc) => {
    setLoading(true);
    setToggleSearch(false);
    setLocations([]);
    fetchWeatherForecast({
      cityName: loc.name,
      days: "7",
    }).then((data) => {
      setWeather(data);
      setLoading(false);
      storeData("city", loc.name);
    });
  };
  const handleSearch = (value) => {
    if (value && value.length > 2) {
      fetchLocation({ cityName: value }).then((data) => {
        setLocations(data);
      });
    }
  };

  useEffect(() => {
    fetchMyWeatherData();
  }, []);

  const fetchMyWeatherData = async () => {
    let myCity = await getData("city");
    let cityName = "Nagpur";
    if (myCity) cityName = myCity;

    fetchWeatherForecast({
      cityName,
      days: "7",
    }).then((data) => {
      setWeather(data);
      setLoading(false);
    });
  };

  const handleTextDebounce = useCallback(debounce(handleSearch, 1200), []);
  const { current, location } = weather;

  return (
    <KeyboardAvoidingView
      className="flex-1 relative"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <StatusBar style="light" />
      <Image
        blurRadius={70}
        source={require("../assets/images/bg.png")}
        className="absolute h-full w-full"
      />
      {loading ? (
        <View className="flex-1 flex-row justify-center items-center">
          <Progress.CircleSnail thickness={10} size={140} color="#0bb3b2" />
        </View>
      ) : (
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
                  onChangeText={handleTextDebounce}
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
                        {loc.name},{loc.county}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ) : null}
          </View>
          <View className="flex flex-1 justify-around">
            {/* Location */}
            <View className="flex-row justify-center items-center">
              <Text className="text-white text-2xl font-bold text-center">
                {location?.name},
              </Text>
              <Text className="text-lg text-center font-semibold text-gray-300">
                {location?.country}
              </Text>
            </View>
            {/* Weather Icon */}
            <View className=" flex-row justify-center">
              <Image
                source={weatherImages[current?.condition.text]}
                //source={require("../assets/images/partlycloudy.png")}
                className="w-52 h-52 object-contain"
              />
            </View>
            {/* Temperature */}
            <View className="space-y-2">
              <Text className="text-center text-6xl ml-5 font-bold text-white">
                {current?.temp_c}&#176;
              </Text>
              <Text className="text-center text-white text-xl tracking-widest">
                {current?.condition?.text}
              </Text>
              <Text className="text-center text-white text-xl tracking-widest">
                {current?.feelslike_c}
              </Text>
            </View>

            {/* States */}
            <View className="flex-row justify-between mx-4">
              <View className="flex-row space-x-2">
                <Image
                  source={require("../assets/icons/wind.png")}
                  className="h-6 w-6"
                />
                <Text className="text-white font-semibold text-base">
                  {current?.wind_kph} km/h
                </Text>
              </View>
              <View className="flex-row space-x-2">
                <Image
                  source={require("../assets/icons/drop.png")}
                  className="h-6 w-6"
                />
                <Text className="text-white font-semibold text-base">
                  {current?.humidity}%
                </Text>
              </View>
              <View className="flex-row space-x-2">
                <Image
                  source={require("../assets/icons/sun.png")}
                  className="h-6 w-6"
                />
                <Text className="text-white font-semibold text-base">
                  {weather?.forecast?.forecastday[0]?.astro?.sunrise}
                </Text>
              </View>
            </View>
            {/* Forecast */}
            <View className="mb-2 space-y-3">
              <View className="flex-row items-center mx-5 space-x-2">
                <CalendarDaysIcon size="24" color="white" />
                <Text className="text-white">Daily Forecast</Text>
              </View>
              <ScrollView
                horizontal
                contentContainerStyle={{ paddingHorizontal: 15 }}
                showsHorizontalScrollIndicator={false}
              >
                {weather.forecast?.forecastday?.map((item, index) => {
                  let date = new Date(item?.date);
                  let options = { weekday: "long" };
                  let dayName = date.toLocaleDateString("en-US", options);
                  dayName = dayName.split(",")[0];
                  return (
                    <View
                      key={index}
                      className="flex justify-center items-center w-24 rounded-lg py-3 space-y-1 mr-4"
                      style={{ backgroundColor: theme.bgWhite(0.15) }}
                    >
                      <Image
                        source={weatherImages[item?.day?.condition?.text]}
                        className="h-11 w-11"
                      />
                      <Text className="text-white">{dayName}</Text>
                      <Text className="text-white text-lg font-semibold">
                        {item?.day?.avgtemp_c}&#176;
                      </Text>
                    </View>
                  );
                })}
              </ScrollView>
            </View>
          </View>
        </SafeAreaView>
      )}
    </KeyboardAvoidingView>
  );
};

export default HomeScreen;
