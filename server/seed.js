import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { connectDB, disconnectDB } from './config/db.js';
import User from './models/User.js';
import Student from './models/Student.js';
import Trainer from './models/Trainer.js';
import PlacementOfficer from './models/PlacementOfficer.js';
import Company from './models/Company.js';
import Skill from './models/Skill.js';
import StudentSkill from './models/StudentSkill.js';
import Evaluation from './models/Evaluation.js';
import Feedback from './models/Feedback.js';
import Job from './models/Job.js';
import Application from './models/Application.js';
import CompanyStudentAssociation from './models/CompanyStudentAssociation.js';
import InterviewRound from './models/InterviewRound.js';
import StatusHistory from './models/StatusHistory.js';
import { ROLES } from './config/constants.js';
import { calculateSkillGap } from './services/skillGapEngine.js';

dotenv.config();

const seedDatabase = async () => {
  try {
    await connectDB();
    console.log('[Seed] Clearing existing collection data...');

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
      Job.deleteMany({}),
      Application.deleteMany({}),
      CompanyStudentAssociation.deleteMany({}),
      InterviewRound.deleteMany({}),
      StatusHistory.deleteMany({}),
    ]);

    console.log('[Seed] Seeding Skills (20+ across 8+ categories)...');
    const skillDefs = [
      { name: 'HTML', category: 'Frontend', description: 'HTML5 Semantic markup, web accessibility, and forms' },
      { name: 'CSS', category: 'Frontend', description: 'Modern CSS3 layouts, Flexbox, Grid, and responsiveness' },
      { name: 'JavaScript', category: 'Frontend', description: 'ES6+ async syntax, DOM manipulation, closures, and performance' },
      { name: 'React', category: 'Frontend', description: 'React hooks, state management, router, component architecture' },
      { name: 'Angular', category: 'Frontend', description: 'TypeScript framework for enterprise SPA development' },
      { name: 'Vue', category: 'Frontend', description: 'Progressive JavaScript framework for building user interfaces' },
      { name: 'Node.js', category: 'Backend', description: 'Asynchronous event-driven JavaScript server runtime' },
      { name: 'Express.js', category: 'Backend', description: 'Minimalist enterprise web framework for Node.js REST APIs' },
      { name: 'Java', category: 'Programming', description: 'Core Java, OOP principles, collections, and concurrency' },
      { name: 'Spring Boot', category: 'Backend', description: 'Enterprise Java framework for REST microservices' },
      { name: 'Python', category: 'Programming', description: 'Python scripting, data structures, and automation' },
      { name: 'Django', category: 'Backend', description: 'High-level Python web framework encouraging rapid development' },
      { name: 'MongoDB', category: 'Database', description: 'NoSQL document database, aggregation pipelines, Mongoose' },
      { name: 'MySQL', category: 'Database', description: 'Relational SQL database design, indexing, and queries' },
      { name: 'PostgreSQL', category: 'Database', description: 'Advanced open source relational database system' },
      { name: 'AWS', category: 'Cloud', description: 'Amazon Web Services EC2, S3, Lambda, IAM, and deployment' },
      { name: 'Azure', category: 'Cloud', description: 'Microsoft Azure cloud enterprise app services' },
      { name: 'Docker', category: 'DevOps', description: 'Containerization, Dockerfiles, multi-stage builds' },
      { name: 'Git', category: 'Tools', description: 'Distributed version control, branching strategies, GitHub' },
      { name: 'REST API', category: 'Backend', description: 'RESTful API architecture, JSON, HTTP protocols' },
    ];

    const insertedSkills = await Skill.insertMany(skillDefs);
    const skillMap = {};
    insertedSkills.forEach((s) => {
      skillMap[s.name] = s._id;
    });

    console.log('[Seed] Creating Super Admin, Placement Officers, and Trainers...');
    const defaultPassword = await User.hashPassword('Password@123');

    // 1. Super Admin
    const adminUser = await User.create({
      name: 'Dr. Rajesh Verma (Admin)',
      email: 'admin@skillbridge.edu',
      passwordHash: defaultPassword,
      role: ROLES.SUPER_ADMIN,
      phone: '+91 98765 00001',
    });

    // 2. Placement Officers (3)
    const p1User = await User.create({
      name: 'Priya Sharma (Placement)',
      email: 'placement@skillbridge.edu',
      passwordHash: defaultPassword,
      role: ROLES.PLACEMENT,
      phone: '+91 98765 00002',
    });
    await PlacementOfficer.create({ userId: p1User._id, department: 'Corporate Placement Cell' });

    const p2User = await User.create({
      name: 'Vikram Sethi',
      email: 'vikram.placement@skillbridge.edu',
      passwordHash: defaultPassword,
      role: ROLES.PLACEMENT,
      phone: '+91 98765 00003',
    });
    await PlacementOfficer.create({ userId: p2User._id, department: 'Engineering Relations' });

    const p3User = await User.create({
      name: 'Ananya Roy',
      email: 'ananya.placement@skillbridge.edu',
      passwordHash: defaultPassword,
      role: ROLES.PLACEMENT,
      phone: '+91 98765 00004',
    });
    await PlacementOfficer.create({ userId: p3User._id, department: 'Global Outreach' });

    // 3. Trainers (5)
    const t1User = await User.create({
      name: 'Prof. Suresh Nair (Trainer)',
      email: 'trainer@skillbridge.edu',
      passwordHash: defaultPassword,
      role: ROLES.TRAINER,
      phone: '+91 98765 00010',
    });
    const trainer1 = await Trainer.create({
      userId: t1User._id,
      department: 'Full Stack & Enterprise Software',
      specialization: 'Java & Microservices Architecture',
    });

    const t2User = await User.create({
      name: 'Kavita Menon',
      email: 'kavita.trainer@skillbridge.edu',
      passwordHash: defaultPassword,
      role: ROLES.TRAINER,
      phone: '+91 98765 00011',
    });
    const trainer2 = await Trainer.create({
      userId: t2User._id,
      department: 'Web Technologies & Frontend',
      specialization: 'React, Modern JS & Web UI',
    });

    const t3User = await User.create({
      name: 'Amitabh Sen',
      email: 'amitabh.trainer@skillbridge.edu',
      passwordHash: defaultPassword,
      role: ROLES.TRAINER,
      phone: '+91 98765 00012',
    });
    const trainer3 = await Trainer.create({
      userId: t3User._id,
      department: 'Database & Cloud Architecture',
      specialization: 'MongoDB, AWS & DevOps Pipelines',
    });

    const t4User = await User.create({
      name: 'Deepa Varma',
      email: 'deepa.trainer@skillbridge.edu',
      passwordHash: defaultPassword,
      role: ROLES.TRAINER,
      phone: '+91 98765 00013',
    });
    const trainer4 = await Trainer.create({
      userId: t4User._id,
      department: 'Python & Data Engineering',
      specialization: 'Python, Django & Machine Learning',
    });

    const t5User = await User.create({
      name: 'Rohan Deshmukh',
      email: 'rohan.trainer@skillbridge.edu',
      passwordHash: defaultPassword,
      role: ROLES.TRAINER,
      phone: '+91 98765 00014',
    });
    const trainer5 = await Trainer.create({
      userId: t5User._id,
      department: 'Quality Assurance & Testing',
      specialization: 'Automated Testing & Security Integration',
    });

    console.log('[Seed] Seeding 15+ Students with Primary Demo Candidate "Arun"...');

    const studentSeedList = [
      {
        name: 'Arun',
        email: 'student@skillbridge.edu',
        phone: '+91 98765 10001',
        course: 'Java Full Stack Engineering',
        department: 'Computer Science',
        trainer: trainer1._id,
        isDemoPrimary: true,
        skills: [
          { skillName: 'Java', level: 4 },
          { skillName: 'MySQL', level: 4 },
          { skillName: 'Python', level: 3 },
          { skillName: 'React', level: 2 },
          { skillName: 'AWS', level: 1 },
          { skillName: 'HTML', level: 5 },
          { skillName: 'CSS', level: 4 },
          { skillName: 'JavaScript', level: 4 },
        ],
      },
      {
        name: 'Rahul Kumar',
        email: 'rahul.kumar@skillbridge.edu',
        phone: '+91 98765 10002',
        course: 'Web Development & Modern JS',
        department: 'Information Technology',
        trainer: trainer2._id,
        skills: [
          { skillName: 'HTML', level: 5 },
          { skillName: 'CSS', level: 5 },
          { skillName: 'JavaScript', level: 4 },
          { skillName: 'React', level: 4 },
          { skillName: 'Node.js', level: 3 },
          { skillName: 'Git', level: 4 },
        ],
      },
      {
        name: 'Priya Sundaram',
        email: 'priya.sundaram@skillbridge.edu',
        phone: '+91 98765 10003',
        course: 'Frontend UI Systems',
        department: 'Computer Science',
        trainer: trainer2._id,
        skills: [
          { skillName: 'HTML', level: 4 },
          { skillName: 'CSS', level: 4 },
          { skillName: 'JavaScript', level: 3 },
          { skillName: 'React', level: 2 },
          { skillName: 'Vue', level: 3 },
        ],
      },
      {
        name: 'Karthik Raja',
        email: 'karthik.raja@skillbridge.edu',
        phone: '+91 98765 10004',
        course: 'Backend Engineering',
        department: 'Computer Science',
        trainer: trainer1._id,
        skills: [
          { skillName: 'Java', level: 4 },
          { skillName: 'Spring Boot', level: 4 },
          { skillName: 'PostgreSQL', level: 4 },
          { skillName: 'Docker', level: 3 },
          { skillName: 'REST API', level: 5 },
        ],
      },
      {
        name: 'Sneha Gupta',
        email: 'sneha.gupta@skillbridge.edu',
        phone: '+91 98765 10005',
        course: 'Cloud & DevOps Engineering',
        department: 'Electronics & Communication',
        trainer: trainer3._id,
        skills: [
          { skillName: 'AWS', level: 4 },
          { skillName: 'Docker', level: 4 },
          { skillName: 'Python', level: 3 },
          { skillName: 'MongoDB', level: 4 },
          { skillName: 'Git', level: 5 },
        ],
      },
      {
        name: 'Vijay Patel',
        email: 'vijay.patel@skillbridge.edu',
        phone: '+91 98765 10006',
        course: 'Python Data Systems',
        department: 'Data Science',
        trainer: trainer4._id,
        skills: [
          { skillName: 'Python', level: 5 },
          { skillName: 'Django', level: 4 },
          { skillName: 'PostgreSQL', level: 4 },
          { skillName: 'REST API', level: 4 },
        ],
      },
      {
        name: 'Meera Iyer',
        email: 'meera.iyer@skillbridge.edu',
        phone: '+91 98765 10007',
        course: 'Full Stack MERN',
        department: 'Computer Science',
        trainer: trainer2._id,
        skills: [
          { skillName: 'React', level: 4 },
          { skillName: 'Node.js', level: 4 },
          { skillName: 'Express.js', level: 4 },
          { skillName: 'MongoDB', level: 5 },
          { skillName: 'JavaScript', level: 5 },
        ],
      },
      {
        name: 'Aditya Chawla',
        email: 'aditya.chawla@skillbridge.edu',
        phone: '+91 98765 10008',
        course: 'Java Enterprise Systems',
        department: 'Information Science',
        trainer: trainer1._id,
        skills: [
          { skillName: 'Java', level: 3 },
          { skillName: 'Spring Boot', level: 3 },
          { skillName: 'MySQL', level: 3 },
          { skillName: 'Git', level: 4 },
        ],
      },
      {
        name: 'Divya Nair',
        email: 'divya.nair@skillbridge.edu',
        phone: '+91 98765 10009',
        course: 'Frontend Engineering',
        department: 'Computer Applications',
        trainer: trainer2._id,
        skills: [
          { skillName: 'HTML', level: 5 },
          { skillName: 'CSS', level: 4 },
          { skillName: 'JavaScript', level: 4 },
          { skillName: 'Angular', level: 4 },
        ],
      },
      {
        name: 'Siddharth Rao',
        email: 'siddharth.rao@skillbridge.edu',
        phone: '+91 98765 10010',
        course: 'DevOps & Infrastructure',
        department: 'Computer Science',
        trainer: trainer3._id,
        skills: [
          { skillName: 'Azure', level: 4 },
          { skillName: 'Docker', level: 3 },
          { skillName: 'Linux', level: 4 },
          { skillName: 'Git', level: 4 },
        ],
      },
      {
        name: 'Pooja Bhatt',
        email: 'pooja.bhatt@skillbridge.edu',
        phone: '+91 98765 10011',
        course: 'Software Testing & QA',
        department: 'Information Technology',
        trainer: trainer5._id,
        skills: [
          { skillName: 'Java', level: 3 },
          { skillName: 'Python', level: 3 },
          { skillName: 'Git', level: 4 },
          { skillName: 'REST API', level: 4 },
        ],
      },
      {
        name: 'Gautam Sharma',
        email: 'gautam.sharma@skillbridge.edu',
        phone: '+91 98765 10012',
        course: 'Database Administration',
        department: 'Computer Science',
        trainer: trainer3._id,
        skills: [
          { skillName: 'MySQL', level: 5 },
          { skillName: 'PostgreSQL', level: 5 },
          { skillName: 'MongoDB', level: 4 },
        ],
      },
      {
        name: 'Nisha Agarwal',
        email: 'nisha.agarwal@skillbridge.edu',
        phone: '+91 98765 10013',
        course: 'Full Stack Web Engineering',
        department: 'Information Science',
        trainer: trainer1._id,
        skills: [
          { skillName: 'Java', level: 4 },
          { skillName: 'React', level: 3 },
          { skillName: 'Node.js', level: 3 },
          { skillName: 'MySQL', level: 4 },
        ],
      },
      {
        name: 'Harish Reddy',
        email: 'harish.reddy@skillbridge.edu',
        phone: '+91 98765 10014',
        course: 'Cloud Computing & Serverless',
        department: 'Computer Science',
        trainer: trainer3._id,
        skills: [
          { skillName: 'AWS', level: 5 },
          { skillName: 'Docker', level: 4 },
          { skillName: 'Node.js', level: 4 },
        ],
      },
      {
        name: 'Tanvi Joshi',
        email: 'tanvi.joshi@skillbridge.edu',
        phone: '+91 98765 10015',
        course: 'Python Django Full Stack',
        department: 'Computer Applications',
        trainer: trainer4._id,
        skills: [
          { skillName: 'Python', level: 4 },
          { skillName: 'Django', level: 4 },
          { skillName: 'HTML', level: 4 },
          { skillName: 'CSS', level: 4 },
        ],
      },
    ];

    let arunStudentDoc = null;

    for (const seedData of studentSeedList) {
      const uDoc = await User.create({
        name: seedData.name,
        email: seedData.email,
        passwordHash: defaultPassword,
        role: ROLES.STUDENT,
        phone: seedData.phone,
      });

      const sDoc = await Student.create({
        userId: uDoc._id,
        course: seedData.course,
        department: seedData.department,
        education: 'B.Tech Computer Science',
        batch: '2022-2026',
        location: 'Bangalore, India',
        assignedTrainerId: seedData.trainer,
        overallRating: 4.0,
      });

      if (seedData.isDemoPrimary) {
        arunStudentDoc = sDoc;
      }

      // Add skills and evaluations for student
      for (const sk of seedData.skills) {
        const skillId = skillMap[sk.skillName];
        if (skillId) {
          await StudentSkill.create({
            studentId: sDoc._id,
            skillId,
            proficiencyLevel: sk.level,
            lastEvaluatedDate: new Date(),
          });

          await Evaluation.create({
            studentId: sDoc._id,
            trainerId: seedData.trainer,
            skillId,
            rating: sk.level,
            feedback: `Good understanding of ${sk.skillName} core concepts. Keep building projects!`,
            strength: `Solid architectural approach to ${sk.skillName}.`,
            improvementArea: `Practice real-world production performance optimizations in ${sk.skillName}.`,
            evaluatedAt: new Date(),
          });
        }
      }

      // Add qualitative feedback
      await Feedback.create({
        studentId: sDoc._id,
        trainerId: seedData.trainer,
        generalFeedback: `Strong technical fundamentals. High potential for engineering placement opportunities.`,
        strengths: ['Clean code principles', 'Quick learner', 'Active team participant'],
        weaknesses: ['Needs to practice more live coding under timed pressure'],
        improvementSuggestions: ['Build end-to-end full-stack projects', 'Participate in open source repos'],
      });
    }

    // Assign students to trainer assignedStudents lists
    const allStudents = await Student.find();
    for (const st of allStudents) {
      if (st.assignedTrainerId) {
        await Trainer.findByIdAndUpdate(st.assignedTrainerId, {
          $addToSet: { assignedStudents: st._id },
        });
      }
    }

    console.log('[Seed] Creating Hiring Companies (8+)...');
    const companyDefs = [
      { name: 'ABC Technologies', industry: 'Enterprise Software', location: 'Bangalore', contactPerson: 'Ramesh Sundaram', contactEmail: 'hr@abctech.com', website: 'https://abctech.com' },
      { name: 'Infosys Next', industry: 'IT Services & Consulting', location: 'Bangalore', contactPerson: 'Neha Saxena', contactEmail: 'careers@infosysnext.com', website: 'https://infosysnext.com' },
      { name: 'TechMahindra AI', industry: 'Artificial Intelligence & Telecom', location: 'Hyderabad', contactPerson: 'Karan Mehra', contactEmail: 'hiring@techmahindra-ai.com', website: 'https://techmahindra-ai.com' },
      { name: 'GlobalSoft Solutions', industry: 'FinTech & Banking', location: 'Mumbai', contactPerson: 'Sanjay Dutt', contactEmail: 'recruitment@globalsoft.com', website: 'https://globalsoft.com' },
      { name: 'DataCraft Analytics', industry: 'Data Intelligence', location: 'Pune', contactPerson: 'Pooja Hegde', contactEmail: 'talent@datacraft.io', website: 'https://datacraft.io' },
      { name: 'CloudScale Systems', industry: 'Cloud Infrastructure', location: 'Chennai', contactPerson: 'Arvind Swamy', contactEmail: 'jobs@cloudscale.com', website: 'https://cloudscale.com' },
      { name: 'CyberShield Enterprise', industry: 'Cybersecurity', location: 'Delhi NCR', contactPerson: 'Rajiv Kapoor', contactEmail: 'careers@cybershield.com', website: 'https://cybershield.com' },
      { name: 'InnovateX Digital', industry: 'E-Commerce SaaS', location: 'Bangalore', contactPerson: 'Shruthi Hassan', contactEmail: 'people@innovatex.io', website: 'https://innovatex.io' },
    ];

    const insertedCompanies = await Company.insertMany(companyDefs);
    const compMap = {};
    insertedCompanies.forEach((c) => {
      compMap[c.name] = c._id;
    });

    console.log('[Seed] Creating Job Openings with Required Skill Weightings...');
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
      companyId: compMap['InnovateX Digital'],
      title: 'Frontend Developer',
      location: 'Bangalore',
      employmentType: 'Full-time',
      description: 'Join our high-performance SaaS UI team. Requirements: HTML, CSS, JavaScript, and React expertise.',
      salaryRange: '7,00,000 - 11,00,000 INR per annum',
      requiredSkills: [
        { skillId: skillMap['HTML'], requiredLevel: 4, mandatory: true, weight: 2 },
        { skillId: skillMap['CSS'], requiredLevel: 4, mandatory: true, weight: 2 },
        { skillId: skillMap['JavaScript'], requiredLevel: 4, mandatory: true, weight: 2 },
        { skillId: skillMap['React'], requiredLevel: 3, mandatory: true, weight: 2 },
      ],
    });

    const backendJob = await Job.create({
      companyId: compMap['Infosys Next'],
      title: 'Backend Microservices Engineer',
      location: 'Bangalore',
      employmentType: 'Full-time',
      description: 'Build enterprise microservices using Java, Spring Boot, Node.js, and MongoDB.',
      salaryRange: '9,00,000 - 14,00,000 INR per annum',
      requiredSkills: [
        { skillId: skillMap['Java'], requiredLevel: 4, mandatory: true, weight: 2 },
        { skillId: skillMap['Spring Boot'], requiredLevel: 4, mandatory: true, weight: 2 },
        { skillId: skillMap['MongoDB'], requiredLevel: 3, mandatory: true, weight: 1.5 },
        { skillId: skillMap['Docker'], requiredLevel: 2, mandatory: false, weight: 1 },
      ],
    });

    const devopsJob = await Job.create({
      companyId: compMap['CloudScale Systems'],
      title: 'DevOps & Cloud Architect',
      location: 'Chennai',
      employmentType: 'Full-time',
      description: 'Manage AWS cloud clusters, Docker containers, and CI/CD pipelines.',
      salaryRange: '10,00,000 - 16,00,000 INR per annum',
      requiredSkills: [
        { skillId: skillMap['AWS'], requiredLevel: 4, mandatory: true, weight: 2 },
        { skillId: skillMap['Docker'], requiredLevel: 4, mandatory: true, weight: 2 },
        { skillId: skillMap['Python'], requiredLevel: 3, mandatory: false, weight: 1 },
      ],
    });

    const pythonJob = await Job.create({
      companyId: compMap['DataCraft Analytics'],
      title: 'Python Django Developer',
      location: 'Pune',
      employmentType: 'Full-time',
      description: 'Develop high-throughput REST APIs and data analytics platforms in Python & Django.',
      salaryRange: '8,00,000 - 12,00,000 INR per annum',
      requiredSkills: [
        { skillId: skillMap['Python'], requiredLevel: 4, mandatory: true, weight: 2 },
        { skillId: skillMap['Django'], requiredLevel: 4, mandatory: true, weight: 2 },
        { skillId: skillMap['PostgreSQL'], requiredLevel: 3, mandatory: true, weight: 1.5 },
      ],
    });

    console.log('[Seed] Associating Primary Demo Candidate Arun with Java Full Stack Developer job...');

    // Calculate match percentage using skill gap engine
    const arunSkills = await StudentSkill.find({ studentId: arunStudentDoc._id }).populate('skillId');
    const arunGapAnalysis = calculateSkillGap(arunSkills, javaFullStackJob.requiredSkills);

    // Update readiness score on student doc
    arunStudentDoc.readinessScore = arunGapAnalysis.overallMatchPercent;
    await arunStudentDoc.save();

    // Create Company Association
    await CompanyStudentAssociation.create({
      studentId: arunStudentDoc._id,
      companyId: compMap['ABC Technologies'],
      jobId: javaFullStackJob._id,
      matchPercent: arunGapAnalysis.overallMatchPercent,
      associatedAt: new Date(),
    });

    // Create Application
    const arunApp = await Application.create({
      studentId: arunStudentDoc._id,
      companyId: compMap['ABC Technologies'],
      jobId: javaFullStackJob._id,
      matchPercent: arunGapAnalysis.overallMatchPercent,
      status: 'Round 1',
      appliedAt: new Date(),
    });

    // Create Interview Round
    await InterviewRound.create({
      studentId: arunStudentDoc._id,
      companyId: compMap['ABC Technologies'],
      jobId: javaFullStackJob._id,
      applicationId: arunApp._id,
      roundName: 'Round 1 Completed',
      roundNumber: 1,
      scheduledDate: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
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

    console.log('[Seed] Database Seeding Completed Successfully!');
    console.log('--------------------------------------------------');
    console.log(' DEMO CREDS:');
    console.log(' Student:     student@skillbridge.edu     / Password@123 (Arun)');
    console.log(' Trainer:     trainer@skillbridge.edu     / Password@123');
    console.log(' Placement:   placement@skillbridge.edu   / Password@123');
    console.log(' Super Admin: admin@skillbridge.edu       / Password@123');
    console.log('--------------------------------------------------');

    await disconnectDB();
    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]', error);
    process.exit(1);
  }
};

seedDatabase();
