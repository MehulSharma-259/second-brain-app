/** @format */

import {Button} from "../components/ui/Button";
import {Input} from "../components/ui/InputBox";
import {useRef, useState} from "react"; // Import useState
import axios from "axios";
import {DB_URL} from "../../config";
import {useNavigate} from "react-router";

export function Signin() {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null); // State for error

  async function signin() {
    setError(null); // Clear previous errors
    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;

    try {
      await axios.post(
        `${DB_URL}/api/v1/signin`,
        {
          email,
          password,
        },
        {
          withCredentials: true, // <-- important
        }
      );
      // alert("signed in"); // No need for alert, just navigate
      navigate("/");
    } catch (err: any) {
      // Set error message from backend
      setError(err.response?.data?.message || err.message || "An error occurred.");
    }
  }

  return (
    <>
      <div className="h-screen bg-gray-200 flex justify-center items-center">
        <div className="flex flex-col justify-center items-center h-auto w-90 rounded-2xl bg-white p-10">
          <h1 className="text-3xl font-bold mb-4">Sign In</h1>
          <Input reference={emailRef} placeholder="Email" fullWidth="true" />
          <Input
            reference={passwordRef}
            placeholder="Password"
            type="password"
            fullWidth="true"
          />
          
          {/* Display error message */}
          {error && (
            <div className="text-red-500 text-sm my-2">
              {error}
            </div>
          )}

          <div className="flex justify-center mt-5">
            <Button
              size="lg"
              onClick={signin}
              variant="primary"
              text="Submit"
            />
          </div>
          <p className="mt-4 text-sm">
            Don't have an account?{" "}
            <a href="/signup" className="text-blue-600 hover:underline">
              Sign Up
            </a>
          </p>
        </div>
      </div>
    </>
  );
}