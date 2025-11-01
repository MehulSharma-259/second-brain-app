/** @format */

import axios from "axios";
import {useEffect, useState, useCallback} from "react";
import {useNavigate} from "react-router"; // Import useNavigate
import {DB_URL} from "../../config";

export function useContents() {
  const [contents, setContents] = useState<any[]>([]); // Default to empty array
  const [isLoading, setIsLoading] = useState(true); // <-- 1. ADD THIS
  const navigate = useNavigate(); // Initialize navigate

  const fetchContents = useCallback(async () => {
    setIsLoading(true); // <-- 2. SET LOADING TRUE
    try {
      const response = await axios.get(`${DB_URL}/api/v1/content`, {
        withCredentials: true,
      });
      setContents(response.data.contents);
      console.log(response.data.contents);
    } catch (error: any) {
      // If auth error (401), redirect to signin
      if (error.response?.status === 401) {
        navigate("/signin");
      } else {
        console.error("Failed to fetch contents:", error.message);
      }
    } finally {
      setIsLoading(false); // <-- 3. SET LOADING FALSE IN ALL CASES
    }
  }, [navigate]); // Add navigate to dependency array

  useEffect(() => {
    fetchContents();
  }, [fetchContents]); // Run on mount

  // 4. RETURN isLoading
  return [contents, setContents, fetchContents, isLoading] as const;
}