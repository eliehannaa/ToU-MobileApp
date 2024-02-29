import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image, FlatList } from 'react-native';
import { Platform, StatusBar} from 'react-native';
import { useRoute } from '@react-navigation/native';
import ActiveOrderCard2 from '../../components/traveler_components/ActiveOrderCard2';
import { Ionicons } from '@expo/vector-icons';
import { useEffect } from 'react';
import axios from '../../api/axios';
import AsyncStorage from '@react-native-async-storage/async-storage';


// importing fake data for testing
import activeProducts from '../../fake_data/activeProducts';

const ActiveOrdersScreen2 = ({navigation}) => {
    const route = useRoute();
    const [products, setProducts] = useState([]);


    //get list of json product objects from server (pending orders)
    // Backend API call to get active orders
    //const products = [];

    const handleProducts = async () => {
        try{
          console.log("We are here 10");
          const token = await AsyncStorage.getItem('AccessToken');
          console.log(token);
          const res = await axios.get('/traveler/home/activeorders',
          {
            headers: { 
                        'Content-Type': 'application/json' ,
                        'Authorization': `Bearer ${token}`
                      }
          }
          );
          AsyncStorage.setItem("AccessToken", res.data[0].token)
          const list = []
          console.log(res.data[0])
          const pr = res.data[0].aorders
          for(let i=0;i<res.data[0].aorders.length;i++){
            list.push({id: pr[i].order._id, title: pr[i].product.title, price: pr[i].product.price, image: pr[i].product.image, url: pr[i].product.url, inStock: pr[i].product.inStock, status: pr[i].order.status, commission: pr[i].order.t_commission.toFixed(2), quantity: pr[i].order.quantity})
          }
          console.log(list)
          return list;
        }catch(err){
          if(err.status == 401){
            await AsyncStorage.removeItem('AccessToken');
            navigation.reset({
              index: 0,
              routes: [{ name: 'LoginScreen' }],
            })
          }
          else{
            await AsyncStorage.setItem('AccessToken', err.response.data.token);
          }
        }
      }
      
      useEffect(() => {
        const fetchProducts = async () => {
          const products = await handleProducts();
          setProducts(products);
        };
        fetchProducts();
      }, []);
    
    
    // Render each product as a ActiveOrderCard component
    const renderProduct = ({ item }) => <ActiveOrderCard2 product={item} />;

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Active Orders</Text>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backContainer}>
                <View style={styles.backButtonContainer}>
                <Ionicons name="ios-close" size={28} color="#3274cb" />
                </View>
            </TouchableOpacity>
            <FlatList
                data={products} // replace with actual active orders
                renderItem={renderProduct}
                keyExtractor={(item) => item.id.toString()}
            />
        </View>
    );
    }

const styles = StyleSheet.create({
    container: {
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 20 ,
        flex: 1,
        backgroundColor: '#fff',
        padding: 16,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#3274cb',
        textAlign: 'center',
      },
    headerText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
    },
    body: {
        flex: 3,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    bodyText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#3274cb',
    },
    backContainer: {
        position: 'absolute',
        top: 20,
        right: 10,
        zIndex: 9999,
      },
      backButtonContainer: {
        backgroundColor: '#ffffff',
        borderRadius: 20,
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
      },
});
export default ActiveOrdersScreen2;
