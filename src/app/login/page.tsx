"use client";

import { Separator } from "@/components/ui/separator";
import GoogleLoginButton from "./components/GoogleLoginButton";
import LoginWithCredentials from "./components/LoginWithCredentials";
import SignupWithCredentials from "./components/SignupWithCredentials";

export default function LoginPage() {
  return (
    <div className="w-full flex flex-col sm:flex-row gap-8 sm:gap-12 px-24 jusitfy-between">
      {/* Login Section */}
      <div className="flex-1 flex flex-col justify-center space-y-6 max-w-[400]">
        <LoginWithCredentials />
        <div className="space-y-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or</span>
            </div>
          </div>

          <GoogleLoginButton>Continue with Google</GoogleLoginButton>
        </div>
      </div>

      {/* Vertical Separator for Desktop */}
      <div className="hidden sm:block self-stretch">
        <Separator orientation="vertical" className="h-full" />
      </div>

      {/* Register Section */}
      <div className="flex-1 flex flex-col justify-center space-y-6 max-w-[400]">
        <SignupWithCredentials />
        <div className="space-y-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or</span>
            </div>
          </div>

          <GoogleLoginButton>Sign up with Google</GoogleLoginButton>
        </div>
      </div>
    </div>
  )
};