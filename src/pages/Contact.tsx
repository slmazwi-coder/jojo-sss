import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Phone, Mail, MapPin, Clock, Send } from 'lucide-react';
import { getContact, type ContactInfo } from '../admin/utils/storage';

export const Contact = () => {
  const [info, setInfo] = useState<ContactInfo>(getContact());

  useEffect(() => {
    setInfo(getContact());
  }, []);

  return (
    <div className="py-12 sm:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="section-title">Contact Us</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <h2 className="text-2xl font-bold text-[#CC0000] mb-8">Get in Touch</h2>
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-[#FDF9EC] text-[#CC0000] rounded-xl">
                  <MapPin size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Address</h3>
                  <p className="text-gray-600">Dundee A/A, Mount Ayliff, Eastern Cape 4735</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-3 bg-[#FDF9EC] text-[#CC0000] rounded-xl">
                  <Phone size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Phone</h3>
                  <p className="text-gray-600">039 940 4284 / 073 454 3888 / (039) 254 8224</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-3 bg-[#FDF9EC] text-[#CC0000] rounded-xl">
                  <Mail size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Email</h3>
                  <p className="text-gray-600 break-words">Principal.200500338@ecschools.org.za</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-3 bg-[#FDF9EC] text-[#CC0000] rounded-xl">
                  <Clock size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-lg">Office Hours</h4>
                  <p className="text-gray-600">Monday - Friday: 07:30 – 15:30</p>
                  <p className="text-gray-600">Saturday - Sunday: Closed</p>
                </div>
              </div>
            </div>

            <div className="mt-10 sm:mt-12 rounded-3xl overflow-hidden h-[260px] sm:h-[320px] border-4 border-gray-100 shadow-inner bg-gray-50 relative">
              <iframe
                title="Jojo SSS Location"
                src="https://www.google.com/maps?q=-30.8127,28.9744&z=15&output=embed"
                className="w-full h-full border-0"
                loading="lazy"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.05 }}
            className="bg-gray-50 p-6 sm:p-8 md:p-10 rounded-3xl border border-gray-100 shadow-sm"
          >
            <h2 className="text-2xl font-bold text-[#CC0000] mb-8">Send us a Message</h2>
            <form className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Full Name</label>
                <input
                  type="text"
                  className="w-full p-4 rounded-xl bg-white border border-gray-200 focus:ring-2 focus:ring-[#CC0000]/20 outline-none"
                  placeholder="Your name"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Email Address</label>
                <input
                  type="email"
                  className="w-full p-4 rounded-xl bg-white border border-gray-200 focus:ring-2 focus:ring-[#CC0000]/20 outline-none"
                  placeholder="Your email"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Subject</label>
                <input
                  type="text"
                  className="w-full p-4 rounded-xl bg-white border border-gray-200 focus:ring-2 focus:ring-[#CC0000]/20 outline-none"
                  placeholder="What is this regarding?"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Message</label>
                <textarea
                  rows={4}
                  className="w-full p-4 rounded-xl bg-white border border-gray-200 focus:ring-2 focus:ring-[#CC0000]/20 outline-none resize-none"
                  placeholder="How can we help you?"
                />
              </div>
              <button className="btn-primary w-full py-4 flex items-center justify-center gap-2" type="button">
                Send Message <Send size={18} />
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
