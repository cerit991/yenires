'use client'
import React from 'react';
import Hero from '@/components/home/Hero';
import Contact from '@/components/home/Contact';
import Cheff from '@/components/home/Cheff';
import Menu from '@/components/home/Menu';

const Home = () => {
  return (
    <main className="min-h-screen bg-zinc-950">
      <Hero />
      <Menu />
      <Cheff />
      <Contact />
      
    </main>
  );
};

export default Home;