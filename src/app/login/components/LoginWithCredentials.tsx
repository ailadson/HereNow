"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loginWithCredentials } from "@/lib/actions/authActions";
import Link from "next/link";
import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";

const SubmitButton = () => {
  const { pending } = useFormStatus();

  return <Button variant="default" type="submit" disabled={pending}>Login</Button>
}

export default function LoginWithCredentials() {
  const [state, formAction] = useActionState(loginWithCredentials, { error: null, isLoggedIn: false });

  useEffect(() => {
    if (state.isLoggedIn) {
      // Redirect to the home page
      window.location.href = '/';
    }
  }, [state.isLoggedIn]);
  
  return (
    <form
      className="space-y-4"
      action={formAction}
    >
      {/* Error Message */}
      {state?.error && (
        <div className="text-red-500 text-sm">{state.error}</div>
      )}
      <Input
        type="email"
        placeholder="Email Address"
        className="w-full"
        name="email"
        autoComplete="email"
      />
      <Input
        type="password"
        placeholder="Password"
        className="w-full"
        name="password"
      />
      <div className="flex items-center justify-between">
        <SubmitButton />
        <Link href="/forgot-password" className="text-sm text-muted-foreground hover:text-primary">
          Forgot Password
        </Link>
      </div>
    </form>
  );
}