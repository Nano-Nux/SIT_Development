import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting SIT University database seeding...');

  // 1. Admin Account
  const passwordHash = await bcrypt.hash('admin123', 10);
  const admin = await prisma.admin.upsert({
    where: { email: 'admin@sit.edu.kh' },
    update: { passwordHash, name: 'SIT Super Admin', role: 'SUPER_ADMIN' },
    create: {
      email: 'admin@sit.edu.kh',
      passwordHash,
      name: 'SIT Super Admin',
      role: 'SUPER_ADMIN',
    },
  });
  console.log('✅ Admin user created:', admin.email);

  // 2. Hero Sections
  const heroes = [
    {
      page: 'HOME',
      title: 'Shaping Future Leaders Through Innovation & Excellence',
      subtitle: 'WELCOME TO SIT UNIVERSITY',
      description: 'Empowering students with world-class education, practical industry mastery, state-of-the-art research laboratories, and global career opportunities.',
      buttonText: 'Explore Programs',
      buttonUrl: '/academics',
      imageUrl: '/images/home_desktopview/img_1.jpg',
      image2Url: '/images/home_desktopview/img_1.jpg',
      image3Url: '/images/home_desktopview/img_2.jpg',
      image4Url: '/images/home_desktopview/img_1.jpg',
    },
    {
      page: 'ADMISSIONS',
      title: 'Your Future Starts Here at SIT University',
      subtitle: 'ADMISSIONS 2026-2027',
      description: 'Join a vibrant community of thinkers, creators, and innovators. Discover academic requirements, scholarship opportunities, and simple application steps.',
      buttonText: 'Apply Now',
      buttonUrl: '/apply',
      imageUrl: '/images/admissions_desktopview/img_1.jpg',
    },
    {
      page: 'ABOUT',
      title: 'About Us',
      titleLa: 'ກ່ຽວກັບພວກເຮົາ',
      subtitle: 'DISCOVER SIT',
      subtitleLa: 'ຄົ້ນພົບ SIT',
      description: 'Building the future of Laos through excellence in technology, innovation, and leadership.',
      descriptionLa: 'ສ້າງອະນາຄົດຂອງປະເທດລາວ ຜ່ານຄວາມເປັນເລີດດ້ານເຕັກໂນໂລຊີ, ນະວັດຕະກຳ ແລະ ຄວາມເປັນຜູ້ນຳ.',
      buttonText: 'Meet Leadership',
      buttonUrl: '/about#leadership',
      imageUrl: '/images/about/hero_bg.jpg',
    },
    {
      page: 'ACADEMICS',
      title: 'Academic Programs at SIT',
      titleLa: 'ຫຼັກສູດວິຊາການ ທີ່ SIT',
      subtitle: 'EXCELLENCE IN EDUCATION',
      subtitleLa: 'ຄວາມເປັນເລີດດ້ານການສຶກສາ',
      description: 'Our degree programs blend rigorous academic foundations with hands-on project labs, international exchange, and direct corporate mentorship.',
      buttonText: 'View Departments',
      buttonUrl: '/academics#departments',
      imageUrl: '/images/academics_desktopview/img_1.jpg',
    },
    {
      page: 'LIFE_AT_SIT',
      title: 'Life at SIT',
      titleLa: 'ຊີວິດທີ່ SIT',
      subtitle: 'VIBRANT COMMUNITY',
      subtitleLa: 'ຊຸມຊົນທີ່ມີຊີວິດຊີວາ',
      description: 'More than just classrooms. Experience a vibrant ecosystem of culture, creativity, and connection where every day is an opportunity to grow.',
      descriptionLa: 'ຫຼາຍກວ່າຫ້ອງຮຽນ. ສຳຜັດກັບລະບົບນິເວດທີ່ມີຊີວິດຊີວາຂອງວັດທະນະທຳ, ຄວາມຄິດສ້າງສັນ ແລະ ການເຊື່ອມຕໍ່ ບ່ອນທີ່ທຸກມື້ແມ່ນໂອກາດໃນການເຕີບໃຫຍ່.',
      buttonText: 'Explore Clubs',
      buttonUrl: '/life-at-sit#activities',
      imageUrl: '/images/life_at_sit_desktopview/img_1.jpg',
    },
    {
      page: 'COLLABORATIONS',
      title: 'Collaboration with SIT',
      titleLa: 'ການຮ່ວມມືກັບ SIT',
      subtitle: 'GLOBAL PARTNERSHIPS',
      description: 'Partnering with prestigious universities worldwide and Fortune 500 tech leaders to deliver international exchange, dual degrees, and direct hiring.',
      buttonText: 'Partner With Us',
      buttonUrl: '/collaborations#partner',
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
        titleLa: 'ນະວັດຕະກຳ',
        description: 'We foster creativity and forward-thinking approaches to solve complex challenges facing our world.',
        descriptionLa: 'ພວກເຮົາສົ່ງເສີມຄວາມຄິດສ້າງສັນ ແລະ ວິທີການຄິດໄປຂ້າງໜ້າ ເພື່ອແກ້ໄຂສິ່ງທ້າທາຍທີ່ຊັບຊ້ອນຂອງໂລກ.',
        icon: 'Lightbulb',
        order: 1,
        isActive: true,
      },
      {
        title: 'Inclusivity',
        titleLa: 'ຄວາມທົ່ວເຖິງ',
        description: 'We celebrate diversity and ensure equal opportunities for all students regardless of background.',
        descriptionLa: 'ພວກເຮົາສະເຫຼີມສະຫຼອງຄວາມຫຼາກຫຼາຍ ແລະ ຮັບປະກັນໂອກາດທີ່ເທົ່າທຽມສຳລັບນັກສຶກສາທຸກຄົນ.',
        icon: 'Users',
        order: 2,
        isActive: true,
      },
      {
        title: 'Excellence',
        titleLa: 'ຄວາມເປັນເລີດ',
        description: 'We pursue the highest standards in teaching, research, and student achievement.',
        descriptionLa: 'ພວກເຮົາມຸ່ງໝັ້ນສູ່ມາດຕະຖານສູງສຸດໃນການຮຽນການສອນ, ການວິໄຈ ແລະ ຜົນສຳເລັດຂອງນັກສຶກສາ.',
        icon: 'Award',
        order: 3,
        isActive: true,
      },
      {
        title: 'Integrity',
        titleLa: 'ຄວາມຊື່ສັດ & ຈັນຍາບັນ',
        description: 'We uphold honesty, transparency, and ethical conduct in all our endeavors.',
        descriptionLa: 'ພວກເຮົາຍຶດໝັ້ນຄວາມຊື່ສັດ, ຄວາມໂປ່ງໃສ ແລະ ຄວາມປະພຶດທີ່ຖືກຕ້ອງຕາມຈັນຍາບັນ.',
        icon: 'Shield',
        order: 4,
        isActive: true,
      },
      {
        title: 'Global Citizenship',
        titleLa: 'ຄວາມເປັນພົນລະເມືອງໂລກ',
        description: 'We prepare students to think globally while acting locally to create positive impact.',
        descriptionLa: 'ພວກເຮົາກຽມຄວາມພ້ອມໃຫ້ນັກສຶກສາຄິດໃນລະດັບສາກົນ ພ້ອມທັງລົງມືປະຕິບັດໃນລະດັບທ້ອງຖິ່ນເພື່ອສ້າງຜົນກະທົບທາງບວກ.',
        icon: 'Globe',
        order: 5,
        isActive: true,
      },
      {
        title: 'Sustainability',
        titleLa: 'ຄວາມຍືນຍົງ',
        description: 'We commit to practices that ensure environmental and social responsibility for future generations.',
        descriptionLa: 'ພວກເຮົາຍຶດໝັ້ນໃນການປະຕິບັດທີ່ຮັບປະກັນຄວາມຮັບຜິດຊອບຕໍ່ສິ່ງແວດລ້ອມ ແລະ ສັງຄົມ.',
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
        slug: 'information-technology',
        description: 'Master software engineering, cloud computing, cyber defense, and artificial intelligence with hands-on lab environments.',
        imageUrl: '/images/home_desktopview/img_2.jpg',
        order: 1,
        isActive: true,
      },
      {
        title: 'Business Administration & Economics',
        slug: 'business-administration-economics',
        description: 'Gain strategic business acumen, international financial mastery, entrepreneurial leadership, and econometric analysis skills.',
        imageUrl: '/images/home_desktopview/img_3.jpg',
        order: 2,
        isActive: true,
      },
      {
        title: 'Communication Arts',
        slug: 'communication-arts',
        description: 'Excel in digital media production, public relations, strategic corporate storytelling, and creative multimedia design.',
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
      nameLa: 'ພາກວິຊາເຕັກໂນໂລຊີຂໍ້ມູນຂ່າວສານ',
      slug: 'it',
      description: 'The Bachelor of Computer Science (Computer Programming) undergraduate program is designed to equip students with both theoretical knowledge and practical skills in modern computing.',
      descriptionLa: 'ຫຼັກສູດປະລິນຍາຕີວິທະຍາສາດຄອມພິວເຕີ ຖືກອອກແບບມາເພື່ອສ້າງນັກສຶກສາໃຫ້ມີຄວາມຮູ້ດ້ານທິດສະດີ ແລະ ທັກສະການປະຕິບັດຕົວຈິງໃນຍຸກຄອມພິວເຕີທີ່ທັນສະໄໝ.',
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
      careerOutcomeDesc: "Our graduates are highly sought after by top tech companies worldwide. Here's where your IT degree from SIT can take you.",
      careerOutcomeDescLa: 'ນັກສຶກສາທີ່ຈົບການສຶກສາຈາກພວກເຮົາແມ່ນເປັນທີ່ຕ້ອງການສູງຈາກບໍລິສັດເຕັກໂນໂລຊີຊັ້ນນຳທົ່ວໂລກ. ນີ້ຄືເສັ້ນທາງອາຊີບທີ່ປະລິນຍາໄອທີຈາກ SIT ຈະນຳພາທ່ານໄປ.',
      // Field 6: Career Outcomes Boxes
      careerPlacementRate: '95%',
      careerPlacementRateLa: '95%',
      careerAvgSalary: '$92K',
      careerAvgSalaryLa: '$92K',
      careerPartnerCompanies: '200+',
      careerPartnerCompaniesLa: '200+',
      careerTimeToEmployment: '3 Months',
      careerTimeToEmploymentLa: '3 ເດືອນ',
    },
  });

  const deptBA = await prisma.department.create({
    data: {
      name: 'Department of Business Administration & Economics',
      nameLa: 'ພາກວິຊາບໍລິຫານທຸລະກິດ ແລະ ເສດຖະສາດ',
      slug: 'ba-economics',
      description: 'Equipping future business titans, financial strategists, and innovative entrepreneurs with cutting-edge analytics, global market insights, and sustainable leadership practices.',
      descriptionLa: 'ສ້າງຜູ້ນຳທຸລະກິດ, ນັກຍຸດທະສາດການເງິນ ແລະ ຜູ້ປະກອບການລຸ້ນໃໝ່ ດ້ວຍການວິເຄາະທີ່ທັນສະໄໝ, ຄວາມເຂົ້າໃຈຕະຫຼາດໂລກ ແລະ ຄວາມເປັນຜູ້ນຳແບບຍືນຍົງ.',
      heroImage: '/images/department_ba___economics_desktopview/img_1.jpg',
      imageUrl: '/images/home_desktopview/img_3.jpg',
      order: 2,
      isActive: true,
      // Field 3: box-description is optional (left null for non-CS)
      boxDescriptions: null,
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
      coreFocusAreasLa: JSON.stringify([
        'ການເງິນສາກົນ',
        'ການຄຸ້ມຄອງຍຸດທະສາດ',
        'ການຕະຫຼາດລະດັບໂລກ',
        'ການເປັນຜູ້ປະກອບການ',
        'ເສດຖະມິຕິປະຍຸກ',
        'ລະບົບໂລຈິສຕິກສ໌',
      ]),
      // Field 5: Career Outcome Description
      careerOutcomeDesc: 'Graduates excel across multinational corporations, investment funds, fintech ventures, and consulting firms globally.',
      careerOutcomeDescLa: 'ນັກສຶກສາທີ່ຈົບການສຶກສາປະສົບຜົນສຳເລັດໃນບໍລິສັດຂ້າມຊາດ, ກອງທຶນການລົງທຶນ, ທຸລະກິດຟິນເທັກ ແລະ ບໍລິສັດທີ່ປຶກສາທົ່ວໂລກ.',
      // Field 6: Career Outcomes Boxes
      careerPlacementRate: '94%',
      careerPlacementRateLa: '94%',
      careerAvgSalary: '$78K',
      careerAvgSalaryLa: '$78K',
      careerPartnerCompanies: '150+',
      careerPartnerCompaniesLa: '150+',
      careerTimeToEmployment: '4 Months',
      careerTimeToEmploymentLa: '4 ເດືອນ',
    },
  });

  const deptCA = await prisma.department.create({
    data: {
      name: 'Department of Communication Arts',
      nameLa: 'ພາກວິຊານິເທດສາດ ແລະ ສິລະປະການສື່ສານ',
      slug: 'communication-arts',
      description: 'Fostering innovative media creators, PR experts, and brand communicators equipped with state-of-the-art digital broadcast studios and storytelling expertise.',
      descriptionLa: 'ສ້າງຜູ້ສ້າງສັນສື່ລຸ້ນໃໝ່, ຊ່ຽວຊານດ້ານ PR ແລະ ນັກສື່ສານແບຣນ ດ້ວຍຫ້ອງສະຕູດິໂອດິຈິທັລທີ່ທັນສະໄໝ.',
      heroImage: '/images/department_communication_arts_desktopview/img_1.jpg',
      imageUrl: '/images/home_desktopview/img_4.jpg',
      order: 3,
      isActive: true,
      // Field 3: box-description is optional (left null)
      boxDescriptions: null,
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
      coreFocusAreasLa: JSON.stringify([
        'ການຜະລິດສື່ດິຈິທັລ',
        'ການປະຊາສຳພັນ & ເລົ່າເລື່ອງແບຣນ',
        'ວາລະສານກະຈາຍສຽງ',
        'ການອອກແບບພາບ & ໂມຊັ່ນ',
        'ການວິເຄາະໂຊຊຽວມີເດຍ',
        'ການຂຽນບົດໂຄສະນາສ້າງສັນ',
      ]),
      // Field 5: Career Outcome Description
      careerOutcomeDesc: 'Our creative graduates thrive across top advertising networks, film production studios, broadcast agencies, and brand consultancies.',
      careerOutcomeDescLa: 'ນັກສຶກສາສາຍສື່ສານຂອງພວກເຮົາເຕີບໃຫຍ່ໃນເຄືອຂ່າຍໂຄສະນາຊັ້ນນຳ, ສະຕູດິໂອຜະລິດຮູບເງົາ ແລະ ບໍລິສັດສື່ລະດັບສາກົນ.',
      // Field 6: Career Outcomes Boxes
      careerPlacementRate: '92%',
      careerPlacementRateLa: '92%',
      careerAvgSalary: '$65K',
      careerAvgSalaryLa: '$65K',
      careerPartnerCompanies: '100+',
      careerPartnerCompaniesLa: '100+',
      careerTimeToEmployment: '3 Months',
      careerTimeToEmploymentLa: '3 ເດືອນ',
    },
  });

  // Programs
  const progCS = await prisma.program.create({
    data: {
      name: 'Bachelor of Science in Computer Science & Software Engineering',
      slug: 'computer-science',
      degree: 'Bachelor',
      duration: '4 Years (8 Semesters)',
      description: 'A comprehensive curriculum covering data structures, software architecture, full-stack web and mobile development, distributed systems, and AI integration.',
      heroImage: '/images/academics_desktopview/img_1.jpg',
      coreFocusAreas: JSON.stringify([
        'Full-Stack Web & Mobile Architecture',
        'Cloud Computing & DevOps CI/CD',
        'Artificial Intelligence & Algorithms',
        'Cybersecurity & Network Defense',
      ]),
      departmentId: deptIT.id,
      order: 1,
      isPublished: true,
    },
  });

  const progAI = await prisma.program.create({
    data: {
      name: 'Bachelor of Science in Data Science & Artificial Intelligence',
      slug: 'data-science-ai',
      degree: 'Bachelor',
      duration: '4 Years (8 Semesters)',
      description: 'Specialized program focusing on statistical machine learning, deep neural networks, big data engineering, computer vision, and NLP application.',
      heroImage: '/images/academics_desktopview/img_2.jpg',
      coreFocusAreas: JSON.stringify([
        'Deep Learning & Neural Networks',
        'Big Data Processing with Spark/Hadoop',
        'Natural Language Processing & LLMs',
        'Predictive Analytics & Visualization',
      ]),
      departmentId: deptIT.id,
      order: 2,
      isPublished: true,
    },
  });

  const progIB = await prisma.program.create({
    data: {
      name: 'Bachelor of Business Administration in International Business',
      slug: 'international-business',
      degree: 'Bachelor',
      duration: '4 Years (8 Semesters)',
      description: 'Prepares students for global enterprise management, cross-border negotiation, international marketing, and global financial operations.',
      heroImage: '/images/academics_desktopview/img_3.jpg',
      coreFocusAreas: JSON.stringify([
        'Global Strategic Management',
        'International Financial Markets',
        'Cross-Cultural Negotiations',
        'Supply Chain & Global Logistics',
      ]),
      departmentId: deptBA.id,
      order: 3,
      isPublished: true,
    },
  });

  const progDM = await prisma.program.create({
    data: {
      name: 'Bachelor of Arts in Digital Media & Communication',
      slug: 'digital-media-communication',
      degree: 'Bachelor',
      duration: '4 Years (8 Semesters)',
      description: 'A hands-on program blending digital storytelling, multimedia production, brand reputation management, and creative advertising campaigns.',
      heroImage: '/images/academics_desktopview/img_4.jpg',
      coreFocusAreas: JSON.stringify([
        'Digital Video & Audio Production',
        'Brand Strategy & Public Relations',
        'Interactive Media & UI/UX Design',
        'Content Marketing & Social Campaigns',
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
        position: 'Dean & Professor of Computer Science',
        departmentName: 'Department of Information Technology',
        biography: 'PhD in Computer Science from MIT with over 15 years of industry and academic experience in distributed systems and software reliability.',
        imageUrl: '/images/home_desktopview/img_5.jpg',
        email: 's.jenkins@sit.edu.kh',
        departmentId: deptIT.id,
        order: 1,
        isFeatured: true,
      },
      {
        name: 'Prof. David Chen',
        position: 'Head & Professor of Business Administration',
        departmentName: 'Department of Business Administration & Economics',
        biography: 'Former Senior World Bank Advisor and Harvard PhD in Economics specializing in emerging markets and international trade policy.',
        imageUrl: '/images/home_desktopview/img_6.jpg',
        email: 'd.chen@sit.edu.kh',
        departmentId: deptBA.id,
        order: 2,
        isFeatured: true,
      },
      {
        name: 'Dr. Elena Rostova',
        position: 'Chair of Communication Arts',
        departmentName: 'Department of Communication Arts',
        biography: 'PhD in Media Studies from Oxford University, award-winning documentary director and media strategist.',
        imageUrl: '/images/about_desktopview/img_2.jpg',
        email: 'e.rostova@sit.edu.kh',
        departmentId: deptCA.id,
        order: 3,
        isFeatured: true,
      },
      {
        name: 'Prof. Alexander Kim',
        position: 'Associate Professor of Machine Learning',
        departmentName: 'Department of Information Technology',
        biography: 'Leading researcher in neural language processing and autonomous robotics with numerous IEEE publications.',
        imageUrl: '/images/about_desktopview/img_3.jpg',
        email: 'a.kim@sit.edu.kh',
        departmentId: deptIT.id,
        order: 4,
        isFeatured: true,
      },
      {
        name: 'Dr. Somnang Ly',
        position: 'Senior Lecturer in Quantitative Finance',
        departmentName: 'Department of Business Administration & Economics',
        biography: 'Specialist in algorithmic trading, financial econometrics, and Fintech regulatory compliance.',
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
        position: 'Director of Computing Programs',
        departmentName: 'Department of Information Technology',
        biography: 'Directing the flagship software engineering curriculum and overseeing capstone industrial partnerships.',
        imageUrl: '/images/home_desktopview/img_5.jpg',
        email: 's.jenkins@sit.edu.kh',
        programId: progCS.id,
        order: 1,
      },
      {
        name: 'Prof. David Chen',
        position: 'Director of International Business Programs',
        departmentName: 'Department of Business Administration & Economics',
        biography: 'Overseeing global exchange partnerships and dual degree programs with partner universities.',
        imageUrl: '/images/home_desktopview/img_6.jpg',
        email: 'd.chen@sit.edu.kh',
        programId: progIB.id,
        order: 2,
      },
      {
        name: 'Dr. Elena Rostova',
        position: 'Director of Media & Communication Studies',
        departmentName: 'Department of Communication Arts',
        biography: 'Managing multimedia studio labs and digital broadcast student productions.',
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
        subtitle: 'STUDENT SUCCESS STORY',
        quote: 'SIT’s hands-on engineering lab projects and career center mentorship enabled me to secure an international software developer role before graduation.',
        description: 'Sovannarath built an AI-powered diagnostic tool during his senior year at SIT, which won regional recognition at the ASEAN Tech Challenge.',
        authorName: 'Sovannarath Keo',
        authorRole: 'Class of 2025 • Computer Science Graduate',
        imageUrl: '/images/home_desktopview/img_2.jpg',
        order: 1,
        isActive: true,
      },
      {
        type: 'FACULTY',
        title: 'Pioneering Research in Machine Learning Applications',
        subtitle: 'FACULTY SPOTLIGHT',
        quote: 'At SIT, we empower our students not just to consume modern technologies, but to author and invent solutions that advance society.',
        description: 'Dr. Sarah Jenkins recently published groundbreaking research on decentralized data systems in collaboration with international researchers.',
        authorName: 'Dr. Sarah Jenkins',
        authorRole: 'Dean & Professor of Computer Science',
        imageUrl: '/images/home_desktopview/img_5.jpg',
        order: 2,
        isActive: true,
      },
      {
        type: 'ALUMNI',
        title: 'Building an Award-Winning Fintech Venture',
        subtitle: 'ALUMNI SUCCESS STORY',
        quote: 'The mentorship from professors and access to SIT’s incubation fund gave our team the resources to turn a classroom idea into a real company.',
        description: 'Maya and her team founded PayBridge, an innovative cross-border payment solution that closed seed funding in early 2026.',
        authorName: 'Maya Lin',
        authorRole: 'Class of 2024 • International Business Alumni',
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
        nameLa: 'ມະຫາວິທະຍາໄລ ຊິ ຈ້ຽນ (Shih Chien)',
        type: 'UNIVERSITY',
        logoUrl: '/images/collaborations_desktopview/img_2.png',
        websiteUrl: 'https://www.usc.edu.tw',
        country: 'Taiwan',
        countryLa: 'ໄຕ້ຫວັນ',
        order: 1,
      },
      {
        name: 'Thaksin University',
        nameLa: 'ມະຫາວິທະຍາໄລ ທັກສິນ (Thaksin)',
        type: 'UNIVERSITY',
        logoUrl: '/images/collaborations_desktopview/img_3.png',
        websiteUrl: 'https://www.tsu.ac.th',
        country: 'Thailand',
        countryLa: 'ໄທ',
        order: 2,
      },
      {
        name: 'University of the Thai Chamber of Commerce (UTCC)',
        nameLa: 'ມະຫາວິທະຍາໄລ ຫໍການຄ້າໄທ',
        type: 'UNIVERSITY',
        logoUrl: '/images/collaborations_desktopview/img_4.png',
        websiteUrl: 'https://www.utcc.ac.th',
        country: 'Thailand',
        countryLa: 'ໄທ',
        order: 3,
      },
      {
        name: 'Thammasat University',
        nameLa: 'ມະຫາວິທະຍາໄລ ທຳມະສາດ',
        type: 'UNIVERSITY',
        logoUrl: '/images/collaborations_desktopview/img_5.png',
        websiteUrl: 'https://www.tu.ac.th',
        country: 'Thailand',
        countryLa: 'ໄທ',
        order: 4,
      },
      {
        name: 'Shandong Business Institute',
        nameLa: 'ສະຖາບັນທຸລະກິດ ຊານຕົງ',
        type: 'UNIVERSITY',
        logoUrl: '/images/collaborations_desktopview/img_6.png',
        websiteUrl: 'https://www.sdsctc.edu.cn',
        country: 'China',
        countryLa: 'ຈີນ',
        order: 5,
      },
      {
        name: "King Mongkut's University of Technology North Bangkok",
        nameLa: 'ມະຫາວິທະຍາໄລເຕັກໂນໂລຊີພະຈອມເກົ້າພະນະຄອນເໜືອ',
        type: 'UNIVERSITY',
        logoUrl: '/images/collaborations_desktopview/img_7.png',
        websiteUrl: 'https://www.kmutnb.ac.th',
        country: 'Thailand',
        countryLa: 'ໄທ',
        order: 6,
      },
      {
        name: 'Universitas Ciputra',
        nameLa: 'ມະຫາວິທະຍາໄລ ຈີປູຕຣາ (Ciputra)',
        type: 'UNIVERSITY',
        logoUrl: '/images/collaborations_desktopview/img_8.png',
        websiteUrl: 'https://www.uc.ac.id',
        country: 'Indonesia',
        countryLa: 'ອິນໂດເນເຊຍ',
        order: 7,
      },
      {
        name: 'Harbour.Space Institute of Technology',
        nameLa: 'ສະຖາບັນເຕັກໂນໂລຊີ ຮາເບີ.ສະເປສ',
        type: 'UNIVERSITY',
        logoUrl: '/images/collaborations_desktopview/img_9.png',
        websiteUrl: 'https://harbour.space',
        country: 'Spain / Thailand',
        countryLa: 'ແອັດສະປາຍ / ໄທ',
        order: 8,
      },
      // Industry Partners
      {
        name: 'Lao Brewery Co., Ltd.',
        nameLa: 'ບໍລິສັດ ເບຍລາວ ຈຳກັດ',
        type: 'INDUSTRY',
        logoUrl: '/images/collaborations_desktopview/img_10.png',
        websiteUrl: 'https://beerlao.la',
        country: 'Laos',
        countryLa: 'ລາວ',
        order: 9,
      },
      {
        name: 'Star Telecom (Unitel)',
        nameLa: 'ສະຕາ ໂທລະຄົມ (ຢູນີເທວ)',
        type: 'INDUSTRY',
        logoUrl: '/images/collaborations_desktopview/img_11.png',
        websiteUrl: 'https://unitel.com.la',
        country: 'Laos',
        countryLa: 'ລາວ',
        order: 10,
      },
      {
        name: 'Reactor School',
        nameLa: 'ໂຮງຮຽນ ຣີແອັກເຕີ (Reactor)',
        type: 'INDUSTRY',
        logoUrl: '/images/collaborations_desktopview/img_12.png',
        websiteUrl: 'https://reactor.school',
        country: 'Singapore',
        countryLa: 'ສິງກະໂປ',
        order: 11,
      },
      {
        name: 'Crowne Plaza Vientiane',
        nameLa: 'ຄຣາວ ພາຊາ ວຽງຈັນ',
        type: 'INDUSTRY',
        logoUrl: '/images/collaborations_desktopview/img_14.png',
        websiteUrl: 'https://vientiane.crowneplaza.com',
        country: 'Laos',
        countryLa: 'ລາວ',
        order: 12,
      },
      {
        name: 'SeaBridge',
        nameLa: 'ຊີບຣິດຈ໌ (SeaBridge)',
        type: 'INDUSTRY',
        logoUrl: '/images/collaborations_desktopview/img_15.png',
        websiteUrl: 'https://seabridge.com',
        country: 'Global',
        countryLa: 'ສາກົນ',
        order: 13,
      },
      {
        name: 'BAIC Motor',
        nameLa: 'ບີເອໄອຊີ ມໍເຕີ (BAIC)',
        type: 'INDUSTRY',
        logoUrl: '/images/collaborations_desktopview/img_16.png',
        websiteUrl: 'https://baicintl.com',
        country: 'Global',
        countryLa: 'ສາກົນ',
        order: 14,
      },
      {
        name: 'Lao Art Media',
        nameLa: 'ລາວ ອາດ ມີເດຍ',
        type: 'INDUSTRY',
        logoUrl: '/images/collaborations_desktopview/img_17.png',
        websiteUrl: 'https://laoartmedia.com',
        country: 'Laos',
        countryLa: 'ລາວ',
        order: 15,
      },
      {
        name: 'Foton Motor',
        nameLa: 'ໂຟຕອນ ມໍເຕີ (Foton)',
        type: 'INDUSTRY',
        logoUrl: '/images/collaborations_desktopview/img_18.png',
        websiteUrl: 'https://foton-global.com',
        country: 'Global',
        countryLa: 'ສາກົນ',
        order: 16,
      },
      {
        name: 'LAILAOLAB ICT Solution',
        nameLa: 'ໄລລາວແລັບ ໄອຊີທີ ໂຊລູຊັ່ນ',
        type: 'INDUSTRY',
        logoUrl: '/images/collaborations_desktopview/img_19.png',
        websiteUrl: 'https://lailaolab.com',
        country: 'Laos',
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
        nameLa: 'ສູນສິລະປະ ແລະ ວັດທະນະທຳ',
        description: 'A grand auditorium and dedicated rehearsal stage for theater, traditional Lao dance, and musical performances.',
        descriptionLa: 'ຫໍປະຊຸມໃຫຍ່ ແລະ ເວທີຝຶກຊ້ອມສຳລັບລະຄອນເວທີ, ການຟ້ອນພື້ນເມືອງລາວ ແລະ ການສະແດງດົນຕີ.',
        imageUrl: '/images/life_at_sit_desktopview/img_3.jpg',
        actionType: 'MODAL',
        modalTitle: 'Art Society & Cultural Center Tour',
        modalTitleLa: 'ຢ້ຽມຊົມສູນສິລະປະ ແລະ ວັດທະນະທຳ',
        modalContent: 'Equipped with professional stage lighting, acoustic soundproofing, dressing rooms, and seating for over 500 audience members. Hosts annual cultural galas, youth showcases, and drama productions.',
        modalContentLa: 'ປະກອບດ້ວຍລະບົບແສງສຽງເວທີລະດັບມືອາຊີບ, ຫ້ອງແຕ່ງຕົວ ແລະ ບ່ອນນັ່ງຮອງຮັບຜູ້ຊົມຫຼາຍກວ່າ 500 ທີ່ນັ່ງ. ໃຊ້ສຳລັບຈັດງານເທດສະການວັດທະນະທຳປະຈຳປີ ແລະ ການສະແດງລະຄອນເວທີ.',
        order: 1,
      },
      {
        name: 'Sports Athletic Union & Arena',
        nameLa: 'ສະໜາມກິລາ ແລະ ສູນອອກກຳລັງກາຍ',
        description: 'Championship-grade athletic grounds hosting varsity football matches, track meets, and collegiate leagues.',
        descriptionLa: 'ສະໜາມກິລາມາດຕະຖານສາກົນສຳລັບການແຂ່ງຂັນບານເຕະ, ແລ່ນ-ລານ ແລະ ລີກກິລາມະຫາວິທະຍາໄລ.',
        imageUrl: '/images/life_at_sit_desktopview/img_4.jpg',
        actionType: 'MODAL',
        modalTitle: 'Sports Athletic Complex & Arena',
        modalTitleLa: 'ສະໜາມກິລາ ແລະ ສະໂມສອນກິລາ',
        modalContent: 'Features synthetic turf football pitch, multi-purpose courts for basketball and volleyball, professional training equipment, and spectator seating.',
        modalContentLa: 'ປະກອບດ້ວຍສະໜາມບານເຕະຫຍ້າທຽມ, ສະໜາມບານບ້ວງ ແລະ ບານສົ່ງ, ອຸປະກອນຝຶກຊ້ອມມາດຕະຖານ ແລະ ອັດສະຈັນຊົມກິລາ.',
        order: 2,
      },
      {
        name: 'Vocal Ensemble & Music Hall',
        nameLa: 'ຫ້ອງຊ້ອມດົນຕີ ແລະ ວົງຂັບຮ້ອງ',
        description: 'Soundproofed acoustic studios and performance halls for vocal choirs, live modern bands, and audio recording.',
        descriptionLa: 'ສະຕູດິໂອສຽງ ແລະ ຫ້ອງສະແດງດົນຕີສຳລັບວົງຂັບຮ້ອງ, ວົງດົນຕີສາກົນ ແລະ ການບັນທຶກສຽງ.',
        imageUrl: '/images/life_at_sit_desktopview/img_6.jpg',
        actionType: 'MODAL',
        modalTitle: 'Vocal Ensemble & Music Studios',
        modalTitleLa: 'ຫ້ອງຊ້ອມດົນຕີ ແລະ ສະຕູດິໂອບັນທຶກສຽງ',
        modalContent: 'State-of-the-art music chambers with acoustic paneling, grand pianos, synthesizers, microphones, and digital audio workstations for music student creators.',
        modalContentLa: 'ຫ້ອງດົນຕີທັນສະໄໝພ້ອມລະບົບກັນສຽງສະທ້ອນ, ເປຍໂນ, ຊິນທິໄຊເຊີ, ໄມໂຄຣໂຟນ ແລະ ໂປຣແກຣມບັນທຶກສຽງດິຈິທັລ.',
        order: 3,
      },
      {
        name: 'MC Committee & Media Broadcast Stage',
        nameLa: 'ເວທີພິທີກອນ ແລະ ຫ້ອງກະຈາຍສຽງ',
        description: 'Professional public speaking podiums, television podcast studios, and master-of-ceremonies training spaces.',
        descriptionLa: 'ເວທີຝຶກອົບຮົມພິທີກອນ, ສະຕູດິໂອພອດແຄສ ແລະ ການກະຈາຍສຽງໂທລະພາບລະດັບມືອາຊີບ.',
        imageUrl: '/images/life_at_sit_desktopview/img_7.jpg',
        actionType: 'MODAL',
        modalTitle: 'MC Committee & Media Studios',
        modalTitleLa: 'ສູນພັດທະນາພິທີກອນ ແລະ ສື່ກະຈາຍສຽງ',
        modalContent: 'Dedicated facilities for student emcees, debate societies, and campus news broadcasters with 4K multi-cam capture and live-streaming equipment.',
        modalContentLa: 'ສະຖານທີ່ສະເພາະສຳລັບພິທີກອນນັກສຶກສາ, ຊົມຮົມໂຕ້ວາທີ ແລະ ທີມຂ່າວວິທະຍາເຂດ ພ້ອມກ້ອງ 4K ແລະ ອຸປະກອນຖ່າຍທອດສົດ.',
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
        titleLa: 'ສະເຫຼີມສະຫຼອງ 68 ປີ ແຫ່ງຄວາມເປັນເລີດ ຮ່ວມກັບ ມະຫາວິທະຍາໄລ ຊິ ຈ້ຽນ (Shih Chien)',
        slug: 'celebrating-68-years-shih-chien-university',
        summary: 'SIT delegates participated in the grand 68th anniversary celebration of partner institution Shih Chien University in Taiwan.',
        summaryLa: 'ຄະນະຜູ້ຕາງໜ້າ SIT ເຂົ້າຮ່ວມພິທີສະເຫຼີມສະຫຼອງຄົບຮອບ 68 ປີ ຂອງມະຫາວິທະຍາໄລຄູ່ຮ່ວມມື ຊິ ຈ້ຽນ ທີ່ໄຕ້ຫວັນ.',
        content: 'SIT delegates participated in the grand 68th anniversary celebration of partner institution Shih Chien University in Taiwan, deepening bilateral dual-degree collaboration and academic faculty exchange.',
        category: 'International',
        imageUrl: '/images/life_at_sit_desktopview/img_8.jpg',
        author: 'SIT Global Relations',
        publishedAt: new Date('2026-08-15'),
        isPublished: true,
        views: 1850,
      },
      {
        title: 'The Director received the "Educational Excellence" Award in Kuala Lumpur, Malaysia.',
        titleLa: 'ຜູ້ອຳນວຍການຮັບລາງວັນ "ຄວາມເປັນເລີດດ້ານການສຶກສາ" ທີ່ ກົວລາລຳເປີ, ມາເລເຊຍ.',
        slug: 'director-educational-excellence-award-malaysia',
        summary: 'SIT leadership was honored at the World School Summit with the prestigious Educational Excellence Award.',
        summaryLa: 'ການນຳ SIT ໄດ້ຮັບກຽດຕິຍົດໃນງານ World School Summit ດ້ວຍລາງວັນ Educational Excellence.',
        content: 'SIT leadership was honored at the World School Summit with the prestigious Educational Excellence Award in recognition of pioneering smart campus infrastructure and curriculum modernization.',
        category: 'Academics',
        imageUrl: '/images/life_at_sit_desktopview/img_10.jpg',
        author: 'Executive Office',
        publishedAt: new Date('2026-08-11'),
        isPublished: true,
        views: 2430,
      },
      {
        title: 'Preparation Meeting for the Commencement of Semester II, Academic Year 2025-2026',
        titleLa: 'ກອງປະຊຸມກຽມຄວາມພ້ອມ ສຳລັບການເປີດພາກຮຽນທີ II ສົກຮຽນ 2025-2026',
        slug: 'preparation-meeting-semester-ii-2025-2026',
        summary: 'Academic deans, department chairs, and student coordinators gathered to finalize semester curriculum plans.',
        summaryLa: 'ຄະນະບໍດີ, ຫົວໜ້າພາກວິຊາ ແລະ ຜູ້ປະສານງານນັກສຶກສາ ຮ່ວມປະຊຸມກຽມແຜນການຮຽນ-ການສອນ.',
        content: 'Academic deans, department chairs, and student coordinators gathered to finalize semester curriculum plans, lab upgrades, and incoming student orientations.',
        category: 'Campus Life',
        imageUrl: '/images/life_at_sit_desktopview/img_11.jpg',
        author: 'Academic Affairs',
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
        title: 'Friendly Sports Competition Commemorating the 116th Anniversary of International',
        titleLa: 'ການແຂ່ງຂັນກິລາມິດຕະພາບ ເນື່ອງໃນໂອກາດວັນແມ່ຍິງສາກົນ ຄົບຮອບ 116 ປີ',
        slug: 'friendly-sports-competition-116th-anniversary',
        summary: 'Inter-departmental football, badminton, and relay matches uniting students and faculty.',
        summaryLa: 'ການແຂ່ງຂັນບານເຕະ, ດອກປີກໄກ່ ແລະ ແລ່ນປ່ຽນໄມ້ ເພື່ອສ້າງຄວາມສາມັກຄີນັກສຶກສາ ແລະ ຄູອາຈານ.',
        content: 'Inter-departmental football, badminton, and relay matches uniting students, faculty, and alumni in friendly collegiate athletic competition.',
        location: 'SIT Sports Complex Stadium',
        eventDate: new Date('2026-09-12T08:00:00Z'),
        time: '08:00 AM - 05:00 PM',
        imageUrl: '/images/life_at_sit_desktopview/img_9.jpg',
        registrationUrl: '/events/friendly-sports-competition-116th-anniversary',
        isPublished: true,
      },
      {
        title: 'Social Integration Skills Training Camp',
        titleLa: 'ຄ້າຍຝຶກອົບຮົມທັກສະການປັບຕົວ ແລະ ການເຊື່ອມໂຍງສັງຄົມ',
        slug: 'social-integration-skills-training-camp',
        summary: 'A 3-day outdoor leadership camp in Vang Vieng designed to foster team synergy and emotional intelligence.',
        summaryLa: 'ຄ້າຍຝຶກອົບຮົມຄວາມເປັນຜູ້ນຳກາງແຈ້ງ 3 ວັນ ທີ່ວັງວຽງ ເພື່ອເສີມສ້າງຄວາມສາມັກຄີ ແລະ ທັກສະການເຮັດວຽກເປັນທີມ.',
        content: 'A 3-day outdoor leadership camp in Vang Vieng designed to foster team synergy, creative problem-solving, and emotional resilience for student leaders.',
        location: 'SIT Leadership Camp & Eco-Resort',
        eventDate: new Date('2026-10-10T07:30:00Z'),
        time: '07:30 AM - 06:00 PM',
        imageUrl: '/images/life_at_sit_desktopview/img_12.jpg',
        registrationUrl: '/events/social-integration-skills-training-camp',
        isPublished: true,
      },
      {
        title: 'Soutsakan Student Market Happening',
        titleLa: 'ງານຕະຫຼາດນັດນັກສຶກສາ ສຸດສະກະນະ (Student Market)',
        slug: 'soutsakan-student-market-happening',
        summary: 'Annual campus bazaar featuring student-run artisan stalls, street food treats, and live band stages.',
        summaryLa: 'ງານຕະຫຼາດນັດປະຈຳປີ ພ້ອມຮ້ານຄ້າສິນຄ້າສ້າງສັນຂອງນັກສຶກສາ, ອາຫານ ແລະ ເວທີດົນຕີສົດ.',
        content: 'Annual campus bazaar featuring over 40 student-run entrepreneur stalls, artisan crafts, culinary treats, and acoustic musical performances throughout the weekend.',
        location: 'SIT Central Plaza Courtyard',
        eventDate: new Date('2026-11-20T16:00:00Z'),
        time: '04:00 PM - 10:00 PM',
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
        titleLa: 'ຊົມຮົມ ສິລະປະສ້າງສັນ',
        description: 'Empowering students to build creative tech designs, interactive media, and full-stack software solutions.',
        descriptionLa: 'ສົ່ງເສີມນັກສຶກສາໃນການອອກແບບສື່ດິຈິທັລ, ຄວາມຄິດສ້າງສັນ ແລະ ການພັດທະນາຊອບແວ.',
        category: 'Academic',
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
        titleLa: 'ຊົມຮົມ ດົນຕີສາກົນ',
        description: 'Live musical rehearsals, vocal choirs, acoustic concerts, and university festival performance showcases.',
        descriptionLa: 'ການຝຶກຊ້ອມດົນຕີສົດ, ວົງຂັບຮ້ອງ, ຄອນເສີດອາຄູສຕິກ ແລະ ການສະແດງໃນງານເທດສະການ.',
        category: 'Arts',
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
        titleLa: 'ສະຫະພັນ ກິລານັກສຶກສາ',
        description: 'Organizing varsity leagues, fitness bootcamps, collegiate football matches, and sports photography.',
        descriptionLa: 'ຈັດການແຂ່ງຂັນກິລາມະຫາວິທະຍາໄລ, ການອອກກຳລັງກາຍ ແລະ ການຖ່າຍພາບກິລາ.',
        category: 'Sports',
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
        titleLa: 'ຄະນະກຳມະການ ພິທີກອນ',
        description: 'Developing polished public speaking, emcee mastery, event coordination, and bilingual presentation skills.',
        descriptionLa: 'ພັດທະນາທັກສະການເວົ້າໃນທີ່ສາທາລະນະ, ການເປັນພິທີກອນສອງພາສາ ແລະ ການຈັດກິດຈະກຳ.',
        category: 'Leadership',
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
      designation: 'Founder, Chairman and CEO of SIT University',
      quote: 'Education is the single most enduring foundation for human dignity, prosperity, and national transformation. At SIT, we do not merely educate students; we inspire them to build a better world.',
      biography: 'A revered education pioneer, physician, author, and philanthropist, Oknha Dr. Mengly J. Quach has dedicated decades to advancing educational excellence in Cambodia. Under his visionary stewardship, SIT University has grown into a premier institution recognized for academic rigor, innovation, and global collaboration.',
      imageUrl: '/images/about_desktopview/img_1.jpg',
    },
  });

  await prisma.visionMission.deleteMany();
  await prisma.visionMission.create({
    data: {
      vision: 'To be Southeast Asia’s premier global university, renowned for pioneering innovation, transformative education, and ethical leadership.',
      mission: 'To educate, empower, and inspire exceptional graduates through experiential learning, world-class research, and impactful industry collaboration, solving society’s most pressing challenges.',
      corePillars: JSON.stringify([
        'World-Class Academic Quality',
        'Cutting-Edge Technological Innovation',
        'Uncompromising Ethical Leadership',
        'Global Mobility & Career Success',
      ]),
    },
  });

  await prisma.member.deleteMany();
  await prisma.member.createMany({
    data: [
      { name: 'Dr. Sarah Jenkins', position: 'Vice Chairman & Academic Advisor', category: 'Board of Trustees', biography: 'Former MIT research director and senior higher education consultant.', imageUrl: '/images/about_desktopview/img_2.jpg', order: 1 },
      { name: 'Prof. David Chen', position: 'Member of University Council', category: 'University Council', biography: 'Distinguished economic strategist and international policy advisor.', imageUrl: '/images/about_desktopview/img_3.jpg', order: 2 },
      { name: 'Dr. Elena Rostova', position: 'Member of University Council', category: 'University Council', biography: 'International media researcher and communications fellow.', imageUrl: '/images/about_desktopview/img_4.jpg', order: 3 },
      { name: 'Dr. Krisada Wannakring', position: 'Dean, College of Engineering', category: 'Board of Trustees', biography: 'Senior academic and engineering systems specialist.', imageUrl: '/images/about/member_default.jpg', order: 4 },
    ],
  });

  await prisma.history.deleteMany();
  await prisma.history.createMany({
    data: [
      { year: '2005', title: 'Foundation & Vision', description: 'Established as an institute dedicated to high-standard English-medium education and modern vocational leadership.', order: 1 },
      { year: '2012', title: 'Campus Expansion & Degree Accreditation', description: 'Accreditation of bachelor degree programs in Information Technology and International Business.', order: 2 },
      { year: '2018', title: 'Global University Partnerships', description: 'Signing of bilateral student exchange and joint research agreements with top universities in Singapore, Japan, and Australia.', order: 3 },
      { year: '2022', title: 'New State-of-the-Art Smart Campus', description: 'Inauguration of the flagship tech campus with robotics laboratories, incubation hub, and Olympic sports facilities.', order: 4 },
      { year: '2026', title: 'Center of Excellence in AI & Technology', description: 'Achieving record enrollment, 96% graduate employment rate, and launching new postgraduate research initiatives.', order: 5 },
    ],
  });
  console.log('✅ About & History seeded');

  // 13. Admissions Timeline & Requirements
  await prisma.applicationTimeline.deleteMany();
  await prisma.applicationTimeline.createMany({
    data: [
      {
        intakeName: 'Fall Semester 2026',
        intakeNameLa: 'ພາກຮຽນລະດູໃບໄມ້ຫຼົ່ນ 2026',
        intakeYear: '2026',
        openingDate: new Date('2026-05-01'),
        closingDate: new Date('2026-08-15'),
        deadlineDate: new Date('2026-08-15'),
        classesBeginDate: new Date('2026-10-01'),
        additionalNotes: '• 1st of October will be starting date of class.\n• Placement Exam 7th of September',
        additionalNotesLa: '• ວັນທີ 1 ຕຸລາ ຈະເປັນມື້ເລີ່ມຕົ້ນຮຽນ.\n• ສອບເສັງວັດລະດັບວັນທີ 7 ກັນຍາ',
        status: 'Open Now',
        statusLa: 'ເປີດຮັບສະໝັກແລ້ວ',
        order: 1,
      },
      {
        intakeName: 'Spring Semester 2027',
        intakeNameLa: 'ພາກຮຽນລະດູໃບໄມ້ປົ່ງ 2027',
        intakeYear: '2027',
        openingDate: new Date('2026-10-15'),
        closingDate: new Date('2027-01-15'),
        deadlineDate: new Date('2027-01-15'),
        classesBeginDate: new Date('2027-02-15'),
        additionalNotes: '• Early application scholarship discounts apply.\n• Placement Exam 20th of January',
        additionalNotesLa: '• ໄດ້ຮັບສ່ວນຫຼຸດທຶນການສຶກສາສຳລັບຜູ້ສະໝັກໄວ.\n• ສອບເສັງວັດລະດັບວັນທີ 20 ມັງກອນ',
        status: 'Upcoming',
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
        titleLa: 'ຂໍ້ໄດ້ປຽບຂອງການສະໝັກກ່ອນ',
        description: 'Applicants who submit early receive priority consideration for merit scholarships and preferred course schedules.',
        descriptionLa: 'ຜູ້ສະໝັກທີ່ສົ່ງເອກະສານກ່ອນ ຈະໄດ້ຮັບການພິຈາລະນາທຶນການສຶກສາ ແລະ ຕາຕະລາງຮຽນທີ່ຕ້ອງການກ່ອນ.',
        order: 1,
      },
      {
        title: 'Rolling Admissions Policy',
        titleLa: 'ນະໂຍບາຍຮັບສະໝັກແບບຕໍ່ເນື່ອງ',
        description: 'We review applications as they are received. Decisions are typically released within 2 to 4 weeks after all required materials are verified.',
        descriptionLa: 'ພວກເຮົາກວດສອບໃບສະໝັກຕາມລຳດັບທີ່ໄດ້ຮັບ. ຜົນການພິຈາລະນາຈະແຈ້ງພາຍໃນ 2 ຫາ 4 ອາທິດຫຼັງຈາກກວດສອບເອກະສານຄົບຖ້ວນ.',
        order: 2,
      },
      {
        title: 'Placement Exam & Interview',
        titleLa: 'ການສອບເສັງວັດລະດັບ ແລະ ສຳພາດ',
        description: 'Shortlisted candidates may be invited for an English proficiency placement test and brief interview with faculty advisors.',
        descriptionLa: 'ຜູ້ສະໝັກທີ່ຜ່ານການຄັດເລືອກເບື້ອງຕົ້ນ ອາດຈະໄດ້ຮັບການເຊື້ອເຊີນໃຫ້ເຂົ້າສອບເສັງພາສາອັງກິດ ແລະ ສຳພາດສັ້ນໆກັບອາຈານທີ່ປຶກສາ.',
        order: 3,
      },
      {
        title: 'Visa & Housing Support for International Students',
        titleLa: 'ການສະໜັບສະໜູນວີຊາ ແລະ ທີ່ພັກສຳລັບນັກສຶກສາຕ່າງປະເທດ',
        description: 'Dedicated international student advisors will guide you through visa processing, dorm bookings, and airport pick-up.',
        descriptionLa: 'ທີ່ປຶກສານັກສຶກສາຕ່າງປະເທດຈະໃຫ້ຄຳແນະນຳຂັ້ນຕອນການຂໍວີຊາ, ຈອງຫໍພັກ ແລະ ຮັບສົ່ງສະໜາມບິນ.',
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
        description: 'Entry criteria for secondary school graduates seeking a Bachelor of Science or Bachelor of Arts degree at SIT.',
        requirementsList: JSON.stringify([
          'High School Diploma (BacII) with minimum Grade C or international equivalent (A-Levels, IB, GED)',
          'English Language Proficiency: IELTS 5.5+, TOEFL iBT 65+, or passing score on SIT English Placement Test',
          'Official high school academic transcripts for Grades 10, 11, and 12',
          'Copy of National Identification Card or Passport',
          'Two letters of recommendation from high school teachers or counselors',
          'Personal Statement / Motivation Letter (500 words)',
        ]),
        order: 1,
      },
      {
        degreeLevel: 'Graduate',
        title: 'Master’s Degree Requirements',
        description: 'Criteria for professionals and graduates pursuing an advanced Master of Science or MBA program.',
        requirementsList: JSON.stringify([
          'Accredited Bachelor’s Degree in a relevant field with a minimum cumulative GPA of 3.0 / 4.0',
          'English Proficiency: IELTS 6.5+ or TOEFL iBT 80+',
          'Official undergraduate degree certificate and complete academic transcripts',
          'Updated Curriculum Vitae (CV) demonstrating relevant work or research experience',
          'Two academic or professional letters of recommendation',
          'Statement of Research & Career Intent (800 words)',
        ]),
        order: 2,
      },
      {
        degreeLevel: 'International',
        title: 'International Student Admissions',
        description: 'Specific guidelines, visa assistance, and equivalency requirements for foreign applicants.',
        requirementsList: JSON.stringify([
          'Valid International Passport (minimum 1-year validity)',
          'Certified English translation of secondary school or university degree certificates',
          'Proof of English proficiency (IELTS, TOEFL, Duolingo English Test)',
          'Financial affidavit or bank statement verifying sufficient funds for tuition and living expenses',
          'Student Visa (Type E) application support provided upon acceptance',
        ]),
        order: 3,
      },
    ],
  });

  // 14. Contact Info
  await prisma.contactInfo.deleteMany();
  await prisma.contactInfo.create({
    data: {
      address: 'Building 123, Russian Federation Boulevard (110), Sangkat Teuk Thla, Khan Sen Sok, Phnom Penh, Kingdom of Cambodia',
      phone: '+855 (0) 23 888 777 / +855 (0) 12 345 678',
      email: 'info@sit.edu.kh / admissions@sit.edu.kh',
      mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3794.7802457390835!2d102.6286178751789!3d17.98895818300444!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x312467e7bd8e66a5%3A0xf85c9af1fa1bea14!2sSoutsaka%20Institute%20of%20Technology!5e0!3m2!1sen!2sth!4v1787336679429!5m2!1sen!2sth',
      officeHours: 'Monday - Friday: 08:00 AM - 05:00 PM, Saturday: 08:00 AM - 12:00 PM',
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
        titleLa: 'ລາຍການກວດສອບການສະໝັກ',
        description: "Download our comprehensive PDF checklist to ensure you don't miss anything.",
        descriptionLa: 'ດາວໂຫຼດລາຍການກວດສອບ PDF ທີ່ຄົບຖ້ວນຂອງພວກເຮົາ ເພື່ອໃຫ້ແນ່ໃຈວ່າທ່ານບໍ່ພາດເອກະສານໃດໆ.',
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
        titleLa: 'ລາຍລະອຽດການຮັບສະໝັກຄົບຊຸດ',
        description: 'Tips and examples for crafting a compelling personal statement and application packet.',
        descriptionLa: 'ຄຳແນະນຳ ແລະ ຕົວຢ່າງສຳລັບການຂຽນໃບສະແດງເຈດຈຳນົງ ແລະ ຊຸດເອກະສານການສະໝັກ.',
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
        titleLa: 'ເງື່ອນໄຂເອກະສານປະກອບ',
        description: 'Detailed list of all required documents with formatting and translation guidelines.',
        descriptionLa: 'ລາຍການລະອຽດຂອງເອກະສານທີ່ຈຳເປັນທັງໝົດ ພ້ອມທັງຄຳແນະນຳການຈັດຮູບແບບ ແລະ ການແປ.',
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
        titleLa: 'ແຜນການຊຳລະຄ່າຮຽນ',
        description: 'Special guide for international and local applicants with scholarship options and fee schedules.',
        descriptionLa: 'ຄູ່ມືພິເສດສຳລັບຜູ້ສະໝັກ ພ້ອມດ້ວຍທາງເລືອກທຶນການສຶກສາ ແລະ ຕາຕະລາງການຊຳລະຄ່າທຳນຽມ.',
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
