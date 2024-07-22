import axios from "axios";

export default axios.create({
  baseURL: "https://indiamfg.engg.lenovo.com/KPI/KPI_API/api",
  headers: {
    "Content-type": "application/json"
  }
});