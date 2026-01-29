// WEMBA 51 Pathway Planner - Data
// Generated from curriculum documents

// Early Block Courses - 11 courses available for registration before Feb 15
// These are block courses taken during Terms 1-2 (after June 29-July 3)
// All courses are open to all cohorts regardless of location
const EARLY_BLOCK_COURSES = {
  // Term 1 - Summer 2026 (August)
  'LGST-8090': {
    code: 'LGST 8090',
    title: 'Sports Business Management',
    professor: 'DiGisi',
    credits: 0.5,
    department: 'LGST',
    term: 'T1',
    dates: 'August 3 - 6, 2026',
    location: 'SFO',
    cohorts: ['philadelphia', 'san_francisco', 'global']
  },
  'MKTG-8500': {
    code: 'MKTG 8500',
    title: 'Sales 3.0 and the Future of Revenue Growth',
    professor: 'Reed',
    credits: 0.5,
    department: 'MKTG',
    term: 'T1',
    dates: 'August 3 - 6, 2026',
    location: 'SFO',
    cohorts: ['philadelphia', 'san_francisco', 'global']
  },
  // Term 2 - Fall 2026
  'MKTG-8510': {
    code: 'MKTG XXXX',
    title: 'Designing and Deploying AI Agents',
    professor: 'Karol',
    credits: 0.5,
    department: 'MKTG',
    term: 'T2',
    dates: 'October 12 - 15, 2026',
    location: 'PHL',
    cohorts: ['philadelphia', 'san_francisco', 'global']
  },
  'MKTG-7340': {
    code: 'MKTG 7340',
    title: 'Creativity',
    professor: 'Nave',
    credits: 0.5,
    department: 'MKTG',
    term: 'T2',
    dates: 'October 12 - 15, 2026',
    location: 'SFO',
    cohorts: ['philadelphia', 'san_francisco', 'global']
  },
  'LGST-7500': {
    code: 'LGST 7500',
    title: 'Global (Anti-) Money Laundering',
    professor: 'Conti-Brown',
    credits: 0.5,
    department: 'LGST',
    term: 'T2',
    dates: 'October 12 - 15, 2026',
    location: 'PHL',
    cohorts: ['philadelphia', 'san_francisco', 'global']
  },
  'OIDD-6530': {
    code: 'OIDD 6530',
    title: 'Mathematical Modeling and its Appl. in Finance',
    professor: 'Katalan',
    credits: 0.5,
    department: 'OIDD',
    term: 'T2',
    dates: 'October 12 - 15, 2026',
    location: 'SFO',
    cohorts: ['philadelphia', 'san_francisco', 'global']
  },
  'HCMG-8600': {
    code: 'HCMG 8600',
    title: 'Leading Healthcare Organizations',
    professor: 'Nembhard',
    credits: 0.5,
    department: 'HCMG',
    term: 'T2',
    dates: 'November 30 - December 3, 2026',
    location: 'PHL',
    cohorts: ['philadelphia', 'san_francisco', 'global']
  },
  'OIDD-6140': {
    code: 'OIDD 6140',
    title: 'Innovation',
    professor: 'Netessine',
    credits: 0.5,
    department: 'OIDD',
    term: 'T2',
    dates: 'November 30 - December 3, 2026',
    location: 'SFO',
    cohorts: ['philadelphia', 'san_francisco', 'global']
  },
  'MGMT-8710': {
    code: 'MGMT 8710',
    title: 'Advanced Global Strategy',
    professor: 'Hernandez',
    credits: 0.5,
    department: 'MGMT',
    term: 'T2',
    dates: 'December 7 - 10, 2026',
    location: 'Global',
    cohorts: ['philadelphia', 'san_francisco', 'global']
  },
  'OIDD-6540': {
    code: 'OIDD 6540',
    title: 'Product Management',
    professor: 'Ulrich',
    credits: 0.5,
    department: 'OIDD',
    term: 'T2',
    dates: 'December 7 - 10, 2026',
    location: 'Global',
    cohorts: ['philadelphia', 'san_francisco', 'global']
  },
  'LGST-6420': {
    code: 'LGST 6420',
    title: 'Big Data, Big Responsibilities, Toward Accountable AI',
    professor: 'Werbach',
    credits: 0.5,
    department: 'LGST',
    term: 'T2',
    dates: 'December 17 - 20, 2026',
    location: 'SFO',
    cohorts: ['philadelphia', 'san_francisco', 'global']
  }
};

const COHORTS = {
  philadelphia: {
    id: 'philadelphia',
    name: 'Philadelphia (East)',
    shortName: 'PHL',
    format: 'In-Person',
    location: 'Philadelphia, PA'
  },
  san_francisco: {
    id: 'san_francisco',
    name: 'San Francisco (West)',
    shortName: 'SF',
    format: 'In-Person',
    location: 'San Francisco, CA'
  },
  global: {
    id: 'global',
    name: 'Global (WAVE)',
    shortName: 'GLO',
    format: 'Virtual',
    location: 'Online (7AM or 7PM sessions)'
  }
};

const PROGRAM_RULES = {
  graduationMinimum: 19.0,
  maximumWithoutExtraTuition: 22.0,
  programDuration: '22 months (6 terms)',
  fullTimeMinimum: 3.0,
  blockWeeksCovered: 1.0,
  passFailMaxPerSemester: 1.0
};

const DEPARTMENTS = {
  FNCE: { name: 'Finance', color: '#2563eb' },
  MGMT: { name: 'Management', color: '#7c3aed' },
  MKTG: { name: 'Marketing', color: '#db2777' },
  OIDD: { name: 'Operations, Information & Decisions', color: '#059669' },
  ACCT: { name: 'Accounting', color: '#d97706' },
  STAT: { name: 'Statistics', color: '#0891b2' },
  LGST: { name: 'Legal Studies & Business Ethics', color: '#4f46e5' },
  HCMG: { name: 'Health Care Management', color: '#dc2626' },
  REAL: { name: 'Real Estate', color: '#65a30d' },
  BEPP: { name: 'Business Economics & Public Policy', color: '#ea580c' },
  WHCP: { name: 'Wharton Communication Program', color: '#6366f1' }
};

// Course evaluation metrics metadata
const EVALUATION_METRICS = {
  instructorQuality: {
    key: 'instructorQuality',
    label: 'Overall Quality of Instructor',
    shortLabel: 'Instructor',
    description: 'Overall rating of instructor effectiveness',
    scale: { min: 1, max: 4 },
    higherIsBetter: true,
    category: 'instructor'
  },
  courseQuality: {
    key: 'courseQuality',
    label: 'Overall Quality of Course',
    shortLabel: 'Course',
    description: 'Overall rating of course quality',
    scale: { min: 1, max: 4 },
    higherIsBetter: true,
    category: 'course'
  },
  instructorCommunication: {
    key: 'instructorCommunication',
    label: 'Instructor Ability to Communicate',
    shortLabel: 'Communication',
    description: 'Clarity and effectiveness of teaching',
    scale: { min: 1, max: 4 },
    higherIsBetter: true,
    category: 'instructor'
  },
  instructorStimulateInterest: {
    key: 'instructorStimulateInterest',
    label: 'Instructor Ability to Stimulate Interest',
    shortLabel: 'Engagement',
    description: 'Engagement and inspiration level',
    scale: { min: 1, max: 4 },
    higherIsBetter: true,
    category: 'instructor'
  },
  instructorAccessibility: {
    key: 'instructorAccessibility',
    label: 'Instructor Accessibility',
    shortLabel: 'Accessibility',
    description: 'Willingness to discuss content/problems',
    scale: { min: 1, max: 4 },
    higherIsBetter: true,
    category: 'instructor'
  },
  valueOfReadings: {
    key: 'valueOfReadings',
    label: 'Value of Assigned Readings',
    shortLabel: 'Readings',
    description: 'Usefulness of course materials',
    scale: { min: 1, max: 4 },
    higherIsBetter: true,
    category: 'course'
  },
  knowledgeLearned: {
    key: 'knowledgeLearned',
    label: 'Knowledge/Concepts/Skills Learned',
    shortLabel: 'Knowledge',
    description: 'Concepts/skills/thinking ability gained',
    scale: { min: 1, max: 4 },
    higherIsBetter: true,
    category: 'course'
  },
  courseDifficulty: {
    key: 'courseDifficulty',
    label: 'Course Difficulty',
    shortLabel: 'Difficulty',
    description: 'Perceived difficulty level (higher = harder)',
    scale: { min: 1, max: 4 },
    higherIsBetter: null,
    category: 'workload'
  },
  workRequired: {
    key: 'workRequired',
    label: 'Work Required',
    shortLabel: 'Workload',
    description: 'Amount of work needed (higher = more)',
    scale: { min: 1, max: 4 },
    higherIsBetter: null,
    category: 'workload'
  },
  recommendToMajor: {
    key: 'recommendToMajor',
    label: 'Recommend to Major',
    shortLabel: 'Rec. Major',
    description: 'Would recommend to students in major',
    scale: { min: 1, max: 4 },
    higherIsBetter: true,
    category: 'recommendation'
  },
  recommendToNonMajor: {
    key: 'recommendToNonMajor',
    label: 'Recommend to Non-Major',
    shortLabel: 'Rec. Non-Major',
    description: 'Would recommend to students outside major',
    scale: { min: 1, max: 4 },
    higherIsBetter: true,
    category: 'recommendation'
  }
};

// Core curriculum for all cohorts (Terms 1-3)
const CORE_CURRICULUM = {
  philadelphia: {
    T1: [
      { code: 'ACCT-6130', title: 'Fundamentals of Financial and Managerial Accounting', credits: 1.0, professor: 'TBD' },
      { code: 'BEPP-6110', title: 'Microeconomics for Managers (Foundations + Advanced)', credits: 1.0, professor: 'TBD' },
      { code: 'MGMT-6130', title: 'Managing the Enterprise', credits: 1.0, professor: 'TBD' },
      { code: 'MGMT-6100', title: 'Foundations of Teamwork and Leadership', credits: 0.5, professor: 'TBD' }
    ],
    T2: [
      { code: 'STAT-6130', title: 'Regression Analysis for Business', credits: 1.0, professor: 'TBD' },
      { code: 'FNCE-6130', title: 'Macroeconomics and the Global Economic Environment', credits: 1.0, professor: 'TBD' },
      { code: 'MKTG-6110', title: 'Marketing Management', credits: 0.5, professor: 'TBD' },
      { code: 'OIDD-6110', title: 'Managing the Productive Core: Quality & Productivity', credits: 0.5, professor: 'TBD' }
    ],
    T3: [
      { code: 'FNCE-6210', title: 'Corporate Finance (Short)', credits: 0.5, professor: 'TBD', alternative: 'FNCE-6110' },
      { code: 'WHCP-6140', title: 'Management Communication', credits: 0.5, professor: 'TBD' },
      { code: 'OIDD-6150', title: 'Operations Strategy', credits: 0.5, professor: 'TBD' },
      { code: 'MKTG-6130', title: 'Strategic Marketing Simulation', credits: 0.5, professor: 'TBD' },
      { code: 'LGST-6120', title: 'Responsibility in Business', credits: 0.5, professor: 'TBD' }
    ],
    T3_alternative: [
      { code: 'FNCE-6110', title: 'Corporate Finance (Full)', credits: 1.0, professor: 'TBD', replaces: 'FNCE-6210', note: 'Required for Finance major' }
    ]
  },
  san_francisco: {
    T1: [
      { code: 'ACCT-6130', title: 'Fundamentals of Financial and Managerial Accounting', credits: 1.0, professor: 'TBD' },
      { code: 'BEPP-6110', title: 'Microeconomics for Managers (Foundations + Advanced)', credits: 1.0, professor: 'TBD' },
      { code: 'MGMT-6130', title: 'Managing the Enterprise', credits: 1.0, professor: 'TBD' },
      { code: 'MGMT-6100', title: 'Foundations of Teamwork and Leadership', credits: 0.5, professor: 'TBD' }
    ],
    T2: [
      { code: 'STAT-6130', title: 'Regression Analysis for Business', credits: 1.0, professor: 'TBD' },
      { code: 'FNCE-6130', title: 'Macroeconomics and the Global Economic Environment', credits: 1.0, professor: 'TBD' },
      { code: 'MKTG-6110', title: 'Marketing Management', credits: 0.5, professor: 'TBD' },
      { code: 'LGST-6120', title: 'Responsibility in Business', credits: 0.5, professor: 'TBD' }
    ],
    T3: [
      { code: 'FNCE-6210', title: 'Corporate Finance (Short)', credits: 0.5, professor: 'TBD', alternative: 'FNCE-6110' },
      { code: 'OIDD-6110', title: 'Managing the Productive Core: Quality & Productivity', credits: 0.5, professor: 'TBD' },
      { code: 'OIDD-6150', title: 'Operations Strategy', credits: 0.5, professor: 'TBD' },
      { code: 'MKTG-6130', title: 'Strategic Marketing Simulation', credits: 0.5, professor: 'TBD' },
      { code: 'WHCP-6140', title: 'Management Communication', credits: 0.5, professor: 'TBD' }
    ],
    T3_alternative: [
      { code: 'FNCE-6110', title: 'Corporate Finance (Full)', credits: 1.0, professor: 'TBD', replaces: 'FNCE-6210', note: 'Required for Finance major' }
    ]
  },
  global: {
    T1: [
      { code: 'ACCT-6130', title: 'Fundamentals of Financial and Managerial Accounting', credits: 1.0, professor: 'TBD' },
      { code: 'BEPP-6110', title: 'Microeconomics for Managers (Foundations + Advanced)', credits: 1.0, professor: 'TBD' },
      { code: 'MGMT-6130', title: 'Managing the Enterprise', credits: 1.0, professor: 'TBD' },
      { code: 'MGMT-6100', title: 'Foundations of Teamwork and Leadership', credits: 0.5, professor: 'TBD' }
    ],
    T2: [
      { code: 'STAT-6130', title: 'Regression Analysis for Business', credits: 1.0, professor: 'TBD' },
      { code: 'FNCE-6130', title: 'Macroeconomics and the Global Economic Environment', credits: 1.0, professor: 'TBD' },
      { code: 'OIDD-6110', title: 'Managing the Productive Core: Quality & Productivity', credits: 0.5, professor: 'TBD' },
      { code: 'WHCP-6140', title: 'Management Communication', credits: 0.5, professor: 'TBD' }
    ],
    T3: [
      { code: 'FNCE-6110', title: 'Corporate Finance (Full)', credits: 1.0, professor: 'TBD', note: 'Required - no short option for Global' },
      { code: 'OIDD-6150', title: 'Operations Strategy', credits: 0.5, professor: 'TBD' },
      { code: 'LGST-6110', title: 'Responsibility in Global Management', credits: 0.5, professor: 'TBD' },
      { code: 'MKTG-6110', title: 'Marketing Management', credits: 0.5, professor: 'TBD' },
      { code: 'MKTG-6120', title: 'Dynamic Marketing Strategy', credits: 0.5, professor: 'TBD' }
    ]
  }
};

// All elective courses with availability by cohort
const COURSES = {
  // FINANCE
  'FNCE-7030': {
    code: 'FNCE 7030',
    title: 'Advanced Corporate Finance',
    description: 'Advanced study of corporate financial decisions including capital structure, payout policy, mergers and acquisitions, and risk management. Builds on foundations from core corporate finance.',
    department: 'FNCE',
    credits: 1.0,
    prerequisites: ['FNCE-6110'],
    offerings: {
      san_francisco: {
        term: 'T4',
        professor: 'Christopher Parsons',
        slot: 'A,A',
        weekends: [0, 1, 2, 3, 4, 5, 6, 7],
        evaluations: {
          instructorQuality: 3.70,
          courseQuality: 3.57,
          instructorCommunication: 3.74,
          instructorStimulateInterest: 3.62,
          instructorAccessibility: 3.62,
          valueOfReadings: 3.55,
          knowledgeLearned: 3.59,
          courseDifficulty: 2.90,
          workRequired: 3.00,
          recommendToMajor: 3.41,
          recommendToNonMajor: 2.87
        }
      },
      global: {
        term: 'T5',
        professor: 'Itay Goldstein',
        slot: 'B,B',
        weekends: [0, 1, 2, 3, 4, 5, 6],
        evaluations: {
          instructorQuality: 3.36,
          courseQuality: 3.28,
          instructorCommunication: 3.37,
          instructorStimulateInterest: 3.12,
          instructorAccessibility: 3.31,
          valueOfReadings: 3.32,
          knowledgeLearned: 3.34,
          courseDifficulty: 3.05,
          workRequired: 3.27,
          recommendToMajor: 3.34,
          recommendToNonMajor: 2.68
        }
      }
    }
  },
  'FNCE-7050': {
    code: 'FNCE 7050',
    title: 'Investment Management',
    description: 'Survey of investment strategies, portfolio management, and risk assessment. Covers asset allocation, equity valuation, fixed income, and alternative investments.',
    department: 'FNCE',
    credits: 1.0,
    prerequisites: ['FNCE-6110'],
    offerings: {
      philadelphia: {
        term: 'T5',
        professor: 'Christopher Geczy',
        slot: 'A,A',
        weekends: [0, 1, 2, 3, 4, 5, 6, 7],
        evaluations: {
          instructorQuality: 3.04,
          courseQuality: 2.87,
          instructorCommunication: 3.07,
          instructorStimulateInterest: 2.86,
          instructorAccessibility: 3.21,
          valueOfReadings: 3.07,
          knowledgeLearned: 3.00,
          courseDifficulty: 3.57,
          workRequired: 3.64,
          recommendToMajor: 3.14,
          recommendToNonMajor: 2.00
        }
      },
      san_francisco: {
        term: 'T5',
        professor: 'Christopher Geczy',
        slot: 'B,B',
        weekends: [0, 1, 2, 3, 4, 5, 6, 7],
        evaluations: {
          instructorQuality: 3.04,
          courseQuality: 2.87,
          instructorCommunication: 3.07,
          instructorStimulateInterest: 2.86,
          instructorAccessibility: 3.21,
          valueOfReadings: 3.07,
          knowledgeLearned: 3.00,
          courseDifficulty: 3.57,
          workRequired: 3.64,
          recommendToMajor: 3.14,
          recommendToNonMajor: 2.00
        }
      },
      global: {
        term: 'T4',
        professor: 'Christopher Geczy',
        slot: 'A,A',
        weekends: [0, 1, 2, 3, 4, 5, 6, 7],
        evaluations: {
          instructorQuality: 3.04,
          courseQuality: 2.87,
          instructorCommunication: 3.07,
          instructorStimulateInterest: 2.86,
          instructorAccessibility: 3.21,
          valueOfReadings: 3.07,
          knowledgeLearned: 3.00,
          courseDifficulty: 3.57,
          workRequired: 3.64,
          recommendToMajor: 3.14,
          recommendToNonMajor: 2.00
        }
      }
    }
  },
  'FNCE-7070': {
    code: 'FNCE 7070',
    title: 'Valuation',
    description: 'Comprehensive framework for valuing companies, projects, and securities. Covers DCF analysis, comparable company analysis, LBO modeling, and merger analysis.',
    department: 'FNCE',
    credits: 1.0,
    prerequisites: ['FNCE-6110', 'ACCT-6130'],
    offerings: {
      san_francisco: {
        term: 'T4',
        professor: 'Kevin Kaiser',
        slot: 'C,C',
        weekends: [0, 1, 2, 3, 4, 5, 6, 7],
        evaluations: {
          instructorQuality: 3.72,
          courseQuality: 3.56,
          instructorCommunication: 3.77,
          instructorStimulateInterest: 3.81,
          instructorAccessibility: 3.65,
          valueOfReadings: 3.58,
          knowledgeLearned: 3.69,
          courseDifficulty: 3.12,
          workRequired: 3.31,
          recommendToMajor: 3.68,
          recommendToNonMajor: 3.48
        }
      },
      global: {
        term: 'T5',
        professor: 'Kevin Kaiser',
        slot: 'A,A',
        weekends: [0, 1, 2, 3, 4, 5, 6],
        evaluations: {
          instructorQuality: 3.72,
          courseQuality: 3.56,
          instructorCommunication: 3.77,
          instructorStimulateInterest: 3.81,
          instructorAccessibility: 3.65,
          valueOfReadings: 3.58,
          knowledgeLearned: 3.69,
          courseDifficulty: 3.12,
          workRequired: 3.31,
          recommendToMajor: 3.68,
          recommendToNonMajor: 3.48
        }
      }
    }
  },
  'FNCE-7170': {
    code: 'FNCE 7170',
    title: 'Financial Derivatives',
    description: 'Theory and application of derivative securities including options, futures, swaps, and structured products. Covers pricing, hedging strategies, and risk management.',
    department: 'FNCE',
    credits: 1.0,
    prerequisites: ['FNCE-6110', 'STAT-6130'],
    offerings: {
      philadelphia: {
        term: 'T5',
        professor: 'Michael Gibbons',
        slot: 'B,B',
        weekends: [0, 1, 2, 3, 4, 5, 6, 7],
        evaluations: {
          instructorQuality: 3.13,
          courseQuality: 2.87,
          instructorCommunication: 3.00,
          instructorStimulateInterest: 2.50,
          instructorAccessibility: 3.08,
          valueOfReadings: 2.64,
          knowledgeLearned: 3.07,
          courseDifficulty: 3.79,
          workRequired: 3.79,
          recommendToMajor: 3.00,
          recommendToNonMajor: 1.00
        }
      },
      san_francisco: {
        term: 'T5',
        professor: 'Michael Gibbons',
        slot: 'A,A',
        weekends: [0, 1, 2, 3, 4, 5, 6, 7],
        evaluations: {
          instructorQuality: 3.13,
          courseQuality: 2.87,
          instructorCommunication: 3.00,
          instructorStimulateInterest: 2.50,
          instructorAccessibility: 3.08,
          valueOfReadings: 2.64,
          knowledgeLearned: 3.07,
          courseDifficulty: 3.79,
          workRequired: 3.79,
          recommendToMajor: 3.00,
          recommendToNonMajor: 1.00
        }
      }
    }
  },
  'FNCE-7310': {
    code: 'FNCE 7310',
    title: 'Global Valuation and Risk Analysis',
    description: 'Valuation and risk assessment in international contexts. Covers cross-border transactions, currency risk, country risk analysis, and emerging market valuations.',
    department: 'FNCE',
    credits: 1.0,
    prerequisites: ['FNCE-6110'],
    offerings: {
      global: {
        term: 'T4',
        professor: 'Gordon Bodnar',
        slot: 'B,B',
        weekends: [0, 1, 2, 3, 4, 5, 6, 7],
        evaluations: {
          instructorQuality: 3.54,
          courseQuality: 3.38,
          instructorCommunication: 3.45,
          instructorStimulateInterest: 2.90,
          instructorAccessibility: 3.73,
          valueOfReadings: 3.18,
          knowledgeLearned: 3.36,
          courseDifficulty: 3.64,
          workRequired: 3.55,
          recommendToMajor: 3.18,
          recommendToNonMajor: 2.00
        }
      }
    }
  },
  'FNCE-7320': {
    code: 'FNCE 7320',
    title: 'International Banking',
    description: 'Analysis of global banking systems, international financial markets, and regulatory frameworks. Covers cross-border lending, trade finance, and banking crises.',
    department: 'FNCE',
    credits: 1.0,
    prerequisites: ['FNCE-6110', 'FNCE-6130'],
    offerings: {
      philadelphia: {
        term: 'T4',
        professor: 'Itay Goldstein',
        slot: 'A,A',
        weekends: [0, 1, 2, 3, 4, 5, 6],
        evaluations: {
          instructorQuality: 3.73,
          courseQuality: 3.73,
          instructorCommunication: 4.00,
          instructorStimulateInterest: 4.00,
          instructorAccessibility: 3.80,
          valueOfReadings: 3.80,
          knowledgeLearned: 3.80,
          courseDifficulty: 2.20,
          workRequired: 2.60,
          recommendToMajor: 3.50,
          recommendToNonMajor: 3.60
        }
      }
    }
  },
  'FNCE-7380': {
    code: 'FNCE 7380',
    title: 'Capital Markets',
    description: 'Structure and operation of capital markets including equity, debt, and money markets. Covers market microstructure, trading, and institutional investors.',
    department: 'FNCE',
    credits: 0.5,
    prerequisites: ['FNCE-6110'],
    offerings: {
      san_francisco: {
        term: 'T4',
        professor: 'David Musto',
        slot: 'B',
        weekends: [0, 1, 2, 3],
        evaluations: {
          instructorQuality: 3.13,
          courseQuality: 2.97,
          instructorCommunication: 3.04,
          instructorStimulateInterest: 2.92,
          instructorAccessibility: 3.40,
          valueOfReadings: 3.23,
          knowledgeLearned: 2.77,
          courseDifficulty: 2.54,
          workRequired: 2.54,
          recommendToMajor: 2.77,
          recommendToNonMajor: 2.58
        }
      },
      global: {
        term: 'T5',
        professor: 'David Musto',
        slot: 'C',
        weekends: [4, 5, 6],
        evaluations: {
          instructorQuality: 3.13,
          courseQuality: 2.97,
          instructorCommunication: 3.04,
          instructorStimulateInterest: 2.92,
          instructorAccessibility: 3.40,
          valueOfReadings: 3.23,
          knowledgeLearned: 2.77,
          courseDifficulty: 2.54,
          workRequired: 2.54,
          recommendToMajor: 2.77,
          recommendToNonMajor: 2.58
        }
      }
    }
  },
  'FNCE-7500': {
    code: 'FNCE 7500',
    title: 'Venture Capital and the Finance of Innovation',
    description: 'Financing entrepreneurial ventures from seed stage through exit. Covers deal structuring, valuation of early-stage companies, and the VC ecosystem.',
    department: 'FNCE',
    credits: 0.5,
    prerequisites: ['FNCE-6110'],
    offerings: {
      philadelphia: {
        term: 'T4',
        professor: 'David Wessels',
        slot: 'B',
        weekends: [0, 1, 2, 3],
        evaluations: {
          instructorQuality: 3.78,
          courseQuality: 3.69,
          instructorCommunication: 3.74,
          instructorStimulateInterest: 3.90,
          instructorAccessibility: 3.26,
          valueOfReadings: 3.53,
          knowledgeLearned: 3.69,
          courseDifficulty: 2.59,
          workRequired: 2.69,
          recommendToMajor: 3.72,
          recommendToNonMajor: 3.13
        }
      },
      san_francisco: {
        term: 'T6',
        professor: 'David Wessels',
        slot: 'B',
        weekends: [0, 1, 2, 3],
        evaluations: {
          instructorQuality: 3.78,
          courseQuality: 3.69,
          instructorCommunication: 3.74,
          instructorStimulateInterest: 3.90,
          instructorAccessibility: 3.26,
          valueOfReadings: 3.53,
          knowledgeLearned: 3.69,
          courseDifficulty: 2.59,
          workRequired: 2.69,
          recommendToMajor: 3.72,
          recommendToNonMajor: 3.13
        }
      },
      global: {
        term: 'T6',
        professor: 'David Wessels',
        slot: 'A',
        weekends: [0, 1, 2, 3],
        evaluations: {
          instructorQuality: 3.78,
          courseQuality: 3.69,
          instructorCommunication: 3.74,
          instructorStimulateInterest: 3.90,
          instructorAccessibility: 3.26,
          valueOfReadings: 3.53,
          knowledgeLearned: 3.69,
          courseDifficulty: 2.59,
          workRequired: 2.69,
          recommendToMajor: 3.72,
          recommendToNonMajor: 3.13
        }
      }
    }
  },
  'FNCE-7510': {
    code: 'FNCE 7510',
    title: 'Finance of Buyouts and Acquisitions',
    description: 'Private equity transactions including leveraged buyouts, growth equity, and acquisition financing. Covers deal sourcing, due diligence, and value creation.',
    department: 'FNCE',
    credits: 0.5,
    prerequisites: ['FNCE-6110'],
    offerings: {
      global: {
        term: 'T5',
        professor: 'Burcu Esmer',
        slot: 'C',
        weekends: [4, 5, 6],
        evaluations: {
          instructorQuality: 3.68,
          courseQuality: 3.47,
          instructorCommunication: 3.91,
          instructorStimulateInterest: 3.79,
          instructorAccessibility: 3.75,
          valueOfReadings: 3.50,
          knowledgeLearned: 3.67,
          courseDifficulty: 2.67,
          workRequired: 2.67,
          recommendToMajor: 3.54,
          recommendToNonMajor: 3.21
        }
      }
    }
  },
  'FNCE-7540': {
    code: 'FNCE 7540',
    title: 'ESG and Impact Investing',
    description: 'Environmental, social, and governance factors in investment decisions. Covers sustainable finance, impact measurement, and stakeholder capitalism.',
    department: 'FNCE',
    credits: 0.5,
    prerequisites: [],
    offerings: {
      philadelphia: {
        term: 'T6',
        professor: 'Christopher Geczy',
        slot: 'B',
        weekends: [0, 1, 2, 3],
        evaluations: {
          instructorQuality: 2.88,
          courseQuality: 2.60,
          instructorCommunication: 2.58,
          instructorStimulateInterest: 2.50,
          instructorAccessibility: 2.36,
          valueOfReadings: 2.13,
          knowledgeLearned: 2.38,
          courseDifficulty: 1.96,
          workRequired: 2.25,
          recommendToMajor: 2.63,
          recommendToNonMajor: 1.90
        }
      }
    }
  },
  'FNCE-7910': {
    code: 'FNCE 7910',
    title: 'Corporate Restructuring',
    description: 'Financial distress, bankruptcy, and corporate turnarounds. Covers debt restructuring, distressed investing, and value maximization in crisis situations.',
    department: 'FNCE',
    credits: 0.5,
    prerequisites: ['FNCE-6110'],
    offerings: {
      san_francisco: {
        term: 'T6',
        professor: 'Kevin Kaiser',
        slot: 'B',
        weekends: [0, 1, 2, 3],
        evaluations: {
          instructorQuality: 3.31,
          courseQuality: 2.75,
          instructorCommunication: 3.37,
          instructorStimulateInterest: 3.34,
          instructorAccessibility: 3.40,
          valueOfReadings: 3.07,
          knowledgeLearned: 2.93,
          courseDifficulty: 2.60,
          workRequired: 2.53,
          recommendToMajor: 3.03,
          recommendToNonMajor: 2.57
        }
      }
    }
  },
  'FNCE-8010': {
    code: 'FNCE 8010',
    title: 'Advanced Private Equity',
    description: 'Deep dive into private equity operations, portfolio management, and exit strategies. Case-based approach to PE value creation and fund management.',
    department: 'FNCE',
    credits: 0.5,
    prerequisites: ['FNCE-6110'],
    offerings: {
      philadelphia: { term: 'T6', professor: 'Burcu Esmer', dates: 'May 3-6, 2027' }
    }
  },
  'FNCE-7401': {
    code: 'FNCE 7401',
    title: 'Global Macro Investment Strategy',
    description: 'Macro-driven investment approaches across asset classes and geographies. Covers economic analysis, policy impacts, and global portfolio construction.',
    department: 'FNCE',
    credits: 0.5,
    prerequisites: ['FNCE-6110', 'FNCE-6130'],
    offerings: {
      san_francisco: { term: 'T6', professor: 'Anthony Landry', dates: 'Apr 26-29, 2027' }
    }
  },
  'FNCE-8960': {
    code: 'FNCE 8960',
    title: 'Finance in UAE',
    description: 'Global Modular Course focused on finance in the UAE. Covers regional capital markets, sovereign wealth funds, and emerging market finance.',
    department: 'FNCE',
    credits: 0.5,
    prerequisites: ['FNCE-6110'],
    offerings: {
      philadelphia: { term: 'T4', category: 'GMC', professor: 'David Musto, Burcu Esmer', dates: 'Jan 5-9, 2026', location: 'UAE' },
      san_francisco: { term: 'T4', category: 'GMC', professor: 'David Musto, Burcu Esmer', dates: 'Jan 5-9, 2026', location: 'UAE' },
      global: { term: 'T4', category: 'GMC', professor: 'David Musto, Burcu Esmer', dates: 'Jan 5-9, 2026', location: 'UAE' }
    }
  },

  // MANAGEMENT
  'MGMT-6250': {
    code: 'MGMT 6250',
    title: 'Corporate Governance',
    description: 'Role of boards, shareholders, and executives in corporate decision-making. Covers governance mechanisms, executive compensation, and stakeholder management.',
    department: 'MGMT',
    credits: 0.5,
    prerequisites: [],
    offerings: {
      philadelphia: {
        term: 'T6',
        professor: 'Mae McDonnell',
        slot: 'A',
        weekends: [0, 1, 2, 3],
        evaluations: {
          instructorQuality: 3.38,
          courseQuality: 2.95,
          instructorCommunication: 3.59,
          instructorStimulateInterest: 3.41,
          instructorAccessibility: 3.14,
          valueOfReadings: 3.00,
          knowledgeLearned: 3.16,
          courseDifficulty: 1.59,
          workRequired: 1.56,
          recommendToMajor: 3.13,
          recommendToNonMajor: 2.97
        }
      },
      san_francisco: {
        term: 'T4',
        professor: 'Mae McDonnell',
        slot: 'C',
        weekends: [4, 5, 6],
        evaluations: {
          instructorQuality: 3.38,
          courseQuality: 2.95,
          instructorCommunication: 3.59,
          instructorStimulateInterest: 3.41,
          instructorAccessibility: 3.14,
          valueOfReadings: 3.00,
          knowledgeLearned: 3.16,
          courseDifficulty: 1.59,
          workRequired: 1.56,
          recommendToMajor: 3.13,
          recommendToNonMajor: 2.97
        }
      }
    }
  },
  'MGMT-6910': {
    code: 'MGMT 6910',
    title: 'Negotiations',
    description: 'Theory and practice of negotiation in business contexts. Develops skills in distributive and integrative bargaining, multiparty negotiations, and dispute resolution.',
    department: 'MGMT',
    credits: 1.0,
    prerequisites: [],
    offerings: {
      philadelphia: {
        term: 'T5',
        professor: 'Mae McDonnell',
        slot: 'C,C',
        weekends: [0, 1, 2, 3, 4, 5, 6, 7],
        evaluations: {
          instructorQuality: 3.48,
          courseQuality: 3.38
        }
      },
      san_francisco: {
        term: 'T4',
        professor: 'Mae McDonnell',
        slot: 'B,B',
        weekends: [0, 1, 2, 3, 4, 5, 6, 7],
        evaluations: {
          instructorQuality: 3.48,
          courseQuality: 3.38
        }
      }
    }
  },
  'MGMT-7010': {
    code: 'MGMT 7010',
    title: 'Strategy and Competitive Advantage',
    description: 'Analysis of competitive dynamics and strategic positioning. Covers industry analysis, competitive advantage sources, and strategic decision-making frameworks.',
    department: 'MGMT',
    credits: 0.5,
    prerequisites: ['MGMT-6130'],
    offerings: {
      philadelphia: {
        term: 'T5',
        professor: 'Sonia Marciano',
        slot: 'A',
        weekends: [0, 1, 2, 3],
        evaluations: {
          instructorQuality: 1.97,
          courseQuality: 1.85,
          instructorCommunication: 1.76,
          instructorStimulateInterest: 1.72,
          instructorAccessibility: 3.08,
          valueOfReadings: 2.20,
          knowledgeLearned: 1.84,
          courseDifficulty: 1.96,
          workRequired: 2.04,
          recommendToMajor: 1.52,
          recommendToNonMajor: 1.36
        }
      },
      san_francisco: {
        term: 'T4',
        professor: 'Sonia Marciano',
        slot: 'B',
        weekends: [0, 1, 2, 3],
        evaluations: {
          instructorQuality: 1.97,
          courseQuality: 1.85,
          instructorCommunication: 1.76,
          instructorStimulateInterest: 1.72,
          instructorAccessibility: 3.08,
          valueOfReadings: 2.20,
          knowledgeLearned: 1.84,
          courseDifficulty: 1.96,
          workRequired: 2.04,
          recommendToMajor: 1.52,
          recommendToNonMajor: 1.36
        }
      },
      global: {
        term: 'T5',
        professor: 'Sonia Marciano',
        slot: 'A',
        weekends: [0, 1, 2, 3],
        evaluations: {
          instructorQuality: 1.97,
          courseQuality: 1.85,
          instructorCommunication: 1.76,
          instructorStimulateInterest: 1.72,
          instructorAccessibility: 3.08,
          valueOfReadings: 2.20,
          knowledgeLearned: 1.84,
          courseDifficulty: 1.96,
          workRequired: 2.04,
          recommendToMajor: 1.52,
          recommendToNonMajor: 1.36
        }
      }
    }
  },
  'MGMT-7150': {
    code: 'MGMT 7150',
    title: 'Political and Social Environment of the Multinational Firm',
    description: 'Managing political risk and stakeholder relationships across borders. Covers government relations, NGO engagement, and social license to operate.',
    department: 'MGMT',
    credits: 0.5,
    prerequisites: [],
    offerings: {
      philadelphia: {
        term: 'T6',
        professor: 'Vit Henisz',
        slot: 'B',
        weekends: [0, 1, 2, 3],
        evaluations: {
          instructorQuality: 3.21,
          courseQuality: 2.92,
          instructorCommunication: 3.44,
          instructorStimulateInterest: 3.44,
          instructorAccessibility: 3.33,
          valueOfReadings: 3.22,
          knowledgeLearned: 3.13,
          courseDifficulty: 2.11,
          workRequired: 2.11,
          recommendToMajor: 3.00,
          recommendToNonMajor: 3.33
        }
      },
      san_francisco: {
        term: 'T5',
        professor: 'Vit Henisz',
        slot: 'C',
        weekends: [4, 5, 6],
        evaluations: {
          instructorQuality: 3.21,
          courseQuality: 2.92,
          instructorCommunication: 3.44,
          instructorStimulateInterest: 3.44,
          instructorAccessibility: 3.33,
          valueOfReadings: 3.22,
          knowledgeLearned: 3.13,
          courseDifficulty: 2.11,
          workRequired: 2.11,
          recommendToMajor: 3.00,
          recommendToNonMajor: 3.33
        }
      }
    }
  },
  'MGMT-7210': {
    code: 'MGMT 7210',
    title: 'Corporate Development, Mergers and Acquisitions',
    description: 'Strategic and operational aspects of M&A transactions. Covers deal sourcing, valuation, due diligence, integration planning, and post-merger management.',
    department: 'MGMT',
    credits: 1.0,
    prerequisites: ['FNCE-6110'],
    offerings: {
      philadelphia: {
        term: 'T4',
        professor: 'Emilie Feldman',
        slot: 'B,B',
        weekends: [0, 1, 2, 3, 4, 5, 6],
        evaluations: {
          instructorQuality: 3.33,
          courseQuality: 3.06,
          instructorCommunication: 3.51,
          instructorStimulateInterest: 3.37,
          instructorAccessibility: 3.54,
          valueOfReadings: 3.32,
          knowledgeLearned: 3.20,
          courseDifficulty: 2.25,
          workRequired: 2.60,
          recommendToMajor: 3.05,
          recommendToNonMajor: 2.88
        }
      },
      san_francisco: {
        term: 'T5',
        professor: 'Harbir Singh',
        slot: 'B,B',
        weekends: [0, 1, 2, 3, 4, 5, 6, 7],
        evaluations: {
          instructorQuality: 2.67,
          courseQuality: 2.54,
          instructorCommunication: 2.92,
          instructorStimulateInterest: 2.21,
          instructorAccessibility: 3.50,
          valueOfReadings: 3.08,
          knowledgeLearned: 2.71,
          courseDifficulty: 2.04,
          workRequired: 2.71,
          recommendToMajor: 2.54,
          recommendToNonMajor: 1.96
        }
      }
    }
  },
  'MGMT-7310': {
    code: 'MGMT 7310',
    title: 'Technology Strategy',
    description: 'Strategic management of technology and innovation. Covers technology adoption, platform strategy, intellectual property, and managing technological change.',
    department: 'MGMT',
    credits: 0.5,
    prerequisites: ['MGMT-6130'],
    offerings: {
      philadelphia: {
        term: 'T6',
        professor: 'Rahul Kapoor',
        slot: 'B',
        weekends: [0, 1, 2, 3],
        evaluations: {
          instructorQuality: 3.24,
          courseQuality: 2.82,
          instructorCommunication: 3.45,
          instructorStimulateInterest: 3.05,
          instructorAccessibility: 3.14,
          valueOfReadings: 2.95,
          knowledgeLearned: 2.82,
          courseDifficulty: 2.09,
          workRequired: 2.36,
          recommendToMajor: 2.71,
          recommendToNonMajor: 2.36
        }
      },
      san_francisco: {
        term: 'T5',
        professor: 'Lori Rosenkopf',
        slot: 'B',
        weekends: [0, 1, 2, 3],
        evaluations: {
          instructorQuality: 2.36,
          courseQuality: 2.00,
          instructorCommunication: 2.50,
          instructorStimulateInterest: 2.68,
          instructorAccessibility: 3.10,
          valueOfReadings: 2.55,
          knowledgeLearned: 1.86,
          courseDifficulty: 1.45,
          workRequired: 2.23,
          recommendToMajor: 1.82,
          recommendToNonMajor: 1.50
        }
      },
      global: {
        term: 'T5',
        professor: 'Rahul Kapoor',
        slot: 'A',
        weekends: [0, 1, 2, 3],
        evaluations: {
          instructorQuality: 3.24,
          courseQuality: 2.82,
          instructorCommunication: 3.45,
          instructorStimulateInterest: 3.05,
          instructorAccessibility: 3.14,
          valueOfReadings: 2.95,
          knowledgeLearned: 2.82,
          courseDifficulty: 2.09,
          workRequired: 2.36,
          recommendToMajor: 2.71,
          recommendToNonMajor: 2.36
        }
      }
    }
  },
  'MGMT-7640': {
    code: 'MGMT 7640',
    title: 'Tech in the SF Bay Area',
    description: 'Immersive exploration of Silicon Valley ecosystem including company visits, venture capital meetings, and discussions with tech leaders and entrepreneurs.',
    department: 'MGMT',
    credits: 0.5,
    prerequisites: [],
    offerings: {
      san_francisco: { term: 'T6', professor: 'Lori Rosenkopf', dates: 'Mar 8-11, 2027' }
    }
  },
  'MGMT-7720': {
    code: 'MGMT 7720',
    title: 'Power and Politics in Organizations',
    description: 'Understanding and navigating organizational politics. Covers influence tactics, coalition building, power dynamics, and political skill development.',
    department: 'MGMT',
    credits: 0.5,
    prerequisites: [],
    offerings: {
      philadelphia: { term: 'T6', professor: 'Samir Nurmohamed', dates: 'Jan 11-14, 2027' }
    }
  },
  'MGMT-7820': {
    code: 'MGMT 7820',
    title: 'Strategic Implementation',
    description: 'Executing strategy effectively through organizational design, change management, and performance systems. Bridges strategy formulation and execution.',
    department: 'MGMT',
    credits: 0.5,
    prerequisites: ['MGMT-6130'],
    offerings: {
      global: {
        term: 'T4',
        professor: 'Michael Christensen',
        slot: 'B',
        weekends: [0, 1, 2, 3],
        evaluations: {
          instructorQuality: 2.73,
          courseQuality: 2.45,
          instructorCommunication: 2.67,
          instructorStimulateInterest: 2.67,
          instructorAccessibility: 3.22,
          valueOfReadings: 2.67,
          knowledgeLearned: 2.00,
          courseDifficulty: 2.00,
          workRequired: 2.56,
          recommendToMajor: 2.11,
          recommendToNonMajor: 2.00
        }
      }
    }
  },
  'MGMT-7830': {
    code: 'MGMT 7830',
    title: 'Impact Measurement',
    description: 'Frameworks for measuring and managing social and environmental impact. Covers impact metrics, theory of change, and data-driven impact management.',
    department: 'MGMT',
    credits: 0.5,
    prerequisites: [],
    offerings: {
      philadelphia: { term: 'T6', professor: 'Vit Henisz', dates: 'May 3-6, 2027' }
    }
  },
  'MGMT-7930': {
    code: 'MGMT 7930',
    title: 'People Analytics',
    description: 'Data-driven approaches to human capital decisions. Covers workforce analytics, talent metrics, and evidence-based HR management.',
    department: 'MGMT',
    credits: 0.5,
    prerequisites: ['STAT-6130'],
    offerings: {
      philadelphia: { term: 'T5', professor: 'Matthew Bidwell', slot: 'B', weekends: [0, 1, 2, 3] },
      global: { term: 'T5', professor: 'Matthew Bidwell', slot: 'C', weekends: [4, 5, 6] }
    }
  },
  'MGMT-7990': {
    code: 'MGMT 7990',
    title: 'Social Impact Consulting Practicum',
    description: 'Hands-on consulting project with social enterprises or nonprofits. Apply business frameworks to address real organizational challenges.',
    department: 'MGMT',
    credits: 0.5,
    prerequisites: [],
    offerings: {
      philadelphia: { term: 'T6', professor: 'David Rhode', slot: 'C,C', weekends: [0, 1, 2, 3, 4, 5, 6, 7] },
      san_francisco: { term: 'T6', professor: 'David Rhode', slot: 'C,C', weekends: [0, 1, 2, 3, 4, 5, 6, 7] },
      global: { term: 'T6', professor: 'David Rhode', slot: 'C,C', weekends: [0, 1, 2, 3, 4, 5, 6, 7] }
    }
  },
  'MGMT-8010': {
    code: 'MGMT 8010',
    title: 'Entrepreneurship',
    description: 'Foundations of starting and growing new ventures. Covers opportunity recognition, business model design, fundraising, and scaling strategies.',
    department: 'MGMT',
    credits: 0.5,
    prerequisites: [],
    offerings: {
      philadelphia: {
        term: 'T4',
        professor: 'Henning Piezunka',
        slot: 'C',
        weekends: [4, 5, 6],
        evaluations: {
          instructorQuality: 3.85,
          courseQuality: 3.76,
          instructorCommunication: 3.81,
          instructorStimulateInterest: 3.91,
          instructorAccessibility: 3.54,
          valueOfReadings: 3.26,
          knowledgeLearned: 3.64,
          courseDifficulty: 1.40,
          workRequired: 1.79,
          recommendToMajor: 3.67,
          recommendToNonMajor: 3.60
        }
      },
      san_francisco: {
        term: 'T5',
        professor: 'Karl Ulrich',
        slot: 'C',
        weekends: [4, 5, 6],
        evaluations: {
          instructorQuality: 2.58,
          courseQuality: 2.20,
          instructorCommunication: 2.81,
          instructorStimulateInterest: 2.45,
          instructorAccessibility: 2.59,
          valueOfReadings: 2.48,
          knowledgeLearned: 2.31,
          courseDifficulty: 2.31,
          workRequired: 3.19,
          recommendToMajor: 2.25,
          recommendToNonMajor: 1.91
        }
      },
      global: {
        term: 'T4',
        professor: 'Karl Ulrich',
        slot: 'C',
        weekends: [4, 5, 6],
        evaluations: {
          instructorQuality: 2.58,
          courseQuality: 2.20,
          instructorCommunication: 2.81,
          instructorStimulateInterest: 2.45,
          instructorAccessibility: 2.59,
          valueOfReadings: 2.48,
          knowledgeLearned: 2.31,
          courseDifficulty: 2.31,
          workRequired: 3.19,
          recommendToMajor: 2.25,
          recommendToNonMajor: 1.91
        }
      }
    }
  },
  'MGMT-8040': {
    code: 'MGMT 8040',
    title: 'Venture Capital and Entrepreneurial Management',
    description: 'Understanding the VC-entrepreneur relationship. Covers fundraising strategy, term sheets, board dynamics, and managing venture-backed companies.',
    department: 'MGMT',
    credits: 0.5,
    prerequisites: ['MGMT-8010'],
    offerings: {
      philadelphia: { term: 'T5', professor: 'Raffi Amit', slot: 'B', weekends: [0, 1, 2, 3] },
      san_francisco: { term: 'T5', professor: 'Raffi Amit', slot: 'C', weekends: [4, 5, 6, 7] },
      global: { term: 'T5', professor: 'Raffi Amit', slot: 'B', weekends: [0, 1, 2, 3] }
    }
  },
  'MGMT-8090': {
    code: 'MGMT 8090',
    title: 'Private Equity in Emerging Markets',
    description: 'PE investment strategies in developing economies. Covers market entry, deal structuring, operational improvements, and exit challenges in emerging markets.',
    department: 'MGMT',
    credits: 0.5,
    prerequisites: ['FNCE-6110'],
    offerings: {
      san_francisco: { term: 'T4', professor: 'Stephen Sammut', slot: 'A', weekends: [0, 1, 2, 3] },
      global: { term: 'T5', professor: 'Stephen Sammut', slot: 'C', weekends: [4, 5, 6] }
    }
  },
  'MGMT-8110': {
    code: 'MGMT 8110',
    title: 'Entrepreneurship Through Acquisition',
    description: 'Acquiring and operating small businesses as a path to entrepreneurship. Covers search funds, acquisition financing, and owner-operator strategies.',
    department: 'MGMT',
    credits: 0.5,
    prerequisites: ['FNCE-6110'],
    offerings: {
      san_francisco: {
        term: 'T6',
        professor: 'Robert Chalfin',
        slot: 'A',
        weekends: [0, 1, 2, 3],
        evaluations: {
          instructorQuality: 2.88,
          courseQuality: 2.58,
          instructorCommunication: 3.23,
          instructorStimulateInterest: 3.16,
          instructorAccessibility: 3.82,
          valueOfReadings: 2.47,
          knowledgeLearned: 2.89,
          courseDifficulty: 2.09,
          workRequired: 2.11,
          recommendToMajor: 2.68,
          recommendToNonMajor: 2.14
        }
      },
      global: {
        term: 'T5',
        professor: 'Robert Chalfin',
        slot: 'B',
        weekends: [0, 1, 2, 3],
        evaluations: {
          instructorQuality: 2.88,
          courseQuality: 2.58,
          instructorCommunication: 3.23,
          instructorStimulateInterest: 3.16,
          instructorAccessibility: 3.82,
          valueOfReadings: 2.47,
          knowledgeLearned: 2.89,
          courseDifficulty: 2.09,
          workRequired: 2.11,
          recommendToMajor: 2.68,
          recommendToNonMajor: 2.14
        }
      }
    }
  },
  'MGMT-8130': {
    code: 'MGMT 8130',
    title: 'Vibefounding: Entrepreneurship with AI',
    description: 'Entrepreneurship course focused on building AI-native ventures. Covers founder-market fit, product iteration, and go-to-market for AI products.',
    department: 'MGMT',
    credits: 0.5,
    prerequisites: [],
    offerings: {
      philadelphia: { term: 'T4', professor: 'Ethan Mollick', dates: 'Jan 12-15, 2026' }
    }
  },
  'MGMT-8160': {
    code: 'MGMT 8160',
    title: 'Building Human Assets in Entrepreneurial Ventures',
    description: 'Talent strategies for startups and high-growth companies. Covers recruiting, culture building, compensation, and organizational scaling.',
    department: 'MGMT',
    credits: 0.5,
    prerequisites: ['MGMT-8010'],
    offerings: {
      san_francisco: { term: 'T6', professor: 'Valery Yakubovich', dates: 'May 3-6, 2027' }
    }
  },
  'MGMT-8310': {
    code: 'MGMT 8310',
    title: 'Venture Launchpad',
    description: 'Intensive venture development program to launch or advance your startup. Covers customer discovery, MVP development, and investor pitch preparation.',
    department: 'MGMT',
    credits: 0.5,
    prerequisites: ['MGMT-8010'],
    offerings: {
      philadelphia: { term: 'T4', professor: 'Tyler Wry', slot: 'B', weekends: [0, 1, 2, 3] },
      san_francisco: { term: 'T6', professor: 'Tyler Wry', slot: 'A', weekends: [0, 1, 2, 3] },
      global: { term: 'T4', professor: 'Tyler Wry', slot: 'B', weekends: [0, 1, 2, 3] }
    }
  },
  'MGMT-8320': {
    code: 'MGMT 8320',
    title: 'Business Model Innovation',
    description: 'Designing and transforming business models. Covers business model canvas, value proposition design, and strategies for business model change.',
    department: 'MGMT',
    credits: 0.5,
    prerequisites: ['MGMT-6130'],
    offerings: {
      philadelphia: {
        term: 'T5',
        professor: 'Michael Christensen',
        slot: 'A',
        weekends: [0, 1, 2, 3],
        evaluations: {
          instructorQuality: 2.73,
          courseQuality: 2.45,
          instructorCommunication: 2.67,
          instructorStimulateInterest: 2.67,
          instructorAccessibility: 3.22,
          valueOfReadings: 2.67,
          knowledgeLearned: 2.00,
          courseDifficulty: 2.00,
          workRequired: 2.56,
          recommendToMajor: 2.11,
          recommendToNonMajor: 2.00
        }
      },
      san_francisco: {
        term: 'T4',
        professor: 'Michael Christensen',
        slot: 'C',
        weekends: [4, 5, 6],
        evaluations: {
          instructorQuality: 2.73,
          courseQuality: 2.45,
          instructorCommunication: 2.67,
          instructorStimulateInterest: 2.67,
          instructorAccessibility: 3.22,
          valueOfReadings: 2.67,
          knowledgeLearned: 2.00,
          courseDifficulty: 2.00,
          workRequired: 2.56,
          recommendToMajor: 2.11,
          recommendToNonMajor: 2.00
        }
      }
    }
  },
  'MGMT-8710': {
    code: 'MGMT 8710',
    title: 'Advanced Global Strategy',
    description: 'Strategic challenges of operating across borders. Covers market selection, entry modes, global integration vs. local adaptation, and managing global organizations.',
    department: 'MGMT',
    credits: 0.5,
    prerequisites: ['MGMT-6130'],
    offerings: {
      philadelphia: {
        term: 'T5',
        professor: 'Zeke Hernandez',
        slot: 'C',
        weekends: [4, 5, 6],
        evaluations: {
          instructorQuality: 3.69,
          courseQuality: 3.28,
          instructorCommunication: 3.71,
          instructorStimulateInterest: 3.59,
          instructorAccessibility: 3.33,
          valueOfReadings: 3.02,
          knowledgeLearned: 3.05,
          courseDifficulty: 2.11,
          workRequired: 2.53,
          recommendToMajor: 3.26,
          recommendToNonMajor: 2.91
        }
      },
      san_francisco: {
        term: 'T6',
        professor: 'Zeke Hernandez',
        slot: 'B',
        weekends: [0, 1, 2, 3],
        evaluations: {
          instructorQuality: 3.69,
          courseQuality: 3.28,
          instructorCommunication: 3.71,
          instructorStimulateInterest: 3.59,
          instructorAccessibility: 3.33,
          valueOfReadings: 3.02,
          knowledgeLearned: 3.05,
          courseDifficulty: 2.11,
          workRequired: 2.53,
          recommendToMajor: 3.26,
          recommendToNonMajor: 2.91
        }
      },
      global: {
        term: 'T5',
        professor: 'Zeke Hernandez',
        dates: 'Dec 7-10, 2026',
        evaluations: {
          instructorQuality: 3.69,
          courseQuality: 3.28,
          instructorCommunication: 3.71,
          instructorStimulateInterest: 3.59,
          instructorAccessibility: 3.33,
          valueOfReadings: 3.02,
          knowledgeLearned: 3.05,
          courseDifficulty: 2.11,
          workRequired: 2.53,
          recommendToMajor: 3.26,
          recommendToNonMajor: 2.91
        }
      }
    }
  },
  'MGMT-XXXX': {
    code: 'MGMT XXXX',
    title: 'Finishing First: Motorsport Lessons on Competition',
    description: 'Strategic lessons from Formula 1 and motorsport. Immersive experience in Bologna exploring technology, teamwork, and competitive dynamics in racing.',
    department: 'MGMT',
    credits: 0.5,
    prerequisites: [],
    offerings: {
      global: { term: 'T4', professor: 'Henning Piezunka', dates: 'Jun 29 - Jul 3, 2026', location: 'Bologna' }
    }
  },
  'MGMT-XXXX-IMPACT': {
    code: 'MGMT XXXX-IMPACT',
    title: 'Impact Investing',
    description: 'Block week course on impact investing. Covers impact thesis design, measurement, and portfolio construction.',
    department: 'MGMT',
    credits: 0.5,
    prerequisites: [],
    offerings: {
      philadelphia: { term: 'T4', professor: 'Vit Henisz', dates: 'May 4-7, 2026', location: 'Philadelphia/NY' }
    }
  },
  'MGMT-8970-INDIA': {
    code: 'MGMT 8970-INDIA',
    title: 'Enterprise Growth Through Innovation & Ecosystems: The Indian Perspective',
    description: 'Global Modular Course on enterprise growth and innovation ecosystems in India. Cross-listed as WH 2120.',
    department: 'MGMT',
    credits: 0.5,
    prerequisites: [],
    offerings: {
      philadelphia: { term: 'T4', category: 'GMC', professor: 'Rahul Kapoor, Harbir Singh', dates: 'Mar 9-13, 2026', location: 'India' },
      san_francisco: { term: 'T4', category: 'GMC', professor: 'Rahul Kapoor, Harbir Singh', dates: 'Mar 9-13, 2026', location: 'India' },
      global: { term: 'T4', category: 'GMC', professor: 'Rahul Kapoor, Harbir Singh', dates: 'Mar 9-13, 2026', location: 'India' }
    }
  },
  'WH-2120': {
    code: 'WH 2120',
    title: 'Enterprise Growth Through Innovation & Ecosystems: The Indian Perspective',
    description: 'Global Modular Course on enterprise growth and innovation ecosystems in India. Cross-listed with MGMT 8970.',
    department: 'MGMT',
    credits: 0.5,
    prerequisites: [],
    offerings: {
      philadelphia: { term: 'T4', category: 'GMC', professor: 'Rahul Kapoor, Harbir Singh', dates: 'Mar 9-13, 2026', location: 'India' },
      san_francisco: { term: 'T4', category: 'GMC', professor: 'Rahul Kapoor, Harbir Singh', dates: 'Mar 9-13, 2026', location: 'India' },
      global: { term: 'T4', category: 'GMC', professor: 'Rahul Kapoor, Harbir Singh', dates: 'Mar 9-13, 2026', location: 'India' }
    }
  },
  'MGMT-8970-GERMANY': {
    code: 'MGMT 8970-GERMANY',
    title: 'Environmental Sustainability, Mobility & Innovation in Germany',
    description: 'Global Modular Course on sustainability, mobility, and innovation in Germany. Company visits and ecosystem analysis.',
    department: 'MGMT',
    credits: 0.5,
    prerequisites: [],
    offerings: {
      philadelphia: { term: 'T4', category: 'GMC', professor: 'John Paul MacDuffie, Nicolaj Siggelkow', dates: 'May 4-8, 2026', location: 'Germany' },
      san_francisco: { term: 'T4', category: 'GMC', professor: 'John Paul MacDuffie, Nicolaj Siggelkow', dates: 'May 4-8, 2026', location: 'Germany' },
      global: { term: 'T4', category: 'GMC', professor: 'John Paul MacDuffie, Nicolaj Siggelkow', dates: 'May 4-8, 2026', location: 'Germany' }
    }
  },
  'MGMT-8980-SOUTH-AFRICA': {
    code: 'MGMT 8980-SOUTH-AFRICA',
    title: 'South Africa: The Role of Business in Societal Opportunity',
    description: 'Global Modular Course exploring the role of business in societal opportunity in South Africa. Cross-listed with LGST 8980.',
    department: 'MGMT',
    credits: 0.5,
    prerequisites: [],
    offerings: {
      philadelphia: { term: 'T4', category: 'GMC', professor: 'Kenneth Shropshire, Eric Kacou', dates: 'Mar 9-13, 2026', location: 'South Africa' },
      san_francisco: { term: 'T4', category: 'GMC', professor: 'Kenneth Shropshire, Eric Kacou', dates: 'Mar 9-13, 2026', location: 'South Africa' },
      global: { term: 'T4', category: 'GMC', professor: 'Kenneth Shropshire, Eric Kacou', dates: 'Mar 9-13, 2026', location: 'South Africa' }
    }
  },
  'MGMT-XXX3-LONDON': {
    code: 'MGMT XXX3-LONDON',
    title: 'London Calling: Driving Innovation in Traditional Economies',
    description: 'Global Modular Course examining innovation in traditional industries in London and the UK.',
    department: 'MGMT',
    credits: 0.5,
    prerequisites: [],
    offerings: {
      philadelphia: { term: 'T4', category: 'GMC', professor: 'Henning Piezunka', dates: 'May 4-8, 2026', location: 'UK (London)' },
      san_francisco: { term: 'T4', category: 'GMC', professor: 'Henning Piezunka', dates: 'May 4-8, 2026', location: 'UK (London)' },
      global: { term: 'T4', category: 'GMC', professor: 'Henning Piezunka', dates: 'May 4-8, 2026', location: 'UK (London)' }
    }
  },

  // MARKETING
  'MKTG-7110': {
    code: 'MKTG 7110',
    title: 'Consumer Behavior',
    description: 'Psychological foundations of consumer decision-making. Covers perception, motivation, attitudes, and social influences on purchasing behavior.',
    department: 'MKTG',
    credits: 0.5,
    prerequisites: ['MKTG-6110'],
    offerings: {
      philadelphia: { term: 'T4', professor: 'Annie Wilson', slot: 'C', weekends: [4, 5, 6] },
      san_francisco: { term: 'T6', professor: 'Annie Wilson', slot: 'A', weekends: [0, 1, 2, 3] }
    }
  },
  'MKTG-7120': {
    code: 'MKTG 7120',
    title: 'Marketing Research',
    description: 'Design and analysis of marketing research studies. Covers survey methods, experimental design, conjoint analysis, and qualitative research techniques.',
    department: 'MKTG',
    credits: 1.0,
    prerequisites: ['MKTG-6110', 'STAT-6130'],
    offerings: {
      philadelphia: { term: 'T6', professor: 'Raghu Iyengar', slot: 'A', weekends: [0, 1, 2, 3] },
      san_francisco: { term: 'T4', professor: 'Raghu Iyengar', slot: 'C', weekends: [4, 5, 6] }
    }
  },
  'MKTG-7710': {
    code: 'MKTG 7710',
    title: 'Models for Marketing Strategy',
    description: 'Analytical models for marketing strategy and decision-making.',
    department: 'MKTG',
    credits: 1.0,
    prerequisites: ['MKTG-6110', 'STAT-6130'],
    offerings: {}
  },
  'MKTG-8090': {
    code: 'MKTG 8090',
    title: 'Experiments for Business Decision Making',
    description: 'Design and analysis of experiments for business and marketing decisions.',
    department: 'MKTG',
    credits: 1.0,
    prerequisites: ['MKTG-6110', 'STAT-6130'],
    offerings: {}
  },
  'MKTG-9400': {
    code: 'MKTG 9400',
    title: 'Measurement and Data Analysis in Marketing I',
    description: 'Doctoral-level marketing measurement and data analysis (part 1).',
    department: 'MKTG',
    credits: 0.5,
    prerequisites: [],
    offerings: {}
  },
  'MKTG-9410': {
    code: 'MKTG 9410',
    title: 'Measurement and Data Analysis in Marketing II',
    description: 'Doctoral-level marketing measurement and data analysis (part 2).',
    department: 'MKTG',
    credits: 0.5,
    prerequisites: [],
    offerings: {}
  },
  'MKTG-9420': {
    code: 'MKTG 9420',
    title: 'Research Methods in Marketing I',
    description: 'Doctoral-level research methods in marketing (part 1).',
    department: 'MKTG',
    credits: 0.5,
    prerequisites: [],
    offerings: {}
  },
  'MKTG-9430': {
    code: 'MKTG 9430',
    title: 'Research Methods in Marketing II',
    description: 'Doctoral-level research methods in marketing (part 2).',
    department: 'MKTG',
    credits: 0.5,
    prerequisites: [],
    offerings: {}
  },
  'MKTG-7340': {
    code: 'MKTG 7340',
    title: 'Creativity',
    description: 'Science and practice of creativity in business. Covers creative thinking techniques, innovation processes, and fostering creativity in organizations.',
    department: 'MKTG',
    credits: 0.5,
    prerequisites: [],
    offerings: {
      san_francisco: { term: 'T5', professor: 'Gideon Nave', dates: 'Oct 12-15, 2026' }
    }
  },
  'MKTG-7540': {
    code: 'MKTG 7540',
    title: 'Pricing Policy',
    description: 'Strategic approaches to pricing decisions. Covers price discrimination, bundling, dynamic pricing, and pricing in competitive markets.',
    department: 'MKTG',
    credits: 0.5,
    prerequisites: ['MKTG-6110', 'BEPP-6110'],
    offerings: {
      philadelphia: { term: 'T6', professor: 'Jagmohan S Raju', slot: 'A', weekends: [0, 1, 2, 3] },
      san_francisco: { term: 'T6', professor: 'Jagmohan S Raju', slot: 'A', weekends: [0, 1, 2, 3] }
    }
  },
  'MKTG-7760': {
    code: 'MKTG 7760',
    title: 'Applied Probability Models in Marketing',
    description: 'Quantitative models for customer analytics. Covers customer lifetime value, RFM analysis, buy-till-you-die models, and customer-base valuation.',
    department: 'MKTG',
    credits: 1.0,
    prerequisites: ['STAT-6130'],
    offerings: {
      philadelphia: { term: 'T4', professor: 'Pete Fader', slot: 'A,A', weekends: [0, 1, 2, 3, 4, 5, 6] },
      san_francisco: { term: 'T5', professor: 'Pete Fader', slot: 'A,A', weekends: [0, 1, 2, 3, 4, 5, 6, 7] }
    }
  },
  'MKTG-7770': {
    code: 'MKTG 7770',
    title: 'Marketing Strategy',
    description: 'Framework for developing marketing strategy. Covers segmentation, targeting, positioning, competitive analysis, and go-to-market planning.',
    department: 'MKTG',
    credits: 0.5,
    prerequisites: ['MKTG-6110'],
    offerings: {
      philadelphia: {
        term: 'T4',
        professor: 'Pinar Yildirim',
        slot: 'B',
        weekends: [0, 1, 2, 3],
        evaluations: {
          instructorQuality: 2.54,
          courseQuality: 2.54,
          instructorCommunication: 2.67,
          instructorStimulateInterest: 1.92,
          instructorAccessibility: 3.18,
          valueOfReadings: 2.67,
          knowledgeLearned: 2.33,
          courseDifficulty: 2.08,
          workRequired: 2.50,
          recommendToMajor: 2.33,
          recommendToNonMajor: 1.92
        }
      },
      global: {
        term: 'T6',
        professor: 'Pinar Yildirim',
        slot: 'A',
        weekends: [0, 1, 2, 3],
        evaluations: {
          instructorQuality: 2.54,
          courseQuality: 2.54,
          instructorCommunication: 2.67,
          instructorStimulateInterest: 1.92,
          instructorAccessibility: 3.18,
          valueOfReadings: 2.67,
          knowledgeLearned: 2.33,
          courseDifficulty: 2.08,
          workRequired: 2.50,
          recommendToMajor: 2.33,
          recommendToNonMajor: 1.92
        }
      }
    }
  },
  'MKTG-7770-BW': {
    code: 'MKTG 7770',
    title: 'Marketing Strategy (Block Week)',
    description: 'Intensive version of Marketing Strategy. Framework for developing marketing strategy including segmentation, targeting, and positioning.',
    department: 'MKTG',
    credits: 0.5,
    prerequisites: ['MKTG-6110'],
    offerings: {
      philadelphia: { term: 'T6', professor: 'Pinar Yildirim', dates: 'Jan 11-14, 2027' }
    }
  },
  'MKTG-7780': {
    code: 'MKTG 7780',
    title: 'Strategic Brand Management',
    description: 'Building and managing strong brands. Covers brand equity, brand architecture, brand extensions, and brand positioning strategies.',
    department: 'MKTG',
    credits: 1.0,
    prerequisites: ['MKTG-6110'],
    offerings: {
      philadelphia: { term: 'T5', professor: 'Patti Williams', slot: 'A,A', weekends: [0, 1, 2, 3, 4, 5, 6, 7] },
      san_francisco: { term: 'T4', professor: 'Patti Williams', slot: 'A,A', weekends: [0, 1, 2, 3, 4, 5, 6, 7] }
    }
  },
  'MKTG-7790': {
    code: 'MKTG 7790',
    title: 'AI in Our Lives: The Behavioral Science of Autonomous Technology',
    description: 'Human interaction with AI and autonomous systems. Covers trust, adoption, ethical considerations, and designing human-centered AI applications.',
    department: 'MKTG',
    credits: 0.5,
    prerequisites: [],
    offerings: {
      global: { term: 'T6', professor: 'Stefano Puntoni', slot: 'B', weekends: [3, 4] }
    }
  },
  'MKTG-8500': {
    code: 'MKTG 8500',
    title: 'Sales 3.0 and the Future of Revenue Growth',
    description: 'Modern sales strategies and technology. Covers sales process optimization, CRM systems, sales analytics, and digital selling techniques.',
    department: 'MKTG',
    credits: 0.5,
    prerequisites: [],
    offerings: {
      san_francisco: { term: 'T4', professor: 'Americus Reed', dates: 'Aug 3-6, 2026' }
    }
  },
  'MKTG-8530': {
    code: 'MKTG 8530',
    title: 'Advertising Management',
    description: 'Planning and executing advertising campaigns. Covers media planning, creative strategy, digital advertising, and measuring advertising effectiveness.',
    department: 'MKTG',
    credits: 0.5,
    prerequisites: ['MKTG-6110'],
    offerings: {
      philadelphia: { term: 'T6', professor: 'Annie Wilson', dates: 'Mar 8-11, 2027' }
    }
  },
  'MKTG-8960-SAUDI': {
    code: 'MKTG 8960-SAUDI',
    title: 'Saudi Arabia: Understanding its Transformation',
    description: "Global Modular Course on Saudi Arabia's economic and social transformation. Focus on consumer markets, policy changes, and business opportunities.",
    department: 'MKTG',
    credits: 0.5,
    prerequisites: [],
    offerings: {
      philadelphia: { term: 'T4', category: 'GMC', professor: 'Peter Fader', dates: 'Jan 4-8, 2026', location: 'Saudi Arabia' },
      san_francisco: { term: 'T4', category: 'GMC', professor: 'Peter Fader', dates: 'Jan 4-8, 2026', location: 'Saudi Arabia' },
      global: { term: 'T4', category: 'GMC', professor: 'Peter Fader', dates: 'Jan 4-8, 2026', location: 'Saudi Arabia' }
    }
  },
  'MKTG-8960-KOREA': {
    code: 'MKTG 8960-KOREA',
    title: 'South Korea as a Window into Creative Practices',
    description: "Global Modular Course exploring South Korea's creative industries and innovation practices.",
    department: 'MKTG',
    credits: 0.5,
    prerequisites: [],
    offerings: {
      philadelphia: { term: 'T4', category: 'GMC', professor: 'Gideon Nave, Stefano Puntoni', dates: 'May 25-29, 2026', location: 'South Korea' },
      san_francisco: { term: 'T4', category: 'GMC', professor: 'Gideon Nave, Stefano Puntoni', dates: 'May 25-29, 2026', location: 'South Korea' },
      global: { term: 'T4', category: 'GMC', professor: 'Gideon Nave, Stefano Puntoni', dates: 'May 25-29, 2026', location: 'South Korea' }
    }
  },
  'MKTG-8970': {
    code: 'MKTG 8970',
    title: 'Luxury Branding and Retailing in Paris',
    description: 'Immersive study of luxury brand management in Paris. Company visits and case studies on heritage brands, craftsmanship, and luxury retail strategy.',
    department: 'MKTG',
    credits: 0.5,
    prerequisites: ['MKTG-6110'],
    offerings: {
      san_francisco: { term: 'T6', professor: 'Barbara Kahn', dates: 'May 3-7, 2027', location: 'Paris' }
    }
  },
  'MKTG-XXXX': {
    code: 'MKTG XXXX',
    title: 'Designing and Deploying AI Agents',
    description: 'Practical approach to building AI agents for business applications. Covers LLM prompting, agent architectures, and deployment strategies.',
    department: 'MKTG',
    credits: 0.5,
    prerequisites: [],
    offerings: {
      philadelphia: { term: 'T5', professor: 'Sohiit Karol', dates: 'Oct 12-15, 2026' }
    }
  },

  // OPERATIONS, INFORMATION & DECISIONS
  'OIDD-6120': {
    code: 'OIDD 6120',
    title: 'Business Analytics',
    description: 'Data-driven decision making in business. Covers optimization, simulation, decision analysis, and practical applications of analytics tools.',
    department: 'OIDD',
    credits: 0.5,
    prerequisites: ['STAT-6130'],
    offerings: {
      philadelphia: { term: 'T6', professor: 'Sergei Savin', slot: 'B', weekends: [3, 4] },
      san_francisco: { term: 'T5', professor: 'Ziv Katalan', slot: 'C', weekends: [4, 5, 6, 7] },
      global: { term: 'T6', professor: 'Sergei Savin', slot: 'B', weekends: [3, 4] }
    }
  },
  'OIDD-6140': {
    code: 'OIDD 6140',
    title: 'Innovation',
    description: 'Managing innovation processes from ideation to commercialization. Covers design thinking, prototyping, innovation metrics, and building innovative organizations.',
    department: 'OIDD',
    credits: 0.5,
    prerequisites: [],
    offerings: {
      san_francisco: { term: 'T5', professor: 'Serguei Netessine', dates: 'Nov 30 - Dec 3, 2026' }
    }
  },
  'OIDD-6360': {
    code: 'OIDD 6360',
    title: 'Scaling Operations',
    description: 'Managing growth and operational complexity. Covers capacity planning, process improvement, supply chain management, and service operations scaling.',
    department: 'OIDD',
    credits: 1.0,
    prerequisites: ['OIDD-6110'],
    offerings: {
      philadelphia: {
        term: 'T4',
        professor: 'Gad Allon',
        slot: 'B,B',
        weekends: [0, 1, 2, 3, 4, 5, 6],
        evaluations: {
          instructorQuality: 3.40,
          courseQuality: 3.50,
          instructorCommunication: 3.67,
          instructorStimulateInterest: 3.67,
          instructorAccessibility: 3.78,
          valueOfReadings: 3.33,
          knowledgeLearned: 3.67,
          courseDifficulty: 3.00,
          workRequired: 3.00,
          recommendToMajor: 3.33,
          recommendToNonMajor: 3.11
        }
      },
      san_francisco: {
        term: 'T5',
        professor: 'Gad Allon',
        slot: 'B,B',
        weekends: [0, 1, 2, 3, 4, 5, 6, 7],
        evaluations: {
          instructorQuality: 3.40,
          courseQuality: 3.50,
          instructorCommunication: 3.67,
          instructorStimulateInterest: 3.67,
          instructorAccessibility: 3.78,
          valueOfReadings: 3.33,
          knowledgeLearned: 3.67,
          courseDifficulty: 3.00,
          workRequired: 3.00,
          recommendToMajor: 3.33,
          recommendToNonMajor: 3.11
        }
      },
      global: {
        term: 'T4',
        professor: 'Gad Allon',
        slot: 'A,A',
        weekends: [0, 1, 2, 3, 4, 5, 6, 7],
        evaluations: {
          instructorQuality: 3.40,
          courseQuality: 3.50,
          instructorCommunication: 3.67,
          instructorStimulateInterest: 3.67,
          instructorAccessibility: 3.78,
          valueOfReadings: 3.33,
          knowledgeLearned: 3.67,
          courseDifficulty: 3.00,
          workRequired: 3.00,
          recommendToMajor: 3.33,
          recommendToNonMajor: 3.11
        }
      }
    }
  },
  'OIDD-6530': {
    code: 'OIDD 6530',
    title: 'Mathematical Modeling and its Applications in Finance',
    description: 'Quantitative modeling techniques for financial applications. Covers stochastic processes, optimization in finance, and risk modeling.',
    department: 'OIDD',
    credits: 0.5,
    prerequisites: ['STAT-6130', 'FNCE-6110'],
    offerings: {
      san_francisco: { term: 'T5', professor: 'Ziv Katalan', dates: 'Oct 12-15, 2026' }
    }
  },
  'OIDD-6540': {
    code: 'OIDD 6540',
    title: 'Product Management',
    description: 'End-to-end product management from concept to launch. Covers product strategy, roadmapping, user research, and cross-functional team leadership.',
    department: 'OIDD',
    credits: 0.5,
    prerequisites: [],
    offerings: {
      san_francisco: { term: 'T5', professor: 'Karl Ulrich', slot: 'A', weekends: [0, 1, 2, 3] },
      global: { term: 'T5', professor: 'Karl Ulrich', dates: 'Dec 7-10, 2026' }
    }
  },
  'OIDD-6620': {
    code: 'OIDD 6620',
    title: 'Enabling Technologies',
    description: 'Strategic implications of emerging technologies. Covers cloud computing, blockchain, IoT, and technology adoption decisions.',
    department: 'OIDD',
    credits: 0.5,
    prerequisites: [],
    offerings: {
      san_francisco: { term: 'T6', professor: 'Lynn Wu', slot: 'B', weekends: [0, 1, 2, 3] },
      global: { term: 'T5', professor: 'Lynn Wu', slot: 'C', weekends: [4, 5, 6] }
    }
  },
  'OIDD-6670': {
    code: 'OIDD 6670',
    title: 'AI, Business, and Society',
    description: 'Strategic and societal implications of AI. Covers AI applications, algorithmic decision-making, bias and fairness, and AI governance.',
    department: 'OIDD',
    credits: 0.5,
    prerequisites: [],
    offerings: {
      philadelphia: { term: 'T6', professor: 'Priyanka Vergadia', dates: 'May 3-6, 2027' },
      san_francisco: { term: 'T6', professor: 'Kartik Hosanagar', dates: 'Mar 8-11, 2027' }
    }
  },
  'OIDD-6920': {
    code: 'OIDD 6920',
    title: 'Advanced Topics in Negotiation',
    description: 'Complex negotiation scenarios and advanced techniques. Covers multi-party negotiations, cross-cultural negotiations, and mediation.',
    department: 'OIDD',
    credits: 0.5,
    prerequisites: ['MGMT-6910'],
    offerings: {
      philadelphia: { term: 'T6', professor: 'Maurice Schweitzer', dates: 'Mar 8-11, 2027' }
    }
  },
  'OIDD-6930': {
    code: 'OIDD 6930',
    title: 'Influence',
    description: 'Science of persuasion and influence. Covers psychological principles of influence, ethical persuasion tactics, and organizational influence.',
    department: 'OIDD',
    credits: 0.5,
    prerequisites: [],
    offerings: {
      philadelphia: { term: 'T5', professor: 'Cade Massey', slot: 'B', weekends: [0, 1, 2, 3] },
      san_francisco: { term: 'T6', professor: 'Cade Massey', dates: 'Feb 15-18, 2027' },
      global: { term: 'T4', professor: 'Cade Massey', slot: 'C', weekends: [4, 5, 6] }
    }
  },
  'OIDD-6990': {
    code: 'OIDD 6990',
    title: 'AI in Seattle',
    description: 'Immersive exploration of AI innovation in Seattle. Visits to Microsoft, Amazon, and AI startups examining real-world AI applications.',
    department: 'OIDD',
    credits: 0.5,
    prerequisites: [],
    offerings: {
      san_francisco: { term: 'T6', professor: 'Serguei Netessine', dates: 'Mar 8-11, 2027', location: 'Seattle' }
    }
  },
  'OIDD-8970-INDIA': {
    code: 'OIDD 8970-INDIA',
    title: 'Operations & Business in India: From Gandhi to Globalization',
    description: 'Global Modular Course examining operations and business transformation in India.',
    department: 'OIDD',
    credits: 0.5,
    prerequisites: [],
    offerings: {
      philadelphia: { term: 'T4', category: 'GMC', professor: 'Senthil Veeraghavan, Ziv Katalan', dates: 'Dec 29, 2025 - Jan 2, 2026', location: 'India' },
      san_francisco: { term: 'T4', category: 'GMC', professor: 'Senthil Veeraghavan, Ziv Katalan', dates: 'Dec 29, 2025 - Jan 2, 2026', location: 'India' },
      global: { term: 'T4', category: 'GMC', professor: 'Senthil Veeraghavan, Ziv Katalan', dates: 'Dec 29, 2025 - Jan 2, 2026', location: 'India' }
    }
  },
  'OIDD-8970-INDONESIA': {
    code: 'OIDD 8970-INDONESIA',
    title: "Indonesia Rising: Sustainable Growth in ASEAN's Largest Economy",
    description: "Global Modular Course on Indonesia's growth and sustainability challenges.",
    department: 'OIDD',
    credits: 0.5,
    prerequisites: [],
    offerings: {
      philadelphia: { term: 'T4', category: 'GMC', professor: 'Sergei Savin', dates: 'Jan 12-17, 2026', location: 'Indonesia' },
      san_francisco: { term: 'T4', category: 'GMC', professor: 'Sergei Savin', dates: 'Jan 12-17, 2026', location: 'Indonesia' },
      global: { term: 'T4', category: 'GMC', professor: 'Sergei Savin', dates: 'Jan 12-17, 2026', location: 'Indonesia' }
    }
  },
  'OIDD-8970-MEXICO': {
    code: 'OIDD 8970-MEXICO',
    title: "Global Supply Chain Management in Mexico's Industrial Hub",
    description: "Global Modular Course on supply chain management in Mexico's industrial corridor.",
    department: 'OIDD',
    credits: 0.5,
    prerequisites: [],
    offerings: {
      philadelphia: { term: 'T4', category: 'GMC', professor: 'Santiago Gallino', dates: 'Mar 9-13, 2026', location: 'Mexico' },
      san_francisco: { term: 'T4', category: 'GMC', professor: 'Santiago Gallino', dates: 'Mar 9-13, 2026', location: 'Mexico' },
      global: { term: 'T4', category: 'GMC', professor: 'Santiago Gallino', dates: 'Mar 9-13, 2026', location: 'Mexico' }
    }
  },
  'OIDD-8970-TAIWAN-HK': {
    code: 'OIDD 8970-TAIWAN-HK',
    title: 'Technology and Innovation: Role of Taiwan & Hong Kong in the Global Marketplace',
    description: 'Global Modular Course on technology and innovation ecosystems in Taiwan and Hong Kong.',
    department: 'OIDD',
    credits: 0.5,
    prerequisites: [],
    offerings: {
      philadelphia: { term: 'T4', category: 'GMC', professor: 'Senthil Veeraraghavan, Edwin Keh', dates: 'Mar 9-13, 2026', location: 'Taiwan & Hong Kong' },
      san_francisco: { term: 'T4', category: 'GMC', professor: 'Senthil Veeraraghavan, Edwin Keh', dates: 'Mar 9-13, 2026', location: 'Taiwan & Hong Kong' },
      global: { term: 'T4', category: 'GMC', professor: 'Senthil Veeraraghavan, Edwin Keh', dates: 'Mar 9-13, 2026', location: 'Taiwan & Hong Kong' }
    }
  },
  'OIDD-XXX2-NIGERIA': {
    code: 'OIDD XXX2-NIGERIA',
    title: "Nigeria: Innovation and Growth in West Africa's Largest Economy",
    description: 'Global Modular Course on innovation and growth in Nigeria.',
    department: 'OIDD',
    credits: 0.5,
    prerequisites: [],
    offerings: {
      philadelphia: { term: 'T4', category: 'GMC', professor: 'Hummy Song, Eric Kacou', dates: 'May 4-8, 2026', location: 'Nigeria' },
      san_francisco: { term: 'T4', category: 'GMC', professor: 'Hummy Song, Eric Kacou', dates: 'May 4-8, 2026', location: 'Nigeria' },
      global: { term: 'T4', category: 'GMC', professor: 'Hummy Song, Eric Kacou', dates: 'May 4-8, 2026', location: 'Nigeria' }
    }
  },

  // LEGAL STUDIES
  'LGST-6420': {
    code: 'LGST 6420',
    title: 'Big Data, Big Responsibilities, Toward Accountable AI',
    description: 'Legal and ethical frameworks for AI and big data. Covers privacy, algorithmic accountability, AI regulation, and responsible innovation.',
    department: 'LGST',
    credits: 0.5,
    prerequisites: [],
    offerings: {
      san_francisco: { term: 'T5', professor: 'Kevin Werbach', dates: 'Fall 2026 (TBD)' }
    }
  },
  'LGST-7500': {
    code: 'LGST 7500',
    title: 'Global (Anti-)Money Laundering',
    description: 'Financial crime and compliance frameworks. Covers AML regulations, sanctions, financial intelligence, and compliance program design.',
    department: 'LGST',
    credits: 0.5,
    prerequisites: [],
    offerings: {
      philadelphia: { term: 'T6', professor: 'Peter Conti-Brown', slot: 'A', weekends: [0, 1, 2, 3] }
    }
  },
  'LGST-7500-BW': {
    code: 'LGST 7500',
    title: 'Global (Anti-)Money Laundering (Block Week)',
    description: 'Intensive version covering financial crime and compliance frameworks, AML regulations, sanctions, and compliance program design.',
    department: 'LGST',
    credits: 0.5,
    prerequisites: [],
    offerings: {
      philadelphia: { term: 'T5', professor: 'Peter Conti-Brown', dates: 'Oct 12-15, 2026' }
    }
  },
  'LGST-XXXX': {
    code: 'LGST XXXX',
    title: 'Corrupted Information',
    description: 'Misinformation, disinformation, and their business impacts. Covers information integrity, social media dynamics, and organizational responses.',
    department: 'LGST',
    credits: 0.5,
    prerequisites: [],
    offerings: {
      philadelphia: { term: 'T4', professor: 'Nina Strohminger', dates: 'Jun 15-18, 2026' }
    }
  },
  'LGST-8060': {
    code: 'LGST 8060',
    title: 'Negotiations',
    description: 'Comprehensive negotiation course covering theory and practice. Includes simulations, deal-making, dispute resolution, and cross-cultural negotiations.',
    department: 'LGST',
    credits: 1.0,
    prerequisites: [],
    offerings: {
      philadelphia: {
        term: 'T6',
        professor: 'Nazli Bhatia',
        slot: 'A,A',
        weekends: [0, 1, 2, 3, 4, 5, 6, 7],
        evaluations: {
          instructorQuality: 3.40,
          courseQuality: 3.32
        }
      },
      san_francisco: {
        term: 'T6',
        professor: 'Mori Taheripour',
        slot: 'A,A',
        weekends: [0, 1, 2, 3, 4, 5, 6, 7],
        evaluations: {
          instructorQuality: 3.21,
          courseQuality: 3.22
        }
      },
      global: {
        term: 'T4',
        professor: 'Nazli Bhatia',
        slot: 'C,C',
        weekends: [0, 1, 2, 3, 4, 5, 6, 7],
        evaluations: {
          instructorQuality: 3.40,
          courseQuality: 3.32
        }
      }
    }
  },
  'LGST-8090': {
    code: 'LGST 8090',
    title: 'Sports Business Management',
    description: 'Business of professional and collegiate sports. Covers league economics, media rights, franchise valuations, and sports marketing.',
    department: 'LGST',
    credits: 0.5,
    prerequisites: [],
    offerings: {
      san_francisco: { term: 'T4', professor: 'Rob DiGisi', dates: 'Aug 3-6, 2026' }
    }
  },
  'LGST-8130': {
    code: 'LGST 8130',
    title: 'Legal and Transactional Aspects of Entrepreneurship',
    description: 'Legal considerations for entrepreneurs. Covers entity formation, IP protection, employment law, contracts, and regulatory compliance.',
    department: 'LGST',
    credits: 0.5,
    prerequisites: [],
    offerings: {
      philadelphia: { term: 'T4', professor: 'Bob Borghese', slot: 'C', weekends: [4, 5, 6] }
    }
  },
  'LGST-8980-BRAZIL': {
    code: 'LGST 8980-BRAZIL',
    title: 'Brazil: The Business, Politics, and Institutions of (Uneven) Economic Development',
    description: "Global Modular Course on Brazil's business environment, political economy, and institutions.",
    department: 'LGST',
    credits: 0.5,
    prerequisites: [],
    offerings: {
      philadelphia: { term: 'T4', category: 'GMC', professor: 'Peter Conti-Brown', dates: 'Jan 12-16, 2026', location: 'Brazil' },
      san_francisco: { term: 'T4', category: 'GMC', professor: 'Peter Conti-Brown', dates: 'Jan 12-16, 2026', location: 'Brazil' },
      global: { term: 'T4', category: 'GMC', professor: 'Peter Conti-Brown', dates: 'Jan 12-16, 2026', location: 'Brazil' }
    }
  },
  'LGST-8980-VIETNAM': {
    code: 'LGST 8980-VIETNAM',
    title: 'Vietnam: Anticipating Business in an Emerging Socialist Country',
    description: "Global Modular Course on Vietnam's evolving economy and business landscape. Cross-listed with OIDD 8970.",
    department: 'LGST',
    credits: 0.5,
    prerequisites: [],
    offerings: {
      philadelphia: { term: 'T4', category: 'GMC', professor: 'Philip Nichols, Edwin Keh', dates: 'Jan 12-16, 2026', location: 'Vietnam' },
      san_francisco: { term: 'T4', category: 'GMC', professor: 'Philip Nichols, Edwin Keh', dates: 'Jan 12-16, 2026', location: 'Vietnam' },
      global: { term: 'T4', category: 'GMC', professor: 'Philip Nichols, Edwin Keh', dates: 'Jan 12-16, 2026', location: 'Vietnam' }
    }
  },
  'LGST-8980-THAILAND': {
    code: 'LGST 8980-THAILAND',
    title: 'Thailand: Disruptive Technology, Innovation & Sustainability',
    description: 'Global Modular Course on technology, innovation, and sustainability in Thailand. Cross-listed with OIDD 8970.',
    department: 'LGST',
    credits: 0.5,
    prerequisites: [],
    offerings: {
      philadelphia: { term: 'T4', category: 'GMC', professor: 'Janice Bellace, Sergei Savin', dates: 'Mar 9-13, 2026', location: 'Thailand' },
      san_francisco: { term: 'T4', category: 'GMC', professor: 'Janice Bellace, Sergei Savin', dates: 'Mar 9-13, 2026', location: 'Thailand' },
      global: { term: 'T4', category: 'GMC', professor: 'Janice Bellace, Sergei Savin', dates: 'Mar 9-13, 2026', location: 'Thailand' }
    }
  },
  'LGST-8980-CHINA': {
    code: 'LGST 8980-CHINA',
    title: 'Tech and AI in China',
    description: 'Global Modular Course on technology and AI in China, covering innovation ecosystems and policy context.',
    department: 'LGST',
    credits: 0.5,
    prerequisites: [],
    offerings: {
      philadelphia: { term: 'T4', category: 'GMC', professor: 'Kevin Werbach', dates: 'May 4-8, 2026', location: 'China' },
      san_francisco: { term: 'T4', category: 'GMC', professor: 'Kevin Werbach', dates: 'May 4-8, 2026', location: 'China' },
      global: { term: 'T4', category: 'GMC', professor: 'Kevin Werbach', dates: 'May 4-8, 2026', location: 'China' }
    }
  },
  'LGST-8980-SOUTH-AFRICA': {
    code: 'LGST 8980-SOUTH-AFRICA',
    title: 'South Africa: The Role of Business in Societal Opportunity',
    description: 'Global Modular Course exploring business and societal opportunity in South Africa. Cross-listed with MGMT 8980.',
    department: 'LGST',
    credits: 0.5,
    prerequisites: [],
    offerings: {
      philadelphia: { term: 'T4', category: 'GMC', professor: 'Kenneth Shropshire, Eric Kacou', dates: 'Mar 9-13, 2026', location: 'South Africa' },
      san_francisco: { term: 'T4', category: 'GMC', professor: 'Kenneth Shropshire, Eric Kacou', dates: 'Mar 9-13, 2026', location: 'South Africa' },
      global: { term: 'T4', category: 'GMC', professor: 'Kenneth Shropshire, Eric Kacou', dates: 'Mar 9-13, 2026', location: 'South Africa' }
    }
  },

  // HEALTH CARE MANAGEMENT
  'HCMG-8410': {
    code: 'HCMG 8410',
    title: 'Healthcare Services System',
    description: 'Overview of the US healthcare system. Covers providers, payers, regulators, and the economic and policy forces shaping healthcare delivery.',
    department: 'HCMG',
    credits: 0.5,
    prerequisites: [],
    offerings: {
      philadelphia: { term: 'T4', professor: 'Robert Burns', dates: 'Jun 15-18, 2026' }
    }
  },
  'HCMG-8450': {
    code: 'HCMG 8450',
    title: 'US Payer Provider Strategy',
    description: 'Strategic dynamics between healthcare payers and providers. Covers reimbursement models, network strategies, and value-based care.',
    department: 'HCMG',
    credits: 0.5,
    prerequisites: ['HCMG-8410'],
    offerings: {
      philadelphia: { term: 'T6', professor: 'Robert Burns', slot: 'B', weekends: [0, 1, 2, 3] }
    }
  },
  'HCMG-8500': {
    code: 'HCMG 8500',
    title: 'Health Care Reform',
    description: 'Policy analysis of healthcare reform efforts. Covers ACA, Medicare/Medicaid policy, single-payer proposals, and international comparisons.',
    department: 'HCMG',
    credits: 0.5,
    prerequisites: [],
    offerings: {
      san_francisco: { term: 'T6', professor: 'Ezekiel Emanuel', dates: 'Spring 2027 (TBD)' }
    }
  },
  'HCMG-8520': {
    code: 'HCMG 8520',
    title: 'Health Care Services Delivery',
    description: 'Operations and management of healthcare delivery organizations. Covers hospital management, physician practices, and care coordination.',
    department: 'HCMG',
    credits: 0.5,
    prerequisites: [],
    offerings: {
      philadelphia: { term: 'T4', professor: 'Guy David', slot: 'C', weekends: [4, 5, 6] },
      san_francisco: { term: 'T4', professor: 'Guy David', slot: 'A', weekends: [0, 1, 2, 3] }
    }
  },
  'HCMG-8590': {
    code: 'HCMG 8590',
    title: 'Comparative Health Care Systems',
    description: 'Analysis of healthcare systems across countries. Covers universal coverage models, cost containment approaches, and lessons for the US.',
    department: 'HCMG',
    credits: 0.5,
    prerequisites: [],
    offerings: {
      philadelphia: { term: 'T4', professor: 'Claudio Lucarelli', slot: 'C', weekends: [4, 5, 6] }
    }
  },
  'HCMG-8600': {
    code: 'HCMG 8600',
    title: 'Leading Healthcare Organizations',
    description: 'Leadership challenges specific to healthcare. Covers change management, quality improvement, and leading healthcare professionals.',
    department: 'HCMG',
    credits: 0.5,
    prerequisites: [],
    offerings: {
      philadelphia: { term: 'T5', professor: 'Ingrid Nembhard', dates: 'Nov 30 - Dec 3, 2026' }
    }
  },
  'HCMG-8670': {
    code: 'HCMG 8670',
    title: 'Healthcare Entrepreneurship',
    description: 'Starting and growing healthcare ventures. Covers digital health, medical devices, healthcare services startups, and regulatory pathways.',
    department: 'HCMG',
    credits: 0.5,
    prerequisites: ['MGMT-8010'],
    offerings: {
      philadelphia: { term: 'T5', professor: 'Stephen Sammut', slot: 'B', weekends: [0, 1, 2, 3] }
    }
  },
  'HCMG-8980-ROMANIA-SWEDEN': {
    code: 'HCMG 8980-ROMANIA-SWEDEN',
    title: 'Universal Health Care in Romania and Sweden',
    description: 'Global Modular Course comparing universal health systems in Romania and Sweden.',
    department: 'HCMG',
    credits: 0.5,
    prerequisites: [],
    offerings: {
      philadelphia: { term: 'T4', category: 'GMC', professor: 'Guy David', dates: 'May 25-29, 2026', location: 'Sweden, Romania' },
      san_francisco: { term: 'T4', category: 'GMC', professor: 'Guy David', dates: 'May 25-29, 2026', location: 'Sweden, Romania' },
      global: { term: 'T4', category: 'GMC', professor: 'Guy David', dates: 'May 25-29, 2026', location: 'Sweden, Romania' }
    }
  },

  // STATISTICS
  'STAT-7220': {
    code: 'STAT 7220',
    title: 'Predictive Analytics',
    description: 'Building predictive models for business applications. Covers supervised learning, model selection, validation, and interpretation of predictions.',
    department: 'STAT',
    credits: 0.5,
    prerequisites: ['STAT-6130'],
    offerings: {
      san_francisco: { term: 'T5', professor: 'Bob Stine', slot: 'C', weekends: [4, 5, 6] }
    }
  },
  'STAT-7230': {
    code: 'STAT 7230',
    title: 'Applied Machine Learning in Business',
    description: 'Comprehensive machine learning for business problems. Covers classification, regression, clustering, NLP basics, and ML deployment.',
    department: 'STAT',
    credits: 1.0,
    prerequisites: ['STAT-6130'],
    offerings: {
      global: { term: 'T6', professor: 'Bob Stine', slot: 'A,A', weekends: [0, 1, 2, 3, 4] }
    }
  },
  'STAT-7250': {
    code: 'STAT 7250',
    title: 'Sports and Gaming Analytics',
    description: 'Statistical analysis in sports and gaming contexts. Covers player evaluation, game theory, sports betting markets, and esports analytics.',
    department: 'STAT',
    credits: 0.5,
    prerequisites: ['STAT-6130'],
    offerings: {
      philadelphia: { term: 'T6', professor: 'Adi Wyner', dates: 'May 3-6, 2027' }
    }
  },

  // REAL ESTATE
  'REAL-7210': {
    code: 'REAL 7210',
    title: 'Real Estate Investments',
    description: 'Analysis of real estate as an investment asset. Covers property valuation, REITs, commercial real estate, and real estate finance.',
    department: 'REAL',
    credits: 0.5,
    prerequisites: ['FNCE-6110'],
    offerings: {
      philadelphia: {
        term: 'T5',
        professor: 'Todd Sinai',
        slot: 'C',
        weekends: [4, 5, 6],
        evaluations: {
          instructorQuality: 3.09,
          courseQuality: 2.91
        }
      },
      san_francisco: {
        term: 'T6',
        professor: 'Todd Sinai',
        slot: 'B',
        weekends: [0, 1, 2, 3],
        evaluations: {
          instructorQuality: 3.09,
          courseQuality: 2.91
        }
      }
    }
  },
  'REAL-8910': {
    code: 'REAL 8910',
    title: 'Real Estate Entrepreneurship',
    description: 'Starting and growing real estate ventures. Covers development, property management, real estate technology, and raising capital.',
    department: 'REAL',
    credits: 0.5,
    prerequisites: [],
    offerings: {
      philadelphia: { term: 'T4', professor: 'Bob Chalfin', dates: 'Jun 15-18, 2026' }
    }
  },

  // ACCOUNTING
  'ACCT-7471': {
    code: 'ACCT 7471',
    title: 'Financial Disclosure Analytics',
    description: 'Analyzing financial statements and disclosures. Covers earnings quality, accounting red flags, and using financial data for investment decisions.',
    department: 'ACCT',
    credits: 0.5,
    prerequisites: ['ACCT-6130'],
    offerings: {
      philadelphia: {
        term: 'T5',
        professor: 'Brian Bushee',
        slot: 'C',
        weekends: [4, 5, 6],
        evaluations: {
          instructorQuality: 3.74,
          courseQuality: 3.74,
          instructorCommunication: 3.63,
          instructorStimulateInterest: 3.56,
          instructorAccessibility: 3.64,
          valueOfReadings: 3.54,
          knowledgeLearned: 3.63,
          courseDifficulty: 2.38,
          workRequired: 2.06,
          recommendToMajor: 3.50,
          recommendToNonMajor: 3.25
        }
      },
      san_francisco: {
        term: 'T6',
        professor: 'Brian Bushee',
        slot: 'C',
        weekends: [4, 5, 6],
        evaluations: {
          instructorQuality: 3.74,
          courseQuality: 3.74,
          instructorCommunication: 3.63,
          instructorStimulateInterest: 3.56,
          instructorAccessibility: 3.64,
          valueOfReadings: 3.54,
          knowledgeLearned: 3.63,
          courseDifficulty: 2.38,
          workRequired: 2.06,
          recommendToMajor: 3.50,
          recommendToNonMajor: 3.25
        }
      }
    }
  }
};

// Majors with requirements
const MAJORS = {
  finance: {
    id: 'finance',
    name: 'Finance',
    department: 'FNCE',
    requiredCUs: 6.0,
    stemCertified: true,
    description: 'Comprehensive study of corporate finance, investments, and financial markets.',
    coreRequirements: ['FNCE-6110', 'FNCE-6130'],
    electiveCUs: 4.0,
    electiveCourses: [
      'ACCT-7471',
      'FNCE-7030', 'FNCE-7050', 'FNCE-7070', 'FNCE-7170', 'FNCE-7310', 'FNCE-7320',
      'FNCE-7380', 'FNCE-7401', 'FNCE-7500', 'FNCE-7510', 'FNCE-7540', 'FNCE-7910',
      'FNCE-8010', 'FNCE-8960', 'REAL-7210'
    ],
    warnings: ['Must take FNCE 6110 (1.0 CU) in Term 3 - the 0.5 CU option (FNCE 6210) does not qualify'],
    restrictions: ['Cannot declare both Finance and Quantitative Finance majors']
  },
  ai_business: {
    id: 'ai_business',
    name: 'Artificial Intelligence in Business',
    department: 'OIDD',
    requiredCUs: 4.0,
    stemCertified: true,
    description: 'Explore AI foundations and business impact, spanning analytics, ethics, and strategy.',
    coreRequirements: [],
    electiveCUs: 4.0,
    electiveCourses: ['LGST-6420', 'MGMT-7310', 'MKTG-7120', 'MKTG-7340', 'MKTG-7790', 'OIDD-6620', 'OIDD-6670', 'STAT-7230'],
    warnings: ['AI major typically requires STAT 7230 and LGST 6420 plus additional pillar courses. Confirm requirements with your advisor.'],
    restrictions: []
  },
  marketing_operations: {
    id: 'marketing_operations',
    name: 'Marketing & Operational Management (M&O)',
    department: 'MKTG',
    requiredCUs: 7.0,
    stemCertified: false,
    description: 'Joint major integrating marketing and operations with required core, research, and elective coursework.',
    coreRequirements: [],
    electiveCUs: 4.0,
    requirements: {
      marketingCore: {
        requiredCredits: 1.0,
        requiredCourses: ['MKTG-6110'],
        oneOfCourses: ['MKTG-6120', 'MKTG-6130']
      },
      oiddCore: {
        requiredCredits: 1.0,
        courses: ['OIDD-6110', 'OIDD-6120', 'OIDD-6130', 'OIDD-6140', 'OIDD-6150', 'OIDD-6620', 'OIDD-6900']
      },
      marketingResearch: {
        requiredCredits: 1.0,
        oneOfCourses: ['MKTG-7120', 'MKTG-7710', 'MKTG-7760', 'MKTG-8090'],
        pairedCourses: [['MKTG-9400', 'MKTG-9410'], ['MKTG-9420', 'MKTG-9430']]
      },
      electives: {
        requiredCredits: 4.0,
        minDeptCredits: { MKTG: 1.0, OIDD: 2.0 },
        eligibleDepartments: ['MKTG', 'OIDD'],
        eligibleOutsideDepartments: ['LGST-8060', 'MGMT-6910', 'LGST-8980-VIETNAM', 'LGST-8980-THAILAND'],
        deptOverrides: {
          'LGST-8980-VIETNAM': 'OIDD',
          'LGST-8980-THAILAND': 'OIDD'
        }
      }
    },
    electiveCourses: [
      'LGST-8060', 'MGMT-6910', 'LGST-8980-VIETNAM', 'LGST-8980-THAILAND',
      'MKTG-7110', 'MKTG-7120', 'MKTG-7710', 'MKTG-7760', 'MKTG-8090', 'MKTG-9400', 'MKTG-9410', 'MKTG-9420', 'MKTG-9430',
      'MKTG-7340', 'MKTG-7540', 'MKTG-7770', 'MKTG-7770-BW', 'MKTG-7780', 'MKTG-7790',
      'MKTG-8500', 'MKTG-8530', 'MKTG-8970', 'MKTG-8960-SAUDI', 'MKTG-8960-KOREA', 'MKTG-XXXX',
      'OIDD-6120', 'OIDD-6140', 'OIDD-6360', 'OIDD-6530', 'OIDD-6540', 'OIDD-6620', 'OIDD-6670', 'OIDD-6920', 'OIDD-6930', 'OIDD-6990',
      'OIDD-8970-INDIA', 'OIDD-8970-INDONESIA', 'OIDD-8970-MEXICO', 'OIDD-8970-TAIWAN-HK', 'OIDD-XXX2-NIGERIA'
    ],
    warnings: [
      'Requires Marketing core (MKTG 6110 + MKTG 6120/6130), OIDD core (1.0 CU from flex-core list), and a Marketing research course.',
      'Electives must total 4.0 CU with at least 1.0 CU from MKTG and 2.0 CU from OIDD.'
    ],
    restrictions: []
  },
  marketing: {
    id: 'marketing',
    name: 'Marketing',
    department: 'MKTG',
    requiredCUs: 5.0,
    stemCertified: false,
    description: 'Develop expertise in marketing strategy, consumer behavior, and brand management.',
    coreRequirements: ['MKTG-6110'],
    electiveCUs: 4.0,
    electiveCourses: ['MKTG-7110', 'MKTG-7120', 'MKTG-7340', 'MKTG-7540', 'MKTG-7760', 'MKTG-7770', 'MKTG-7770-BW', 'MKTG-7780', 'MKTG-7790', 'MKTG-8500', 'MKTG-8530'],
    warnings: ['WEMBA majors include Marketing & Operational Management (M&O). Consider M&O for official requirements.'],
    restrictions: []
  },
  management: {
    id: 'management',
    name: 'Management',
    department: 'MGMT',
    requiredCUs: 4.0,
    stemCertified: false,
    description: 'Focus on leadership, organizational behavior, and strategic management.',
    coreRequirements: ['MGMT-6100', 'MGMT-6130'],
    electiveCUs: 3.0,
    electiveCourses: [
      'LGST-8060', 'LGST-8090',
      'MGMT-6250', 'MGMT-6910', 'MGMT-7010', 'MGMT-7150', 'MGMT-7210', 'MGMT-7310',
      'MGMT-7640', 'MGMT-7720', 'MGMT-7820', 'MGMT-7930', 'MGMT-7990', 'MGMT-8010',
      'MGMT-8040', 'MGMT-8090', 'MGMT-8110', 'MGMT-8130', 'MGMT-8160', 'MGMT-8310',
      'MGMT-8320', 'MGMT-8710', 'MGMT-XXXX', 'MGMT-XXXX-IMPACT',
      'OIDD-6920',
      'MGMT-8970-INDIA', 'WH-2120', 'MGMT-8970-GERMANY', 'MGMT-8980-SOUTH-AFRICA', 'MGMT-XXX3-LONDON',
      'LGST-8980-SOUTH-AFRICA'
    ],
    warnings: [],
    restrictions: []
  },
  strategic_management: {
    id: 'strategic_management',
    name: 'Strategic Management',
    department: 'MGMT',
    requiredCUs: 4.0,
    stemCertified: false,
    description: 'Develop skills in competitive strategy, corporate development, and technology strategy.',
    coreRequirements: ['MGMT-6100', 'MGMT-6130'],
    electiveCUs: 4.0,
    electiveCourses: [
      'MGMT-6250', 'MGMT-7010', 'MGMT-7150', 'MGMT-7210', 'MGMT-7310', 'MGMT-7820',
      'MGMT-8010', 'MGMT-8110', 'MGMT-8320', 'MGMT-8710', 'MKTG-7770', 'MKTG-7770-BW',
      'OIDD-6360'
    ],
    warnings: [],
    restrictions: []
  },
  entrepreneurship: {
    id: 'entrepreneurship',
    name: 'Entrepreneurship & Innovation',
    department: 'MGMT',
    requiredCUs: 4.0,
    stemCertified: false,
    description: 'Learn to start and grow new ventures.',
    coreRequirements: ['MGMT-8010'],
    electiveCUs: 3.5,
    electiveCourses: [
      'FNCE-7500', 'FNCE-7510', 'HCMG-8670', 'LGST-8060', 'LGST-8130',
      'MGMT-6910', 'MGMT-7210', 'MGMT-7310', 'MGMT-8040', 'MGMT-8090', 'MGMT-8110',
      'MGMT-8160', 'MGMT-8310', 'MGMT-8320', 'MKTG-7340',
      'OIDD-6140', 'OIDD-6360', 'OIDD-6540', 'OIDD-6620', 'OIDD-6670', 'OIDD-6920', 'OIDD-6930',
      'REAL-8910'
    ],
    warnings: ['MGMT 8010 (Entrepreneurship) is required and cannot be waived or substituted'],
    restrictions: []
  },
  operations: {
    id: 'operations',
    name: 'Operations, Information & Decisions',
    department: 'OIDD',
    requiredCUs: 5.0,
    stemCertified: true,
    description: 'Master operations management, analytics, and decision-making.',
    coreRequirements: [],
    electiveCUs: 5.0,
    electiveCourses: ['OIDD-6120', 'OIDD-6140', 'OIDD-6360', 'OIDD-6530', 'OIDD-6540', 'OIDD-6620', 'OIDD-6670', 'OIDD-6920', 'OIDD-6930', 'OIDD-6990'],
    warnings: ['WEMBA majors include Marketing & Operational Management (M&O). Consider M&O for official requirements.'],
    restrictions: []
  },
  healthcare: {
    id: 'healthcare',
    name: 'Health Care Management',
    department: 'HCMG',
    requiredCUs: 3.0,
    stemCertified: false,
    description: 'Prepare for leadership roles in the healthcare industry.',
    coreRequirements: [],
    electiveCUs: 3.0,
    electiveCourses: ['HCMG-8410', 'HCMG-8450', 'HCMG-8500', 'HCMG-8520', 'HCMG-8590', 'HCMG-8600', 'HCMG-8670'],
    warnings: ['Special application required at time of Wharton MBA application'],
    restrictions: []
  },
  real_estate: {
    id: 'real_estate',
    name: 'Real Estate',
    department: 'REAL',
    requiredCUs: 5.0,
    stemCertified: false,
    description: 'Develop expertise in real estate investment, development, and finance.',
    coreRequirements: ['REAL-7210'],
    electiveCUs: 4.0,
    electiveCourses: ['REAL-7210', 'REAL-8910'],
    warnings: [],
    restrictions: []
  },
  business_analytics: {
    id: 'business_analytics',
    name: 'Business Analytics',
    department: 'STAT',
    requiredCUs: 4.0,
    stemCertified: true,
    description: 'Master data analysis and quantitative decision-making.',
    coreRequirements: ['STAT-6130', 'OIDD-6120'],
    electiveCUs: 4.0,
    electiveCourses: ['OIDD-6120', 'STAT-7220', 'STAT-7230', 'STAT-7250', 'ACCT-7471', 'MKTG-7760'],
    warnings: [],
    restrictions: []
  },
  statistics: {
    id: 'statistics',
    name: 'Statistics and Data Science',
    department: 'STAT',
    requiredCUs: 4.0,
    stemCertified: true,
    description: 'Develop advanced statistical and data science skills.',
    coreRequirements: ['STAT-6130'],
    electiveCUs: 4.0,
    electiveCourses: ['STAT-7220', 'STAT-7230', 'STAT-7250'],
    warnings: [],
    restrictions: []
  }
};

// Schedule data
const SCHEDULE = {
  philadelphia: {
    T4: {
      name: 'Summer 2026',
      weekends: [
        'Apr 16-18, 2026',
        'May 22-23, 2026',
        'Jun 5-6, 2026',
        'Jun 19-20, 2026',
        'Jul 16-18, 2026',
        'Jul 30-Aug 1, 2026',
        'Aug 14-15, 2026'
      ]
    },
    T5: {
      name: 'Fall 2026',
      weekends: [
        'Aug 27-29, 2026',
        'Sep 25-26, 2026',
        'Oct 9-10, 2026',
        'Oct 23-24, 2026',
        'Nov 6-7, 2026',
        'Nov 20-21, 2026',
        'Dec 4-5, 2026',
        'Dec 18-19, 2026'
      ]
    },
    T6: {
      name: 'Spring 2027',
      weekends: [
        'Jan 7-9, 2027',
        'Jan 29-30, 2027',
        'Feb 12-13, 2027',
        'Feb 26-27, 2027',
        'Mar 19-20, 2027'
      ]
    }
  },
  san_francisco: {
    T4: {
      name: 'Summer 2026',
      weekends: [
        'May 1-2, 2026',
        'May 15-16, 2026',
        'May 29-30, 2026',
        'Jun 11-13, 2026',
        'Jun 26-27, 2026',
        'Jul 10-11, 2026',
        'Jul 24-25, 2026',
        'Aug 7-8, 2026'
      ]
    },
    T5: {
      name: 'Fall 2026',
      weekends: [
        'Aug 21-22, 2026',
        'Sep 4-5, 2026',
        'Oct 1-3, 2026',
        'Oct 16-17, 2026',
        'Oct 30-31, 2026',
        'Nov 13-14, 2026',
        'Nov 20-21, 2026',
        'Dec 11-12, 2026'
      ]
    },
    T6: {
      name: 'Spring 2027',
      weekends: [
        'Jan 22-23, 2027',
        'Feb 5-6, 2027',
        'Feb 18-20, 2027',
        'Mar 5-6, 2027',
        'Mar 19-20, 2027'
      ]
    }
  },
  global: {
    T4: {
      name: 'Summer 2026',
      weekends: [
        'Apr 30-May 2, 2026',
        'May 14-16, 2026',
        'May 28-30, 2026',
        'Jun 11-13, 2026',
        'Jun 25-27, 2026',
        'Jul 9-11, 2026',
        'Jul 23-25, 2026',
        'Aug 6-8, 2026'
      ]
    },
    T5: {
      name: 'Fall 2026',
      weekends: [
        'Aug 20-22, 2026',
        'Sep 3-5, 2026',
        'Oct 1-3, 2026',
        'Oct 15-17, 2026',
        'Oct 29-31, 2026',
        'Nov 12-14, 2026',
        'Nov 19-21, 2026'
      ]
    },
    T6: {
      name: 'Spring 2027',
      weekends: [
        'Jan 21-23, 2027',
        'Feb 4-6, 2027',
        'Feb 18-20, 2027',
        'Mar 4-6, 2027',
        'Mar 18-20, 2027'
      ]
    }
  }
};

// Waiver options
const WAIVERS = [
  { code: 'FNCE-6110', title: 'Corporate Finance', method: 'Credentials only' },
  { code: 'ACCT-6130', title: 'Financial Accounting', method: 'Credentials or Exam' },
  { code: 'MKTG-6110', title: 'Marketing Management', method: 'Credentials only' },
  { code: 'MKTG-6130', title: 'Marketing Strategy', method: 'Credentials only' },
  { code: 'STAT-6130', title: 'Regression Analysis', method: 'Credentials or Exam' }
];
