import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "../api/axios";

const SupportScreen = ({ navigation }) => {
  const [problemType, setProblemType] = useState(null);
  const [inquiry, setInquiry] = useState("");

  const [userType, setUserType] = useState("");

  const handleProblemTypeSelect = (type) => {
    setProblemType(type);
  };

  const handleInquiryChange = (text) => {
    setInquiry(text);
  };

  const handleSendInquiry = async () => {
    if (!problemType) {
      Alert.alert("Please select a problem type");
      return;
    }
    if (!inquiry) {
      Alert.alert("Please enter your inquiry");
      return;
    }
    // send inquiry logic here
    try {
      const token = await AsyncStorage.getItem("AccessToken");
      if (problemType == "problem1") {
        const problem = "The app is crashing";
        const res = await axios.post(
          "/support",
          JSON.stringify({ message: inquiry, subject: problem }),
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("very nice1");
        await AsyncStorage.setItem("AccessToken", res.data.token);
        const userType = res.data.type;
        console.log("very nice");
        if (userType == "traveler" || userType == "Traveler") {
          navigation.navigate("TravelerMainScreen");
        } else {
          navigation.navigate("PasteLinkScreen");
        }
      } else if (problemType == "problem2") {
        const problem = "I am unable to log in to my account";
        const res = await axios.post(
          "/support",
          JSON.stringify({ message: inquiry, subject: problem }),
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        await AsyncStorage.setItem("AccessToken", res.data.token);
        console.log("very nice");
        const userType = res.data.type;
        if (userType == "traveler" || userType == "Traveler") {
          navigation.navigate("TravelerMainScreen");
        } else {
          navigation.navigate("PasteLinkScreen");
        }
      } else {
        const problem = "I am not receiving any notifications";
        const res = await axios.post(
          "/support",
          JSON.stringify({ message: inquiry, subject: problem }),
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        await AsyncStorage.setItem("AccessToken", res.data.token);
        const userType = res.data.type;
        console.log("very nice");
        if (userType == "traveler" || userType == "Traveler") {
          navigation.navigate("TravelerMainScreen");
        } else {
          navigation.navigate("PasteLinkScreen");
        }

        ////
        if (userType === "client") {
          navigation.navigate("PasteLinkScreen");
        } else {
          navigation.navigate("TravelerMainScreen");
        }
        ////
      }
    } catch (err) {
      if (err.status == 401) {
        await AsyncStorage.removeItem("AccessToken");
        navigation.reset({
          index: 0,
          routes: [{ name: "LoginScreen" }],
        });
      } else {
        await AsyncStorage.setItem("AccessToken", err.response.data.token);
      }
    }
  };

  const renderProblemFix = () => {
    switch (problemType) {
      case "problem1":
        return (
          <>
            <Text style={styles.titleText}>The app is crashing:</Text>
            <Text style={styles.fixText}>
              Try uninstalling and reinstalling the app. If the problem
              persists, please contact our support team on
              donotreply.tou@gmail.com for further assistance.
            </Text>
          </>
        );
      case "problem2":
        return (
          <>
            <Text style={styles.titleText}>
              I'm unable to log in to my account:
            </Text>
            <Text style={styles.fixText}>
              Make sure you're entering the correct email and password. If
              you've forgotten your password, use the "Forgot Password" feature
              to reset it. If you're still unable to log in, please contact our
              support team on donotreply.tou@gmail.com for further assistance.
            </Text>
          </>
        );
      case "problem3":
        return (
          <>
            <Text style={styles.titleText}>
              I'm not receiving any notifications:
            </Text>
            <Text style={styles.fixText}>
              Make sure you are logged into your email on your phone with the
              same email your are using in the app. Also, make sure our email is
              not in the junk/spam folder. If you're still not receiving
              notifications, please contact our support team on
              donotreply.tou@gmail.com for further assistance.
            </Text>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Support Screen</Text>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backContainer}
      >
        <View style={styles.backButtonContainer}>
          <Ionicons name="ios-close" size={28} color="#3274cb" />
        </View>
      </TouchableOpacity>
      <Text style={styles.titleText}>Select a problem type:</Text>
      <Picker
        selectedValue={problemType}
        onValueChange={(value) => handleProblemTypeSelect(value)}
        style={styles.button}
      >
        <Picker.Item label="Select a problem" value={null} />
        <Picker.Item label="The app is crashing" value="problem1" />
        <Picker.Item
          label="I'm unable to log in to my account"
          value="problem2"
        />
        <Picker.Item
          label="I'm not receiving any notifications"
          value="problem3"
        />
      </Picker>
      {problemType && <>{renderProblemFix()}</>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 20,
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#3274cb",
    textAlign: "center",
  },
  backContainer: {
    position: "absolute",
    top: 20,
    right: 10,
    zIndex: 9999,
  },
  backButtonContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    backgroundColor: "#ebebeb",
    borderRadius: 5,
    padding: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  titleText: {
    textAlignVertical: "center",
    fontWeight: "bold",
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  fixText: {
    color: "black",
    fontSize: 14,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
});
export default SupportScreen;
