import React from "react";
import { SignIn } from "@clerk/clerk-react";

export default function SignInPage() {
  return (
    <div className="flex justify-center items-center h-screen bg-cyan-50">
      <SignIn path="/sign-in" routing="path" />
    </div>
  );
}