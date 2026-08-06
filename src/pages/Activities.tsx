import React from 'react';
import {
  BookOpen,
  Mic,
  Sigma,
  Brain,
  Globe,
  PenTool,
  Music,
  Clapperboard,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

const activities = [
  {
    name: 'Spelling Bee',
    icon: PenTool,
    description: 'Building vocabulary, spelling accuracy, and confidence in public performance.',
    accent: '#CC0000',
  },
  {
    name: 'Debate',
    icon: Mic,
    description: 'Structured debating, prepared speeches and poetry that develop critical thinking and public speaking.',
    accent: '#C8A400',
  },
  {
    name: 'Maths Olympiad',
    icon: Sigma,
    description: 'Problem-solving and competition preparation for learners who enjoy mathematics.',
    accent: '#CC0000',
  },
  {
    name: 'Science Club',
    icon: Brain,
    description: 'Experiments, projects, and exploration of practical science and technology.',
    accent: '#C8A400',
  },
  {
    name: 'Reading & Writing Club',
    icon: BookOpen,
    description: 'Creative writing, reading circles, and language enrichment activities.',
    accent: '#CC0000',
  },
  {
    name: 'Geography & Environment',
    icon: Globe,
    description: 'Environmental awareness, map skills, and geography enrichment projects.',
    accent: '#C8A400',
  },
  {
    name: 'Music & Choir',
    icon: Music,
    description: 'Solo mezzo and mixed choir (African & Western) performances at CMC level.',
    accent: '#CC0000',
  },
  {
    name: 'Drama & Public Speaking',
    icon: Clapperboard,
    description: 'Drama and public-speaking activities that build confidence and performance skills.',
    accent: '#C8A400',
  },
];

export const Activities = () => {
  return (
    <div className="py-12 sm:py-16 bg-gradient-to-b from-gray-50 to-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="section-title text-center">Activities</h1>
        <p className="text-center text-lg text-gray-600 mb-12 max-w-3xl mx-auto">
          Academic activities help learners grow confidence, strengthen problem-solving skills, and prepare for competitions.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {activities.map((a) => {
            const Icon = a.icon;
            return (
              <div
                key={a.name}
                className="group relative bg-white rounded-3xl border border-gray-100 p-7 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
              >
                <div
                  className="absolute top-0 left-0 right-0 h-1.5"
                  style={{ background: a.accent }}
                />
                <div
                  className="absolute -right-8 -top-8 w-28 h-28 rounded-full opacity-10 group-hover:scale-110 transition-transform duration-300"
                  style={{ background: a.accent }}
                />

                <div className="relative">
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className="p-3.5 rounded-2xl text-white shadow-md"
                      style={{ background: a.accent }}
                    >
                      <Icon size={24} />
                    </div>
                    <div className="p-2 rounded-full bg-gray-50 text-gray-300 group-hover:text-[#CC0000] group-hover:bg-[#FDF9EC] transition-colors">
                      <ArrowRight size={18} />
                    </div>
                  </div>

                  <h2 className="text-xl font-extrabold text-gray-900 mb-2">{a.name}</h2>
                  <p className="text-gray-600 leading-relaxed">{a.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 bg-gradient-to-r from-[#FDF9EC] to-white border border-[#C8A400] rounded-3xl p-6 sm:p-7 flex items-start gap-4">
          <div className="p-3 rounded-2xl bg-[#CC0000] text-white shrink-0">
            <Sparkles size={22} />
          </div>
          <div>
            <div className="text-sm font-black uppercase tracking-widest text-[#CC0000]">More activities</div>
            <p className="text-gray-700 mt-2">
              The school may add more academic activities over time, such as quiz competitions, coding club, entrepreneurship club,
              chess, and career guidance programs.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
