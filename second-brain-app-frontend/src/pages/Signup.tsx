/** @format */

import {useRef, useState} from "react"; // Import useState
import {Button} from "../components/ui/Button";
import {Input} from "../components/ui/InputBox";
import {DB_URL} from "../../config";
import axios from "axios";
import {useNavigate} from "react-router";

export function Signup() {
  const firstNameRef = useRef<HTMLInputElement>(null);
  const lastNameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null); // State for error

  async function signup() {
    setError(null); // Clear previous errors
    const firstName = firstNameRef.current?.value;
    const lastName = lastNameRef.current?.value;
    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;

    try {
      await axios.post(
        `${DB_URL}/api/v1/signup`,
        {
          firstName: firstName,
          lastName: lastName,
          email,
          password,
        },
        {
          withCredentials: true, // <-- important
        }
      );
      // alert("signed up"); // No need for alert, just navigate
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
          <h1 className="text-3xl font-bold mb-4">Create Account</h1>
          <Input
            reference={firstNameRef}
            placeholder="First Name"
            fullWidth="true"
          />
          <Input
            placeholder="Last Name"
            reference={lastNameRef}
            fullWidth="true"
          />
          <Input placeholder="Email" reference={emailRef} fullWidth="true" />
          <Input
            reference={passwordRef}
            placeholder="Password"
            type="password" // <-- FIXED: Changed type to "password"
            fullWidth="true"
          />

          {/* Display error message */}
          {error && (
            <div className="text-red-500 text-sm my-2 max-w-xs text-center">
              {error}
            </div>
          )}

          <div className="flex justify-center mt-5">
            <Button
              size="lg"
              variant="primary"
              text="Submit"
              onClick={signup}
            />
          </div>
          <p className="mt-4 text-sm">
            Already have an account?{" "}
            <a href="/signin" className="text-blue-600 hover:underline">
              Sign In
            </a>
          </p>
        </div>
      </div>
    </>
  );
}