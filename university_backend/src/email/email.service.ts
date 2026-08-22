import { Injectable, Logger } from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private resend: Resend | null = null;
  private readonly fromEmail: string;
  private readonly adminEmail: string;

  constructor() {
    const apiKey = process.env.RESEND_API_KEY;
    this.fromEmail = process.env.RESEND_FROM_EMAIL || 'SIT Admissions <onboarding@resend.dev>';
    this.adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || 'admissions@sit.edu.la';

    if (apiKey && apiKey.trim() !== '') {
      try {
        this.resend = new Resend(apiKey.trim());
        this.logger.log('Resend Email client initialized successfully.');
      } catch (err: any) {
        this.logger.error('Failed to initialize Resend client: ' + err.message);
      }
    } else {
      this.logger.warn('RESEND_API_KEY not configured. Outgoing emails will be logged to console in mock mode.');
    }
  }

  /**
   * Send emails for a new Application submission
   */
  async sendApplicationSubmission(app: {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    dateOfBirth?: string;
    gender?: string;
    nationality?: string;
    address?: string;
    intendedProgram: string;
    degreeLevel: string;
    previousSchool: string;
    gpa?: string;
    graduationYear?: string;
    statement?: string;
    documents?: string;
  }) {
    const parsedDocs: { name: string; url: string }[] = (() => {
      if (!app.documents) return [];
      try {
        const parsed = JSON.parse(app.documents);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    })();

    const docsHtml = parsedDocs.length > 0
      ? `
        <div style="margin-top: 15px; padding: 12px; background: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0;">
          <h4 style="margin: 0 0 8px 0; color: #1e293b; font-size: 14px;">Uploaded Documents (${parsedDocs.length})</h4>
          <ul style="margin: 0; padding-left: 20px; color: #0284c7; font-size: 13px;">
            ${parsedDocs.map(d => `<li style="margin-bottom: 4px;"><a href="${d.url}" target="_blank" style="color: #0284c7; text-decoration: underline;">${d.name}</a></li>`).join('')}
          </ul>
        </div>
      `
      : '<p style="color: #64748b; font-size: 13px; margin: 5px 0;">No documents uploaded.</p>';

    // 1. Admin notification email HTML
    const adminHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 650px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #0400CC 0%, #00001C 100%); padding: 24px; color: #ffffff;">
          <h2 style="margin: 0 0 6px 0; font-size: 22px; font-weight: bold;">New SIT Application Received</h2>
          <p style="margin: 0; font-size: 14px; opacity: 0.9;">Application ID: #${app.id.slice(0, 8).toUpperCase()} &bull; Program: ${app.intendedProgram}</p>
        </div>
        
        <div style="padding: 24px;">
          <h3 style="color: #0400CC; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; margin-top: 0;">Applicant Details</h3>
          <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-bottom: 20px;">
            <tr><td style="padding: 6px 0; color: #64748b; width: 140px;">Full Name:</td><td style="padding: 6px 0; font-weight: bold; color: #0f172a;">${app.fullName}</td></tr>
            <tr><td style="padding: 6px 0; color: #64748b;">Email:</td><td style="padding: 6px 0; color: #0f172a;"><a href="mailto:${app.email}" style="color: #0400CC;">${app.email}</a></td></tr>
            <tr><td style="padding: 6px 0; color: #64748b;">Phone:</td><td style="padding: 6px 0; color: #0f172a;">${app.phone}</td></tr>
            <tr><td style="padding: 6px 0; color: #64748b;">Date of Birth:</td><td style="padding: 6px 0; color: #0f172a;">${app.dateOfBirth || 'N/A'}</td></tr>
            <tr><td style="padding: 6px 0; color: #64748b;">Nationality:</td><td style="padding: 6px 0; color: #0f172a;">${app.nationality || 'N/A'}</td></tr>
            <tr><td style="padding: 6px 0; color: #64748b;">Address:</td><td style="padding: 6px 0; color: #0f172a;">${app.address || 'N/A'}</td></tr>
          </table>

          <h3 style="color: #0400CC; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px;">Academic & Program Information</h3>
          <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-bottom: 20px;">
            <tr><td style="padding: 6px 0; color: #64748b; width: 140px;">Degree Level:</td><td style="padding: 6px 0; font-weight: bold; color: #0f172a;">${app.degreeLevel}</td></tr>
            <tr><td style="padding: 6px 0; color: #64748b;">Intended Program:</td><td style="padding: 6px 0; font-weight: bold; color: #0400CC;">${app.intendedProgram}</td></tr>
            <tr><td style="padding: 6px 0; color: #64748b;">Previous School:</td><td style="padding: 6px 0; color: #0f172a;">${app.previousSchool}</td></tr>
            <tr><td style="padding: 6px 0; color: #64748b;">Graduation Year:</td><td style="padding: 6px 0; color: #0f172a;">${app.graduationYear || 'N/A'}</td></tr>
            <tr><td style="padding: 6px 0; color: #64748b;">GPA / Grade:</td><td style="padding: 6px 0; color: #0f172a;">${app.gpa || 'N/A'}</td></tr>
          </table>

          ${app.statement ? `
            <h3 style="color: #0400CC; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px;">Personal Statement / Motivation</h3>
            <div style="background: #f8fafc; padding: 16px; border-radius: 8px; font-size: 14px; line-height: 1.6; color: #334155; white-space: pre-wrap; margin-bottom: 20px;">${app.statement}</div>
          ` : ''}

          <h3 style="color: #0400CC; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px;">Uploaded Documents</h3>
          ${docsHtml}

          <div style="margin-top: 28px; padding-top: 16px; border-top: 1px solid #e2e8f0; text-align: center;">
            <p style="font-size: 12px; color: #94a3b8; margin: 0;">Soutsakan Institute of Technology (SIT) Admissions System</p>
          </div>
        </div>
      </div>
    `;

    // 2. Applicant Confirmation Email HTML
    const applicantHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
        <div style="background: #0400CC; padding: 28px 24px; text-align: center; color: #ffffff;">
          <h1 style="margin: 0 0 8px 0; font-size: 24px; font-weight: bold;">Application Submitted Successfully!</h1>
          <p style="margin: 0; font-size: 15px; opacity: 0.95;">Thank you for applying to Soutsakan Institute of Technology.</p>
        </div>

        <div style="padding: 28px 24px; font-size: 15px; line-height: 1.6; color: #334155;">
          <p>Dear <strong>${app.fullName}</strong>,</p>
          <p>We have successfully received your official application for the <strong>${app.intendedProgram}</strong> program at SIT.</p>
          
          <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 16px; margin: 20px 0;">
            <h4 style="margin: 0 0 6px 0; color: #166534; font-size: 15px;">What Happens Next?</h4>
            <ul style="margin: 0; padding-left: 20px; color: #166534; font-size: 14px;">
              <li style="margin-bottom: 6px;"><strong>Application Review:</strong> Our admissions committee will review your profile and credentials (typically 2-3 weeks).</li>
              <li style="margin-bottom: 6px;"><strong>Interview Invitation:</strong> Shortlisted applicants will receive an invitation for an interview.</li>
              <li><strong>Admission Decision:</strong> You will be notified of the decision via email at <span style="text-decoration: underline;">${app.email}</span>.</li>
            </ul>
          </div>

          <p style="margin-bottom: 4px;">If you have any questions or need to submit additional documents, feel free to reply directly to this email or contact us at:</p>
          <p style="margin: 0; color: #0400CC; font-weight: bold;">admissions@sit.edu.la &bull; +856 21 123 456</p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8; text-align: center;">
            <p style="margin: 0;">&copy; ${new Date().getFullYear()} Soutsakan Institute of Technology. All rights reserved.</p>
            <p style="margin: 4px 0 0 0;">123 Innovation Avenue, Vientiane, Laos</p>
          </div>
        </div>
      </div>
    `;

    // Dispatch via Resend or log
    await this.sendMailSafe({
      to: this.adminEmail,
      subject: `[New Application] ${app.fullName} - ${app.intendedProgram}`,
      html: adminHtml,
    });

    if (app.email && app.email.includes('@')) {
      await this.sendMailSafe({
        to: app.email,
        subject: `Your SIT Application Confirmation: ${app.intendedProgram}`,
        html: applicantHtml,
      });
    }
  }

  /**
   * Send emails for a new Request Info submission
   */
  async sendRequestInfoSubmission(req: {
    id: string;
    fullName: string;
    email: string;
    phone?: string;
    country?: string;
    city?: string;
    currentEducationLevel?: string;
    graduationYear?: string;
    programOfInterest: string;
    intakeTerm?: string;
    planToStart?: string;
    interests?: string;
    hearAboutUs?: string;
    communicationPreferences?: string;
    message?: string;
  }) {
    const parsedInterests: string[] = (() => {
      if (!req.interests) return [];
      try {
        const parsed = JSON.parse(req.interests);
        return Array.isArray(parsed) ? parsed : [req.interests];
      } catch {
        return [req.interests];
      }
    })();

    const interestsHtml = parsedInterests.length > 0
      ? `
        <div style="display: flex; flex-wrap: wrap; gap: 6px; margin-top: 6px;">
          ${parsedInterests.map(i => `<span style="display: inline-block; padding: 4px 10px; background: #e0e7ff; color: #3730a3; border-radius: 999px; font-size: 12px; font-weight: 600;">${i}</span>`).join(' ')}
        </div>
      `
      : '<span style="color: #64748b;">None specified</span>';

    // 1. Admin notification email
    const adminHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 650px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #0400CC 0%, #00001C 100%); padding: 24px; color: #ffffff;">
          <h2 style="margin: 0 0 6px 0; font-size: 22px; font-weight: bold;">New Information Request Received</h2>
          <p style="margin: 0; font-size: 14px; opacity: 0.9;">Inquiry ID: #${req.id.slice(0, 8).toUpperCase()} &bull; Program: ${req.programOfInterest}</p>
        </div>

        <div style="padding: 24px;">
          <h3 style="color: #0400CC; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; margin-top: 0;">Prospective Student Details</h3>
          <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-bottom: 20px;">
            <tr><td style="padding: 6px 0; color: #64748b; width: 150px;">Full Name:</td><td style="padding: 6px 0; font-weight: bold; color: #0f172a;">${req.fullName}</td></tr>
            <tr><td style="padding: 6px 0; color: #64748b;">Email:</td><td style="padding: 6px 0; color: #0f172a;"><a href="mailto:${req.email}" style="color: #0400CC;">${req.email}</a></td></tr>
            <tr><td style="padding: 6px 0; color: #64748b;">Phone:</td><td style="padding: 6px 0; color: #0f172a;">${req.phone || 'N/A'}</td></tr>
            <tr><td style="padding: 6px 0; color: #64748b;">Country / Location:</td><td style="padding: 6px 0; color: #0f172a;">${req.country || ''} ${req.city ? `(${req.city})` : ''}</td></tr>
            <tr><td style="padding: 6px 0; color: #64748b;">Education Level:</td><td style="padding: 6px 0; color: #0f172a;">${req.currentEducationLevel || 'N/A'}</td></tr>
            <tr><td style="padding: 6px 0; color: #64748b;">Graduation Year:</td><td style="padding: 6px 0; color: #0f172a;">${req.graduationYear || 'N/A'}</td></tr>
            <tr><td style="padding: 6px 0; color: #64748b;">Program of Interest:</td><td style="padding: 6px 0; font-weight: bold; color: #0400CC;">${req.programOfInterest}</td></tr>
            <tr><td style="padding: 6px 0; color: #64748b;">Target Start Term:</td><td style="padding: 6px 0; color: #0f172a;">${req.planToStart || req.intakeTerm || 'N/A'}</td></tr>
            <tr><td style="padding: 6px 0; color: #64748b;">Referral Source:</td><td style="padding: 6px 0; color: #0f172a;">${req.hearAboutUs || 'Website'}</td></tr>
          </table>

          <h3 style="color: #0400CC; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px;">Areas of Interest</h3>
          <div style="margin-bottom: 20px;">
            ${interestsHtml}
          </div>

          ${req.message ? `
            <h3 style="color: #0400CC; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px;">Questions / Inquiries</h3>
            <div style="background: #f8fafc; padding: 16px; border-radius: 8px; font-size: 14px; line-height: 1.6; color: #334155; white-space: pre-wrap; margin-bottom: 20px;">${req.message}</div>
          ` : ''}

          <div style="margin-top: 28px; padding-top: 16px; border-top: 1px solid #e2e8f0; text-align: center;">
            <p style="font-size: 12px; color: #94a3b8; margin: 0;">Soutsakan Institute of Technology (SIT) Inquiries System</p>
          </div>
        </div>
      </div>
    `;

    // 2. Student confirmation email
    const studentHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
        <div style="background: #0400CC; padding: 28px 24px; text-align: center; color: #ffffff;">
          <h1 style="margin: 0 0 8px 0; font-size: 24px; font-weight: bold;">Thank You for Your Interest in SIT!</h1>
          <p style="margin: 0; font-size: 15px; opacity: 0.95;">Your SIT Information Packet is on its way.</p>
        </div>

        <div style="padding: 28px 24px; font-size: 15px; line-height: 1.6; color: #334155;">
          <p>Hello <strong>${req.fullName}</strong>,</p>
          <p>Thank you for requesting information regarding the <strong>${req.programOfInterest}</strong> at Soutsakan Institute of Technology.</p>
          
          <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 16px; margin: 20px 0;">
            <h4 style="margin: 0 0 6px 0; color: #1e40af; font-size: 15px;">What You Will Receive:</h4>
            <ul style="margin: 0; padding-left: 20px; color: #1e40af; font-size: 14px;">
              <li style="margin-bottom: 6px;">Detailed curriculum breakdown &amp; program brochure</li>
              <li style="margin-bottom: 6px;">Campus life, laboratory facilities, and community overview</li>
              <li style="margin-bottom: 6px;">Tuition rates, payment plans &amp; scholarship guide</li>
              <li>Application timeline &amp; admission requirements checklist</li>
            </ul>
          </div>

          <p>Our admissions advisors are available to answer any specific questions you may have or schedule a 1-on-1 campus tour.</p>
          <p style="margin: 0; color: #0400CC; font-weight: bold;">info@sit.edu.la &bull; +856 21 123 456</p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8; text-align: center;">
            <p style="margin: 0;">&copy; ${new Date().getFullYear()} Soutsakan Institute of Technology. All rights reserved.</p>
          </div>
        </div>
      </div>
    `;

    // Dispatch via Resend or log
    await this.sendMailSafe({
      to: this.adminEmail,
      subject: `[Information Request] ${req.fullName} - ${req.programOfInterest}`,
      html: adminHtml,
    });

    if (req.email && req.email.includes('@')) {
      await this.sendMailSafe({
        to: req.email,
        subject: `Welcome to SIT: Information on ${req.programOfInterest}`,
        html: studentHtml,
      });
    }
  }

  private async sendMailSafe(options: { to: string; subject: string; html: string }) {
    if (!this.resend) {
      this.logger.log(`[Mock Email Sent] To: ${options.to} | Subject: ${options.subject}`);
      return;
    }

    try {
      const response = await this.resend.emails.send({
        from: this.fromEmail,
        to: options.to,
        subject: options.subject,
        html: options.html,
      });

      this.logger.log(`[Email Sent via Resend] ID: ${response.data?.id || 'OK'} to ${options.to}`);
    } catch (err: any) {
      this.logger.error(`Failed to send email to ${options.to} via Resend: ${err.message}`);
    }
  }
}
