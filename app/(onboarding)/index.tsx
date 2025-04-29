import { View, Text, Image } from "react-native";
import React, { useRef, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import { StyleSheet } from "react-native";

import Swiper from "react-native-swiper";
import { colors } from "@/constants";
import Button from "@/components/Button";
import CurvyLine1 from "@/svg/curvy1";
import CurvyLine2 from "@/svg/curvy2";

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.light.black,
  },
  slide1: {
    flex: 1,
    backgroundColor: colors.light.black, 
  },
  slide2: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.light.black,
  },
  slide3: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.light.black,
  },
  text: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "bold",
  },
});

const index = () => {
  const swiperRef = useRef(null);
  const goToNextSlide = () => {
    swiperRef?.current?.scrollBy(1); // Move to the next slide
  };
  const [activeIndex, setActiveIndex] = useState(0);
  const lastIndex = activeIndex === 1 ? true : false;
  return (
    <View style={{ flex: 1, backgroundColor: colors.light.black }}>
      <Swiper
        ref={swiperRef}
        loop={false}
        pagingEnabled={true}
        onIndexChanged={(index) => setActiveIndex(index)}
        activeDot={
          <View
            style={{
              backgroundColor: colors.light.primary,
              width: 15,
              height: 15,
              opacity: 0.5,
              borderRadius: 50,
              marginHorizontal: 5,
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <View
            style={{
              backgroundColor: colors.light.primary,
              width: 8,
              height: 8,
              borderRadius: 50,
              // marginHorizontal: 5,
            }}
          />
          </View>
        }
        dot={
          <View
            style={{
              backgroundColor: colors.light.primary,
              width: 15,
              height: 15,
              opacity: 0.5,
              borderRadius: 50,
              marginHorizontal: 5,
            }}
          ></View>
        }
        style={styles.wrapper}
      >
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <View
            style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 100 }}
          >
            <Image
              source={require("@/assets/images/chomsky_nearby.png")}
              style={{ width: 280, height: 300 }}
              resizeMode="contain"
            />
          </View>
            <View style={{ position: "absolute",zIndex: -1, top: "30%", width: "100%" }}>
              <CurvyLine1 style={{transform: [{ scaleY: -1 }, { rotate: "30deg" }], }}/>
            </View>
          <View style={{ alignItems: "center", gap: 10, width: "80%"}}>
            <Text
              style={{
                fontSize: 24,
                fontFamily: "Satoshi-Bold",
                textAlign: "center",
                color: colors.light.background_white
              }}
            >
              <Text style={{color: colors.light.primary}}>Chomsky</Text> is always nearby
            </Text>
            <Text
              style={{
                // fontSize: FontSize.paragraph_fmedium,
                fontFamily: "Satoshi-Regular",
                textAlign: "center",
                color: colors.light.background_white
              }}
            >
              With Chomsky, help is always within reach{"\n"}
              Anytime, Anywhere.
            </Text>
          </View>
        </View>
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <View
            style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 100 }}
          >
            <Image
              source={require("@/assets/images/chomsky_watching.png")}
              style={{ width: 280, height: 300 }}
              resizeMode="contain"
            />
          </View>
            <View style={{ position: "absolute",zIndex: -1, top: "37.4%", alignSelf: "center", width: "100%" }}>
              <CurvyLine2 />
            </View>
          <View style={{ alignItems: "center", gap: 10, width: "80%"}}>
            <Text
              style={{
                fontSize: 24,
                fontFamily: "Satoshi-Bold",
                textAlign: "center",
                color: colors.light.background_white
              }}
            >
               Always Here for <Text style={{color: colors.light.primary}}>You</Text>
            </Text>
            <Text
              style={{
                // fontSize: FontSize.paragraph_fmedium,
                fontFamily: "Satoshi-Regular",
                textAlign: "center",
                color: colors.light.background_white
              }}
            >
              With Chomsky, you're never alone 
              support and safety are always watching over you.
            </Text>
          </View>
        </View>
      </Swiper>
      <View style={{ marginBottom: 30, marginHorizontal: 10 }}>
        <Button
          type="normal"
          title={lastIndex ? "Get Started" : "Next"}
          onPress={
            !lastIndex ? goToNextSlide : () => router.replace("/(auth)/getstarted")
          }
        />
      </View>
      <StatusBar style="auto" />
    </View>
  );
};

export default index;
