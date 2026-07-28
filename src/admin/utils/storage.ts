// Storage utility — localStorage wrapper (swap with Supabase later)

// ── Cache-buster: if stored data version doesn't match, clear stale school data ──
const SCHOOL_DATA_VERSION = 'jojo-sss-v2';
if (localStorage.getItem('school_data_version') !== SCHOOL_DATA_VERSION) {
  ['admin_about', 'admin_contact', 'admin_news', 'admin_activities', 'admin_applications'].forEach((k) =>
    localStorage.removeItem(k)
  );
  localStorage.setItem('school_data_version', SCHOOL_DATA_VERSION);
}

export interface NewsItem {
  id: string;
  title: string;
  content: string;
  image: string;
  date: string;
}

export interface DocumentItem {
  id: string;
  name: string;
  grade: string;
  subject: string;
  fileData: string; // base64 for demo
  fileName: string;
  uploadDate: string;
}

export type UploadedFile = {
  key: string;
  label: string;
  fileName: string;
  mimeType: string;
  dataUrl: string; // base64
};

export type SubjectMark = {
  subject: string;
  mark: number; // 0-100
};

export type LearnerContact = {
  homeTelephone?: string;
  emergencyTelephone?: string;
  learnerCell?: string;
  learnerEmail?: string;
};

export type LearnerParticulars = {
  initials?: string;
  nickName?: string;
  otherNames?: string;
  identificationNumber?: string; // ID / Passport
  citizenship?: string;
  race?: string;
  homeLanguage?: string;
  preferredLanguageOfInstruction?: string;
  physicalAddress?: string;
  citySuburb?: string;
  postalCode?: string;
  province?: string;
  countryOfResidence?: string;
  isBoarder?: 'Yes' | 'No';
  modeOfTransport?: string;
  deceasedParent?: 'Mother' | 'Father' | 'Both' | 'None';
  religion?: string;
  accessionNo?: string;
  highestGradePassed?: string;
  yearWhenGradeWasPassed?: string;
};

export type PreviousSchoolInfo = {
  name?: string;
  address?: string;
  code?: string;
  province?: string;
  country?: string;
};

export type LearnerMedicalInfo = {
  medicalAidNumber?: string;
  medicalAidName?: string;
  medicalAidMainMember?: string;
  doctorName?: string;
  doctorTelephoneNumber?: string;
  doctorAddress?: string;
  medicalCondition?: string;
  specialProblemsRequiringCounselling?: string;
  dexterity?: 'Right Handed' | 'Left Handed' | 'Ambidextrous';
  socialGrant?: { reg?: 'Yes' | 'No'; rec?: 'Yes' | 'No' };
};

export type SiblingInfo = {
  numberOfOtherChildrenAtSchool?: string;
  positionInFamily?: string;
  siblings?: Array<{ name: string; grade: string; positionInFamily?: string }>;
};

export type ParentGuardian = {
  title?: string;
  initials?: string;
  firstName?: string;
  surname?: string;
  gender?: string;
  race?: string;
  homeLanguage?: string;
  identificationNumber?: string; // ID / Passport
  accountPayer?: 'Yes' | 'No';
  residentialStreetAddress?: string;
  citySuburb?: string;
  code?: string;
  employer?: string;
  occupation?: string;
  surnameOfSpouse?: string;
  occupationOfSpouse?: string;
  spouseIdNumber?: string;
  learnerResidesWithThisParent?: 'Yes' | 'No';
  relationshipToLearner?: string;
  maritalStatusOfParent?: string;
};

export type CorrespondenceDetails = {
  title?: string;
  surname?: string;
  postalAddress?: string;
};

export type OtherContactDetails = {
  homeTelephone?: string;
  faxNumber?: string;
  spouseWorkTelephoneNumber?: string;
  emailAddress?: string;
  workTelephone?: string;
  cellNumber?: string;
  spouseCellNumber?: string;
  spouseEmailAddress?: string;
};

export interface Application {
  id: string;

  // Learner (minimum)
  firstName: string;
  lastName: string;
  dob: string;
  gender?: string;
  grade: string;
  year: string;

  // Generated
  studentNumber: string;

  // Legacy parent/guardian fields (keep for backward compatibility)
  guardianName: string;
  guardianRelationship?: string;
  guardianPhone: string;
  guardianEmail: string;

  // Address (legacy)
  address: string;
  locality: string;

  // School history (legacy)
  previousSchool: string;
  lastGradeCompleted?: string;

  // Notes (legacy)
  medicalInfo?: string;

  // New structured fields
  learner?: LearnerParticulars;
  learnerContact?: LearnerContact;
  previousSchoolInfo?: PreviousSchoolInfo;
  learnerMedicalInfo?: LearnerMedicalInfo;
  siblingInfo?: SiblingInfo;
  parentGuardian1?: ParentGuardian;
  parentGuardian2?: ParentGuardian;
  correspondenceDetails?: CorrespondenceDetails;
  otherContactDetails?: OtherContactDetails;

  applicationType: 'General';

  // Uploads
  uploads: UploadedFile[];

  // Academic report capture (manual entry for now)
  subjectMarks: SubjectMark[];
  averageMark: number;

  status: 'Pending' | 'Reviewed' | 'Accepted' | 'Rejected';
  submittedDate: string;
}

export interface ContactInfo {
  address: string;
  phone: string;
  email: string;
  monThu: string;
  friday: string;
  weekend: string;
}

export interface AboutInfo {
  historyParagraphs: string[];
  principalName: string;
  principalTitle: string;
  principalMessage: string[];
}

export interface Activity {
  id: string;
  name: string;
  description: string;
  category: string;
  image: string;
}

export interface AchieverEntry {
  id: string;
  name: string;
  achievement: string;
  image: string;
}

export interface HallOfFameEntry {
  id: string;
  name: string;
  title: string;
  year: string;
  desc: string;
  image: string;
}

export interface YearResults {
  overall: number;
  bachelor: number;
  bachelorRate: number;
  distinctions: number;
  wrote: number;
  subjects: { subject: string; rate: number }[];
}

function getItems<T>(key: string): T[] {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function setItems<T>(key: string, items: T[]): void {
  localStorage.setItem(key, JSON.stringify(items));
}

function getObject<T>(key: string, fallback: T): T {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch {
    return fallback;
  }
}

function setObject<T>(key: string, obj: T): void {
  localStorage.setItem(key, JSON.stringify(obj));
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

function padNumber(num: number, length: number) {
  return num.toString().padStart(length, '0');
}

export function generateStudentNumber(year: string): string {
  // Example: 2027-000001
  const key = `admin_student_counter_${year}`;
  const current = Number(localStorage.getItem(key) || '0');
  const next = current + 1;
  localStorage.setItem(key, String(next));
  return `${year}-${padNumber(next, 6)}`;
}

export function calculateAverageMark(subjectMarks: SubjectMark[]): number {
  if (!subjectMarks || subjectMarks.length === 0) return 0;
  const total = subjectMarks.reduce((sum, s) => sum + (Number.isFinite(s.mark) ? s.mark : 0), 0);
  return Math.round((total / subjectMarks.length) * 10) / 10;
}

// News
const defaultNews: NewsItem[] = [
  {
    id: '1',
    title: '2027 Admissions Open',
    date: '01 Apr 2026',
    content:
      'Applications for Grade 8 admission for the 2027 academic year are now open. Apply online or download the application form from the Admissions page.',
    image: '',
  },
  {
    id: '2',
    title: 'Term 1 Parents Meeting',
    date: '15 Apr 2026',
    content:
      'Parents and guardians are invited to a Term 1 feedback meeting. Time and venue will be confirmed by the school.',
    image: '',
  },
];
export const getNews = () => (getItems<NewsItem>('admin_news').length ? getItems<NewsItem>('admin_news') : defaultNews);
export const setNews = (items: NewsItem[]) => setItems('admin_news', items);

// Documents
export const getDocuments = () => getItems<DocumentItem>('admin_documents');
export const setDocuments = (items: DocumentItem[]) => setItems('admin_documents', items);

// Applications
export const getApplications = () => getItems<Application>('admin_applications');
export const setApplications = (items: Application[]) => setItems('admin_applications', items);

// Contact
const defaultContact: ContactInfo = {
  address: 'Dundee Area, Mount Ayliff, Eastern Cape 4735\nP.O. Box 58, Mount Ayliff, 4735',
  phone: '039 940 4284 / 072 349 3647',
  email: 'jojos.s.school@gmail.com',
  monThu: '07:30 - 15:30',
  friday: '07:30 - 15:30',
  weekend: 'Closed',
};
export const getContact = () => getObject<ContactInfo>('admin_contact', defaultContact);
export const setContact = (info: ContactInfo) => setObject('admin_contact', info);

// About
const defaultAbout: AboutInfo = {
  historyParagraphs: [
    'Jojo Senior Secondary School is a public no-fee school located in the Dundee Area of Mount Ayliff, Eastern Cape. The school falls under the Alfred Nzo West Education District and serves the local community with dedication and pride.',
    'Guided by the motto "The Sky Is The Limit", Jojo SSS is committed to excellence in teaching and learning, building strong working relationships among teachers, parents and learners, and providing a welcoming atmosphere to all stakeholders.',
    'The school offers Grades 8 to 12 with three streams per grade (A, B and C). With 46 educators, Jojo SSS provides a comprehensive curriculum including Science, Business/Commerce and Humanities streams in the FET phase.',
  ],
  principalName: 'Mr W.T. Mnganyana',
  principalTitle: 'Principal',
  principalMessage: [
    'Welcome to Jojo Senior Secondary School. We are committed to excellence in everything we do so that our learners become responsible citizens.',
    'We strive to create an environment that is conducive for teaching and learning, to build good working relations between teachers, parents and learners, and to provide a welcoming atmosphere to all stakeholders visiting the school.',
    'Together we reach for the sky.',
  ],
};
export const getAbout = () => getObject<AboutInfo>('admin_about', defaultAbout);
export const setAbout = (info: AboutInfo) => setObject('admin_about', info);

// Activities
const defaultActivities: Activity[] = [
  { id: '1', name: 'Soccer', category: 'Sport', description: 'Training and competition at school and district level.', image: '' },
  { id: '2', name: 'Netball', category: 'Sport', description: 'Competitive teams across age groups.', image: '' },
  { id: '3', name: 'Athletics', category: 'Sport', description: 'Track and field development and competition.', image: '' },
  { id: '4', name: 'Debating', category: 'Academic', description: 'Building critical thinking and communication skills.', image: '' },
  { id: '5', name: 'Choir', category: 'Culture', description: 'Music and performance for school events and competitions.', image: '' },
];
export const getActivities = () =>
  getItems<Activity>('admin_activities').length ? getItems<Activity>('admin_activities') : defaultActivities;
export const setActivities = (items: Activity[]) => setItems('admin_activities', items);

// Achievers by year
export const getAchieversByYear = (year: string) => getItems<AchieverEntry>(`admin_achievers_${year}`);
export const setAchieversByYear = (year: string, items: AchieverEntry[]) => setItems(`admin_achievers_${year}`, items);

// Hall of Fame
const defaultHall: HallOfFameEntry[] = [
  { id: '1', name: 'Mrhwebi Esam', title: 'Top Achiever', year: '2025', desc: '', image: '/assets/achievements/mrhwebi-esam.jpg' },
  { id: '2', name: 'Dlungwana Kungawo', title: 'Top Achiever', year: '2024', desc: '', image: '/assets/achievements/dlungwana-kungawo.jpg' },
  { id: '3', name: 'Mhloleli Mbali', title: 'Top Achiever', year: '2023', desc: '', image: '/assets/achievements/mhloleli-mbali.jpg' },
  { id: '4', name: 'Gwanya Mcoseleli', title: 'Top Achiever', year: '2023', desc: '', image: '/assets/achievements/gwanya-mcoseleli.jpg' },
];
export const getHallOfFame = () =>
  getItems<HallOfFameEntry>('admin_hall_of_fame').length ? getItems<HallOfFameEntry>('admin_hall_of_fame') : defaultHall;
export const setHallOfFame = (items: HallOfFameEntry[]) => setItems('admin_hall_of_fame', items);

// Results by year
const defaultResults: Record<string, YearResults> = {
  '2025': {
    overall: 93.7,
    bachelor: 165,
    bachelorRate: 58,
    distinctions: 145,
    wrote: 285,
    subjects: [],
  },
  '2024': {
    overall: 0,
    bachelor: 0,
    bachelorRate: 0,
    distinctions: 0,
    wrote: 0,
    subjects: [],
  },
  '2023': {
    overall: 0,
    bachelor: 0,
    bachelorRate: 0,
    distinctions: 0,
    wrote: 0,
    subjects: [],
  },
};
export const getResultsByYear = (year: string) =>
  getObject<YearResults | null>(`admin_results_${year}`, defaultResults[year] || null);
export const setResultsByYear = (year: string, data: YearResults) => setObject(`admin_results_${year}`, data);

// ── Shared hashing helper ──────────────────────────────────────────────────────

async function sha256(input: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

// ── Admin User Management ──────────────────────────────────────────────────────

export type AdminUser = {
  username: string;
  name: string;
  role: string;
  passwordHash?: string;
  requiresSetup: boolean;
};

const ADMIN_USERS_KEY = 'jojo_admin_users';
const ADMIN_CURRENT_KEY = 'jojo_admin_current_user';

export const getAdminUsers = (): AdminUser[] => getItems<AdminUser>(ADMIN_USERS_KEY);

export async function seedAdminUsers(): Promise<void> {
  if (getAdminUsers().length > 0) return;

  // A maintenance account with a known password so Age Thirty4 support can access.
  const age34Hash = await sha256('AgeJojo#26');

  const defaults: AdminUser[] = [
    { username: 'principal', name: 'Principal', role: 'Principal', requiresSetup: true },
    { username: 'curriculum-deputy', name: 'Curriculum Deputy Principal', role: 'Deputy Principal', requiresSetup: true },
    { username: 'finance-deputy', name: 'Finance Deputy Principal', role: 'Deputy Principal', requiresSetup: true },
    { username: 'admin', name: 'School Administrator', role: 'Administrator', requiresSetup: true },
    { username: 'sciences-maths', name: 'Sciences & Maths HOD', role: 'HOD', requiresSetup: true },
    { username: 'age34', name: 'Age34', role: 'Maintenance', passwordHash: age34Hash, requiresSetup: false },
  ];

  setItems(ADMIN_USERS_KEY, defaults);
}

export const getCurrentAdmin = (): AdminUser | null => {
  try {
    const raw = localStorage.getItem(ADMIN_CURRENT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const setCurrentAdmin = (user: AdminUser | null): void => {
  if (user) {
    localStorage.setItem(ADMIN_CURRENT_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(ADMIN_CURRENT_KEY);
  }
};

export const isAuthenticated = (): boolean => !!getCurrentAdmin();

export const logout = (): void => {
  localStorage.removeItem(ADMIN_CURRENT_KEY);
};

export async function login(
  username: string,
  password: string
): Promise<{ success: boolean; requiresSetup?: boolean; user?: AdminUser }> {
  await seedAdminUsers();
  const users = getAdminUsers();
  const user = users.find((u) => u.username === username);
  if (!user) return { success: false };

  if (user.requiresSetup && !user.passwordHash) {
    return { success: false, requiresSetup: true, user };
  }

  if (!user.passwordHash) return { success: false };

  const hash = await sha256(password);
  if (hash === user.passwordHash) {
    setCurrentAdmin(user);
    return { success: true, user };
  }

  return { success: false };
}

export async function setAdminPassword(username: string, password: string): Promise<void> {
  const users = getAdminUsers();
  const idx = users.findIndex((u) => u.username === username);
  if (idx === -1) return;
  const hash = await sha256(password);
  users[idx] = { ...users[idx], passwordHash: hash, requiresSetup: false };
  setItems(ADMIN_USERS_KEY, users);
}
