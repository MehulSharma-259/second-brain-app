/** @format */

import axios from "axios";
import {useEffect, useState, useCallback} from "react";
import {useNavigate} from "react-router"; // Import useNavigate
import {DB_URL} from "../../config";

export function useContents() {
  const [contents, setContents] = useState<any[]>([]); // Default to empty array
  const navigate = useNavigate(); // Initialize navigate

  const fetchContents = useCallback(async () => {
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
    }
  }, [navigate]); // Add navigate to dependency array

  useEffect(() => {
    fetchContents();
  }, [fetchContents]); // Run on mount

  // Return contents, setContents, and the refetch function
  return [contents, setContents, fetchContents] as const;
}