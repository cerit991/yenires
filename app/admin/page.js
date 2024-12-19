'use client'
import { useState, useEffect } from 'react';
import { UserPlus, Lock } from 'lucide-react';
import ReservationManagement from '@/components/admin/ReservationManagement';
import MenuManagement from '@/components/admin/MenuManagement';
import QuickReservation from '@/components/admin/QuickReservation';

const AdminPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('reservations');
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showQuickReservation, setShowQuickReservation] = useState(false);
  const [reservations, setReservations] = useState([]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsAuthenticated(true);
        // Giriş başarılı olduğunda şifreyi temizle
        setPassword('');
      } else {
        setError(data.error || 'Giriş başarısız');
      }
    } catch (error) {
      setError('Giriş yapılırken bir hata oluştu');
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchMenuItems();
      fetchReservations();
    }
  }, [isAuthenticated]);

  const fetchMenuItems = async () => {
    try {
      const response = await fetch('/api/menu');
      const data = await response.json();
      setMenuItems(data);
      setLoading(false);
    } catch (error) {
      console.error('Menü öğeleri yüklenirken hata:', error);
      setLoading(false);
    }
  };

  const fetchReservations = async () => {
    try {
      const response = await fetch('/api/reservations');
      if (response.ok) {
        const data = await response.json();
        setReservations(data);
      }
    } catch (error) {
      console.error('Rezervasyonlar alınırken hata:', error);
    }
  };

  const handleEditReservation = async (updatedReservation) => {
    try {
      const response = await fetch(`/api/admin/reservations?id=${updatedReservation.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedReservation),
      });

      if (response.ok) {
        fetchReservations(); // Listeyi güncelle
      } else {
        console.error('Rezervasyon güncellenirken hata oluştu');
      }
    } catch (error) {
      console.error('Rezervasyon güncellenirken hata:', error);
    }
  };

  const handleDeleteReservation = async (reservationId) => {
    if (window.confirm('Bu rezervasyonu silmek istediğinizden emin misiniz?')) {
      try {
        const response = await fetch(`/api/admin/reservations?id=${reservationId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          fetchReservations(); // Listeyi güncelle
        } else {
          console.error('Rezervasyon silinirken hata oluştu');
        }
      } catch (error) {
        console.error('Rezervasyon silinirken hata:', error);
      }
    }
  };

  const handleDeleteMenuItem = async (id) => {
    try {
      const response = await fetch('/api/menu', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        fetchMenuItems();
      }
    } catch (error) {
      console.error('Menü öğesi silinirken hata:', error);
    }
  };

  const handleQuickReservation = async (formData) => {
    try {
      const response = await fetch('/api/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        fetchReservations();
        setShowQuickReservation(false);
      }
    } catch (error) {
      console.error('Rezervasyon oluşturulurken hata:', error);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md w-96">
          <div className="flex items-center justify-center mb-6">
            <Lock className="w-12 h-12 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-center mb-6">Admin Girişi</h2>
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Şifre"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            {error && (
              <div className="mb-4 text-red-500 text-sm text-center">
                {error}
              </div>
            )}
            <button
              type="submit"
              className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary/90 transition-colors"
            >
              Giriş Yap
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {showQuickReservation && (
        <QuickReservation
          show={true}
          onClose={() => setShowQuickReservation(false)}
          onSubmit={handleQuickReservation}
        />
      )}

      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center sm:justify-start space-x-4">
            <button
              onClick={() => setActiveTab('reservations')}
              className={`px-3 py-4 text-sm font-medium ${
                activeTab === 'reservations'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Rezervasyonlar
            </button>
            <button
              onClick={() => setActiveTab('menu')}
              className={`px-3 py-4 text-sm font-medium ${
                activeTab === 'menu'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Menü Yönetimi
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {activeTab === 'reservations' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Rezervasyonlar</h2>
              <button
                onClick={() => setShowQuickReservation(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <UserPlus size={20} />
                <span className="hidden sm:inline">Hızlı Rezervasyon</span>
              </button>
            </div>
            <ReservationManagement
              reservations={reservations}
              onDelete={handleDeleteReservation}
              onEdit={handleEditReservation}
            />
          </div>
        )}
        {activeTab === 'menu' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Menü Yönetimi</h2>
            <div className="bg-white rounded-lg shadow">
              <MenuManagement
                menuItems={menuItems}
                onDelete={handleDeleteMenuItem}
                onRefresh={fetchMenuItems}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;