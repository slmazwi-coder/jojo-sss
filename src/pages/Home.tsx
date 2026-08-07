import React from 'react';
import { motion } from 'motion/react';
import { Award, TrendingUp, Users, Megaphone, ArrowRight, Calendar } from 'lucide-react';

const stats = [
  { label: 'Learners Enrolled', value: '1,600+', icon: Users },
  { label: 'Dedicated Educators', value: '48', icon: Award },
  { label: 'Grades Offered', value: '8 - 12', icon: TrendingUp },
];

export const Home = () => {
  return (
    <div className="flex flex-col">
      {/* Notices */}
      <section className="py-10 sm:py-12 bg-white">
        <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="rounded-3xl border border-[#CC0000] bg-[#FDF9EC] p-6 sm:p-7 flex gap-4 items-start">
              <div className="p-3 rounded-2xl bg-white border border-[#CC0000] text-[#CC0000] shrink-0">
                <Megaphone size={22} />
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="text-sm font-black uppercase tracking-widest text-[#CC0000]">Notice</div>
                  <span className="px-2 py-1 rounded-full text-xs font-bold bg-white border border-[#CC0000] text-gray-700">
                    2027
                  </span>
                </div>
                <h3 className="text-xl font-extrabold text-gray-900 mt-2">2027 Admissions are closed</h3>
                <p className="text-gray-700 mt-1">
                  Applications for the 2027 academic year are now closed. The online application form has been locked and is no longer accepting submissions.
                </p>
                <a href="/contact" className="mt-4 inline-flex items-center gap-2 text-[#CC0000] font-bold">
                  Contact school <ArrowRight size={18} />
                </a>
              </div>
            </div>

            <div className="rounded-3xl border border-[#C8A400] bg-[#FFFDF5] p-6 sm:p-7 flex gap-4 items-start">
              <div className="p-3 rounded-2xl bg-white border border-[#C8A400] text-[#CC0000] shrink-0">
                <Calendar size={22} />
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="text-sm font-black uppercase tracking-widest text-[#CC0000]">Upcoming events</div>
                  <span className="px-2 py-1 rounded-full text-xs font-bold bg-white border border-[#C8A400] text-gray-700">
                    Calendar
                  </span>
                </div>
                <h3 className="text-xl font-extrabold text-gray-900 mt-2">English & Literacy events</h3>
                <p className="text-gray-700 mt-1">
                  Annual Alfred Nzo West English Language Festival on 10 Aug 2026. International Literacy Day build-up event on 27 Aug 2026 at KwaBhaca Town Hall.
                </p>
                <a href="/activities" className="mt-4 inline-flex items-center gap-2 text-[#CC0000] font-bold">
                  View activities <ArrowRight size={18} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Quick View */}
      <section className="py-12 bg-gray-50 -mt-4 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.3 }}
              className="bg-white p-8 rounded-2xl shadow-xl flex items-center gap-6 border-b-4 border-[#CC0000]"
            >
              <div className="p-4 bg-[#FDF9EC] rounded-xl text-[#CC0000]">
                <stat.icon size={32} />
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-gray-500 font-medium">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="section-title">Our Motto</h2>
          <p className="text-2xl text-gray-700 leading-relaxed font-light italic">
            "The Sky Is The Limit"
          </p>
          <p className="text-lg text-gray-500 mt-4">
            "We are committed to excellence in everything we do as the school that will enable our learners to become responsible citizens."
          </p>
        </div>
      </section>
    </div>
  );
};
