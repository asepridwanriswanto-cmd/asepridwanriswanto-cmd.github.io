---
title: "Pencarian Al-Qur'an"
description: "Cari ayat Al-Qur'an beserta teks Arab dan terjemahan bahasa Indonesia dengan mudah dan cepat."
layout: "single"
hideMeta: true
---

<!-- BANNER HERO -->
<div style="text-align: center; padding: 40px 20px; background: linear-gradient(135deg, #e8f5e9 0%, #f1f8e9 100%); border-radius: 12px; margin-bottom: 40px; border: 1px solid #dcedc8;">
  <span style="font-size: 3em; margin-bottom: 10px; display: block;">📖</span>
  <h1 style="margin-top: 0; color: #0E7A5F; font-size: 2.2em;">Telusuri Kalam Ilahi</h1>
  <p style="font-size: 1.1em; color: #555; max-width: 600px; margin: 10px auto 0 auto; line-height: 1.6;">
    Temukan petunjuk dan hikmah dari Al-Qur'an. Ketik kata kunci dalam bahasa Indonesia untuk menemukan ayat beserta teks Arab aslinya.
  </p>
</div>

<!-- KOTAK PENCARIAN -->
<div style="max-width: 700px; margin: 0 auto 40px auto;">
  <div style="display: flex; gap: 10px; flex-wrap: wrap; justify-content: center;">
    <input type="text" id="searchInput" placeholder="Contoh: sabar, rezeki, orang beriman..." style="flex: 1 1 300px; padding: 15px 25px; border: 2px solid #ddd; border-radius: 30px; font-size: 1.05rem; outline: none; transition: all 0.3s ease; box-shadow: 0 4px 6px rgba(0,0,0,0.05);" onfocus="this.style.borderColor='#0E7A5F'; this.style.boxShadow='0 4px 12px rgba(14, 122, 95, 0.2)';" onblur="this.style.borderColor='#ddd'; this.style.boxShadow='0 4px 6px rgba(0,0,0,0.05)';">
    <button onclick="searchQuran()" style="padding: 15px 35px; background: #0E7A5F; color: white; border: none; border-radius: 30px; font-size: 1.05rem; cursor: pointer; font-weight: bold; transition: background 0.3s; box-shadow: 0 4px 6px rgba(14, 122, 95, 0.2);" onmouseover="this.style.background='#0b634c'" onmouseout="this.style.background='#0E7A5F'">Cari Ayat</button>
  </div>
  <p style="text-align: center; font-size: 0.85em; color: #888; margin-top: 15px; font-style: italic;">Gunakan kata kunci yang singkat dan spesifik untuk hasil terbaik.</p>
</div>

<!-- AREA HASIL -->
<div id="loading" style="display: none; text-align: center; color: #0E7A5F; font-weight: bold; margin: 30px 0; font-size: 1.1em;">⏳ Sedang merangkai ayat-ayat...</div>
<div id="errorMsg" style="display: none; text-align: center; color: #d32f2f; background: #ffebee; padding: 15px; border-radius: 8px; margin: 20px 0;"></div>

<div id="results" style="display: flex; flex-direction: column; gap: 25px;">
  <!-- Hasil pencarian akan muncul di sini -->
</div>

<script>
async function searchQuran() {
  const keyword = document.getElementById('searchInput').value.trim();
  const resultsDiv = document.getElementById('results');
  const loadingDiv = document.getElementById('loading');
  const errorDiv = document.getElementById('errorMsg');

  if (!keyword) {
    alert("Silakan masukkan kata kunci pencarian.");
    return;
  }

  loadingDiv.style.display = 'block';
  errorDiv.style.display = 'none';
  resultsDiv.innerHTML = '';

  try {
    const searchUrl = `https://api.alquran.cloud/v1/search/${encodeURIComponent(keyword)}/all/id.indonesian`;
    const searchResponse = await fetch(searchUrl);
    const searchData = await searchResponse.json();

    if (searchData.code === 200) {
      if (searchData.data.count === 0) {
        errorDiv.innerText = `Ayat dengan kata kunci "${keyword}" tidak ditemukan. Silakan coba kata kunci lain.`;
        errorDiv.style.display = 'block';
      } else {
        const matches = searchData.data.matches.slice(0, 10);

        const arabicPromises = matches.map(match => 
          fetch(`https://api.alquran.cloud/v1/ayah/${match.number}/quran-uthmani`).then(res => res.json())
        );
        
        const arabicResults = await Promise.all(arabicPromises);

        let htmlContent = `<p style="text-align: center; color: #555; font-size: 0.95em; margin-bottom: 15px;">Ditemukan <strong>${searchData.data.count}</strong> ayat. Menampilkan ${matches.length} ayat pertama:</p>`;

        for (let i = 0; i < matches.length; i++) {
          const match = matches[i];
          const arabicText = arabicResults[i].data.text;

          htmlContent += `
            <div style="border: 1px solid var(--border); padding: 25px; border-radius: 12px; background: var(--entry); box-shadow: 0 2px 8px rgba(0,0,0,0.04);">
              
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 1px solid var(--border); padding-bottom: 15px;">
                <span style="color: #0E7A5F; font-weight: bold; font-size: 0.9em; letter-spacing: 0.5px;">QS. ${match.surah.englishName} : ${match.numberInSurah}</span>
              </div>
              
              <!-- TEKS ARAB -->
              <p style="text-align: right; font-size: 2em; margin-bottom: 25px; line-height: 2.2; color: var(--content); font-family: 'Scheherazade New', 'Traditional Arabic', 'Amiri', serif;">${arabicText}</p>
              
              <!-- TERJEMAHAN INDONESIA -->
              <p style="font-size: 1em; color: var(--content); line-height: 1.7; font-style: italic;">"${match.text}"</p>
              
            </div>
          `;
        }

        if (searchData.data.count > 10) {
          htmlContent += `<p style="text-align: center; font-size: 0.85em; color: #888; font-style: italic; margin-top: 10px;">(Hanya menampilkan 10 hasil pertama. Silakan gunakan kata kunci yang lebih spesifik).</p>`;
        }

        resultsDiv.innerHTML = htmlContent;
      }
    } else {
      errorDiv.innerText = "Terjadi kesalahan saat mengambil data. Coba lagi nanti.";
      errorDiv.style.display = 'block';
    }
  } catch (error) {
    errorDiv.innerText = "Gagal terhubung ke server. Periksa koneksi internet Anda.";
    errorDiv.style.display = 'block';
  } finally {
    loadingDiv.style.display = 'none';
  }
}

document.getElementById('searchInput').addEventListener('keypress', function (e) {
  if (e.key === 'Enter') {
    searchQuran();
  }
});
</script>