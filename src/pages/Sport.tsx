import React from 'react';
import { Trophy, CalendarDays, Target, Users, Flag, Medal, Award } from 'lucide-react';

const sports = [
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

export const Sport = () => {
  return (
    <div className="py-12 sm:py-16 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="section-title text-center">Sport</h1>
        <p className="text-center text-lg text-gray-600 mb-12 max-w-3xl mx-auto">
          Jojo SSS offers structured sport programs to develop teamwork, fitness, and discipline.
        </p>

        <section className="mb-14">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {sports.map((s) => (
              <div key={s.name} className="bg-gray-50 rounded-3xl border border-gray-100 p-7">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-3 rounded-2xl bg-white border border-gray-200 text-[#CC0000]">
                    <s.icon size={22} />
                  </div>
                  <h2 className="text-xl font-extrabold text-gray-900">{s.name}</h2>
                </div>
                <p className="text-gray-600">{s.description}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <section className="bg-gray-50 rounded-3xl border border-gray-100 p-7">
            <div className="flex items-center gap-3 mb-5">
              <div className="p-3 rounded-2xl bg-white border border-gray-200 text-[#CC0000]">
                <CalendarDays size={22} />
              </div>
              <h2 className="text-2xl font-extrabold text-gray-900">Fixtures</h2>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-600">
                    <th className="py-2 pr-4">Date</th>
                    <th className="py-2 pr-4">Sport</th>
                    <th className="py-2 pr-4">Opponent</th>
                    <th className="py-2 pr-4">Venue</th>
                    <th className="py-2">Time</th>
                  </tr>
                </thead>
                <tbody className="text-gray-800">
                  {fixtures.map((f, i) => (
                    <tr key={i} className="border-t border-gray-200">
                      <td className="py-3 pr-4 whitespace-nowrap">{f.date}</td>
                      <td className="py-3 pr-4 whitespace-nowrap font-semibold">{f.sport}</td>
                      <td className="py-3 pr-4">{f.opponent}</td>
                      <td className="py-3 pr-4">{f.venue}</td>
                      <td className="py-3 whitespace-nowrap">{f.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-5 text-xs text-gray-500 flex items-center gap-2">
              <Flag size={16} /> Fixtures can be updated in the Staff Portal.
            </div>
          </section>

          <section className="bg-gray-50 rounded-3xl border border-gray-100 p-7">
            <div className="flex items-center gap-3 mb-5">
              <div className="p-3 rounded-2xl bg-white border border-gray-200 text-[#CC0000]">
                <Trophy size={22} />
              </div>
              <h2 className="text-2xl font-extrabold text-gray-900">Results</h2>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-600">
                    <th className="py-2 pr-4">Date</th>
                    <th className="py-2 pr-4">Sport</th>
                    <th className="py-2 pr-4">Opponent</th>
                    <th className="py-2 pr-4">Venue</th>
                    <th className="py-2">Result</th>
                  </tr>
                </thead>
                <tbody className="text-gray-800">
                  {results.map((r, i) => (
                    <tr key={i} className="border-t border-gray-200">
                      <td className="py-3 pr-4 whitespace-nowrap">{r.date}</td>
                      <td className="py-3 pr-4 whitespace-nowrap font-semibold">{r.sport}</td>
                      <td className="py-3 pr-4">{r.opponent}</td>
                      <td className="py-3 pr-4">{r.venue}</td>
                      <td className="py-3 whitespace-nowrap font-semibold">{r.result}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-5 text-xs text-gray-500 flex items-center gap-2">
              <Flag size={16} /> Results can be updated in the Staff Portal.
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
