'use server';

import { prisma } from '@/lib/prisma';
import { ZodError, z } from 'zod';
import { auth } from '@/lib/auth';
import { AddItemFormDataType } from '@/components/AddItemModal';

const siteSchema = z.object({
  name: z.string().min(1, "Site name is required"),
  description: z.string().min(1, "Description is required"),
  tagline: z.string().min(1, "Tagline is required"),
  userId: z.string().uuid("Invalid user ID"),
});

type SiteState = { error: null | string, success: boolean };

export async function createSite(_: unknown, data: AddItemFormDataType): Promise<SiteState> {
  try {
    const session = await auth();

    if (session?.user.id !== data.userId.toString()) {
      return { error: 'Unauthorized action', success: false };
    }

    const { name, description, tagline, userId } = await siteSchema.parseAsync({
      name: data.name,
      description: data.description,
      tagline: data.tagline,
      userId: data.userId.toString(),
    });

    await prisma.site.create({
      data: {
        name,
        description,
        tagline,
        userId,
      },
    });

    return { error: null, success: true };
  } catch (error) {
    if (error instanceof ZodError) {
      return { error: error.errors[0].message, success: false };
    }
    console.error('Create site error', error);
    return { error: 'Error creating site', success: false };
  }
}

export async function updateSite(_: unknown, data: AddItemFormDataType): Promise<SiteState> {
  try {
    const session = await auth();
    // Assuming the id field is added to data when updating
    const id = (data as any).id as string;
    const site = await prisma.site.findUnique({ where: { id } });
    if (!site) {
      return { error: 'Site not found', success: false };
    }
    if (session?.user.id !== site.userId) {
      return { error: 'Unauthorized action', success: false };
    }

    const { name, description, tagline } = await siteSchema.omit({ userId: true }).parseAsync({
      name: data.name || site.name,
      description: data.description || site.description,
      tagline: data.tagline || site.tagline,
    });

    await prisma.site.update({
      where: { id },
      data: {
        name,
        description,
        tagline,
      },
    });

    return { error: null, success: true };
  } catch (error) {
    if (error instanceof ZodError) {
      return { error: error.errors[0].message, success: false };
    }
    console.error('Update site error', error);
    return { error: 'Error updating site', success: false };
  }
}

export async function deleteSite(_: unknown, data: FormData): Promise<SiteState> {
  try {
    const session = await auth();
    const id = data.get('id') as string;

    // Verify site existence
    const site = await prisma.site.findUnique({ where: { id } });
    if (!site) {
      return { error: 'Site not found', success: false };
    }

    // Verify ownership (pseudo-code)
    if (session?.user.id !== site.userId) {
      return { error: 'Unauthorized action', success: false };
    }

    await prisma.site.delete({
      where: { id },
    });

    return { error: null, success: true };
  } catch (error) {
    console.error('Delete site error', error);
    return { error: 'Error deleting site', success: false };
  }
}
