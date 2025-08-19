import { useEffect, useState } from "react";
import api from "../api/axiosInstance";

export const useProtectedData = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/protected/")
      .then((res) => setData(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return { data, loading };
};
