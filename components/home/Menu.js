'use client'
import { useState, useEffect } from 'react';
import Image from 'next/image';

const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('Tümü');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await fetch('/api/menu');
        const data = await response.json();
        setMenuItems(data);
      } catch (error) {
        console.error('Menü yüklenirken hata:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  const categories = ['Tümü', ...new Set(menuItems.map(item => item.category))];

  const filteredItems = selectedCategory === 'Tümü'
    ? menuItems
    : menuItems.filter(item => item.category === selectedCategory);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-zinc-300"></div>
      </div>
    );
  }

  return (
    <div id="menu" className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-zinc-100 mb-4">
            Menümüz
          </h2>
          <p className="text-zinc-400 max-w-2xl mx-auto">
            Özenle hazırladığımız lezzetli yemeklerimizi keşfedin
          </p>
        </div>

        {/* Kategori Filtreleri */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
                ${selectedCategory === category
                  ? 'bg-purple-600 text-white'
                  : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Menü Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-zinc-800/50 backdrop-blur rounded-lg overflow-hidden hover:bg-zinc-800/70 transition-all"
            >
              <div className="relative h-48 sm:h-56">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 bg-zinc-700 flex items-center justify-center">
                    <span className="text-zinc-400">Resim yok</span>
                  </div>
                )}
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-zinc-100">
                    {item.name}
                  </h3>
                  <span className="text-purple-400 font-bold">
                    {item.price} 
                  </span>
                </div>
                <p className="text-zinc-400 text-sm line-clamp-2">
                  {item.description}
                </p>
                <div className="mt-2">
                  <span className="inline-block px-2 py-1 text-xs font-medium text-zinc-300 bg-zinc-700/50 rounded-full">
                    {item.category}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Boş Durum */}
        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-zinc-500">Bu kategoride henüz ürün bulunmuyor.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Menu;