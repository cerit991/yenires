import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { UtensilsCrossed, Clock, MapPin, Phone, ArrowRight } from 'lucide-react';

const SphereAnimation = () => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let currentRotationX = 0;
    let currentRotationY = 0;
    let targetRotationX = 0;
    let targetRotationY = 0;

    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.theta = Math.random() * Math.PI * 2;
        this.phi = Math.random() * Math.PI;
        this.radius = 50; // Küre boyutunu küçülttük
        this.baseX = 0;
        this.baseY = 0;
        this.baseZ = 0;
      }

      update() {
        this.baseX = this.radius * Math.sin(this.phi) * Math.cos(this.theta);
        this.baseY = this.radius * Math.sin(this.phi) * Math.sin(this.theta);
        this.baseZ = this.radius * Math.cos(this.phi);

        const cosX = Math.cos(currentRotationX);
        const sinX = Math.sin(currentRotationX);
        const cosY = Math.cos(currentRotationY);
        const sinY = Math.sin(currentRotationY);

        this.x = this.baseX * cosY - this.baseZ * sinY;
        this.z = this.baseX * sinY + this.baseZ * cosY;
        this.y = this.baseY * cosX - this.z * sinX;
        this.z = this.baseY * sinX + this.z * cosX;

        // Sağ üst köşeye konumlandırma
        this.screenX = canvas.width - 100 + this.x;
        this.screenY = 150 + this.y;
        this.scale = (this.z + this.radius) / (this.radius * 2);
      }
    }

    const particles = Array(400).fill().map(() => new Particle()); // Parçacık sayısını azalttık

    const handleMouseMove = (e) => {
      targetRotationX = (e.clientY - window.innerHeight / 2) * 0.002;
      targetRotationY = (e.clientX - window.innerWidth / 2) * 0.002;
    };

    window.addEventListener('mousemove', handleMouseMove);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      currentRotationX += (targetRotationX - currentRotationX) * 0.1;
      currentRotationY += (targetRotationY - currentRotationY) * 0.1;

      particles.forEach(particle => particle.update());

      particles.forEach((p1, i) => {
        particles.forEach((p2, j) => {
          if (j <= i) return;
          
          const dx = p1.screenX - p2.screenX;
          const dy = p1.screenY - p2.screenY;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 15) { // Bağlantı mesafesini küçülttük
            const alpha = (1 - distance/15) * 0.15 * p1.scale * p2.scale;
            ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(p1.screenX, p1.screenY);
            ctx.lineTo(p2.screenX, p2.screenY);
            ctx.stroke();
          }
        });
      });

      particles.forEach(particle => {
        const alpha = particle.scale * 0.8;
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.beginPath();
        ctx.arc(particle.screenX, particle.screenY, 1.2 * particle.scale, 0, Math.PI * 2);
        ctx.fill();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-10"
      style={{ background: 'transparent' }}
    />
  );
};

const Hero = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const backgroundImages = [
    '/images/bg/bg-1.jpg',
    '/images/bg/bg-2.jpg',
    '/images/bg/bg-3.jpg',
    '/images/bg/bg-4.jpg',
    '/images/bg/bg-5.jpg',
    '/images/bg/bg-6.jpg',
    '/images/bg/bg-7.jpg',
    '/images/bg/bg-8.jpg',
    '/images/bg/bg-9.jpg'
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % backgroundImages.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const features = [
    {
      icon: <UtensilsCrossed className="w-5 h-5" />,
      title: "Taze Gıdalar",
      description: "Her gün taze ve mevsimsel lezzetler"
    },
    {
      icon: <Clock className="w-5 h-5" />,
      title: "Çalışma Saatleri",
      description: "Her gün 11:00 - 01:00"
    },
    {
      icon: <MapPin className="w-5 h-5" />,
      title: "Konum",
      description: "Antik Side, Antalya/Manavgat"
    }
  ];

  return (
    <div className="relative min-h-screen overflow-hidden">
      <SphereAnimation />
      
      {/* Background Image Container */}
      <div className="absolute top-10 right-0 w-full h-[85vh]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentImageIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0"
          >
            <Image
              src={backgroundImages[currentImageIndex]}
              alt="Restaurant Ambiance"
              fill
              className="object-cover"
              priority={currentImageIndex === 0}
            />
            {/* Layered gradients for complete shadow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/80 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-zinc-950/90" />
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-zinc-950 to-transparent" />
            <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-zinc-950 to-transparent" />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Content Container */}
      <div className="relative min-h-[80vh]">
        <div className="container mx-auto px-4 h-full flex items-center pt-32">
          <div className="max-w-2xl space-y-12 mt-30">
            {/* Main Title */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <h1 className="text-8xl font-bold text-white">
                ...You
                <span className="text-white"> Chill </span>
                Lounge...
              </h1>
              <p className="text-xl text-zinc-400 max-w-xl">
                Size özel ve sıcak bir atmosferde benzersiz bir deneyim sunan "Chill Lounge Restaurant", modern şehir hayatının koşuşturmasından uzaklaşıp huzuru bulabileceğiniz bir vaha...
              </p>
            </motion.div>

            {/* Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-wrap gap-6"
            >
              <button
                onClick={() => {
                  const contactSection = document.getElementById('contact');
                  contactSection?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="group flex items-center gap-2 px-8 py-4 bg-white text-zinc-900 rounded-full font-medium hover:bg-zinc-100 transition-all"
              >
                <Phone className="w-4 h-4" />
                <span>Rezervasyon Yap</span>
                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </button>
              <button
                onClick={() => {
                  const menuSection = document.getElementById('menu');
                  menuSection?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="group flex items-center gap-2 px-8 py-4 border border-white/20 text-white rounded-full font-medium hover:bg-white/10 transition-all"
              >
                <span>Menüyü İncele</span>
                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </button>
            </motion.div>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="border-l-2 border-purple-500/30 pl-6 space-y-8"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 + 0.5 }}
                  className="flex items-center gap-4"
                >
                  <div className="w-12 h-12 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="font-medium text-white text-lg">{feature.title}</h3>
                    <p className="text-zinc-400">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;