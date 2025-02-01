import { createSite, updateSite, deleteSite } from '../../../lib/actions/siteActions';
import { prisma } from '../../../lib/prisma';
import { auth } from '../../../lib/auth';

jest.mock('../../../../src/lib/prisma', () => ({
  prisma: {
    site: {
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

describe('Site Actions', () => {
  const SITE_DATA = {
    name: 'Test Site',
    description: 'A test site',
    tagline: 'A test tagline',
  };
  const SITE = {
    ...SITE_DATA,
    id: '123e4567-e89b-12d3-a456-426614174000',
    userId: USER_ID,
  };

  describe('createSite', () => {
    it('should create a site with valid data', async () => {
      const formData = new FormData();
      formData.append('name', SITE_DATA.name);
      formData.append('description', SITE_DATA.description);
      formData.append('tagline', SITE_DATA.tagline);
      formData.append('userId', USER_ID);

      (prisma.site.create as jest.Mock).mockResolvedValue(true);
      const result = await createSite(null, formData);

      expect(result.success).toBe(true);
      expect(prisma.site.create).toHaveBeenCalled();
    });

    it('should fail when user is not authenticated', async () => {
      (auth as jest.Mock).mockReturnValueOnce(null);

      const formData = new FormData();
      formData.append('name', 'Test Site');
      formData.append('description', 'A test site');
      formData.append('userId', INVALID_ID);

      const result = await createSite(null, formData);
      console.log(result);
      expect(result.success).toBe(false);
      expect(result.error).toBe('Unauthorized action');
    });
  });

  describe('updateSite', () => {
    it('should update an existing site if user owns the site', async () => {
      const formData = new FormData();
      formData.append('id', SITE.id);
      formData.append('name', SITE.name);
      formData.append('description', 'Updated description');

      (prisma.site.findUnique as jest.Mock).mockResolvedValue(SITE);
      (prisma.site.update as jest.Mock).mockResolvedValue(true);

      const result = await updateSite(null, formData);
      expect(result.success).toBe(true);
      expect(prisma.site.update).toHaveBeenCalledWith({
        where: { id: SITE.id },
        data: { ...SITE_DATA, description: 'Updated description' },
      });
    });

    it('should not update a site that does not exist', async () => {
      const formData = new FormData();
      formData.append('id', INVALID_ID);

      (prisma.site.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await updateSite(null, formData);
      expect(result.success).toBe(false);
      expect(result.error).toBe('Site not found');
    });
  });

  describe('deleteSite', () => {
    it('should delete an existing site if user owns the site', async () => {
      const formData = new FormData();
      formData.append('id', SITE.id);

      (prisma.site.findUnique as jest.Mock).mockResolvedValue(SITE);
      (prisma.site.delete as jest.Mock).mockResolvedValue(true);

      const result = await deleteSite(null, formData);
      expect(result.success).toBe(true);
      expect(prisma.site.delete).toHaveBeenCalled();
    });

    it('should not delete a site that does not exist', async () => {
      const formData = new FormData();
      formData.append('id', INVALID_ID);

      (prisma.site.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await deleteSite(null, formData);
      expect(result.success).toBe(false);
      expect(result.error).toBe('Site not found');
    });
  });
});
