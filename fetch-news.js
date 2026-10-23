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
        const berita = data.entries.map(item => {
          let imgUrl = "";

          // 1. Coba ambil gambar dari enclosure (biasanya ada di Republika)
          if (item.enclosure && item.enclosure.url) {
            imgUrl = item.enclosure.url;
          } 
          // 2. Coba ambil gambar dari dalam konten (tag <img>)
          else {
            const content = item.content || item.description || "";
            const match = content.match(/<img[^>]+src=["']([^"']+)["']/i);
            if (match) {
              imgUrl = match[1];
            }
          }

          // 3. Jika tetap tidak ada gambar, gunakan gambar default (Masjid)
          if (!imgUrl) {
            imgUrl = "https://images.unsplash.com/photo-1584285400325-2323c7fc6970?q=80&w=600&auto=format&fit=crop";
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