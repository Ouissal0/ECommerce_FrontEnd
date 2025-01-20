import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';

const PanierScreen = ({ navigation }) => {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: 'Hydrating Mask',
      volume: 'Volume 85ml',
      price: 28,
      quantity: 1,
      image: 'https://via.placeholder.com/100',
    },
    {
      id: 2,
      name: 'Lip Balm',
      volume: 'Volume 3.50ml',
      price: 8,
      quantity: 1,
      image: 'https://via.placeholder.com/100',
    },
    {
      id: 3,
      name: 'Floral Water',
      volume: 'Volume 30ml',
      price: 12,
      quantity: 1,
      image: 'https://via.placeholder.com/100',
    },
  ]);

  const deliveryFee = 5.50;

  const updateQuantity = (id, increment) => {
    setCartItems(cartItems.map(item => {
      if (item.id === id) {
        const newQuantity = item.quantity + increment;
        return {
          ...item,
          quantity: newQuantity > 0 ? newQuantity : 1,
        };
      }
      return item;
    }));
  };

  const removeItem = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateTotal = () => {
    return calculateSubtotal() + deliveryFee;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.navigate("Home")}
          style={styles.backButton}
        >
          <AntDesign name="left" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Cart</Text>
      </View>

      <ScrollView contentContainerStyle={styles.cartContent}>
        {cartItems.map((item) => (
          <View key={item.id} style={styles.cartItem}>
            <Image
              source={{ uri: item.image }}
              style={styles.productImage}
            />
            <View style={styles.productDetails}>
              <Text style={styles.productName}>{item.name}</Text>
              <Text style={styles.productVolume}>{item.volume}</Text>
              <Text style={styles.price}>{item.price} €</Text>
              <Text style={styles.subtotal}>
                Subtotal: {(item.price * item.quantity).toFixed(2)} €
              </Text>
            </View>
            <View style={styles.productActions}>
              <View style={styles.quantityControls}>
                <TouchableOpacity
                  onPress={() => updateQuantity(item.id, -1)}
                  style={styles.quantityButton}
                >
                  <Text style={styles.quantityButtonText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.quantity}>{item.quantity}</Text>
                <TouchableOpacity
                  onPress={() => updateQuantity(item.id, 1)}
                  style={styles.quantityButton}
                >
                  <Text style={styles.quantityButtonText}>+</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                onPress={() => removeItem(item.id)}
                style={styles.removeButton}
              >
                <AntDesign name="delete" size={20} color="#FF6347" />
              </TouchableOpacity>
            </View>
          </View>
        ))}

        <View style={styles.invoice}>
          <Text style={styles.invoiceTitle}>Invoice</Text>
          <View style={styles.invoiceRow}>
            <Text style={styles.invoiceLabel}>Cart Total</Text>
            <Text style={styles.invoiceValue}>{calculateSubtotal().toFixed(2)} €</Text>
          </View>
          <View style={styles.invoiceRow}>
            <Text style={styles.invoiceLabel}>Delivery Fee</Text>
            <Text style={styles.invoiceValue}>{deliveryFee.toFixed(2)} €</Text>
          </View>
          <View style={[styles.invoiceRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>{calculateTotal().toFixed(2)} €</Text>
          </View>
        </View>
      </ScrollView>

      <TouchableOpacity 
        style={styles.confirmButton}
        onPress={() => {
          // Handle order confirmation
          console.log('Order confirmed');
        }}
      >
        <Text style={styles.confirmButtonText}>Confirm Order</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#008080',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    color: 'white',
  },
  cartContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productImage: {
    width: 120,
    height: 120,
  },
  productDetails: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    color: '#333',
  },
  productVolume: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
    color: '#008080',
  },
  subtotal: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
  },
  productActions: {
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 8,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E0F7F7',
    borderRadius: 20,
    padding: 4,
  },
  quantityButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#008080',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  quantityButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  quantity: {
    fontSize: 16,
    fontWeight: '600',
    marginHorizontal: 8,
  },
  removeButton: {
    marginTop: 8,
  },
  invoice: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 16,
  },
  invoiceTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#008080',
  },
  invoiceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  invoiceLabel: {
    fontSize: 16,
    color: '#666',
  },
  invoiceValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  totalRow: {
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    paddingTop: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#008080',
  },
  confirmButton: {
    backgroundColor: '#008080',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 50,
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default PanierScreen;
