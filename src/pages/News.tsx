import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Bell, Calendar, ArrowLeft, Newspaper, Info } from 'lucide-react';
import { getNews, type NewsItem } from '../admin/utils/storage';

export const News = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [notices, setNotices] = useState<NewsItem[]>([]);
  const selectedId = searchParams.get('id');
  const selected = notices.find((n) => n.id === selectedId);

  useEffect(() => {
    setNotices(getNews());
  }, []);

  if (selected) {
    return (
      <div className="py-12 sm:py-16 bg-gray-50 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => setSearchParams({})}
            className="inline-flex items-center gap-2 text-[#CC0000] font-bold mb-6 hover:underline"
          >
            <ArrowLeft size={18} /> Back to Notices
          </button>

          <article className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-[#CC0000] to-[#990000] px-7 py-6 text-white">
              <div className="flex items-center gap-2 text-sm font-black uppercase tracking-wider text-[#F5C518] mb-2">
                <Bell size={16} /> Notice
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold">{selected.title}</h1>
              <div className="flex items-center gap-2 mt-3 text-white/80 text-sm">
                <Calendar size={16} />
                <span>{selected.date}</span>
              </div>
            </div>

            <div className="p-6 sm:p-8">
              <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-line">{selected.content}</p>

              {selected.poster && (
                <div className="mt-8">
                  <div className="flex items-center gap-2 text-sm font-black uppercase tracking-wider text-[#CC0000] mb-4">
                    <Newspaper size={16} /> Original Poster
                  </div>
                  <div className="rounded-2xl border border-gray-200 overflow-hidden shadow-inner bg-gray-50">
                    <img
                      src={selected.poster}
                      alt={selected.title}
                      className="w-full h-auto max-h-[800px] object-contain mx-auto"
                    />
                  </div>
                </div>
              )}
            </div>
          </article>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 sm:py-16 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="section-title text-center">Notices & News</h1>
        <p className="text-center text-lg text-gray-600 mb-10 max-w-3xl mx-auto">
          Stay up to date with the latest announcements, events and school news.
        </p>

        {notices.length === 0 ? (
          <div className="text-center py-12 text-gray-400 bg-white rounded-3xl border-2 border-dashed border-gray-200">
            No active notices at this time.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {notices.map((notice) => (
              <div
                key={notice.id}
                className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow flex flex-col"
              >
                {notice.image ? (
                  <div className="h-44 overflow-hidden bg-gray-100">
                    <img
                      src={notice.image}
                      alt={notice.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                ) : (
                  <div className="h-44 bg-gradient-to-r from-[#CC0000] to-[#990000] flex items-center justify-center">
                    <Bell size={48} className="text-white/30" />
                  </div>
                )}
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                    <Calendar size={14} />
                    <span>{notice.date}</span>
                    <span className="ml-auto px-2 py-1 bg-gray-100 rounded text-xs font-bold uppercase tracking-wider">
                      Update
                    </span>
                  </div>
                  <h2 className="text-xl font-bold mb-3 text-gray-900">{notice.title}</h2>
                  <p className="text-gray-600 line-clamp-3 mb-5 flex-grow">{notice.content}</p>
                  <button
                    onClick={() => setSearchParams({ id: notice.id })}
                    className="inline-flex items-center gap-1 text-[#CC0000] font-bold hover:gap-2 transition-all"
                  >
                    Read More <Info size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
