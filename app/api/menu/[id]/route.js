import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const menuFilePath = path.join(process.cwd(), 'data', 'menu.json');

// Menü öğesi güncelle
export async function PUT(request, { params }) {
  const id = params.id;
  try {
    const formData = await request.formData();
    
    // Mevcut menü öğelerini oku
    const fileContent = await fs.readFile(menuFilePath, 'utf-8');
    const menuItems = JSON.parse(fileContent);
    
    // Güncellenecek öğeyi bul
    const itemIndex = menuItems.findIndex(item => item.id === id);
    if (itemIndex === -1) {
      return NextResponse.json({ error: 'Menü öğesi bulunamadı' }, { status: 404 });
    }

    const existingItem = menuItems[itemIndex];
    let imagePath = existingItem.image;

    // Yeni resim yüklendiyse
    const image = formData.get('image');
    if (image && image.size > 0) {
      // Eski resmi sil
      if (existingItem.image) {
        const oldImagePath = path.join(process.cwd(), 'public', existingItem.image);
        try {
          await fs.unlink(oldImagePath);
        } catch (error) {
          console.error('Eski resim silinirken hata:', error);
        }
      }

      // Yeni resmi kaydet
      const fileExtension = image.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExtension}`;
      const newImagePath = path.join(process.cwd(), 'public', 'images', 'menu', fileName);
      
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      await fs.writeFile(newImagePath, buffer);
      imagePath = `/images/menu/${fileName}`;
    }

    // Öğeyi güncelle
    const updatedItem = {
      ...existingItem,
      name: formData.get('name'),
      description: formData.get('description'),
      category: formData.get('category'),
      image: imagePath
    };

    menuItems[itemIndex] = updatedItem;
    await fs.writeFile(menuFilePath, JSON.stringify(menuItems, null, 2));

    return NextResponse.json(updatedItem);
  } catch (error) {
    console.error('Menü öğesi güncellenirken hata:', error);
    return NextResponse.json({ error: 'Menü öğesi güncellenirken hata oluştu' }, { status: 500 });
  }
}

// Menü öğesi sil
export async function DELETE(request, { params }) {
  const id = params.id;
  try {
    // Mevcut menü öğelerini oku
    const fileContent = await fs.readFile(menuFilePath, 'utf-8');
    const menuItems = JSON.parse(fileContent);
    
    // Silinecek öğeyi bul
    const itemToDelete = menuItems.find(item => item.id === id);
    if (!itemToDelete) {
      return NextResponse.json({ error: 'Menü öğesi bulunamadı' }, { status: 404 });
    }

    // Resmi sil
    if (itemToDelete.image) {
      const imagePath = path.join(process.cwd(), 'public', itemToDelete.image);
      try {
        await fs.unlink(imagePath);
      } catch (error) {
        console.error('Resim silinirken hata:', error);
      }
    }

    // Öğeyi listeden çıkar
    const updatedMenuItems = menuItems.filter(item => item.id !== id);
    await fs.writeFile(menuFilePath, JSON.stringify(updatedMenuItems, null, 2));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Menü öğesi silinirken hata:', error);
    return NextResponse.json({ error: 'Menü öğesi silinirken hata oluştu' }, { status: 500 });
  }
}
