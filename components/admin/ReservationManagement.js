'use client'
import { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import { CalendarIcon, Pencil, Trash2 } from 'lucide-react';
import EditReservationModal from './EditReservationModal';
import 'react-calendar/dist/Calendar.css';

const ReservationManagement = ({ reservations, onDelete, onEdit }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [filteredReservations, setFilteredReservations] = useState([]);
  const [showCalendar, setShowCalendar] = useState(false);
  const [editingReservation, setEditingReservation] = useState(null);

  useEffect(() => {
    if (reservations) {
      setFilteredReservations(reservations);
    }
  }, [reservations]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setShowCalendar(false);
    if (reservations) {
      const filtered = reservations.filter(res => {
        const resDate = new Date(res.date);
        return resDate.toDateString() === date.toDateString();
      });
      setFilteredReservations(filtered);
    }
  };

  const clearDateFilter = () => {
    setSelectedDate(null);
    setFilteredReservations(reservations);
  };

  const handleEditClick = (reservation) => {
    setEditingReservation(reservation);
  };

  const handleEditSave = async (updatedReservation) => {
    await onEdit(updatedReservation);
    setEditingReservation(null);
  };

  if (!reservations) return <div>Yükleniyor...</div>;

  return (
    <div className="space-y-4">
      {editingReservation && (
        <EditReservationModal
          reservation={editingReservation}
          onClose={() => setEditingReservation(null)}
          onSave={handleEditSave}
        />
      )}

      <div className="flex items-center gap-4 mb-4">
        <div className="relative">
          <button
            onClick={() => setShowCalendar(!showCalendar)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <CalendarIcon size={20} />
            {selectedDate 
              ? new Date(selectedDate).toLocaleDateString('tr-TR')
              : 'Tarihe Göre Filtrele'
            }
          </button>
          
          {showCalendar && (
            <div className="absolute z-10 mt-2 bg-white rounded-lg shadow-lg p-2">
              <Calendar
                onChange={handleDateChange}
                value={selectedDate}
                className="rounded-lg shadow-md"
                tileClassName="text-sm p-1"
              />
            </div>
          )}
        </div>
        
        {selectedDate && (
          <button
            onClick={() => {
              clearDateFilter();
              setShowCalendar(false);
            }}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Filtreyi Temizle
          </button>
        )}
      </div>

      <div className="grid gap-4">
        {filteredReservations.length === 0 ? (
          <p className="text-gray-500 text-center py-4">Rezervasyon bulunamadı.</p>
        ) : (
          filteredReservations.map((reservation) => (
            <div
              key={reservation.id}
              className="bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold">{reservation.name}</h3>
                  <p className="text-gray-600">{reservation.email}</p>
                  <p className="text-gray-600">{reservation.phone}</p>
                  <p className="text-gray-600">
                    {new Date(reservation.date).toLocaleDateString('tr-TR')} - {reservation.time}
                  </p>
                  <p className="text-gray-600">Kişi Sayısı: {reservation.guests}</p>
                  {reservation.message && (
                    <p className="text-gray-600 mt-2">{reservation.message}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditClick(reservation)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                  >
                    <Pencil size={20} />
                  </button>
                  <button
                    onClick={() => onDelete(reservation.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ReservationManagement;
