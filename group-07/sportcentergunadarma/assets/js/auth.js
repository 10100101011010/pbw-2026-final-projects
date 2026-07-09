// menangani submit form registrasi
const formRegister = document.getElementById('form-register');
if (formRegister) {
  formRegister.addEventListener('submit', async (e) => {
    e.preventDefault();
    const alertBox = document.getElementById('alert');
    const formData = new FormData(formRegister);

    // cek kecocokan password dulu di sisi browser sebelum fetch ke api,
    // biar mahasiswa dapat feedback instan tanpa nunggu round-trip ke server
    // (validasi ASLI tetap di server, ini cuma buat kenyamanan saja)
    if (formData.get('password') !== formData.get('konfirmasi_password')) {
      alertBox.classList.remove('hidden');
      alertBox.className = 'mb-4 p-3 rounded-lg text-sm bg-red-50 text-red-700';
      alertBox.textContent = 'konfirmasi password tidak cocok';
      return;
    }

    const res = await fetch('api/register.php', { method: 'POST', body: formData });
    const json = await res.json();

    alertBox.classList.remove('hidden');
    if (json.success) {
      alertBox.className = 'mb-4 p-3 rounded-lg text-sm bg-green-50 text-green-700';
      alertBox.textContent = json.message;
      setTimeout(() => window.location.href = 'login.php', 1200);
    } else {
      alertBox.className = 'mb-4 p-3 rounded-lg text-sm bg-red-50 text-red-700';
      alertBox.textContent = json.message;
    }
  });
}

// menangani submit form login
const formLogin = document.getElementById('form-login');
if (formLogin) {
  formLogin.addEventListener('submit', async (e) => {
    e.preventDefault();
    const alertBox = document.getElementById('alert');
    const formData = new FormData(formLogin);

    const res = await fetch('api/login.php', { method: 'POST', body: formData });
    const json = await res.json();

    alertBox.classList.remove('hidden');
    if (json.success) {
      alertBox.className = 'mb-4 p-3 rounded-lg text-sm bg-green-50 text-green-700';
      alertBox.textContent = json.message;
      setTimeout(() => {
        // admin diarahkan ke dashboard, mahasiswa ke halaman utama
        window.location.href = json.data.role === 'admin' ? 'admin/dashboard.php' : 'index.php';
      }, 800);
    } else {
      alertBox.className = 'mb-4 p-3 rounded-lg text-sm bg-red-50 text-red-700';
      alertBox.textContent = json.message;
    }
  });
}
