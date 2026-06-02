import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Image as ImageIcon } from 'lucide-react';
import { getAbout, type AboutInfo } from '../admin/utils/storage';

export const About = () => {
  const [data, setData] = useState<AboutInfo>(getAbout());
  const [campusFailed, setCampusFailed] = useState(false);
  const [principalFailed, setPrincipalFailed] = useState(false);

  const campusImageUrl = '/assets/about/jojocampus.jpg';
  const principalImageUrl = '/assets/about/principal.jpg';

  useEffect(() => {
    setData(getAbout());
  }, []);

  return (
    <div className="py-12 sm:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Page Title */}
        <h1 className="section-title">About Jojo SSS</h1>

        {/* ── Section 1: Our School + Campus Image ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-stretch mb-16 sm:mb-24">

          {/* Text */}
          <motion.div
            initial={ { opacity: 0, y: 24 } }
            whileInView={ { opacity: 1, y: 0 } }
            transition={ { duration: 0.35 } }
            viewport={ { once: true } }
            className="flex flex-col justify-center"
          >
            <div className="border-l-4 border-[#CC0000] pl-5 mb-6">
              <h2 className="text-2xl font-bold text-[#CC0000]">Our School</h2>
            </div>
            <div className="space-y-4 text-gray-600 leading-relaxed text-base">
              <p>
                Jojo Senior Secondary School (Jojo SSS) is a public senior secondary school 
                located at Dundee A/A, Mount Ayliff, Eastern Cape. The school serves the 
                Umzimvubu Local Municipality within the Alfred Nzo West Education District 
                and operates as a No-Fee school.
              </p>
              <p>
                Under the inspiring motto "The Sky Is The Limit", Jojo SSS has built a proud 
                community of learners and a strong culture of unity and academic ambition.
              </p>
              <p>
                With approximately 1,609 to 1,758 learners and 46 dedicated teachers, 
                the school offers comprehensive education from Grades 8 to 12.
              </p>
              <p className="text-[#CC0000] font-semibold">
                "We are unity. We don't remember the days — we remember the moments."
              </p>
            </div>
          </motion.div>

          {/* Campus Image (match principal styling + avoid cropping) */}
          <motion.div
            initial={ { opacity: 0, y: 24 } }
            whileInView={ { opacity: 1, y: 0 } }
            transition={ { duration: 0.35, delay: 0.05 } }
            viewport={ { once: true } }
            className="bg-[#FDF9EC] rounded-3xl overflow-hidden shadow-lg border border-[#CC0000]"
          >
            <div className="bg-[#CC0000] p-6 sm:p-8">
              {/* Outer holder: rounded + gold frame all around */}
              <div
                className="w-full rounded-3xl bg-[#CC0000] p-2 sm:p-3"
                style={ { border: '4px solid #F5C518' } }
              >
                {/* Inner holder: keeps the image nicely clipped on all corners */}
                <div className="w-full rounded-2xl overflow-hidden shadow-xl" style={ { aspectRatio: '4/3' } }>
                  {!campusFailed ? (
                    <img
                      src={campusImageUrl}
                      alt="School campus"
                      className="w-full h-full object-contain bg-[#CC0000]"
                      onError={() => setCampusFailed(true)}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#CC0000] via-[#F5C518] to-[#CC0000] flex items-center justify-center">
                      <div className="text-center text-white/70 px-6">
                        <div className="mx-auto mb-3 w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center border border-white/15">
                          <ImageIcon />
                        </div>
                        <div className="font-semibold">Campus image</div>
                        <div className="text-sm text-white/60 font-mono">public/assets/about/</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ── Section 2: Principal's Message ── */}
        <motion.section
          initial={ { opacity: 0, y: 24 } }
          whileInView={ { opacity: 1, y: 0 } }
          transition={ { duration: 0.4 } }
          viewport={ { once: true } }
          className="mb-16 sm:mb-24"
        >
          {/* Section heading */}
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold text-[#CC0000] mb-2">Principal's Message</h2>
            <div className="w-16 h-1 bg-[#CC0000] mx-auto rounded-full" />
          </div>

          {/* Card */}
          <div className="bg-[#FDF9EC] rounded-3xl overflow-hidden shadow-lg border border-[#CC0000]">
            <div className="grid grid-cols-1 md:grid-cols-3">

              {/* Principal Photo Column */}
              <div className="flex flex-col items-center justify-center bg-[#CC0000] p-8 md:p-10">
                {/* Photo frame */}
                <div className="w-40 h-40 md:w-48 md:h-48 rounded-full overflow-hidden border-4 border-[#F5C518] shadow-xl mb-5">
                  {!principalFailed ? (
                    <img
                      src={principalImageUrl}
                      alt="Principal"
                      className="w-full h-full object-cover object-top"
                      onError={() => setPrincipalFailed(true)}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-[#CC0000]">
                      <ImageIcon className="text-white/40" size={40} />
                    </div>
                  )}
                </div>

                {/* Name & Title */}
                <h3 className="text-lg font-bold text-white text-center leading-tight">
                  Mr W.T. Mnganyana
                </h3>
                <p className="text-[#F5C518] text-sm font-semibold mt-1 text-center">
                  Principal
                </p>

                {/* Decorative divider */}
                <div className="w-10 h-0.5 bg-[#CC0000] mt-4 rounded-full opacity-60" />
              </div>

              {/* Message Column */}
              <div className="col-span-2 flex flex-col justify-center p-8 md:p-12">
                {/* Opening quote mark — decorative only, not wrapping text */}
                <div className="text-[#CC0000] text-6xl font-serif leading-none mb-2 opacity-40 select-none">
                  "
                </div>

                <div className="space-y-4 text-gray-700 text-base sm:text-lg leading-relaxed">
                  <p>
                    Welcome to Jojo Senior Secondary School. Our institution stands as a 
                    beacon of academic excellence and community spirit in the heart of 
                    Mount Ayliff.
                  </p>
                  <p>
                    At Jojo SSS, we believe that every learner has the potential to reach 
                    for the sky. Our dedicated team of 46 teachers works tirelessly to 
                    nurture talent, foster creativity, and build responsible citizens.
                  </p>
                  <p>
                    Together, we create an environment where "We are unity" is not just 
                    a phrase, but a way of life. Our learners leave Jojo SSS not only with 
                    knowledge but with values that will serve them throughout their lives.
                  </p>
                </div>

                {/* Closing quote mark — decorative only */}
                <div className="text-[#CC0000] text-6xl font-serif leading-none mt-2 text-right opacity-40 select-none">
                  "
                </div>
              </div>

            </div>
          </div>
        </motion.section>

      </div>
    </div>
  );
};
