import { CoreValuesService } from '../core-values/core-values.service';
import { MajorsService } from '../majors/majors.service';
import { DepartmentsService } from '../departments/departments.service';
import { ProgramsService } from '../programs/programs.service';
import { FacultyService } from '../faculty/faculty.service';
import { ProgramDirectorsService } from '../program-directors/program-directors.service';
import { SpotlightsService } from '../spotlights/spotlights.service';
import { PartnersService } from '../partners/partners.service';
import { CampusFacilitiesService } from '../campus-facilities/campus-facilities.service';
import { NewsService } from '../news/news.service';
import { EventsService } from '../events/events.service';
import { StudentLifeService } from '../student-life/student-life.service';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AdmissionsService } from '../admissions/admissions.service';
import { AboutService } from '../about/about.service';
import { HeroService } from '../hero/hero.service';
import { ContactService } from '../contact/contact.service';

type ServiceConstructor = new (prisma: PrismaService) => any;
const resources: [string, ServiceConstructor][] = [
  ['coreValue', CoreValuesService],
  ['major', MajorsService],
  ['department', DepartmentsService],
  ['program', ProgramsService],
  ['faculty', FacultyService],
  ['programDirector', ProgramDirectorsService],
  ['spotlight', SpotlightsService],
  ['partner', PartnersService],
  ['campusFacility', CampusFacilitiesService],
  ['news', NewsService],
  ['event', EventsService],
  ['studentLife', StudentLifeService],
];
const record = { id: 'record', page: 'ABOUT', slug: 'sample' };
const makeDelegate = () => ({
  findUnique: jest.fn().mockResolvedValue(record),
  findFirst: jest.fn().mockResolvedValue(record),
  create: jest.fn().mockResolvedValue(record),
  update: jest.fn().mockResolvedValue(record),
  upsert: jest.fn().mockResolvedValue(record),
});
function fields(model: string) {
  const meta = Prisma.dmmf.datamodel.models.find(
    (m) => m.name.toLowerCase() === model.toLowerCase(),
  )!;
  return Object.fromEntries(
    meta.fields
      .filter((f) => f.name.endsWith('Zh'))
      .map((f) => [f.name, '中文测试']),
  );
}
const base = {
  name: 'Sample',
  title: 'Sample',
  slug: 'sample',
  eventDate: '2026-11-14',
  openingDate: '2026-11-14',
  closingDate: '2026-12-14',
};

describe('Chinese CMS persistence', () => {
  it.each(resources)(
    '%s creates, updates, clears, and preserves Chinese fields',
    async (model, Service) => {
      const delegate = makeDelegate();
      const service = new Service({
        [model]: delegate,
      } as unknown as PrismaService);
      const chinese = fields(model);
      expect(Object.keys(chinese).length).toBeGreaterThan(0);
      await service.create({ ...base, ...chinese });
      expect(delegate.create).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining(chinese) }),
      );
      await service.update('record', chinese);
      expect(delegate.update).toHaveBeenLastCalledWith(
        expect.objectContaining({ data: expect.objectContaining(chinese) }),
      );
      await service.update(
        'record',
        Object.fromEntries(Object.keys(chinese).map((k) => [k, null])),
      );
      const saved = delegate.update.mock.calls.at(-1)![0].data;
      for (const key of Object.keys(chinese))
        expect([null, '']).toContain(saved[key]);
      await service.update('record', { title: 'Unrelated edit' });
      for (const key of Object.keys(chinese))
        expect(delegate.update.mock.calls.at(-1)![0].data[key]).toBeUndefined();
    },
  );
  it.each([
    ['applicationTimeline', 'createTimeline', 'updateTimeline'],
    ['applicationReminder', 'createReminder', 'updateReminder'],
    ['admissionRequirement', 'createRequirement', 'updateRequirement'],
    ['admissionFaq', 'createFaq', 'updateFaq'],
    ['applicationMaterial', 'createMaterial', 'updateMaterial'],
  ])(
    '%s persists Chinese admissions content',
    async (model, create, update) => {
      const delegate = makeDelegate();
      const service = new AdmissionsService({
        [model]: delegate,
      } as unknown as PrismaService) as any;
      const chinese = fields(model);
      await service[create]({ ...base, ...chinese });
      expect(delegate.create).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining(chinese) }),
      );
      await service[update]('record', chinese);
      expect(delegate.update).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining(chinese) }),
      );
    },
  );
  it.each([
    ['founder', 'updateFounder'],
    ['visionMission', 'updateVisionMission'],
  ])(
    '%s creates and updates Chinese singleton content',
    async (model, method) => {
      const delegate = makeDelegate();
      const service = new AboutService({
        [model]: delegate,
      } as unknown as PrismaService) as any;
      const chinese = fields(model);
      delegate.findFirst.mockResolvedValueOnce(null);
      await service[method]({ ...base, ...chinese });
      expect(delegate.create).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining(chinese) }),
      );
      await service[method](chinese);
      expect(delegate.update).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining(chinese) }),
      );
    },
  );
  it.each([
    ['member', 'createMember', 'updateMember'],
    ['history', 'createHistory', 'updateHistory'],
  ])(
    '%s persists Chinese about-page content',
    async (model, create, update) => {
      const delegate = makeDelegate();
      const service = new AboutService({
        [model]: delegate,
      } as unknown as PrismaService) as any;
      const chinese = fields(model);
      await service[create]({ ...base, year: '2026', ...chinese });
      expect(delegate.create).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining(chinese) }),
      );
      await service[update]('record', chinese);
      expect(delegate.update).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining(chinese) }),
      );
    },
  );
  it('clears structured Chinese translations as null so English fallback remains usable', async () => {
    const admissionRequirement = makeDelegate();
    const visionMission = makeDelegate();
    await new AdmissionsService({
      admissionRequirement,
    } as unknown as PrismaService).updateRequirement('record', {
      requirementsListZh: null,
    });
    await new AboutService({
      visionMission,
    } as unknown as PrismaService).updateVisionMission({ corePillarsZh: null });
    expect(
      admissionRequirement.update.mock.calls[0][0].data.requirementsListZh,
    ).toBeNull();
    expect(visionMission.update.mock.calls[0][0].data.corePillarsZh).toBeNull();
  });
  it('searches Chinese news independently of English and Lao', async () => {
    const news = {
      findMany: jest.fn().mockResolvedValue([]),
      count: jest.fn().mockResolvedValue(0),
    };
    const service = new NewsService({ news } as unknown as PrismaService);
    await service.findAll({ search: '中文' });
    const alternatives = news.findMany.mock.calls[0][0].where.OR;
    expect(alternatives).toEqual(
      expect.arrayContaining([
        { titleZh: { contains: '中文', mode: 'insensitive' } },
        { summaryZh: { contains: '中文', mode: 'insensitive' } },
      ]),
    );
    for (const filter of alternatives)
      expect(Object.keys(filter)).toHaveLength(1);
  });
  it('preserves Chinese hero fields in both upsert branches', async () => {
    const delegate = makeDelegate();
    const service = new HeroService({
      hero: delegate,
    } as unknown as PrismaService);
    const chinese = fields('hero');
    await service.upsert('ABOUT', { title: 'About', ...chinese });
    expect(delegate.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        create: expect.objectContaining(chinese),
        update: expect.objectContaining(chinese),
      }),
    );
  });
  it('saves nested Chinese campus information and synchronizes legacy fields', async () => {
    const delegate = makeDelegate();
    const service = new ContactService({
      contactInfo: delegate,
    } as unknown as PrismaService);
    const campus = {
      id: 'campus',
      title: 'Main',
      titleZh: '主校区',
      address: 'Address',
      addressZh: '中文地址',
      notesZh: '中文备注',
      phones: [{ id: 'phone', number: '+8562012345678', labelZh: '招生办' }],
      emails: [{ id: 'email', email: 'info@example.test', labelZh: '咨询' }],
      officeHoursList: [
        {
          id: 'hour',
          days: 'Monday',
          daysZh: '周一',
          hours: '9–5',
          hoursZh: '9点至17点',
          notesZh: '预约接待',
        },
      ],
    };
    await service.updateContactInfo({ locations: [campus] });
    const saved = delegate.update.mock.calls[0][0].data;
    expect(JSON.parse(saved.locations)[0]).toMatchObject(campus);
    expect(saved.addressZh).toBe('中文地址');
    expect(saved.officeHoursZh).toBe('周一: 9点至17点');
  });
});
