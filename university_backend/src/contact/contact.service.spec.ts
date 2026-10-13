import { BadRequestException } from '@nestjs/common';
import { ContactService } from './contact.service';
import { PrismaService } from '../prisma/prisma.service';

const mainMap = 'https://www.google.com/maps/embed?pb=main';
const secondMap = 'https://www.google.com/maps/embed?pb=second';

describe('Contact campus maps', () => {
  const record = { id: 'contact', address: 'Main address', phone: '123', email: 'info@example.com', mapEmbedUrl: mainMap,
    locations: JSON.stringify([
      { id: 'main', title: 'Main', address: 'Main address', isPrimary: true },
      { id: 'second', title: 'Second', address: 'Second address' },
    ]) };
  let saved: typeof record;
  let service: ContactService;

  beforeEach(() => {
    saved = { ...record };
    const prisma = { contactInfo: {
      findFirst: jest.fn(async () => saved),
      update: jest.fn(async ({ data }) => { saved = { ...saved, ...data }; return saved; }),
    } };
    service = new ContactService(prisma as unknown as PrismaService);
  });

  it('attaches the legacy map only to the primary campus on read', async () => {
    const result = await service.getContactInfo();
    const locations = JSON.parse(result.locations!);
    expect(locations[0].mapEmbedUrl).toBe(mainMap);
    expect(locations[1].mapEmbedUrl).toBe('');
  });

  it('saves iframe input, reordering, and a new primary with the correct maps', async () => {
    await service.updateContactInfo({ locations: [
      { id: 'second', address: 'Second address', isPrimary: true, mapEmbedUrl: `<iframe src="${secondMap}"></iframe>` },
      { id: 'main', address: 'Main address', isPrimary: false, mapEmbedUrl: mainMap },
    ] });
    const result = await service.getContactInfo();
    const locations = JSON.parse(result.locations!);
    expect(locations.map((location: { mapEmbedUrl: string }) => location.mapEmbedUrl)).toEqual([secondMap, mainMap]);
    expect(result.mapEmbedUrl).toBe(secondMap);
    expect(result.address).toBe('Second address');
  });

  it('keeps a removed primary map empty after saving and reloading', async () => {
    await service.updateContactInfo({ locations: [
      { id: 'main', address: 'Main address', isPrimary: true, mapEmbedUrl: '' },
      { id: 'second', address: 'Second address', mapEmbedUrl: secondMap },
    ] });
    const result = await service.getContactInfo();
    expect(JSON.parse(result.locations!)[0].mapEmbedUrl).toBe('');
    expect(result.mapEmbedUrl).toBe('');
  });

  it('clears the legacy map when all campuses are deleted', async () => {
    await service.updateContactInfo({ locations: [] });
    const result = await service.getContactInfo();
    expect(JSON.parse(result.locations!)).toEqual([]);
    expect(result.mapEmbedUrl).toBe('');
  });

  it('rejects non-embed map URLs', async () => {
    await expect(service.updateContactInfo({ locations: [{ mapEmbedUrl: 'https://example.com/maps/embed' }] }))
      .rejects.toBeInstanceOf(BadRequestException);
  });
});
