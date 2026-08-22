import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

function cleanMapEmbedUrl(urlOrIframe?: string): string {
  if (!urlOrIframe) return '';
  const trimmed = urlOrIframe.trim();
  // Check if user pasted full <iframe ... src="..." ...></iframe>
  const srcMatch = trimmed.match(/src=["']([^"']+)["']/i);
  if (srcMatch && srcMatch[1]) {
    return srcMatch[1];
  }
  return trimmed;
}

@Injectable()
export class ContactService {
  constructor(private prisma: PrismaService) {}

  async getContactInfo() {
    const info = await this.prisma.contactInfo.findFirst();
    if (info) {
      // If locations / phones / emails / officeHoursList are not yet set in DB, synthesize fallback arrays
      let locations = info.locations;
      if (!locations) {
        const defaultLocs = [
          {
            id: 'loc-1',
            title: 'Main Campus',
            titleLa: 'ວິທະຍາເຂດຫຼັກ',
            address:
              info.address ||
              'Building 123, Russian Federation Boulevard (110), Sangkat Teuk Thla, Khan Sen Sok, Phnom Penh, Kingdom of Cambodia',
            addressLa:
              info.addressLa ||
              'ອາຄານ 123, ຖະໜົນນະວັດຕະກຳ, ນະຄອນຫຼວງວຽງຈັນ, ສປປ ລາວ',
            isPrimary: true,
          },
        ];
        locations = JSON.stringify(defaultLocs);
      }

      let phones = info.phones;
      if (!phones) {
        const rawPhones = (info.phone || '+856 21 123 456 / +856 20 555 1234')
          .split('/')
          .map((p) => p.trim())
          .filter(Boolean);

        const defaultPhones = rawPhones.map((num, idx) => ({
          id: `phone-${idx + 1}`,
          number: num,
          label: idx === 0 ? 'General Inquiries' : 'Admissions Hotline',
          labelLa: idx === 0 ? 'ສອບຖາມທົ່ວໄປ' : 'ສາຍດ່ວນຮັບສະໝັກ',
          isPrimary: idx === 0,
        }));
        phones = JSON.stringify(defaultPhones);
      }

      let emails = info.emails;
      if (!emails) {
        const rawEmails = (info.email || 'info@sit.edu.la / admissions@sit.edu.la')
          .split('/')
          .map((e) => e.trim())
          .filter(Boolean);

        const defaultEmails = rawEmails.map((em, idx) => ({
          id: `email-${idx + 1}`,
          email: em,
          label: idx === 0 ? 'General Inquiries' : 'Admissions Office',
          labelLa: idx === 0 ? 'ສອບຖາມທົ່ວໄປ' : 'ຫ້ອງການຮັບສະໝັກ',
          isPrimary: idx === 0,
        }));
        emails = JSON.stringify(defaultEmails);
      }

      let officeHoursList = info.officeHoursList;
      if (!officeHoursList) {
        const defaultSchedules = [
          {
            id: 'oh-1',
            days: 'Monday - Friday',
            daysLa: 'ວັນຈັນ - ວັນສຸກ',
            hours: '8:00 AM - 5:00 PM',
            hoursLa: '8:00 ໂມງເຊົ້າ - 5:00 ໂມງແລງ',
            notes: 'Regular Working Hours',
            notesLa: 'ໂມງການປົກກະຕິ',
          },
          {
            id: 'oh-2',
            days: 'Saturday',
            daysLa: 'ວັນເສົາ',
            hours: '8:00 AM - 12:00 PM',
            hoursLa: '8:00 ໂມງເຊົ້າ - 12:00 ໂມງທ່ຽງ',
            notes: 'Weekend Support',
            notesLa: 'ການຊ່ວຍເຫຼືອທ້າຍອາທິດ',
          },
        ];
        officeHoursList = JSON.stringify(defaultSchedules);
      }

      return {
        ...info,
        locations,
        phones,
        emails,
        officeHoursList,
      };
    }

    const defaultLocs = [
      {
        id: 'loc-1',
        title: 'Main Campus',
        titleLa: 'ວິທະຍາເຂດຫຼັກ',
        address:
          'Building 123, Russian Federation Boulevard (110), Sangkat Teuk Thla, Khan Sen Sok, Phnom Penh, Kingdom of Cambodia',
        addressLa: 'ອາຄານ 123, ຖະໜົນນະວັດຕະກຳ, ນະຄອນຫຼວງວຽງຈັນ, ສປປ ລາວ',
        isPrimary: true,
      },
    ];

    const defaultPhones = [
      {
        id: 'phone-1',
        number: '+856 21 123 456',
        label: 'General Inquiries',
        labelLa: 'ສອບຖາມທົ່ວໄປ',
        isPrimary: true,
      },
      {
        id: 'phone-2',
        number: '+856 20 555 1234',
        label: 'Admissions Hotline',
        labelLa: 'ສາຍດ່ວນຮັບສະໝັກ',
        isPrimary: false,
      },
    ];

    const defaultEmails = [
      {
        id: 'email-1',
        email: 'info@sit.edu.la',
        label: 'General Inquiries',
        labelLa: 'ສອບຖາມທົ່ວໄປ',
        isPrimary: true,
      },
      {
        id: 'email-2',
        email: 'admissions@sit.edu.la',
        label: 'Admissions Office',
        labelLa: 'ຫ້ອງການຮັບສະໝັກ',
        isPrimary: false,
      },
    ];

    const defaultSchedules = [
      {
        id: 'oh-1',
        days: 'Monday - Friday',
        daysLa: 'ວັນຈັນ - ວັນສຸກ',
        hours: '8:00 AM - 5:00 PM',
        hoursLa: '8:00 ໂມງເຊົ້າ - 5:00 ໂມງແລງ',
        notes: 'Regular Working Hours',
        notesLa: 'ໂມງການປົກກະຕິ',
      },
      {
        id: 'oh-2',
        days: 'Saturday',
        daysLa: 'ວັນເສົາ',
        hours: '8:00 AM - 12:00 PM',
        hoursLa: '8:00 ໂມງເຊົ້າ - 12:00 ໂມງທ່ຽງ',
        notes: 'Weekend Support',
        notesLa: 'ການຊ່ວຍເຫຼືອທ້າຍອາທິດ',
      },
    ];

    return {
      address:
        'Building 123, Russian Federation Boulevard (110), Sangkat Teuk Thla, Khan Sen Sok, Phnom Penh, Kingdom of Cambodia',
      addressLa: 'ອາຄານ 123, ຖະໜົນນະວັດຕະກຳ, ນະຄອນຫຼວງວຽງຈັນ, ສປປ ລາວ',
      phone: '+856 21 123 456 / +856 20 555 1234',
      email: 'info@sit.edu.la / admissions@sit.edu.la',
      mapEmbedUrl:
        'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3794.7802457390835!2d102.6286178751789!3d17.98895818300444!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x312467e7bd8e66a5%3A0xf85c9af1fa1bea14!2sSoutsaka%20Institute%20of%20Technology!5e0!3m2!1sen!2sth!4v1787336679429!5m2!1sen!2sth',
      officeHours:
        'Monday - Friday: 8:00 AM - 5:00 PM, Saturday: 8:00 AM - 12:00 PM',
      officeHoursLa:
        'ວັນຈັນ - ວັນສຸກ: 8:00 ໂມງເຊົ້າ - 5:00 ໂມງແລງ, ວັນເສົາ: 8:00 ໂມງເຊົ້າ - 12:00 ໂມງທ່ຽງ',
      locations: JSON.stringify(defaultLocs),
      phones: JSON.stringify(defaultPhones),
      emails: JSON.stringify(defaultEmails),
      officeHoursList: JSON.stringify(defaultSchedules),
      socialLinks: JSON.stringify({
        facebook: 'https://facebook.com/situniversity',
        twitter: 'https://twitter.com/situniversity',
        instagram: 'https://instagram.com/situniversity',
        linkedin: 'https://linkedin.com/school/situniversity',
        youtube: 'https://youtube.com/@situniversity',
        tiktok: 'https://tiktok.com/@situniversity',
        telegram: 'https://t.me/situniversity',
        whatsapp: '',
      }),
    };
  }

  async updateContactInfo(data: any) {
    const info = await this.prisma.contactInfo.findFirst();

    // Stringify array/object fields if passed as array or object
    const locations =
      data.locations !== undefined
        ? typeof data.locations === 'string'
          ? data.locations
          : JSON.stringify(data.locations || [])
        : undefined;

    const phones =
      data.phones !== undefined
        ? typeof data.phones === 'string'
          ? data.phones
          : JSON.stringify(data.phones || [])
        : undefined;

    const emails =
      data.emails !== undefined
        ? typeof data.emails === 'string'
          ? data.emails
          : JSON.stringify(data.emails || [])
        : undefined;

    const officeHoursList =
      data.officeHoursList !== undefined
        ? typeof data.officeHoursList === 'string'
          ? data.officeHoursList
          : JSON.stringify(data.officeHoursList || [])
        : undefined;

    const socialLinks =
      data.socialLinks !== undefined
        ? typeof data.socialLinks === 'string'
          ? data.socialLinks
          : JSON.stringify(data.socialLinks || {})
        : undefined;

    const mapEmbedUrl =
      data.mapEmbedUrl !== undefined
        ? cleanMapEmbedUrl(data.mapEmbedUrl)
        : undefined;

    // Synchronize legacy address/phone/email/officeHours if arrays provided
    let syncAddress = data.address;
    let syncAddressLa = data.addressLa;
    if (locations !== undefined && !data.address) {
      try {
        const parsedLocs = JSON.parse(locations);
        if (Array.isArray(parsedLocs) && parsedLocs.length > 0) {
          const primaryLoc = parsedLocs.find((l: any) => l.isPrimary) || parsedLocs[0];
          syncAddress = primaryLoc.address || syncAddress;
          syncAddressLa = primaryLoc.addressLa || syncAddressLa;
        }
      } catch (e) {}
    }

    let syncPhone = data.phone;
    if (phones !== undefined && !data.phone) {
      try {
        const parsedPhones = JSON.parse(phones);
        if (Array.isArray(parsedPhones) && parsedPhones.length > 0) {
          syncPhone = parsedPhones.map((p: any) => p.number).filter(Boolean).join(' / ');
        }
      } catch (e) {}
    }

    let syncEmail = data.email;
    if (emails !== undefined && !data.email) {
      try {
        const parsedEmails = JSON.parse(emails);
        if (Array.isArray(parsedEmails) && parsedEmails.length > 0) {
          syncEmail = parsedEmails.map((e: any) => e.email).filter(Boolean).join(' / ');
        }
      } catch (e) {}
    }

    let syncOfficeHours = data.officeHours;
    let syncOfficeHoursLa = data.officeHoursLa;
    if (officeHoursList !== undefined && !data.officeHours) {
      try {
        const parsedSchedules = JSON.parse(officeHoursList);
        if (Array.isArray(parsedSchedules) && parsedSchedules.length > 0) {
          syncOfficeHours = parsedSchedules
            .map((s: any) => `${s.days}: ${s.hours}`)
            .join(', ');
          syncOfficeHoursLa = parsedSchedules
            .map((s: any) => `${s.daysLa || s.days}: ${s.hoursLa || s.hours}`)
            .join(', ');
        }
      } catch (e) {}
    }

    if (info) {
      return this.prisma.contactInfo.update({
        where: { id: info.id },
        data: {
          address: syncAddress !== undefined ? syncAddress : info.address,
          addressLa:
            syncAddressLa !== undefined ? syncAddressLa : info.addressLa,
          phone: syncPhone !== undefined ? syncPhone : info.phone,
          email: syncEmail !== undefined ? syncEmail : info.email,
          mapEmbedUrl:
            mapEmbedUrl !== undefined ? mapEmbedUrl : info.mapEmbedUrl,
          officeHours:
            syncOfficeHours !== undefined
              ? syncOfficeHours
              : info.officeHours,
          officeHoursLa:
            syncOfficeHoursLa !== undefined
              ? syncOfficeHoursLa
              : info.officeHoursLa,
          locations: locations !== undefined ? locations : info.locations,
          phones: phones !== undefined ? phones : info.phones,
          emails: emails !== undefined ? emails : info.emails,
          officeHoursList:
            officeHoursList !== undefined
              ? officeHoursList
              : info.officeHoursList,
          socialLinks:
            socialLinks !== undefined ? socialLinks : info.socialLinks,
        },
      });
    }

    return this.prisma.contactInfo.create({
      data: {
        address: syncAddress || '',
        addressLa: syncAddressLa || null,
        phone: syncPhone || '',
        email: syncEmail || '',
        mapEmbedUrl: mapEmbedUrl || '',
        officeHours: syncOfficeHours || '',
        officeHoursLa: syncOfficeHoursLa || null,
        locations: locations || '[]',
        phones: phones || '[]',
        emails: emails || '[]',
        officeHoursList: officeHoursList || '[]',
        socialLinks: socialLinks || '{}',
      },
    });
  }
}
