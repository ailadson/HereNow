import { createEvent, updateEvent, deleteEvent } from '../../../lib/actions/eventActions';
import { prisma } from '../../../lib/prisma';
import { auth } from '../../../lib/auth';

jest.mock('../../../../src/lib/prisma', () => ({
  prisma: {
    event: {
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findUnique: jest.fn(),
    },
  },
}));

const USER_ID = '123e4567-e89b-12d3-a456-426614174000';
const INVALID_ID = '44444444-e89b-12d3-a456-426614174444';

jest.mock('../../../../src/lib/auth', () => ({
  auth: jest.fn(() => ({ user: { id: USER_ID } }))
}));

describe('Event Actions', () => {
  const EVENT_DATA = {
    title: 'Test Event',
    description: 'A test event',
    date: '2024-10-14',
    imageURL: 'https://example.com/image.jpg',
  };
  const EVENT = {
    ...EVENT_DATA,
    id: '123e4567-e89b-12d3-a456-426614174000',
    userId: USER_ID,
  };

  describe('createEvent', () => {
    it('should create an event with valid data', async () => {
      const formData = new FormData();
      formData.append('title', 'Test Event');
      formData.append('description', 'A test event');
      formData.append('date', '2024-10-14');
      formData.append('userId', USER_ID);

      (prisma.event.create as jest.Mock).mockResolvedValue(true);
      const result = await createEvent(null, formData);

      expect(result.success).toBe(true);
      expect(prisma.event.create).toHaveBeenCalled();
    });

    it('should fail when user is not authenticated', async () => {
      (auth as jest.Mock).mockReturnValueOnce(null);

      const formData = new FormData();
      formData.append('title', 'Test Event');
      formData.append('description', 'A test event');
      formData.append('date', '2024-10-14');
      formData.append('userId', INVALID_ID)

      const result = await createEvent(null, formData);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Unauthorized action');
    });
  });

  describe('updateEvent', () => {
    it('should update an existing event if user owns the event', async () => {
      const formData = new FormData();
      formData.append('id', EVENT.id);
      formData.append('title', EVENT.title);
      formData.append('description', 'Foo bar');

      (prisma.event.findUnique as jest.Mock).mockResolvedValue(EVENT);
      (prisma.event.update as jest.Mock).mockResolvedValue(true);

      const result = await updateEvent(null, formData);
      console.log(result);
      expect(result.success).toBe(true);
      expect(prisma.event.update).toHaveBeenCalledWith({
        where: { id: EVENT.id },
        data: { ...EVENT_DATA, date: new Date(EVENT_DATA.date), description: 'Foo bar' },
      });
    });

    it('should not update an event that does not exist', async () => {
      const formData = new FormData();
      formData.append('id', INVALID_ID);

      (prisma.event.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await updateEvent(null, formData);
      expect(result.success).toBe(false);
      expect(result.error).toBe('event not found');
    });
  });

  describe('deleteEvent', () => {
    it('should delete an existing event if user owns the event', async () => {
      const formData = new FormData();
      formData.append('id', EVENT.id);

      (prisma.event.findUnique as jest.Mock).mockResolvedValue(EVENT);
      (prisma.event.delete as jest.Mock).mockResolvedValue(true);

      const result = await deleteEvent(null, formData);
      expect(result.success).toBe(true);
      expect(prisma.event.delete).toHaveBeenCalled();
    });

    it('should not delete an event that does not exist', async () => {
      const formData = new FormData();
      formData.append('id', INVALID_ID);

      (prisma.event.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await deleteEvent(null, formData);
      expect(result.success).toBe(false);
      expect(result.error).toBe('Event not found');
    });
  });
});
