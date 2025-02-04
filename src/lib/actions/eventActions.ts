'use server';

import { prisma } from '@/lib/prisma';
import { ZodError, z } from 'zod';
import { auth } from '@/lib/auth';
import { removeEmpty } from '../utils';
import isUrl from 'is-url';
import { AddItemFormDataType } from '@/components/AddItemModal';

// Preprocessor to ensure URLs have a protocol
const ensureUrlWithProtocol = (arg: unknown) =>
  typeof arg === 'string' && arg.length > 0 && !/^(https?:\/\/)/.test(arg)
    ? "http://" + arg
    : arg;

// Define validation schema
const eventSchema = z.object({
  name: z.string().min(1, "Event title is required"),
  description: z.string().min(1, "Description is required"),
  tagline: z.string().min(1, "Tagline is required"),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), "Invalid date"),
  userId: z.string().uuid("Unauthorized action"),
  externalLink: z.preprocess(ensureUrlWithProtocol, z.string().url()).optional()
});

const eventMediaSchema = z.object({
  imageURL: z.preprocess(ensureUrlWithProtocol, z.string().url()).optional(),
  videoURL: z.preprocess(ensureUrlWithProtocol, z.string().url()).optional(),
  eventId: z.string().uuid("Invalid event ID"),
});

// Define types for responses
type EventState = { error: null | string, success: boolean };

export async function createEvent(_: unknown, data: AddItemFormDataType): Promise<EventState> {
  try {
    // Get user session
    const session = await auth();

    if (session?.user.id !== data.userId) {
      return { error: 'Unauthorized action', success: false };
    }

    // Validate form data
    const {
      name,
      description,
      tagline,
      date,
      userId,
      externalLink,
    } = await eventSchema.parseAsync(removeEmpty({
      name: data.name,
      description: data.description,
      tagline: data.tagline,
      date: data.date,
      userId: data.userId,
      externalLink: data.externalLink || undefined,
    }));

    // Create event in the database
    const event = await prisma.event.create({
      data: {
        name,
        description,
        tagline,
        date: new Date(date),
        userId,
        externalLink,
        createdById: userId,
      },
    });

    // Validate media data
    data.mediaItems?.forEach(async (mediaItem) => {
      const { imageURL, videoURL, eventId } = await eventMediaSchema.parseAsync(removeEmpty({
        imageURL: mediaItem.type === 'image' ? mediaItem.url : undefined,
        videoURL: mediaItem.type === 'video' ? mediaItem.url : undefined,
        eventId: event.id,
      }));

      // Create media item in the database
      await prisma.eventMedia.create({
        data: {
          imageURL,
          videoURL,
          eventId,
        },
      });
    });

    return { error: null, success: true };
  } catch (error) {
    if (error instanceof ZodError) {
      return { error: JSON.stringify(error.errors), success: false };
    }
    console.error('Create event error', error);
    return { error: 'Error creating event', success: false };
  }
}

export async function updateEvent(_: unknown, data: AddItemFormDataType): Promise<EventState> {
  try {
    const session = await auth();
    // Assuming an "id" field is included in data during update
    const id = (data as any).id as string;

    // Verify event existence
    const event = await prisma.event.findUnique({ where: { id } });
    if (!event) {
      return { error: 'Event not found', success: false };
    }

    // Verify ownership
    if (session?.user.id !== event.userId) {
      return { error: 'Unauthorized action', success: false };
    }

    const d = removeEmpty({
      name: data.name || event.name,
      description: data.description || event.description,
      tagline: data.tagline || event.tagline,
      date: data.date || event.date,
      externalLink: data.externalLink || event.externalLink,
    });
    const { name, description, tagline, date, externalLink } =
      await eventSchema.omit({ userId: true }).parseAsync(d);

    await prisma.event.update({
      where: { id },
      data: removeEmpty({
        name,
        description,
        tagline,
        date: new Date(date),
        externalLink,
      }),
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

export async function deleteEvent(_: unknown, data: AddItemFormDataType): Promise<EventState> {
  try {
    const session = await auth();
    // Assuming the id field is part of data for deletion
    const id = (data as any).id as string;

    // Verify event existence
    const event = await prisma.event.findUnique({ where: { id } });
    if (!event) {
      return { error: 'Event not found', success: false };
    }

    if (session?.user.id !== event.userId) {
      return { error: 'Unauthorized action', success: false };
    }

    await prisma.event.delete({
      where: { id },
    });

    return { error: null, success: true };
  } catch (error) {
    console.error('Delete event error', error);
    return { error: 'Error deleting event', success: false };
  }
}
