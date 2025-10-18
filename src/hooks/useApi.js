import { useState, useCallback } from "react";
import { apiGet, apiPost, apiPut, apiDelete } from "../utils/api";

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const request = useCallback(async (apiFunc, ...args) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiFunc(...args);
      setData(response);
      return response;
    } catch (err) {
      console.error("useApi Error:", err);
      setError(err?.message || "Something went wrong.");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const get = useCallback((endpoint, useToken = false) =>
    request(apiGet, endpoint, useToken)
  , [request]);

  const post = useCallback((endpoint, body, useToken = false, isFormData = false) =>
    request(apiPost, endpoint, body, useToken, isFormData)
  , [request]);

  const put = useCallback((endpoint, body, useToken = false, isFormData = false) =>
    request(apiPut, endpoint, body, useToken, isFormData)
  , [request]);

  const del = useCallback((endpoint, useToken = false) =>
    request(apiDelete, endpoint, useToken)
  , [request]);

  return { get, post, put, del, loading, error, data };
};
