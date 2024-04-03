import React, { useState, useRef, useEffect } from "react";
import { Platform, StatusBar, Modal } from "react-native";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "../../api/axios";
import { ActivityIndicator } from "react-native-paper";

const SettingsScreen = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isChangesSaved, setIsChangesSaved] = useState(true);
  const [profileData, setProfileData] = useState(null);
  const [isValidPhoneNumber, setIsValidPhoneNumber] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleProfile = async () => {
    try {
      const token = await AsyncStorage.getItem("AccessToken");
      const res = await axios.get("/profile", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      await AsyncStorage.setItem("AccessToken", res.data.token);
      console.log(res.data);
      return {
        firstName: res.data.trav.name,
        lastName: res.data.trav.lastname,
        phoneNumber: res.data.trav.phone_number,
        gender: res.data.trav.gender,
        nationality: res.data.trav.nationality,
      };
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

  useEffect(() => {
    const fetchProfile = async () => {
      const profile = await handleProfile();
      setProfileData(profile);
      console.log(profile);
      //log phone number
      setPhoneNumber(profile.phoneNumber.toString());
    };
    fetchProfile();
  }, []);

  function onBackPressed() {
    navigation.goBack();
  }

  const handlePhoneNumberChange = (text) => {
    setPhoneNumber(text);
    setIsChangesSaved(false);
  };
  const validatePhoneNumber = () => {
    // Define the regex pattern for Lebanese phone numbers
    const phoneNumberRegex =
      /^(?:\+?961|0)?(?:(?:3|70|71|76|78|79|81|81|82|83|84|85|96|99)[\d]{6}|(?:70|71|76|78|79|81|82|83|84|85|96|99)[\d]{6})$/;
    const isValid = phoneNumberRegex.test(phoneNumber);
    setIsValidPhoneNumber(isValid);
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        onPress: async () => {
          setIsLoading(true);
          try {
            const token = await AsyncStorage.getItem("AccessToken");
            const res = await axios.post(
              "/logout",
              {},
              {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            setIsLoading(false);
            console.log(res);
            await AsyncStorage.removeItem("AccessToken");
            navigation.reset({
              index: 0,
              routes: [{ name: "LoginScreen" }],
            });
          } catch (err) {
            setIsLoading(false);
            await AsyncStorage.removeItem("AccessToken");
            navigation.reset({
              index: 0,
              routes: [{ name: "LoginScreen" }],
            });
          }
        },
      },
    ]);
  };

  const handleSubmitChanges = async () => {
    // Perform API call to submit changes to the backend
    // Assuming a successful API call, set isChangesSaved to true

    if (!isChangesSaved) {
      validatePhoneNumber();
      if (!isValidPhoneNumber) {
        Alert.alert(
          "Invalid Phone Number",
          "Kindly Enter a Valid Phone Number"
        );
        return;
      }
      setIsLoading(true);

      try {
        const token = await AsyncStorage.getItem("AccessToken");
        const res = await axios.post(
          "/profile/edit",
          { phone_number: phoneNumber },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setIsLoading(false);
        await AsyncStorage.setItem("AccessToken", token);
      } catch (err) {
        setIsLoading(false);
        if (err.status == 401) {
          await AsyncStorage.removeItem("AccessToken");
          navigation.reset({
            index: 0,
            routes: [{ name: "LoginScreen" }],
          });
        } else {
          navigation.reset({
            index: 0,
            routes: [{ name: "LoginScreen" }],
          });
        }
      }

      setIsChangesSaved(true);
      Alert.alert(
        "Changes Saved",
        "Your changes have been saved successfully."
      );
      navigation.goBack();
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Edit Profile</Text>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backContainer}
      >
        <View style={styles.backButtonContainer}>
          <Ionicons name="ios-close" size={28} color="#3274cb" />
        </View>
      </TouchableOpacity>
      <View style={styles.profileDataContainer}>
        <Text style={styles.label}>First Name:</Text>
        {profileData && (
          <Text style={styles.value}>{profileData.firstName}</Text>
        )}
        <Text style={styles.label}>Last Name:</Text>
        {profileData && (
          <Text style={styles.value}>{profileData.lastName}</Text>
        )}
        <Text style={styles.label}>Gender:</Text>
        {profileData && <Text style={styles.value}>{profileData.gender}</Text>}
        <Text style={styles.label}>Nationality:</Text>
        {profileData && (
          <Text style={styles.value}>{profileData.nationality}</Text>
        )}
        <Text style={styles.label}>Phone Number:</Text>
        <TextInput
          style={styles.input}
          value={phoneNumber}
          onChangeText={handlePhoneNumberChange}
          keyboardType="phone-pad"
          maxLength={20}
        />
      </View>
      {isLoading && (
        <ActivityIndicator animating={true} size="large" color="#3274cb" />
      )}

      <TouchableOpacity
        style={styles.registerButton}
        onPress={handleSubmitChanges}
        disabled={isChangesSaved}
      >
        <Text style={styles.registerButtonText}>Submit Changes</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.registerButtonText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 20,
    flexGrow: 1,
    backgroundColor: "#fff",
    paddingLeft: 20,
    paddingRight: 20,
    paddingVertical: 20,
  },
  button: {
    backgroundColor: "#ebebeb",
    borderRadius: 5,
    padding: 10,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#3274cb",
    textAlign: "center",
  },
  profileDataContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  value: {
    fontSize: 16,
    marginBottom: 16,
  },
  input: {
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 8,
    marginBottom: 16,
  },
  buttonText: {
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 5,
    padding: 20,
    minWidth: 200,
    maxWidth: 300,
  },
  cityItem: {
    paddingVertical: 10,
  },
  cityText: {
    fontSize: 16,
  },
  cityContainer: {
    marginVertical: 10,
    marginHorizontal: 20,
  },
  countryText: {
    textAlignVertical: "center",
    fontWeight: "bold",
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  registerButton: {
    backgroundColor: "#3274cb",
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  registerButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  logoutButton: {
    backgroundColor: "red",
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
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
});

export default SettingsScreen;
