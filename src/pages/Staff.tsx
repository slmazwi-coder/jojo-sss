import React from 'react';
import { User } from 'lucide-react';

interface StaffMember {
  name: string;
  position: string;
  subject?: string;
  categories: string[];
  image?: string;
  imgPosition?: string;
  classTeacherFor?: string;
  supportOrder?: number;
  departmentHead?: string;
}

const streamIndex: Record<string, number> = { A: 0, B: 1, C: 2 };

function classOrder(cls?: string): number {
  if (!cls) return -1;
  const grade = parseInt(cls, 10);
  const stream = cls.replace(/^\d+/, '');
  const streamRank = streamIndex[stream] ?? 9;
  return grade * 10 + streamRank;
}

const staffData: StaffMember[] = [
  // ── School Management ─────────────────────────────────────────────────────
  {
    name: 'Mr W.T. Mnganyana',
    position: 'Principal',
    categories: ['School Management'],
    image: './assets/staff/mr-mganyana.jpg',
    imgPosition: 'center 50%',
  },
  {
    name: 'Mr B. Mamfengu',
    position: 'Deputy Principal',
    subject: 'Physical Sciences (Grades 10 & 12)',
    categories: ['School Management', 'Subject Teachers'],
    image: './assets/staff/mr-b-mamfengu.jpg',
    imgPosition: 'center center',
  },
  {
    name: 'Mr R. K Qangule',
    position: 'Deputy Principal',
    subject: 'Mathematics',
    categories: ['School Management', 'Subject Teachers'],
    image: './assets/staff/mr-rk-qangule.jpg',
    imgPosition: 'center 25%',
  },

  // ── Class Teachers (also listed under Subject Teachers) ───────────────────
  {
    name: 'Mr Mdingi A',
    position: 'Class Teacher — Grade 10A',
    subject: 'Mathematics — Grade 10A',
    categories: ['Class Teachers', 'Subject Teachers'],
    classTeacherFor: '10A',
    image: './assets/staff/mr-mdi-a.jpg',
    imgPosition: 'center 0%',
  },
  {
    name: 'Miss Ndzelu',
    position: 'Class Teacher — Grade 11B',
    subject: 'Economics — Grade 11B',
    categories: ['Class Teachers', 'Subject Teachers'],
    classTeacherFor: '11B',
    image: './assets/staff/miss-ndzelu.jpg',
    imgPosition: 'center 25%',
  },
  {
    name: 'Ms N Reid-Magongo',
    position: 'Class Teacher — Grade 11C',
    subject: 'IsiXhosa — Grade 11C',
    categories: ['Class Teachers', 'Subject Teachers'],
    classTeacherFor: '11C',
    image: './assets/staff/ms-n-reid-magongo.jpg',
    imgPosition: 'center 50%',
  },
  {
    name: 'Mr M Lakhithika',
    position: 'Class Teacher — Grade 12A',
    subject: 'Life Orientation, IsiXhosa HL, Technology — Grade 12A',
    categories: ['Class Teachers', 'Subject Teachers'],
    classTeacherFor: '12A',
    image: './assets/staff/mr-m-lakhithika.jpg',
    imgPosition: 'center 50%',
  },
  {
    name: 'Miss A. Nqatsha',
    position: 'Class Teacher — Grade 12C',
    subject: 'English FAL (Grade 10), Business Studies (Grade 12)',
    categories: ['Class Teachers', 'Subject Teachers'],
    classTeacherFor: '12C',
    image: './assets/staff/miss-a-nqatsha.jpg',
    imgPosition: 'center 1%',
  },
  {
    name: 'Mr M Nozulela',
    position: 'Class Teacher — Grade 9A',
    subject: 'History and Technology — Grade 9A',
    categories: ['Class Teachers', 'Subject Teachers'],
    classTeacherFor: '9A',
    image: './assets/staff/mr-m-nozulela.jpg',
    imgPosition: 'center 49%',
  },
  {
    name: 'Ms G. Jojo',
    position: 'Class Teacher — Grade 9B',
    subject: 'English Grade 9, Life Orientation Grade 10',
    categories: ['Class Teachers', 'Subject Teachers'],
    classTeacherFor: '9B',
    image: './assets/staff/ms-g-jojo.jpg',
    imgPosition: 'center 50%',
  },

  // ── Subject Teachers ──────────────────────────────────────────────────────
  {
    name: 'Miss O Nongogo',
    position: 'Subject Teacher',
    subject: 'Life Science, Physical Sciences, Natural Sciences',
    categories: ['Subject Teachers'],
    image: './assets/staff/miss-o-nongogo.jpg',
    imgPosition: 'center top',
  },
  {
    name: 'Miss Bangani A.',
    position: 'Subject Teacher',
    subject: 'IsiXhosa HL and Geography',
    categories: ['Subject Teachers'],
    image: './assets/staff/miss-bangani-a.jpg',
    imgPosition: 'center 50%',
  },
  {
    name: 'Ms S. Sukazi',
    position: 'Subject Teacher',
    subject: 'Mathematical Literacy and Business Studies',
    categories: ['Subject Teachers'],
    image: './assets/staff/ms-s-sukazi.jpg',
    imgPosition: 'center 100%',
  },
  {
    name: 'Miss N.M. Gaulana',
    position: 'Subject Teacher',
    subject: 'Business Studies (Grades 11 & 12)',
    categories: ['Subject Teachers'],
    image: './assets/staff/miss-nm-gaulana.jpg',
    imgPosition: 'center 52%',
  },
  {
    name: 'Miss M.P Zulu',
    position: 'Subject Teacher',
    subject: 'English FAL (Grades 11 & 12)',
    categories: ['Subject Teachers'],
    image: './assets/staff/miss-mp-zulu.jpg',
    imgPosition: 'center center',
  },
  {
    name: 'Miss Nokhwali',
    position: 'Subject Teacher',
    subject: 'IsiXhosa',
    categories: ['Subject Teachers'],
    image: './assets/staff/miss-nokhwali.jpg',
    imgPosition: 'center top',
  },
  {
    name: 'Miss P Sonqishe',
    position: 'Subject Teacher',
    subject: 'Tourism',
    categories: ['Subject Teachers'],
    image: './assets/staff/miss-p-sonqishe.jpg',
    imgPosition: 'center center',
  },
  {
    name: 'Miss F.S.P Qwabe',
    position: 'Subject Teacher',
    subject: 'Tourism (Grade 12)',
    categories: ['Subject Teachers'],
    image: './assets/staff/miss-fsp-qwabe.jpg',
    imgPosition: 'center 50%',
  },
  {
    name: 'A. Nogula',
    position: 'Subject Teacher',
    subject: 'Mathematical Literacy (Grades 10 & 12)',
    categories: ['Subject Teachers'],
    image: './assets/staff/a-nogula.jpg',
    imgPosition: 'center 37%',
  },
  {
    name: 'Mr Mambi Zuko',
    position: 'Subject Teacher',
    subject: 'Accounting (Grades 10, 11 & 12)',
    categories: ['Subject Teachers'],
    image: './assets/staff/mr-mambi-zuko.jpg',
    imgPosition: 'center 44%',
  },
  {
    name: 'Mr M Cele',
    position: 'Subject Teacher',
    subject: 'English FAL (Grades 12B & 11C)',
    categories: ['Subject Teachers'],
    image: './assets/staff/mr-m-cele.jpg',
    imgPosition: 'center 50%',
  },
  {
    name: 'Mr M. Pepu',
    position: 'Subject Teacher',
    subject: 'Agricultural Sciences (Grade 11), Natural Sciences (Grades 8 & 9)',
    categories: ['Subject Teachers'],
    image: './assets/staff/mr-m-pepu.jpg',
    imgPosition: 'center 49%',
  },
  {
    name: 'Ms O Magewushe',
    position: 'Subject Teacher',
    subject: 'Mathematics (Grades 11 & 12)',
    categories: ['Subject Teachers'],
    image: './assets/staff/ms-o-magewushe.jpg',
    imgPosition: 'center center',
  },
  {
    name: 'Ms A Dinga',
    position: 'Departmental Head',
    departmentHead: 'Agric, NS and Life Sciences',
    subject: 'Agricultural Sciences, Natural Sciences and Life Sciences',
    categories: ['School Management', 'Subject Teachers'],
    image: './assets/staff/ms-a-dinga.jpg',
    imgPosition: 'center 50%',
  },
  {
    name: 'Mr Z Mkoti',
    position: 'Subject Teacher',
    subject: 'Business Studies (Grade 10C), Life Orientation (Grades 8A & 8B)',
    categories: ['Subject Teachers'],
    image: './assets/staff/mr-z-mkoti.jpg',
    imgPosition: 'center center',
  },
  {
    name: 'Mrs N Sokanyile',
    position: 'Subject Teacher',
    subject: 'IsiXhosa Grade 9',
    categories: ['Subject Teachers'],
    image: './assets/staff/mrs-n-sokanyile.jpg',
    imgPosition: 'center top',
  },
  {
    name: 'Mr M. Ngqolosi',
    position: 'Subject Teacher',
    subject: 'English and Social Sciences',
    categories: ['Subject Teachers'],
    image: './assets/staff/mr-m-ngqolosi.jpg',
    imgPosition: 'center 5%',
  },
  {
    name: 'Miss A. Nyakatha',
    position: 'Subject Teacher',
    subject: 'IsiXhosa HL (Grades 8 & 10)',
    categories: ['Subject Teachers'],
    image: './assets/staff/miss-a-nyakatha.jpg',
    imgPosition: 'center 10%',
  },
  {
    name: 'Miss T. Mpompi',
    position: 'Subject Teacher',
    subject: 'Mathematics',
    categories: ['Subject Teachers'],
    image: './assets/staff/miss-t-mpompi.jpg',
    imgPosition: 'center 10%',
  },
  {
    name: 'Sikete N',
    position: 'Subject Teacher',
    subject: 'Tourism (Grade 10)',
    categories: ['Subject Teachers'],
    image: './assets/staff/sikete-n.jpg',
    imgPosition: 'center 10%',
  },

  // ── New Departmental Heads / Subject Teachers (Jul 2026 batch) ─────────────
  {
    name: 'Mr S Mgedezi',
    position: 'Departmental Head',
    departmentHead: 'Languages',
    subject: 'English FAL (Grades 11 & 12)',
    categories: ['School Management', 'Subject Teachers'],
    image: './assets/staff/mr-s-mgedezi.jpg',
    imgPosition: 'center 25%',
  },
  {
    name: 'NC Jovula',
    position: 'Departmental Head',
    departmentHead: 'Humanities FET',
    subject: 'Geography',
    categories: ['School Management', 'Subject Teachers'],
    image: './assets/staff/nc-jovula.jpg',
    imgPosition: 'center 25%',
  },
  {
    name: 'Ms B Mgilane',
    position: 'Departmental Head',
    departmentHead: 'Humanities GET',
    subject: 'History (Grades 11 & 12)',
    categories: ['School Management', 'Subject Teachers'],
    image: './assets/staff/ms-b-mgilane.jpg',
    imgPosition: 'center center',
  },
  {
    name: 'N. Jiba',
    position: 'Departmental Head',
    departmentHead: 'BCM',
    subject: 'Accounting and Business Studies',
    categories: ['School Management', 'Subject Teachers'],
    image: './assets/staff/n-jiba.jpg',
    imgPosition: 'center 25%',
  },
  {
    name: 'Mr Mnoneleli Njubane',
    position: 'Departmental Head',
    departmentHead: 'Maths and Technology',
    subject: 'Mathematics and Technology',
    categories: ['School Management', 'Subject Teachers'],
    image: './assets/staff/mr-mnoneleli-njubane.jpg',
    imgPosition: 'center 25%',
  },
  {
    name: 'P Dumela',
    position: 'Subject Teacher',
    subject: 'EMS Grade 9A, Creative Arts Grade 9A, Creative Arts Grade 9B',
    categories: ['Subject Teachers'],
    image: './assets/staff/p-dumela.jpg',
    imgPosition: 'center center',
  },
  {
    name: 'Miss Mpatheni',
    position: 'Subject Teacher',
    subject: 'Mathematics and Technology',
    categories: ['Subject Teachers'],
    image: './assets/staff/miss-mpatheni.jpg',
    imgPosition: 'center 25%',
  },
  {
    name: 'Dlembula S.E.',
    position: 'Subject Teacher',
    subject: 'Economics Grade 10B, EMS Grade 8A',
    categories: ['Subject Teachers'],
    image: './assets/staff/dlembula-se.jpg',
    imgPosition: 'center 25%',
  },
  {
    name: 'Mrs H. Nongogo',
    position: 'Subject Teacher',
    subject: 'IsiXhosa and Social Sciences Grade 8',
    categories: ['Subject Teachers'],
    image: './assets/staff/mrs-h-nongogo.jpg',
    imgPosition: 'center 25%',
  },
  {
    name: 'Mr S. Mbatha',
    position: 'Subject Teacher',
    subject: 'Life Sciences (Grades 8–10), Natural Sciences & Technology (Grades 8 & 9)',
    categories: ['Subject Teachers'],
    image: './assets/staff/mr-s-mbatha.jpg',
    imgPosition: 'center 25%',
  },

  {
    name: 'Miss Z Gexu',
    position: 'Subject Teacher',
    subject: 'Life Orientation (Grades 10–12)',
    categories: ['Subject Teachers'],
    image: './assets/staff/miss-z-gexu.jpg',
    imgPosition: 'center center',
  },

  // ── Class Teachers (added Jul 2026) ────────────────────────────────────────
  {
    name: 'Mrs T. Mkubukeli',
    position: 'Class Teacher — Grade 8B',
    subject: 'English Grade 10, Life Orientation Grade 10, Creative Arts Grade 8B',
    categories: ['Class Teachers', 'Subject Teachers'],
    classTeacherFor: '8B',
    image: './assets/staff/mrs-t-mkubukeli.jpg',
    imgPosition: 'center 25%',
  },

  // ── Support Staff ─────────────────────────────────────────────────────────
  {
    name: 'Ms Z.S. Pitoyi',
    position: 'Admin Clerk',
    categories: ['Support Staff'],
    supportOrder: 1,
    image: './assets/staff/ms-z-pitoyi.jpg',
    imgPosition: 'center 15%',
  },
  {
    name: 'Mr VQwayede',
    position: 'Admin Clerk',
    categories: ['Support Staff'],
    supportOrder: 2,
    image: './assets/staff/mr-v-qwayede.jpg',
    imgPosition: 'center 15%',
  },
  {
    name: 'Miss V Gwanya',
    position: 'Cleaner',
    categories: ['Support Staff'],
    supportOrder: 4,
    image: './assets/staff/miss-v-gwanya.jpg',
    imgPosition: 'center 15%',
  },
  {
    name: 'Mrs Z Mjomle',
    position: 'Cleaner',
    categories: ['Support Staff'],
    supportOrder: 5,
    image: './assets/staff/mrs-z-mjomle.jpg',
    imgPosition: 'center 15%',
  },
];

const categories = ['School Management', 'Class Teachers', 'Subject Teachers', 'Support Staff'];

const StaffCard = ({ member, activeCategory }: { member: StaffMember; activeCategory: string }) => {
  const positionLabel = React.useMemo(() => {
    if (activeCategory === 'School Management') {
      return member.departmentHead
        ? `Departmental Head — ${member.departmentHead}`
        : member.position;
    }
    if (activeCategory === 'Class Teachers') {
      return member.classTeacherFor
        ? `Class Teacher — Grade ${member.classTeacherFor}`
        : member.position;
    }
    if (activeCategory === 'Support Staff') {
      return member.position;
    }
    return null;
  }, [member, activeCategory]);

  return (
    <div
      className="h-full rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col items-center p-6 text-center hover:-translate-y-1"
      style={ { background: '#FFFBEF', border: '1px solid #CC0000' } }
    >
      {/* Avatar */}
      <div
        className="w-24 h-24 rounded-full flex items-center justify-center mb-4 overflow-hidden"
        style={ { background: '#FDF9EC', border: '3px solid #CC0000' } }
      >
        {member.image ? (
          <img
            src={member.image}
            alt={member.name}
            className="w-full h-full object-cover"
            style={ { objectPosition: member.imgPosition || 'center center' } }
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
        ) : (
          <User size={40} style={ { color: '#CC0000', opacity: 0.5 } } />
        )}
      </div>

      <h3 className="text-sm font-bold leading-tight" style={ { color: '#CC0000' } }>
        {member.name}
      </h3>
      {positionLabel && (
        <p className="text-xs font-semibold mt-1" style={ { color: '#F5C518' } }>
          {positionLabel}
        </p>
      )}
      {activeCategory === 'Subject Teachers' && member.subject && (
        <div
          className="mt-3 w-full text-xs font-medium px-2 py-2 rounded-md text-center leading-tight"
          style={ { background: '#FDF9EC', color: '#CC0000', border: '2px solid #CC0000' } }
        >
          {member.subject}
        </div>
      )}
    </div>
  );
};

export const Staff = () => {
  const [activeCategory, setActiveCategory] = React.useState('School Management');
  const filtered = React.useMemo(() => {
    const list = staffData.filter(m => m.categories.includes(activeCategory));
    if (activeCategory === 'Class Teachers') {
      return [...list].sort((a, b) => classOrder(b.classTeacherFor) - classOrder(a.classTeacherFor));
    }
    if (activeCategory === 'Support Staff') {
      return [...list].sort((a, b) => (a.supportOrder ?? 99) - (b.supportOrder ?? 99));
    }
    if (activeCategory === 'School Management') {
      return [...list].sort((a, b) => {
        const rank = (m: StaffMember) => {
          if (m.position === 'Principal') return 0;
          if (m.position?.includes('Deputy Principal')) return 1;
          if (m.departmentHead) return 2;
          return 3;
        };
        return rank(a) - rank(b);
      });
    }
    if (activeCategory === 'Subject Teachers') {
      return [...list].sort((a, b) => {
        const rank = (m: StaffMember) => {
          if (m.categories.includes('School Management')) return 0;
          if (m.categories.includes('Class Teachers')) return 1;
          return 2;
        };
        return rank(a) - rank(b) || a.name.localeCompare(b.name);
      });
    }
    return list;
  }, [activeCategory]);

  return (
    <div className="min-h-screen py-12 px-4" style={ { background: '#FDF9EC' } }>
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold tracking-tight mb-3" style={ { color: '#CC0000' } }>
            Our Staff
          </h1>
          <div className="w-16 h-1 mx-auto rounded-full mb-4" style={ { background: '#F5C518' } } />
          <p className="text-gray-500 text-base max-w-2xl mx-auto">
            Meet the dedicated management, educators and support staff of Jojo Senior Secondary School.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={
                activeCategory === cat
                  ? { background: '#F5C518', color: '#CC0000', border: '2px solid #F5C518', fontWeight: 700 }
                  : { background: '#FFFBEF', color: '#CC0000', border: '2px solid #CC0000' }
              }
              className="px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 hover:shadow-md"
            >
              {cat}
              <span className="ml-2 text-xs font-bold opacity-60">
                ({staffData.filter(m => m.categories.includes(cat)).length})
              </span>
            </button>
          ))}
        </div>

        {/* Staff Cards Grid */}
        {activeCategory === 'School Management' ? (
          <div className="flex flex-col items-center gap-5">
            <div className="w-full max-w-[260px] h-full">
              <StaffCard member={filtered[0]} activeCategory={activeCategory} />
            </div>
            <div className="grid grid-cols-2 gap-5 w-full max-w-2xl justify-items-center auto-rows-fr">
              {filtered.slice(1, 3).map((member, index) => (
                <div key={index} className="w-full max-w-[260px] h-full">
                  <StaffCard member={member} activeCategory={activeCategory} />
                </div>
              ))}
            </div>
            {filtered.length > 3 && (
              <div className="grid grid-cols-2 gap-5 w-full max-w-2xl justify-items-center auto-rows-fr">
                {filtered.slice(3).map((member, index) => (
                  <div key={index} className="w-full max-w-[260px] h-full">
                    <StaffCard member={member} activeCategory={activeCategory} />
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 auto-rows-fr">
            {filtered.map((member, index) => (
              <div key={index} className="h-full">
                <StaffCard member={member} activeCategory={activeCategory} />
              </div>
            ))}
          </div>
        )}

        {/* Note */}
        <p className="text-center text-gray-400 text-xs mt-10 italic">
          Staff names and photos are updated as new information is provided.
        </p>
      </div>
    </div>
  );
};
