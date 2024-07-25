import axios from "axios";

export default axios.create({
  baseURL: "http://10.162.80.66/KPI/KPI_API/api",
  headers: {
    "Content-type": "application/json"
  }
});