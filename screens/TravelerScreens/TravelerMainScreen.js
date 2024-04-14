import React, { useState } from "react";
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
import { Platform, StatusBar } from "react-native";
import BottomNav2 from "../../components/traveler_components/BottomNav2"; // Import the bottom navigation component
import { useRoute } from "@react-navigation/native";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "../../api/axios";
import { ActivityIndicator } from "react-native-paper";
import { strT } from "../../data/converter";

const TravelerMainScreen = ({ navigation }) => {
  const route = useRoute();

  const [ticketUri, setTicketUri] = useState("");
  const [ticketName, setTicketName] = useState("");
  const [ticketType, setTicketType] = useState("");
  const [ticketData, setTicketData] = useState("");
  const [clickedUpload, setClickedUpload] = useState(false);
  const [pickupLocation, setPickupLocation] = useState("");
  const [flightDate, setFlightDate] = useState("");
  const [hasTicket, setHasTicket] = useState(false);
  const [departure_flight, setDeparture_flight] = useState("");
  const [arrival_flight, setArrival_flight] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [nameonTicket, setNameonTicket] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  // api call to check if user has a ticket
  const handleHasTicket = async () => {
    try {
      const token = await AsyncStorage.getItem("AccessToken");
      const res = await axios.get("/hasTicket", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      await AsyncStorage.setItem("AccessToken", res.data.token);
      console.log(res.data);
      if (res.data.hasTicket == true) {
        const ticket = {
          pdfFile: "ticket.pdf",
          departure: "16Nov 07:15",
          return: "22Nov 12:00",
          departure_flight: "ME0217",
          return_flight: "ME0218",
          ticket_name: "Jane Doe",
        };
        setFlightDate(ticket.departure);
        setDeparture_flight(ticket.departure_flight);
        setArrival_flight(ticket.return_flight);
        setReturnDate(ticket.return);
        setNameonTicket(ticket.ticket_name);
      }
      setHasTicket(res.data.hasTicket);
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

  const handleSubmit = async () => {
    if (pickupLocation == "") {
      Alert.alert(
        "Pickup Location not set",
        "Please set your pickup location before submitting."
      );
      return;
    }
    if (clickedUpload == true) {
      Alert.alert(
        "Ticket already uploaded",
        "You have already uploaded a ticket, please wait."
      );
      return;
    }
    setIsLoading(true);
    // BACKEND CODE TO UPLOAD TICKET AND PICKUP LOCATION TO DATABASE
    try {
      const token = await AsyncStorage.getItem("AccessToken");
      console.log("We are here 6");
      const formData = new FormData();
      console.log(ticketData);
      console.log(ticketUri);
      console.log(ticketType);
      console.log(ticketName);
      console.log(pickupLocation);
      formData.append("file", {
        uri: ticketUri,
        type: ticketType,
        name: ticketName,
        data: ticketData,
      });
      const body = {
        file: {
          uri: ticketUri,
          type: ticketType,
          name: ticketName,
          data: ticketData,
        },
      };
      console.log("before upload");
      const res = await axios
        .post("/traveler/home/uploadTicket", JSON.stringify(body), {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          console.log("uploaded tkt");
        });
      console.log("uploaded tkt");
      // await AsyncStorage.setItem("AccessToken", res.data.token);
      console.log("set token");
      const token1 = await AsyncStorage.getItem("AccessToken");
      console.log("get token");
      const res1 = await axios.post(
        "/providePickup",
        JSON.stringify({ pickupLocation }),
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token1}`,
          },
        }
      );
      setIsLoading(false);
      console.log("uploaded");
      setHasTicket(true);
      handleTravelerView();
      return;
      console.log(res.data); //to check what the server is responding with
      // await AsyncStorage.setItem("AccessToken", res1.data.token);

      //send user to corresponding page
      //add what happens when uploaded successfully
      try {
        const token = await AsyncStorage.getItem("AccessToken");
        const res = await axios.get("/hasTicket", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        await AsyncStorage.setItem("AccessToken", res.data.token);
        console.log(res.data);
        if (hasTicket == true) {
          setFlightDate(res.data.ticket.departure);
          setDeparture_flight(res.data.ticket.departure_flight);
          setArrival_flight(res.data.ticket.return_flight);
          setReturnDate(res.data.ticket.return);
          setNameonTicket(res.data.ticket.ticket_name);
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
      ////
      //fetch the data from the backend like we did in the handleTravelerView function
      //then assign this fetched data to the variables accordingly

      setClickedUpload(true);
      setHasTicket(true);
      handleTravelerView();

      ////
    } catch (err) {
      if (err.status == 401) {
        setIsLoading(false);
        await AsyncStorage.removeItem("AccessToken");
        navigation.reset({
          index: 0,
          routes: [{ name: "LoginScreen" }],
        });
      } else {
        setIsLoading(false);
        await AsyncStorage.setItem("AccessToken", err.response.data.token);
      }
    }
  };

  const handleTicketUploadClicked = async () => {
    console.log("LOG: handleTicketUploadClicked was called");
    if (clickedUpload == true) {
      Alert.alert(
        "Ticket already selected",
        "You have already selected a ticket, please submit to upload."
      );
      return;
    }
    if (pickupLocation == "") {
      Alert.alert(
        "Pickup Location not set",
        "Please set your pickup location before uploading a ticket."
      );
      return;
    }
    _pickTicket();
  };

  const _pickTicket = async () => {
    console.log("LOG: _pickTicket was called");
    // used to pick a ticket from the user's phone
    try {
      let result = await DocumentPicker.getDocumentAsync({
        copyToCacheDirectory: false,
        type: "*/*",
      });
      const fileUri = result.uri;
      const fileName = result.name;
      const mimeType = result.mimeType;

      const tempFileUri = FileSystem.cacheDirectory + fileName;
      await FileSystem.copyAsync({
        from: fileUri,
        to: tempFileUri,
      });

      const fileData = "strT";

      setTicketName(fileName);
      setTicketUri(tempFileUri);
      setTicketType(mimeType);
      setTicketData(fileData);
    } catch (e) {
      console.log(e);
      return;
    }
  };

  const handleCancelTicket = async () => {
    // BACKEND CODE TO CANCEL TICKET IN DATABASE
    try {
      console.log("cancel ticket clicked");
      const token = await AsyncStorage.getItem("AccessToken");
      console.log("got token");
      const res = await axios.post(
        "/cancelflight",
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("post done");
      await AsyncStorage.setItem("AccessToken", res.data.token);
      console.log("AsyncStorage done");
      setHasTicket(false);
      handleTravelerView();
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

  // this is just a placeholder for now
  // will be replaced with a api call to get the flight date

  // this makes sure that handleHasTicket is only called once
  const [rendered, setRendered] = useState(false);

  const handleTravelerView = () => {
    if (rendered == false) {
      setRendered(true);
      handleHasTicket();
    }

    if (hasTicket == false) {
      return (
        <View style={styles.body}>
          {isLoading && (
            <ActivityIndicator animating={true} size="large" color="#3274cb" />
          )}
          <Text style={styles.bodyText}>Upload Your Flight Ticket Here:</Text>
          <Text style={styles.bodyText}>(PDF Only)</Text>
          <Text style={styles.bodyText}>Enter Your Pickup Location:</Text>
          <TextInput
            style={styles.textBox}
            placeholder="Pickup Location"
            onChangeText={setPickupLocation}
            value={pickupLocation}
            maxLength={200}
          />
          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={handleTicketUploadClicked}
          >
            <Text style={styles.buttonText}>Select Ticket</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={handleSubmit}
          >
            <Text style={styles.buttonText}>Submit Ticket and Location</Text>
          </TouchableOpacity>
        </View>
      );
    } else {
      return (
        <View style={styles.body}>
          <Text style={styles.bodyText}>Name on Ticket:</Text>
          <Text style={styles.ansText}>{nameonTicket}</Text>
          <Text style={styles.bodyText}>Your Flight Date:</Text>
          <Text style={styles.ansText}>{flightDate}</Text>
          <Text style={styles.bodyText}>Your Return Date:</Text>
          <Text style={styles.ansText}>{returnDate}</Text>
          <Text style={styles.bodyText}>Your Departure Flight:</Text>
          <Text style={styles.ansText}>{departure_flight}</Text>
          <Text style={styles.bodyText}>Your Arrival Flight:</Text>
          <Text style={styles.ansText}>{arrival_flight}</Text>
          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={handleCancelTicket}
          >
            <Text style={styles.buttonText}>Cancel Ticket</Text>
          </TouchableOpacity>
        </View>
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Traveler Main Screen</Text>
      </View>
      {
        handleTravelerView() //this handles whether to show the upload ticket or the cancel ticket button
      }
      <BottomNav2 navigation={navigation} />
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
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#3274cb",
  },
  body: {
    flex: 3,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  bodyText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#3274cb",
  },
  ansText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  buttonContainer: {
    height: 45,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#3274cb",
    borderRadius: 4,
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginVertical: 3,
    marginHorizontal: 3,
    marginTop: 10,
  },
  buttonText: {
    fontSize: 14,
    color: "white",
  },
  textBox: {
    width: "100%",
    height: 40,
    borderColor: "#3274cb",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
    marginTop: 8,
  },
});
export default TravelerMainScreen;
