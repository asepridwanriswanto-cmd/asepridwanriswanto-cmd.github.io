const { extract } = require('@extractus/feed-extractor');
const fs = require('fs');

const feeds = [
  "https://www.republika.co.id/rss/khazanah",
  "https://muslim.or.id/feed",
  "https://rumaysho.com/feed"
];

async function ambilSemuaBerita() {
  let semuaBerita = [];

  for (const url of feeds) {
    try {
      console.log(`Mengambil berita dari: ${url}`);
      const data = await extract(url);
      
      if (data && data.entries) {
        const berita = data.entries.map(item => ({
          title: item.title,
          link: item.link,
          pubDate: item.published || new Date().toISOString(),
          thumbnail: "https://asepridwanriswanto-cmd.github.io/img/logo.png" // Gambar default
        }));
        semuaBerita = semuaBerita.concat(berita);
      }
    } catch (error) {
      console.error(`Gagal mengambil dari ${url}:`, error.message);
    }
  }

  // Urutkan berdasarkan tanggal terbaru dan ambil 20 teratas
  semuaBerita.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
  const beritaFinal = semuaBerita.slice(0, 20);

  // Simpan ke file JSON
  fs.mkdirSync('./static/data', { recursive: true });
  fs.writeFileSync('./static/data/berita.json', JSON.stringify(beritaFinal, null, 2));
  console.log(`Berhasil menyimpan ${beritaFinal.length} berita ke static/data/berita.json`);
}

ambilSemuaBerita();