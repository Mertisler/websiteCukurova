import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-amber-600 text-white mt-12">
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">BALİZ PARMAK KULÜBÜ</h3>
            <p className="mb-4 text-amber-100">
              Güncel duyurular ve haberler için tek adres.
            </p>
            <p className="text-amber-200 text-sm">
              &copy; {currentYear} Tüm hakları saklıdır.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Hızlı Bağlantılar</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-amber-100 hover:text-white transition-colors">
                  Ana Sayfa
                </Link>
              </li>
              <li>
                <Link href="/hakkimizda" className="text-amber-100 hover:text-white transition-colors">
                  Hakkımızda
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-amber-100 hover:text-white transition-colors">
                  Yönetici Girişi
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap justify-center gap-6 items-center">
          <a href="https://www.instagram.com/balizparmak.01?igsh=M254ODh0d25ibXNh" target="_blank" rel="noopener noreferrer" className="text-amber-100 hover:text-white transition-colors flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6 mr-2">
              <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5A4.25 4.25 0 0 0 20.5 16.25v-8.5A4.25 4.25 0 0 0 16.25 3.5zm4.25 3.25a5.25 5.25 0 1 1-5.25 5.25A5.25 5.25 0 0 1 12 6.75zm0 1.5a3.75 3.75 0 1 0 3.75 3.75A3.75 3.75 0 0 0 12 8.25zm5.5-.75a1 1 0 1 1-1 1a1 1 0 0 1 1-1z"/>
            </svg>
            Instagram
          </a>
          <a href="https://x.com/cuBalIZKulubu" target="_blank" rel="noopener noreferrer" className="text-amber-100 hover:text-white transition-colors flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 1227" fill="currentColor" className="w-6 h-6 mr-2"><path d="M1199.61 21.5H978.13L599.8 505.13L221.47 21.5H0L489.13 642.13L0 1205.5h221.47l378.33-483.63l378.33 483.63h221.47L710.47 642.13l489.14-620.63ZM272.13 1092.5l327.67-418.63l327.67 418.63H272.13Z"/></svg>
            X (Twitter)
          </a>
          <a href="https://www.youtube.com/@%C3%87%C3%BCBal%C4%B0ZParmak" target="_blank" rel="noopener noreferrer" className="text-amber-100 hover:text-white transition-colors flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6 mr-2"><path d="M23.498 6.186a2.994 2.994 0 0 0-2.112-2.116C19.228 3.5 12 3.5 12 3.5s-7.228 0-9.386.57A2.994 2.994 0 0 0 .502 6.186C0 8.344 0 12 0 12s0 3.656.502 5.814a2.994 2.994 0 0 0 2.112 2.116C4.772 20.5 12 20.5 12 20.5s7.228 0 9.386-.57a2.994 2.994 0 0 0 2.112-2.116C24 15.656 24 12 24 12s0-3.656-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
            YouTube
          </a>
          <a href="https://www.linkedin.com/company/%C3%A7%C3%BCbali%CC%87zparmak-kul%C3%BCb%C3%BC/?viewAsMember=true" target="_blank" rel="noopener noreferrer" className="text-amber-100 hover:text-white transition-colors flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6 mr-2"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.268c-.966 0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75 1.75.784 1.75 1.75-.784 1.75-1.75 1.75zm15.5 11.268h-3v-5.604c0-1.337-.025-3.063-1.868-3.063-1.868 0-2.154 1.459-2.154 2.967v5.7h-3v-10h2.881v1.367h.041c.401-.761 1.379-1.563 2.841-1.563 3.039 0 3.6 2.001 3.6 4.601v5.595z"/></svg>
            LinkedIn
          </a>
          <a href="https://www.facebook.com/profile.php?id=61573406194941" target="_blank" rel="noopener noreferrer" className="text-amber-100 hover:text-white transition-colors flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6 mr-2"><path d="M22.675 0h-21.35C.595 0 0 .592 0 1.326v21.348C0 23.408.595 24 1.325 24h11.495v-9.294H9.691v-3.622h3.129V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.406 24 24 23.408 24 22.674V1.326C24 .592 23.406 0 22.675 0"/></svg>
            Facebook
          </a>
          <a href="mailto:balparmakkulubu@gmail.com" className="text-amber-100 hover:text-white transition-colors flex items-center" target="_blank" rel="noopener noreferrer">
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6 mr-2">
              <path d="M2.01 6.51A2.25 2.25 0 0 1 4.25 5h15.5a2.25 2.25 0 0 1 2.24 1.51l-10 6.25l-10-6.25zm-.01 2.36v8.63A2.25 2.25 0 0 0 4.25 21h15.5a2.25 2.25 0 0 0 2.25-2.25V8.87l-9.47 5.91a.75.75 0 0 1-.78 0L2 8.87z"/>
            </svg>
            balparmakkulubu@gmail.com
          </a>
        </div>
      </div>
    </footer>
  );
} 