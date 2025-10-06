/** @format */

import {useRef} from "react";
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

  async function signup() {
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
      alert("signed up");
      navigate("/");
    } catch (err: any) {
      console.log(err.message);
    }
  }

  return (
    <>
      <div className="h-screen bg-gray-200 flex justify-center items-center">
        <div className="flex flex-col justify-center items-center h-80 w-90 rounded-2xl bg-white p-10">
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
            type="text"
            fullWidth="true"
          />
          <div className="flex justify-center mt-5">
            <Button
              size="lg"
              variant="primary"
              text="Submit"
              onClick={signup}
            />
          </div>
        </div>
      </div>
    </>
  );
}
