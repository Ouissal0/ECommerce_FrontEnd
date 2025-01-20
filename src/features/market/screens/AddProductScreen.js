import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  Image,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import DropDownPicker from "react-native-dropdown-picker";

const AddProductScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [image, setImage] = useState(null);
  const [category, setCategory] = useState(null);

  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [categories, setCategories] = useState([
    { label: "Food", value: "food" },
    { label: "Personal Care", value: "personal_care" },
    { label: "Electronics", value: "electronics" },
    { label: "Clothing", value: "clothing" },
    { label: "Furniture", value: "furniture" },
    { label: "Sports", value: "sports" },
    { label: "Toys", value: "toys" },
  ]);

  const handlePickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert("Permission Denied", "You need to allow access to your gallery!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri); // Use the selected image URI
    }
  };

  const handleAddProduct = () => {
    if (!name || !description || !price || !quantity || !image || !category) {
      Alert.alert("Error", "Please fill all fields!");
      return;
    }

    Alert.alert("Success", `${name} has been added successfully!`);
    navigation.goBack(); // Navigate back after adding the product
  };

  return (
    <ScrollView style={styles.container}>
     {/* Header */}
     <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backArrow}
        >
          <Text style={styles.backArrowText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Add New Product</Text>
      </View>

      {/* Name Input */}
      <Text style={styles.label}>Product Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter product name"
        value={name}
        onChangeText={setName}
      />

      {/* Description Input */}
      <Text style={styles.label}>Description</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Enter product description"
        value={description}
        onChangeText={setDescription}
        multiline
      />

      {/* Price Input */}
      <Text style={styles.label}>Price ($)</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter price"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
      />

      {/* Quantity Input */}
      <Text style={styles.label}>Quantity in Stock</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter quantity"
        value={quantity}
        onChangeText={setQuantity}
        keyboardType="numeric"
      />

      {/* Category Dropdown */}
      <Text style={styles.label}>Category</Text>
      <DropDownPicker
        open={categoriesOpen}
        value={category}
        items={categories}
        setOpen={setCategoriesOpen}
        setValue={setCategory}
        setItems={setCategories}
        placeholder="Select a category"
        style={styles.dropdown}
        dropDownContainerStyle={styles.dropdownContainer}
      />

      {/* Image Picker */}
      <Text style={styles.label}>Product Image</Text>
      <TouchableOpacity style={styles.imagePicker} onPress={handlePickImage}>
        {image ? (
          <Image source={{ uri: image }} style={styles.productImage} />
        ) : (
          <Text style={styles.imagePickerText}>Pick an Image</Text>
        )}
      </TouchableOpacity>

      {/* Add Product Button */}
      <TouchableOpacity style={styles.addButton} onPress={handleAddProduct}>
        <Text style={styles.addButtonText}>Add Product</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E0F2F1", // Teal background
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#00796B", // Teal color
    textAlign: "center",
    marginTop: 35,
    marginLeft : 30,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#004D40", // Dark teal
    marginBottom: 5,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#B2DFDB", // Light teal border
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    marginBottom: 15,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  dropdown: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#B2DFDB",
    borderRadius: 10,
    marginBottom: 15,
  },
  dropdownContainer: {
    borderWidth: 1,
    borderColor: "#B2DFDB",
  },
  imagePicker: {
    height: 150,
    backgroundColor: "#E0F2F1", // Light teal
    borderWidth: 1,
    borderColor: "#00796B", // Teal
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  imagePickerText: {
    color: "#004D40", // Dark teal
    fontWeight: "bold",
  },
  productImage: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  addButton: {
    backgroundColor: "#00796B", // Teal button
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  backArrow: {
    marginLeft: 40,
    marginTop: 40,
    padding: 5,
  },
  backArrowText: {
    fontSize: 20,
    color: "#00796B",
    fontWeight: "bold",
  },
});

export default AddProductScreen;
