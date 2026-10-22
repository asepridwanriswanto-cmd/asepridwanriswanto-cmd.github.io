---
title: "Pencarian Hadits Shahih"
description: "Cari hadits shahih dari berbagai kitab mu'tabar (Bukhari, Muslim, Abu Dawud, dll). Dilengkapi teks terjemahan bahasa Indonesia."
date: 2026-10-22
draft: false
---

Fitur ini memungkinkan Anda mencari teks hadits berdasarkan kata kunci dalam bahasa Indonesia. Data diambil dari kitab-kitab hadits standar yang telah diterjemahkan. 

<div style="background:#f9f9f9; padding: 20px; border-radius: 8px; border: 1px solid #ddd; margin-bottom: 30px;">
  <h3 style="margin-top:0;">Cari Hadits</h3>
  
  <label for="kitab">Pilih Kitab:</label><br>
  <select id="kitab" style="width: 100%; padding: 10px; margin: 10px 0; border: 1px solid #ccc; border-radius: 4px; font-size: 16px;">
    <option value="ind-bukhari">Sahih Bukhari</option>
    <option value="ind-muslim">Sahih Muslim</option>
    <option value="ind-abudawud">Sunan Abu Dawud</option>
    <option value="ind-tirmidhi">Jami' at-Tirmidzi</option>
    <option value="ind-nasai">Sunan an-Nasa'i</option>
    <option value="ind-ibnmajah">Sunan Ibnu Majah</option>
  </select>

  <label for="keyword">Kata Kunci (Bahasa Indonesia):</label><br>
  <input type="text" id="keyword" placeholder="Contoh: sabar, sedekah, niat" style="width: 100%; padding: 10px; margin: 10px 0; border: 1px solid #ccc; border-radius: 4px;">
  
  <button onclick="cariHadits()" style="background: #0E7A5F; color: white; padding: 12px 20px; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; width: 100%; margin-top: 10px;">Cari Hadits</button>
</div>

<div id="hasil-hadits" style="display:none;">
  <h3 style="color:#0E7A5F;">Hasil Pencarian:</h3>
  <p id="loading-text" style="color: #555; font-style: italic;">Memuat data... (Proses ini mungkin memakan waktu beberapa detik pada pencarian pertama).</p>
  <div id="list-hadits"></div>
</div>

<script>
let cacheHadits = {}; 

async function cariHadits() {
  const kitab = document.getElementById("kitab").value;
  const keyword = document.getElementById("keyword").value.toLowerCase().trim();
  const hasilDiv = document.getElementById("hasil-hadits");
  const listHadits = document.getElementById("list-hadits");
  const loadingText = document.getElementById("loading-text");

  if (!keyword) {
    alert("Masukkan kata kunci pencarian!");
    return;
  }

  hasilDiv.style.display = "block";
  loadingText.style.display = "block";
  listHadits.innerHTML = "";

  try {
    if (!cacheHadits[kitab]) {
      const response = await fetch(`https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/${kitab}.json`);
      const data = await response.json();
      cacheHadits[kitab] = data.hadiths; 
    }

    const semuaHadits = cacheHadits[kitab];
    const hasilFilter = semuaHadits.filter(h => h.text.toLowerCase().includes(keyword));

    loadingText.style.display = "none";

    if (hasilFilter.length === 0) {
      listHadits.innerHTML = "<p>Tidak ada hadits yang cocok dengan kata kunci tersebut.</p>";
      return;
    }

    let html = `<p>Ditemukan <strong>${hasilFilter.length}</strong> hadits. Menampilkan maksimal 20 hasil:</p>`;
    
    hasilFilter.slice(0, 20).forEach((h) => {
      html += `
        <div style="background:#fff; padding: 15px; border-radius: 8px; border-left: 4px solid #C9A24B; margin-bottom: 15px; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
          <p style="margin-top:0; font-weight:bold; color:#0E7A5F;">Hadits No. ${h.hadithnumber}</p>
          <p style="line-height: 1.6; font-size: 1.05em;">"${h.text}"</p>
        </div>
      `;
    });

    listHadits.innerHTML = html;

  } catch (error) {
    loadingText.style.display = "none";
    listHadits.innerHTML = "<p style='color:red;'>Terjadi kesalahan saat mengambil data. Pastikan koneksi internet stabil.</p>";
  }
}
</script>