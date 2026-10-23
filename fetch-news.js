const { extract } = require('@extractus/feed-extractor');
const fs = require('fs');

const feeds = [
  "https://www.republika.co.id/rss/khazanah",
  "https://muslim.or.id/feed",
  "https://rumaysho.com/feed"
];

// Gambar SVG (Base64) yang pasti muncul. Berupa kotak hijau dengan tulisan SahabatMuslim.
const gambarFallback = "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='400'%3E%3Crect width='600' height='400' fill='%23e8f5e9'/%3E%3Ctext x='50%25' y='50%25' font-size='30' text-anchor='middle' fill='%230E7A5F' font-family='sans-serif' font-weight='bold'%3ESahabatMuslim%3C/text%3E%3C/svg%3E";

async function ambilSemuaBerita() {
  let semuaBerita = [];

  for (const url of feeds) {
    try {
      console.log(`Mengambil berita dari: ${url}`);
      const data = await extract(url);
      
      if (data && data.entries) {
        const berita = data.entries.map(item => {
          let imgUrl = "";

          // 1. Coba ambil gambar dari enclosure
          if (item.enclosure && item.enclosure.url) {
            imgUrl = item.enclosure.url;
          } 
          // 2. Coba ambil gambar dari dalam konten
          else {
            const content = item.content || item.description || "";
            const match = content.match(/<img[^>]+src=["']([^"']+)["']/i);
            if (match) {
              imgUrl = match[1];
            }
          }

          // 3. Jika tidak ada gambar, pakai SVG lokal
          if (!imgUrl || imgUrl.includes('feedburner') || imgUrl.includes('gravatar')) {
            imgUrl = gambarFallback;
          }

          return {
            title: item.title,
            link: item.link,
            pubDate: item.published || new Date().toISOString(),
            thumbnail: imgUrl
          };
        });
        semuaBerita = semuaBerita.concat(berita);
      }
    } catch (error) {
      console.error(`Gagal mengambil dari ${url}:`, error.message);
    }
  }

  semuaBerita.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
  const beritaFinal = semuaBerita.slice(0, 20);

  fs.mkdirSync('./static/data', { recursive: true });
  fs.writeFileSync('./static/data/berita.json', JSON.stringify(beritaFinal, null, 2));
  console.log(`Berhasil menyimpan ${beritaFinal.length} berita.`);
}

ambilSemuaBerita();