'use client'
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Instagram, Loader2, Calendar as CalendarIcon, Check } from 'lucide-react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    guests: '',
    message: ''
  });

  const [submitStatus, setSubmitStatus] = useState({ type: '', message: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [success, setSuccess] = useState(false);

  // Kullanılabilir saatler listesi
  const availableHours = [
    '15:00', '15:30',
    '16:00', '16:30',
    '17:00', '17:30',
    '18:00', '18:30',
    '19:00', '19:30',
    '20:00', '20:30',
    '21:00'
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDateChange = (date) => {
    // Seçilen tarihi yerel saat dilimine göre ayarla ve UTC'ye çevir
    const localDate = new Date(date);
    const year = localDate.getFullYear();
    const month = String(localDate.getMonth() + 1).padStart(2, '0');
    const day = String(localDate.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    setFormData(prev => ({ ...prev, date: formattedDate }));
    setShowCalendar(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setSubmitStatus({ type: '', message: '' });
    
    try {
      // Yapay gecikme ekle
      await new Promise(resolve => setTimeout(resolve, 2000));

      const response = await fetch('/api/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSuccess(true);
        setFormData({
          name: '',
          email: '',
          phone: '',
          date: '',
          time: '',
          guests: '',
          message: ''
        });
        // 3 saniye sonra başarı mesajını kaldır
        setTimeout(() => {
          setSuccess(false);
        }, 3000);
      } else {
        throw new Error('Rezervasyon kaydedilemedi');
      }
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: 'Rezervasyon kaydedilirken bir hata oluştu. Lütfen tekrar deneyin.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="contact" className="bg-[#0A0A0A] text-white py-12 px-4 sm:px-6 lg:px-8 scroll-mt-20">
      <div className="container mx-auto px-4 py-16">
        {/* Başlık */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">İletişim & Rezervasyon</h2>
          <p className="text-zinc-400">Size en iyi hizmeti sunmak için buradayız</p>
        </div>

        {/* Ana Grid: Harita ve Form */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Sol Taraf - Harita */}
          <div className="space-y-8">
            <div className="aspect-video w-full rounded-lg overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3191.0456526764397!2d31.385557376559386!3d36.76822817495961!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14c35be42150aec1%3A0x43c94373aeea9d63!2sYou%20Chill%20Lounge!5e0!3m2!1str!2str!4v1702498898000!5m2!1str!2str"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>

            {/* İletişim Bilgileri */}
            <div className="bg-zinc-900/50 rounded-lg p-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="text-purple-500 w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">Adres</h4>
                    <p className="text-zinc-400 text-sm">Side, Yasemin Sk. No: 31, 07330 Manavgat/Antalya</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                    <Phone className="text-purple-500 w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">Telefon</h4>
                    <p className="text-zinc-400 text-sm">+90 532 540 42 22</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="text-purple-500 w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">E-posta</h4>
                    <p className="text-zinc-400 text-sm">info@youchilllounge.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                    <Clock className="text-purple-500 w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">Açılış Saatleri</h4>
                    <p className="text-zinc-400 text-sm">Pazartesi - Pazar: 16:00 - 02:00</p>
                  </div>
                </div>
              </div>

              {/* Sosyal Medya ve İletişim Butonları */}
              <div className="flex gap-4 mt-6 justify-center">
                <a 
                  href="https://www.instagram.com/youchilllounge" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center hover:bg-purple-500/20 transition-colors"
                  title="Instagram'da Bizi Takip Edin"
                >
                  <Instagram className="text-purple-500 w-5 h-5" />
                </a>
                <a 
                  href="https://t.me/YouChillLounge" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center hover:bg-purple-500/20 transition-colors"
                  title="Telegram'da Bizi Takip Edin"
                >
                  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Telegram_2019_Logo.svg/2048px-Telegram_2019_Logo.svg.png" alt="Telegram" className="w-5 h-5" />
                </a>
                <a 
                  href="tel:+905325404222" 
                  className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center hover:bg-purple-500/20 transition-colors"
                  title="Bizi Arayın"
                >
                  <Phone className="text-purple-500 w-5 h-5" />
                </a>
              </div>
            </div>
          </div>

          {/* Sağ Taraf - Rezervasyon Formu */}
          <div className="bg-zinc-900/50 rounded-lg p-6">
            <h3 className="text-2xl font-bold mb-6">Rezervasyon Yap</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">İsim</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-zinc-900 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">E-posta</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-zinc-900 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Telefon</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full bg-zinc-900 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Tarih</label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowCalendar(!showCalendar)}
                      className="w-full bg-zinc-900 rounded-lg px-4 py-3 flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <span>{formData.date || 'Tarih Seçin'}</span>
                      <CalendarIcon className="w-4 h-4 text-zinc-400" />
                    </button>

                    <AnimatePresence>
                      {showCalendar && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute left-0 top-full mt-2 z-50"
                        >
                          <div className="bg-zinc-800 p-4 rounded-lg shadow-xl">
                            <Calendar
                              onChange={handleDateChange}
                              value={formData.date ? new Date(formData.date) : null}
                              minDate={new Date()}
                              className="custom-calendar"
                              calendarType="gregory"
                              formatDay={(locale, date) => date.getDate()}
                            />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Saat</label>
                  <select
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    className="w-full bg-zinc-900 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  >
                    <option value="">Saat Seçin</option>
                    {availableHours.map((hour) => (
                      <option key={hour} value={hour}>
                        {hour}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Kişi Sayısı</label>
                <select
                  name="guests"
                  value={formData.guests}
                  onChange={handleChange}
                  className="w-full bg-zinc-900 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                >
                  <option value="">Kişi Sayısı Seçin</option>
                  <option value="1-2">1-2 Kişi</option>
                  <option value="3-4">3-4 Kişi</option>
                  <option value="5-6">5-6 Kişi</option>
                  <option value="7-8">7-8 Kişi</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Özel İstekler</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full bg-zinc-900 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 h-24 resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-purple-500 text-white rounded-lg px-4 py-3 hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoading ? (
                  <Loader2 className="w-6 h-6 text-white animate-spin" />
                ) : (
                  'Rezervasyon Yap'
                )}
              </button>
            </form>
            {success && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                <div className="bg-white rounded-lg p-8 flex flex-col items-center space-y-4 animate-success">
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                    <Check className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Rezervasyon Başarılı!</h3>
                  <p className="text-gray-600 text-center">
                    Sayın {formData.name}, rezervasyonunuz başarıyla oluşturuldu.
                    <br />
                    Size en kısa sürede dönüş yapacağız.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;