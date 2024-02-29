import axios from "../api/axios";
import React, { useState, useRef, useCallback } from "react";
import { Platform, StatusBar } from "react-native";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Modal,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import countriesData from "../data/countriesData.json";
import * as DocumentPicker from "expo-document-picker";
import { strI, strC } from "../data/converter";
import * as FileSystem from "expo-file-system";
import { ActivityIndicator } from "react-native-paper";

// import {
//   cacheDirectory,
//   copyAsync,
//   getInfoAsync,
//   makeDirectoryAsync,
//   uploadAsync,
// } from "expo-file-system";

const ApplyAsTravelerScreen = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("");
  const [email, setEmail] = useState("");
  const [agreement, setAgreement] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isValidPhoneNumber, setIsValidPhoneNumber] = useState(true);
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [cvUri, setCvUri] = useState("");
  const [idUri, setIdUri] = useState("");
  const [cvName, setCvName] = useState("");
  const [idName, setIdName] = useState("");
  const [cvType, setCvtype] = useState("");
  const [idType, setIdtype] = useState("");
  const [cvData, setCvdata] = useState("");
  const [idData, setIddata] = useState("");

  const [applyClicked, setApplyClicked] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const navigation = useNavigation();

  function onBackPressed() {
    navigation.goBack();
  }

  // new code for waiting 10 seconds before submitting
  const logRegister = () => {
    // Logic to prevent multiple clicks on the button
    if (applyClicked) {
      Alert.alert(
        "Please wait",
        "Please wait while we process your application."
      );
      return;
    }
    setApplyClicked(true);
    console.log("clicked Apply");
    setIsLoading(true);
    Alert.alert(
      "Uploading...",
      "Please wait while we process your application."
    );
    setTimeout(handleRegister, 3000);
  };

  const handleRegister = async () => {
    // Handle registration logic here
    if (!phoneAndEmailIsOk()) {
      setIsLoading(false);
      Alert.alert(
        "Invalid Input",
        "Please make sure you filled the form correctly."
      );
      return;
    }
    if (fieldsEmpty()) {
      setIsLoading(false);
      return;
    }
    try {
      console.log("We are here 3");
      const formData = new FormData();
      formData.append("cv", {
        uri: cvUri,
        type: cvType,
        name: cvName,
        data: cvData,
      });
      formData.append("id", {
        uri: idUri,
        type: idType,
        name: idName,
        data: idData,
      });
      formData.append(
        "otherData",
        JSON.stringify({
          name: firstName,
          lastname: lastName,
          gender,
          email,
          phone_number: phoneNumber,
          nationality: selectedCountry,
        })
      );
      console.log("before post");
      // console.log(formData);
      console.log(JSON.stringify(formData));
      const body = {
        _parts: [
          [
            "cv",
            {
              uri: cvUri,
              type: "application/pdf",
              name: cvName,
              data: "strC",
            },
          ],
          [
            "id",
            {
              uri: idUri,
              type: "application/pdf",
              name: idName,
              data: "strI",
            },
          ],
          [
            "otherData",
            JSON.stringify({
              name: firstName,
              lastname: lastName,
              gender,
              email,
              phone_number: phoneNumber,
              nationality: selectedCountry,
            }),
          ],
        ],
      };
      // const res = await axios.post('/login',//post request
      // JSON.stringify({email: email, password: password}),//include email and password
      // {
      //   headers: { 'Content-Type': 'application/json' }
      // }
      // );
      const res = await axios.post("/travelersignup", JSON.stringify(body), {
        headers: {
          "Content-Type": "application/json",
        },
      });
      setIsLoading(false);

      console.log("after post2");

      console.log(res.data); //for you to check what the server is responding with

      //send user to corresponding page

      checkApplication(res.status);
    } catch (err) {
      setIsLoading(false);
      console.log(err);
    }
  };

  const checkApplication = (responseCode) => {
    // Handle application logic here
    if (responseCode === 200) {
      // Application submitted successfully
      Alert.alert(
        "Application Submitted",
        "Your application has been submitted successfully, keep an eye on your email junk/spam folder."
      );
      navigation.navigate("LoginScreen");
    } else {
      // Application submission failed
      Alert.alert(
        "Application Failed",
        "Your application has failed to submit, please try again."
      );
      navigation.navigate("LoginScreen");
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
    // Validate Agreement
    if (!agreement) {
      Alert.alert(
        "Agreement Error",
        "Please agree to the terms and conditions."
      );
      return true;
    }
    // Validate nationality
    if (!selectedCountry) {
      Alert.alert("Invalid Nationality", "Please enter your nationality.");
      return true;
    }
    // Validate CV
    if (!cvUri || !cvName) {
      Alert.alert("Invalid CV", "Please upload your CV.");
      return true;
    }
    // Validate ID
    if (!idUri || !idName) {
      Alert.alert("Invalid ID", "Please upload your ID.");
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

  const scrollViewRef = useRef(); // Ref for ScrollView

  const handleCountryChange = (country) => {
    setSelectedCountry(country);
    setModalVisible(false);
  };

  const [fileResponse, setFileResponse] = useState([]);

  const _pickCv3 = useCallback(async () => {
    try {
      const response = await DocumentPicker.getDocumentAsync({
        presentationStyle: "fullScreen",
      });
      console.log(response);
      setFileResponse(response);
    } catch (err) {
      console.warn(err);
    }
  }, []);

  const _pickCv = async () => {
    console.log("LOG: _pickCv was called");
    // used to pick cv from the device
    try {
      let result = await DocumentPicker.getDocumentAsync({
        copyToCacheDirectory: true,
        type: "*/*",
      });
      console.log(result);
      const fileUri = result.uri;
      const fileName = result.name;
      const mimeType = result.mimeType;
      // const cacheInfo = await FileSystem.getInfoAsync(
      //   FileSystem.cacheDirectory
      // );
      // console.log(cacheInfo);

      // // if not, create the cache directory
      // if (!cacheInfo.exists || !cacheInfo.isDirectory) {
      //   await FileSystem.makeDirectoryAsync(FileSystem.cacheDirectory);
      //   console.log("Cache directory created");
      // }
      const tempFileUri = FileSystem.cacheDirectory + fileName;
      // await FileSystem.copyAsync({
      //   from: fileUri,
      //   to: tempFileUri,
      // });
      console.log(tempFileUri);
      console.log(FileSystem.cacheDirectory);
      const path = FileSystem.documentDirectory + "data/CV.txt";
      console.log(path);

      const fileContent = "abcd";
      // const fileData = await FileSystem.readAsStringAsync(
      //   //FileSystem.cacheDirectory + fileName,
      //   path
      // );
      // console.log(fileContent);
      setCvName(fileName);
      setCvUri(tempFileUri);
      setCvtype(mimeType);
      setCvdata(fileContent);
    } catch (e) {
      console.log(e);
      return;
    }
  };
  const _pickId = async () => {
    console.log("LOG: _pickId was called");
    try {
      let result = await DocumentPicker.getDocumentAsync({
        copyToCacheDirectory: true,
        type: "*/*",
      });
      console.log(result);
      const fileUri = result.uri;
      const fileName = result.name;
      const mimeType = result.mimeType;
      const cacheFilePath = FileSystem.cacheDirectory + fileName;

      // const res = await DocumentPicker.pick({
      //   type: [DocumentPicker.types.allFiles],
      // });
      // const fileData = JSON.stringify(res);
      const fileContent = "12234";
      // console.log(fileData);
      setIdName(fileName);
      setIdUri(cacheFilePath);
      setIdtype(mimeType);
      setIddata(fileContent);
    } catch (e) {
      console.log(e);
      return;
    }
  };
  // const _pickId = async () => {
  //   console.log("LOG: _pickId was called");
  //   // used to pick id from the device
  //   try {
  //     let result = await DocumentPicker.getDocumentAsync({
  //       copyToCacheDirectory: false,
  //       type: "*/*",
  //     });
  //     console.log(result);
  //     const fileUri = result.uri;
  //     const fileName = result.name;
  //     const mimeType = result.mimeType;
  //     const cacheFilePath = FileSystem.cacheDirectory + "uploads/" + fileName;
  //     await copyAsync({ from: fileUri, to: cacheFilePath });

  //     const tempFileUri = cacheFilePath;
  //     console.log(tempFileUri);

  //     const fileData = await FileSystem.readAsStringAsync(cacheFilePath, {
  //       encoding: FileSystem.EncodingType.Base64,
  //     });
  //     setIdName(fileName);
  //     setIdUri(cacheFilePath);
  //     setIdtype(mimeType);
  //     setIddata(fileData);
  //   } catch (e) {
  //     console.log(e);
  //     return;
  //   }
  // };
  // const _pickId = async () => {
  //   console.log("LOG: _pickId was called");
  //   // used to pick id from the device
  //   try {
  //     let result = await DocumentPicker.getDocumentAsync({
  //       copyToCacheDirectory: false,
  //       type: "*/*",
  //     });
  //     const fileUri = result.uri;
  //     if (!(await getInfoAsync(cacheDirectory + "uploads/")).exists) {
  //       await makeDirectoryAsync(cacheDirectory + "uploads/");
  //     }

  //     const fileName = result.name;
  //     const mimeType = result.mimeType;
  //     const cacheFilePath = cacheDirectory + "uploads/" + fileName;
  //     await copyAsync({ from: fileUri, to: cacheFilePath });

  //     // const tempFileUri = FileSystem.cacheDirectory + fileName;
  //     // await FileSystem.copyAsync({
  //     //   from: fileUri,
  //     //   to: tempFileUri,
  //     // });

  //     const fileData = await FileSystem.readAsStringAsync(cacheFilePath, {
  //       encoding: FileSystem.EncodingType.Base64,
  //     });

  //     setIdName(fileName);
  //     setIdUri(cacheFilePath);
  //     setIdtype(mimeType);
  //     setIddata(fileData);
  //   } catch (e) {
  //     console.log(e);
  //     return;
  //   }
  // };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Apply as a Traveler</Text>
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

        <View style={styles.countryContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.buttonText}>
              {selectedCountry ? selectedCountry : "Select Your Nationality"}
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
                  {countriesData.map((country) => (
                    <TouchableOpacity
                      key={country.code}
                      style={styles.countryItem}
                      onPress={() => handleCountryChange(country.name)}
                    >
                      <Text style={styles.countryText}>{country.name}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>
          </Modal>
        </View>

        <TextInput
          maxLength={50}
          placeholder="Email"
          style={[styles.input, !isValidEmail && styles.inputError]}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          onBlur={validateEmail} // onBlur event for email validation
        />
        {!isValidEmail && (
          <Text style={styles.errorTextEmail}>
            {" "}
            Please enter a valid email address
          </Text>
        )}
        {isLoading && (
          <ActivityIndicator animating={true} size="large" color="#3274cb" />
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

        <View style={styles.uploadContainer}>
          <TouchableOpacity style={styles.uploadButton} onPress={_pickCv}>
            <Text style={styles.uploadButtonText}>Upload CV as pdf</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.uploadButton} onPress={_pickId}>
            <Text style={styles.uploadButtonText}>Upload ID as pdf</Text>
          </TouchableOpacity>
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

        <TouchableOpacity style={styles.applyButton} onPress={logRegister}>
          <Text style={styles.applyButtonText}>Apply</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 20,
    flexGrow: 1,
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#3274cb",
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
  applyButton: {
    backgroundColor: "#3274cb",
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  applyButtonText: {
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
  agreementText: {},
  linkText: {
    color: "blue", // Change to your desired link color
    textDecorationLine: "underline", // underline style to indicate link
  },
  urlText: {
    marginTop: 10, // Add margin to separate URL from text
  },
  countryContainer: {
    marginVertical: 10,
    marginHorizontal: 20,
  },
  button: {
    backgroundColor: "#ebebeb",
    borderRadius: 5,
    padding: 10,
    alignItems: "center",
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
  countryItem: {
    paddingVertical: 10,
  },
  countryText: {
    fontSize: 16,
  },
  uploadContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 16,
  },
  uploadButton: {
    width: 100,
    height: 100,
    backgroundColor: "#3274cb",
    borderRadius: 8,
    marginHorizontal: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  uploadButtonText: {
    color: "white",
    fontSize: 15,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default ApplyAsTravelerScreen;
