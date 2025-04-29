import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request) {
  try {
    // Gelen istek verisini al
    const body = await request.json();
    const { 
      ad, soyad, email, telefon, ogrenciNo, 
      fakulte, bolum, sinif, kulupTercih, mesaj, 
      formType 
    } = body;

    // Gerekli alanları kontrol et
    if (!ad || !soyad || !email || !ogrenciNo || !fakulte || !bolum || !sinif) {
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
        user: 'uyelik@baliz.org', // Kullanılacak e-posta adresi
        pass: process.env.EMAIL_PASSWORD // Şifre (güvenli olması için .env dosyasından alın)
      },
    });

    // Kulüp adını belirle
    let kulupAdi = "BALİZ PARMAK KULÜBÜ";
    if (kulupTercih === "baski-parmak") {
      kulupAdi = "BALİZ PARMAK KULÜBÜ";
    }

    // E-posta içeriği
    const mailOptions = {
      from: `"BALİZ Üyelik Formu" <uyelik@baliz.org>`,
      to: 'islermert88@gmail.com', // Kulüp yöneticisinin e-posta adresi
      subject: `Yeni Üyelik Başvurusu: ${ad} ${soyad}`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #444; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #f0f0f0; border-radius: 10px;">
          <h2 style="color: #d97706; border-bottom: 2px solid #fbbf24; padding-bottom: 10px;">Yeni Üyelik Başvurusu</h2>
          
          <div style="margin: 15px 0; padding: 10px; background-color: #fffbeb; border-radius: 5px; border-left: 4px solid #f59e0b;">
            <p style="margin: 0; font-weight: bold; color: #b45309;">${kulupAdi}</p>
          </div>
          
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #f0f0f0; width: 40%;"><strong>Ad:</strong></td>
              <td style="padding: 8px; border-bottom: 1px solid #f0f0f0;">${ad}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #f0f0f0;"><strong>Soyad:</strong></td>
              <td style="padding: 8px; border-bottom: 1px solid #f0f0f0;">${soyad}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #f0f0f0;"><strong>E-posta:</strong></td>
              <td style="padding: 8px; border-bottom: 1px solid #f0f0f0;">${email}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #f0f0f0;"><strong>Telefon:</strong></td>
              <td style="padding: 8px; border-bottom: 1px solid #f0f0f0;">${telefon || 'Belirtilmemiş'}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #f0f0f0;"><strong>Öğrenci No:</strong></td>
              <td style="padding: 8px; border-bottom: 1px solid #f0f0f0;">${ogrenciNo}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #f0f0f0;"><strong>Fakülte:</strong></td>
              <td style="padding: 8px; border-bottom: 1px solid #f0f0f0;">${fakulte}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #f0f0f0;"><strong>Bölüm:</strong></td>
              <td style="padding: 8px; border-bottom: 1px solid #f0f0f0;">${bolum}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #f0f0f0;"><strong>Sınıf:</strong></td>
              <td style="padding: 8px; border-bottom: 1px solid #f0f0f0;">${sinif}</td>
            </tr>
          </table>
          
          <div style="background-color: #fff8e1; padding: 15px; border-radius: 5px; margin-top: 20px;">
            <h3 style="color: #b45309; margin-top: 0;">Neden Katılmak İstiyor?</h3>
            <p style="white-space: pre-line;">${mesaj || 'Belirtilmemiş'}</p>
          </div>
          
          <div style="margin-top: 30px; font-size: 12px; color: #888; border-top: 1px solid #f0f0f0; padding-top: 10px;">
            <p>Bu e-posta BALİZ PARMAK KULÜBÜ web sitesi üzerinden gönderilmiştir.</p>
            <p>Başvuruyu değerlendirmek için lütfen <a href="http://baski-parmak.com/admin" style="color: #d97706; text-decoration: none;">admin paneli</a>ni ziyaret edin.</p>
          </div>
        </div>
      `,
    };

    // E-postayı gönder
    await transporter.sendMail(mailOptions);

    // Başvuru sahibine teşekkür e-postası gönder
    const userMailOptions = {
      from: `"BALİZ PARMAK KULÜBÜ" <uyelik@baliz.org>`,
      to: email,
      subject: `Üyelik Başvurunuz Alındı - ${kulupAdi}`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #444; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #f0f0f0; border-radius: 10px;">
          <h2 style="color: #d97706; border-bottom: 2px solid #fbbf24; padding-bottom: 10px;">Üyelik Başvurunuz Alındı</h2>
          
          <p style="margin-top: 20px;">Sayın ${ad} ${soyad},</p>
          
          <p>BALİZ PARMAK KULÜBÜ'ne üyelik başvurunuz tarafımıza ulaşmıştır. Başvurunuz kulüp yönetimi tarafından en kısa sürede değerlendirilecek ve sonuç hakkında size bilgi verilecektir.</p>
          
          <div style="background-color: #fffbeb; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #f59e0b;">
            <p style="margin: 0;"><strong>Başvurduğunuz Kulüp:</strong> ${kulupAdi}</p>
          </div>
          
          <p>Kulübümüze gösterdiğiniz ilgi için teşekkür ederiz.</p>
          
          <p style="margin-top: 20px;">
            Saygılarımızla,<br>
            BALİZ PARMAK KULÜBÜ Yönetimi
          </p>
          
          <div style="margin-top: 30px; font-size: 12px; color: #888; border-top: 1px solid #f0f0f0; padding-top: 10px;">
            <p>Bu e-posta otomatik olarak gönderilmiştir. Lütfen yanıtlamayınız.</p>
          </div>
        </div>
      `,
    };

    // Kullanıcıya teşekkür e-postası gönder
    await transporter.sendMail(userMailOptions);

    // Başarılı yanıt
    return NextResponse.json(
      { message: 'Başvurunuz başarıyla alındı.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Başvuru gönderme hatası:', error);
    
    // Hata yanıtı
    return NextResponse.json(
      { message: 'Başvurunuz gönderilirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.' },
      { status: 500 }
    );
  }
} 