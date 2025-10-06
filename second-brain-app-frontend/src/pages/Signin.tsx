/** @format */

import {Button} from "../components/ui/Button";
import {Input} from "../components/ui/InputBox";
import {useRef} from "react";
import axios from "axios";
import {DB_URL} from "../../config";
import {useNavigate} from "react-router";

export function Signin() {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  async function signin() {
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
      alert("signed in");
      navigate("/");
    } catch (err: any) {
      console.log(err.message);
    }
  }

  return (
    <>
      <div className="h-screen bg-gray-200 flex justify-center items-center">
        <div className="flex flex-col justify-center items-center h-80 w-90 rounded-2xl bg-white p-10">
          <Input reference={emailRef} placeholder="Email" fullWidth="true" />
          <Input
            reference={passwordRef}
            placeholder="Password"
            type="password"
            fullWidth="true"
          />
          <div className="flex justify-center mt-5">
            <Button
              size="lg"
              onClick={signin}
              variant="primary"
              text="Submit"
            />
          </div>
        </div>
      </div>
    </>
  );
}
