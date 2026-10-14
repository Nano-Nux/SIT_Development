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
  it('migrates shared contact details into only the primary campus', async () => {
    const result = await service.getContactInfo();
    const [main, second] = JSON.parse(result.locations!);
    expect(main.phones[0].number).toBe('123');
    expect(main.emails[0].email).toBe('info@example.com');
    expect(main.officeHoursList).toHaveLength(2);
    expect(second.phones).toEqual([]);
    expect(second.emails).toEqual([]);
    expect(second.officeHoursList).toEqual([]);
  });

  it('saves and reloads independent full campus sections and synchronizes the primary', async () => {
    const main = { id: 'main', title: 'Main', address: 'Main address', isPrimary: false, mapEmbedUrl: mainMap,
      phones: [{ id: 'p1', number: '111', label: 'Admissions' }],
      emails: [{ id: 'e1', email: 'main@example.com' }],
      officeHoursList: [{ id: 'h1', days: 'Monday', hours: '8-5' }] };
    const second = { id: 'second', title: 'Second', address: 'Second address', isPrimary: true, mapEmbedUrl: secondMap,
      phones: [{ id: 'p2', number: '222', label: 'Office' }],
      emails: [{ id: 'e2', email: 'second@example.com' }],
      officeHoursList: [{ id: 'h2', days: 'Tuesday', hours: '9-6' }] };
    await service.updateContactInfo({ locations: JSON.stringify([second, main]) });
    const result = await service.getContactInfo();
    expect(JSON.parse(result.locations!)).toEqual([second, main]);
    expect(result.phone).toBe('222');
    expect(result.email).toBe('second@example.com');
    expect(result.officeHours).toBe('Tuesday: 9-6');
    expect(JSON.parse(result.phones!)).toEqual(second.phones);
  });

  it('does not restore explicitly removed contact rows on reload', async () => {
    await service.updateContactInfo({ locations: [{ id: 'main', address: 'Main address', isPrimary: true,
      mapEmbedUrl: mainMap, phones: [], emails: [], officeHoursList: [] }] });
    const result = await service.getContactInfo();
    const campus = JSON.parse(result.locations!)[0];
    expect(campus.phones).toEqual([]);
    expect(campus.emails).toEqual([]);
    expect(campus.officeHoursList).toEqual([]);
    expect(result.phone).toBe('');
    expect(result.email).toBe('');
    expect(result.officeHours).toBe('');
  });

  it('clears all primary contact details when all sections are deleted', async () => {
    await service.updateContactInfo({ locations: [] });
    const result = await service.getContactInfo();
    expect(result.address).toBe('');
    expect(result.phone).toBe('');
    expect(result.email).toBe('');
    expect(JSON.parse(result.phones!)).toEqual([]);
  });

  it('rejects malformed campus contact rows', async () => {
    await expect(service.updateContactInfo({ locations: [{ phones: 'not an array' }] }))
      .rejects.toBeInstanceOf(BadRequestException);
    await expect(service.updateContactInfo({ locations: [{ phones: [{ id: 'empty', number: '' }] }] }))
      .rejects.toBeInstanceOf(BadRequestException);
  });

});
