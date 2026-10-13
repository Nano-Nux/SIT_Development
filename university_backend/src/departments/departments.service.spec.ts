import { BadRequestException } from '@nestjs/common';
import { DepartmentsService } from './departments.service';
import { PrismaService } from '../prisma/prisma.service';

describe('department link destinations', () => {
  const department = {
    create: jest.fn().mockResolvedValue({ id: 'dept' }),
    update: jest.fn().mockResolvedValue({ id: 'dept' }),
    findUnique: jest.fn().mockResolvedValue({ id: 'dept' }),
  };
  const service = new DepartmentsService({ department } as unknown as PrismaService);

  beforeEach(() => jest.clearAllMocks());

  it('saves an external destination when creating a department', async () => {
    await service.create({ name: 'Partner School', slug: 'partner', description: '', externalUrl: ' https://example.com/study?q=1 ' });
    expect(department.create).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({ externalUrl: 'https://example.com/study?q=1' }),
    }));
  });

  it('updates the destination and clears it when returning to an internal page', async () => {
    await service.update('dept', { externalUrl: 'http://example.com' });
    expect(department.update).toHaveBeenLastCalledWith(expect.objectContaining({
      data: expect.objectContaining({ externalUrl: 'http://example.com/' }),
    }));
    await service.update('dept', { externalUrl: null });
    expect(department.update).toHaveBeenLastCalledWith(expect.objectContaining({
      data: expect.objectContaining({ externalUrl: null }),
    }));
  });

  it('preserves the existing destination when an unrelated field is updated', async () => {
    await service.update('dept', { name: 'Updated name' });
    expect(department.update).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({ externalUrl: undefined }),
    }));
  });

  it.each(['javascript:alert(1)', 'data:text/html,test', '/local-page', 'example.com', 'https://user:password@example.com', 123])(
    'rejects invalid external destinations: %s', async (externalUrl) => {
      await expect(service.create({ name: 'Partner', externalUrl })).rejects.toBeInstanceOf(BadRequestException);
      await expect(service.update('dept', { externalUrl })).rejects.toBeInstanceOf(BadRequestException);
      expect(department.create).not.toHaveBeenCalled();
      expect(department.update).not.toHaveBeenCalled();
    },
  );
});
