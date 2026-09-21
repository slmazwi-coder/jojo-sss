import React, { useState } from 'react';
import {
  Trophy,
  CalendarDays,
  Target,
  Users,
  Flag,
  Medal,
  Award,
  MapPin,
  Clock,
  Swords,
  ChevronRight,
} from 'lucide-react';

type SportInfo = {
  name: string;
  description: string;
  icon: React.ElementType;
};

const sports: SportInfo[] = [
  {
    name: 'Rugby',
    description: 'Boys and girls rugby teams competing at CMC, District and Provincial levels.',
    icon: Medal,
  },
  {
    name: 'Soccer',
    description: 'Boys and girls soccer with U15, U17 and U19 teams, including police tournament and Kay Molope fixtures.',
    icon: Target,
  },
  {
    name: 'Netball',
    description: 'U13, U14, U15 and U17 netball teams competing at CMC and District levels.',
    icon: Users,
  },
  {
    name: 'Volleyball',
    description: 'Girls volleyball U15 team that has won at CMC level.',
    icon: Trophy,
  },
  {
    name: 'Softball',
    description: 'Boys softball U15 and U17 teams competing and winning at CMC level.',
    icon: Award,
  },
  {
    name: 'Athletics',
    description: 'Track and field events to develop speed, strength, and endurance.',
    icon: Flag,
  },
];

type Fixture = {
  date: string;
  sport: string;
  opponent: string;
  venue: string;
  time: string;
};

type Result = {
  date: string;
  sport: string;
  opponent: string;
  venue: string;
  result: string;
};

const fixtures: Fixture[] = [
  { date: '07 Aug 2026', sport: 'Soccer U19', opponent: 'Motsa Mlungaleli SSS', venue: 'Kay Molope fixture', time: 'TBA' },
  { date: '15 Aug 2026', sport: 'Netball U18', opponent: 'Tykenzima H. School', venue: 'TBA', time: 'TBA' },
  { date: '22 Aug 2026', sport: 'Netball U19', opponent: 'TBA', venue: 'TBA', time: 'TBA' },
];

const results: Result[] = [
  { date: '17 Apr 2026', sport: 'Rugby Girls', opponent: 'CMC level', venue: '-', result: 'Won' },
  { date: '15 May 2026', sport: 'Rugby Girls', opponent: 'District level', venue: '-', result: 'Won' },
  { date: '29 May 2026', sport: 'Rugby Boys', opponent: 'Provincial level', venue: '-', result: 'Won' },
  { date: '2026', sport: 'Rugby Boys U15', opponent: 'Nyoka / Qhawe Festival, Mthatha', venue: 'Mthatha', result: 'Won tournament; Player of the tournament: Mbabane Lathitha' },
  { date: '2026', sport: 'Netball U13', opponent: 'CMC level', venue: '-', result: 'Won' },
  { date: '2026', sport: 'Netball U14, U15 & U17', opponent: 'District level', venue: '-', result: 'Won' },
  { date: '2026', sport: 'Volleyball Girls U15', opponent: 'CMC level', venue: '-', result: 'Won' },
  { date: '2026', sport: 'Soccer U15 Girls', opponent: 'District level', venue: '-', result: 'Won' },
  { date: '2026', sport: 'Soccer U15 Boys', opponent: 'District level', venue: '-', result: 'Won' },
  { date: '2026', sport: 'Soccer U17', opponent: 'Police tournament', venue: '-', result: 'Won' },
  { date: '2026', sport: 'Softball Boys U17', opponent: 'CMC level', venue: '-', result: 'Won' },
  { date: 'Feb 2026', sport: 'Netball & Soccer', opponent: 'SA Tournament', venue: '-', result: 'Won kit and ball; trophy soccer and netball' },
];

function matchesSport(item: { sport: string }, sportName: string) {
  return item.sport.toLowerCase().includes(sportName.toLowerCase());
}

export const Sport = () => {
  const [active, setActive] = useState(sports[0].name);
  const activeSport = sports.find((s) => s.name === active) || sports[0];
  const Icon = activeSport.icon;
  const sportFixtures = fixtures.filter((f) => matchesSport(f, active));
  const sportResults = results.filter((r) => matchesSport(r, active));

  return (
    <div className="py-12 sm:py-16 bg-gradient-to-b from-gray-50 to-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="section-title text-center">Sport</h1>
        <p className="text-center text-lg text-gray-600 mb-10 max-w-3xl mx-auto">
          Jojo SSS offers structured sport programs to develop teamwork, fitness, and discipline.
        </p>

        {/* Sport code tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {sports.map((s) => {
            const TabIcon = s.icon;
            const isActive = active === s.name;
            return (
              <button
                key={s.name}
                onClick={() => setActive(s.name)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-bold transition-all shadow-sm border ${
                  isActive
                    ? 'bg-[#CC0000] text-white border-[#CC0000] shadow-lg scale-105'
                    : 'bg-white text-[#CC0000] border-[#CC0000]/20 hover:bg-[#FDF9EC] hover:border-[#CC0000]/40'
                }`}
              >
                <TabIcon size={18} />
                {s.name}
              </button>
            );
          })}
        </div>

        {/* Active sport hero card */}
        <div className="mb-10 rounded-3xl p-8 sm:p-10 bg-gradient-to-r from-[#CC0000] to-[#990000] text-white shadow-2xl relative overflow-hidden">
          <div className="absolute -right-10 -top-10 w-48 h-48 bg-white/10 rounded-full blur-2xl" />
          <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-[#F5C518]/20 rounded-full blur-2xl" />
          <div className="relative flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="p-5 rounded-3xl bg-white/20 backdrop-blur-sm">
              <Icon size={48} className="text-[#F5C518]" />
            </div>
            <div className="text-center sm:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F5C518] text-[#CC0000] text-xs font-black uppercase tracking-wider mb-3">
                <Swords size={12} /> Selected Sport Code
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold mb-2">{activeSport.name}</h2>
              <p className="text-white/90 max-w-2xl text-base sm:text-lg">{activeSport.description}</p>
            </div>
          </div>
        </div>

        {/* Fixtures & Results cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Fixtures card */}
          <section className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-[#FDF9EC] px-7 py-5 border-b border-[#CC0000]/10 flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#CC0000] text-white">
                <CalendarDays size={22} />
              </div>
              <h2 className="text-xl font-extrabold text-gray-900">{activeSport.name} Fixtures</h2>
            </div>
            <div className="p-6 sm:p-7">
              {sportFixtures.length === 0 ? (
                <div className="text-center py-10 text-gray-500">
                  <CalendarDays size={40} className="mx-auto mb-3 text-[#CC0000]/30" />
                  <p className="font-semibold">No upcoming fixtures</p>
                  <p className="text-sm">Check back soon for {activeSport.name} fixtures.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {sportFixtures.map((f, i) => (
                    <div
                      key={i}
                      className="group relative rounded-2xl border border-gray-100 bg-gray-50 p-5 hover:shadow-md transition-all hover:border-[#CC0000]/20"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#CC0000]/10 text-[#CC0000] text-xs font-black uppercase tracking-wider mb-2">
                            <CalendarDays size={12} /> {f.date}
                          </div>
                          <h3 className="font-bold text-gray-900 text-lg">{f.sport}</h3>
                          <p className="text-gray-600 flex items-center gap-1.5 mt-1">
                            <Swords size={14} className="text-[#CC0000]" /> vs {f.opponent}
                          </p>
                        </div>
                        <div className="flex flex-col sm:items-end gap-1 text-sm text-gray-600">
                          <span className="flex items-center gap-1.5">
                            <MapPin size={14} className="text-[#CC0000]" /> {f.venue}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Clock size={14} className="text-[#CC0000]" /> {f.time}
                          </span>
                        </div>
                      </div>
                      <ChevronRight size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 group-hover:text-[#CC0000] transition-colors hidden sm:block" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Results card */}
          <section className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-[#CC0000] to-[#990000] px-7 py-5 flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-white/20 text-white">
                <Trophy size={22} />
              </div>
              <h2 className="text-xl font-extrabold text-white">{activeSport.name} Results</h2>
            </div>
            <div className="p-6 sm:p-7">
              {sportResults.length === 0 ? (
                <div className="text-center py-10 text-gray-500">
                  <Trophy size={40} className="mx-auto mb-3 text-[#CC0000]/30" />
                  <p className="font-semibold">No results yet</p>
                  <p className="text-sm">Results for {activeSport.name} will appear here.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {sportResults.map((r, i) => (
                    <div
                      key={i}
                      className="group relative rounded-2xl border border-gray-100 bg-gray-50 p-5 hover:shadow-md transition-all hover:border-[#CC0000]/20"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#CC0000]/10 text-[#CC0000] text-xs font-black uppercase tracking-wider">
                              <CalendarDays size={12} /> {r.date}
                            </span>
                            <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-black uppercase tracking-wider">
                              {r.result}
                            </span>
                          </div>
                          <h3 className="font-bold text-gray-900 text-lg">{r.sport}</h3>
                          <p className="text-gray-600 flex items-center gap-1.5 mt-1">
                            <Swords size={14} className="text-[#CC0000]" /> {r.opponent}
                          </p>
                          {r.venue !== '-' && (
                            <p className="text-sm text-gray-500 flex items-center gap-1.5 mt-1">
                              <MapPin size={14} /> {r.venue}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
