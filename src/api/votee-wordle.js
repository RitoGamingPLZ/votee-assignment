import axios from 'axios';
import qs from 'qs';

// Create Axios instance with common configuration
const axiosInstance = axios.create({
  baseURL: 'https://wordle.votee.dev:8000',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    Accept: 'application/json',
  },
  maxBodyLength: Infinity, // Optional if you need to handle large requests
});


axiosInstance.interceptors.response.use(
  (response) => response, // Let successful responses pass through
  (error) => {
    if (error.response && error.response.data) {
      console.error('API Error:', error.response.data);
    } else {
      console.error('Unexpected Error:', error.message);
    }
    return Promise.reject(error); // Reject to allow higher-level handling
  }
);

// Function to perform the `wordseg` request
export async function wordseg(text) {
  const data = qs.stringify({ text });
  const response = await axiosInstance.post('/wordseg', data);
  console.log(JSON.stringify(response.data));
  return response.data;
}

export async function fetchDaily(guess, size = 5) {
  const response = await axiosInstance.get(`/daily`, {
    params: { guess, size },
  });
  console.log(JSON.stringify(response.data));
  return response.data;
}