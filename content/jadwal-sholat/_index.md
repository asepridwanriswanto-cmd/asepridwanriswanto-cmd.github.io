---
title: "Jadwal Sholat Seluruh Indonesia"
description: "Jadwal waktu sholat lima waktu hari ini untuk seluruh kota di Indonesia. Akurat berdasarkan metode Kementerian Agama RI (Kemenag)."
date: 2026-10-22
draft: false
---

Jadwal sholat di bawah ini dihitung secara otomatis menggunakan metode **Kementerian Agama Republik Indonesia (Kemenag)**. Silakan ketik nama kota Anda (contoh: Jakarta, Bandung, Surabaya, Medan).

<div style="background:#f9f9f9; padding: 20px; border-radius: 8px; border: 1px solid #ddd; margin-bottom: 30px;">
  <h3 style="margin-top:0;">Cari Jadwal Sholat</h3>
  <label for="kota">Ketik Nama Kota/Kabupaten:</label><br>
  <input type="text" id="kota" placeholder="Contoh: Jakarta" value="Jakarta" style="width: 100%; padding: 10px; margin: 10px 0; border: 1px solid #ccc; border-radius: 4px;">
  <button onclick="cariJadwal()" style="background: #0E7A5F; color: white; padding: 12px 20px; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; width: 100%; margin-top: 10px;">Cari Jadwal Sholat</button>
</div>

<div id="hasil-sholat" style="display:none; background:#e8f5e9; padding: 20px; border-radius: 8px; border-left: 5px solid #0E7A5F;">
  <h3 id="judul-kota" style="margin-top:0; color:#0E7A5F; text-transform: uppercase;"></h3>
  <p id="tanggal-sholat" style="font-size: 0.9em; color: #555;"></p>
  <ul id="list-sholat" style="list-style-type: none; padding-left: 0; font-size: 1.1em; line-height: 2;"></ul>
  <p id="error-msg" style="color: #d32f2f; display: none; font-weight: bold;">Kota tidak ditemukan. Pastikan ejaan nama kota benar (Gunakan bahasa Indonesia).</p>
</div>

<script>
async function cariJadwal() {
  var kota = document.getElementById("kota").value;
  if (!kota) { alert("Masukkan nama kota terlebih dahulu!"); return; }

  var hasilDiv = document.getElementById("hasil-sholat");
  var listSholat = document.getElementById("list-sholat");
  var judulKota = document.getElementById("judul-kota");
  var tanggalSholat = document.getElementById("tanggal-sholat");
  var errorMsg = document.getElementById("error-msg");

  listSholat.innerHTML = "Memuat data...";
  hasilDiv.style.display = "block";
  errorMsg.style.display = "none";

  try {
    var response = await fetch(`https://api.aladhan.com/v1/timingsByCity?city=${kota}&country=Indonesia&method=20`);
    var data = await response.json();

    if (data.code === 200) {
      var timings = data.data.timings;
      var date = data.data.date.readable;
      
      judulKota.innerHTML = "Jadwal Sholat " + kota;
      tanggalSholat.innerHTML = date;
      
      listSholat.innerHTML = `
        <li><strong>Imsak:</strong> ${timings.Imsak}</li>
        <li><strong>Subuh:</strong> ${timings.Fajr}</li>
        <li><strong>Terbit:</strong> ${timings.Sunrise}</li>
        <li><strong>Dzuhur:</strong> ${timings.Dhuhr}</li>
        <li><strong>Ashar:</strong> ${timings.Asr}</li>
        <li><strong>Maghrib:</strong> ${timings.Maghrib}</li>
        <li><strong>Isya:</strong> ${timings.Isha}</li>
      `;
    } else {
      throw new Error("Kota tidak ditemukan");
    }
  } catch (error) {
    listSholat.innerHTML = "";
    tanggalSholat.innerHTML = "";
    errorMsg.style.display = "block";
  }
}

window.onload = function() { cariJadwal(); };
</script>