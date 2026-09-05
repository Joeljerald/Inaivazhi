import User from '../models/User.js';
import Student from '../models/Student.js';
import Trainer from '../models/Trainer.js';
import PlacementOfficer from '../models/PlacementOfficer.js';
import Company from '../models/Company.js';
import Skill from '../models/Skill.js';
import StudentSkill from '../models/StudentSkill.js';
import Evaluation from '../models/Evaluation.js';
import Feedback from '../models/Feedback.js';
import SkillProgressHistory from '../models/SkillProgressHistory.js';
import Job from '../models/Job.js';
import Application from '../models/Application.js';
import CompanyStudentAssociation from '../models/CompanyStudentAssociation.js';
import InterviewRound from '../models/InterviewRound.js';
import StatusHistory from '../models/StatusHistory.js';
import { ROLES } from '../config/constants.js';
import { calculateSkillGap } from '../services/skillGapEngine.js';

export const runSeed = async () => {
  const existingUsersCount = await User.countDocuments();
  if (existingUsersCount >= 50) {
    console.log(`[Seed Check] Database already contains ${existingUsersCount} user records.`);
    return;
  }

  console.log('[Seed] Seeding fresh database instance with 60 candidates & 5 trainer tracks...');

  await Promise.all([
    User.deleteMany({}),
    Student.deleteMany({}),
    Trainer.deleteMany({}),
    PlacementOfficer.deleteMany({}),
    Company.deleteMany({}),
    Skill.deleteMany({}),
    StudentSkill.deleteMany({}),
    Evaluation.deleteMany({}),
    Feedback.deleteMany({}),
    SkillProgressHistory.deleteMany({}),
    Job.deleteMany({}),
    Application.deleteMany({}),
    CompanyStudentAssociation.deleteMany({}),
    InterviewRound.deleteMany({}),
    StatusHistory.deleteMany({}),
  ]);

  // Comprehensive Skills Catalog (25+ skills)
  const skillDefs = [
    { name: 'HTML', category: 'Frontend', description: 'HTML5 Semantic markup, web accessibility' },
    { name: 'CSS', category: 'Frontend', description: 'Modern CSS3 layouts, Flexbox, Grid' },
    { name: 'JavaScript', category: 'Frontend', description: 'ES6+ async syntax, DOM manipulation, closures' },
    { name: 'React', category: 'Frontend', description: 'React hooks, state management, router' },
    { name: 'Angular', category: 'Frontend', description: 'TypeScript framework for enterprise SPA' },
    { name: 'Vue', category: 'Frontend', description: 'Progressive JavaScript framework' },
    { name: 'TypeScript', category: 'Frontend', description: 'Typed JavaScript for scalable apps' },
    { name: 'Node.js', category: 'Backend', description: 'Event-driven JavaScript server runtime' },
    { name: 'Express.js', category: 'Backend', description: 'REST API framework for Node.js' },
    { name: 'Java', category: 'Programming', description: 'Core Java, OOP principles, collections' },
    { name: 'Spring Boot', category: 'Backend', description: 'Enterprise Java microservices' },
    { name: 'Spring MVC', category: 'Backend', description: 'Java MVC web framework' },
    { name: 'Hibernate', category: 'Backend', description: 'Java ORM framework' },
    { name: 'JPA', category: 'Backend', description: 'Java Persistence API' },
    { name: 'Python', category: 'Programming', description: 'Python scripting & automation' },
    { name: 'Django', category: 'Backend', description: 'High-level Python web framework' },
    { name: 'Flask', category: 'Backend', description: 'Micro web framework for Python' },
    { name: 'FastAPI', category: 'Backend', description: 'Modern fast Python API framework' },
    { name: 'MongoDB', category: 'Database', description: 'NoSQL document database' },
    { name: 'MySQL', category: 'Database', description: 'Relational SQL database design' },
    { name: 'PostgreSQL', category: 'Database', description: 'Advanced relational database' },
    { name: 'SQL', category: 'Database', description: 'Standard Structured Query Language' },
    { name: 'AWS', category: 'Cloud', description: 'Amazon Web Services cloud infrastructure' },
    { name: 'Docker', category: 'DevOps', description: 'Containerization & Dockerfiles' },
    { name: 'Git', category: 'Tools', description: 'Distributed version control & GitHub' },
    { name: 'REST API', category: 'Backend', description: 'RESTful API protocols & JSON' },
    { name: 'NumPy', category: 'Testing', description: 'Numerical computing with Python' },
    { name: 'Pandas', category: 'Testing', description: 'Data manipulation and analysis' },
    { name: 'Matplotlib', category: 'Tools', description: 'Data visualization in Python' },
    { name: 'Machine Learning', category: 'Other', description: 'Predictive modeling and algorithms' },
    { name: 'Excel', category: 'Tools', description: 'Advanced spreadsheet data analytics' },
    { name: 'Power BI', category: 'Tools', description: 'Business intelligence dashboarding' },
    { name: 'Tableau', category: 'Tools', description: 'Enterprise visual analytics' },
  ];

  const insertedSkills = await Skill.insertMany(skillDefs);
  const skillMap = {};
  insertedSkills.forEach((s) => {
    skillMap[s.name] = s._id;
  });

  const defaultPassword = await User.hashPassword('Password@123');
  const arunPassword = await User.hashPassword('Arun@123');
  const trainerPassword = await User.hashPassword('Trainer@123');
  const placementPassword = await User.hashPassword('Placement@123');
  const adminPassword = await User.hashPassword('Admin@123');

  // Super Admin
  await User.create({
    name: 'SkillBridge Admin',
    email: 'admin@skillbridge.com',
    passwordHash: adminPassword,
    role: ROLES.SUPER_ADMIN,
    phone: '+91 98765 00001',
  });
  await User.create({
    name: 'Dr. Rajesh Verma (Admin)',
    email: 'admin@skillbridge.edu',
    passwordHash: defaultPassword,
    role: ROLES.SUPER_ADMIN,
    phone: '+91 98765 00001',
  });

  // Placement Officers
  const p1User = await User.create({
    name: 'Placement Officer',
    email: 'placement@skillbridge.com',
    passwordHash: placementPassword,
    role: ROLES.PLACEMENT,
    phone: '+91 98765 00002',
  });
  await PlacementOfficer.create({ userId: p1User._id, department: 'Corporate Placement Cell' });

  const p2User = await User.create({
    name: 'Priya Sharma (Placement)',
    email: 'placement@skillbridge.edu',
    passwordHash: defaultPassword,
    role: ROLES.PLACEMENT,
    phone: '+91 98765 00002',
  });
  await PlacementOfficer.create({ userId: p2User._id, department: 'Corporate Placement Cell' });

  // 5 Trainer Specialization Tracks (Part 19 & Section 12 Requirement)
  const trainerDefs = [
    { name: 'Rajesh Kumar', email: 'trainer.mern@skillbridge.com', altEmail: 'trainer@skillbridge.edu', track: 'MERN STACK', dept: 'Web Engineering', spec: 'MERN Stack' },
    { name: 'Priya Sharma', email: 'trainer.java@skillbridge.com', altEmail: 'java.trainer@skillbridge.edu', track: 'JAVA FULL STACK', dept: 'Enterprise Software', spec: 'Java Full Stack' },
    { name: 'Anitha Krishnan', email: 'trainer.python@skillbridge.com', altEmail: 'python.trainer@skillbridge.edu', track: 'PYTHON STACK', dept: 'Backend & Cloud', spec: 'Python Stack' },
    { name: 'Vikram Singh', email: 'trainer.datascience@skillbridge.com', altEmail: 'ds.trainer@skillbridge.edu', track: 'DATA SCIENCE', dept: 'AI & Data Science', spec: 'Data Science' },
    { name: 'Meena Ravi', email: 'trainer.dataanalyst@skillbridge.com', altEmail: 'da.trainer@skillbridge.edu', track: 'DATA ANALYST', dept: 'Business Analytics', spec: 'Data Analyst' },
  ];

  const trainersList = [];
  for (const tDef of trainerDefs) {
    const uDoc = await User.create({
      name: tDef.name,
      email: tDef.email,
      passwordHash: trainerPassword,
      role: ROLES.TRAINER,
      phone: '+91 98765 00010',
    });
    // Create alt email user for edu backward compatibility
    await User.create({
      name: tDef.name,
      email: tDef.altEmail,
      passwordHash: defaultPassword,
      role: ROLES.TRAINER,
      phone: '+91 98765 00010',
    });

    const tDoc = await Trainer.create({
      userId: uDoc._id,
      department: tDef.dept,
      specialization: `${tDef.track} — ${tDef.spec}`,
    });
    trainersList.push({ ...tDef, doc: tDoc });
  }

  console.log('[Seed] Seeding 60 Candidates across 5 Trainer Specialization Tracks...');

  const firstNames = ['Arun', 'Rahul', 'Priya', 'Karthik', 'Sneha', 'Vijay', 'Meera', 'Aditya', 'Divya', 'Siddharth', 'Pooja', 'Gautam', 'Nisha', 'Harish', 'Tanvi', 'Anand', 'Bhavna', 'Chetan', 'Deepika', 'Eshwar', 'Farhan', 'Gayatri', 'Hemant', 'Ishita', 'Jay', 'Kavya', 'Lokesh', 'Manish', 'Neha', 'Omkar'];
  const lastNames = ['Kumar', 'Sundaram', 'Gupta', 'Patel', 'Iyer', 'Chawla', 'Nair', 'Rao', 'Bhatt', 'Sharma', 'Agarwal', 'Reddy', 'Joshi', 'Mehta', 'Desai', 'Verma', 'Sethi', 'Roy', 'Kapoor', 'Menon'];

  let candidateCount = 0;
  let arunStudentDoc = null;

  for (let trackIdx = 0; trackIdx < trainersList.length; trackIdx++) {
    const trainerObj = trainersList[trackIdx];

    // Seed 12 candidates per track = 60 total candidates
    for (let c = 0; c < 12; c++) {
      candidateCount++;
      const isDemoPrimary = trackIdx === 0 && c === 0; // First candidate in track 1 is Primary Demo candidate "Arun"

      const fName = isDemoPrimary ? 'Arun' : firstNames[(candidateCount - 1) % firstNames.length];
      const lName = isDemoPrimary ? 'Kumar' : lastNames[(candidateCount - 1) % lastNames.length];
      const fullName = `${fName} ${lName}`.trim();
      const email = isDemoPrimary ? 'arun@skillbridge.com' : `student${candidateCount}@skillbridge.edu`;
      const passToUse = isDemoPrimary ? arunPassword : defaultPassword;

      const uDoc = await User.create({
        name: fullName,
        email,
        passwordHash: passToUse,
        role: ROLES.STUDENT,
        phone: `+91 98765 ${10000 + candidateCount}`,
      });

      if (isDemoPrimary) {
        await User.create({
          name: fullName,
          email: 'student@skillbridge.edu',
          passwordHash: defaultPassword,
          role: ROLES.STUDENT,
          phone: `+91 98765 ${10000 + candidateCount}`,
        });
      }

      const sDoc = await Student.create({
        userId: uDoc._id,
        course: `${trainerObj.track} Engineering`,
        department: trainerObj.dept,
        education: 'B.Tech Computer Science',
        batch: candidateCount % 2 === 0 ? '2022-2026' : '2021-2025',
        location: 'Bangalore, India',
        targetRole: `${trainerObj.track} Developer`,
        assignedTrainerId: trainerObj.doc._id,
        overallRating: 3.5 + ((candidateCount % 4) * 0.4),
        projects: [
          {
            title: `Enterprise ${trainerObj.track} Management Portal`,
            description: `Full-stack production platform built during ${trainerObj.track} bootcamp.`,
            techStack: ['React', 'Node.js', 'MongoDB', 'REST API'],
            githubUrl: 'https://github.com/student/project',
          },
        ],
        certifications: [
          { title: `${trainerObj.track} Certified Professional`, issuer: 'SkillBridge AI Academy', issueDate: new Date() },
        ],
      });

      if (isDemoPrimary) arunStudentDoc = sDoc;

      // Track-specific skill profile mapping
      let trackSkills = [];
      if (trainerObj.track === 'MERN STACK') {
        trackSkills = [
          { name: 'HTML', tRating: 5, sSelf: 5 },
          { name: 'CSS', tRating: 4, sSelf: 5 },
          { name: 'JavaScript', tRating: 4, sSelf: 4 },
          { name: 'React', tRating: isDemoPrimary ? 2 : 4, sSelf: 4 }, // Student says 4, Trainer says 2 for Arun (Part 11 visual diff)
          { name: 'Node.js', tRating: 3, sSelf: 4 },
          { name: 'MongoDB', tRating: 4, sSelf: 4 },
          { name: 'Java', tRating: 4, sSelf: 4 },
          { name: 'MySQL', tRating: 4, sSelf: 4 },
          { name: 'Python', tRating: 3, sSelf: 3 },
          { name: 'AWS', tRating: 1, sSelf: 2 },
        ];
      } else if (trainerObj.track === 'JAVA FULL STACK') {
        trackSkills = [
          { name: 'Java', tRating: 4, sSelf: 5 },
          { name: 'Spring Boot', tRating: 4, sSelf: 4 },
          { name: 'Spring MVC', tRating: 3, sSelf: 3 },
          { name: 'MySQL', tRating: 4, sSelf: 4 },
          { name: 'REST API', tRating: 5, sSelf: 5 },
          { name: 'React', tRating: 3, sSelf: 4 },
        ];
      } else if (trainerObj.track === 'PYTHON STACK') {
        trackSkills = [
          { name: 'Python', tRating: 5, sSelf: 5 },
          { name: 'Django', tRating: 4, sSelf: 4 },
          { name: 'FastAPI', tRating: 3, sSelf: 4 },
          { name: 'PostgreSQL', tRating: 4, sSelf: 4 },
          { name: 'HTML', tRating: 4, sSelf: 4 },
        ];
      } else if (trainerObj.track === 'DATA SCIENCE') {
        trackSkills = [
          { name: 'Python', tRating: 5, sSelf: 5 },
          { name: 'NumPy', tRating: 4, sSelf: 5 },
          { name: 'Pandas', tRating: 4, sSelf: 4 },
          { name: 'Machine Learning', tRating: 3, sSelf: 4 },
          { name: 'SQL', tRating: 4, sSelf: 4 },
        ];
      } else {
        trackSkills = [
          { name: 'Excel', tRating: 5, sSelf: 5 },
          { name: 'SQL', tRating: 4, sSelf: 5 },
          { name: 'Power BI', tRating: 4, sSelf: 4 },
          { name: 'Tableau', tRating: 3, sSelf: 4 },
          { name: 'Pandas', tRating: 3, sSelf: 3 },
        ];
      }

      for (const sk of trackSkills) {
        const skillId = skillMap[sk.name];
        if (skillId) {
          await StudentSkill.create({
            studentId: sDoc._id,
            skillId,
            proficiencyLevel: sk.tRating,
            selfProficiencyLevel: sk.sSelf,
            lastEvaluatedDate: new Date(),
          });

          await Evaluation.create({
            studentId: sDoc._id,
            trainerId: trainerObj.doc._id,
            skillId,
            rating: sk.tRating,
            feedback: `Demonstrates good understanding of ${sk.name}. Continue practicing production patterns.`,
            strength: `Clean implementation of ${sk.name} architecture.`,
            improvementArea: `Focus on performance optimizations in ${sk.name}.`,
            evaluatedAt: new Date(),
          });

          await SkillProgressHistory.create({
            studentId: sDoc._id,
            skillId,
            previousRating: Math.max(sk.tRating - 1, 1),
            newRating: sk.tRating,
            trainerId: trainerObj.doc._id,
            notes: `Upgraded proficiency level from ${Math.max(sk.tRating - 1, 1)} to ${sk.tRating}`,
            evaluatedAt: new Date(),
          });
        }
      }

      await Feedback.create({
        studentId: sDoc._id,
        trainerId: trainerObj.doc._id,
        generalFeedback: `Solid performer in the ${trainerObj.track} track. Highly recommended for placement drives.`,
        strengths: ['Strong problem solving', 'Quick learner', 'Team player'],
        weaknesses: ['Timed coding pressure practice needed'],
        improvementSuggestions: ['Build full-stack portfolio applications'],
      });

      await Trainer.findByIdAndUpdate(trainerObj.doc._id, {
        $addToSet: { assignedStudents: sDoc._id },
      });
    }
  }

  console.log('[Seed] Seeding Hiring Companies & Job Openings...');
  const companyDefs = [
    { name: 'ABC Technologies', industry: 'Enterprise Software', location: 'Bangalore', contactPerson: 'Ramesh Sundaram', contactEmail: 'hr@abctech.com', website: 'https://abctech.com' },
    { name: 'Infosys Next', industry: 'IT Services & Consulting', location: 'Bangalore', contactPerson: 'Neha Saxena', contactEmail: 'careers@infosysnext.com', website: 'https://infosysnext.com' },
    { name: 'TechMahindra AI', industry: 'Artificial Intelligence & Telecom', location: 'Hyderabad', contactPerson: 'Karan Mehra', contactEmail: 'hiring@techmahindra-ai.com', website: 'https://techmahindra-ai.com' },
    { name: 'GlobalSoft Solutions', industry: 'FinTech & Banking', location: 'Mumbai', contactPerson: 'Sanjay Dutt', contactEmail: 'recruitment@globalsoft.com', website: 'https://globalsoft.com' },
  ];

  const insertedCompanies = await Company.insertMany(companyDefs);
  const compMap = {};
  insertedCompanies.forEach((c) => {
    compMap[c.name] = c._id;
  });

  const javaFullStackJob = await Job.create({
    companyId: compMap['ABC Technologies'],
    title: 'Java Full Stack Developer',
    location: 'Bangalore',
    employmentType: 'Full-time',
    description: 'Looking for an ambitious Java Full Stack Developer skilled in Java microservices, Spring Boot, React, and MySQL database integration.',
    salaryRange: '8,50,000 - 13,00,000 INR per annum',
    requiredSkills: [
      { skillId: skillMap['Java'], requiredLevel: 4, mandatory: true, weight: 2 },
      { skillId: skillMap['Spring Boot'], requiredLevel: 4, mandatory: true, weight: 2 },
      { skillId: skillMap['React'], requiredLevel: 3, mandatory: true, weight: 2 },
      { skillId: skillMap['MySQL'], requiredLevel: 3, mandatory: true, weight: 1.5 },
      { skillId: skillMap['AWS'], requiredLevel: 2, mandatory: false, weight: 1 },
    ],
  });

  const frontendJob = await Job.create({
    companyId: compMap['ABC Technologies'],
    title: 'Frontend Developer',
    location: 'Bangalore',
    employmentType: 'Full-time',
    description: 'Join our UI team. Requirements: HTML, CSS, JavaScript, and React expertise.',
    salaryRange: '7,00,000 - 11,00,000 INR per annum',
    requiredSkills: [
      { skillId: skillMap['HTML'], requiredLevel: 4, mandatory: true, weight: 2 },
      { skillId: skillMap['CSS'], requiredLevel: 4, mandatory: true, weight: 2 },
      { skillId: skillMap['JavaScript'], requiredLevel: 4, mandatory: true, weight: 2 },
      { skillId: skillMap['React'], requiredLevel: 3, mandatory: true, weight: 2 },
    ],
  });

  // Link Primary Demo Student Arun to ABC Technologies drive
  const arunSkills = await StudentSkill.find({ studentId: arunStudentDoc._id }).populate('skillId');
  const arunGapAnalysis = calculateSkillGap(arunSkills, javaFullStackJob.requiredSkills);

  arunStudentDoc.readinessScore = arunGapAnalysis.overallMatchPercent;
  await arunStudentDoc.save();

  await CompanyStudentAssociation.create({
    studentId: arunStudentDoc._id,
    companyId: compMap['ABC Technologies'],
    jobId: javaFullStackJob._id,
    matchPercent: arunGapAnalysis.overallMatchPercent,
    associatedAt: new Date(),
  });

  const arunApp = await Application.create({
    studentId: arunStudentDoc._id,
    companyId: compMap['ABC Technologies'],
    jobId: javaFullStackJob._id,
    matchPercent: arunGapAnalysis.overallMatchPercent,
    status: 'Round 1',
    appliedAt: new Date(),
  });

  await InterviewRound.create({
    studentId: arunStudentDoc._id,
    companyId: compMap['ABC Technologies'],
    jobId: javaFullStackJob._id,
    applicationId: arunApp._id,
    roundName: 'Round 1 Completed',
    roundNumber: 1,
    scheduledDate: new Date(Date.now() - 24 * 60 * 60 * 1000),
    status: 'Passed',
    remarks: 'Strong understanding of Java OOP and relational database fundamentals.',
  });

  await StatusHistory.create({
    entityType: 'Application',
    entityId: arunApp._id,
    previousStatus: 'Applied',
    newStatus: 'Round 1 Completed',
    changedBy: p1User._id,
    remarks: 'Candidate cleared technical screening round 1 with distinction.',
  });

  console.log('[Seed] 60 Candidates & 5 Specialization Tracks Seeded Successfully!');
};
