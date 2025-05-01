import mysql from 'mysql2/promise';

// Veritabanı bağlantı bilgileri - verilen gerçek bağlantı bilgileriyle güncellendi
export const dbConfig = {
  host: 'srv1971.hstgr.io',      // Sağlanan host bilgisi
  port: 3306,                     // MySQL varsayılan port
  user: 'u284653657_root',        // Sağlanan kullanıcı adı
  password: 'mertISLER123',       // Sağlanan şifre
  database: 'u284653657_balizparmak', // Sağlanan veritabanı adı
  connectTimeout: 60000           // 60 saniye bağlantı zaman aşımı
};

// Bağlantı havuzu oluşturma
let pool;
let useLocalStorageFallback = false;

/**
 * MySQL bağlantı havuzunu başlatma
 */
export const initializePool = () => {
  try {
    // Daha önce havuz oluşturulmuşsa tekrar oluşturma
    if (pool) {
      return pool;
    }

    console.log('MySQL bağlantı havuzu başlatılıyor... Bağlantı bilgileri:', 
      `Host: ${dbConfig.host}, User: ${dbConfig.user}, Database: ${dbConfig.database}`);

    // Yeni havuz oluştur
    pool = mysql.createPool({
      ...dbConfig,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      connectTimeout: 60000,      // 60 saniye bağlantı zaman aşımı
      enableKeepAlive: true,
      keepAliveInitialDelay: 10000, // 10 saniye keepalive
      trace: true                 // Bağlantı hatalarını izle
    });
    
    console.log('MySQL bağlantı havuzu başlatıldı');
    
    // Bağlantı başarılı olduğunda localStorage yedeklemeyi kapat
    useLocalStorageFallback = false;
    
    return pool;
  } catch (error) {
    console.error('MySQL bağlantı havuzu oluşturulurken hata:', error);
    useLocalStorageFallback = true;
    return null;
  }
};

// Client tarafı kontrolü
const isClient = typeof window !== 'undefined';

/**
 * Client tarafında localStorage'dan veri alma
 * @param {string} key - Veri anahtarı
 * @returns {any} - Alınan veri
 */
const getLocalData = (key) => {
  if (isClient) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('localStorage veri okuma hatası:', error);
      return null;
    }
  }
  return null;
};

/**
 * Client tarafında localStorage'a veri kaydetme
 * @param {string} key - Veri anahtarı
 * @param {any} data - Kaydedilecek veri
 */
const saveLocalData = (key, data) => {
  if (isClient) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error('localStorage veri yazma hatası:', error);
    }
  }
};

/**
 * SQL sorgusu çalıştırma
 * @param {Object} params - Sorgu parametreleri
 * @param {string} params.query - SQL sorgusu
 * @param {Array} params.values - Sorgu için değerler
 * @returns {Promise<any>} - Sorgu sonucu
 */
export async function executeQuery({ query, values = [] }) {
  try {
    if (useLocalStorageFallback) {
      throw new Error('Veritabanı bağlantısı kullanılamıyor, localStorage kullanılacak');
    }

    if (!pool) {
      try {
        pool = initializePool();
        if (!pool) {
          throw new Error('Veritabanı bağlantı havuzu oluşturulamadı');
        }
      } catch (error) {
        useLocalStorageFallback = true;
        console.warn('Veritabanına bağlanılamadı, localStorage kullanılacak');
        throw error;
      }
    }

    const [results] = await pool.execute(query, values);
    return results;
  } catch (error) {
    console.error('Sorgu çalıştırılırken hata:', error);
    // Hatayı yukarıya fırlat, çağıran fonksiyon localStorage'a düşebilir
    throw error;
  }
}

/**
 * Veritabanı tablolarını oluşturma
 */
export async function setupDatabase() {
  try {
    // Veritabanına bağlanabilir miyiz?
    if (useLocalStorageFallback || !pool) {
      try {
        pool = initializePool();
        if (!pool) {
          console.warn('Veritabanı bağlantı havuzu başlatılamadı. Tablo oluşturma atlanıyor.');
          return false;
        }
        
        // Bağlantı başarılı ise, artık localStorage'ı yedek olarak kullanmaya gerek yok
        useLocalStorageFallback = false;
      } catch (error) {
        console.error('Veritabanı havuzu başlatılamadı:', error);
        return false;
      }
    }
    
    // Announcements tablosunu oluştur
    await executeQuery({
      query: `
        CREATE TABLE IF NOT EXISTS announcements (
          id BIGINT PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          content TEXT NOT NULL,
          date VARCHAR(50) NOT NULL,
          image_url VARCHAR(255) DEFAULT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `
    });
    
    console.log('Veritabanı tabloları başarıyla oluşturuldu');
    return true;
  } catch (error) {
    console.error('Veritabanı tabloları oluşturulurken hata:', error);
    return false;
  }
}

/**
 * Videolar için veritabanı tablosunu oluşturma
 */
export async function setupVideosTable() {
  try {
    await executeQuery({
      query: `
        CREATE TABLE IF NOT EXISTS videos (
          id BIGINT PRIMARY KEY AUTO_INCREMENT,
          title VARCHAR(255) NOT NULL,
          description TEXT,
          video_url VARCHAR(255) NOT NULL,
          thumbnail_url VARCHAR(255),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
      `
    });
    console.log('Videolar tablosu başarıyla oluşturuldu');
    return true;
  } catch (error) {
    console.error('Videolar tablosu oluşturulurken hata:', error);
    return false;
  }
}

// Duyuru ile ilgili veritabanı işlemleri
export const announcementsDb = {
  // Tüm duyuruları getir
  getAllAnnouncements: async () => {
    try {
      const results = await executeQuery({
        query: 'SELECT * FROM announcements ORDER BY id DESC'
      });
      return results;
    } catch (error) {
      console.error('Duyurular alınırken hata:', error);
      
      // Veritabanı hatası durumunda localStorage'dan al
      if (typeof window !== 'undefined') {
        const localAnnouncements = getLocalData('announcements');
        return localAnnouncements || [];
      }
      
      // Hata durumunda boş dizi döndür
      return [];
    }
  },
  
  // ID'ye göre duyuru getir
  getAnnouncementById: async (id) => {
    try {
      const results = await executeQuery({
        query: 'SELECT * FROM announcements WHERE id = ?',
        values: [id]
      });
      return results.length > 0 ? results[0] : null;
    } catch (error) {
      console.error('Duyuru alınırken hata:', error);
      
      // Veritabanı hatası durumunda localStorage'dan al
      if (typeof window !== 'undefined') {
        const localAnnouncements = getLocalData('announcements');
        if (localAnnouncements) {
          return localAnnouncements.find(announcement => announcement.id === id) || null;
        }
      }
      
      return null;
    }
  },
  
  // Yeni duyuru ekle
  addAnnouncement: async (announcement) => {
    try {
      await executeQuery({
        query: 'INSERT INTO announcements (id, title, content, date, image_url) VALUES (?, ?, ?, ?, ?)',
        values: [
          announcement.id,
          announcement.title,
          announcement.content,
          announcement.date,
          announcement.image_url || null // Eğer image_url yoksa null olarak ayarla
        ]
      });
      return announcement;
    } catch (error) {
      console.error('Duyuru eklenirken hata:', error);
      
      // Veritabanı hatası durumunda localStorage'a kaydet
      if (typeof window !== 'undefined') {
        const localAnnouncements = getLocalData('announcements') || [];
        const updatedAnnouncements = [announcement, ...localAnnouncements];
        saveLocalData('announcements', updatedAnnouncements);
        console.log('Duyuru localStorage\'a kaydedildi');
        return announcement;
      }
      
      throw error;
    }
  },
  
  // Duyuru güncelle
  updateAnnouncement: async (id, updatedData) => {
    try {
      await executeQuery({
        query: 'UPDATE announcements SET title = ?, content = ?, image_url = ? WHERE id = ?',
        values: [
          updatedData.title, 
          updatedData.content, 
          updatedData.image_url || null, // Eğer image_url yoksa null olarak ayarla
          id
        ]
      });
      
      return { ...updatedData, id };
    } catch (error) {
      console.error('Duyuru güncellenirken hata:', error);
      
      // Veritabanı hatası durumunda localStorage'a kaydet
      if (typeof window !== 'undefined') {
        const localAnnouncements = getLocalData('announcements') || [];
        const index = localAnnouncements.findIndex(item => item.id === id);
        
        if (index !== -1) {
          const updatedAnnouncement = { ...localAnnouncements[index], ...updatedData };
          localAnnouncements[index] = updatedAnnouncement;
          saveLocalData('announcements', localAnnouncements);
          console.log('Duyuru localStorage\'da güncellendi');
          return updatedAnnouncement;
        }
      }
      
      throw error;
    }
  },
  
  // Duyuru sil
  deleteAnnouncement: async (id) => {
    try {
      const result = await executeQuery({
        query: 'DELETE FROM announcements WHERE id = ?',
        values: [id]
      });
      
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Duyuru silinirken hata:', error);
      
      // Veritabanı hatası durumunda localStorage'dan sil
      if (typeof window !== 'undefined') {
        const localAnnouncements = getLocalData('announcements') || [];
        const updatedAnnouncements = localAnnouncements.filter(item => item.id !== id);
        
        if (updatedAnnouncements.length < localAnnouncements.length) {
          saveLocalData('announcements', updatedAnnouncements);
          console.log('Duyuru localStorage\'dan silindi');
          return true;
        }
        
        return false;
      }
      
      throw error;
    }
  }
};

// Videolar ile ilgili veritabanı işlemleri
export const videosDb = {
  // Tüm videoları getir
  getAllVideos: async () => {
    try {
      const results = await executeQuery({
        query: 'SELECT * FROM videos ORDER BY created_at DESC'
      });
      return results;
    } catch (error) {
      console.error('Videolar alınırken hata:', error);
      return [];
    }
  },
  
  // ID'ye göre video getir
  getVideoById: async (id) => {
    try {
      const results = await executeQuery({
        query: 'SELECT * FROM videos WHERE id = ?',
        values: [id]
      });
      return results.length > 0 ? results[0] : null;
    } catch (error) {
      console.error('Video alınırken hata:', error);
      return null;
    }
  },
  
  // Yeni video ekle
  addVideo: async (video) => {
    try {
      const result = await executeQuery({
        query: 'INSERT INTO videos (title, description, video_url, thumbnail_url) VALUES (?, ?, ?, ?)',
        values: [
          video.title,
          video.description,
          video.video_url,
          video.thumbnail_url || null
        ]
      });
      return { ...video, id: result.insertId };
    } catch (error) {
      console.error('Video eklenirken hata:', error);
      throw error;
    }
  },
  
  // Video güncelle
  updateVideo: async (id, updatedData) => {
    try {
      await executeQuery({
        query: 'UPDATE videos SET title = ?, description = ?, video_url = ?, thumbnail_url = ? WHERE id = ?',
        values: [
          updatedData.title,
          updatedData.description,
          updatedData.video_url,
          updatedData.thumbnail_url || null,
          id
        ]
      });
      return { ...updatedData, id };
    } catch (error) {
      console.error('Video güncellenirken hata:', error);
      throw error;
    }
  },
  
  // Video sil
  deleteVideo: async (id) => {
    try {
      const result = await executeQuery({
        query: 'DELETE FROM videos WHERE id = ?',
        values: [id]
      });
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Video silinirken hata:', error);
      throw error;
    }
  }
}; 