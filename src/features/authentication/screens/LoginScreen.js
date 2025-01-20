import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';


const LoginScreen = () => {
  const navigation = useNavigation();

  // States
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
  
    try {
      const endpoint = "http://192.168.27.154:5000/api/Authentication/login";
  
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        console.log("Login successful:", result);
  
        // Sauvegarder le username dans AsyncStorage
        await AsyncStorage.setItem("username", username);
  
        navigation.navigate("BottomNavigationBar"); 
      } else {
        console.error("Login failed:", result.message);
        alert(`Login failed: ${result.message}`);
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("An error occurred during login. Please try again.");
    }
  };

  const handleCreateAccount = () => {
    navigation.navigate("SignUp");
  };

  return (
    <View style={styles.container}>
      {/* Top Image */}
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

      {/* Login Form */}
      <View style={styles.formContainer}>
        {/* Username Input */}
        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor="#888"
          value={username} // Utilisation de la variable d'état username
          onChangeText={setUsername} // Met à jour username
        />

        {/* Password Input */}
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#888"
          secureTextEntry={secureTextEntry}
          value={password} // Utilisation de la variable d'état password
          onChangeText={setPassword} // Met à jour password
        />
        <TouchableOpacity
          onPress={togglePasswordVisibility}
          style={styles.passwordToggle}
        >
          <Text style={styles.toggleText}>
            {secureTextEntry ? "Show" : "Hide"}
          </Text>
        </TouchableOpacity>

        {/* Sign In Button */}
        <TouchableOpacity style={styles.signInButton} onPress={handleSignIn}>
          <Text style={styles.signInText}>Sign In</Text>
        </TouchableOpacity>

        {/* Create Account Button */}
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
    width: "70%", // Adjust logo width
    height: "30%", // Adjust logo height
  },
  formContainer: {
    height: "65%",
    width: "90%", // Specific width for the form
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
