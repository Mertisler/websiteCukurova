import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const dataFilePath = path.join(process.cwd(), 'data', 'videos.json');

// Dizinin var olduğundan emin olma
function ensureDirectoryExists(filePath) {
  const dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  fs.mkdirSync(dirname, { recursive: true });
}

// Videoları getirme
function getVideos() {
  try {
    if (!fs.existsSync(dataFilePath)) {
      return [];
    }
    const data = fs.readFileSync(dataFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Videolar okunurken hata oluştu:', error);
    return [];
  }
}

// Videoları kaydetme
function saveVideos(videos) {
  try {
    ensureDirectoryExists(dataFilePath);
    fs.writeFileSync(dataFilePath, JSON.stringify(videos, null, 2), 'utf8');
    return true;
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
    const videos = getVideos();
    // Her bir videoyu normalize et
    const normalizedVideos = videos.map(normalizeVideoData);
    return NextResponse.json({ success: true, videos: normalizedVideos });
  } catch {
    return NextResponse.json({ success: false, message: 'Video işlemleri başarısız oldu' }, { status: 500 });
  }
}

// Yeni video ekle
export async function POST(request) {
  try {
    const body = await request.json();
    // video_url veya videoUrl olabilir, her ikisini de kontrol et
    const title = body.title;
    const videoUrl = body.videoUrl || body.video_url;

    if (!title || !videoUrl) {
      return NextResponse.json(
        { success: false, message: 'Başlık ve video URL\'si gereklidir.' },
        { status: 400 }
      );
    }

    const videos = getVideos();
    
    // Normalize edilmiş video verisi oluştur
    const normalizedData = normalizeVideoData(body);
    
    const newVideo = {
      id: body.id || uuidv4(),
      title,
      videoUrl,
      description: body.description || "",
      thumbnail_url: body.thumbnail_url || "",
      youtubeId: getYoutubeIdFromUrl(videoUrl),
      date: body.date || new Date().toISOString(),
    };

    videos.push(newVideo);
    const saved = saveVideos(videos);

    if (saved) {
      return NextResponse.json({ success: true, video: newVideo });
    } else {
      return NextResponse.json(
        { success: false, message: 'Video kaydedilemedi.' },
        { status: 500 }
      );
    }
  } catch {
    return NextResponse.json({ success: false, message: 'Video işlemleri başarısız oldu' }, { status: 500 });
  }
}

// Video silme
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Video ID\'si gereklidir.' },
        { status: 400 }
      );
    }

    let videos = getVideos();
    const initialLength = videos.length;
    videos = videos.filter(video => video.id !== id);

    if (videos.length === initialLength) {
      return NextResponse.json(
        { success: false, message: 'Belirtilen ID ile bir video bulunamadı.' },
        { status: 404 }
      );
    }

    const saved = saveVideos(videos);
    
    if (saved) {
      return NextResponse.json({ 
        success: true, 
        message: 'Video başarıyla silindi.' 
      });
    } else {
      return NextResponse.json(
        { success: false, message: 'Video silinirken bir hata oluştu.' },
        { status: 500 }
      );
    }
  } catch {
    return NextResponse.json({ success: false, message: 'Video işlemleri başarısız oldu' }, { status: 500 });
  }
} 