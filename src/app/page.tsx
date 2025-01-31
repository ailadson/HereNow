"use client";

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useSession, signOut } from 'next-auth/react';

export default function Home() {
  const { data: session, status } = useSession();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-5xl font-bold text-purple-700 mb-4">HERENOW</h1>
      { !session && status !== 'loading' && (
        <Link href="/login" className="px-4 py-2 bg-purple-700 text-white rounded hover:bg-purple-600">
          Login
        </Link>
      )}
      {/* @ts-expect-error: Don't show signout is we are loading */}
      { session && status !== 'loading' && (
        <div>
          <Button onClick={() => signOut({ redirect: true })}>Sign Out</Button>
        </div>
      )}
    </div>
  );
}
