import axios from "../api/axios";
import React, { useState, useRef } from "react";
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
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome";
import lbCities from "../data/lbCities.json";
import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator } from "react-native-paper";

const RegisterScreen = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [agreement, setAgreement] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isValidPhoneNumber, setIsValidPhoneNumber] = useState(true);
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [isValidPassword, setIsValidPassword] = useState(true);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const handleTogglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const navigation = useNavigation();

  function onBackPressed() {
    navigation.goBack();
  }

  const handleRegister = async () => {
    // Handle registration logic here
    if (!phoneAndEmailIsOk()) {
      Alert.alert(
        "Invalid Input",
        "Please make sure you filled the form correctly."
      );
      return;
    }
    if (fieldsEmpty()) {
      return;
    }
    setIsLoading(true);
    //If the code reached here, it means that the form is valid
    try {
      console.log("We are here 2");
      const res = await axios.post(
        "/signup", //post request
        JSON.stringify({
          email,
          password,
          name: firstName,
          lastname: lastName,
          nationality: "Lebanon",
          gender,
          city,
          phone_number: phoneNumber,
        }), //include email and password
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      setIsLoading(false);
      console.log(res.data); //to check what the server is responding with

      //send user to corresponding page

      checkRegistration(res.status);
    } catch (err) {
      setIsLoading(false);

      console.log(err);
    }
  };

  const checkRegistration = (responseCode) => {
    // Handle registration logic here
    if (responseCode == 201) {
      Alert.alert(
        "Registration Successful",
        "Keep an eye out on your email junk/spam folder."
      );
      navigation.navigate("LoginScreen");
    } else {
      Alert.alert("Registration Failed");
    }
  };

  const fieldsEmpty = () => {
    // Validate first name
    if (!firstName) {
      Alert.alert("Invalid First Name", "Please enter your first name.");
      return true;
    }
    // Validate last name
    if (!lastName) {
      Alert.alert("Invalid Last Name", "Please enter your last name.");
      return true;
    }
    // Validate gender
    if (!gender) {
      Alert.alert("Invalid Gender", "Please enter your Gender.");
      return true;
    }
    // Validate City
    if (!city) {
      Alert.alert("Invalid City", "Please enter your City.");
      return true;
    }
    // Validate Agreement
    if (!agreement) {
      Alert.alert(
        "Agreement Error",
        "Please agree to the terms and conditions."
      );
      return true;
    }
    // Validate password
    if (!password || !isValidPassword) {
      Alert.alert("Invalid Password", "Please enter a password.");
      return true;
    }
    return false;
  };

  const validatePhoneNumber = () => {
    // Define the regex pattern for Lebanese phone numbers
    const phoneNumberRegex =
      /^(?:\+?961|0)?(?:(?:3|70|71|76|78|79|81|81|82|83|84|85|96|99)[\d]{6}|(?:70|71|76|78|79|81|82|83|84|85|96|99)[\d]{6})$/;
    const isValid = phoneNumberRegex.test(phoneNumber);
    setIsValidPhoneNumber(isValid);
  };

  const validateEmail = () => {
    // Define the regex pattern for email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(email);
    setIsValidEmail(isValid);
  };

  const phoneAndEmailIsOk = () => {
    // Validate phone number
    if (!phoneNumber || !isValidPhoneNumber) {
      setIsValidPhoneNumber(false);
      if (!email || !isValidEmail) {
        setIsValidEmail(false);
        return false;
      }
      return false;
    }
    //Validate email
    if (!email || !isValidEmail) {
      setIsValidEmail(false);
      if (!phoneNumber || !isValidPhoneNumber) {
        setIsValidPhoneNumber(false);

        return false;
      }
      return false;
    }
    return true;
  };

  const validatePassword = () => {
    // Define the regex pattern for password validation

    const regexPattern =
      /^(?=.*[!@#$%^&*(),.?":{}|<>])(?=.*\d)(?=.*[A-Z])(?=.*[a-z]).{8,}$/;

    // Test the password against the regex pattern
    const isValid = regexPattern.test(password);
    // Update the state
    setIsValidPassword(isValid);
  };

  const scrollViewRef = useRef(); // Ref for ScrollView

  const handleCityChange = (city) => {
    setCity(city);
    setModalVisible(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Register</Text>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backContainer}
      >
        <View style={styles.backButtonContainer}>
          <Ionicons name="ios-close" size={28} color="#3274cb" />
        </View>
      </TouchableOpacity>
      <View style={styles.form}>
        <TextInput
          placeholder="First Name"
          style={styles.input}
          value={firstName}
          onChangeText={setFirstName}
          maxLength={20}
        />
        <TextInput
          placeholder="Last Name"
          style={styles.input}
          value={lastName}
          onChangeText={setLastName}
          maxLength={20}
        />

        <View style={styles.genderContainer}>
          <Text style={styles.genderText}>Gender:</Text>
          <TouchableOpacity
            style={[
              styles.genderButton,
              gender === "male" && styles.genderButtonActive,
            ]}
            onPress={() => setGender("male")}
          >
            <Text style={styles.genderButtonText}>M</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.genderButton,
              gender === "female" && styles.genderButtonActive,
            ]}
            onPress={() => setGender("female")}
          >
            <Text style={styles.genderButtonText}>F</Text>
          </TouchableOpacity>
        </View>

        <TextInput
          placeholder="Email"
          style={[styles.input, !isValidEmail && styles.inputError]}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          onBlur={validateEmail} // onBlur event for email validation
          maxLength={50}
        />
        {!isValidEmail && (
          <Text style={styles.errorTextEmail}>
            {" "}
            Please enter a valid email address
          </Text>
        )}

        <View style={styles2.passwordContainer}>
          <TextInput
            style={[styles2.input, !isValidPassword && styles.inputError]}
            secureTextEntry={!isPasswordVisible}
            placeholder="Password"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              validatePassword;
            }}
            onBlur={validatePassword}
            maxLength={100}
          />
          <TouchableOpacity
            style={styles2.eyeIconContainer}
            onPress={handleTogglePasswordVisibility}
          >
            <Icon
              name={isPasswordVisible ? "eye-slash" : "eye"}
              size={20}
              color="black"
            />
          </TouchableOpacity>
        </View>

        {!isValidPassword && (
          <Text style={styles.errorText}>
            {"\t\t"}Please enter a strong password (length: 8+, {"\n\t\t"}
            contains uppercase and lowercase letters, {"\n\t\t"}digits, and a
            special character)
          </Text>
        )}

        <View style={styles.container}>
          <TextInput
            placeholder="Phone Number"
            style={[
              styles.inputPhone,
              !isValidPhoneNumber && styles.inputError,
            ]}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
            onBlur={validatePhoneNumber}
            maxLength={20}
          />
          {!isValidPhoneNumber && (
            <Text style={styles.errorText}>
              Please enter a valid phone number
            </Text>
          )}
        </View>
        {isLoading && (
          <ActivityIndicator animating={true} size="large" color="#3274cb" />
        )}
        <Text style={styles.countryText}>Lebanon</Text>

        <View style={styles.cityContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.buttonText}>
              {city ? city : "Select Your City"}
            </Text>
          </TouchableOpacity>

          <Modal
            visible={modalVisible}
            animationType="slide"
            transparent={true}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                {/* Pass the ref to ScrollView */}
                <ScrollView ref={scrollViewRef}>
                  {lbCities.map((city) => (
                    <TouchableOpacity
                      style={styles.cityItem}
                      onPress={() => handleCityChange(city.city)}
                    >
                      <Text style={styles.countryText}>{city.city}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>
          </Modal>
        </View>

        <View style={styles.agreementContainer}>
          <TouchableOpacity
            style={styles.agreementBox}
            onPress={() => setAgreement(!agreement)}
          >
            {agreement && <View style={styles.agreementBoxChecked} />}
          </TouchableOpacity>
          <View style={styles.container}>
            <View style={styles.textContainer}>
              <Text style={styles.agreementText}>
                I agree to the main services agreement
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={styles.registerButton}
          onPress={handleRegister}
        >
          <Text style={styles.registerButtonText}>Register</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 200,
    flexGrow: 1,
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 20,
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
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#3274cb",
  },
  form: {
    width: "80%",
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  genderContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  genderText: {
    marginRight: 10,
  },
  genderButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#ccc",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  genderButtonActive: {
    backgroundColor: "#3274cb",
    borderColor: "#3274cb",
  },
  genderButtonText: {
    fontSize: 20,
    color: "#ccc",
  },
  agreementContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  agreementBox: {
    width: 20,
    height: 20,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: "#ccc",
    marginRight: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  agreementBoxChecked: {
    width: 10,
    height: 10,
    borderRadius: 2,
    backgroundColor: "#3274cb",
  },
  agreementText: {
    color: "#666",
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
  inputPhone: {
    height: 50,
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  inputError: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
  inputErrorEmail: {
    borderColor: "red",
  },
  errorTextEmail: {
    color: "red",
    marginBottom: 10,
  },
  textContainer: {
    flexDirection: "row", // Arrange text in a row
    alignItems: "center", // Vertically align text in the middle
  },
  agreementText: {
    // Your styles for the main text here
  },
  linkText: {
    color: "blue", // Change to your desired link color
    textDecorationLine: "underline", // underline style to indicate link
  },
  urlText: {
    marginTop: 10, // Add margin to separate URL from text
  },
  passwordContainer: {
    flexDirection: "row", // Make sure the text input and icon are in a row
    width: "100%", // Take up full width of the container
    paddingHorizontal: 16, // Add horizontal padding for spacing
  },
  eyeIconContainer: {
    marginLeft: 10,
    justifyContent: "center",
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
  button: {
    backgroundColor: "#ebebeb",
    borderRadius: 5,
    padding: 10,
    alignItems: "center",
  },
});

const styles2 = StyleSheet.create({
  //styles for password input
  passwordContainer: {
    flexDirection: "row", // Make sure the text input and icon are in a row
    alignItems: "center", // Align items vertically in the center
    width: "100%", // Take up full width of the container
    paddingHorizontal: 0, // Add horizontal padding for spacing
  },
  input: {
    flex: 1, // Take up remaining space in the row
    height: 50, // Set desired height for the text input
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10, // Add horizontal padding for spacing
    ///
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 10,
  },
  inputError: {
    borderColor: "red", // Update border color for invalid password
  },
  eyeIconContainer: {
    marginLeft: 10, // Add left margin for spacing between text input and icon
    marginBottom: 10,
  },

  buttonText: {
    fontSize: 16,
  },
});

export default RegisterScreen;
