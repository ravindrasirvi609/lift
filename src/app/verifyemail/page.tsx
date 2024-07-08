"use client";

import axios from "axios";
import Link from "next/link";
import React, { useCallback, useEffect, useState } from "react";

export default function VerifyEmailPage() {
  const [token, setToken] = useState("");
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const urlToken = window.location.search.split("=")[1];
    setToken(urlToken || "");
  }, []);

  const verifyUserEmail = useCallback(async () => {
    try {
      await axios.post("/api/auth/verifyemail", { token });
      setVerified(true);
    } catch (error: any) {
      setError(true);
    }
  }, [token]);

  useEffect(() => {
    if (token.length > 0) {
      verifyUserEmail();
    }
  }, [token, verifyUserEmail]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gradient-to-r from-[#F9E795] to-[#F9D423]">
      <div className="bg-white rounded-lg p-8 shadow-md w-full max-w-md">
        <h1 className="text-4xl text-center text-[#F96167] font-bold mb-6">
          Verify Email
        </h1>
        <h2 className="p-2 bg-[#F9D423] text-black text-lg text-center font-semibold mb-4 rounded">
          {token ? "Token Available" : "No Token"}
        </h2>

        {verified ? (
          <div className="text-center">
            <h2 className="text-2xl text-green-500 font-bold mb-4">
              Email Verified
            </h2>
            <Link
              href="/login"
              className="bg-[#F96167] hover:bg-[#f84b52] text-white py-2 px-4 rounded-md font-semibold transition duration-300 inline-block"
            >
              Login
            </Link>
          </div>
        ) : error ? (
          <div className="text-center">
            <h2 className="text-2xl bg-[#F96167] text-white font-bold py-2 px-4 rounded-md mb-4">
              Error
            </h2>
            <p className="text-[#F96167] font-semibold mb-4">
              There was an error verifying your email. Please try again.
            </p>
            <Link
              href="/auth"
              className="bg-[#F9D423] hover:bg-[#f7cc00] text-black py-2 px-4 rounded-md font-semibold transition duration-300 inline-block"
            >
              Go Back Home
            </Link>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-[#F96167] font-semibold mb-4">
              Verifying your email...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
