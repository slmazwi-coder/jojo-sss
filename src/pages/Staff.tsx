import React from 'react';
import { User } from 'lucide-react';

interface StaffMember {
  name: string;
  position: string;
  subject?: string;
  category: string;
  image?: string;
}

const staffData: StaffMember[] = [
  // ── Leadership ──────────────────────────────────────────────────────────
  {
    name: 'Mr W.T. Mnganyana',
    position: 'Principal',
    category: 'Leadership',
    image: './assets/staff/mr-mganyana.jpg',
  },
  {
    name: 'Mr B. Mamfengu',
    position: 'Deputy Principal',
    subject: 'Physical Sciences (Grades 10 & 12)',
    category: 'Leadership',
    image: './assets/staff/mr-b-mamfengu.jpg',
  },
  {
    name: 'Mr R. K Qangule',
    position: 'Deputy Principal',
    subject: 'Mathematics',
    category: 'Leadership',
    image: './assets/staff/mr-rk-qangule.jpg',
  },

  // ── Educators ───────────────────────────────────────────────────────────
  {
    name: 'Mr M Lakthika',
    position: 'Class Teacher — Grade 12A',
    subject: 'Life Orientation, IsiXhosa HL, Technology',
    category: 'Educators',
    image: './assets/staff/mr-m-lakthika.jpg',
  },
  {
    name: 'Miss O Nongogo',
    position: 'Educator',
    subject: 'Life Science, Physical Sciences, Natural Sciences',
    category: 'Educators',
    image: './assets/staff/miss-o-nongogo.jpg',
  },
  {
    name: 'Mr M Nozulela',
    position: 'Class Teacher — Grade 9A',
    subject: 'History and Technology',
    category: 'Educators',
    image: './assets/staff/mr-m-nozulela.jpg',
  },
  {
    name: 'Miss Bangani A.',
    position: 'Educator',
    subject: 'IsiXhosa HL and Geography',
    category: 'Educators',
    image: './assets/staff/miss-bangani-a.jpg',
  },
  {
    name: 'Ms S. Sukazi',
    position: 'Educator',
    subject: 'Mathematical Literacy and Business Studies',
    category: 'Educators',
    image: './assets/staff/ms-s-sukazi.jpg',
  },
  {
    name: 'Miss N.M. Gaulana',
    position: 'Educator',
    subject: 'Business Studies (Grades 11 & 12)',
    category: 'Educators',
    image: './assets/staff/miss-nm-gaulana.jpg',
  },
  {
    name: 'Miss M.P Zulu',
    position: 'Educator',
    subject: 'English FAL (Grades 11 & 12)',
    category: 'Educators',
    image: './assets/staff/miss-mp-zulu.jpg',
  },
  {
    name: 'Miss Ndzelu',
    position: 'Class Teacher — Grade 11B',
    subject: 'Economics',
    category: 'Educators',
  },
  {
    name: 'Miss Nokhwali',
    position: 'Educator',
    subject: 'IsiXhosa',
    category: 'Educators',
    image: './assets/staff/miss-nokhwali.jpg',
  },
  {
    name: 'Miss P Sonqishe',
    position: 'Educator',
    subject: 'Tourism',
    category: 'Educators',
    image: './assets/staff/miss-p-sonqishe.jpg',
  },
  {
    name: 'Miss A. Nqatsha',
    position: 'Class Teacher — Grade 12C',
    subject: 'English FAL (Grade 10), Business Studies (Grade 12)',
    category: 'Educators',
    image: './assets/staff/miss-a-nqatsha.jpg',
  },
  {
    name: 'Miss F.S.P Qwabe',
    position: 'Educator',
    subject: 'Tourism (Grade 12)',
    category: 'Educators',
    image: './assets/staff/miss-fsp-qwabe.jpg',
  },
];

const categories = ['Leadership', 'Educators'];

const StaffCard = ({ member }: { member: StaffMember }) => (
  <div
    className="rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col items-center p-6 text-center hover:-translate-y-1"
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
          className="w-full h-full object-cover object-top"
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
        />
      ) : (
        <User size={40} style={ { color: '#CC0000', opacity: 0.5 } } />
      )}
    </div>

    <h3 className="text-sm font-bold leading-tight" style={ { color: '#CC0000' } }>
      {member.name}
    </h3>
    <p className="text-xs font-semibold mt-1" style={ { color: '#F5C518' } }>
      {member.position}
    </p>
    {member.subject && (
      <span
        className="mt-2 inline-block text-xs font-medium px-3 py-1 rounded-full"
        style={ { background: '#FDF9EC', color: '#CC0000', border: '1px solid #CC0000' } }
      >
        {member.subject}
      </span>
    )}
  </div>
);

export const Staff = () => {
  const [activeCategory, setActiveCategory] = React.useState('Leadership');
  const filtered = staffData.filter(m => m.category === activeCategory);

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
            Meet the dedicated leadership and educators of Jojo Senior Secondary School.
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
                ({staffData.filter(m => m.category === cat).length})
              </span>
            </button>
          ))}
        </div>

        {/* Staff Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
          {filtered.map((member, index) => (
            <div key={index}>
              <StaffCard member={member} />
            </div>
          ))}
        </div>

        {/* Note */}
        <p className="text-center text-gray-400 text-xs mt-10 italic">
          Staff names and photos are updated as new information is provided.
        </p>
      </div>
    </div>
  );
};
