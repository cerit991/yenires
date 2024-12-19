import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { sendTelegramMessage } from '@/utils/telegram';

const dataFilePath = path.join(process.cwd(), 'data', 'rezervasyon.json');

// Tüm rezervasyonları getir
export async function GET() {
  try {
    const data = await fs.readFile(dataFilePath, 'utf8');
    const reservations = JSON.parse(data);
    return NextResponse.json(reservations);
  } catch (error) {
    return NextResponse.json({ error: 'Rezervasyonlar yüklenirken hata oluştu' }, { status: 500 });
  }
}

// Rezervasyon sil
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    const data = await fs.readFile(dataFilePath, 'utf8');
    let reservations = JSON.parse(data);
    
    // Silinecek rezervasyonu bul
    const reservationToDelete = reservations.find(reservation => String(reservation.id) === id);
    if (!reservationToDelete) {
      return NextResponse.json({ error: 'Rezervasyon bulunamadı' }, { status: 404 });
    }

    // Rezervasyonu sil
    reservations = reservations.filter(reservation => String(reservation.id) !== id);
    
    await fs.writeFile(dataFilePath, JSON.stringify(reservations, null, 2));
    
    // Telegram bildirimi gönder
    await sendTelegramMessage(`🗑️ Rezervasyon silindi\n\nMüşteri: ${reservationToDelete.name}\nTarih: ${reservationToDelete.date}\nSaat: ${reservationToDelete.time}`);
    
    return NextResponse.json({ message: 'Rezervasyon başarıyla silindi' });
  } catch (error) {
    return NextResponse.json({ error: 'Rezervasyon silinirken hata oluştu' }, { status: 500 });
  }
}

// Rezervasyon güncelle
export async function PUT(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const updatedReservation = await request.json();

    const data = await fs.readFile(dataFilePath, 'utf8');
    let reservations = JSON.parse(data);
    
    const index = reservations.findIndex(reservation => String(reservation.id) === id);
    if (index === -1) {
      return NextResponse.json({ error: 'Rezervasyon bulunamadı' }, { status: 404 });
    }

    // Mevcut rezervasyonu koru ve güncellenen alanları ekle
    reservations[index] = {
      ...reservations[index],
      ...updatedReservation,
      id: reservations[index].id // ID'yi koru
    };
    
    await fs.writeFile(dataFilePath, JSON.stringify(reservations, null, 2));

    // Telegram bildirimi gönder
    await sendTelegramMessage(`✏️ Rezervasyon güncellendi\nID: ${id}\nYeni Bilgiler: ${JSON.stringify(updatedReservation, null, 2)}`);
    
    return NextResponse.json({ 
      message: 'Rezervasyon başarıyla güncellendi',
      reservation: reservations[index]
    });
  } catch (error) {
    console.error('Rezervasyon güncellenirken hata:', error);
    return NextResponse.json({ error: 'Rezervasyon güncellenirken hata oluştu' }, { status: 500 });
  }
}
