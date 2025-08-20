import { useEffect, useState } from "react";
import apiInstance from "../api/axiosInstance";

export const useProtectedData = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiInstance.post("/protected/")
      .then((res) => setData(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return { data, loading };
};
