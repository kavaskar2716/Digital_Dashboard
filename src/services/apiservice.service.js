import React from 'react';
import http from "../http-common";
import axios from 'axios';
class ApiService extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      httpOptions: {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + this.getBearerToken()
        }
      },
      httpOptionsFormData: {
        headers: {
          'Authorization': 'Bearer ' + this.getBearerToken()
        }
      }
    };
    const httpform = axios.create({

      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  getBearerToken() {
    // Retrieve the token from localStorage
    return localStorage.getItem("JWT_Token") || '';
  }

  static async GetCSADetails() {
    try {
      const response = await http.get("/kpi/GetCSADetails");
      return response.data;
    } catch (error) {
      throw new Error('Error fetching Data:', error);
    }
  }
  static async Getdigitalinput() {
    try {
      const response = await http.get("/kpi/Getdigitalinput");
      return response.data;
    } catch (error) {
      throw new Error('Error fetching Data:', error);
    }
  }
  static async UploadFile(formData) {
    try {
      const response = await http.post('/kpi/PostDigitalsliderimg', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw new Error('Error uploading file:', error);
    }
  }
  static async PostManageCSAInput(data) {
    // Your logic to post/manage CSA input
    const response = await http.post('/Program/PostManageCSAInput', data);
    return response.data;
  }

  static async Getslidermodalimg(data) {
    // Your logic to post/manage CSA input
    const response = await http.post('/kpi/PostDigitalDashboardSlideList', data);
    return response.data;
  }
  static async PostDigitalDashboardinput(data) {
    // Your logic to post/manage CSA input
    const response = await http.post('/kpi/PostDigitalDashboardinput', data);
    return response.data;
  }

  static async PostCSAJsonChecklist(data) {
    // Your logic to post/manage CSA input
    const response = await http.post('/Program/PostCSAJsonChecklist', data);
    return response.data;
  }
  static async Postsignaturelist(data) {
    // Your logic to post/manage CSA input
    const response = await http.post('/Program/Postsignaturelist', data);
    return response.data;
  }
  static async PostManageCSAChecklist(data) {
    // Your logic to post/manage CSA input
    const response = await http.post('/Program/PostManageCSAChecklist', data);
    return response.data;
  }

  static async PostAddCSAJsonDataIntoTbl(formData) {
    try {
      const response = await axios.post('http://10.162.80.66:8028/CSA_API/api/FileUpload/PostAddCSAJsonDataIntoTbl', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',

        },
      });
      return response.data; // Return the response data
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error; // Re-throw the error to be handled by the caller
    }
  }
  static async downloadCSAFiles(fileName) {
    try {
      const response = await axios.post(`http://10.162.80.66:8028/CSA_API/api/FileUpload/DownloadFile`, fileName,{
        responseType: 'blob',  // Ensure the response is treated as blob data
        headers: {
          Authorization: `Bearer ${localStorage.getItem("Token")}`
        }
      });
      return response.data; // Return the blob data
    } catch (error) {
      console.error('Error downloading file:', error);
      throw error; // Re-throw the error to be handled by the caller
    }
  }

  static async uploadCSAFiles(formData) {
    try {
      const response = await axios.post('http://10.162.80.66:8028/CSA_API/api/FileUpload/uploadCSAFiles', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',

        },
      });
      return response.data; // Return the response data
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error; // Re-throw the error to be handled by the caller
    }
  }
  render() {
    return null; // Since this is not a UI component, returning null
  }
}

export default ApiService;
