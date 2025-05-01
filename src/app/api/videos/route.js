import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { videosDb } from '@/lib/db';

// Dosya yolu - hem geliştirme hem de prodüksiyon için çalışır
const dataFilePath = path.join(process.cwd(), 'data', 'videos.json');

// Dizinin var olduğundan emin olma
function ensureDirectoryExists(filePath) {
  try {
    const dirname = path.dirname(filePath);
    if (fs.existsSync(dirname)) {
      return true;
    }
    fs.mkdirSync(dirname, { recursive: true });
    return true;
  } catch (error) {
    console.error('Dizin oluşturma hatası:', error);
    // Vercel'de dizin oluşturma başarısız olabilir, bu durumda false döndürme
    return false;
  }
}

// Videoları veritabanından getirme
async function getVideos() {
  try {
    const videos = await videosDb.getAllVideos();
    return videos;
  } catch (error) {
    console.error('Videolar veritabanından alınırken hata oluştu:', error);
    return [];
  }
}

// Videoları kaydetme
function saveVideos(videos) {
  try {
    // Vercel prodüksiyon ortamında dosya sistemine yazma işlemi yapılmayabilir
    // Bu durumda sadece geliştirme ortamında dosyaya yazılır
    if (process.env.NODE_ENV !== 'production') {
      const directoryCreated = ensureDirectoryExists(dataFilePath);
      if (directoryCreated) {
        fs.writeFileSync(dataFilePath, JSON.stringify(videos, null, 2), 'utf8');
        console.log('Videoları JSON dosyasına kaydetme başarılı');
        return true;
      } else {
        console.error('Dizin oluşturulamadığı için videolar kaydedilemedi');
        return false;
      }
    } else {
      console.log('Prodüksiyon ortamında, dosya yazma işlemi atlandı');
      // Prodüksiyon ortamında başarılı kabul et
      return true;
    }
  } catch (error) {
    console.error('Videolar kaydedilirken hata oluştu:', error);
    return false;
  }
}

// YouTube URL'inden video ID'sini çıkarır
function getYoutubeIdFromUrl(url) {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

// Video verilerini normalleştirir
function normalizeVideoData(video) {
  // Kopyalama ile çalış, orijinal objeyi değiştirme
  const normalized = { ...video };
  
  // Alan adı uyumluluklarını kontrol et
  if (normalized.video_url && !normalized.videoUrl) {
    normalized.videoUrl = normalized.video_url;
  }
  
  // YouTube ID bilgisini ekle
  if (!normalized.youtubeId && normalized.videoUrl) {
    normalized.youtubeId = getYoutubeIdFromUrl(normalized.videoUrl);
  }
  
  return normalized;
}

// Tüm videoları getir
export async function GET() {
  try {
    console.log('Video getirme isteği alındı');
    const videos = await getVideos();
    console.log(`${videos.length} video bulundu`);
    
    // Her bir videoyu normalize et
    const normalizedVideos = videos.map(normalizeVideoData);
    
    // Videoları tarihe göre sırala (en yeniden en eskiye)
    normalizedVideos.sort((a, b) => {
      // Tarih formatını karşılaştırılabilir formata çevir
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateB - dateA; // Azalan sıralama (en yeni en üstte)
    });
    
    return NextResponse.json({ success: true, videos: normalizedVideos });
  } catch (error) {
    console.error('GET video hatası:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Video işlemleri başarısız oldu',
      error: error.message
    }, { status: 500 });
  }
}

// Yeni video ekle
export async function POST(request) {
  try {
    console.log('Video ekleme isteği alındı');
    const data = await request.json();
    console.log('Alınan video verileri:', data);
    
    // video_url veya videoUrl olabilir, her ikisini de kontrol et
    const title = data.title;
    const videoUrl = data.videoUrl || data.video_url;
    const description = data.description || "";
    const thumbnail_url = data.thumbnail_url || "";

    if (!title || !videoUrl) {
      return NextResponse.json(
        { success: false, message: 'Başlık ve video URL\'si gereklidir.' },
        { status: 400 }
      );
    }

    // VERİTABANI YAKLAŞIMINA GEÇİŞ - YENİ VİDEO OLUŞTUR
    const newVideo = {
      title,
      description,
      video_url: videoUrl,
      thumbnail_url
    };

    // VERİTABANINA KAYDET
    const savedVideo = await videosDb.addVideo(newVideo);
    
    if (savedVideo) {
      console.log('Video başarıyla veritabanına eklendi');
      return NextResponse.json({ 
        success: true, 
        video: savedVideo,
        message: 'Video başarıyla veritabanına kaydedildi.'
      });
    } else {
      console.error('Video veritabanına kaydedilemedi');
      return NextResponse.json(
        { success: false, message: 'Video veritabanına kaydedilemedi.' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('POST video hatası:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Video işlemleri başarısız oldu',
      error: error.message 
    }, { status: 500 });
  }
}

// Video silme
export async function DELETE(request) {
  try {
    console.log('Video silme isteği alındı');
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    console.log('Silinecek video ID:', id);

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Video ID\'si gereklidir.' },
        { status: 400 }
      );
    }

    // VERİTABANINDAN SİL
    const result = await videosDb.deleteVideo(id);
    
    if (result) {
      console.log('Video başarıyla veritabanından silindi');
      return NextResponse.json({ 
        success: true, 
        message: 'Video başarıyla silindi.' 
      });
    } else {
      console.error('Video silinirken hata oluştu');
      return NextResponse.json(
        { success: false, message: 'Video silinirken bir hata oluştu veya video bulunamadı.' },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error('DELETE video hatası:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Video işlemleri başarısız oldu',
      error: error.message 
    }, { status: 500 });
  }
}

// Yeni video ekleme
async function addVideo(video) {
  try {
    const yeniVideo = await videosDb.addVideo(video);
    return yeniVideo;
  } catch (error) {
    console.error('Video veritabanına eklenirken hata oluştu:', error);
    return null;
  }
}