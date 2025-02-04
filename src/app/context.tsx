"use client";

import React, { createContext, useContext, ReactNode } from 'react';

type Site = {
  id: string
  name: string
  description: string
  type: 'event' | 'site';
  rating?: number
  tagline?: string
  eventMedia?: { imageURL: string, videoURL: string }[]
}
type Event = { date: string } & Site;

export type TimelineItem = Site | Event;

interface TimelineContextValue {
  items: TimelineItem[];
}

const TimelineContext = createContext<TimelineContextValue | undefined>(undefined);

export function TimelineProvider({
  items,
  children,
}: {
  items: TimelineItem[];
  children: ReactNode;
}) {
  return (
    <TimelineContext.Provider value={{ items }}>
      {children}
    </TimelineContext.Provider>
  );
}

export function useTimeline() {
  const context = useContext(TimelineContext);
  if (context === undefined) {
    throw new Error('useTimeline must be used within a TimelineProvider');
  }
  return context;
}