import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = "https://trackingdudes.com/apis";

export const apiRequest = async (
  endpoint,
  method = "GET",
  body = null,
  useToken = false,
  isFormData = false
) => {
  const url = `${BASE_URL}${endpoint}`;

  let headers = {};
  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  if (useToken) {
    try {
      const storedTokens = await AsyncStorage.getItem("tokens");
      if (storedTokens) {
        const parsed = JSON.parse(storedTokens);
        if (parsed?.accessToken) {
          headers["Authorization"] = `Bearer ${parsed.accessToken}`;
        }
      }
    } catch (error) {
      console.warn("Failed to load token:", error);
    }
  }

  let options = { method, headers };
  if (body) {
    options.body = isFormData ? body : JSON.stringify(body);
  }

  try {
    const response = await fetch(url, options);
    const data = await response.json();

    if (!response.ok) throw data;
    return data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

export const apiGet = (endpoint, useToken = false) =>
  apiRequest(endpoint, "GET", null, useToken);

export const apiPost = (endpoint, body = null, useToken = false, isFormData = false) =>
  apiRequest(endpoint, "POST", body, useToken, isFormData);

export const apiPut = (endpoint, body = null, useToken = false, isFormData = false) =>
  apiRequest(endpoint, "PUT", body, useToken, isFormData);

export const apiDelete = (endpoint, useToken = false) =>
  apiRequest(endpoint, "DELETE", null, useToken);
