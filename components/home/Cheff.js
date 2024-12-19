'use client'
import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Star, Award, ThumbsUp } from 'lucide-react';

const Cheff = () => {
  const specialties = [
    {
      title: "Başlık 1",
      description: "Yorumunuzu buraya yazabilirsiniz.",
      icon: Star
    },
    {
      title: "Başlık 2",
      description: "Yorum",
      icon: Award
    },
    {
      title: "Başlık 3",
      description: "Yorum",
      icon: ThumbsUp
    }
  ];

  return (
    <section id="cheff" className="bg-[#0A0A0A] text-white py-20 scroll-mt-20">
      <div className="container mx-auto px-4">
        {/* Şef Tanıtımı */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold mb-6">Şef Mesut Kılınç</h2>
            <p className="text-zinc-400 mb-6">
              Yorum.
            </p>
            <p className="text-zinc-400 mb-6">
              Yorum.
            </p>
            <div className="flex gap-6">
              <div>
                <h4 className="text-2xl font-bold text-purple-500">15+</h4>
                <p className="text-zinc-400">Özel Tarif</p>
              </div>
              <div>
                <h4 className="text-2xl font-bold text-purple-500">20+</h4>
                <p className="text-zinc-400">Yıl Deneyim</p>
              </div>
              <div>
                <h4 className="text-2xl font-bold text-purple-500">1000+</h4>
                <p className="text-zinc-400">Mutlu Müşteri</p>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="relative h-[500px] rounded-lg overflow-hidden"
          >
            <Image
              src="/images/cheff/cheff.jpg"
              alt="Şef Mesut Kılınç"
              fill
              className="object-cover"
            />
          </motion.div>
        </div>

        {/* Özellikler */}
        <div className="grid md:grid-cols-3 gap-8">
          {specialties.map((specialty, index) => (
            <motion.div
              key={specialty.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="bg-zinc-900/50 p-6 rounded-lg"
            >
              <specialty.icon className="w-12 h-12 text-purple-500 mb-4" />
              <h3 className="text-xl font-bold mb-4">{specialty.title}</h3>
              <p className="text-zinc-400">{specialty.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Alt Mesaj */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mt-16"
        >
          <p className="text-zinc-400 text-lg">
            "Yorum."
          </p>
          <p className="text-purple-500 font-medium mt-2">- Şef Mehmet Aydın</p>
        </motion.div>
      </div>
    </section>
  );
};

export default Cheff;