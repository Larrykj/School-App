// Kenyan university course catalog

export const courses = [
  // Computing & IT Courses - BIT/BSCS
  { code: 'BIT 1101', name: 'Introduction to Programming', credits: 3, level: 100 },
  { code: 'BIT 1102', name: 'Computer Organization & Architecture', credits: 3, level: 100 },
  { code: 'BIT 1103', name: 'Mathematics for IT', credits: 3, level: 100 },
  { code: 'BIT 1104', name: 'Communication Skills', credits: 2, level: 100 },
  { code: 'BIT 1105', name: 'Digital Electronics', credits: 3, level: 100 },
  { code: 'BIT 1106', name: 'Web Development I', credits: 3, level: 100 },
  
  { code: 'BIT 2101', name: 'Object Oriented Programming', credits: 4, level: 200, prerequisites: ['BIT 1101'] },
  { code: 'BIT 2102', name: 'Data Structures & Algorithms', credits: 4, level: 200, prerequisites: ['BIT 1101'] },
  { code: 'BIT 2103', name: 'Database Systems', credits: 3, level: 200 },
  { code: 'BIT 2104', name: 'Operating Systems', credits: 3, level: 200, prerequisites: ['BIT 1102'] },
  { code: 'BIT 2105', name: 'Discrete Mathematics', credits: 3, level: 200, prerequisites: ['BIT 1103'] },
  { code: 'BIT 2106', name: 'Web Development II', credits: 3, level: 200, prerequisites: ['BIT 1106'] },
  { code: 'BIT 2107', name: 'Systems Analysis & Design', credits: 3, level: 200 },
  { code: 'BIT 2108', name: 'Computer Networks', credits: 3, level: 200 },
  
  { code: 'BIT 3101', name: 'Software Engineering', credits: 4, level: 300, prerequisites: ['BIT 2101', 'BIT 2107'] },
  { code: 'BIT 3102', name: 'Mobile Application Development', credits: 4, level: 300, prerequisites: ['BIT 2101'] },
  { code: 'BIT 3103', name: 'Artificial Intelligence', credits: 3, level: 300, prerequisites: ['BIT 2102'] },
  { code: 'BIT 3104', name: 'Computer Security', credits: 3, level: 300, prerequisites: ['BIT 2108'] },
  { code: 'BIT 3105', name: 'Cloud Computing', credits: 3, level: 300, prerequisites: ['BIT 2104'] },
  { code: 'BIT 3106', name: 'Information Systems Management', credits: 3, level: 300 },
  { code: 'BIT 3107', name: 'Distributed Systems', credits: 3, level: 300, prerequisites: ['BIT 2108'] },
  { code: 'BIT 3108', name: 'Research Methods', credits: 2, level: 300 },
  
  { code: 'BIT 4101', name: 'Project Management', credits: 3, level: 400 },
  { code: 'BIT 4102', name: 'IT Entrepreneurship', credits: 3, level: 400 },
  { code: 'BIT 4103', name: 'Machine Learning', credits: 4, level: 400, prerequisites: ['BIT 3103'] },
  { code: 'BIT 4104', name: 'Blockchain Technology', credits: 3, level: 400 },
  { code: 'BIT 4105', name: 'DevOps & CI/CD', credits: 3, level: 400 },
  { code: 'BIT 4199', name: 'Final Year Project', credits: 6, level: 400, prerequisites: ['BIT 3108'] },
  
  // Business Courses - BCOM/BBA
  { code: 'BCOM 1101', name: 'Principles of Management', credits: 3, level: 100 },
  { code: 'BCOM 1102', name: 'Financial Accounting I', credits: 3, level: 100 },
  { code: 'BCOM 1103', name: 'Microeconomics', credits: 3, level: 100 },
  { code: 'BCOM 1104', name: 'Business Mathematics', credits: 3, level: 100 },
  { code: 'BCOM 1105', name: 'Business Communication', credits: 2, level: 100 },
  { code: 'BCOM 1106', name: 'Introduction to Business', credits: 3, level: 100 },
  
  { code: 'BCOM 2101', name: 'Macroeconomics', credits: 3, level: 200, prerequisites: ['BCOM 1103'] },
  { code: 'BCOM 2102', name: 'Financial Accounting II', credits: 3, level: 200, prerequisites: ['BCOM 1102'] },
  { code: 'BCOM 2103', name: 'Cost Accounting', credits: 3, level: 200, prerequisites: ['BCOM 1102'] },
  { code: 'BCOM 2104', name: 'Marketing Management', credits: 3, level: 200 },
  { code: 'BCOM 2105', name: 'Human Resource Management', credits: 3, level: 200 },
  { code: 'BCOM 2106', name: 'Business Statistics', credits: 3, level: 200, prerequisites: ['BCOM 1104'] },
  { code: 'BCOM 2107', name: 'Business Law', credits: 3, level: 200 },
  { code: 'BCOM 2108', name: 'Financial Management I', credits: 3, level: 200, prerequisites: ['BCOM 1102'] },
  
  { code: 'BCOM 3101', name: 'Strategic Management', credits: 4, level: 300, prerequisites: ['BCOM 1101'] },
  { code: 'BCOM 3102', name: 'Management Accounting', credits: 3, level: 300, prerequisites: ['BCOM 2103'] },
  { code: 'BCOM 3103', name: 'Financial Management II', credits: 3, level: 300, prerequisites: ['BCOM 2108'] },
  { code: 'BCOM 3104', name: 'Organizational Behaviour', credits: 3, level: 300 },
  { code: 'BCOM 3105', name: 'International Business', credits: 3, level: 300 },
  { code: 'BCOM 3106', name: 'Corporate Finance', credits: 3, level: 300, prerequisites: ['BCOM 2108'] },
  { code: 'BCOM 3107', name: 'Taxation', credits: 3, level: 300, prerequisites: ['BCOM 2102'] },
  { code: 'BCOM 3108', name: 'Research Methods in Business', credits: 2, level: 300 },
  
  { code: 'BCOM 4101', name: 'Business Ethics', credits: 3, level: 400 },
  { code: 'BCOM 4102', name: 'Auditing', credits: 3, level: 400, prerequisites: ['BCOM 2102'] },
  { code: 'BCOM 4103', name: 'Investment Analysis', credits: 3, level: 400, prerequisites: ['BCOM 3103'] },
  { code: 'BCOM 4104', name: 'Entrepreneurship', credits: 3, level: 400 },
  { code: 'BCOM 4105', name: 'E-Commerce', credits: 3, level: 400 },
  { code: 'BCOM 4199', name: 'Business Research Project', credits: 6, level: 400, prerequisites: ['BCOM 3108'] },
  
  // Engineering Courses - BCE/BEE/BME
  { code: 'ENG 1101', name: 'Engineering Mathematics I', credits: 4, level: 100 },
  { code: 'ENG 1102', name: 'Engineering Drawing', credits: 3, level: 100 },
  { code: 'ENG 1103', name: 'Engineering Physics', credits: 3, level: 100 },
  { code: 'ENG 1104', name: 'Engineering Chemistry', credits: 3, level: 100 },
  { code: 'ENG 1105', name: 'Workshop Technology', credits: 3, level: 100 },
  
  { code: 'ENG 2101', name: 'Engineering Mathematics II', credits: 4, level: 200, prerequisites: ['ENG 1101'] },
  { code: 'ENG 2102', name: 'Mechanics of Materials', credits: 3, level: 200, prerequisites: ['ENG 1103'] },
  { code: 'ENG 2103', name: 'Thermodynamics', credits: 3, level: 200, prerequisites: ['ENG 1103'] },
  { code: 'ENG 2104', name: 'Fluid Mechanics', credits: 3, level: 200, prerequisites: ['ENG 1103'] },
  { code: 'ENG 2105', name: 'Electrical Circuits', credits: 3, level: 200 },
  { code: 'ENG 2106', name: 'Engineering Materials', credits: 3, level: 200, prerequisites: ['ENG 1104'] },
  
  { code: 'ENG 3101', name: 'Control Systems', credits: 3, level: 300, prerequisites: ['ENG 2101'] },
  { code: 'ENG 3102', name: 'Machine Design', credits: 3, level: 300, prerequisites: ['ENG 2102'] },
  { code: 'ENG 3103', name: 'Power Systems', credits: 3, level: 300, prerequisites: ['ENG 2105'] },
  { code: 'ENG 3104', name: 'Structural Analysis', credits: 3, level: 300, prerequisites: ['ENG 2102'] },
  { code: 'ENG 3105', name: 'Engineering Management', credits: 3, level: 300 },
  
  { code: 'ENG 4101', name: 'Industrial Attachment', credits: 6, level: 400 },
  { code: 'ENG 4102', name: 'Engineering Design Project', credits: 6, level: 400 },
  { code: 'ENG 4103', name: 'Professional Ethics', credits: 2, level: 400 },
  
  // Health Sciences - MBCHB/BSN
  { code: 'MED 1101', name: 'Human Anatomy I', credits: 4, level: 100 },
  { code: 'MED 1102', name: 'Human Physiology I', credits: 4, level: 100 },
  { code: 'MED 1103', name: 'Biochemistry', credits: 3, level: 100 },
  { code: 'MED 1104', name: 'Medical Psychology', credits: 2, level: 100 },
  
  { code: 'MED 2101', name: 'Pathology', credits: 4, level: 200, prerequisites: ['MED 1101', 'MED 1102'] },
  { code: 'MED 2102', name: 'Pharmacology', credits: 4, level: 200, prerequisites: ['MED 1103'] },
  { code: 'MED 2103', name: 'Microbiology', credits: 3, level: 200 },
  { code: 'MED 2104', name: 'Community Health', credits: 3, level: 200 },
  
  { code: 'MED 3101', name: 'Internal Medicine', credits: 5, level: 300, prerequisites: ['MED 2101', 'MED 2102'] },
  { code: 'MED 3102', name: 'Surgery', credits: 5, level: 300, prerequisites: ['MED 2101'] },
  { code: 'MED 3103', name: 'Pediatrics', credits: 4, level: 300, prerequisites: ['MED 2101'] },
  { code: 'MED 3104', name: 'Obstetrics & Gynecology', credits: 4, level: 300, prerequisites: ['MED 2101'] },
  
  { code: 'MED 4101', name: 'Clinical Rotations', credits: 10, level: 400 },
  { code: 'MED 4102', name: 'Research & Evidence Based Medicine', credits: 4, level: 400 },
  
  // Law - LLB
  { code: 'LAW 1101', name: 'Introduction to Law', credits: 3, level: 100 },
  { code: 'LAW 1102', name: 'Legal Methods', credits: 3, level: 100 },
  { code: 'LAW 1103', name: 'Constitutional Law I', credits: 3, level: 100 },
  { code: 'LAW 1104', name: 'Law of Contract I', credits: 3, level: 100 },
  
  { code: 'LAW 2101', name: 'Criminal Law', credits: 3, level: 200, prerequisites: ['LAW 1101'] },
  { code: 'LAW 2102', name: 'Law of Torts', credits: 3, level: 200 },
  { code: 'LAW 2103', name: 'Constitutional Law II', credits: 3, level: 200, prerequisites: ['LAW 1103'] },
  { code: 'LAW 2104', name: 'Law of Contract II', credits: 3, level: 200, prerequisites: ['LAW 1104'] },
  { code: 'LAW 2105', name: 'Land Law', credits: 3, level: 200 },
  
  { code: 'LAW 3101', name: 'Commercial Law', credits: 3, level: 300, prerequisites: ['LAW 2104'] },
  { code: 'LAW 3102', name: 'Company Law', credits: 3, level: 300, prerequisites: ['LAW 2104'] },
  { code: 'LAW 3103', name: 'Family Law', credits: 3, level: 300 },
  { code: 'LAW 3104', name: 'Administrative Law', credits: 3, level: 300, prerequisites: ['LAW 2103'] },
  { code: 'LAW 3105', name: 'Law of Evidence', credits: 3, level: 300, prerequisites: ['LAW 2101'] },
  
  { code: 'LAW 4101', name: 'Jurisprudence', credits: 3, level: 400 },
  { code: 'LAW 4102', name: 'Legal Practice & Procedure', credits: 3, level: 400 },
  { code: 'LAW 4103', name: 'International Law', credits: 3, level: 400 },
  { code: 'LAW 4199', name: 'Law Research Project', credits: 6, level: 400 },
  
  // Common University Courses
  { code: 'UNI 1001', name: 'Academic Writing', credits: 2, level: 100 },
  { code: 'UNI 1002', name: 'Life Skills', credits: 2, level: 100 },
  { code: 'UNI 1003', name: 'HIV/AIDS Education', credits: 1, level: 100 },
  { code: 'UNI 2001', name: 'Entrepreneurship Skills', credits: 2, level: 200 },
  { code: 'UNI 3001', name: 'Research Methods', credits: 3, level: 300 },
  { code: 'UNI 4001', name: 'Career Development', credits: 2, level: 400 },
];

// Secondary School Subjects
export const secondarySubjects = [
  { name: 'Mathematics', code: 'MATH' },
  { name: 'English', code: 'ENG' },
  { name: 'Kiswahili', code: 'KIS' },
  { name: 'Biology', code: 'BIO' },
  { name: 'Chemistry', code: 'CHEM' },
  { name: 'Physics', code: 'PHY' },
  { name: 'History & Government', code: 'HIST' },
  { name: 'Geography', code: 'GEO' },
  { name: 'Christian Religious Education', code: 'CRE' },
  { name: 'Islamic Religious Education', code: 'IRE' },
  { name: 'Agriculture', code: 'AGR' },
  { name: 'Business Studies', code: 'BUS' },
  { name: 'Computer Studies', code: 'COMP' },
  { name: 'Home Science', code: 'HOME' },
  { name: 'French', code: 'FRE' },
  { name: 'German', code: 'GER' },
  { name: 'Music', code: 'MUS' },
  { name: 'Art & Design', code: 'ART' },
];

