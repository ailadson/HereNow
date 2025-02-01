"use client";

import React from 'react';
import { useSession } from 'next-auth/react';
import { Timeline } from '@/components/Timeline';
import { AddItemModal } from '@/components/AddItemModal';

export default function Home() {
  const { data: session, status } = useSession();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-xl font-semibold">Discover Places & Events</h1>
          <AddItemModal />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-lg font-medium">Popular near you</h2>
          <p className="text-sm text-muted-foreground">Explore local favorites and upcoming events</p>
        </div>

        <Timeline items={[]} />
      </main>
    </div>
  );

  // return (
  //   <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
  //     <h1 className="text-5xl font-bold text-purple-700 mb-4">HERENOW</h1>
  //     { !session && status !== 'loading' && (
  //       <Link href="/login" className="px-4 py-2 bg-purple-700 text-white rounded hover:bg-purple-600">
  //         Login
  //       </Link>
  //     )}
  //     {/* @ts-expect-error: Don't show signout is we are loading */}
  //     { session && status !== 'loading' && (
  //       <div>
  //         <Button onClick={() => signOut({ redirect: true })}>Sign Out</Button>
  //       </div>
  //     )}
  //   </div>
  // );
}
