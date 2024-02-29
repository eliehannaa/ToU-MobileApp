import React, { useState} from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import ProductCard from '../../components/ProductCard'; // Import the ProductCard component
//import useRoute:
import { useRoute } from '@react-navigation/native';
import axios from '../../api/axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProductPage = ({ navigation }) => {
    const [quantity, setQuantity] = useState(1); // State variable to store the quantity of the product [1 by default]

    const route = useRoute(); // Use the useRoute hook to access the route object

    // Extract the product object from the navigation parameters
    const product = route.params.product;

     // Function to handle "Request Product" button press
    const handleRequestProduct = async () => {
        // Implement your logic here for handling the request product action
        //BACKEND CODE FOR REQUESTING PRODUCT

        try{
            const token = await AsyncStorage.getItem('AccessToken');
            console.log('client/home/searchproduct/'+product.asin+"/"+quantity)
            const res = await axios.post('client/home/searchproduct/'+product.asin+"/"+quantity,//post request
            JSON.stringify({data: product}),//include email and password
            {
              headers: { 'Content-Type': 'application/json' ,
              'Authorization': `Bearer ${token}`
              }
            }
            );
            await AsyncStorage.setItem("AccessToken", res.data.accessToken);
            console.log(res.data);//for you to check what the server is responding with
      
            if(res.status == 200){
              Alert.alert('Product Requested','Your request is now pending, keep an eye on your email (junk/spam folders) for updates');
            }
            navigation.navigate('PasteLinkScreen');
        }
        catch(err){
            if(err.response.status == 401){
                await AsyncStorage.removeItem('AccessToken');
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'LoginScreen' }],
                });
            }
            else{
                await AsyncStorage.setItem("AccessToken", err.response.data.token);
            }
        }
    };

    const increment = () => {
        setQuantity(quantity + 1);
      };
    
    const decrement = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };
    const handleCancelProduct = () => {
        Alert.alert('Product Request Cancelled', 'Your request has been cancelled');
        //navigate to pastelinkscreen
        navigation.navigate('PasteLinkScreen');
        return;
    };

  return (
    <View style={styles.container}>
      {/* Render the ProductCard component */}
      <ProductCard product={product} style={styles.productCard} />

      
        <View style={styles.qtyContainer}>
            <TouchableOpacity style={styles.qtyButton} onPress={decrement}>
                <Text style={styles.qtyButtonText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.quantityText}>{quantity}</Text>
            <TouchableOpacity style={styles.qtyButton} onPress={increment}>
                <Text style={styles.qtyButtonText}>+</Text>
            </TouchableOpacity>
        </View>

        {/* Render the "Request Product" button */}
        <TouchableOpacity
            style={styles.buttonContainer}
            onPress={handleRequestProduct}
        >
            <Text style={styles.buttonText}>Request Product</Text>
        </TouchableOpacity>

        <TouchableOpacity
            style={styles.buttonContainer2}
            onPress={handleCancelProduct}
        >
            <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
    </View>
    
    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    backgroundColor: '#3274cb', // Primary color for button background
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  buttonText: {
    color: '#FFFFFF', // Text color for button
    fontSize: 16,
    fontWeight: 'bold',
  },
  productCard: {
    flexDirection: 'row',
    alignSelf: 'center',
  },
  qtyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 8,
    marginBottom: 16,
  },
  qtyButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    backgroundColor: '#3274cb',
  },
  qtyButtonText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  quantityText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3274cb',
  },
  buttonContainer2: {
    backgroundColor: '#903', 
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
});

export default ProductPage;
