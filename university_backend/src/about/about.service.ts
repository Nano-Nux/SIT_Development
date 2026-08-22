import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AboutService {
  constructor(private prisma: PrismaService) {}

  // Founder
  async getFounder() {
    const founder = await this.prisma.founder.findFirst();
    return founder || {
      name: 'Oknha Dr. Mengly J. Quach',
      nameLa: 'ທ່ານ ດຣ. ມັງລີ ເຈ. ກວັກ',
      designation: 'Founder, Chairman and CEO',
      designationLa: 'ຜູ້ກໍ່ຕັ້ງ, ປະທານສະພາ ແລະ ປະທານເຈົ້າໜ້າທີ່ບໍລິຫານ',
      quote: 'Education is the most powerful weapon which you can use to change the world.',
      quoteLa: 'ການສຶກສາແມ່ນອາວຸດທີ່ຊົງພະລັງທີ່ສຸດທີ່ທ່ານສາມາດໃຊ້ເພື່ອປ່ຽນແປງໂລກ.',
      biography: 'A prominent educational visionary and philanthropist dedicated to modernizing higher education.',
      biographyLa: 'ນັກວິໄສທັດດ້ານການສຶກສາທີ່ພົ້ນເດັ່ນ ແລະ ຜູ້ອຸທິດຕົນເພື່ອການຍົກລະດັບການສຶກສາຊັ້ນສູງ.',
      imageUrl: '/images/about_desktopview/img_1.png',
    };
  }

  async updateFounder(data: any) {
    const founder = await this.prisma.founder.findFirst();
    if (founder) {
      return this.prisma.founder.update({
        where: { id: founder.id },
        data: {
          name: data.name,
          nameLa: data.nameLa,
          designation: data.designation,
          designationLa: data.designationLa,
          quote: data.quote,
          quoteLa: data.quoteLa,
          biography: data.biography,
          biographyLa: data.biographyLa,
          imageUrl: data.imageUrl,
        },
      });
    }
    return this.prisma.founder.create({
      data: {
        name: data.name || 'Founder Name',
        nameLa: data.nameLa,
        designation: data.designation || 'Founder & President',
        designationLa: data.designationLa,
        quote: data.quote || '',
        quoteLa: data.quoteLa,
        biography: data.biography || '',
        biographyLa: data.biographyLa,
        imageUrl: data.imageUrl || '',
      },
    });
  }

  // Vision & Mission
  async getVisionMission() {
    const vm = await this.prisma.visionMission.findFirst();
    return vm || {
      vision: 'To be a premier global center of academic excellence and transformative innovation.',
      visionLa: 'ເປັນສູນກາງຊັ້ນນຳລະດັບໂລກແຫ່ງຄວາມເປັນເລີດທາງວິຊາການ ແລະ ນະວັດຕະກຳ.',
      mission: 'Nurturing innovative leaders through world-class education, cutting-edge research, and industry collaboration.',
      missionLa: 'ສ້າງຜູ້ນຳທີ່ມີຫົວຄິດປະດິດສ້າງຜ່ານການສຶກສາລະດັບໂລກ, ການວິໄຈທີ່ທັນສະໄໝ ແລະ ການຮ່ວມມືກັບພາກທຸລະກິດ.',
      corePillars: JSON.stringify(['Excellence', 'Innovation', 'Integrity', 'Global Leadership']),
      corePillarsLa: JSON.stringify(['ຄວາມເປັນເລີດ', 'ນະວັດຕະກຳ', 'ຄວາມຊື່ສັດ', 'ຄວາມເປັນຜູ້ນຳລະດັບສາກົນ']),
    };
  }

  async updateVisionMission(data: any) {
    const vm = await this.prisma.visionMission.findFirst();
    const corePillars = typeof data.corePillars === 'string'
      ? data.corePillars
      : JSON.stringify(data.corePillars || []);
    const corePillarsLa = data.corePillarsLa !== undefined
      ? (typeof data.corePillarsLa === 'string' ? data.corePillarsLa : JSON.stringify(data.corePillarsLa))
      : undefined;

    if (vm) {
      return this.prisma.visionMission.update({
        where: { id: vm.id },
        data: {
          vision: data.vision,
          visionLa: data.visionLa,
          mission: data.mission,
          missionLa: data.missionLa,
          corePillars,
          corePillarsLa,
        },
      });
    }
    return this.prisma.visionMission.create({
      data: {
        vision: data.vision || '',
        visionLa: data.visionLa,
        mission: data.mission || '',
        missionLa: data.missionLa,
        corePillars,
        corePillarsLa,
      },
    });
  }

  // Members
  async getMembers(category?: string) {
    const where: any = {};
    if (category) where.category = category;
    return this.prisma.member.findMany({
      where,
      orderBy: { order: 'asc' },
    });
  }

  async getMember(id: string) {
    const member = await this.prisma.member.findUnique({ where: { id } });
    if (!member) throw new NotFoundException('Member not found');
    return member;
  }

  async createMember(data: any) {
    return this.prisma.member.create({
      data: {
        name: data.name,
        nameLa: data.nameLa,
        position: data.position,
        positionLa: data.positionLa,
        category: data.category || 'Board of Trustees',
        categoryLa: data.categoryLa,
        biography: data.biography || '',
        biographyLa: data.biographyLa,
        imageUrl: data.imageUrl,
        order: data.order !== undefined ? Number(data.order) : 0,
      },
    });
  }

  async updateMember(id: string, data: any) {
    await this.getMember(id);
    return this.prisma.member.update({
      where: { id },
      data: {
        name: data.name,
        nameLa: data.nameLa,
        position: data.position,
        positionLa: data.positionLa,
        category: data.category,
        categoryLa: data.categoryLa,
        biography: data.biography,
        biographyLa: data.biographyLa,
        imageUrl: data.imageUrl,
        order: data.order !== undefined ? Number(data.order) : undefined,
      },
    });
  }

  async deleteMember(id: string) {
    await this.getMember(id);
    await this.prisma.member.delete({ where: { id } });
    return { success: true, message: 'Member deleted' };
  }

  async reorderMembers(items: { id: string; order: number }[]) {
    await this.prisma.$transaction(
      items.map(item =>
        this.prisma.member.update({
          where: { id: item.id },
          data: { order: item.order },
        }),
      ),
    );
    return { success: true, message: 'Members reordered' };
  }

  // History
  async getHistory() {
    return this.prisma.history.findMany({
      orderBy: { order: 'asc' },
    });
  }

  async createHistory(data: any) {
    return this.prisma.history.create({
      data: {
        year: String(data.year),
        title: data.title,
        titleLa: data.titleLa,
        description: data.description,
        descriptionLa: data.descriptionLa,
        order: data.order !== undefined ? Number(data.order) : 0,
      },
    });
  }

  async updateHistory(id: string, data: any) {
    return this.prisma.history.update({
      where: { id },
      data: {
        year: data.year !== undefined ? String(data.year) : undefined,
        title: data.title,
        titleLa: data.titleLa,
        description: data.description,
        descriptionLa: data.descriptionLa,
        order: data.order !== undefined ? Number(data.order) : undefined,
      },
    });
  }

  async deleteHistory(id: string) {
    await this.prisma.history.delete({ where: { id } });
    return { success: true, message: 'History entry deleted' };
  }
}
