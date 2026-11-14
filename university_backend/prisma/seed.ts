import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting SIT University database seeding...');

  // 1. Admin Account from .env
  const adminEmail = (process.env.ADMIN_EMAIL || 'admin@sit.edu.la')
    .toLowerCase()
    .trim();
  const adminPassword = process.env.ADMIN_PASSWORD || 'AdminSecure2026!';
  const adminName = process.env.ADMIN_NAME || 'SIT Super Admin';

  // Remove legacy demo account
  if (adminEmail !== 'admin@sit.edu.kh') {
    await prisma.admin.deleteMany({ where: { email: 'admin@sit.edu.kh' } });
  }

  const passwordHash = await bcrypt.hash(adminPassword, 10);
  const admin = await prisma.admin.upsert({
    where: { email: adminEmail },
    update: { passwordHash, name: adminName, role: 'SUPER_ADMIN' },
    create: {
      email: adminEmail,
      passwordHash,
      name: adminName,
      role: 'SUPER_ADMIN',
    },
  });
  console.log('✅ Admin user created/synced:', admin.email);

  // 2. Hero Sections
  const heroes = [
    {
      page: 'HOME',
      title: 'Shaping Future Leaders Through Innovation & Excellence',
      titleZh: '以创新与卓越培养未来领导者',
      titleLa: 'ສ້າງຜູ້ນຳແຫ່ງອະນາຄົດຜ່ານນະວັດຕະກຳ ແລະ ຄວາມເປັນເລີດ',
      subtitle: 'WELCOME TO SIT UNIVERSITY',
      subtitleZh: '欢迎来到 SIT',
      subtitleLa: 'ຍິນດີຕ້ອນຮັບສູ່ ມະຫາວິທະຍາໄລ SIT',
      description:
        'Empowering students with world-class education, practical industry mastery, state-of-the-art research laboratories, and global career opportunities.',
      descriptionZh:
        '通过优质教育、行业实践、先进研究实验室和全球职业机会，助力学生成长。',
      descriptionLa:
        'ສ້າງຄວາມເຂັ້ມແຂງໃຫ້ນັກສຶກສາດ້ວຍການສຶກສາລະດັບໂລກ, ຄວາມຊຳນານໃນພາກປະຕິບັດ, ຫ້ອງທົດລອງວິໄຈທີ່ທັນສະໄໝ ແລະ ໂອກາດໃນອາຊີບລະດັບສາກົນ.',
      buttonText: 'Explore Programs',
      buttonTextZh: '探索课程',
      buttonTextLa: 'ສຳຫຼວດຫຼັກສູດ',
      buttonUrl: '/academics',
      imageUrl: '/images/home_desktopview/img_1.jpg',
      image2Url: '/images/home_desktopview/img_1.jpg',
      image3Url: '/images/home_desktopview/img_2.jpg',
      image4Url: '/images/home_desktopview/img_1.jpg',
    },
    {
      page: 'ADMISSIONS',
      title: 'WELCOME TO SIT ADMISSIONS',
      titleZh: '欢迎了解 SIT 招生',
      titleLa: 'ຍິນດີຕ້ອນຮັບສູ່ ການຮັບສະໝັກນັກສຶກສາ SIT',
      subtitle: 'ADMISSIONS 2026-2027',
      subtitleZh: '2026–2027学年招生',
      subtitleLa: 'ການຮັບສະໝັກນັກສຶກສາ 2026-2027',
      description:
        'Admissions at SIT is designed with our student — you — in mind. That is why our process is simple, thoughtful, and grants you a lot of space for self-expression. We are not a university of the privileged, but indeed a university of talents.',
      descriptionZh:
        'SIT 招生以学生为中心，流程简洁周到，给予你充分的自我展示空间。我们欢迎拥有才华的学生。',
      descriptionLa:
        'ການຮັບສະໝັກທີ່ SIT ຖືກອອກແບບໂດຍຄຳນຶງເຖິງນັກສຶກສາ — ຕົວທ່ານ — ເປັນຫຼັກ. ດັ່ງນັ້ນ ຂະບວນການຂອງພວກເຮົາຈຶ່ງງ່າຍດາຍ, ເອົາໃຈໃສ່ ແລະ ເປີດໂອກາດໃຫ້ທ່ານໄດ້ສະແດງຄວາມສາມາດຢ່າງເຕັມທີ່. ພວກເຮົາບໍ່ແມ່ນມະຫາວິທະຍາໄລສຳລັບຄົນພິເສດ, ແຕ່ແມ່ນມະຫາວິທະຍາໄລສຳລັບຜູ້ມີຄວາມສາມາດ.',
      buttonText: 'Apply Now',
      buttonTextZh: '立即申请',
      buttonTextLa: 'ເລີ່ມຕົ້ນການສະໝັກ',
      buttonUrl: '/apply',
      imageUrl: '/images/home_desktopview/img_1.jpg',
    },
    {
      page: 'ABOUT',
      title: 'About Us',
      titleZh: '关于我们',
      titleLa: 'ກ່ຽວກັບພວກເຮົາ',
      subtitle: 'DISCOVER SIT',
      subtitleZh: '认识 SIT',
      subtitleLa: 'ຄົ້ນພົບ SIT',
      description:
        'Building the future of Laos through excellence in technology, innovation, and leadership.',
      descriptionZh: '以卓越的技术教育、创新与领导力建设老挝的未来。',
      descriptionLa:
        'ສ້າງອະນາຄົດຂອງປະເທດລາວ ຜ່ານຄວາມເປັນເລີດທາງເຕັກໂນໂລຊີ, ນະວັດຕະກຳ ແລະ ຄວາມເປັນຜູ້ນຳ.',
      buttonText: 'Meet Leadership',
      buttonTextZh: '认识领导团队',
      buttonTextLa: 'ພົບກັບຄະນະຜູ້ບໍລິຫານ',
      buttonUrl: '/about#members',
      imageUrl: '/images/about_desktopview/img_1.jpg',
    },
    {
      page: 'ACADEMICS',
      title: 'Academic Programs at SIT',
      titleZh: 'SIT 学术课程',
      titleLa: 'ຫຼັກສູດວິຊາການ ທີ່ SIT',
      subtitle: 'EXCELLENCE IN EDUCATION',
      subtitleZh: '卓越教育',
      subtitleLa: 'ຄວາມເປັນເລີດທາງວິຊາການ',
      description:
        'Innovative curriculum blending rigorous academic foundations with hands-on project labs, international exchange, and direct corporate mentorship.',
      descriptionZh:
        '创新课程融合扎实的学术基础、实践项目实验室、国际交流与企业导师指导。',
      descriptionLa:
        'ຫຼັກສູດນະວັດຕະກຳທີ່ປະສົມປະສານພື້ນຖານວິຊາການອັນເຂັ້ມງວດ ເຂົ້າກັບຫ້ອງປະຕິບັດການຕົວຈິງ, ການແລກປ່ຽນສາກົນ ແລະ ການແນະນຳຈາກພາກທຸລະກິດ.',
      buttonText: 'Our Departments',
      buttonTextZh: '我们的院系',
      buttonTextLa: 'ພາກວິຊາຂອງພວກເຮົາ',
      buttonUrl: '/academics#departments',
      imageUrl: '/images/academics_desktopview/img_1.jpg',
    },
    {
      page: 'LIFE_AT_SIT',
      title: 'Life at SIT',
      titleZh: 'SIT 校园生活',
      titleLa: 'ຊີວິດໃນ SIT',
      subtitle: 'VIBRANT COMMUNITY',
      subtitleZh: '活力社区',
      subtitleLa: 'ຊຸມຊົນທີ່ມີຊີວິດຊີວາ',
      description:
        'More than just classrooms. Experience a vibrant ecosystem of culture, creativity, and connection where every day is an opportunity to grow.',
      descriptionZh:
        '不止于课堂。在文化、创意与交流交织的校园里，每天都有成长的机会。',
      descriptionLa:
        'ຫຼາຍກວ່າຫ້ອງຮຽນ. ສຳຜັດກັບລະບົບນິເວດທີ່ມີຊີວິດຊີວາຂອງວັດທະນະທຳ, ຄວາມຄິດສ້າງສັນ ແລະ ການເຊື່ອມຕໍ່ ບ່ອນທີ່ທຸກມື້ແມ່ນໂອກາດໃນການເຕີບໃຫຍ່.',
      buttonText: 'Explore Clubs',
      buttonTextZh: '探索社团',
      buttonTextLa: 'ສຳຫຼວດຊົມຮົມ',
      buttonUrl: '/life-at-sit#activities',
      imageUrl: '/images/life_at_sit_desktopview/img_1.jpg',
    },
    {
      page: 'COLLABORATIONS',
      title: 'Collaboration with SIT',
      titleZh: '与 SIT 合作',
      titleLa: 'ການຮ່ວມມືກັບ SIT',
      subtitle: 'GLOBAL REACH',
      subtitleZh: '全球交流',
      subtitleLa: 'ການເຊື່ອມໂຍງລະດັບໂລກ',
      description:
        'Partnering with prestigious universities worldwide and Fortune 500 tech leaders to deliver international exchange, dual degrees, and direct hiring.',
      descriptionZh:
        '携手全球知名高校与世界500强科技企业，提供国际交流、双学位及直接招聘机会。',
      descriptionLa:
        'SIT ຮ່ວມມືຢ່າງໃກ້ຊິດກັບມະຫາວິທະຍາໄລຊັ້ນນຳທົ່ວໂລກ ເພື່ອມອບໂອກາດແລກປ່ຽນສາກົນ, ຫຼັກສູດສອງປະລິນຍາ ແລະ ໂຄງການຄົ້ນຄວ້າຮ່ວມກັນໃຫ້ນັກສຶກສາ.',
      buttonText: 'Discover Partners',
      buttonTextZh: '探索合作伙伴',
      buttonTextLa: 'ຄົ້ນພົບພັນທະມິດ',
      buttonUrl: '/collaborations#partners',
      imageUrl: '/images/collaborations_desktopview/img_1.jpg',
    },
  ];

  for (const h of heroes) {
    await prisma.hero.upsert({
      where: { page: h.page },
      update: h,
      create: h,
    });
  }
  console.log('✅ Hero sections seeded');

  // 3. Core Values
  await prisma.coreValue.deleteMany();
  await prisma.coreValue.createMany({
    data: [
      {
        title: 'Innovation',
        titleZh: '创新',
        titleLa: 'ນະວັດຕະກຳ',
        description:
          'We foster creativity and forward-thinking approaches to solve complex challenges facing our world.',
        descriptionZh: '我们鼓励创造力与前瞻思维，应对世界面临的复杂挑战。',
        descriptionLa:
          'ພວກເຮົາສົ່ງເສີມຄວາມຄິດສ້າງສັນ ແລະ ວິທີການຄິດໄປຂ້າງໜ້າ ເພື່ອແກ້ໄຂສິ່ງທ້າທາຍທີ່ຊັບຊ້ອນຂອງໂລກ.',
        icon: 'Lightbulb',
        order: 1,
        isActive: true,
      },
      {
        title: 'Inclusivity',
        titleZh: '包容',
        titleLa: 'ຄວາມທົ່ວເຖິງ',
        description:
          'We celebrate diversity and ensure equal opportunities for all students regardless of background.',
        descriptionZh: '我们尊重多样性，为所有背景的学生提供平等机会。',
        descriptionLa:
          'ພວກເຮົາສະເຫຼີມສະຫຼອງຄວາມຫຼາກຫຼາຍ ແລະ ຮັບປະກັນໂອກາດທີ່ເທົ່າທຽມສຳລັບນັກສຶກສາທຸກຄົນ.',
        icon: 'Users',
        order: 2,
        isActive: true,
      },
      {
        title: 'Excellence',
        titleZh: '卓越',
        titleLa: 'ຄວາມເປັນເລີດ',
        description:
          'We pursue the highest standards in teaching, research, and student achievement.',
        descriptionZh: '我们在教学、研究和学生成就方面追求最高标准。',
        descriptionLa:
          'ພວກເຮົາມຸ່ງໝັ້ນສູ່ມາດຕະຖານສູງສຸດໃນການຮຽນການສອນ, ການວິໄຈ ແລະ ຜົນສຳເລັດຂອງນັກສຶກສາ.',
        icon: 'Award',
        order: 3,
        isActive: true,
      },
      {
        title: 'Integrity',
        titleZh: '诚信',
        titleLa: 'ຄວາມຊື່ສັດ & ຈັນຍາບັນ',
        description:
          'We uphold honesty, transparency, and ethical conduct in all our endeavors.',
        descriptionZh: '我们在所有工作中坚持诚实、透明与道德行为。',
        descriptionLa:
          'ພວກເຮົາຍຶດໝັ້ນຄວາມຊື່ສັດ, ຄວາມໂປ່ງໃສ ແລະ ຄວາມປະພຶດທີ່ຖືກຕ້ອງຕາມຈັນຍາບັນ.',
        icon: 'Shield',
        order: 4,
        isActive: true,
      },
      {
        title: 'Global Citizenship',
        titleZh: '全球公民意识',
        titleLa: 'ຄວາມເປັນພົນລະເມືອງໂລກ',
        description:
          'We prepare students to think globally while acting locally to create positive impact.',
        descriptionZh: '我们培养学生以全球视野思考，以本地行动创造积极影响。',
        descriptionLa:
          'ພວກເຮົາກຽມຄວາມພ້ອມໃຫ້ນັກສຶກສາຄິດໃນລະດັບສາກົນ ພ້ອມທັງລົງມືປະຕິບັດໃນລະດັບທ້ອງຖິ່ນເພື່ອສ້າງຜົນກະທົບທາງບວກ.',
        icon: 'Globe',
        order: 5,
        isActive: true,
      },
      {
        title: 'Sustainability',
        titleZh: '可持续发展',
        titleLa: 'ຄວາມຍືນຍົງ',
        description:
          'We commit to practices that ensure environmental and social responsibility for future generations.',
        descriptionZh: '我们承诺践行对环境与社会负责的行动，造福未来世代。',
        descriptionLa:
          'ພວກເຮົາຍຶດໝັ້ນໃນການປະຕິບັດທີ່ຮັບປະກັນຄວາມຮັບຜິດຊອບຕໍ່ສິ່ງແວດລ້ອມ ແລະ ສັງຄົມ.',
        icon: 'Rocket',
        order: 6,
        isActive: true,
      },
    ],
  });
  console.log('✅ Core values seeded');

  // 4. Majors
  await prisma.major.deleteMany();
  await prisma.major.createMany({
    data: [
      {
        title: 'Information Technology',
        titleZh: '信息技术',
        slug: 'information-technology',
        description:
          'Master software engineering, cloud computing, cyber defense, and artificial intelligence with hands-on lab environments.',
        descriptionZh:
          '通过实验室实践掌握软件工程、云计算、网络防御与人工智能。',
        imageUrl: '/images/home_desktopview/img_2.jpg',
        order: 1,
        isActive: true,
      },
      {
        title: 'Business Administration & Economics',
        titleZh: '工商管理与经济',
        slug: 'business-administration-economics',
        description:
          'Gain strategic business acumen, international financial mastery, entrepreneurial leadership, and econometric analysis skills.',
        descriptionZh:
          '培养战略商业洞察、国际金融能力、创业领导力与计量经济分析技能。',
        imageUrl: '/images/home_desktopview/img_3.jpg',
        order: 2,
        isActive: true,
      },
      {
        title: 'Communication Arts',
        titleZh: '传播艺术',
        slug: 'communication-arts',
        description:
          'Excel in digital media production, public relations, strategic corporate storytelling, and creative multimedia design.',
        descriptionZh:
          '学习数字媒体制作、公共关系、企业战略叙事与创意多媒体设计。',
        imageUrl: '/images/home_desktopview/img_4.jpg',
        order: 3,
        isActive: true,
      },
    ],
  });
  console.log('✅ Majors seeded');

  // 5. Departments & Majors (Unified)
  await prisma.programDirector.deleteMany();
  await prisma.program.deleteMany();
  await prisma.faculty.deleteMany();
  await prisma.department.deleteMany();

  const deptIT = await prisma.department.create({
    data: {
      name: 'Department of Information Technology',
      nameZh: '信息技术系',
      nameLa: 'ພາກວິຊາເຕັກໂນໂລຊີຂໍ້ມູນຂ່າວສານ',
      slug: 'it',
      description:
        'The Bachelor of Computer Science (Computer Programming) undergraduate program is designed to equip students with both theoretical knowledge and practical skills in modern computing.',
      descriptionZh:
        '计算机科学（计算机编程）本科课程旨在培养学生的现代计算理论知识与实践技能。',
      descriptionLa:
        'ຫຼັກສູດປະລິນຍາຕີວິທະຍາສາດຄອມພິວເຕີ ຖືກອອກແບບມາເພື່ອສ້າງນັກສຶກສາໃຫ້ມີຄວາມຮູ້ດ້ານທິດສະດີ ແລະ ທັກສະການປະຕິບັດຕົວຈິງໃນຍຸກຄອມພິວເຕີທີ່ທັນສະໄໝ.',
      heroImage: '/images/department_it_desktopview/img_1.jpg',
      imageUrl: '/images/home_desktopview/img_2.jpg',
      order: 1,
      isActive: true,
      // Field 3: box-description (15 programming languages, 8 specialized labs, 95% job placement, 40+ industry partners)
      boxDescriptions: JSON.stringify([
        { value: '15+', label: 'PROGRAMMING LANGUAGES' },
        { value: '8', label: 'SPECIALIZED LABS' },
        { value: '95%', label: 'JOB PLACEMENT' },
        { value: '40+', label: 'INDUSTRY PARTNERS' },
      ]),
      boxDescriptionsZh: JSON.stringify([
        { value: '15+', label: '编程语言' },
        { value: '8', label: '专业实验室' },
        { value: '95%', label: '就业率' },
        { value: '40+', label: '行业合作伙伴' },
      ]),
      boxDescriptionsLa: JSON.stringify([
        { value: '15+', label: 'ພາສາການຂຽນໂປຣແກຣມ' },
        { value: '8', label: 'ຫ້ອງທົດລອງສະເພາະດ້ານ' },
        { value: '95%', label: 'ອັດຕາການໄດ້ຮັບວຽກເຮັດ' },
        { value: '40+', label: 'ຄູ່ຮ່ວມງານພາກອຸດສາຫະກຳ' },
      ]),
      // Field 4: Core Focus Areas
      coreFocusAreas: JSON.stringify([
        'Software Development',
        'Web & Mobile Apps',
        'Cybersecurity',
        'Cloud Computing',
        'AI & Machine Learning',
        'Data Science',
        'DevOps',
        'IoT Systems',
        'Blockchain',
        'Network Architecture',
        'UX/UI Design',
        'Database Systems',
      ]),
      coreFocusAreasZh: JSON.stringify([
        '软件开发',
        '网页与移动应用',
        '网络安全',
        '云计算',
        '人工智能与机器学习',
        '数据科学',
        '开发运维',
        '物联网系统',
        '区块链',
        '网络架构',
        '用户体验与界面设计',
        '数据库系统',
      ]),
      coreFocusAreasLa: JSON.stringify([
        'ການພັດທະນາຊອບແວ',
        'ແອັບເວັບ ແລະ ມືຖື',
        'ຄວາມປອດໄພທາງໄຊເບີ',
        'ລະບົບຄລາວ',
        'ປັນຍາປະດິດ & ML',
        'ວິທະຍາສາດຂໍ້ມູນ',
        'DevOps & CI/CD',
        'ລະບົບ IoT',
        'ເທັກໂນໂລຢີ ບລັອກເຊນ',
        'ສະຖາປັດຕະຍະກຳເຄືອຂ່າຍ',
        'ການອອກແບບ UX/UI',
        'ລະບົບຖານຂໍ້ມູນ',
      ]),
      // Field 5: Career Outcome Description
      careerOutcomeDesc:
        "Our graduates are highly sought after by top tech companies worldwide. Here's where your IT degree from SIT can take you.",
      careerOutcomeDescZh:
        '我们的毕业生深受全球优秀科技企业青睐。探索 SIT 信息技术学位为你开启的职业方向。',
      careerOutcomeDescLa:
        'ນັກສຶກສາທີ່ຈົບການສຶກສາຈາກພວກເຮົາແມ່ນເປັນທີ່ຕ້ອງການສູງຈາກບໍລິສັດເຕັກໂນໂລຊີຊັ້ນນຳທົ່ວໂລກ. ນີ້ຄືເສັ້ນທາງອາຊີບທີ່ປະລິນຍາໄອທີຈາກ SIT ຈະນຳພາທ່ານໄປ.',
      // Field 6: Career Outcomes Boxes
      careerPlacementRate: '95%',
      careerPlacementRateZh: '95%',
      careerPlacementRateLa: '95%',
      careerAvgSalary: '$92K',
      careerAvgSalaryZh: '$92K',
      careerAvgSalaryLa: '$92K',
      careerPartnerCompanies: '200+',
      careerPartnerCompaniesZh: '200+',
      careerPartnerCompaniesLa: '200+',
      careerTimeToEmployment: '3 Months',
      careerTimeToEmploymentZh: '3个月',
      careerTimeToEmploymentLa: '3 ເດືອນ',
    },
  });

  const deptBA = await prisma.department.create({
    data: {
      name: 'Department of Business Administration & Economics',
      nameZh: '工商管理与经济系',
      nameLa: 'ພາກວິຊາບໍລິຫານທຸລະກິດ ແລະ ເສດຖະສາດ',
      slug: 'ba-economics',
      description:
        'Equipping future business titans, financial strategists, and innovative entrepreneurs with cutting-edge analytics, global market insights, and sustainable leadership practices.',
      descriptionZh:
        '以先进分析方法、全球市场洞察与可持续领导力实践，培养未来商业领袖、金融战略人才与创新创业者。',
      descriptionLa:
        'ສ້າງຜູ້ນຳທຸລະກິດ, ນັກຍຸດທະສາດການເງິນ ແລະ ຜູ້ປະກອບການລຸ້ນໃໝ່ ດ້ວຍການວິເຄາະທີ່ທັນສະໄໝ, ຄວາມເຂົ້າໃຈຕະຫຼາດໂລກ ແລະ ຄວາມເປັນຜູ້ນຳແບບຍືນຍົງ.',
      heroImage: '/images/department_ba___economics_desktopview/img_1.jpg',
      imageUrl: '/images/home_desktopview/img_3.jpg',
      order: 2,
      isActive: true,
      // Field 3: box-description is optional (left null for non-CS)
      boxDescriptions: null,
      boxDescriptionsZh: null,
      boxDescriptionsLa: null,
      // Field 4: Core Focus Areas
      coreFocusAreas: JSON.stringify([
        'International Finance',
        'Strategic Management',
        'Global Marketing',
        'Entrepreneurship',
        'Applied Econometrics',
        'Supply Chain & Logistics',
      ]),
      coreFocusAreasZh: JSON.stringify([
        '国际金融',
        '战略管理',
        '全球营销',
        '创业',
        '应用计量经济学',
        '供应链与物流',
      ]),
      coreFocusAreasLa: JSON.stringify([
        'ການເງິນສາກົນ',
        'ການຄຸ້ມຄອງຍຸດທະສາດ',
        'ການຕະຫຼາດລະດັບໂລກ',
        'ການເປັນຜູ້ປະກອບການ',
        'ເສດຖະມິຕິປະຍຸກ',
        'ລະບົບໂລຈິສຕິກສ໌',
      ]),
      // Field 5: Career Outcome Description
      careerOutcomeDesc:
        'Graduates excel across multinational corporations, investment funds, fintech ventures, and consulting firms globally.',
      careerOutcomeDescZh:
        '毕业生在全球跨国公司、投资基金、金融科技企业及咨询机构中表现出色。',
      careerOutcomeDescLa:
        'ນັກສຶກສາທີ່ຈົບການສຶກສາປະສົບຜົນສຳເລັດໃນບໍລິສັດຂ້າມຊາດ, ກອງທຶນການລົງທຶນ, ທຸລະກິດຟິນເທັກ ແລະ ບໍລິສັດທີ່ປຶກສາທົ່ວໂລກ.',
      // Field 6: Career Outcomes Boxes
      careerPlacementRate: '94%',
      careerPlacementRateZh: '94%',
      careerPlacementRateLa: '94%',
      careerAvgSalary: '$78K',
      careerAvgSalaryZh: '$78K',
      careerAvgSalaryLa: '$78K',
      careerPartnerCompanies: '150+',
      careerPartnerCompaniesZh: '150+',
      careerPartnerCompaniesLa: '150+',
      careerTimeToEmployment: '4 Months',
      careerTimeToEmploymentZh: '4 Months',
      careerTimeToEmploymentLa: '4 ເດືອນ',
    },
  });

  const deptCA = await prisma.department.create({
    data: {
      name: 'Department of Communication Arts',
      nameZh: '传播艺术系',
      nameLa: 'ພາກວິຊານິເທດສາດ ແລະ ສິລະປະການສື່ສານ',
      slug: 'communication-arts',
      description:
        'Fostering innovative media creators, PR experts, and brand communicators equipped with state-of-the-art digital broadcast studios and storytelling expertise.',
      descriptionZh:
        '依托先进数字广播工作室和叙事教学，培养创新媒体创作者、公关专家与品牌传播人才。',
      descriptionLa:
        'ສ້າງຜູ້ສ້າງສັນສື່ລຸ້ນໃໝ່, ຊ່ຽວຊານດ້ານ PR ແລະ ນັກສື່ສານແບຣນ ດ້ວຍຫ້ອງສະຕູດິໂອດິຈິທັລທີ່ທັນສະໄໝ.',
      heroImage: '/images/department_communication_arts_desktopview/img_1.jpg',
      imageUrl: '/images/home_desktopview/img_4.jpg',
      order: 3,
      isActive: true,
      // Field 3: box-description is optional (left null)
      boxDescriptions: null,
      boxDescriptionsZh: null,
      boxDescriptionsLa: null,
      // Field 4: Core Focus Areas
      coreFocusAreas: JSON.stringify([
        'Digital Media Production',
        'Strategic PR & Brand Storytelling',
        'Broadcast Journalism',
        'Visual & Motion Design',
        'Social Media Analytics',
        'Creative Copywriting',
      ]),
      coreFocusAreasZh: JSON.stringify([
        '数字媒体制作',
        '战略公关与品牌叙事',
        '广播新闻',
        '视觉与动态设计',
        '社交媒体分析',
        '创意文案',
      ]),
      coreFocusAreasLa: JSON.stringify([
        'ການຜະລິດສື່ດິຈິທັລ',
        'ການປະຊາສຳພັນ & ເລົ່າເລື່ອງແບຣນ',
        'ວາລະສານກະຈາຍສຽງ',
        'ການອອກແບບພາບ & ໂມຊັ່ນ',
        'ການວິເຄາະໂຊຊຽວມີເດຍ',
        'ການຂຽນບົດໂຄສະນາສ້າງສັນ',
      ]),
      // Field 5: Career Outcome Description
      careerOutcomeDesc:
        'Our creative graduates thrive across top advertising networks, film production studios, broadcast agencies, and brand consultancies.',
      careerOutcomeDescZh:
        '我们的创意专业毕业生活跃于领先广告集团、电影制作工作室、广播机构与品牌咨询公司。',
      careerOutcomeDescLa:
        'ນັກສຶກສາສາຍສື່ສານຂອງພວກເຮົາເຕີບໃຫຍ່ໃນເຄືອຂ່າຍໂຄສະນາຊັ້ນນຳ, ສະຕູດິໂອຜະລິດຮູບເງົາ ແລະ ບໍລິສັດສື່ລະດັບສາກົນ.',
      // Field 6: Career Outcomes Boxes
      careerPlacementRate: '92%',
      careerPlacementRateZh: '92%',
      careerPlacementRateLa: '92%',
      careerAvgSalary: '$65K',
      careerAvgSalaryZh: '$65K',
      careerAvgSalaryLa: '$65K',
      careerPartnerCompanies: '100+',
      careerPartnerCompaniesZh: '100+',
      careerPartnerCompaniesLa: '100+',
      careerTimeToEmployment: '3 Months',
      careerTimeToEmploymentZh: '3个月',
      careerTimeToEmploymentLa: '3 ເດືອນ',
    },
  });

  // Programs
  const progCS = await prisma.program.create({
    data: {
      name: 'Bachelor of Science in Computer Science & Software Engineering',
      nameZh: '计算机科学与软件工程理学学士',
      slug: 'computer-science',
      degree: 'Bachelor',
      degreeZh: '学士',
      duration: '4 Years (8 Semesters)',
      durationZh: '4 Years (8 Semesters)',
      description:
        'A comprehensive curriculum covering data structures, software architecture, full-stack web and mobile development, distributed systems, and AI integration.',
      descriptionZh:
        '综合课程涵盖数据结构、软件架构、全栈网页与移动开发、分布式系统及人工智能集成。',
      heroImage: '/images/academics_desktopview/img_1.jpg',
      coreFocusAreas: JSON.stringify([
        'Full-Stack Web & Mobile Architecture',
        'Cloud Computing & DevOps CI/CD',
        'Artificial Intelligence & Algorithms',
        'Cybersecurity & Network Defense',
      ]),
      coreFocusAreasZh: JSON.stringify([
        '全栈网页与移动架构',
        '云计算与开发运维持续集成／交付',
        '人工智能与算法',
        '网络安全与防御',
      ]),
      departmentId: deptIT.id,
      order: 1,
      isPublished: true,
    },
  });

  const progAI = await prisma.program.create({
    data: {
      name: 'Bachelor of Science in Data Science & Artificial Intelligence',
      nameZh: '数据科学与人工智能理学学士',
      slug: 'data-science-ai',
      degree: 'Bachelor',
      degreeZh: '学士',
      duration: '4 Years (8 Semesters)',
      durationZh: '4 Years (8 Semesters)',
      description:
        'Specialized program focusing on statistical machine learning, deep neural networks, big data engineering, computer vision, and NLP application.',
      descriptionZh:
        '专业课程聚焦统计机器学习、深度神经网络、大数据工程、计算机视觉与自然语言处理应用。',
      heroImage: '/images/academics_desktopview/img_2.jpg',
      coreFocusAreas: JSON.stringify([
        'Deep Learning & Neural Networks',
        'Big Data Processing with Spark/Hadoop',
        'Natural Language Processing & LLMs',
        'Predictive Analytics & Visualization',
      ]),
      coreFocusAreasZh: JSON.stringify([
        '深度学习与神经网络',
        'Spark／Hadoop 大数据处理',
        '自然语言处理与大语言模型',
        '预测分析与可视化',
      ]),
      departmentId: deptIT.id,
      order: 2,
      isPublished: true,
    },
  });

  const progIB = await prisma.program.create({
    data: {
      name: 'Bachelor of Business Administration in International Business',
      nameZh: '国际商务工商管理学士',
      slug: 'international-business',
      degree: 'Bachelor',
      degreeZh: '学士',
      duration: '4 Years (8 Semesters)',
      durationZh: '4 Years (8 Semesters)',
      description:
        'Prepares students for global enterprise management, cross-border negotiation, international marketing, and global financial operations.',
      descriptionZh:
        '培养学生在全球企业管理、跨境谈判、国际营销及国际金融运营方面的能力。',
      heroImage: '/images/academics_desktopview/img_3.jpg',
      coreFocusAreas: JSON.stringify([
        'Global Strategic Management',
        'International Financial Markets',
        'Cross-Cultural Negotiations',
        'Supply Chain & Global Logistics',
      ]),
      coreFocusAreasZh: JSON.stringify([
        '全球战略管理',
        '国际金融市场',
        '跨文化谈判',
        '供应链与全球物流',
      ]),
      departmentId: deptBA.id,
      order: 3,
      isPublished: true,
    },
  });

  const progDM = await prisma.program.create({
    data: {
      name: 'Bachelor of Arts in Digital Media & Communication',
      nameZh: '数字媒体与传播文学学士',
      slug: 'digital-media-communication',
      degree: 'Bachelor',
      degreeZh: '学士',
      duration: '4 Years (8 Semesters)',
      durationZh: '4 Years (8 Semesters)',
      description:
        'A hands-on program blending digital storytelling, multimedia production, brand reputation management, and creative advertising campaigns.',
      descriptionZh:
        '实践课程融合数字叙事、多媒体制作、品牌声誉管理与创意广告策划。',
      heroImage: '/images/academics_desktopview/img_4.jpg',
      coreFocusAreas: JSON.stringify([
        'Digital Video & Audio Production',
        'Brand Strategy & Public Relations',
        'Interactive Media & UI/UX Design',
        'Content Marketing & Social Campaigns',
      ]),
      coreFocusAreasZh: JSON.stringify([
        '数字音视频制作',
        '品牌战略与公共关系',
        '交互媒体与界面／体验设计',
        '内容营销与社交传播',
      ]),
      departmentId: deptCA.id,
      order: 4,
      isPublished: true,
    },
  });

  // Faculty
  await prisma.faculty.createMany({
    data: [
      {
        name: 'Dr. Sarah Jenkins',
        nameZh: 'Dr. Sarah Jenkins',
        position: 'Dean & Professor of Computer Science',
        positionZh: '院长兼计算机科学教授',
        departmentName: 'Department of Information Technology',
        departmentNameZh: '信息技术系',
        biography:
          'PhD in Computer Science from MIT with over 15 years of industry and academic experience in distributed systems and software reliability.',
        biographyZh:
          '麻省理工学院计算机科学博士，在分布式系统与软件可靠性领域拥有15年以上行业与学术经验。',
        imageUrl: '/images/home_desktopview/img_5.jpg',
        email: 's.jenkins@sit.edu.kh',
        departmentId: deptIT.id,
        order: 1,
        isFeatured: true,
      },
      {
        name: 'Prof. David Chen',
        nameZh: 'David Chen 教授',
        position: 'Head & Professor of Business Administration',
        positionZh: '工商管理系主任兼教授',
        departmentName: 'Department of Business Administration & Economics',
        departmentNameZh: '工商管理与经济系',
        biography:
          'Former Senior World Bank Advisor and Harvard PhD in Economics specializing in emerging markets and international trade policy.',
        biographyZh:
          '前世界银行高级顾问、哈佛大学经济学博士，专注于新兴市场与国际贸易政策。',
        imageUrl: '/images/home_desktopview/img_6.jpg',
        email: 'd.chen@sit.edu.kh',
        departmentId: deptBA.id,
        order: 2,
        isFeatured: true,
      },
      {
        name: 'Dr. Elena Rostova',
        nameZh: 'Dr. Elena Rostova',
        position: 'Chair of Communication Arts',
        positionZh: '传播艺术系主任',
        departmentName: 'Department of Communication Arts',
        departmentNameZh: '传播艺术系',
        biography:
          'PhD in Media Studies from Oxford University, award-winning documentary director and media strategist.',
        biographyZh: '牛津大学媒体研究博士、获奖纪录片导演与媒体战略专家。',
        imageUrl: '/images/about_desktopview/img_2.jpg',
        email: 'e.rostova@sit.edu.kh',
        departmentId: deptCA.id,
        order: 3,
        isFeatured: true,
      },
      {
        name: 'Prof. Alexander Kim',
        nameZh: 'Alexander Kim 教授',
        position: 'Associate Professor of Machine Learning',
        positionZh: '机器学习副教授',
        departmentName: 'Department of Information Technology',
        departmentNameZh: '信息技术系',
        biography:
          'Leading researcher in neural language processing and autonomous robotics with numerous IEEE publications.',
        biographyZh: '神经语言处理与自主机器人领域研究者，发表多篇 IEEE 论文。',
        imageUrl: '/images/about_desktopview/img_3.jpg',
        email: 'a.kim@sit.edu.kh',
        departmentId: deptIT.id,
        order: 4,
        isFeatured: true,
      },
      {
        name: 'Dr. Somnang Ly',
        nameZh: 'Somnang Ly 博士',
        position: 'Senior Lecturer in Quantitative Finance',
        positionZh: '量化金融高级讲师',
        departmentName: 'Department of Business Administration & Economics',
        departmentNameZh: '工商管理与经济系',
        biography:
          'Specialist in algorithmic trading, financial econometrics, and Fintech regulatory compliance.',
        biographyZh: '专长为算法交易、金融计量经济学及金融科技合规。',
        imageUrl: '/images/about_desktopview/img_4.jpg',
        email: 's.ly@sit.edu.kh',
        departmentId: deptBA.id,
        order: 5,
        isFeatured: false,
      },
    ],
  });

  // Program Directors
  await prisma.programDirector.createMany({
    data: [
      {
        name: 'Dr. Sarah Jenkins',
        nameZh: 'Dr. Sarah Jenkins',
        position: 'Director of Computing Programs',
        positionZh: '计算机课程负责人',
        departmentName: 'Department of Information Technology',
        departmentNameZh: '信息技术系',
        biography:
          'Directing the flagship software engineering curriculum and overseeing capstone industrial partnerships.',
        biographyZh: '负责软件工程旗舰课程，并统筹毕业项目的行业合作。',
        imageUrl: '/images/home_desktopview/img_5.jpg',
        email: 's.jenkins@sit.edu.kh',
        programId: progCS.id,
        order: 1,
      },
      {
        name: 'Prof. David Chen',
        nameZh: 'David Chen 教授',
        position: 'Director of International Business Programs',
        positionZh: '国际商务课程负责人',
        departmentName: 'Department of Business Administration & Economics',
        departmentNameZh: '工商管理与经济系',
        biography:
          'Overseeing global exchange partnerships and dual degree programs with partner universities.',
        biographyZh: '统筹全球交流合作及与伙伴高校的双学位课程。',
        imageUrl: '/images/home_desktopview/img_6.jpg',
        email: 'd.chen@sit.edu.kh',
        programId: progIB.id,
        order: 2,
      },
      {
        name: 'Dr. Elena Rostova',
        nameZh: 'Dr. Elena Rostova',
        position: 'Director of Media & Communication Studies',
        positionZh: '媒体与传播课程负责人',
        departmentName: 'Department of Communication Arts',
        departmentNameZh: '传播艺术系',
        biography:
          'Managing multimedia studio labs and digital broadcast student productions.',
        biographyZh: '管理多媒体实验工作室及学生数字广播制作。',
        imageUrl: '/images/about_desktopview/img_2.jpg',
        email: 'e.rostova@sit.edu.kh',
        programId: progDM.id,
        order: 3,
      },
    ],
  });
  console.log('✅ Departments, Programs, Faculty & Directors seeded');

  // 6. Spotlights
  await prisma.spotlight.deleteMany();
  await prisma.spotlight.createMany({
    data: [
      {
        type: 'STUDENT',
        title: 'Securing a Global Software Engineering Career',
        titleZh: '开启全球软件工程职业之路',
        subtitle: 'STUDENT SUCCESS STORY',
        subtitleZh: '学生成功故事',
        quote:
          'SIT’s hands-on engineering lab projects and career center mentorship enabled me to secure an international software developer role before graduation.',
        quoteZh:
          'SIT 工程实验室实践与就业中心导师指导，让我在毕业前就获得了国际软件开发工作机会。',
        description:
          'Sovannarath built an AI-powered diagnostic tool during his senior year at SIT, which won regional recognition at the ASEAN Tech Challenge.',
        descriptionZh:
          'Sovannarath 在 SIT 大四期间开发了人工智能诊断工具，在东盟科技挑战赛中获得区域认可。',
        authorName: 'Sovannarath Keo',
        authorNameZh: 'Sovannarath Keo',
        authorRole: 'Class of 2025 • Computer Science Graduate',
        authorRoleZh: '2025届计算机科学毕业生',
        imageUrl: '/images/home_desktopview/img_2.jpg',
        order: 1,
        isActive: true,
      },
      {
        type: 'FACULTY',
        title: 'Pioneering Research in Machine Learning Applications',
        titleZh: '探索机器学习应用前沿研究',
        subtitle: 'FACULTY SPOTLIGHT',
        subtitleZh: '教师风采',
        quote:
          'At SIT, we empower our students not just to consume modern technologies, but to author and invent solutions that advance society.',
        quoteZh:
          '在 SIT，我们鼓励学生不仅使用现代科技，更要创造和发明推动社会进步的解决方案。',
        description:
          'Dr. Sarah Jenkins recently published groundbreaking research on decentralized data systems in collaboration with international researchers.',
        descriptionZh:
          'Sarah Jenkins 博士近期与国际研究者合作，发表了去中心化数据系统领域的创新研究。',
        authorName: 'Dr. Sarah Jenkins',
        authorNameZh: 'Dr. Sarah Jenkins',
        authorRole: 'Dean & Professor of Computer Science',
        authorRoleZh: '院长兼计算机科学教授',
        imageUrl: '/images/home_desktopview/img_5.jpg',
        order: 2,
        isActive: true,
      },
      {
        type: 'ALUMNI',
        title: 'Building an Award-Winning Fintech Venture',
        titleZh: '创办获奖金融科技企业',
        subtitle: 'ALUMNI SUCCESS STORY',
        subtitleZh: '校友成功故事',
        quote:
          'The mentorship from professors and access to SIT’s incubation fund gave our team the resources to turn a classroom idea into a real company.',
        quoteZh:
          '教授指导与 SIT 孵化基金为我们的团队提供资源，将课堂创意转化为真正的企业。',
        description:
          'Maya and her team founded PayBridge, an innovative cross-border payment solution that closed seed funding in early 2026.',
        descriptionZh:
          'Maya 与团队创立创新跨境支付方案 PayBridge，并于2026年初完成种子轮融资。',
        authorName: 'Maya Lin',
        authorNameZh: 'Maya Lin',
        authorRole: 'Class of 2024 • International Business Alumni',
        authorRoleZh: '2024届国际商务校友',
        imageUrl: '/images/home_desktopview/img_3.jpg',
        order: 3,
        isActive: true,
      },
    ],
  });
  console.log('✅ Spotlights seeded');

  // 7. Partners
  await prisma.partner.deleteMany();
  await prisma.partner.createMany({
    data: [
      // University Partners
      {
        name: 'Shih Chien University',
        nameZh: '实践大学',
        nameLa: 'ມະຫາວິທະຍາໄລ ຊິ ຈ້ຽນ (Shih Chien)',
        type: 'UNIVERSITY',
        logoUrl: '/images/collaborations_desktopview/img_2.png',
        websiteUrl: 'https://www.usc.edu.tw',
        country: 'Taiwan',
        countryZh: '中国台湾',
        countryLa: 'ໄຕ້ຫວັນ',
        order: 1,
      },
      {
        name: 'Thaksin University',
        nameZh: '他信大学',
        nameLa: 'ມະຫາວິທະຍາໄລ ທັກສິນ (Thaksin)',
        type: 'UNIVERSITY',
        logoUrl: '/images/collaborations_desktopview/img_3.png',
        websiteUrl: 'https://www.tsu.ac.th',
        country: 'Thailand',
        countryZh: '泰国',
        countryLa: 'ໄທ',
        order: 2,
      },
      {
        name: 'University of the Thai Chamber of Commerce (UTCC)',
        nameZh: '泰国商会大学（UTCC）',
        nameLa: 'ມະຫາວິທະຍາໄລ ຫໍການຄ້າໄທ',
        type: 'UNIVERSITY',
        logoUrl: '/images/collaborations_desktopview/img_4.png',
        websiteUrl: 'https://www.utcc.ac.th',
        country: 'Thailand',
        countryZh: '泰国',
        countryLa: 'ໄທ',
        order: 3,
      },
      {
        name: 'Thammasat University',
        nameZh: '泰国法政大学',
        nameLa: 'ມະຫາວິທະຍາໄລ ທຳມະສາດ',
        type: 'UNIVERSITY',
        logoUrl: '/images/collaborations_desktopview/img_5.png',
        websiteUrl: 'https://www.tu.ac.th',
        country: 'Thailand',
        countryZh: '泰国',
        countryLa: 'ໄທ',
        order: 4,
      },
      {
        name: 'Shandong Business Institute',
        nameZh: '山东商务职业学院',
        nameLa: 'ສະຖາບັນທຸລະກິດ ຊານຕົງ',
        type: 'UNIVERSITY',
        logoUrl: '/images/collaborations_desktopview/img_6.png',
        websiteUrl: 'https://www.sdsctc.edu.cn',
        country: 'China',
        countryZh: '中国',
        countryLa: 'ຈີນ',
        order: 5,
      },
      {
        name: "King Mongkut's University of Technology North Bangkok",
        nameZh: '北曼谷先皇技术大学',
        nameLa: 'ມະຫາວິທະຍາໄລເຕັກໂນໂລຊີພະຈອມເກົ້າພະນະຄອນເໜືອ',
        type: 'UNIVERSITY',
        logoUrl: '/images/collaborations_desktopview/img_7.png',
        websiteUrl: 'https://www.kmutnb.ac.th',
        country: 'Thailand',
        countryZh: '泰国',
        countryLa: 'ໄທ',
        order: 6,
      },
      {
        name: 'Universitas Ciputra',
        nameZh: '西普特拉大学',
        nameLa: 'ມະຫາວິທະຍາໄລ ຈີປູຕຣາ (Ciputra)',
        type: 'UNIVERSITY',
        logoUrl: '/images/collaborations_desktopview/img_8.png',
        websiteUrl: 'https://www.uc.ac.id',
        country: 'Indonesia',
        countryZh: '印度尼西亚',
        countryLa: 'ອິນໂດເນເຊຍ',
        order: 7,
      },
      {
        name: 'Harbour.Space Institute of Technology',
        nameZh: 'Harbour.Space 理工学院',
        nameLa: 'ສະຖາບັນເຕັກໂນໂລຊີ ຮາເບີ.ສະເປສ',
        type: 'UNIVERSITY',
        logoUrl: '/images/collaborations_desktopview/img_9.png',
        websiteUrl: 'https://harbour.space',
        country: 'Spain / Thailand',
        countryZh: '西班牙／泰国',
        countryLa: 'ແອັດສະປາຍ / ໄທ',
        order: 8,
      },
      // Industry Partners
      {
        name: 'Lao Brewery Co., Ltd.',
        nameZh: '老挝啤酒有限公司',
        nameLa: 'ບໍລິສັດ ເບຍລາວ ຈຳກັດ',
        type: 'INDUSTRY',
        logoUrl: '/images/collaborations_desktopview/img_10.png',
        websiteUrl: 'https://beerlao.la',
        country: 'Laos',
        countryZh: '老挝',
        countryLa: 'ລາວ',
        order: 9,
      },
      {
        name: 'Star Telecom (Unitel)',
        nameZh: 'Star Telecom（Unitel）',
        nameLa: 'ສະຕາ ໂທລະຄົມ (ຢູນີເທວ)',
        type: 'INDUSTRY',
        logoUrl: '/images/collaborations_desktopview/img_11.png',
        websiteUrl: 'https://unitel.com.la',
        country: 'Laos',
        countryZh: '老挝',
        countryLa: 'ລາວ',
        order: 10,
      },
      {
        name: 'Reactor School',
        nameZh: 'Reactor 学校',
        nameLa: 'ໂຮງຮຽນ ຣີແອັກເຕີ (Reactor)',
        type: 'INDUSTRY',
        logoUrl: '/images/collaborations_desktopview/img_12.png',
        websiteUrl: 'https://reactor.school',
        country: 'Singapore',
        countryZh: '新加坡',
        countryLa: 'ສິງກະໂປ',
        order: 11,
      },
      {
        name: 'Crowne Plaza Vientiane',
        nameZh: '万象皇冠假日酒店',
        nameLa: 'ຄຣາວ ພາຊາ ວຽງຈັນ',
        type: 'INDUSTRY',
        logoUrl: '/images/collaborations_desktopview/img_14.png',
        websiteUrl: 'https://vientiane.crowneplaza.com',
        country: 'Laos',
        countryZh: '老挝',
        countryLa: 'ລາວ',
        order: 12,
      },
      {
        name: 'SeaBridge',
        nameZh: 'SeaBridge',
        nameLa: 'ຊີບຣິດຈ໌ (SeaBridge)',
        type: 'INDUSTRY',
        logoUrl: '/images/collaborations_desktopview/img_15.png',
        websiteUrl: 'https://seabridge.com',
        country: 'Global',
        countryZh: '全球',
        countryLa: 'ສາກົນ',
        order: 13,
      },
      {
        name: 'BAIC Motor',
        nameZh: '北京汽车',
        nameLa: 'ບີເອໄອຊີ ມໍເຕີ (BAIC)',
        type: 'INDUSTRY',
        logoUrl: '/images/collaborations_desktopview/img_16.png',
        websiteUrl: 'https://baicintl.com',
        country: 'Global',
        countryZh: '全球',
        countryLa: 'ສາກົນ',
        order: 14,
      },
      {
        name: 'Lao Art Media',
        nameZh: '老挝艺术传媒',
        nameLa: 'ລາວ ອາດ ມີເດຍ',
        type: 'INDUSTRY',
        logoUrl: '/images/collaborations_desktopview/img_17.png',
        websiteUrl: 'https://laoartmedia.com',
        country: 'Laos',
        countryZh: '老挝',
        countryLa: 'ລາວ',
        order: 15,
      },
      {
        name: 'Foton Motor',
        nameZh: '福田汽车',
        nameLa: 'ໂຟຕອນ ມໍເຕີ (Foton)',
        type: 'INDUSTRY',
        logoUrl: '/images/collaborations_desktopview/img_18.png',
        websiteUrl: 'https://foton-global.com',
        country: 'Global',
        countryZh: '全球',
        countryLa: 'ສາກົນ',
        order: 16,
      },
      {
        name: 'LAILAOLAB ICT Solution',
        nameZh: 'LAILAOLAB 信息通信技术解决方案',
        nameLa: 'ໄລລາວແລັບ ໄອຊີທີ ໂຊລູຊັ່ນ',
        type: 'INDUSTRY',
        logoUrl: '/images/collaborations_desktopview/img_19.png',
        websiteUrl: 'https://lailaolab.com',
        country: 'Laos',
        countryZh: '老挝',
        countryLa: 'ລາວ',
        order: 17,
      },
    ],
  });
  console.log('✅ Partners seeded');

  // 8. Campus Facilities
  await prisma.campusFacility.deleteMany();
  await prisma.campusFacility.createMany({
    data: [
      {
        name: 'Art Society & Cultural Center',
        nameZh: '艺术协会与文化中心',
        nameLa: 'ສູນສິລະປະ ແລະ ວັດທະນະທຳ',
        description:
          'A grand auditorium and dedicated rehearsal stage for theater, traditional Lao dance, and musical performances.',
        descriptionZh:
          '大型礼堂与专用排练舞台，可开展戏剧、老挝传统舞蹈及音乐表演。',
        descriptionLa:
          'ຫໍປະຊຸມໃຫຍ່ ແລະ ເວທີຝຶກຊ້ອມສຳລັບລະຄອນເວທີ, ການຟ້ອນພື້ນເມືອງລາວ ແລະ ການສະແດງດົນຕີ.',
        imageUrl: '/images/life_at_sit_desktopview/img_3.jpg',
        actionType: 'MODAL',
        modalTitle: 'Art Society & Cultural Center Tour',
        modalTitleZh: '艺术协会与文化中心参观',
        modalTitleLa: 'ຢ້ຽມຊົມສູນສິລະປະ ແລະ ວັດທະນະທຳ',
        modalContent:
          'Equipped with professional stage lighting, acoustic soundproofing, dressing rooms, and seating for over 500 audience members. Hosts annual cultural galas, youth showcases, and drama productions.',
        modalContentZh:
          '配备专业舞台灯光、隔音设施、化妆间与500多个座席，举办年度文化晚会、青年展示和戏剧演出。',
        modalContentLa:
          'ປະກອບດ້ວຍລະບົບແສງສຽງເວທີລະດັບມືອາຊີບ, ຫ້ອງແຕ່ງຕົວ ແລະ ບ່ອນນັ່ງຮອງຮັບຜູ້ຊົມຫຼາຍກວ່າ 500 ທີ່ນັ່ງ. ໃຊ້ສຳລັບຈັດງານເທດສະການວັດທະນະທຳປະຈຳປີ ແລະ ການສະແດງລະຄອນເວທີ.',
        order: 1,
      },
      {
        name: 'Sports Athletic Union & Arena',
        nameZh: '学生体育联合会与运动场',
        nameLa: 'ສະໜາມກິລາ ແລະ ສູນອອກກຳລັງກາຍ',
        description:
          'Championship-grade athletic grounds hosting varsity football matches, track meets, and collegiate leagues.',
        descriptionZh:
          '符合赛事标准的运动场，可举办校队足球比赛、田径比赛与高校联赛。',
        descriptionLa:
          'ສະໜາມກິລາມາດຕະຖານສາກົນສຳລັບການແຂ່ງຂັນບານເຕະ, ແລ່ນ-ລານ ແລະ ລີກກິລາມະຫາວິທະຍາໄລ.',
        imageUrl: '/images/life_at_sit_desktopview/img_4.jpg',
        actionType: 'MODAL',
        modalTitle: 'Sports Athletic Complex & Arena',
        modalTitleZh: '综合体育中心与运动场',
        modalTitleLa: 'ສະໜາມກິລາ ແລະ ສະໂມສອນກິລາ',
        modalContent:
          'Features synthetic turf football pitch, multi-purpose courts for basketball and volleyball, professional training equipment, and spectator seating.',
        modalContentZh:
          '配有人工草坪足球场、篮球与排球多功能场地、专业训练器材和观众席。',
        modalContentLa:
          'ປະກອບດ້ວຍສະໜາມບານເຕະຫຍ້າທຽມ, ສະໜາມບານບ້ວງ ແລະ ບານສົ່ງ, ອຸປະກອນຝຶກຊ້ອມມາດຕະຖານ ແລະ ອັດສະຈັນຊົມກິລາ.',
        order: 2,
      },
      {
        name: 'Vocal Ensemble & Music Hall',
        nameZh: '合唱团与音乐厅',
        nameLa: 'ຫ້ອງຊ້ອມດົນຕີ ແລະ ວົງຂັບຮ້ອງ',
        description:
          'Soundproofed acoustic studios and performance halls for vocal choirs, live modern bands, and audio recording.',
        descriptionZh:
          '配有隔音声学设计的工作室与表演厅，可用于合唱、现代乐队及录音。',
        descriptionLa:
          'ສະຕູດິໂອສຽງ ແລະ ຫ້ອງສະແດງດົນຕີສຳລັບວົງຂັບຮ້ອງ, ວົງດົນຕີສາກົນ ແລະ ການບັນທຶກສຽງ.',
        imageUrl: '/images/life_at_sit_desktopview/img_6.jpg',
        actionType: 'MODAL',
        modalTitle: 'Vocal Ensemble & Music Studios',
        modalTitleZh: '合唱团与音乐工作室',
        modalTitleLa: 'ຫ້ອງຊ້ອມດົນຕີ ແລະ ສະຕູດິໂອບັນທຶກສຽງ',
        modalContent:
          'State-of-the-art music chambers with acoustic paneling, grand pianos, synthesizers, microphones, and digital audio workstations for music student creators.',
        modalContentZh:
          '先进音乐室配有声学板、三角钢琴、合成器、麦克风和数字音频工作站，为学生音乐创作提供支持。',
        modalContentLa:
          'ຫ້ອງດົນຕີທັນສະໄໝພ້ອມລະບົບກັນສຽງສະທ້ອນ, ເປຍໂນ, ຊິນທິໄຊເຊີ, ໄມໂຄຣໂຟນ ແລະ ໂປຣແກຣມບັນທຶກສຽງດິຈິທັລ.',
        order: 3,
      },
      {
        name: 'MC Committee & Media Broadcast Stage',
        nameZh: '主持人委员会与媒体播出舞台',
        nameLa: 'ເວທີພິທີກອນ ແລະ ຫ້ອງກະຈາຍສຽງ',
        description:
          'Professional public speaking podiums, television podcast studios, and master-of-ceremonies training spaces.',
        descriptionZh: '专业演讲台、电视播客工作室及主持人培训空间。',
        descriptionLa:
          'ເວທີຝຶກອົບຮົມພິທີກອນ, ສະຕູດິໂອພອດແຄສ ແລະ ການກະຈາຍສຽງໂທລະພາບລະດັບມືອາຊີບ.',
        imageUrl: '/images/life_at_sit_desktopview/img_7.jpg',
        actionType: 'MODAL',
        modalTitle: 'MC Committee & Media Studios',
        modalTitleZh: '主持人委员会与媒体工作室',
        modalTitleLa: 'ສູນພັດທະນາພິທີກອນ ແລະ ສື່ກະຈາຍສຽງ',
        modalContent:
          'Dedicated facilities for student emcees, debate societies, and campus news broadcasters with 4K multi-cam capture and live-streaming equipment.',
        modalContentZh:
          '为学生主持人、辩论社和校园新闻团队提供专用设施，配备4K多机位拍摄与直播设备。',
        modalContentLa:
          'ສະຖານທີ່ສະເພາະສຳລັບພິທີກອນນັກສຶກສາ, ຊົມຮົມໂຕ້ວາທີ ແລະ ທີມຂ່າວວິທະຍາເຂດ ພ້ອມກ້ອງ 4K ແລະ ອຸປະກອນຖ່າຍທອດສົດ.',
        order: 4,
      },
    ],
  });
  console.log('✅ Campus facilities seeded');

  // 9. News & Articles
  await prisma.news.deleteMany();
  await prisma.news.createMany({
    data: [
      {
        title: 'Celebrating 68 Years of Excellence with Shih Chien University',
        titleZh: '与实践大学共庆68周年卓越成就',
        titleLa:
          'ສະເຫຼີມສະຫຼອງ 68 ປີ ແຫ່ງຄວາມເປັນເລີດ ຮ່ວມກັບ ມະຫາວິທະຍາໄລ ຊິ ຈ້ຽນ (Shih Chien)',
        slug: 'celebrating-68-years-shih-chien-university',
        summary:
          'SIT delegates participated in the grand 68th anniversary celebration of partner institution Shih Chien University in Taiwan.',
        summaryZh: 'SIT 代表参加了合作院校实践大学在中国台湾举办的68周年校庆。',
        summaryLa:
          'ຄະນະຜູ້ຕາງໜ້າ SIT ເຂົ້າຮ່ວມພິທີສະເຫຼີມສະຫຼອງຄົບຮອບ 68 ປີ ຂອງມະຫາວິທະຍາໄລຄູ່ຮ່ວມມື ຊິ ຈ້ຽນ ທີ່ໄຕ້ຫວັນ.',
        content:
          'SIT delegates participated in the grand 68th anniversary celebration of partner institution Shih Chien University in Taiwan, deepening bilateral dual-degree collaboration and academic faculty exchange.',
        contentZh:
          'SIT 代表参加了实践大学在中国台湾举办的68周年校庆，深化双边双学位合作与师资学术交流。',
        category: 'International',
        categoryZh: '国际学生',
        imageUrl: '/images/life_at_sit_desktopview/img_8.jpg',
        author: 'SIT Global Relations',
        authorZh: 'SIT 国际关系处',
        publishedAt: new Date('2026-08-15'),
        isPublished: true,
        views: 1850,
      },
      {
        title:
          'The Director received the "Educational Excellence" Award in Kuala Lumpur, Malaysia.',
        titleZh: '校长在马来西亚吉隆坡获得“教育卓越奖”。',
        titleLa:
          'ຜູ້ອຳນວຍການຮັບລາງວັນ "ຄວາມເປັນເລີດດ້ານການສຶກສາ" ທີ່ ກົວລາລຳເປີ, ມາເລເຊຍ.',
        slug: 'director-educational-excellence-award-malaysia',
        summary:
          'SIT leadership was honored at the World School Summit with the prestigious Educational Excellence Award.',
        summaryZh: 'SIT 领导团队在世界学校峰会上荣获教育卓越奖。',
        summaryLa:
          'ການນຳ SIT ໄດ້ຮັບກຽດຕິຍົດໃນງານ World School Summit ດ້ວຍລາງວັນ Educational Excellence.',
        content:
          'SIT leadership was honored at the World School Summit with the prestigious Educational Excellence Award in recognition of pioneering smart campus infrastructure and curriculum modernization.',
        contentZh:
          'SIT 领导团队在世界学校峰会上荣获教育卓越奖，表彰其在智慧校园基础设施与课程现代化方面的创新。',
        category: 'Academics',
        categoryZh: '学术',
        imageUrl: '/images/life_at_sit_desktopview/img_10.jpg',
        author: 'Executive Office',
        authorZh: '校长办公室',
        publishedAt: new Date('2026-08-11'),
        isPublished: true,
        views: 2430,
      },
      {
        title:
          'Preparation Meeting for the Commencement of Semester II, Academic Year 2025-2026',
        titleZh: '2025–2026学年第二学期开学筹备会议',
        titleLa: 'ກອງປະຊຸມກຽມຄວາມພ້ອມ ສຳລັບການເປີດພາກຮຽນທີ II ສົກຮຽນ 2025-2026',
        slug: 'preparation-meeting-semester-ii-2025-2026',
        summary:
          'Academic deans, department chairs, and student coordinators gathered to finalize semester curriculum plans.',
        summaryZh: '院长、系主任与学生协调员共同确定学期课程计划。',
        summaryLa:
          'ຄະນະບໍດີ, ຫົວໜ້າພາກວິຊາ ແລະ ຜູ້ປະສານງານນັກສຶກສາ ຮ່ວມປະຊຸມກຽມແຜນການຮຽນ-ການສອນ.',
        content:
          'Academic deans, department chairs, and student coordinators gathered to finalize semester curriculum plans, lab upgrades, and incoming student orientations.',
        contentZh:
          '院长、系主任与学生协调员共同确定学期课程计划、实验室升级和新生入学安排。',
        category: 'Campus Life',
        categoryZh: '校园生活',
        imageUrl: '/images/life_at_sit_desktopview/img_11.jpg',
        author: 'Academic Affairs',
        authorZh: '教务处',
        publishedAt: new Date('2026-08-05'),
        isPublished: true,
        views: 1120,
      },
    ],
  });
  console.log('✅ News seeded');

  // 10. Events
  await prisma.event.deleteMany();
  await prisma.event.createMany({
    data: [
      {
        title:
          'Friendly Sports Competition Commemorating the 116th Anniversary of International',
        titleZh: '纪念国际妇女节116周年友谊体育赛',
        titleLa:
          'ການແຂ່ງຂັນກິລາມິດຕະພາບ ເນື່ອງໃນໂອກາດວັນແມ່ຍິງສາກົນ ຄົບຮອບ 116 ປີ',
        slug: 'friendly-sports-competition-116th-anniversary',
        summary:
          'Inter-departmental football, badminton, and relay matches uniting students and faculty.',
        summaryZh: '跨院系足球、羽毛球及接力比赛，促进师生交流。',
        summaryLa:
          'ການແຂ່ງຂັນບານເຕະ, ດອກປີກໄກ່ ແລະ ແລ່ນປ່ຽນໄມ້ ເພື່ອສ້າງຄວາມສາມັກຄີນັກສຶກສາ ແລະ ຄູອາຈານ.',
        content:
          'Inter-departmental football, badminton, and relay matches uniting students, faculty, and alumni in friendly collegiate athletic competition.',
        contentZh: '跨院系足球、羽毛球及接力友谊赛，促进学生、教师与校友交流。',
        location: 'SIT Sports Complex Stadium',
        locationZh: 'SIT 综合体育场',
        eventDate: new Date('2026-09-12T08:00:00Z'),
        time: '08:00 AM - 05:00 PM',
        timeZh: '08:00 AM - 05:00 PM',
        imageUrl: '/images/life_at_sit_desktopview/img_9.jpg',
        registrationUrl:
          '/events/friendly-sports-competition-116th-anniversary',
        isPublished: true,
      },
      {
        title: 'Social Integration Skills Training Camp',
        titleZh: '社会融合技能训练营',
        titleLa: 'ຄ້າຍຝຶກອົບຮົມທັກສະການປັບຕົວ ແລະ ການເຊື່ອມໂຍງສັງຄົມ',
        slug: 'social-integration-skills-training-camp',
        summary:
          'A 3-day outdoor leadership camp in Vang Vieng designed to foster team synergy and emotional intelligence.',
        summaryZh:
          '在万荣举办的三天户外领导力训练营，培养团队协作与情绪管理能力。',
        summaryLa:
          'ຄ້າຍຝຶກອົບຮົມຄວາມເປັນຜູ້ນຳກາງແຈ້ງ 3 ວັນ ທີ່ວັງວຽງ ເພື່ອເສີມສ້າງຄວາມສາມັກຄີ ແລະ ທັກສະການເຮັດວຽກເປັນທີມ.',
        content:
          'A 3-day outdoor leadership camp in Vang Vieng designed to foster team synergy, creative problem-solving, and emotional resilience for student leaders.',
        contentZh:
          '在万荣举办的三天户外领导力训练营，培养学生领袖的团队协作、创意解题与情绪韧性。',
        location: 'SIT Leadership Camp & Eco-Resort',
        locationZh: 'SIT 领导力营地与生态度假区',
        eventDate: new Date('2026-10-10T07:30:00Z'),
        time: '07:30 AM - 06:00 PM',
        timeZh: '07:30 AM - 06:00 PM',
        imageUrl: '/images/life_at_sit_desktopview/img_12.jpg',
        registrationUrl: '/events/social-integration-skills-training-camp',
        isPublished: true,
      },
      {
        title: 'Soutsakan Student Market Happening',
        titleZh: 'Soutsakan 学生集市活动',
        titleLa: 'ງານຕະຫຼາດນັດນັກສຶກສາ ສຸດສະກະນະ (Student Market)',
        slug: 'soutsakan-student-market-happening',
        summary:
          'Annual campus bazaar featuring student-run artisan stalls, street food treats, and live band stages.',
        summaryZh: '年度校园集市，设有学生手工艺摊位、美食和现场乐队舞台。',
        summaryLa:
          'ງານຕະຫຼາດນັດປະຈຳປີ ພ້ອມຮ້ານຄ້າສິນຄ້າສ້າງສັນຂອງນັກສຶກສາ, ອາຫານ ແລະ ເວທີດົນຕີສົດ.',
        content:
          'Annual campus bazaar featuring over 40 student-run entrepreneur stalls, artisan crafts, culinary treats, and acoustic musical performances throughout the weekend.',
        contentZh:
          '年度校园集市在周末举办，汇集40多个学生创业摊位、手工艺品、美食和原声音乐表演。',
        location: 'SIT Central Plaza Courtyard',
        locationZh: 'SIT 中央广场',
        eventDate: new Date('2026-11-20T16:00:00Z'),
        time: '04:00 PM - 10:00 PM',
        timeZh: '04:00 PM - 10:00 PM',
        imageUrl: '/images/life_at_sit_desktopview/img_13.jpg',
        registrationUrl: '/events/soutsakan-student-market-happening',
        isPublished: true,
      },
    ],
  });
  console.log('✅ Events seeded');

  // 11. Student Life
  await prisma.studentLife.deleteMany();
  await prisma.studentLife.createMany({
    data: [
      {
        title: 'Arts Society',
        titleZh: '艺术协会',
        titleLa: 'ຊົມຮົມ ສິລະປະສ້າງສັນ',
        description:
          'Empowering students to build creative tech designs, interactive media, and full-stack software solutions.',
        descriptionZh: '鼓励学生设计创意科技、交互媒体和全栈软件方案。',
        descriptionLa:
          'ສົ່ງເສີມນັກສຶກສາໃນການອອກແບບສື່ດິຈິທັລ, ຄວາມຄິດສ້າງສັນ ແລະ ການພັດທະນາຊອບແວ.',
        category: 'Academic',
        categoryZh: '学术背景',
        categoryLa: 'ວິຊາການ',
        imageUrl: '/images/life_at_sit_desktopview/img_14.jpg',
        gallery: JSON.stringify([
          '/images/life_at_sit_desktopview/img_14.jpg',
          '/images/life_at_sit_desktopview/img_16.jpg',
        ]),
        order: 1,
      },
      {
        title: 'Music Ensemble',
        titleZh: '音乐乐团',
        titleLa: 'ຊົມຮົມ ດົນຕີສາກົນ',
        description:
          'Live musical rehearsals, vocal choirs, acoustic concerts, and university festival performance showcases.',
        descriptionZh: '音乐排练、合唱、原声音乐会与校园节庆演出。',
        descriptionLa:
          'ການຝຶກຊ້ອມດົນຕີສົດ, ວົງຂັບຮ້ອງ, ຄອນເສີດອາຄູສຕິກ ແລະ ການສະແດງໃນງານເທດສະການ.',
        category: 'Arts',
        categoryZh: '艺术',
        categoryLa: 'ສິລະປະ',
        imageUrl: '/images/life_at_sit_desktopview/img_15.jpg',
        gallery: JSON.stringify([
          '/images/life_at_sit_desktopview/img_15.jpg',
          '/images/life_at_sit_desktopview/img_17.jpg',
        ]),
        order: 2,
      },
      {
        title: 'Sports Athletic Union',
        titleZh: '学生体育联合会',
        titleLa: 'ສະຫະພັນ ກິລານັກສຶກສາ',
        description:
          'Organizing varsity leagues, fitness bootcamps, collegiate football matches, and sports photography.',
        descriptionZh: '组织校队联赛、健身训练营、高校足球比赛与体育摄影。',
        descriptionLa:
          'ຈັດການແຂ່ງຂັນກິລາມະຫາວິທະຍາໄລ, ການອອກກຳລັງກາຍ ແລະ ການຖ່າຍພາບກິລາ.',
        category: 'Sports',
        categoryZh: '体育',
        categoryLa: 'ກິລາ',
        imageUrl: '/images/life_at_sit_desktopview/img_4.jpg',
        gallery: JSON.stringify([
          '/images/life_at_sit_desktopview/img_4.jpg',
          '/images/life_at_sit_desktopview/img_5.jpg',
        ]),
        order: 3,
      },
      {
        title: 'MC Committee',
        titleZh: '主持人委员会',
        titleLa: 'ຄະນະກຳມະການ ພິທີກອນ',
        description:
          'Developing polished public speaking, emcee mastery, event coordination, and bilingual presentation skills.',
        descriptionZh: '培养公开演讲、主持、活动协调与双语展示能力。',
        descriptionLa:
          'ພັດທະນາທັກສະການເວົ້າໃນທີ່ສາທາລະນະ, ການເປັນພິທີກອນສອງພາສາ ແລະ ການຈັດກິດຈະກຳ.',
        category: 'Leadership',
        categoryZh: '领导力',
        categoryLa: 'ຄວາມເປັນຜູ້ນຳ',
        imageUrl: '/images/life_at_sit_desktopview/img_7.jpg',
        gallery: JSON.stringify([
          '/images/life_at_sit_desktopview/img_7.jpg',
          '/images/life_at_sit_desktopview/img_18.jpg',
        ]),
        order: 4,
      },
    ],
  });
  console.log('✅ Student life seeded');

  // 12. Founder, Members, History & Vision/Mission
  await prisma.founder.deleteMany();
  await prisma.founder.create({
    data: {
      name: 'Oknha Dr. Mengly J. Quach',
      nameZh: 'Oknha Mengly J. Quach 博士',
      designation: 'Founder, Chairman and CEO of SIT University',
      designationZh: 'SIT 创始人、理事长兼首席执行官',
      quote:
        'Education is the single most enduring foundation for human dignity, prosperity, and national transformation. At SIT, we do not merely educate students; we inspire them to build a better world.',
      quoteZh:
        '教育是维护人的尊严、繁荣与国家发展的持久基石。在 SIT，我们不仅教育学生，更激励他们建设更美好的世界。',
      biography:
        'A revered education pioneer, physician, author, and philanthropist, Oknha Dr. Mengly J. Quach has dedicated decades to advancing educational excellence in Cambodia. Under his visionary stewardship, SIT University has grown into a premier institution recognized for academic rigor, innovation, and global collaboration.',
      biographyZh:
        'Oknha Mengly J. Quach 博士是教育先驱、医生、作家与慈善家，数十年来致力于推动柬埔寨教育发展。在他的领导下，SIT 发展成为以严谨学术、创新与全球合作著称的优秀学府。',
      imageUrl: '/images/about_desktopview/img_1.jpg',
    },
  });

  await prisma.visionMission.deleteMany();
  await prisma.visionMission.create({
    data: {
      vision:
        'To be Southeast Asia’s premier global university, renowned for pioneering innovation, transformative education, and ethical leadership.',
      visionZh:
        '成为东南亚领先的国际大学，以开拓创新、变革教育与道德领导力享誉全球。',
      mission:
        'To educate, empower, and inspire exceptional graduates through experiential learning, world-class research, and impactful industry collaboration, solving society’s most pressing challenges.',
      missionZh:
        '通过体验式学习、优质研究和有影响力的行业合作，教育、赋能并激励优秀毕业生，应对社会迫切挑战。',
      corePillars: JSON.stringify([
        'World-Class Academic Quality',
        'Cutting-Edge Technological Innovation',
        'Uncompromising Ethical Leadership',
        'Global Mobility & Career Success',
      ]),
      corePillarsZh: JSON.stringify([
        '卓越学术质量',
        '前沿科技创新',
        '坚定的道德领导力',
        '全球交流与职业成功',
      ]),
    },
  });

  await prisma.member.deleteMany();
  await prisma.member.createMany({
    data: [
      {
        name: 'Dr. Sarah Jenkins',
        nameZh: 'Dr. Sarah Jenkins',
        position: 'Vice Chairman & Academic Advisor',
        positionZh: '副理事长兼学术顾问',
        category: 'Board of Trustees',
        categoryZh: '理事会',
        biography:
          'Former MIT research director and senior higher education consultant.',
        biographyZh: '前麻省理工学院研究主任、高等教育高级顾问。',
        imageUrl: '/images/about_desktopview/img_2.jpg',
        order: 1,
      },
      {
        name: 'Prof. David Chen',
        nameZh: 'David Chen 教授',
        position: 'Member of University Council',
        positionZh: '校务委员会成员',
        category: 'University Council',
        categoryZh: '校务委员会',
        biography:
          'Distinguished economic strategist and international policy advisor.',
        biographyZh: '优秀经济战略专家与国际政策顾问。',
        imageUrl: '/images/about_desktopview/img_3.jpg',
        order: 2,
      },
      {
        name: 'Dr. Elena Rostova',
        nameZh: 'Dr. Elena Rostova',
        position: 'Member of University Council',
        positionZh: '校务委员会成员',
        category: 'University Council',
        categoryZh: '校务委员会',
        biography: 'International media researcher and communications fellow.',
        biographyZh: '国际媒体研究者与传播学研究员。',
        imageUrl: '/images/about_desktopview/img_4.jpg',
        order: 3,
      },
      {
        name: 'Dr. Krisada Wannakring',
        nameZh: 'Dr. Krisada Wannakring',
        position: 'Dean, College of Engineering',
        positionZh: '工程学院院长',
        category: 'Board of Trustees',
        categoryZh: '理事会',
        biography: 'Senior academic and engineering systems specialist.',
        biographyZh: '资深学者与工程系统专家。',
        imageUrl: '/images/about/member_default.jpg',
        order: 4,
      },
    ],
  });

  await prisma.history.deleteMany();
  await prisma.history.createMany({
    data: [
      {
        year: '2005',
        title: 'Foundation & Vision',
        titleZh: '创立与愿景',
        description:
          'Established as an institute dedicated to high-standard English-medium education and modern vocational leadership.',
        descriptionZh:
          '学院成立之初，致力于高标准英语授课及现代职业领导力教育。',
        order: 1,
      },
      {
        year: '2012',
        title: 'Campus Expansion & Degree Accreditation',
        titleZh: '校区扩建与学位认证',
        description:
          'Accreditation of bachelor degree programs in Information Technology and International Business.',
        descriptionZh: '信息技术与国际商务学士课程获得认证。',
        order: 2,
      },
      {
        year: '2018',
        title: 'Global University Partnerships',
        titleZh: '全球高校合作',
        description:
          'Signing of bilateral student exchange and joint research agreements with top universities in Singapore, Japan, and Australia.',
        descriptionZh:
          '与新加坡、日本及澳大利亚优秀高校签署双边学生交换与联合研究协议。',
        order: 3,
      },
      {
        year: '2022',
        title: 'New State-of-the-Art Smart Campus',
        titleZh: '先进智慧新校区',
        description:
          'Inauguration of the flagship tech campus with robotics laboratories, incubation hub, and Olympic sports facilities.',
        descriptionZh:
          '设有机器人实验室、孵化中心和奥林匹克标准体育设施的旗舰科技校区启用。',
        order: 4,
      },
      {
        year: '2026',
        title: 'Center of Excellence in AI & Technology',
        titleZh: '人工智能与科技卓越中心',
        description:
          'Achieving record enrollment, 96% graduate employment rate, and launching new postgraduate research initiatives.',
        descriptionZh:
          '招生人数创新高，毕业生就业率达到96%，并启动新的研究生科研计划。',
        order: 5,
      },
    ],
  });
  console.log('✅ About & History seeded');

  // 13. Admissions Timeline & Requirements
  await prisma.applicationTimeline.deleteMany();
  await prisma.applicationTimeline.createMany({
    data: [
      {
        intakeName: 'Fall Semester 2026',
        intakeNameZh: '2026年秋季学期',
        intakeNameLa: 'ພາກຮຽນລະດູໃບໄມ້ຫຼົ່ນ 2026',
        intakeYear: '2026',
        openingDate: new Date('2026-05-01'),
        closingDate: new Date('2026-08-15'),
        deadlineDate: new Date('2026-08-15'),
        classesBeginDate: new Date('2026-10-01'),
        additionalNotes:
          '• 1st of October will be starting date of class.\n• Placement Exam 7th of September',
        additionalNotesZh: '• 10月1日开课。\n• 9月7日举行分级考试。',
        additionalNotesLa:
          '• ວັນທີ 1 ຕຸລາ ຈະເປັນມື້ເລີ່ມຕົ້ນຮຽນ.\n• ສອບເສັງວັດລະດັບວັນທີ 7 ກັນຍາ',
        status: 'Open Now',
        statusZh: '现已开放',
        statusLa: 'ເປີດຮັບສະໝັກແລ້ວ',
        order: 1,
      },
      {
        intakeName: 'Spring Semester 2027',
        intakeNameZh: '2027年春季学期',
        intakeNameLa: 'ພາກຮຽນລະດູໃບໄມ້ປົ່ງ 2027',
        intakeYear: '2027',
        openingDate: new Date('2026-10-15'),
        closingDate: new Date('2027-01-15'),
        deadlineDate: new Date('2027-01-15'),
        classesBeginDate: new Date('2027-02-15'),
        additionalNotes:
          '• Early application scholarship discounts apply.\n• Placement Exam 20th of January',
        additionalNotesZh:
          '• 提前申请可享奖学金优惠。\n• 1月20日举行分级考试。',
        additionalNotesLa:
          '• ໄດ້ຮັບສ່ວນຫຼຸດທຶນການສຶກສາສຳລັບຜູ້ສະໝັກໄວ.\n• ສອບເສັງວັດລະດັບວັນທີ 20 ມັງກອນ',
        status: 'Upcoming',
        statusZh: '即将开始',
        statusLa: 'ກຳລັງຈະເປີດຮັບ',
        order: 2,
      },
    ],
  });

  await (prisma as any).applicationReminder.deleteMany();
  await (prisma as any).applicationReminder.createMany({
    data: [
      {
        title: 'Early Application Advantage',
        titleZh: '提前申请优势',
        titleLa: 'ຂໍ້ໄດ້ປຽບຂອງການສະໝັກກ່ອນ',
        description:
          'Applicants who submit early receive priority consideration for merit scholarships and preferred course schedules.',
        descriptionZh:
          '提前申请者可优先参与优秀学生奖学金评审并选择心仪的课程时间。',
        descriptionLa:
          'ຜູ້ສະໝັກທີ່ສົ່ງເອກະສານກ່ອນ ຈະໄດ້ຮັບການພິຈາລະນາທຶນການສຶກສາ ແລະ ຕາຕະລາງຮຽນທີ່ຕ້ອງການກ່ອນ.',
        order: 1,
      },
      {
        title: 'Rolling Admissions Policy',
        titleZh: '滚动招生政策',
        titleLa: 'ນະໂຍບາຍຮັບສະໝັກແບບຕໍ່ເນື່ອງ',
        description:
          'We review applications as they are received. Decisions are typically released within 2 to 4 weeks after all required materials are verified.',
        descriptionZh:
          '我们按收到顺序审核申请。所有所需材料核实后，通常在2至4周内作出决定。',
        descriptionLa:
          'ພວກເຮົາກວດສອບໃບສະໝັກຕາມລຳດັບທີ່ໄດ້ຮັບ. ຜົນການພິຈາລະນາຈະແຈ້ງພາຍໃນ 2 ຫາ 4 ອາທິດຫຼັງຈາກກວດສອບເອກະສານຄົບຖ້ວນ.',
        order: 2,
      },
      {
        title: 'Placement Exam & Interview',
        titleZh: '分级考试与面试',
        titleLa: 'ການສອບເສັງວັດລະດັບ ແລະ ສຳພາດ',
        description:
          'Shortlisted candidates may be invited for an English proficiency placement test and brief interview with faculty advisors.',
        descriptionZh:
          '入围申请者可能受邀参加英语分级测试及与学业顾问的简短面试。',
        descriptionLa:
          'ຜູ້ສະໝັກທີ່ຜ່ານການຄັດເລືອກເບື້ອງຕົ້ນ ອາດຈະໄດ້ຮັບການເຊື້ອເຊີນໃຫ້ເຂົ້າສອບເສັງພາສາອັງກິດ ແລະ ສຳພາດສັ້ນໆກັບອາຈານທີ່ປຶກສາ.',
        order: 3,
      },
      {
        title: 'Visa & Housing Support for International Students',
        titleZh: '国际学生签证与住宿支持',
        titleLa: 'ການສະໜັບສະໜູນວີຊາ ແລະ ທີ່ພັກສຳລັບນັກສຶກສາຕ່າງປະເທດ',
        description:
          'Dedicated international student advisors will guide you through visa processing, dorm bookings, and airport pick-up.',
        descriptionZh: '国际学生专属顾问协助办理签证、预订宿舍及安排接机。',
        descriptionLa:
          'ທີ່ປຶກສານັກສຶກສາຕ່າງປະເທດຈະໃຫ້ຄຳແນະນຳຂັ້ນຕອນການຂໍວີຊາ, ຈອງຫໍພັກ ແລະ ຮັບສົ່ງສະໜາມບິນ.',
        order: 4,
      },
    ],
  });

  await prisma.admissionRequirement.deleteMany();
  await prisma.admissionRequirement.createMany({
    data: [
      {
        degreeLevel: 'Undergraduate',
        title: 'Undergraduate Program Requirements',
        titleZh: '本科课程入学要求',
        description:
          'Entry criteria for secondary school graduates seeking a Bachelor of Science or Bachelor of Arts degree at SIT.',
        descriptionZh:
          '面向申请 SIT 理学学士或文学学士的高中毕业生的入学标准。',
        requirementsList: JSON.stringify([
          'High School Diploma (BacII) with minimum Grade C or international equivalent (A-Levels, IB, GED)',
          'English Language Proficiency: IELTS 5.5+, TOEFL iBT 65+, or passing score on SIT English Placement Test',
          'Official high school academic transcripts for Grades 10, 11, and 12',
          'Copy of National Identification Card or Passport',
          'Two letters of recommendation from high school teachers or counselors',
          'Personal Statement / Motivation Letter (500 words)',
        ]),
        requirementsListZh: JSON.stringify([
          '高中毕业证书（BacII）成绩至少为C级，或同等国际资格（A-Levels、IB、GED）',
          '英语水平：雅思5.5及以上、托福 iBT 65及以上，或通过 SIT 英语分级考试',
          '10、11和12年级的正式高中成绩单',
          '身份证或护照复印件',
          '两封高中教师或升学顾问推荐信',
          '个人陈述／申请动机信（500词）',
        ]),
        order: 1,
      },
      {
        degreeLevel: 'Graduate',
        title: 'Master’s Degree Requirements',
        titleZh: '硕士学位入学要求',
        description:
          'Criteria for professionals and graduates pursuing an advanced Master of Science or MBA program.',
        descriptionZh: '面向攻读理学硕士或 MBA 的专业人士和毕业生的申请要求。',
        requirementsList: JSON.stringify([
          'Accredited Bachelor’s Degree in a relevant field with a minimum cumulative GPA of 3.0 / 4.0',
          'English Proficiency: IELTS 6.5+ or TOEFL iBT 80+',
          'Official undergraduate degree certificate and complete academic transcripts',
          'Updated Curriculum Vitae (CV) demonstrating relevant work or research experience',
          'Two academic or professional letters of recommendation',
          'Statement of Research & Career Intent (800 words)',
        ]),
        requirementsListZh: JSON.stringify([
          '相关领域认可学士学位，累计平均 GPA 至少为3.0／4.0',
          '英语水平：雅思6.5及以上或托福 iBT 80及以上',
          '正式本科学位证书及完整成绩单',
          '最新简历，说明相关工作或研究经历',
          '两封学术或职业推荐信',
          '研究与职业目标陈述（800词）',
        ]),
        order: 2,
      },
      {
        degreeLevel: 'International',
        title: 'International Student Admissions',
        titleZh: '国际学生招生',
        description:
          'Specific guidelines, visa assistance, and equivalency requirements for foreign applicants.',
        descriptionZh: '面向海外申请者的专门指南、签证协助及学历等值要求。',
        requirementsList: JSON.stringify([
          'Valid International Passport (minimum 1-year validity)',
          'Certified English translation of secondary school or university degree certificates',
          'Proof of English proficiency (IELTS, TOEFL, Duolingo English Test)',
          'Financial affidavit or bank statement verifying sufficient funds for tuition and living expenses',
          'Student Visa (Type E) application support provided upon acceptance',
        ]),
        requirementsListZh: JSON.stringify([
          '有效护照（有效期至少一年）',
          '中学或大学学历证书的认证英语译本',
          '英语水平证明（雅思、托福或多邻国英语测试）',
          '财务担保声明或银行证明，确认有足够资金支付学费与生活费',
          '录取后提供学生签证（E类）申请支持',
        ]),
        order: 3,
      },
    ],
  });

  // 14. Contact Info
  await prisma.contactInfo.deleteMany();
  await prisma.contactInfo.create({
    data: {
      address:
        'Building 123, Russian Federation Boulevard (110), Sangkat Teuk Thla, Khan Sen Sok, Phnom Penh, Kingdom of Cambodia',
      addressZh: '柬埔寨金边市森速区德他分区俄罗斯联邦大道110号123栋',
      phone: '+855 (0) 23 888 777 / +855 (0) 12 345 678',
      email: 'info@sit.edu.kh / admissions@sit.edu.kh',
      mapEmbedUrl:
        'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3794.7802457390835!2d102.6286178751789!3d17.98895818300444!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x312467e7bd8e66a5%3A0xf85c9af1fa1bea14!2sSoutsaka%20Institute%20of%20Technology!5e0!3m2!1sen!2sth!4v1787336679429!5m2!1sen!2sth',
      officeHours:
        'Monday - Friday: 08:00 AM - 05:00 PM, Saturday: 08:00 AM - 12:00 PM',
      officeHoursZh: '周一至周五：08:00–17:00；周六：08:00–12:00',
      socialLinks: JSON.stringify({
        facebook: 'https://facebook.com/situniversity',
        telegram: 'https://t.me/situniversity',
        linkedin: 'https://linkedin.com/school/situniversity',
        youtube: 'https://youtube.com/@situniversity',
      }),
    },
  });

  // 15. Downloadable Application Materials
  await (prisma as any).applicationMaterial.deleteMany();
  await (prisma as any).applicationMaterial.createMany({
    data: [
      {
        title: 'Application Checklist',
        titleZh: '申请材料清单',
        titleLa: 'ລາຍການກວດສອບການສະໝັກ',
        description:
          "Download our comprehensive PDF checklist to ensure you don't miss anything.",
        descriptionZh: '下载完整 PDF 清单，确保不遗漏任何材料。',
        descriptionLa:
          'ດາວໂຫຼດລາຍການກວດສອບ PDF ທີ່ຄົບຖ້ວນຂອງພວກເຮົາ ເພື່ອໃຫ້ແນ່ໃຈວ່າທ່ານບໍ່ພາດເອກະສານໃດໆ.',
        fileUrl: '/uploads/documents/sit_application_checklist.pdf',
        fileType: 'PDF',
        fileSize: '2.3 MB',
        icon: 'Download',
        badgeColor: '#00001C',
        order: 1,
        isActive: true,
      },
      {
        title: 'Full Admission Details',
        titleZh: '完整招生信息',
        titleLa: 'ລາຍລະອຽດການຮັບສະໝັກຄົບຊຸດ',
        description:
          'Tips and examples for crafting a compelling personal statement and application packet.',
        descriptionZh: '撰写出色个人陈述和申请材料的技巧与示例。',
        descriptionLa:
          'ຄຳແນະນຳ ແລະ ຕົວຢ່າງສຳລັບການຂຽນໃບສະແດງເຈດຈຳນົງ ແລະ ຊຸດເອກະສານການສະໝັກ.',
        fileUrl: '/uploads/documents/sit_full_admission_details.pdf',
        fileType: 'PDF',
        fileSize: '1.8 MB',
        icon: 'BookOpen',
        badgeColor: '#0400CC',
        order: 2,
        isActive: true,
      },
      {
        title: 'Document Requirements',
        titleZh: '材料要求',
        titleLa: 'ເງື່ອນໄຂເອກະສານປະກອບ',
        description:
          'Detailed list of all required documents with formatting and translation guidelines.',
        descriptionZh: '完整列出所需材料，并说明格式和翻译要求。',
        descriptionLa:
          'ລາຍການລະອຽດຂອງເອກະສານທີ່ຈຳເປັນທັງໝົດ ພ້ອມທັງຄຳແນະນຳການຈັດຮູບແບບ ແລະ ການແປ.',
        fileUrl: '/uploads/documents/sit_document_requirements.pdf',
        fileType: 'PDF',
        fileSize: '1.5 MB',
        icon: 'Download',
        badgeColor: '#6366F1',
        order: 3,
        isActive: true,
      },
      {
        title: 'Payment Plan',
        titleZh: '付款方案',
        titleLa: 'ແຜນການຊຳລະຄ່າຮຽນ',
        description:
          'Special guide for international and local applicants with scholarship options and fee schedules.',
        descriptionZh:
          '面向国际与本地申请者的特别指南，介绍奖学金选择及收费安排。',
        descriptionLa:
          'ຄູ່ມືພິເສດສຳລັບຜູ້ສະໝັກ ພ້ອມດ້ວຍທາງເລືອກທຶນການສຶກສາ ແລະ ຕາຕະລາງການຊຳລະຄ່າທຳນຽມ.',
        fileUrl: '/uploads/documents/sit_payment_plan.pdf',
        fileType: 'PDF',
        fileSize: '3.2 MB',
        icon: 'BookOpen',
        badgeColor: '#A855F7',
        order: 4,
        isActive: true,
      },
    ],
  });
  console.log('✅ Admissions, Contact & Application Materials seeded');

  console.log('🎉 Database seeding finished successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
