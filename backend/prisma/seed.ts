import { PrismaClient, UserRole, PaymentMode, PaymentStatus, AttendanceStatus, ExamType, ProgramType, EnrollmentStatus, RegistrationStatus, GradeStatus, ApplicationStatus, DocumentType } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import {
  getRandomKenyanName,
  getRandomCounty,
  getRandomSubCounty,
  generateKenyanPhone,
  generateKenyanId,
  generateKUCCPSIndex,
  generateMpesaRef,
  generateCheckoutRequestId,
  generateMerchantRequestId,
  generateVehicleReg,
} from './seeds/kenyan-names';
import { departments, programs } from './seeds/programs';
import { courses, secondarySubjects } from './seeds/courses';

const prisma = new PrismaClient();

// Helper functions
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomElement<T>(array: T[]): T {
  return array[randomInt(0, array.length - 1)];
}

function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function getDateYearsAgo(years: number): Date {
  const date = new Date();
  date.setFullYear(date.getFullYear() - years);
  return date;
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function addMonths(date: Date, months: number): Date {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
}

function generateAdmissionNumber(year: number, programCode: string, sequence: number): string {
  return `${programCode}/${year}/${sequence.toString().padStart(3, '0')}`;
}

function generateStaffNumber(sequence: number): string {
  return `ST${new Date().getFullYear()}${sequence.toString().padStart(4, '0')}`;
}

async function main() {
  console.log('🌱 Starting comprehensive database seeding...\n');
  const startTime = Date.now();

  // Clear existing data
  console.log('🗑️  Clearing existing data...');
  
  // Delete in correct order to avoid foreign key constraints
  await prisma.paymentFeeItem.deleteMany();
  await prisma.mpesaTransaction.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.studentFee.deleteMany();
  await prisma.feeStructure.deleteMany();
  await prisma.mark.deleteMany();
  await prisma.reportCard.deleteMany();
  await prisma.exam.deleteMany();
  await prisma.attendance.deleteMany();
  await prisma.timetable.deleteMany();
  await prisma.courseGrade.deleteMany();
  await prisma.courseRegistration.deleteMany();
  await prisma.courseOffering.deleteMany();
  await prisma.coursePrerequisite.deleteMany();
  await prisma.course.deleteMany();
  await prisma.transcript.deleteMany();
  await prisma.studentEnrollment.deleteMany();
  await prisma.semester.deleteMany();
  await prisma.academicYear.deleteMany();
  await prisma.applicationDocument.deleteMany();
  await prisma.application.deleteMany();
  await prisma.studentDocument.deleteMany();
  await prisma.studentIDCard.deleteMany();
  await prisma.studentMedicalRecord.deleteMany();
  await prisma.disciplinaryRecord.deleteMany();
  await prisma.bookBorrow.deleteMany();
  await prisma.book.deleteMany();
  await prisma.bedAssignment.deleteMany();
  await prisma.transportAssignment.deleteMany();
  await prisma.transportRoute.deleteMany();
  await prisma.transport.deleteMany();
  await prisma.dormitory.deleteMany();
  await prisma.student.deleteMany();
  await prisma.class.deleteMany();
  await prisma.parent.deleteMany();
  await prisma.staff.deleteMany();
  await prisma.academicProgram.deleteMany();
  await prisma.department.deleteMany();
  await prisma.user.deleteMany();
  
  console.log('✅ Database cleared\n');

  // Hash password for all users
  const hashedPassword = await bcrypt.hash('password123', 10);

  // 1. Create Users (Staff, Students, Parents)
  console.log('👥 Creating users...');
  
  // Create Super Admin
  const superAdmin = await prisma.user.create({
    data: {
      email: 'admin@university.ac.ke',
      password: hashedPassword,
      role: 'SUPER_ADMIN',
      firstName: 'System',
      lastName: 'Administrator',
      phone: generateKenyanPhone(),
      isActive: true,
    },
  });
  console.log('   ✓ Super Admin created');

  // Create School Admins (5)
  const admins = [];
  for (let i = 0; i < 5; i++) {
    const name = getRandomKenyanName('male');
    const admin = await prisma.user.create({
      data: {
        email: `admin${i + 1}@university.ac.ke`,
        password: hashedPassword,
        role: 'SCHOOL_ADMIN',
        firstName: name.firstName,
        lastName: name.lastName,
        phone: generateKenyanPhone(),
        isActive: true,
      },
    });
    admins.push(admin);
  }
  console.log('   ✓ School Admins created (5)');

  // Create Accountants (5)
  const accountants = [];
  for (let i = 0; i < 5; i++) {
    const name = getRandomKenyanName(i % 2 === 0 ? 'male' : 'female');
    const accountant = await prisma.user.create({
      data: {
        email: `accountant${i + 1}@university.ac.ke`,
        password: hashedPassword,
        role: 'ACCOUNTANT',
        firstName: name.firstName,
        lastName: name.lastName,
        phone: generateKenyanPhone(),
        isActive: true,
      },
    });
    accountants.push(accountant);
  }
  console.log('   ✓ Accountants created (5)');

  // Create Clerks (5)
  const clerks = [];
  for (let i = 0; i < 5; i++) {
    const name = getRandomKenyanName(i % 2 === 0 ? 'female' : 'male');
    const clerk = await prisma.user.create({
      data: {
        email: `clerk${i + 1}@university.ac.ke`,
        password: hashedPassword,
        role: 'CLERK',
        firstName: name.firstName,
        lastName: name.lastName,
        phone: generateKenyanPhone(),
        isActive: true,
      },
    });
    clerks.push(clerk);
  }
  console.log('   ✓ Clerks created (5)');

  // Create Teachers/Lecturers (50)
  const teachers = [];
  for (let i = 0; i < 50; i++) {
    const name = getRandomKenyanName(i % 3 === 0 ? 'female' : 'male');
    const teacher = await prisma.user.create({
      data: {
        email: `lecturer${i + 1}@university.ac.ke`,
        password: hashedPassword,
        role: 'TEACHER',
        firstName: name.firstName,
        lastName: name.lastName,
        phone: generateKenyanPhone(),
        isActive: true,
      },
    });
    teachers.push(teacher);
  }
  console.log('   ✓ Lecturers created (50)');

  // Create Staff records for all non-student users
  const allStaffUsers = [superAdmin, ...admins, ...accountants, ...clerks, ...teachers];
  const staffRecords = [];
  for (let i = 0; i < allStaffUsers.length; i++) {
    const user = allStaffUsers[i];
    const deptIndex = i % departments.length;
    const staff = await prisma.staff.create({
      data: {
        userId: user.id,
        staffNumber: generateStaffNumber(i + 1),
        department: departments[deptIndex].name,
        position: user.role === 'TEACHER' ? 'Lecturer' : user.role.replace('_', ' '),
        hireDate: randomDate(getDateYearsAgo(10), getDateYearsAgo(1)),
      },
    });
    staffRecords.push(staff);
  }
  console.log('   ✓ Staff records created (66)');

  // Create Parents (100)
  const parentUsers = [];
  for (let i = 0; i < 100; i++) {
    const name = getRandomKenyanName(i % 2 === 0 ? 'male' : 'female');
    const county = getRandomCounty();
    const parent = await prisma.user.create({
      data: {
        email: `parent${i + 1}@email.com`,
        password: hashedPassword,
        role: 'PARENT',
        firstName: name.firstName,
        lastName: name.lastName,
        phone: generateKenyanPhone(),
        isActive: true,
        parent: {
          create: {
            nationalId: generateKenyanId(),
            occupation: randomElement(['Teacher', 'Farmer', 'Business Owner', 'Civil Servant', 'Doctor', 'Engineer', 'Accountant', 'Driver', 'Trader']),
            address: `P.O. Box ${randomInt(100, 9999)}, ${county}`,
            emergencyContact: name.firstName + ' ' + name.lastName,
            emergencyPhone: generateKenyanPhone(),
          },
        },
      },
      include: { parent: true },
    });
    parentUsers.push(parent);
  }
  console.log('   ✓ Parents created (100)');

  console.log('✅ Users created: 671 total\n');

  // Mark first todo as complete
  console.log('📝 Marking todo 1 as complete...\n');

  // 2. Create Departments and Programs
  console.log('🏛️  Creating academic structure...');
  
  const createdDepartments = [];
  for (const dept of departments) {
    const department = await prisma.department.create({
      data: {
        name: dept.name,
        code: dept.code,
        description: `${dept.name} offers quality education and research opportunities.`,
      },
    });
    createdDepartments.push(department);
  }
  console.log('   ✓ Departments created (15)');

  const createdPrograms = [];
  for (const prog of programs) {
    const department = createdDepartments.find(d => d.code === prog.departmentCode);
    if (!department) continue;
    
    const program = await prisma.academicProgram.create({
      data: {
        name: prog.name,
        code: prog.code,
        departmentId: department.id,
        duration: prog.duration,
        programType: prog.type as ProgramType,
        creditHours: prog.duration * 30, // Assuming 30 credits per year
        description: `A comprehensive ${prog.duration}-year program in ${prog.name.toLowerCase()}.`,
        isActive: true,
      },
    });
    createdPrograms.push(program);
  }
  console.log('   ✓ Programs created (29)');

  // Create Courses
  const createdCourses = [];
  for (const course of courses) {
    const createdCourse = await prisma.course.create({
      data: {
        code: course.code,
        name: course.name,
        creditHours: course.credits,
        level: Math.floor(course.level / 100), // Convert 100, 200, 300, 400 to 1, 2, 3, 4
        description: `${course.name} - ${course.credits} credit hours`,
        isElective: course.level >= 300, // Upper level courses are elective
        isActive: true,
      },
    });
    createdCourses.push(createdCourse);
  }
  console.log('   ✓ Courses created (200+)');

  // Create Course Prerequisites
  let prerequisiteCount = 0;
  for (const course of courses) {
    if (course.prerequisites && course.prerequisites.length > 0) {
      const mainCourse = createdCourses.find(c => c.code === course.code);
      if (!mainCourse) continue;

      for (const prereqCode of course.prerequisites) {
        const prereqCourse = createdCourses.find(c => c.code === prereqCode);
        if (!prereqCourse) continue;

        await prisma.coursePrerequisite.create({
          data: {
            courseId: mainCourse.id,
            prerequisiteId: prereqCourse.id,
            isStrict: true,
          },
        });
        prerequisiteCount++;
      }
    }
  }
  console.log(`   ✓ Course prerequisites created (${prerequisiteCount})`);

  // Create Academic Years (6 years: 2019-2024)
  const academicYears = [];
  for (let year = 2019; year <= 2024; year++) {
    const academicYear = await prisma.academicYear.create({
      data: {
        name: `${year}/${year + 1}`,
        startDate: new Date(year, 8, 1), // September 1
        endDate: new Date(year + 1, 7, 31), // August 31
        isCurrent: year === 2024,
      },
    });
    academicYears.push(academicYear);
  }
  console.log('   ✓ Academic Years created (6: 2019-2024)');

  // Create Semesters (2 per year = 12 total)
  const semesters = [];
  for (const year of academicYears) {
    const yearNum = parseInt(year.name.split('/')[0]);
    
    // Semester 1 (Sept - Dec)
    const sem1 = await prisma.semester.create({
      data: {
        name: `Semester 1 ${year.name}`,
        academicYearId: year.id,
        startDate: new Date(yearNum, 8, 1),
        endDate: new Date(yearNum, 11, 31),
        registrationStart: new Date(yearNum, 7, 1),
        registrationEnd: new Date(yearNum, 8, 15),
        status: year.isCurrent && new Date().getMonth() < 4 ? 'ACTIVE' : 'COMPLETED',
      },
    });
    semesters.push(sem1);

    // Semester 2 (Jan - May)
    const sem2 = await prisma.semester.create({
      data: {
        name: `Semester 2 ${year.name}`,
        academicYearId: year.id,
        startDate: new Date(yearNum + 1, 0, 1),
        endDate: new Date(yearNum + 1, 4, 31),
        registrationStart: new Date(yearNum, 11, 1),
        registrationEnd: new Date(yearNum + 1, 0, 15),
        status: year.isCurrent && new Date().getMonth() >= 4 ? 'ACTIVE' : 'COMPLETED',
      },
    });
    semesters.push(sem2);
  }
  console.log('   ✓ Semesters created (12)');

  // Create Course Offerings (300+)
  const courseOfferings = [];
  for (const semester of semesters) {
    // Select random lecturers for this semester
    const lecturerCount = Math.min(30, createdCourses.length);
    const semesterCourses = [];
    
    for (let i = 0; i < lecturerCount; i++) {
      const course = createdCourses[i % createdCourses.length];
      const lecturer = staffRecords[randomInt(16, staffRecords.length - 1)]; // Skip non-lecturers
      
      const offering = await prisma.courseOffering.create({
        data: {
          courseId: course.id,
          semesterId: semester.id,
          lecturerId: lecturer.id,
          maxStudents: randomInt(40, 100),
          venue: `LH${randomInt(1, 20)}`,
          schedule: `${randomElement(['MON', 'TUE', 'WED', 'THU', 'FRI'])} ${randomInt(8, 16)}:00`,
        },
      });
      courseOfferings.push(offering);
      semesterCourses.push(offering);
    }
  }
  console.log(`   ✓ Course Offerings created (${courseOfferings.length})`);

  console.log('✅ Academic structure complete\n');

  // 3. Create Students (500)
  console.log('👨‍🎓 Creating students...');
  
  const students = [];
  const studentUsers = [];
  
  for (let i = 0; i < 500; i++) {
    const gender = i % 4 === 0 ? 'female' : 'male'; // 25% female, 75% male (realistic for tech)
    const name = getRandomKenyanName(gender);
    // Filter programs - they're stored in the database now with programType field
    const bachelorPrograms = createdPrograms.filter(p => p.programType === 'BACHELORS');
    if (bachelorPrograms.length === 0) {
      console.error('No BACHELORS programs found. Available programs:', createdPrograms.slice(0, 3));
      process.exit(1);
    }
    const program = randomElement(bachelorPrograms);
    const county = getRandomCounty();
    const placementYear = randomInt(2019, 2024);
    const isGovernment = Math.random() < 0.6; // 60% government sponsored
    
    const studentUser = await prisma.user.create({
      data: {
        email: `${name.firstName.toLowerCase()}.${name.lastName.toLowerCase()}${i}@student.ac.ke`,
        password: hashedPassword,
        role: 'PARENT', // Using parent role for now as students don't have separate login
        firstName: name.firstName,
        lastName: name.lastName,
        phone: generateKenyanPhone(),
        isActive: true,
      },
    });
    studentUsers.push(studentUser);

    const parent = randomElement(parentUsers);
    const dob = randomDate(new Date(1998, 0, 1), new Date(2006, 11, 31));
    
    const student = await prisma.student.create({
      data: {
        admissionNumber: generateAdmissionNumber(placementYear, program.code, i + 1),
        firstName: name.firstName,
        lastName: name.lastName,
        dateOfBirth: dob,
        gender: gender === 'male' ? 'Male' : 'Female',
        nationalId: Math.random() < 0.7 ? generateKenyanId() : null,
        phone: generateKenyanPhone(),
        email: studentUser.email,
        address: `P.O. Box ${randomInt(100, 9999)}, ${county}`,
        county: county,
        subCounty: getRandomSubCounty(county),
        parentId: parent.parent?.id,
        enrollmentDate: new Date(placementYear, 8, 1),
        isActive: placementYear >= 2021, // Students from 2019-2020 may have graduated
        photoUrl: null,
        bloodGroup: randomElement(['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']),
        disabilities: Math.random() < 0.05 ? 'Visual impairment' : null,
        medicalConditions: Math.random() < 0.1 ? randomElement(['Asthma', 'Diabetes', 'Epilepsy', 'None']) : null,
        emergencyContactName: `${parent.firstName} ${parent.lastName}`,
        emergencyContactPhone: parent.phone || generateKenyanPhone(),
        kuccpsIndex: isGovernment ? generateKUCCPSIndex(placementYear) : null,
        placementType: isGovernment ? 'GOVERNMENT' : 'PARALLEL',
        placementYear: placementYear,
      },
    });
    students.push(student);

    // Progress indicator
    if ((i + 1) % 100 === 0) {
      console.log(`   ✓ Created ${i + 1}/500 students...`);
    }
  }
  console.log('✅ Students created (500)\n');

  // 4. Create Student Enrollments in Programs
  console.log('📚 Creating student enrollments...');
  
  const enrollments = [];
  for (const student of students) {
    // Find a suitable program based on admission year
    const placementYear = student.placementYear || 2024;
    const programs = createdPrograms.filter(p => p.programType === 'BACHELORS');
    const program = randomElement(programs);
    
    // Determine year of study
    const yearsEnrolled = 2024 - placementYear + 1;
    const yearOfStudy = Math.min(yearsEnrolled, program.duration);
    
    // Determine status
    let status: EnrollmentStatus;
    if (placementYear <= 2020 && program.duration === 4) {
      status = 'GRADUATED';
    } else if (Math.random() < 0.05) {
      status = randomElement(['SUSPENDED', 'ON_LEAVE', 'WITHDRAWN'] as EnrollmentStatus[]);
    } else {
      status = 'ACTIVE';
    }
    
    const enrollment = await prisma.studentEnrollment.create({
      data: {
        studentId: student.id,
        programId: program.id,
        registrationNumber: student.admissionNumber,
        enrollmentDate: student.enrollmentDate,
        expectedGraduation: addMonths(student.enrollmentDate, program.duration * 12),
        yearOfStudy: yearOfStudy,
        status: status,
        currentGPA: 0, // Will be calculated later
        cumulativeCredits: 0,
      },
    });
    enrollments.push(enrollment);
  }
  console.log(`   ✓ Student enrollments created (${enrollments.length})`);

  // 5. Create Course Registrations & Grades
  console.log('📝 Creating course registrations and grades...');
  
  let registrationCount = 0;
  let gradeCount = 0;
  const gradeLetters = ['A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'D-', 'E'];
  const gradePoints = [4.0, 3.7, 3.3, 3.0, 2.7, 2.3, 2.0, 1.7, 1.3, 1.0, 0.7, 0.0]; // 4.0 scale
  
  for (const enrollment of enrollments) {
    const student = students.find(s => s.id === enrollment.studentId);
    if (!student) continue;
    
    const placementYear = student.placementYear || 2024;
    const studentSemesters = semesters.filter(sem => {
      const semYear = parseInt(sem.name.split(' ')[2].split('/')[0]);
      return semYear >= placementYear && semYear < placementYear + 4;
    });

    let totalGradePoints = 0;
    let totalCredits = 0;
    
    for (const semester of studentSemesters) {
      // Register for 6-8 courses per semester
      const numCourses = randomInt(6, 8);
      const semesterOfferings = courseOfferings.filter(co => co.semesterId === semester.id);
      
      if (semesterOfferings.length === 0) continue;
      
      for (let i = 0; i < numCourses && i < semesterOfferings.length; i++) {
        const offering = semesterOfferings[i % semesterOfferings.length];
        const course = createdCourses.find(c => c.id === offering.courseId);
        if (!course) continue;
        
        // Check if semester is completed
        const isCompleted = new Date(semester.endDate) < new Date();
        const regStatus: RegistrationStatus = isCompleted ? 'APPROVED' : randomElement(['APPROVED', 'PENDING'] as RegistrationStatus[]);
        
        const registration = await prisma.courseRegistration.create({
          data: {
            enrollmentId: enrollment.id,
            offeringId: offering.id,
            semesterId: semester.id,
            status: regStatus === 'APPROVED' ? 'APPROVED' : 'PENDING',
            registeredDate: new Date(semester.registrationStart),
            approvedDate: regStatus === 'APPROVED' ? addDays(new Date(semester.registrationStart), randomInt(1, 7)) : null,
          },
        });
        registrationCount++;
        
        // Create grade if semester is completed and approved
        if (isCompleted && regStatus === 'APPROVED') {
          // Generate realistic grade distribution (bell curve)
          const rand = Math.random();
          let gradeIndex;
          if (rand < 0.05) gradeIndex = 0; // 5% A
          else if (rand < 0.15) gradeIndex = 1; // 10% A-
          else if (rand < 0.30) gradeIndex = 2; // 15% B+
          else if (rand < 0.50) gradeIndex = 3; // 20% B
          else if (rand < 0.70) gradeIndex = 4; // 20% B-
          else if (rand < 0.85) gradeIndex = 5; // 15% C+
          else if (rand < 0.92) gradeIndex = 6; // 7% C
          else if (rand < 0.96) gradeIndex = 7; // 4% C-
          else if (rand < 0.98) gradeIndex = 8; // 2% D+
          else if (rand < 0.99) gradeIndex = 9; // 1% D
          else gradeIndex = 10; // 1% D-/E
          
          const gradePointValue = gradePoints[gradeIndex];
          if (gradePointValue < 0 || gradePointValue > 4.0) {
            console.error(`Invalid grade point: ${gradePointValue} at index ${gradeIndex}`);
            continue;
          }
          
          const grade = await prisma.courseGrade.create({
            data: {
              enrollmentId: enrollment.id,
              offeringId: offering.id,
              catMarks: randomInt(15, 30),
              examMarks: randomInt(40, 70),
              totalMarks: randomInt(55, 100),
              letterGrade: gradeLetters[gradeIndex],
              gradePoints: gradePointValue,
              creditHours: course.creditHours,
              isPublished: true,
              submittedDate: addDays(new Date(semester.endDate), randomInt(1, 30)),
            },
          });
          gradeCount++;
          
          totalGradePoints += gradePoints[gradeIndex] * course.creditHours;
          totalCredits += course.creditHours;
        }
      }
    }
    
    // Update enrollment GPA
    if (totalCredits > 0) {
      const gpa = totalGradePoints / totalCredits;
      await prisma.studentEnrollment.update({
        where: { id: enrollment.id },
        data: {
          currentGPA: gpa,
          cumulativeCredits: totalCredits,
        },
      });
    }
    
    if (enrollments.indexOf(enrollment) % 100 === 0) {
      console.log(`   ✓ Processed ${enrollments.indexOf(enrollment)}/500 students...`);
    }
  }
  console.log(`   ✓ Course registrations created (${registrationCount})`);
  console.log(`   ✓ Grades created (${gradeCount})`);

  // 6. Create Transcripts for graduated students
  console.log('📜 Generating transcripts...');
  const graduatedEnrollments = enrollments.filter(e => e.status === 'GRADUATED');
  for (const enrollment of graduatedEnrollments) {
    const totalCredits = randomInt(120, 140);
    const gpa = enrollment.currentGPA ? parseFloat(enrollment.currentGPA.toString()) : 0;
    
    await prisma.transcript.create({
      data: {
        enrollmentId: enrollment.id,
        generatedDate: addDays(enrollment.expectedGraduation || new Date(), randomInt(30, 90)),
        academicData: JSON.stringify({
          cumulativeGPA: gpa,
          totalCredits: totalCredits,
          courses: [],
          semesters: [],
          honors: gpa > 3.5 ? ['Dean\'s List'] : [],
        }),
        isOfficial: Math.random() < 0.7,
      },
    });
  }
  console.log(`   ✓ Transcripts generated (${graduatedEnrollments.length})`);

  // 7. Create Applications
  console.log('📋 Creating applications...');
  let appCount = 0;
  for (let i = 0; i < 300; i++) {
    const name = getRandomKenyanName(i % 3 === 0 ? 'female' : 'male');
    const program = randomElement(createdPrograms.filter(p => p.programType === 'BACHELORS'));
    const county = getRandomCounty();
    const appYear = randomInt(2020, 2024);
    const isGovernment = Math.random() < 0.6;
    
    let status: ApplicationStatus;
    const rand = Math.random();
    if (rand < 0.5) status = 'APPROVED';
    else if (rand < 0.65) status = 'SUBMITTED';
    else if (rand < 0.75) status = 'UNDER_REVIEW';
    else status = 'REJECTED';
    
    // Pick a student that hasn't applied yet
    const applicantStudent = students[i % students.length];
    
    const guardianName = randomElement(['John', 'Mary', 'Peter', 'Jane']) + ' ' + randomElement(['Kamau', 'Otieno', 'Wanjiku']);
    
    const application = await prisma.application.create({
      data: {
        applicationNumber: `APP${appYear}${(i + 1).toString().padStart(5, '0')}`,
        studentId: applicantStudent.id,
        programId: program.id,
        firstName: name.firstName,
        lastName: name.lastName,
        email: `${name.firstName.toLowerCase()}.${name.lastName.toLowerCase()}${i}@email.com`,
        phone: generateKenyanPhone(),
        dateOfBirth: randomDate(new Date(1998, 0, 1), new Date(2006, 11, 31)),
        gender: i % 3 === 0 ? 'Female' : 'Male',
        nationalId: Math.random() < 0.7 ? generateKenyanId() : null,
        county: county,
        subCounty: getRandomSubCounty(county),
        address: `P.O. Box ${randomInt(100, 9999)}, ${county}`,
        kcseIndex: `${randomInt(11200000, 11299999)}/${appYear - 1}`,
        kcseYear: appYear - 1,
        kcseGrade: randomElement(['A', 'A-', 'B+', 'B', 'B-', 'C+']),
        intake: `${randomElement(['September', 'January'])} ${appYear}`,
        kuccpsIndex: isGovernment ? generateKUCCPSIndex(appYear) : null,
        placementType: isGovernment ? 'GOVERNMENT' : 'PARALLEL',
        guardianName: guardianName,
        guardianPhone: generateKenyanPhone(),
        guardianRelationship: randomElement(['Father', 'Mother', 'Guardian', 'Uncle', 'Aunt']),
        emergencyContactName: guardianName,
        emergencyContactPhone: generateKenyanPhone(),
        emergencyContactRelation: randomElement(['Father', 'Mother', 'Sibling', 'Uncle', 'Aunt']),
        status: status,
        submittedAt: status !== 'SUBMITTED' ? randomDate(new Date(appYear, 0, 1), new Date(appYear, 5, 30)) : null,
      },
    });
    appCount++;
    
    // Create application documents
    const docTypes: DocumentType[] = ['KCSE_CERTIFICATE', 'BIRTH_CERTIFICATE', 'NATIONAL_ID', 'PASSPORT_PHOTO'];
    for (const docType of docTypes.slice(0, 3)) { // Create 3 documents per application
      await prisma.applicationDocument.create({
        data: {
          applicationId: application.id,
          documentType: docType,
          fileName: `${docType.toLowerCase()}_doc_${i}.pdf`,
          fileUrl: `/uploads/applications/${application.id}/${docType.toLowerCase()}.pdf`,
          fileSize: randomInt(100000, 5000000),
          mimeType: 'application/pdf',
          uploadedAt: application.submittedAt || new Date(),
        },
      });
    }
  }
  console.log(`   ✓ Applications created (${appCount})`);
  console.log(`   ✓ Application documents created (${appCount * 3})`);

  // 8. Create Student Documents and ID Cards
  console.log('🆔 Creating student documents and ID cards...');
  let docCount = 0;
  let idCardCount = 0;
  
  for (const student of students.filter(s => s.isActive)) {
    // Create 3-5 documents per student
    const numDocs = randomInt(3, 5);
    const docTypes: DocumentType[] = ['ACADEMIC', 'IDENTIFICATION', 'MEDICAL', 'FINANCIAL', 'OTHER'];
    
    for (let i = 0; i < numDocs; i++) {
      await prisma.studentDocument.create({
        data: {
          studentId: student.id,
          type: docTypes[i % docTypes.length],
          fileName: `document_${student.admissionNumber}_${i}.pdf`,
          filePath: `/uploads/students/${student.id}/doc${i}.pdf`,
          fileSize: randomInt(100000, 3000000),
          uploadedAt: randomDate(student.enrollmentDate, new Date()),
          isVerified: Math.random() < 0.8,
          verifiedAt: Math.random() < 0.8 ? randomDate(student.enrollmentDate, new Date()) : null,
        },
      });
      docCount++;
    }
    
    // Create ID card
    await prisma.studentIDCard.create({
      data: {
        studentId: student.id,
        cardNumber: `ID${new Date().getFullYear()}${student.admissionNumber.replace(/\//g, '')}`,
        issueDate: randomDate(student.enrollmentDate, new Date()),
        expiryDate: addMonths(new Date(), 12),
        barcode: `*${student.admissionNumber}*`,
        qrCode: student.admissionNumber,
      },
    });
    idCardCount++;
  }
  console.log(`   ✓ Student documents created (${docCount})`);
  console.log(`   ✓ ID cards created (${idCardCount})`);

  // 9. Create Medical and Disciplinary Records
  console.log('🏥 Creating medical and disciplinary records...');
  
  for (let i = 0; i < 300; i++) {
    const student = randomElement(students);
    await prisma.studentMedicalRecord.create({
      data: {
        studentId: student.id,
        recordDate: randomDate(student.enrollmentDate, new Date()),
        condition: randomElement(['Flu', 'Malaria', 'Headache', 'Injury', 'Dental', 'Eye checkup', 'Routine checkup']),
        treatment: randomElement(['Medication prescribed', 'Rest advised', 'Referral to hospital', 'First aid administered']),
        prescriptions: randomElement(['Paracetamol', 'Antibiotics', 'Pain relievers', 'None']),
        followUpDate: Math.random() < 0.3 ? addDays(new Date(), randomInt(7, 30)) : null,
        notes: 'Patient responded well to treatment',
      },
    });
  }
  console.log('   ✓ Medical records created (300)');

  for (let i = 0; i < 50; i++) {
    const student = randomElement(students);
    await prisma.disciplinaryRecord.create({
      data: {
        studentId: student.id,
        incidentDate: randomDate(student.enrollmentDate, new Date()),
        description: randomElement([
          'Late submission of assignment',
          'Absence without leave',
          'Misconduct in class',
          'Library book not returned',
          'Noise in hostel',
        ]),
        action: randomElement(['Warning issued', 'Community service', 'Written apology', 'Fine imposed']),
        resolvedAt: Math.random() < 0.8 ? addDays(new Date(), randomInt(1, 14)) : null,
        notes: 'Student acknowledged the offense',
      },
    });
  }
  console.log('   ✓ Disciplinary records created (50)');

  // 10. Create Fee Structures
  console.log('💰 Creating fee structures and assignments...');
  
  const feeStructures = [];
  const feeTypes = [
    { name: 'Tuition Fee - Government', amount: 16000, term: 'Semester' },
    { name: 'Tuition Fee - Parallel', amount: 45000, term: 'Semester' },
    { name: 'Accommodation Fee', amount: 8000, term: 'Semester' },
    { name: 'Medical Services Fee', amount: 3000, term: 'Annual' },
    { name: 'Student Union Fee', amount: 2000, term: 'Annual' },
    { name: 'Library Fee', amount: 1500, term: 'Annual' },
    { name: 'Activity Fee', amount: 2500, term: 'Annual' },
    { name: 'Examination Fee', amount: 4000, term: 'Semester' },
    { name: 'ID Card Fee', amount: 500, term: 'Once' },
    { name: 'Caution Money', amount: 5000, term: 'Once' },
  ];
  
  for (const feeType of feeTypes) {
    for (let year = 2020; year <= 2024; year++) {
      const fee = await prisma.feeStructure.create({
        data: {
          name: feeType.name,
          amount: feeType.amount,
          term: feeType.term,
          academicYear: year.toString(),
          isActive: year === 2024,
        },
      });
      feeStructures.push(fee);
    }
  }
  console.log(`   ✓ Fee structures created (${feeStructures.length})`);

  // 11. Assign Fees to Students
  let studentFeeCount = 0;
  for (const student of students) {
    const isGovernment = student.placementType === 'GOVERNMENT';
    const placementYear = student.placementYear || 2024;
    
    // Assign tuition fee
    const tuitionFee = feeStructures.find(f => 
      f.name === (isGovernment ? 'Tuition Fee - Government' : 'Tuition Fee - Parallel') &&
      parseInt(f.academicYear) === placementYear
    );
    
    if (tuitionFee) {
      const balance = parseFloat(tuitionFee.amount.toString()) * (Math.random() * 0.3); // 0-30% unpaid
      const paidAmount = parseFloat(tuitionFee.amount.toString()) - balance;
      
      await prisma.studentFee.create({
        data: {
          studentId: student.id,
          feeStructureId: tuitionFee.id,
          amount: tuitionFee.amount,
          dueDate: new Date(placementYear, 9, 30),
          isPaid: balance === 0,
          paidAmount: paidAmount,
          balance: balance,
        },
      });
      studentFeeCount++;
    }
    
    // Assign other fees randomly
    const otherFees = feeStructures.filter(f => 
      !f.name.includes('Tuition') &&
      parseInt(f.academicYear) === placementYear
    );
    
    const numOtherFees = randomInt(2, 5);
    for (let i = 0; i < numOtherFees && i < otherFees.length; i++) {
      const fee = otherFees[i];
      const isPaid = Math.random() < 0.7;
      const balance = isPaid ? 0 : parseFloat(fee.amount.toString());
      
      await prisma.studentFee.create({
        data: {
          studentId: student.id,
          feeStructureId: fee.id,
          amount: fee.amount,
          dueDate: randomDate(new Date(placementYear, 8, 1), new Date(placementYear, 11, 31)),
          isPaid: isPaid,
          paidAmount: isPaid ? fee.amount : 0,
          balance: balance,
        },
      });
      studentFeeCount++;
    }
  }
  console.log(`   ✓ Student fees assigned (${studentFeeCount})`);

  // 12. Create Payments with M-PESA transactions
  console.log('💳 Creating payments and M-PESA transactions...');
  
  let paymentCount = 0;
  let mpesaCount = 0;
  
  for (let i = 0; i < 2000; i++) {
    const student = randomElement(students);
    const paymentMode: PaymentMode = randomElement(['MPESA', 'MPESA', 'MPESA', 'MPESA', 'MPESA', 'MPESA', 'MPESA', 'BANK', 'BANK', 'CASH']); // 70% MPESA
    const amount = randomInt(5000, 50000);
    
    const payment = await prisma.payment.create({
      data: {
        studentId: student.id,
        amount: amount,
        paymentMode: paymentMode,
        reference: paymentMode === 'MPESA' ? generateMpesaRef() : `REF${Date.now()}${i}`,
        status: 'COMPLETED',
        receiptNumber: `REC${new Date().getFullYear()}${(i + 1).toString().padStart(6, '0')}`,
        paidBy: `${student.firstName} ${student.lastName}`,
        notes: paymentMode === 'MPESA' ? 'M-PESA payment' : `${paymentMode} payment`,
      },
    });
    paymentCount++;
    
    // Create M-PESA transaction for M-PESA payments
    if (paymentMode === 'MPESA') {
      await prisma.mpesaTransaction.create({
        data: {
          paymentId: payment.id,
          merchantRequestId: generateMerchantRequestId(),
          checkoutRequestId: generateCheckoutRequestId(),
          phoneNumber: student.phone || generateKenyanPhone(),
          amount: amount,
          mpesaReceiptNumber: generateMpesaRef(),
          transactionDate: payment.createdAt,
          resultCode: 0,
          resultDesc: 'The service request is processed successfully',
        },
      });
      mpesaCount++;
    }
  }
  console.log(`   ✓ Payments created (${paymentCount})`);
  console.log(`   ✓ M-PESA transactions created (${mpesaCount})`);

  // 13. Create Classes for Secondary School Integration
  console.log('🏫 Creating classes...');
  
  const classes = [];
  const forms = ['Form 1', 'Form 2', 'Form 3', 'Form 4'];
  const streams = ['A', 'B', 'C', 'D'];
  
  for (const form of forms) {
    for (const stream of streams) {
      const teacher = randomElement(staffRecords.slice(16)); // Get lecturers only
      const classObj = await prisma.class.create({
        data: {
          name: `${form} ${stream}`,
          level: form,
          stream: stream,
          capacity: 45,
          classTeacherId: teacher.id,
        },
      });
      classes.push(classObj);
    }
  }
  console.log(`   ✓ Classes created (${classes.length})`);

  // 14. Create Timetables
  console.log('📅 Creating timetables...');
  
  const days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'];
  const subjectNames = secondarySubjects.map(s => s.name);
  let timetableCount = 0;
  
  for (const classObj of classes) {
    for (const day of days) {
      for (let period = 1; period <= 8; period++) {
        const subject = randomElement(subjectNames);
        const teacher = randomElement(staffRecords.slice(16));
        
        await prisma.timetable.create({
          data: {
            classId: classObj.id,
            subject: subject,
            teacherId: teacher.id,
            day: day,
            period: period,
            startTime: `${7 + period}:00`,
            endTime: `${8 + period}:00`,
            room: `Room ${randomInt(1, 30)}`,
            academicYear: '2024',
            term: 'Term 1',
          },
        });
        timetableCount++;
      }
    }
  }
  console.log(`   ✓ Timetable entries created (${timetableCount})`);

  // 15. Create Attendance Records
  console.log('📋 Creating attendance records...');
  
  let attendanceCount = 0;
  const secondaryStudents = students.slice(0, 200); // Use first 200 as secondary students
  
  // Assign students to classes
  for (let i = 0; i < secondaryStudents.length; i++) {
    const student = secondaryStudents[i];
    const classObj = classes[i % classes.length];
    
    await prisma.student.update({
      where: { id: student.id },
      data: { classId: classObj.id },
    });
  }
  
  // Create attendance for the last 30 days
  for (let dayOffset = 0; dayOffset < 30; dayOffset++) {
    const attendanceDate = addDays(new Date(), -dayOffset);
    
    // Skip weekends
    if (attendanceDate.getDay() === 0 || attendanceDate.getDay() === 6) continue;
    
    for (const student of secondaryStudents) {
      if (!student.classId) continue;
      
      // 92% present rate
      let status: AttendanceStatus;
      const rand = Math.random();
      if (rand < 0.92) status = 'PRESENT';
      else if (rand < 0.95) status = 'LATE';
      else if (rand < 0.98) status = 'EXCUSED';
      else status = 'ABSENT';
      
      await prisma.attendance.create({
        data: {
          studentId: student.id,
          classId: student.classId,
          date: attendanceDate,
          status: status,
          remarks: status === 'ABSENT' ? 'No reason provided' : null,
        },
      });
      attendanceCount++;
    }
  }
  console.log(`   ✓ Attendance records created (${attendanceCount})`);

  // 16. Create Exams and Results
  console.log('📝 Creating exams and results...');
  
  const exams = [];
  for (const classObj of classes) {
    for (const subject of subjectNames.slice(0, 8)) {
      const exam = await prisma.exam.create({
        data: {
          name: `${subject} ${randomElement(['CAT 1', 'CAT 2', 'Mid-Term', 'End Term'])}`,
          subject: subject,
          classId: classObj.id,
          examType: randomElement(['MID_TERM', 'END_TERM', 'CONTINUOUS_ASSESSMENT'] as ExamType[]),
          maxMarks: 100,
          date: randomDate(getDateYearsAgo(1), new Date()),
          createdById: randomElement(staffRecords.slice(16)).id,
          academicYear: '2024',
          term: 'Term 1',
        },
      });
      exams.push(exam);
    }
  }
  console.log(`   ✓ Exams created (${exams.length})`);

  // Create exam marks
  let markCount = 0;
  for (const exam of exams) {
    const classStudents = secondaryStudents.filter(s => s.classId === exam.classId);
    
    for (const student of classStudents.slice(0, 40)) {
      const score = randomInt(30, 95);
      const grade = score >= 80 ? 'A' : score >= 70 ? 'B' : score >= 60 ? 'C' : score >= 50 ? 'D' : 'E';
      
      await prisma.mark.create({
        data: {
          examId: exam.id,
          studentId: student.id,
          marks: score,
          grade: grade,
          remarks: score >= 40 ? 'Pass' : 'Fail',
        },
      });
      markCount++;
    }
  }
  console.log(`   ✓ Exam marks created (${markCount})`);
  
  const examCount = exams.length;

  // 17. Create Dormitories and Bed Assignments
  console.log('🏠 Creating dormitories and bed assignments...');
  
  const dormitories = [];
  const maleNames = ['Kilimanjaro Hall', 'Kenya Hall', 'Nyayo Hall', 'Mau Hall', 'Rift Valley Hall'];
  const femaleNames = ['Lillian Towers', 'Maasai Mara Hall', 'Lake Victoria Hall', 'Amboseli Hall', 'Nairobi Hall'];
  
  for (const name of maleNames) {
    const dorm = await prisma.dormitory.create({
      data: {
        name: name,
        capacity: 200,
        gender: 'Male',
        description: `Male hostel with modern facilities`,
      },
    });
    dormitories.push(dorm);
  }
  
  for (const name of femaleNames) {
    const dorm = await prisma.dormitory.create({
      data: {
        name: name,
        capacity: 180,
        gender: 'Female',
        description: `Female hostel with modern facilities`,
      },
    });
    dormitories.push(dorm);
  }
  console.log(`   ✓ Dormitories created (${dormitories.length})`);

  // Assign beds to students
  let bedAssignmentCount = 0;
  for (const student of students.filter(s => s.isActive).slice(0, 400)) {
    const suitableDorms = dormitories.filter(d => 
      d.gender === student.gender
    );
    
    if (suitableDorms.length === 0) continue;
    
    const dorm = randomElement(suitableDorms);
    
    await prisma.student.update({
      where: { id: student.id },
      data: { dormitoryId: dorm.id },
    });
    
    await prisma.bedAssignment.create({
      data: {
        studentId: student.id,
        dormitoryId: dorm.id,
        bedNumber: `${randomInt(1, 20)}${randomElement(['A', 'B', 'C', 'D'])}`,
        roomNumber: `${randomInt(100, 499)}`,
        assignedDate: student.enrollmentDate,
      },
    });
    bedAssignmentCount++;
  }
  console.log(`   ✓ Bed assignments created (${bedAssignmentCount})`);

  // 18. Create Transport Routes and Assignments
  console.log('🚌 Creating transport routes...');
  
  const transports = [];
  const routes = [
    { name: 'Nairobi CBD Route', areas: ['CBD', 'Westlands', 'Parklands'] },
    { name: 'Eastlands Route', areas: ['Donholm', 'Umoja', 'Kayole'] },
    { name: 'South B Route', areas: ['South B', 'South C', 'Langata'] },
    { name: 'Kiambu Route', areas: ['Kiambu', 'Ruiru', 'Thika'] },
    { name: 'Ngong Route', areas: ['Ngong', 'Rongai', 'Karen'] },
  ];
  
  for (let i = 0; i < routes.length; i++) {
    const route = routes[i];
    const name = getRandomKenyanName('male');
    
    const transport = await prisma.transport.create({
      data: {
        routeName: route.name,
        vehicleNumber: generateVehicleReg(),
        driverName: `${name.firstName} ${name.lastName}`,
        driverPhone: generateKenyanPhone(),
        capacity: randomInt(40, 60),
      },
    });
    transports.push(transport);
    
    // Create route stops
    for (const area of route.areas) {
      await prisma.transportRoute.create({
        data: {
          transportId: transport.id,
          stopName: area,
          pickupTime: `${randomInt(6, 8)}:${randomElement(['00', '15', '30', '45'])}`,
          dropoffTime: `${randomInt(16, 18)}:${randomElement(['00', '15', '30', '45'])}`,
          fare: randomInt(2000, 5000),
        },
      });
    }
  }
  console.log(`   ✓ Transport routes created (${transports.length})`);

  // Assign transport to students
  let transportAssignmentCount = 0;
  for (const student of students.filter(s => s.isActive).slice(0, 150)) {
    const transport = randomElement(transports);
    
    await prisma.student.update({
      where: { id: student.id },
      data: { transportId: transport.id },
    });
    
    const routes = await prisma.transportRoute.findMany({
      where: { transportId: transport.id },
    });
    const route = randomElement(routes);
    
    await prisma.transportAssignment.create({
      data: {
        studentId: student.id,
        transportId: transport.id,
        routeId: route.id,
        assignedDate: student.enrollmentDate,
        isActive: true,
      },
    });
    transportAssignmentCount++;
  }
  console.log(`   ✓ Transport assignments created (${transportAssignmentCount})`);

  // 19. Create Library Books and Borrow Records
  console.log('📚 Creating library books...');
  
  const books = [];
  const bookTitles = [
    'Introduction to Computer Science', 'Data Structures and Algorithms', 'Software Engineering',
    'Database Management Systems', 'Computer Networks', 'Operating Systems',
    'Artificial Intelligence', 'Machine Learning Basics', 'Web Development',
    'Mobile App Development', 'Cloud Computing', 'Cybersecurity Fundamentals',
    'Business Management', 'Financial Accounting', 'Marketing Principles',
    'Human Resource Management', 'Economics Theory', 'Statistics for Business',
    'Engineering Mathematics', 'Thermodynamics', 'Mechanics of Materials',
    'Electrical Circuits', 'Control Systems', 'Structural Analysis',
    'Human Anatomy', 'Physiology', 'Pathology', 'Pharmacology',
    'Constitutional Law', 'Criminal Law', 'Contract Law',
  ];
  
  for (let i = 0; i < bookTitles.length; i++) {
    // Create multiple copies of each book
    for (let copy = 1; copy <= randomInt(3, 8); copy++) {
      const book = await prisma.book.create({
        data: {
          title: bookTitles[i],
          author: randomElement(['John Doe', 'Jane Smith', 'Peter Jones', 'Mary Williams', 'James Brown']),
          isbn: `978-${randomInt(1, 9)}-${randomInt(1000, 9999)}-${randomInt(1000, 9999)}-${randomInt(1, 9)}`,
          publisher: randomElement(['Pearson', 'McGraw-Hill', 'Wiley', 'Oxford University Press', 'Cambridge Press']),
          publicationYear: randomInt(2015, 2024),
          category: randomElement(['Computing', 'Business', 'Engineering', 'Health Sciences', 'Law', 'General']),
          quantity: 1,
          availableQuantity: Math.random() < 0.7 ? 1 : 0,
          shelfLocation: `${randomElement(['A', 'B', 'C', 'D'])}-${randomInt(1, 50)}`,
        },
      });
      books.push(book);
    }
  }
  console.log(`   ✓ Library books created (${books.length})`);

  // Create borrow records
  let borrowCount = 0;
  for (let i = 0; i < 1000; i++) {
    const student = randomElement(students);
    const book = randomElement(books);
    const borrowDate = randomDate(getDateYearsAgo(2), new Date());
    const isReturned = Math.random() < 0.75;
    
    await prisma.bookBorrow.create({
      data: {
        studentId: student.id,
        bookId: book.id,
        borrowDate: borrowDate,
        dueDate: addDays(borrowDate, 14),
        returnDate: isReturned ? addDays(borrowDate, randomInt(1, 20)) : null,
        fine: isReturned ? 0 : randomInt(0, 500),
        status: isReturned ? 'RETURNED' : randomElement(['BORROWED', 'OVERDUE']),
      },
    });
    borrowCount++;
  }
  console.log(`   ✓ Book borrow records created (${borrowCount})`);

  console.log('\n✅ All phases complete!');
  console.log('Seeding complete! 🎉');
  const endTime = Date.now();
  const duration = ((endTime - startTime) / 1000).toFixed(2);
  
  console.log('\n📊 SEEDING SUMMARY:');
  console.log('===================');
  console.log(`Total Users: 671`);
  console.log(`Students: 500`);
  console.log(`Staff: 66`);
  console.log(`Parents: 100`);
  console.log(`Departments: ${departments.length}`);
  console.log(`Programs: ${createdPrograms.length}`);
  console.log(`Courses: ${createdCourses.length}`);
  console.log(`Course Offerings: ${courseOfferings.length}`);
  console.log(`Enrollments: ${enrollments.length}`);
  console.log(`Registrations: ${registrationCount}`);
  console.log(`Grades: ${gradeCount}`);
  console.log(`Applications: ${appCount}`);
  console.log(`Payments: ${paymentCount}`);
  console.log(`M-PESA Transactions: ${mpesaCount}`);
  console.log(`Classes: ${classes.length}`);
  console.log(`Timetables: ${timetableCount}`);
  console.log(`Attendance: ${attendanceCount}`);
  console.log(`Exams: ${examCount}`);
  console.log(`Exam Marks: ${markCount}`);
  console.log(`Dormitories: ${dormitories.length}`);
  console.log(`Bed Assignments: ${bedAssignmentCount}`);
  console.log(`Transport Routes: ${transports.length}`);
  console.log(`Library Books: ${books.length}`);
  console.log(`Book Borrows: ${borrowCount}`);
  console.log(`\n⏱️  Total time: ${duration}s`);
  console.log(`🎉 Database seeded successfully!`);
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

