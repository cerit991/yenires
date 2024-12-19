'use client'
import { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import { X } from 'lucide-react';
import 'react-calendar/dist/Calendar.css';

const EditReservationModal = ({ reservation, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    guests: '',
    message: ''
  });
  const [showCalendar, setShowCalendar] = useState(false);

  useEffect(() => {
    if (reservation) {
      setFormData({
        name: reservation.name,
        email: reservation.email,
        phone: reservation.phone,
        date: reservation.date,
        time: reservation.time,
        guests: reservation.guests,
        message: reservation.message || ''
      });
    }
    // Modalı açtığımızda sayfanın kaydırılmasını engelle
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [reservation]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...formData, id: reservation.id });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date) => {
    setFormData(prev => ({
      ...prev,
      date: date.toISOString().split('T')[0]
    }));
    setShowCalendar(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 overflow-y-auto">
      <div className="min-h-screen px-4 flex items-center justify-center">
        <div className="relative bg-white w-full max-w-md rounded-lg shadow-lg p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-4 sticky top-0 bg-white pb-2 border-b">
            <h2 className="text-lg sm:text-xl font-semibold">Rezervasyonu Düzenle</h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-full"
            >
              <X size={20} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">İsim</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">E-posta</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tarih</label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowCalendar(!showCalendar)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-left"
                >
                  {formData.date ? new Date(formData.date).toLocaleDateString('tr-TR') : 'Tarih Seçin'}
                </button>
                {showCalendar && (
                  <div className="absolute z-10 mt-1 w-full bg-white rounded-lg shadow-lg p-2">
                    <Calendar
                      onChange={handleDateChange}
                      value={formData.date ? new Date(formData.date) : null}
                      className="w-full text-sm"
                      tileClassName="text-sm p-1"
                    />
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Saat</label>
              <select
                name="time"
                value={formData.time}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                required
              >
                <option value="">Saat Seçin</option>
                {Array.from({ length: 19 }, (_, i) => {
                  const hour = Math.floor(i / 2) + 12;
                  const minute = i % 2 === 0 ? '00' : '30';
                  const time = `${hour}:${minute}`;
                  return (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  );
                })}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kişi Sayısı</label>
              <select
                name="guests"
                value={formData.guests}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                required
              >
                <option value="">Kişi Sayısı Seçin</option>
                <option value="1-2">1-2 Kişi</option>
                <option value="3-4">3-4 Kişi</option>
                <option value="5-6">5-6 Kişi</option>
                <option value="7-8">7-8 Kişi</option>
                <option value="9+">9+ Kişi</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mesaj</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm resize-none"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4 sticky bottom-0 bg-white border-t">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                İptal
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Kaydet
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditReservationModal;
