---
title: "Kalkulator Zakat Penghasilan & Mal"
description: "Hitung zakat penghasilan, emas, dan harta simpanan Anda secara otomatis sesuai syariat Islam. Kalkulator zakat gratis dan akurat."
date: 2026-10-22
draft: false
---

Kalkulator ini membantu Anda menghitung zakat mal (harta simpanan) dan zakat penghasilan. Zakat wajib dikeluarkan jika harta Anda telah mencapai **Nisab** (batas minimal) dan telah dimiliki selama **1 tahun (Haul)** untuk zakat mal.

<div style="background:#f9f9f9; padding: 20px; border-radius: 8px; border: 1px solid #ddd; margin-bottom: 30px;">
  <h3 style="margin-top:0;">1. Masukkan Data Harta Anda</h3>
  
  <label for="harta">Total Harta / Penghasilan Bersih (Rp):</label><br>
  <input type="number" id="harta" placeholder="Contoh: 100000000" style="width: 100%; padding: 10px; margin: 10px 0; border: 1px solid #ccc; border-radius: 4px;">
  
  <label for="hargaEmas">Harga Emas Saat Ini (Rp/gram):</label><br>
  <input type="number" id="hargaEmas" value="1400000" style="width: 100%; padding: 10px; margin: 10px 0; border: 1px solid #ccc; border-radius: 4px;">
  
  <button onclick="hitungZakat()" style="background: #0E7A5F; color: white; padding: 12px 20px; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; width: 100%; margin-top: 10px;">Hitung Zakat Saya</button>
</div>

<div id="hasil-zakat" style="display:none; background:#e8f5e9; padding: 20px; border-radius: 8px; border-left: 5px solid #0E7A5F;">
  <h3 style="margin-top:0; color:#0E7A5F;">Hasil Perhitungan</h3>
  <p id="status-nisab"></p>
  <p id="nominal-nisab"></p>
  <h2 id="total-zakat" style="color: #d32f2f; margin-bottom: 0;"></h2>
</div>

<script>
function hitungZakat() {
  var harta = parseFloat(document.getElementById("harta").value);
  var hargaEmas = parseFloat(document.getElementById("hargaEmas").value);
  
  if (isNaN(harta) || isNaN(hargaEmas) || harta <= 0 || hargaEmas <= 0) {
    alert("Mohon masukkan angka yang valid untuk Harta dan Harga Emas.");
    return;
  }
  
  var nisab = 85 * hargaEmas;
  var hasilDiv = document.getElementById("hasil-zakat");
  var statusNisab = document.getElementById("status-nisab");
  var nominalNisab = document.getElementById("nominal-nisab");
  var totalZakat = document.getElementById("total-zakat");
  
  hasilDiv.style.display = "block";
  nominalNisab.innerHTML = "Batas Nisab Anda: <strong>Rp " + nisab.toLocaleString('id-ID') + "</strong> (setara 85 gram emas)";
  
  if (harta >= nisab) {
    var zakat = harta * 0.025;
    statusNisab.innerHTML = "Status: <strong style='color: green;'>Wajib Zakat</strong> (Harta Anda telah mencapai nisab).";
    totalZakat.innerHTML = "Zakat yang harus dibayar: Rp " + zakat.toLocaleString('id-ID');
  } else {
    statusNisab.innerHTML = "Status: <strong style='color: orange;'>Belum Wajib Zakat</strong> (Harta Anda belum mencapai nisab).";
    totalZakat.innerHTML = "Zakat yang harus dibayar: Rp 0";
  }
}
</script>

### Dalil dan Ketentuan Zakat
Zakat adalah salah satu rukun Islam yang wajib ditunaikan bagi setiap muslim yang memiliki harta berlebih. Kadar zakat mal dan penghasilan adalah **2,5%**. Pastikan Anda juga telah memenuhi syarat *Haul* (kepemilikan selama 1 tahun Hijriah) khusus untuk zakat mal (harta simpanan).