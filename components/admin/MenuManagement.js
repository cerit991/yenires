'use client'
import { useState } from 'react';
import { Trash2, Plus, Image as ImageIcon, Loader2, Edit2 } from 'lucide-react';

const MenuManagement = ({ menuItems, onDelete, onRefresh }) => {
  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    category: '',
    image: null
  });

  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewItem(prev => ({ ...prev, image: file }));
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setNewItem({
      name: item.name,
      description: item.description,
      category: item.category,
      image: null
    });
    setPreviewUrl(item.image);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bu menü öğesini silmek istediğinizden emin misiniz?')) {
      setIsDeleting(true);
      try {
        const response = await fetch(`/api/menu/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          onRefresh();
        } else {
          console.error('Menü öğesi silinemedi');
        }
      } catch (error) {
        console.error('Silme işlemi sırasında hata:', error);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('name', newItem.name);
      formData.append('description', newItem.description);
      formData.append('category', newItem.category);
      if (newItem.image) {
        formData.append('image', newItem.image);
      }

      const url = editingItem ? `/api/menu/${editingItem.id}` : '/api/menu';
      const method = editingItem ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        body: formData,
      });

      if (response.ok) {
        setNewItem({
          name: '',
          description: '',
          category: '',
          image: null
        });
        setPreviewUrl(null);
        setEditingItem(null);
        onRefresh();
      }
    } catch (error) {
      console.error('Menü öğesi eklenirken hata:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="p-4 space-y-6">
      {/* Add New Item Form */}
      <form onSubmit={handleSubmit} className="space-y-4 bg-white rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4">
          {editingItem ? 'Menü Öğesi Düzenle' : 'Yeni Menü Öğesi Ekle'}
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              İsim
            </label>
            <input
              type="text"
              value={newItem.name}
              onChange={(e) => setNewItem(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              required
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Açıklama
            </label>
            <textarea
              value={newItem.description}
              onChange={(e) => setNewItem(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              rows="2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Kategori
            </label>
            <select
              value={newItem.category}
              onChange={(e) => setNewItem(prev => ({ ...prev, category: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              required
            >
              <option value="">Kategori Seçin</option>
              <option value="Başlangıçlar">Başlangıçlar</option>
              <option value="Ana Yemekler">Ana Yemekler</option>
              <option value="Tatlılar">Tatlılar</option>
              <option value="İçecekler">İçecekler</option>
              <option value="sarap">Şarap</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Resim
            </label>
            <div className="flex items-center space-x-2">
              <label className="cursor-pointer flex items-center justify-center w-full h-10 bg-gray-50 border-2 border-gray-300 border-dashed rounded-md hover:bg-gray-100">
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                <div className="flex items-center space-x-2">
                  <ImageIcon size={20} className="text-gray-400" />
                  <span className="text-sm text-gray-500">Resim Seç</span>
                </div>
              </label>
            </div>
          </div>

          {previewUrl && (
            <div className="sm:col-span-2">
              <img
                src={previewUrl}
                alt="Preview"
                className="w-32 h-32 object-cover rounded-lg"
              />
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2">
          {editingItem && (
            <button
              type="button"
              onClick={() => {
                setEditingItem(null);
                setNewItem({
                  name: '',
                  description: '',
                  category: '',
                  image: null
                });
                setPreviewUrl(null);
              }}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              İptal
            </button>
          )}
          <button
            type="submit"
            disabled={isUploading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400 flex items-center justify-center gap-2"
          >
            {isUploading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Yükleniyor...
              </>
            ) : (
              <>
                {editingItem ? (
                  <>
                    <Edit2 size={20} />
                    Güncelle
                  </>
                ) : (
                  <>
                    <Plus size={20} />
                    Ekle
                  </>
                )}
              </>
            )}
          </button>
        </div>
      </form>

      {/* Menu Items List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Mevcut Menü Öğeleri</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {menuItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg shadow-sm overflow-hidden"
            >
              {item.image && (
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold">{item.name}</h4>
                    <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                    <span className="inline-block px-2 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-full mt-2">
                      {item.category}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                      disabled={isDeleting}
                    >
                      <Edit2 size={20} />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                      disabled={isDeleting}
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MenuManagement;
