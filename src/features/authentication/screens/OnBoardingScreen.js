import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  SafeAreaView,
  Dimensions,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const SLIDES = [
  {
    title: "Explore Boundless Markets",
    description:
      "Dive into endless possibilities with curated spatial products across industries.",
    image: require("../../../../assets/images/onboarding1.jpg"),
  },
  {
    title: "Shop Effortlessly",
    description:
      "Find everything you need in a seamless, unified shopping experience.",
    image: require("../../../../assets/images/onboarding2.jpg"),
  },
  {
    title: "Your Payments, Secured",
    description:
      "Experience peace of mind with advanced security in every transaction.",
    image: require("../../../../assets/images/onboarding3.jpg"),
  },
];

export default function OnboardingScreen({ navigation }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    if (currentSlide < SLIDES.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      navigation.navigate("Login");
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const skipOnboarding = () => {
    navigation.navigate("Login");
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={SLIDES[currentSlide].image}
        style={styles.backgroundImage}
      >
        <View style={styles.overlay}>
          <TouchableOpacity style={styles.skipButton} onPress={skipOnboarding}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>

          <View style={styles.content}>
            <Text style={styles.title}>{SLIDES[currentSlide].title}</Text>
            <Text style={styles.description}>
              {SLIDES[currentSlide].description}
            </Text>
          </View>

          <View style={styles.navigation}>
            <TouchableOpacity
              style={[
                styles.circle,
                currentSlide === 0
                  ? styles.activeCircle
                  : styles.inactiveCircle,
              ]}
            />
            <TouchableOpacity
              style={[
                styles.circle,
                currentSlide === 1
                  ? styles.activeCircle
                  : styles.inactiveCircle,
              ]}
            />
            <TouchableOpacity
              style={[
                styles.circle,
                currentSlide === 2
                  ? styles.activeCircle
                  : styles.inactiveCircle,
              ]}
            />
          </View>

          <View style={styles.buttonContainer}>
            {currentSlide > 0 && (
              <TouchableOpacity style={styles.prevButton} onPress={prevSlide}>
                <Icon name="arrow-back" size={24} color="#FFF" />
              </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.nextButton} onPress={nextSlide}>
              <Icon name="arrow-forward" size={24} color="#FFF" />
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    width: screenWidth,
    height: screenHeight,
    resizeMode: "cover",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Dark overlay for text readability
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  skipButton: {
    alignSelf: "flex-end",
    marginTop: 10,
  },
  skipText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFF",
    textAlign: "center",
    marginBottom: 20,
  },
  description: {
    fontSize: 18,
    color: "#FFF",
    textAlign: "center",
    lineHeight: 26,
  },
  navigation: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  circle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginHorizontal: 5,
  },
  activeCircle: {
    backgroundColor: "#FFF",
  },
  inactiveCircle: {
    backgroundColor: "rgba(255, 255, 255, 0.5)",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    alignSelf: "center",
    width: "80%",
    marginBottom: 20,
  },
  prevButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#E0F7FA",
    alignItems: "center",
    justifyContent: "center",
    elevation: 10,
  },
  nextButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#E0F7FA",
    alignItems: "center",
    justifyContent: "center",
    elevation: 10,
  },
});
