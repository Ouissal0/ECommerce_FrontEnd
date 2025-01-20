import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";
import { validateSignUpForm } from "../../../../utils/formatters";

const SignUpScreen = () => {
  const navigation = useNavigation();
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [role, setRole] = useState("");

  // Form states
  const [profileImage, setProfileImage] = useState(null); // Stores base64 image
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});

  const togglePasswordVisibility = () => {
    setSecureTextEntry(!secureTextEntry);
  };

  const handleSelectProfileImage = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert(
          "Permission Required",
          "Please allow access to your gallery."
        );
        return;
      }

      const pickerResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images, // Correct usage for media types
        allowsEditing: true,
        base64: true,
      });

      if (!pickerResult.canceled) {
        const selectedImage = pickerResult.assets
          ? pickerResult.assets[0]
          : pickerResult; // Handle structure
        setProfileImage(`data:image/jpeg;base64,${selectedImage.base64}`);
      }
    } catch (error) {
      console.error("Error selecting image: ", error);
    }
  };

  const handleCreateAccount = async () => {
    const values = {
      profileImage,
      firstName,
      lastName,
      phoneNumber,
      username,
      email,
      password,
      confirmPassword,
      role,
    }; 
    const { valid, errors } = validateSignUpForm(values);

    if (valid) {
      const payload = {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password,
        phoneNumber: values.phoneNumber,
        userName: values.username,
        image: values.profileImage,
        role: values.role || "CLIENT", 
      };
      try {
        const endpoint = "http://192.168.27.154:5000/api/Authentication/register"; 
  
        // Envoi de la requête POST avec fetch
        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload), // Convertit l'objet en JSON
        });
  
        const result = await response.json();
  
        if (response.ok) {
          console.log("Account successfully created:", result);
          navigation.navigate("AccountSuccess"); 
        } else {
          console.error("Failed to create account:", result.message);
          alert(`Failed to create account: ${result.message}`);
        }
      } catch (error) {
        console.error("Error creating account:", error);
        alert("An error occurred while creating the account. Please try again.");
      }
    } else {
      setErrors(errors);
      console.log("Form has errors", errors);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContainer}
      keyboardShouldPersistTaps="handled"
    >
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.title}>Sign Up</Text>
        <Text style={styles.subTitle}>
          Please enter your details to create an account
        </Text>
      </View>

      {/* Form Section */}
      <View style={styles.formContainer}>
        {/* Profile Image Section */}
        <View style={styles.profileSection}>
          <TouchableOpacity
            style={styles.profileIcon}
            onPress={handleSelectProfileImage}
          >
            {profileImage ? (
              <Image
                source={{ uri: profileImage }}
                style={styles.profileImage}
              />
            ) : (
              <Icon name="account-circle" size={100} color="#008080" />
            )}
          </TouchableOpacity>
          <Text style={styles.profileText}>Select your Profile Image</Text>
          {errors.profileImage && (
            <Text style={styles.errorText}>{errors.profileImage}</Text>
          )}
        </View>

        {/* Input Fields */}
        <View>
          {/* First Name */}
          <View style={styles.inputWrapper}>
            <Icon
              name="person"
              size={20}
              color="#888"
              style={styles.iconLeft}
            />
            <TextInput
              style={styles.input}
              placeholder="First Name"
              placeholderTextColor="#888"
              value={firstName}
              onChangeText={setFirstName}
            />
          </View>
          {errors.firstName && (
            <Text style={styles.errorText}>{errors.firstName}</Text>
          )}

          {/* Last Name */}
          <View style={styles.inputWrapper}>
            <Icon
              name="person"
              size={20}
              color="#888"
              style={styles.iconLeft}
            />
            <TextInput
              style={styles.input}
              placeholder="Last Name"
              placeholderTextColor="#888"
              value={lastName}
              onChangeText={setLastName}
            />
          </View>
          {errors.lastName && (
            <Text style={styles.errorText}>{errors.lastName}</Text>
          )}

          {/* Phone Number */}
          <View style={styles.inputWrapper}>
            <Icon name="phone" size={20} color="#888" style={styles.iconLeft} />
            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              placeholderTextColor="#888"
              keyboardType="phone-pad"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
            />
          </View>
          {errors.phoneNumber && (
            <Text style={styles.errorText}>{errors.phoneNumber}</Text>
          )}

          {/* Username */}
          <View style={styles.inputWrapper}>
            <Icon
              name="person-outline"
              size={20}
              color="#888"
              style={styles.iconLeft}
            />
            <TextInput
              style={styles.input}
              placeholder="Username"
              placeholderTextColor="#888"
              value={username}
              onChangeText={setUsername}
            />
          </View>
          {errors.username && (
            <Text style={styles.errorText}>{errors.username}</Text>
          )}

          {/* Email */}
          <View style={styles.inputWrapper}>
            <Icon name="email" size={20} color="#888" style={styles.iconLeft} />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#888"
              value={email}
              onChangeText={setEmail}
            />
          </View>
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

          {/* Password */}
          <View style={styles.inputWrapper}>
            <Icon name="lock" size={20} color="#888" style={styles.iconLeft} />
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
              style={styles.iconRight}
            >
              <Icon
                name={secureTextEntry ? "visibility-off" : "visibility"}
                size={20}
                color="#888"
              />
            </TouchableOpacity>
          </View>
          {errors.password && (
            <Text style={styles.errorText}>{errors.password}</Text>
          )}

          {/* Confirm Password */}
          <View style={styles.inputWrapper}>
            <Icon name="lock" size={20} color="#888" style={styles.iconLeft} />
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              placeholderTextColor="#888"
              secureTextEntry={true}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
          </View>
          {errors.confirmPassword && (
            <Text style={styles.errorText}>{errors.confirmPassword}</Text>
          )}
        </View>

        {/* Role Selection */}
        <View style={styles.radioButtonGroup}>
          <Text style={styles.label}>Select your role:</Text>
          <View style={styles.radioButtonRow}>
            <TouchableOpacity
              style={[
                styles.radioButtonContainer,
                role === "VENDEUR" && styles.selectedRadioButtonContainer,
              ]}
              onPress={() => setRole("VENDEUR")}
            >
              <Text
                style={[
                  styles.radioLabel,
                  role === "VENDEUR" && styles.selectedRadioLabel,
                ]}
              >
                Market Owner
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.radioButtonContainer,
                role === "CLIENT" && styles.selectedRadioButtonContainer,
              ]}
              onPress={() => setRole("CLIENT")}
            >
              <Text
                style={[
                  styles.radioLabel,
                  role === "CLIENT" && styles.selectedRadioLabel,
                ]}
              >
                Buyer
              </Text>
            </TouchableOpacity>
          </View>
          {errors.role && <Text style={styles.errorText}>{errors.role}</Text>}
        </View>

        {/* Create Account Button */}
        <TouchableOpacity
          style={styles.createAccountButton}
          onPress={handleCreateAccount}
        >
          <Text style={styles.createAccountText}>Create Account</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 20,
    backgroundColor: "#F5F5F5",
  },
  header: {
    backgroundColor: "#008080",
    paddingVertical: 40,
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 10,
  },
  subTitle: {
    fontSize: 16,
    color: "#FFF",
  },
  formContainer: {
    backgroundColor: "#FFF",
    marginTop: -20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    padding: 15,
  },
  profileSection: {
    alignItems: "center",
    marginBottom: 10,
  },
  profileIcon: {
    marginBottom: 5,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  profileText: {
    fontSize: 16,
    color: "#666",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: "#F9F9F9",
    paddingHorizontal: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    padding: 12,
  },
  iconLeft: {
    marginRight: 10,
  },
  iconRight: {
    paddingLeft: 10,
  },
  radioButtonGroup: {
    marginBottom: 20,
  },
  radioButtonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  radioButtonContainer: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginBottom: 5,
    borderWidth: 1,
    borderColor: "#008080",
    borderRadius: 8,
    backgroundColor: "#FFF",
    alignItems: "center",
  },
  selectedRadioButtonContainer: {
    backgroundColor: "#008080",
  },
  radioLabel: {
    fontSize: 16,
    color: "#008080",
  },
  selectedRadioLabel: {
    color: "#FFF",
  },
  createAccountButton: {
    backgroundColor: "#008080",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  createAccountText: {
    fontSize: 16,
    color: "#FFF",
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginBottom: 10,
  },
});

export default SignUpScreen;
