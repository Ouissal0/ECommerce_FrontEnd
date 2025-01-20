import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
const { ipAddress } = require("../../../config");

const LoginScreen = () => {
  const navigation = useNavigation();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  const togglePasswordVisibility = () => {
    setSecureTextEntry(!secureTextEntry);
  };

  const handleSignIn = async () => {
    console.log("Sign In clicked with username:", username);

    const payload = {
      userName: username,
      password: password,
    };
    const endpoint = `http://${ipAddress}:5001/api/Authentication/login`;
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        const result = await response.json();
        console.log("Login successful:", result);

        await AsyncStorage.setItem("username", username);

        navigation.navigate("BottomNavigationBar");
      } else {
        const errorData = await response.json();
        console.error("Login failed:", errorData.message);
        Alert.alert(
          "Login Failed",
          errorData.message || "An error occurred during login."
        );
      }
    } catch (error) {
      console.error("Error during login:", error);
      Alert.alert("Error", "An error occurred during login. Please try again.");
    }
  };

  const handleCreateAccount = () => {
    navigation.navigate("SignUp");
  };

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <Image
          source={require("../../../../assets/logos/dealsquare.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>Welcome Back !</Text>
        <Text style={styles.subTitle}>Sign in to continue</Text>
      </View>

      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor="#888"
          value={username}
          onChangeText={setUsername}
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#888"
          secureTextEntry={secureTextEntry}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity
          onPress={togglePasswordVisibility}
          style={styles.passwordToggle}
        >
          <Text style={styles.toggleText}>
            {secureTextEntry ? "Show" : "Hide"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.signInButton} onPress={handleSignIn}>
          <Text style={styles.signInText}>Sign In</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.createAccountButton}
          onPress={handleCreateAccount}
        >
          <Text style={styles.createAccountText}>Create Account</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E0F7FA",
  },
  topContainer: {
    height: "30%",
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: {
    marginBottom: 20,
    marginTop: -50,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
    textAlign: "center",
  },
  subTitle: {
    fontSize: 15,
    color: "#333",
    marginBottom: 10,
    textAlign: "center",
  },
  logo: {
    width: "70%",
    height: "30%",
  },
  formContainer: {
    height: "65%",
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
    alignItems: "center",
    alignSelf: "center",
  },
  input: {
    width: "100%",
    height: 50,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 20,
    backgroundColor: "#F9F9F9",
    fontSize: 16,
    color: "#333",
  },
  passwordToggle: {
    alignSelf: "flex-end",
    marginTop: -55,
    marginBottom: 20,
    marginRight: 10,
  },
  toggleText: {
    color: "#008080",
    fontSize: 14,
    fontWeight: "bold",
  },
  signInButton: {
    width: "100%",
    height: 50,
    backgroundColor: "#008080",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 30,
  },
  signInText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  createAccountButton: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#008080",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  createAccountText: {
    color: "#008080",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default LoginScreen;
