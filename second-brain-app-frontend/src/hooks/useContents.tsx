/** @format */

import axios from "axios";
import {useEffect, useState} from "react";
import {DB_URL} from "../../config";

export function useContents() {
  const [contents, setContents] = useState<any[]>();

  useEffect(() => {
    axios
      .get(`${DB_URL}/api/v1/content`, {
        withCredentials: true,
      })
      .then((response) => {
        setContents(response.data.contents)
        console.log(response.data.contents)
      });
  }, []);

  return [contents, setContents]
}
