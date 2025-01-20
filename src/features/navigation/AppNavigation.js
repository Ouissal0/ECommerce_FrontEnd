import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import OnboardingScreen from "../authentication/screens/OnBoardingScreen.js";
import LoginScreen from "../authentication/screens/LoginScreen.js"; 
import SignUpScreen from "../authentication/screens/SignUpScreen.js"; 
import BottomNavigationBar from "./BottomNavigationBar";
import AccountSuccessScreen from "../authentication/screens/AccountSuccessScreen.js";
import ProfileScreen from "../profile/screens/ProfileScreen.js";
import MarketScreen from "../market/screens/MarketScreen.js";
import MarketSuccessScreen from "../market/screens/MarketSuccessScreen.js";
import MarketProductsScreen from "../market/screens/MarketProductsScreen.js";
import AddProductScreen from "../market/screens/AddProductScreen.js";
import MapScreen from "../map/screens/MapScreen.js";
import MarketDetailsScreen from "../map/screens/MarketDetailsScreen.js";
import PanierScreen from "../panier/screens/PanierScreen.js";
import ProductDetailsScreen from "../home/screens/ProductDetailsScreen.js";
import HomeScreen from "../home/screens/HomeScreen.js";

const Stack = createStackNavigator();

export default function AppNavigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="AccountSuccess" component={AccountSuccessScreen} />
        <Stack.Screen name="BottomNavigationBar" component={BottomNavigationBar} options={{gestureEnabled: false,}}/>
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Market" component={MarketScreen} />
        <Stack.Screen name="MarketSuccess" component={MarketSuccessScreen} />
        <Stack.Screen name="MarketProducts" component={MarketProductsScreen} />
        <Stack.Screen name="AddProduct" component={AddProductScreen} />
        <Stack.Screen name="Map" component={MapScreen} />
        <Stack.Screen name="MarketDetails" component={MarketDetailsScreen} />
        <Stack.Screen name="Panier" component={PanierScreen} />
        <Stack.Screen name="ProductDetails" component={ProductDetailsScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
