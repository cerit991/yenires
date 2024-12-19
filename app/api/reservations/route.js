import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { sendTelegramMessage } from '@/utils/telegram';

const dataFilePath = path.join(process.cwd(), 'data', 'rezervasyon.json');

// Yardımcı fonksiyonlar
const readReservations = async () => {
  try {
    const fileContent = await fs.readFile(dataFilePath, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error('Rezervasyon dosyası okunamadı:', error);
    return [];
  }
};

const writeReservations = async (reservations) => {
  await fs.writeFile(
    dataFilePath,
    JSON.stringify(reservations, null, 2)
  );
};

export async function GET() {
  try {
    const reservations = await readReservations();
    return NextResponse.json(reservations);
  } catch (error) {
    console.error('Rezervasyonlar alınırken hata:', error);
    return NextResponse.json(
      { error: 'Rezervasyonlar alınamadı' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const newReservation = {
      id: uuidv4(),
      ...data,
      createdAt: new Date().toISOString()
    };

    const reservations = await readReservations();
    reservations.push(newReservation);

    await writeReservations(reservations);

    // Telegram bildirimi gönder
    const message = `
🎉 <b>Yeni Rezervasyon!</b>

👤 <b>Müşteri:</b> ${data.name}
📞 <b>Telefon:</b> ${data.phone}
📧 <b>E-posta:</b> ${data.email}
📅 <b>Tarih:</b> ${new Date(data.date).toLocaleDateString('tr-TR')}
🕒 <b>Saat:</b> ${data.time}
👥 <b>Kişi Sayısı:</b> ${data.guests}
${data.message ? `\n💬 <b>Not:</b> ${data.message}` : ''}
`;

    await sendTelegramMessage(message);

    return NextResponse.json(newReservation);
  } catch (error) {
    console.error('Rezervasyon oluşturulurken hata:', error);
    return NextResponse.json(
      { error: 'Rezervasyon oluşturulamadı' },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const data = await request.json();
    const { id } = data;

    if (!id) {
      return NextResponse.json({ error: 'ID parametresi gerekli' }, { status: 400 });
    }

    const reservations = await readReservations();
    const reservationIndex = reservations.findIndex(r => r.id === id);
    if (reservationIndex === -1) {
      return NextResponse.json({ error: 'Rezervasyon bulunamadı' }, { status: 404 });
    }

    const oldReservation = reservations[reservationIndex];
    const updatedReservation = { ...oldReservation, ...data };
    reservations[reservationIndex] = updatedReservation;

    await writeReservations(reservations);

    // Rezervasyon güncelleme bildirimi
    const message = `
📝 <b>Rezervasyon Güncellendi!</b>

👤 <b>Müşteri:</b> ${updatedReservation.name}
📞 <b>Telefon:</b> ${updatedReservation.phone}
📧 <b>E-posta:</b> ${updatedReservation.email}
📅 <b>Tarih:</b> ${new Date(updatedReservation.date).toLocaleDateString('tr-TR')}
🕒 <b>Saat:</b> ${updatedReservation.time}
👥 <b>Kişi Sayısı:</b> ${updatedReservation.guests}
${updatedReservation.message ? `\n💬 <b>Not:</b> ${updatedReservation.message}` : ''}
`;

    await sendTelegramMessage(message);
    return NextResponse.json(updatedReservation);
  } catch (error) {
    console.error('Rezervasyon güncellenirken hata:', error);
    return NextResponse.json(
      { error: 'Rezervasyon güncellenemedi' },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID parametresi gerekli' }, { status: 400 });
    }

    // Mevcut rezervasyonları oku
    const fileContent = await fs.readFile(dataFilePath, 'utf-8');
    const reservations = JSON.parse(fileContent);
    
    // Silinecek rezervasyonu bul
    const reservation = reservations.find(r => r.id === id);
    if (!reservation) {
      return NextResponse.json({ error: 'Rezervasyon bulunamadı' }, { status: 404 });
    }

    // Rezervasyonu sil
    const updatedReservations = reservations.filter(r => r.id !== id);
    await fs.writeFile(dataFilePath, JSON.stringify(updatedReservations, null, 2));

    // Telegram bildirimi gönder
    const message = `
❌ <b>Rezervasyon Silindi!</b>

👤 <b>Müşteri:</b> ${reservation.name}
📅 <b>Tarih:</b> ${new Date(reservation.date).toLocaleDateString('tr-TR')}
🕒 <b>Saat:</b> ${reservation.time}
👥 <b>Kişi Sayısı:</b> ${reservation.guests}
`;

    console.log('Telegram bildirimi gönderiliyor:', message); // Debug için log
    await sendTelegramMessage(message);
    console.log('Telegram bildirimi gönderildi'); // Debug için log

    return NextResponse.json({ success: true, message: 'Rezervasyon başarıyla silindi' });
  } catch (error) {
    console.error('Rezervasyon silinirken hata:', error);
    return NextResponse.json(
      { error: 'Rezervasyon silinemedi: ' + error.message },
      { status: 500 }
    );
  }
}
