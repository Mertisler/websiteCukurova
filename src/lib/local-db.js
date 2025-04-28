// localStorage ile çalışan lokal veritabanı işlemleri

// Verileri localStorage'a kaydetme fonksiyonu
export function saveData(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

// Verileri localStorage'dan alma fonksiyonu
export function getData(key) {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
}

// Duyuru yapısının başlangıç durumunu kontrol et ve gerekirse oluştur
export function initializeAnnouncementsIfNeeded() {
  if (!localStorage.getItem('announcements')) {
    localStorage.setItem('announcements', JSON.stringify([]));
  }
}

// Duyuru ile ilgili veritabanı işlemleri
export const announcementsDb = {
  // Tüm duyuruları getir
  getAllAnnouncements: () => {
    initializeAnnouncementsIfNeeded();
    return getData('announcements') || [];
  },
  
  // ID'ye göre duyuru getir
  getAnnouncementById: (id) => {
    const announcements = announcementsDb.getAllAnnouncements();
    return announcements.find(announcement => announcement.id === id) || null;
  },
  
  // Yeni duyuru ekle
  addAnnouncement: (announcement) => {
    const announcements = announcementsDb.getAllAnnouncements();
    
    // ID yoksa oluştur
    if (!announcement.id) {
      announcement.id = Date.now();
    }
    
    // Tarih yoksa ekle
    if (!announcement.date) {
      announcement.date = new Date().toLocaleDateString('tr-TR');
    }
    
    const updatedAnnouncements = [announcement, ...announcements];
    saveData('announcements', updatedAnnouncements);
    
    return announcement;
  },
  
  // Duyuru güncelle
  updateAnnouncement: (id, updatedData) => {
    const announcements = announcementsDb.getAllAnnouncements();
    const index = announcements.findIndex(announcement => announcement.id === id);
    
    if (index === -1) {
      return null;
    }
    
    const updatedAnnouncement = {
      ...announcements[index],
      ...updatedData,
      id // ID'nin değişmemesini sağlar
    };
    
    announcements[index] = updatedAnnouncement;
    saveData('announcements', announcements);
    
    return updatedAnnouncement;
  },
  
  // Duyuru sil
  deleteAnnouncement: (id) => {
    const announcements = announcementsDb.getAllAnnouncements();
    const updatedAnnouncements = announcements.filter(announcement => announcement.id !== id);
    
    if (updatedAnnouncements.length === announcements.length) {
      return false; // Hiçbir duyuru silinmediyse false döndür
    }
    
    saveData('announcements', updatedAnnouncements);
    return true;
  },
  
  // Tüm duyuruları temizle
  clearAllAnnouncements: () => {
    saveData('announcements', []);
  }
};