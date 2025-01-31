"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signupUser } from "@/lib/actions/authActions";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";

const SubmitButton = () => {
  const { pending } = useFormStatus();

  return <Button variant="default" type="submit" disabled={pending}>Register</Button>
}

export default function SignupWithCredentials() {
  const [state, formAction] = useActionState(signupUser, { error: null, isSignedUp: false });
  const router = useRouter();

  useEffect(() => {
    if (state.isSignedUp) {
      // Redirect to the login page
      router.push('/');
    }
  }, [state.isSignedUp]);
  
  return (
    <form className="space-y-4" action={formAction}>
      {/* Error Message */}
      {state?.error && (
        <div className="text-red-500 text-sm">{state.error}</div>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          type="text"
          placeholder="First Name"
          className="w-full"
          name="name"
        />
      </div>

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
      <Input
        type="password"
        placeholder="Confirm Password"
        className="w-full"
        name="passwordConfirmation"
      />
      <SubmitButton />
    </form>
  );
}