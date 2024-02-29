import React, { useState } from "react";
import { useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Alert,
  Image,
} from "react-native";
import ProductPage from "./ProductPage";
import { Platform, StatusBar } from "react-native";
import BottomNav from "../../components/BottomNav"; // Import the bottom navigation component
import axios from "../../api/axios";
import ExchangeRateCard from "../../components/ExchangeRateCard";
import { ActivityIndicator } from "react-native-paper";

const PasteLinkScreen = ({ navigation }) => {
  const [link, setLink] = useState("");
  const [exchangeRate, setExchangeRate] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Example JSON object representing product details
  const product = {
    imageSource: "https://random.imagecdn.app/500/150",
    url: "https://www.amazon.com/dp/B123456789",
    title: "Example Product Title",
    price: "$99.99",
    id: "B123456789",
    dimensions: "10 x 5 x 2 inches",
    inStock: true,
  };

  const handleCheckProduct = async () => {
    //Validate the link
    if (!isValidUrl(link)) {
      Alert.alert("Invalid URL", "Please enter a valid amazon URL");
      return;
    }
    setIsLoading(true);

    //BACKEND CODE FOR CHECKING PRODUCT
    // Implement logic for sending the link to the backend, and then redirecting to the product page with a json object containing the product details
    // For now, we will just redirect to the product page for testing purposes

    try {
      console.log("We are here 4");
      const res = await axios.post(
        "client/home/searchproduct", //post request
        JSON.stringify({ link }), //include email and password
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      setIsLoading(false);
      console.log(res.data); //for you to check what the server is responding with

      //send user to corresponding page
      if (res.status == 200) {
        navigation.navigate("ProductPage", { product: res.data });
      }
    } catch (err) {
      setIsLoading(false);

      console.log(err);
    }
  };

  const isValidUrl = async (url) => {
    // amazon URL validation using regular expression
    const pattern =
      /^https?:\/\/(?:www\.)?amazon\.com\/(?:[^/]+\/)*?(?:dp|gp\/product)\/[A-Za-z0-9]{10}(?:\/[^?#]*|$)/;
    return pattern.test(url);
  };

  // API to get the exchange rate
  // try{
  const handledollarrate = async () => {
    try {
      const res = await axios.post("/getrate", {
        headers: { "Content-Type": "application/json" },
      });
      const exchangeRate = res.data.rate;
      return exchangeRate;
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const fetchExchangeRate = async () => {
      const rate = await handledollarrate();
      setExchangeRate(rate);
    };
    fetchExchangeRate();
  }, []);

  return (
    <View style={styles.container}>
      {exchangeRate && <ExchangeRateCard exchangeRate={exchangeRate} />}

      <Text style={styles.label}>Paste your link here</Text>
      <TextInput
        style={styles.textBox}
        placeholder="Paste your link"
        onChangeText={setLink}
        value={link}
      />
      <TouchableOpacity style={styles.button} onPress={handleCheckProduct}>
        <Text style={styles.buttonText}>Check Product</Text>
      </TouchableOpacity>
      <BottomNav navigation={navigation} />
      {isLoading && (
        <ActivityIndicator animating={true} size="large" color="#3274cb" />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 20,
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#3274cb",
    marginTop: 16,
    marginBottom: 16,
  },
  textBox: {
    width: "100%",
    height: 40,
    borderColor: "#3274cb",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  button: {
    width: "100%",
    height: 48,
    backgroundColor: "#3274cb",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  bottomNavigation: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    height: 60,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  bottomNavigationButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  bottomNavigationButtonText: {
    marginTop: 5, // Add some margin to the top of the button text
    color: "#333", // Change this to your desired text color
    fontSize: 12, // Change this to your desired font size
  },
  bottomNavigationButtonIcon: {
    marginBottom: 2, // Add some margin to the bottom of the button icon
  },
  logo: {
    width: 50,
    height: 50,
    resizeMode: "contain",
  },
});

export default PasteLinkScreen;
