import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request) {
  try {
    // Gelen istek verisini al
    const body = await request.json();
    const { name, email, subject, message, to } = body;

    // Gerekli alanları kontrol et
    if (!name || !email || !message || !to) {
      return NextResponse.json(
        { message: 'Lütfen tüm gerekli alanları doldurun.' },
        { status: 400 }
      );
    }

    // E-posta transporter oluştur (SMTP yapılandırması)
    const transporter = nodemailer.createTransport({
      host: 'srv1687.hstgr.io', // Hosting sağlayıcınızın SMTP sunucusu
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: 'iletisim@baliz.org', // Kullanılacak e-posta adresi
        pass: process.env.EMAIL_PASSWORD // Şifre (güvenli olması için .env dosyasından alın)
      },
    });

    // E-posta içeriği
    const mailOptions = {
      from: `"BALİZ İletişim Formu" <iletisim@baliz.org>`,
      to: to,
      subject: `İletişim Formu: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #444; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #f0f0f0; border-radius: 10px;">
          <h2 style="color: #d97706; border-bottom: 2px solid #fbbf24; padding-bottom: 10px;">Yeni İletişim Formu Mesajı</h2>
          
          <div style="margin: 20px 0;">
            <p><strong>Gönderen:</strong> ${name}</p>
            <p><strong>E-posta:</strong> ${email}</p>
            <p><strong>Konu:</strong> ${subject || 'Belirtilmemiş'}</p>
          </div>
          
          <div style="background-color: #fff8e1; padding: 15px; border-radius: 5px; margin-top: 20px;">
            <h3 style="color: #b45309; margin-top: 0;">Mesaj:</h3>
            <p style="white-space: pre-line;">${message}</p>
          </div>
          
          <div style="margin-top: 30px; font-size: 12px; color: #888; border-top: 1px solid #f0f0f0; padding-top: 10px;">
            <p>Bu e-posta BALİZ PARMAK KULÜBÜ web sitesi üzerinden gönderilmiştir.</p>
          </div>
        </div>
      `,
    };

    // E-postayı gönder
    await transporter.sendMail(mailOptions);

    // Başarılı yanıt
    return NextResponse.json(
      { message: 'E-posta başarıyla gönderildi.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('E-posta gönderme hatası:', error);
    
    // Hata yanıtı
    return NextResponse.json(
      { message: 'E-posta gönderilirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.' },
      { status: 500 }
    );
  }
} 