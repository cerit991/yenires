import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const menuFilePath = path.join(process.cwd(), 'data', 'menu.json');

// Menü öğelerini getir
export async function GET() {
  try {
    const fileContent = await fs.readFile(menuFilePath, 'utf-8');
    const menuItems = JSON.parse(fileContent);
    return NextResponse.json(menuItems);
  } catch (error) {
    if (error.code === 'ENOENT') {
      // Dosya yoksa boş bir array oluştur
      await fs.writeFile(menuFilePath, '[]');
      return NextResponse.json([]);
    }
    return NextResponse.json({ error: 'Menü öğeleri yüklenirken hata oluştu' }, { status: 500 });
  }
}

// Yeni menü öğesi ekle
export async function POST(request) {
  try {
    const formData = await request.formData();
    const name = formData.get('name');
    const description = formData.get('description');
    const category = formData.get('category');
    const image = formData.get('image');

    // Resmi kaydet
    const imageBuffer = Buffer.from(await image.arrayBuffer());
    const imageExt = image.name.split('.').pop();
    const imageName = `${uuidv4()}.${imageExt}`;
    const imagePath = path.join(process.cwd(), 'public', 'images', 'menu', imageName);
    
    // images/menu klasörünü oluştur (yoksa)
    await fs.mkdir(path.join(process.cwd(), 'public', 'images', 'menu'), { recursive: true });
    
    await fs.writeFile(imagePath, imageBuffer);

    // Menü öğesini JSON dosyasına ekle
    const fileContent = await fs.readFile(menuFilePath, 'utf-8');
    const menuItems = JSON.parse(fileContent);
    
    const newMenuItem = {
      id: uuidv4(),
      name,
      description,
      category,
      image: `/images/menu/${imageName}`
    };
    
    menuItems.push(newMenuItem);
    await fs.writeFile(menuFilePath, JSON.stringify(menuItems, null, 2));

    return NextResponse.json(newMenuItem);
  } catch (error) {
    console.error('Menü öğesi eklenirken hata:', error);
    return NextResponse.json({ error: 'Menü öğesi eklenirken hata oluştu' }, { status: 500 });
  }
}
