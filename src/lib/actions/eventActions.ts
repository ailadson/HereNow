'use server';

import { prisma } from '@/lib/prisma';
import { ZodError, z } from 'zod';
import { auth } from '@/lib/auth';

// Define validation schema
const eventSchema = z.object({
  title: z.string().min(1, "Event title is required"),
  description: z.string().min(1, "Description is required"),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), "Invalid date"),
  userId: z.string().uuid("Invalid user ID"),
  imageURL: z.string().url().optional(),
  videoURL: z.string().url().optional(),
  externalLink: z.string().url().optional()
});

// Define types for responses
type EventState = { error: null | string, success: boolean };

// Create, update, delete functions
export async function createEvent(_: unknown, data: FormData): Promise<EventState> {
  try {
    // Validate form data
    const { title, description, date, userId, imageURL, videoURL, externalLink } = await eventSchema.parseAsync({
      title: data.get('title'),
      description: data.get('description'),
      date: data.get('date'),
      userId: data.get('userId'),
      imageURL: data.get('imageURL'),
      videoURL: data.get('videoURL'),
      externalLink: data.get('externalLink'),
    });

    // Create event in the database
    await prisma.event.create({
      data: {
        title,
        description,
        date: new Date(date),
        userId,
        imageURL,
        videoURL,
        externalLink,
        createdById: userId,
      },
    });

    return { error: null, success: true };
  } catch (error) {
    if (error instanceof ZodError) {
      return { error: error.errors[0].message, success: false };
    }
    console.error('Create event error', error);
    return { error: 'Error creating event', success: false };
  }
}

export async function updateEvent(_: unknown, data: FormData): Promise<EventState> {
  try {
    const session = await auth();
    const id = data.get('id') as string;

    // Verify event existence
    const event = await prisma.event.findUnique({ where: { id } });
    if (!event) {
      return { error: 'event not found', success: false };
    }

    // Verify ownership
    if (session?.user.id !== event.userId) {
      return { error: 'Unauthorized action', success: false };
    }
    const { title, description, date, imageURL, videoURL, externalLink } = await eventSchema.omit({ userId: true }).parseAsync({
      title: data.get('title'),
      description: data.get('description'),
      date: data.get('date'),
      imageURL: data.get('imageURL'),
      videoURL: data.get('videoURL'),
      externalLink: data.get('externalLink'),
    });

    await prisma.event.update({
      where: { id },
      data: {
        title,
        description,
        date: new Date(date),
        imageURL,
        videoURL,
        externalLink,
      },
    });

    return { error: null, success: true };
  } catch (error) {
    if (error instanceof ZodError) {
      return { error: error.errors[0].message, success: false };
    }
    console.error('Update event error', error);
    return { error: 'Error updating event', success: false };
  }
}

export async function deleteEvent(_: unknown, data: FormData): Promise<EventState> {
  try {
    const id = data.get('id') as string;

    await prisma.event.delete({
      where: { id },
    });

    return { error: null, success: true };
  } catch (error) {
    console.error('Delete event error', error);
    return { error: 'Error deleting event', success: false };
  }
}
