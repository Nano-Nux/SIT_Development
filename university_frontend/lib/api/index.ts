export * from './types';
export * from './client';
export * from './auth';
export * from './news';
export * from './events';
export * from './academics';
export * from './admissions';
export * from './content';
export * from './upload';
export * from './stats';

import { authApi } from './auth';
import { newsApi } from './news';
import { eventsApi } from './events';
import { academicsApi } from './academics';
import { admissionsApi } from './admissions';
import { contentApi } from './content';
import { uploadApi } from './upload';
import { statsApi } from './stats';
import { apiClient } from './client';

/**
 * Unified API client interface providing backward compatibility with all legacy calls
 * while leveraging the new modular service architecture under the hood.
 */
export const api = {
  // Client instance & utils
  client: apiClient,

  // --- Auth ---
  login: authApi.login.bind(authApi),
  logout: authApi.logout.bind(authApi),
  getMe: authApi.getMe.bind(authApi),

  // --- News ---
  getNews: newsApi.getNews.bind(newsApi),
  getNewsArticle: newsApi.getNewsArticle.bind(newsApi),
  createNews: newsApi.createNews.bind(newsApi),
  updateNews: newsApi.updateNews.bind(newsApi),
  deleteNews: newsApi.deleteNews.bind(newsApi),

  // --- Events ---
  getEvents: eventsApi.getEvents.bind(eventsApi),
  getEvent: eventsApi.getEvent.bind(eventsApi),
  createEvent: eventsApi.createEvent.bind(eventsApi),
  updateEvent: eventsApi.updateEvent.bind(eventsApi),
  deleteEvent: eventsApi.deleteEvent.bind(eventsApi),

  // --- Academics: Majors ---
  getMajors: academicsApi.getMajors.bind(academicsApi),
  getMajor: academicsApi.getMajor.bind(academicsApi),
  createMajor: academicsApi.createMajor.bind(academicsApi),
  updateMajor: academicsApi.updateMajor.bind(academicsApi),
  deleteMajor: academicsApi.deleteMajor.bind(academicsApi),
  reorderMajors: academicsApi.reorderMajors.bind(academicsApi),

  // --- Academics: Departments ---
  getDepartments: academicsApi.getDepartments.bind(academicsApi),
  getDepartment: academicsApi.getDepartment.bind(academicsApi),
  createDepartment: academicsApi.createDepartment.bind(academicsApi),
  updateDepartment: academicsApi.updateDepartment.bind(academicsApi),
  deleteDepartment: academicsApi.deleteDepartment.bind(academicsApi),

  // --- Academics: Programs ---
  getPrograms: academicsApi.getPrograms.bind(academicsApi),
  getProgram: academicsApi.getProgram.bind(academicsApi),
  createProgram: academicsApi.createProgram.bind(academicsApi),
  updateProgram: academicsApi.updateProgram.bind(academicsApi),
  deleteProgram: academicsApi.deleteProgram.bind(academicsApi),
  reorderPrograms: academicsApi.reorderPrograms.bind(academicsApi),

  // --- Academics: Faculty ---
  getFaculty: academicsApi.getFaculty.bind(academicsApi),
  createFaculty: academicsApi.createFaculty.bind(academicsApi),
  updateFaculty: academicsApi.updateFaculty.bind(academicsApi),
  deleteFaculty: academicsApi.deleteFaculty.bind(academicsApi),
  reorderFaculty: academicsApi.reorderFaculty.bind(academicsApi),

  // --- Academics: Program Directors ---
  getProgramDirectors: academicsApi.getProgramDirectors.bind(academicsApi),
  createProgramDirector: academicsApi.createProgramDirector.bind(academicsApi),
  updateProgramDirector: academicsApi.updateProgramDirector.bind(academicsApi),
  deleteProgramDirector: academicsApi.deleteProgramDirector.bind(academicsApi),

  // --- Admissions: Timelines ---
  getTimelines: admissionsApi.getTimelines.bind(admissionsApi),
  getAdmissionTimeline: admissionsApi.getAdmissionTimeline.bind(admissionsApi),
  createTimeline: admissionsApi.createTimeline.bind(admissionsApi),
  createAdmissionTimeline: admissionsApi.createAdmissionTimeline.bind(admissionsApi),
  updateTimeline: admissionsApi.updateTimeline.bind(admissionsApi),
  deleteTimeline: admissionsApi.deleteTimeline.bind(admissionsApi),
  deleteAdmissionTimeline: admissionsApi.deleteAdmissionTimeline.bind(admissionsApi),

  // --- Admissions: Reminders ---
  getReminders: admissionsApi.getReminders.bind(admissionsApi),
  createReminder: admissionsApi.createReminder.bind(admissionsApi),
  updateReminder: admissionsApi.updateReminder.bind(admissionsApi),
  deleteReminder: admissionsApi.deleteReminder.bind(admissionsApi),

  // --- Admissions: Requirements ---
  getRequirements: admissionsApi.getRequirements.bind(admissionsApi),
  getAdmissionRequirements: admissionsApi.getAdmissionRequirements.bind(admissionsApi),
  createRequirement: admissionsApi.createRequirement.bind(admissionsApi),
  createAdmissionRequirement: admissionsApi.createAdmissionRequirement.bind(admissionsApi),
  updateRequirement: admissionsApi.updateRequirement.bind(admissionsApi),
  deleteRequirement: admissionsApi.deleteRequirement.bind(admissionsApi),
  deleteAdmissionRequirement: admissionsApi.deleteAdmissionRequirement.bind(admissionsApi),

  // --- Admissions: FAQs ---
  getFaqs: admissionsApi.getFaqs.bind(admissionsApi),
  createFaq: admissionsApi.createFaq.bind(admissionsApi),
  updateFaq: admissionsApi.updateFaq.bind(admissionsApi),
  deleteFaq: admissionsApi.deleteFaq.bind(admissionsApi),

  // --- Admissions: Downloadable Materials ---
  getMaterials: admissionsApi.getMaterials.bind(admissionsApi),
  createMaterial: admissionsApi.createMaterial.bind(admissionsApi),
  updateMaterial: admissionsApi.updateMaterial.bind(admissionsApi),
  deleteMaterial: admissionsApi.deleteMaterial.bind(admissionsApi),

  // --- Admissions: Applications ---
  submitApplication: admissionsApi.submitApplication.bind(admissionsApi),
  getApplications: admissionsApi.getApplications.bind(admissionsApi),
  updateApplicationStatus: admissionsApi.updateApplicationStatus.bind(admissionsApi),
  deleteApplication: admissionsApi.deleteApplication.bind(admissionsApi),

  // --- Admissions: Request Info ---
  submitRequestInfo: admissionsApi.submitRequestInfo.bind(admissionsApi),
  getRequestInfos: admissionsApi.getRequestInfos.bind(admissionsApi),
  getRequestInfo: admissionsApi.getRequestInfo.bind(admissionsApi),
  updateRequestInfoStatus: admissionsApi.updateRequestInfoStatus.bind(admissionsApi),
  deleteRequestInfo: admissionsApi.deleteRequestInfo.bind(admissionsApi),

  // --- Content: Hero ---
  getHero: contentApi.getHero.bind(contentApi),
  getAllHeroes: contentApi.getAllHeroes.bind(contentApi),
  updateHero: contentApi.updateHero.bind(contentApi),
  upsertHero: contentApi.upsertHero.bind(contentApi),

  // --- Content: Core Values ---
  getCoreValues: contentApi.getCoreValues.bind(contentApi),
  createCoreValue: contentApi.createCoreValue.bind(contentApi),
  updateCoreValue: contentApi.updateCoreValue.bind(contentApi),
  deleteCoreValue: contentApi.deleteCoreValue.bind(contentApi),
  reorderCoreValues: contentApi.reorderCoreValues.bind(contentApi),

  // --- Content: Spotlights ---
  getSpotlights: contentApi.getSpotlights.bind(contentApi),
  createSpotlight: contentApi.createSpotlight.bind(contentApi),
  updateSpotlight: contentApi.updateSpotlight.bind(contentApi),
  deleteSpotlight: contentApi.deleteSpotlight.bind(contentApi),

  // --- Content: Partners ---
  getPartners: contentApi.getPartners.bind(contentApi),
  createPartner: contentApi.createPartner.bind(contentApi),
  updatePartner: contentApi.updatePartner.bind(contentApi),
  deletePartner: contentApi.deletePartner.bind(contentApi),

  // --- Content: Campus Facilities ---
  getCampusFacilities: contentApi.getCampusFacilities.bind(contentApi),
  createCampusFacility: contentApi.createCampusFacility.bind(contentApi),
  updateCampusFacility: contentApi.updateCampusFacility.bind(contentApi),
  deleteCampusFacility: contentApi.deleteCampusFacility.bind(contentApi),

  // --- Content: Student Life ---
  getStudentLife: contentApi.getStudentLife.bind(contentApi),
  createStudentLife: contentApi.createStudentLife.bind(contentApi),
  updateStudentLife: contentApi.updateStudentLife.bind(contentApi),
  deleteStudentLife: contentApi.deleteStudentLife.bind(contentApi),

  // --- Content: About Section ---
  getFounder: contentApi.getFounder.bind(contentApi),
  updateFounder: contentApi.updateFounder.bind(contentApi),
  upsertFounder: contentApi.upsertFounder.bind(contentApi),
  getVisionMission: contentApi.getVisionMission.bind(contentApi),
  updateVisionMission: contentApi.updateVisionMission.bind(contentApi),
  upsertVisionMission: contentApi.upsertVisionMission.bind(contentApi),
  getMembers: contentApi.getMembers.bind(contentApi),
  createMember: contentApi.createMember.bind(contentApi),
  updateMember: contentApi.updateMember.bind(contentApi),
  deleteMember: contentApi.deleteMember.bind(contentApi),
  getHistory: contentApi.getHistory.bind(contentApi),
  createHistory: contentApi.createHistory.bind(contentApi),
  updateHistory: contentApi.updateHistory.bind(contentApi),
  deleteHistory: contentApi.deleteHistory.bind(contentApi),

  // --- Content: Contact ---
  getContact: contentApi.getContact.bind(contentApi),
  updateContact: contentApi.updateContact.bind(contentApi),

  // --- Stats ---
  getDashboardStats: statsApi.getDashboardStats.bind(statsApi),

  // --- Upload ---
  uploadFile: uploadApi.uploadFile.bind(uploadApi),
};

export default api;
