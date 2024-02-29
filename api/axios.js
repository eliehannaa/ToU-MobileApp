import axios from "axios";

export default axios.create({
  baseURL: "http://192.168.1.21:5000",
  // baseURL: "http://10.21.158.37:5000",
});
