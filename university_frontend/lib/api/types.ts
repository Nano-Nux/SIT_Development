export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface HeroData {
  id?: string;
  page: string;
  title: string;
  titleLa?: string;
  subtitle?: string;
  subtitleLa?: string;
  badge?: string;
  description?: string;
  descriptionLa?: string;
  buttonText?: string;
  buttonTextLa?: string;
  buttonUrl?: string;
  imageUrl?: string;
  image2Url?: string;
  image3Url?: string;
  image4Url?: string;
  backgroundMedia?: string;
  ctaText?: string;
  ctaLink?: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
  stats?: Record<string, any>;
  isActive?: boolean;
  [key: string]: any;
}

export type Hero = HeroData;

export interface CoreValue {
  id: string;
  title: string;
  titleLa?: string;
  description: string;
  descriptionLa?: string;
  icon?: string;
  order: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any;
}

export interface BoxStatItem {
  value: string;
  label: string;
}

export interface Department {
  id: string;
  name: string;
  nameLa?: string;
  title?: string;
  titleLa?: string;
  slug: string;
  description?: string;
  descriptionLa?: string;
  heroImage?: string;
  imageUrl?: string;
  order: number;
  isActive?: boolean;
  
  // Field 3: box-description (optional, hero stats)
  boxDescriptions?: string | BoxStatItem[];
  boxDescriptionsLa?: string | BoxStatItem[];

  // Field 4: Core Focus Areas
  coreFocusAreas?: string | string[];
  coreFocusAreasLa?: string | string[];

  // Field 5: Career Outcome Description
  careerOutcomeDesc?: string;
  careerOutcomeDescLa?: string;

  // Field 6: Career Outcomes Boxes (optional)
  careerPlacementRate?: string;
  careerPlacementRateLa?: string;
  careerAvgSalary?: string;
  careerAvgSalaryLa?: string;
  careerPartnerCompanies?: string;
  careerPartnerCompaniesLa?: string;
  careerTimeToEmployment?: string;
  careerTimeToEmploymentLa?: string;

  programs?: Program[];
  faculty?: Faculty[];
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any;
}

export interface Program {
  id: string;
  name: string;
  nameLa?: string;
  slug: string;
  degree: string;
  degreeLa?: string;
  departmentId: string;
  department?: Department;
  description?: string;
  descriptionLa?: string;
  duration?: string;
  durationLa?: string;
  coreFocusAreas?: string;
  coreFocusAreasLa?: string;
  credits?: number;
  learningOutcomes?: string[];
  careerOpportunities?: string[];
  curriculum?: Record<string, any>;
  order: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any;
}

export interface Major {
  id: string;
  name: string;
  nameLa?: string;
  slug: string;
  title?: string;
  titleLa?: string;
  degree?: string;
  degreeLevel?: string;
  duration?: string;
  credits?: number;
  description?: string;
  descriptionLa?: string;
  image?: string;
  heroImage?: string;
  isActive: boolean;
  order: number;
  curriculumOverview?: string;
  careerProspects?: string;
  accreditation?: string;
  admissionRequirements?: string;
  departmentId?: string;
  department?: Department;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any;
}

export interface Faculty {
  id: string;
  name: string;
  nameLa?: string;
  title: string;
  position?: string;
  positionLa?: string;
  departmentName?: string;
  departmentNameLa?: string;
  departmentId?: string;
  department?: Department;
  bio?: string;
  biography?: string;
  biographyLa?: string;
  image?: string;
  imageUrl?: string;
  email?: string;
  researchInterests?: string[];
  education?: string[];
  publications?: string[];
  isFeatured: boolean;
  order: number;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any;
}

export interface ProgramDirector {
  id: string;
  programId: string;
  program?: Program;
  name: string;
  nameLa?: string;
  title: string;
  position?: string;
  positionLa?: string;
  departmentName?: string;
  departmentNameLa?: string;
  bio?: string;
  biography?: string;
  biographyLa?: string;
  image?: string;
  imageUrl?: string;
  email?: string;
  phone?: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any;
}

export interface Spotlight {
  id: string;
  type?: string;
  title?: string;
  titleLa?: string;
  subtitle?: string;
  subtitleLa?: string;
  personName?: string;
  authorName?: string;
  authorNameLa?: string;
  role?: string;
  authorRole?: string;
  authorRoleLa?: string;
  story?: string;
  description?: string;
  descriptionLa?: string;
  quote?: string;
  quoteLa?: string;
  image?: string;
  imageUrl?: string;
  graduationYear?: number;
  major?: string;
  isFeatured?: boolean;
  order?: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any;
}

export interface Partner {
  id: string;
  name: string;
  nameLa?: string;
  type: string;
  logo?: string;
  logoUrl?: string;
  website?: string;
  websiteUrl?: string;
  description?: string;
  country?: string;
  countryLa?: string;
  isFeatured: boolean;
  order: number;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any;
}

export interface CampusFacility {
  id: string;
  name: string;
  nameLa?: string;
  category?: string;
  description?: string;
  descriptionLa?: string;
  images?: string[];
  imageUrl?: string;
  virtualTourUrl?: string;
  modalTitle?: string;
  modalTitleLa?: string;
  modalContent?: string;
  modalContentLa?: string;
  hours?: string;
  location?: string;
  features?: string[];
  order: number;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any;
}

export interface NewsArticle {
  id: string;
  title: string;
  titleLa?: string;
  slug: string;
  content: string;
  contentLa?: string;
  summary?: string;
  summaryLa?: string;
  category: string;
  categoryLa?: string;
  image?: string;
  imageUrl?: string;
  views: number;
  isPublished?: boolean;
  isFeatured?: boolean;
  author?: string;
  authorLa?: string;
  authorName?: string;
  publishedAt?: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any;
}

export interface EventItem {
  id: string;
  title: string;
  titleLa?: string;
  slug: string;
  description?: string;
  summary?: string;
  summaryLa?: string;
  content?: string;
  contentLa?: string;
  eventDate: string;
  endDate?: string;
  time?: string;
  timeLa?: string;
  location: string;
  locationLa?: string;
  isVirtual?: boolean;
  virtualLink?: string;
  registrationUrl?: string;
  category?: string;
  image?: string;
  imageUrl?: string;
  isPublished?: boolean;
  isFeatured?: boolean;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any;
}

export interface StudentLifeActivity {
  id: string;
  title: string;
  titleLa?: string;
  category: string;
  categoryLa?: string;
  description: string;
  descriptionLa?: string;
  image?: string;
  imageUrl?: string;
  gallery?: string;
  contactEmail?: string;
  meetingSchedule?: string;
  isFeatured?: boolean;
  order: number;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any;
}

export interface AdmissionTimeline {
  id: string;
  term?: string;
  intakeName?: string;
  intakeNameLa?: string;
  intakeYear?: string;
  title?: string;
  description?: string;
  startDate?: string;
  openingDate?: string;
  endDate?: string;
  closingDate?: string;
  deadline?: string;
  deadlineDate?: string;
  classesBeginDate?: string;
  additionalNotes?: string;
  additionalNotesLa?: string;
  status?: string;
  statusLa?: string;
  order: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any;
}

export interface ApplicationReminder {
  id: string;
  title: string;
  titleLa?: string;
  description: string;
  descriptionLa?: string;
  icon?: string;
  order: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any;
}

export interface AdmissionRequirement {
  id: string;
  category?: string; // ACADEMIC, QUALIFICATIONS, INTERNATIONAL
  degreeLevel: string;
  title: string;
  titleLa?: string;
  subtitle?: string;
  subtitleLa?: string;
  description?: string;
  descriptionLa?: string;
  items?: string[];
  requirementsList?: string;
  requirementsListLa?: string;
  icon?: string;
  order: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any;
}

export interface AdmissionFaq {
  id: string;
  question: string;
  questionLa?: string;
  answer: string;
  answerLa?: string;
  category?: string;
  order: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any;
}

export interface ApplicationMaterial {
  id: string;
  title: string;
  titleLa?: string;
  description?: string;
  descriptionLa?: string;
  fileUrl: string;
  fileType?: string;
  fileSize?: string;
  icon?: string;
  badgeColor?: string;
  order: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any;
}

export interface ApplicationSubmission {
  id: string;
  fullName?: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phone: string;
  dateOfBirth?: string;
  gender?: string;
  nationality?: string;
  address?: string;
  intendedProgram?: string;
  program?: string;
  programOfInterest?: string;
  degreeLevel?: string;
  previousSchool?: string;
  highSchool?: string;
  gpa?: string;
  graduationYear?: string | number;
  englishScore?: string;
  statement?: string;
  personalStatement?: string;
  documents?: any;
  status: string;
  notes?: string;
  submittedAt?: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any;
}

export interface RequestInfoSubmission {
  id: string;
  fullName?: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  country?: string;
  city?: string;
  currentEducationLevel?: string;
  graduationYear?: string | number;
  programOfInterest?: string;
  program?: string;
  intakeTerm?: string;
  term?: string;
  planToStart?: string;
  interests?: any;
  hearAboutUs?: string;
  communicationPreferences?: any;
  message?: string;
  status: string;
  notes?: string;
  submittedAt?: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any;
}

export interface CustomSocialLink {
  id: string;
  name: string;
  url: string;
  icon?: string;
  isActive?: boolean;
}

export interface SocialLinksData {
  facebook?: string;
  twitter?: string;
  instagram?: string;
  linkedin?: string;
  youtube?: string;
  tiktok?: string;
  telegram?: string;
  whatsapp?: string;
  customLinks?: CustomSocialLink[];
  [key: string]: any;
}

export interface ContactLocation {
  id: string;
  title: string;
  titleLa?: string;
  address: string;
  addressLa?: string;
  isPrimary?: boolean;
  notes?: string;
  notesLa?: string;
}

export interface ContactPhone {
  id: string;
  number: string;
  label: string;
  labelLa?: string;
  isPrimary?: boolean;
}

export interface ContactEmail {
  id: string;
  email: string;
  label: string;
  labelLa?: string;
  isPrimary?: boolean;
}

export interface ContactOfficeHour {
  id: string;
  days: string;
  daysLa?: string;
  hours: string;
  hoursLa?: string;
  notes?: string;
  notesLa?: string;
}

export interface ContactInfo {
  id?: string;
  address: string;
  addressLa?: string;
  phone: string;
  email: string;
  admissionsEmail?: string;
  officeHours?: string;
  officeHoursLa?: string;
  locations?: string | ContactLocation[];
  phones?: string | ContactPhone[];
  emails?: string | ContactEmail[];
  officeHoursList?: string | ContactOfficeHour[];
  socialLinks?: string | SocialLinksData | Record<string, any>;
  mapEmbedUrl?: string;
  [key: string]: any;
}

export interface DashboardStats {
  applicationsCount: number;
  pendingApplicationsCount: number;
  requestInfoCount: number;
  newsCount: number;
  eventsCount: number;
  programsCount: number;
  facultyCount: number;
  [key: string]: any;
}

// Canonical type aliases
export type HeroItem = HeroData;
export type CoreValueItem = CoreValue;
export type DepartmentItem = Department;
export type ProgramItem = Program;
export type MajorItem = Major;
export type FacultyMember = Faculty;
export type ProgramDirectorItem = ProgramDirector;
export type SpotlightItem = Spotlight;
export type PartnerItem = Partner;
export type CampusFacilityItem = CampusFacility;
export type StudentLifeItem = StudentLifeActivity;
export type AdmissionTimelineItem = AdmissionTimeline;
export type AdmissionRequirementItem = AdmissionRequirement;
export type ApplicationItem = ApplicationSubmission;
export type RequestInfoItem = RequestInfoSubmission;

export interface FounderInfo {
  id?: string;
  name: string;
  nameLa?: string;
  designation: string;
  designationLa?: string;
  quote?: string;
  quoteLa?: string;
  biography: string;
  biographyLa?: string;
  imageUrl?: string;
  [key: string]: any;
}

export interface MemberItem {
  id?: string;
  name: string;
  nameLa?: string;
  position: string;
  positionLa?: string;
  category?: string;
  categoryLa?: string;
  biography?: string;
  biographyLa?: string;
  imageUrl?: string;
  order?: number;
  [key: string]: any;
}

export interface HistoryMilestone {
  id?: string;
  year: string;
  title: string;
  titleLa?: string;
  description: string;
  descriptionLa?: string;
  icon?: any;
  order?: number;
  [key: string]: any;
}

export interface VisionMissionInfo {
  id?: string;
  vision: string;
  visionLa?: string;
  mission: string;
  missionLa?: string;
  corePillars?: string;
  corePillarsLa?: string;
  [key: string]: any;
}

