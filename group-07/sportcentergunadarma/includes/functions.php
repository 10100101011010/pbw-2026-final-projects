<?php
/**
 * kumpulan fungsi bantu (helper) yang dipakai di banyak file berbeda,
 * supaya tidak menulis ulang logic yang sama berkali-kali.
 *
 * lapisan: lintas lapisan (dipakai di presentation, logic/api, semuanya)
 */

/**
 * membuat kode booking unik 6 karakter (huruf besar + angka).
 * kode inilah yang nanti ditunjukkan mahasiswa ke petugas beserta ktm-nya.
 */
function generateBookingCode()
{
    return strtoupper(substr(md5(uniqid((string) rand(), true)), 0, 6));
}

/**
 * format tanggal "2026-07-10" menjadi "10 juli 2026" (format indonesia).
 */
function formatTanggalIndo($tanggal)
{
    $bulan = ["januari", "februari", "maret", "april", "mei", "juni", "juli", "agustus", "september", "oktober", "november", "desember"];
    $pecah = explode('-', $tanggal);
    return (int) $pecah[2] . ' ' . ucfirst($bulan[(int) $pecah[1] - 1]) . ' ' . $pecah[0];
}

/**
 * membersihkan input dari user supaya lebih aman terhadap xss,
 * dipakai untuk setiap data dari $_post/$_get sebelum disimpan ke database.
 */
function sanitize($data)
{
    return htmlspecialchars(strip_tags(trim($data)));
}

/**
 * mengirim response json dengan format yang konsisten untuk semua api,
 * lalu langsung menghentikan eksekusi script (exit).
 */
function jsonResponse($success, $message, $data = null)
{
    header('Content-Type: application/json');
    echo json_encode([
        'success' => $success,
        'message' => $message,
        'data' => $data,
    ]);
    exit();
}

/**
 * mengembalikan class warna tailwind sesuai status booking,
 * dipakai untuk badge status di tampilan riwayat & admin.
 */
function statusBadgeClass($status)
{
    switch ($status) {
        case 'pending':
            return 'bg-yellow-100 text-yellow-700';
        case 'confirmed':
            return 'bg-green-100 text-green-700';
        case 'cancelled':
            return 'bg-red-100 text-red-700';
        case 'expired':
            return 'bg-gray-100 text-gray-500';
        default:
            return 'bg-gray-100 text-gray-500';
    }
}

/**
 * mengembalikan label berbahasa indonesia untuk setiap status booking.
 */
function statusLabel($status)
{
    $labels = [
        'pending' => 'menunggu konfirmasi',
        'confirmed' => 'terkonfirmasi',
        'cancelled' => 'dibatalkan',
        'expired' => 'kadaluarsa',
    ];
    return $labels[$status] ?? $status;
}

/**
 * ini fungsi paling penting dari perubahan kali ini: menentukan jam operasional
 * sport center berdasarkan HARI dari tanggal yang diberikan, bukan lagi per-lapangan.
 * semua lapangan sekarang ikut aturan jam yang sama persis.
 *
 * aturan yang diminta:
 * - senin sampai jumat -> buka jam 09:00, tutup jam 20:00 (jam 8 malam)
 * - sabtu               -> buka jam 12:00 siang, tutup jam 17:00 (jam 5 sore) saja
 * - minggu              -> LIBUR TOTAL, tidak ada jadwal sama sekali
 *
 * dipakai bareng-bareng oleh api/get_jadwal.php (buat kasih tau jam ke javascript)
 * dan api/booking.php (buat validasi terakhir sebelum data disimpan ke database).
 *
 * @param string $tanggal format "yyyy-mm-dd", contoh "2026-07-11"
 * @return array|null null kalau hari itu libur (minggu), atau array ['buka' => 'HH:MM', 'tutup' => 'HH:MM']
 */
function jamOperasionalHari($tanggal)
{
    // date('w', ...) mengembalikan angka 0 (minggu) sampai 6 (sabtu)
    $hariKe = (int) date('w', strtotime($tanggal));

    if ($hariKe === 0) {
        // hari minggu, sport center libur total, tidak ada jadwal buat lapangan manapun
        return null;
    }

    if ($hariKe === 6) {
        // hari sabtu, jam operasional lebih pendek, cuma siang sampai sore
        return ['buka' => '12:00', 'tutup' => '17:00'];
    }

    // senin sampai jumat, jam operasional normal, pagi sampai malam
    return ['buka' => '09:00', 'tutup' => '20:00'];
}

/**
 * mengubah jam format "07:00" atau "07:00:00" menjadi jumlah menit sejak tengah malam,
 * dipakai supaya perbandingan dua jam gampang dilakukan dengan angka biasa.
 * dipakai di sisi server (php), versi javascript-nya ada di assets/js/booking.js.
 */
function jamKeMenit($jam)
{
    $pecah = explode(':', $jam);
    return ((int) $pecah[0]) * 60 + ((int) $pecah[1]);
}

/**
 * memvalidasi nomor hp yang diisi mahasiswa saat booking.
 * aturan sederhana saja: cuma boleh angka (boleh diawali tanda +),
 * panjangnya wajar antara 9 sampai 15 digit, supaya tidak ada yang asal isi.
 */
function validasiNoHp($noHp)
{
    $bersih = preg_replace('/[\s\-]/', '', $noHp); // buang spasi dan tanda strip dulu
    return (bool) preg_match('/^\+?[0-9]{9,15}$/', $bersih);
}
