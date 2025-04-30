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

    console.log('E-posta gönderiliyor:', { name, email, to });

    // Test hesabı oluştur (bu gerçek e-posta göndermese de test için kullanışlı)
    const testAccount = await nodemailer.createTestAccount();
    console.log('Test hesabı oluşturuldu:', testAccount.user);

    // Ethereal (test) SMTP sunucusu ile transport oluşturma
    const transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    // E-posta içeriği
    const mailOptions = {
      from: `"BALİZ İletişim Formu" <${testAccount.user}>`,
      to: to, // Form içinde belirtilen hedef e-posta
      subject: `İletişim Formu: ${subject || 'Konu Belirtilmemiş'}`,
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
      text: `Gönderen: ${name}\nE-posta: ${email}\nKonu: ${subject || 'Belirtilmemiş'}\n\nMesaj:\n${message}\n\nBu e-posta BALİZ PARMAK KULÜBÜ web sitesi üzerinden gönderilmiştir.`,
    };

    // E-postayı gönder
    const info = await transporter.sendMail(mailOptions);
    console.log('E-posta gönderildi:', info.messageId);
    
    // Test e-postasının URL'ini konsola yazdır (bu URL'den gönderilen e-posta görüntülenebilir)
    const previewUrl = nodemailer.getTestMessageUrl(info);
    console.log('E-posta önizleme URL:', previewUrl);

    // Başarılı yanıt
    return NextResponse.json(
      { 
        message: 'İletişim formunuz başarıyla alındı. En kısa sürede size dönüş yapacağız.',
        previewUrl: previewUrl // Bu URL ile gönderilen e-postayı görüntüleyebilirsiniz
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('E-posta gönderme hatası:', error);
    
    // Hata yanıtı
    return NextResponse.json(
      { 
        message: 'İletişim formu alındı, ancak e-posta gönderilirken bir sorun oluştu. Lütfen daha sonra tekrar deneyiniz.',
        error: error.message || 'Bilinmeyen hata'
      },
      { status: 200 } // Kullanıcıya hata göstermemek için 200 dönüyoruz
    );
  }
} 