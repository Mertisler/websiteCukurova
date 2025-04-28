import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';

// Yüklenen görselleri saklamak için dizin
const uploadsDir = join(process.cwd(), 'public/uploads');

// POST isteği ile görsel yükleme
export async function POST(request) {
  try {
    // Dizinin var olduğundan emin ol, yoksa oluştur
    if (!existsSync(uploadsDir)) {
      mkdirSync(uploadsDir, { recursive: true });
    }

    const formData = await request.formData();
    const file = formData.get('image');

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Görsel yüklenemedi. Geçerli bir dosya gönderilmedi.' 
        }, 
        { status: 400 }
      );
    }

    // Dosya uzantısını al
    const originalFileName = file.name;
    const extension = originalFileName.split('.').pop().toLowerCase();
    
    // İzin verilen görsel uzantıları
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
    
    if (!allowedExtensions.includes(extension)) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Yalnızca resim dosyaları yükleyebilirsiniz (jpg, jpeg, png, gif, webp).' 
        }, 
        { status: 400 }
      );
    }

    // Benzersiz dosya adı oluştur
    const timestamp = Date.now();
    const fileName = `image_${timestamp}.${extension}`;
    const filePath = join(uploadsDir, fileName);
    
    // Dosyayı kaydet
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    await writeFile(filePath, fileBuffer);
    
    // Erişilebilir URL oluştur
    const imageUrl = `/uploads/${fileName}`;
    
    return NextResponse.json(
      { 
        success: true, 
        message: 'Görsel başarıyla yüklendi',
        imageUrl 
      }, 
      { status: 200 }
    );
    
  } catch (error) {
    console.error('Görsel yükleme hatası:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'Görsel yüklenirken bir hata oluştu: ' + error.message 
      }, 
      { status: 500 }
    );
  }
} 