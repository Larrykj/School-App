import prisma from '../utils/prisma';

export interface CreateApplicationData {
  // Personal Information
  firstName: string;
  lastName: string;
  middleName?: string;
  dateOfBirth: Date;
  gender: string;
  nationality?: string;
  nationalId?: string;
  email: string;
  phone: string;
  // Address
  county: string;
  subCounty: string;
  address: string;
  postalCode?: string;
  // Academic Background
  kcseIndex?: string;
  kcseYear?: number;
  kcseGrade?: string;
  kcsePoints?: number;
  secondarySchool?: string;
  // Previous Education
  previousInstitution?: string;
  previousProgram?: string;
  previousGPA?: string;
  graduationYear?: number;
  // Program Selection
  programId: string;
  intake: string;
  // KUCCPS
  kuccpsIndex?: string;
  kuccpsPlacement?: string;
  placementType?: string;
  // Guardian
  guardianName: string;
  guardianPhone: string;
  guardianEmail?: string;
  guardianRelationship: string;
  // Medical
  bloodGroup?: string;
  disabilities?: string;
  medicalConditions?: string;
  // Emergency Contact
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelation: string;
}

export class ApplicationService {
  /**
   * Generate unique application number
   */
  static async generateApplicationNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const count = await prisma.application.count({
      where: {
        createdAt: {
          gte: new Date(`${year}-01-01`),
          lte: new Date(`${year}-12-31`),
        },
      },
    });
    
    const number = (count + 1).toString().padStart(4, '0');
    return `APP${year}${number}`;
  }

  /**
   * Create a new application
   */
  static async createApplication(data: CreateApplicationData) {
    // First create a student record
    const student = await prisma.student.create({
      data: {
        admissionNumber: `TEMP-${Date.now()}`, // Temporary, will be updated on admission
        firstName: data.firstName,
        lastName: data.lastName,
        dateOfBirth: data.dateOfBirth,
        gender: data.gender,
        nationalId: data.nationalId,
        email: data.email,
        phone: data.phone,
        address: data.address,
        county: data.county,
        subCounty: data.subCounty,
        bloodGroup: data.bloodGroup,
        disabilities: data.disabilities,
        medicalConditions: data.medicalConditions,
        emergencyContactName: data.emergencyContactName,
        emergencyContactPhone: data.emergencyContactPhone,
        kuccpsIndex: data.kuccpsIndex,
        placementType: data.placementType,
        placementYear: data.kcseYear,
        isActive: false, // Not active until admitted
      },
    });

    // Generate application number
    const applicationNumber = await this.generateApplicationNumber();

    // Create application
    const application = await prisma.application.create({
      data: {
        applicationNumber,
        studentId: student.id,
        firstName: data.firstName,
        lastName: data.lastName,
        middleName: data.middleName,
        dateOfBirth: data.dateOfBirth,
        gender: data.gender,
        nationality: data.nationality || 'Kenyan',
        nationalId: data.nationalId,
        email: data.email,
        phone: data.phone,
        county: data.county,
        subCounty: data.subCounty,
        address: data.address,
        postalCode: data.postalCode,
        kcseIndex: data.kcseIndex,
        kcseYear: data.kcseYear,
        kcseGrade: data.kcseGrade,
        kcsePoints: data.kcsePoints,
        secondarySchool: data.secondarySchool,
        previousInstitution: data.previousInstitution,
        previousProgram: data.previousProgram,
        previousGPA: data.previousGPA,
        graduationYear: data.graduationYear,
        programId: data.programId,
        intake: data.intake,
        kuccpsIndex: data.kuccpsIndex,
        kuccpsPlacement: data.kuccpsPlacement,
        placementType: data.placementType,
        guardianName: data.guardianName,
        guardianPhone: data.guardianPhone,
        guardianEmail: data.guardianEmail,
        guardianRelationship: data.guardianRelationship,
        bloodGroup: data.bloodGroup,
        disabilities: data.disabilities,
        medicalConditions: data.medicalConditions,
        emergencyContactName: data.emergencyContactName,
        emergencyContactPhone: data.emergencyContactPhone,
        emergencyContactRelation: data.emergencyContactRelation,
        status: 'DRAFT',
      },
      include: {
        program: true,
        student: true,
      },
    });

    return application;
  }

  /**
   * Submit application
   */
  static async submitApplication(applicationId: string) {
    // Validate application is complete
    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      include: { documents: true },
    });

    if (!application) {
      throw new Error('Application not found');
    }

    if (application.status !== 'DRAFT') {
      throw new Error('Only draft applications can be submitted');
    }

    // Check required documents
    const requiredDocs = ['KCSE_CERTIFICATE', 'BIRTH_CERTIFICATE', 'NATIONAL_ID', 'PASSPORT_PHOTO'];
    const uploadedTypes = application.documents.map(d => d.documentType);
    const missingDocs = requiredDocs.filter(type => !uploadedTypes.includes(type));

    if (missingDocs.length > 0) {
      throw new Error(`Missing required documents: ${missingDocs.join(', ')}`);
    }

    // Update status
    const updated = await prisma.application.update({
      where: { id: applicationId },
      data: {
        status: 'SUBMITTED',
        submittedAt: new Date(),
      },
      include: {
        program: true,
        student: true,
        documents: true,
      },
    });

    return updated;
  }

  /**
   * Review application
   */
  static async reviewApplication(applicationId: string, reviewedBy: string, notes?: string) {
    const application = await prisma.application.update({
      where: { id: applicationId },
      data: {
        status: 'UNDER_REVIEW',
        reviewedAt: new Date(),
        reviewedBy,
        reviewNotes: notes,
      },
      include: {
        program: true,
        student: true,
      },
    });

    return application;
  }

  /**
   * Approve application and admit student
   */
  static async approveApplication(applicationId: string, reviewedBy: string) {
    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      include: {
        program: true,
        student: true,
      },
    });

    if (!application) {
      throw new Error('Application not found');
    }

    // Generate admission number
    const admissionNumber = await this.generateAdmissionNumber(application.program.code);

    // Update application
    await prisma.application.update({
      where: { id: applicationId },
      data: {
        status: 'APPROVED',
        reviewedAt: new Date(),
        reviewedBy,
      },
    });

    // Update student record
    await prisma.student.update({
      where: { id: application.studentId },
      data: {
        admissionNumber,
        isActive: true,
      },
    });

    // TODO: Generate admission letter
    // TODO: Send notification email

    return {
      application,
      admissionNumber,
    };
  }

  /**
   * Reject application
   */
  static async rejectApplication(applicationId: string, reviewedBy: string, reason: string) {
    const application = await prisma.application.update({
      where: { id: applicationId },
      data: {
        status: 'REJECTED',
        reviewedAt: new Date(),
        reviewedBy,
        reviewNotes: reason,
      },
      include: {
        program: true,
        student: true,
      },
    });

    // TODO: Send rejection email

    return application;
  }

  /**
   * Generate admission number
   */
  static async generateAdmissionNumber(programCode: string): Promise<string> {
    const year = new Date().getFullYear();
    const count = await prisma.student.count({
      where: {
        admissionNumber: {
          startsWith: `${programCode}/${year}/`,
        },
      },
    });

    const number = (count + 1).toString().padStart(3, '0');
    return `${programCode}/${year}/${number}`;
  }

  /**
   * Get application by ID
   */
  static async getApplicationById(applicationId: string) {
    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      include: {
        program: {
          include: {
            department: true,
          },
        },
        student: true,
        documents: true,
      },
    });

    return application;
  }

  /**
   * Get all applications with filters
   */
  static async getApplications(filters?: {
    status?: string;
    programId?: string;
    intake?: string;
    search?: string;
  }) {
    const where: any = {};

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.programId) {
      where.programId = filters.programId;
    }

    if (filters?.intake) {
      where.intake = filters.intake;
    }

    if (filters?.search) {
      where.OR = [
        { applicationNumber: { contains: filters.search } },
        { firstName: { contains: filters.search } },
        { lastName: { contains: filters.search } },
        { email: { contains: filters.search } },
        { phone: { contains: filters.search } },
      ];
    }

    const applications = await prisma.application.findMany({
      where,
      include: {
        program: true,
        student: true,
        _count: {
          select: { documents: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return applications;
  }

  /**
   * Get application statistics
   */
  static async getStatistics() {
    const [total, submitted, underReview, approved, rejected, waitlisted] = await Promise.all([
      prisma.application.count(),
      prisma.application.count({ where: { status: 'SUBMITTED' } }),
      prisma.application.count({ where: { status: 'UNDER_REVIEW' } }),
      prisma.application.count({ where: { status: 'APPROVED' } }),
      prisma.application.count({ where: { status: 'REJECTED' } }),
      prisma.application.count({ where: { status: 'WAITLISTED' } }),
    ]);

    return {
      total,
      submitted,
      underReview,
      approved,
      rejected,
      waitlisted,
      draft: total - (submitted + underReview + approved + rejected + waitlisted),
    };
  }
}

