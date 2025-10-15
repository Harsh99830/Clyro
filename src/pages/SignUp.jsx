import React from "react";
import { SignUp } from "@clerk/clerk-react";

export default function SignUpPage() {
  return (
    <div className="flex justify-center items-center h-screen bg-cyan-50">
      <SignUp path="/sign-up" routing="path" />
    </div>
  );
}