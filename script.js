// Intersection Observer for animations
const sections = document.querySelectorAll('section');
const observerOptions = {
    threshold: 0.1
};

// Countdown Timer Logic
const weddingDate = new Date('Dec 12, 2026 08:00:00').getTime();

const updateCountdown = () => {
    const now = new Date().getTime();
    const distance = weddingDate - now;

    const d = Math.floor(distance / (1000 * 60 * 60 * 24));
    const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById('days').innerText = d.toString().padStart(2, '0');
    document.getElementById('hours').innerText = h.toString().padStart(2, '0');
    document.getElementById('min').innerText = m.toString().padStart(2, '0');
    document.getElementById('sec').innerText = s.toString().padStart(2, '0');
};

setInterval(updateCountdown, 1000);
updateCountdown();

// Music Control Logic
const bgMusic = document.getElementById('bgMusic');
const musicToggle = document.getElementById('musicToggle');
let isPlaying = false;

musicToggle.addEventListener('click', () => {
    if (isPlaying) {
        bgMusic.pause();
        musicToggle.innerHTML = '<i class="fas fa-play"></i>';
    } else {
        bgMusic.play().catch(e => console.log("User must interact first"));
        musicToggle.innerHTML = '<i class="fas fa-pause"></i>';
    }
    isPlaying = !isPlaying;
});

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

sections.forEach(section => {
    observer.observe(section);
});

// Form Submission Handling
const rsvpForm = document.getElementById('rsvpForm');
const statusMsg = document.getElementById('status');
const submitBtn = document.getElementById('submitBtn');

// GANTI URL INI nanti dengan URL Web App dari Google Apps Script
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzltb_vNaruIsoj0wE29INabGgEV6yyEjxKWGeckHQdyCYUnbzQWNq-GKkbntRi6lFo3A/exec';

rsvpForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    if (SCRIPT_URL === 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE') {
        alert('Mohon atur URL Google Apps Script Anda terlebih dahulu di script.js');
        return;
    }

    submitBtn.disabled = true;
    submitBtn.innerText = 'Mengirim...';
    statusMsg.innerText = 'Tunggu sebentar sedang mengirim...';

    const formData = new FormData(rsvpForm);
    const params = new URLSearchParams(formData);
    
    fetch(SCRIPT_URL, {
        method: 'POST',
        body: params,
        mode: 'no-cors' // Penting untuk bypass CORS policy Google Apps Script
    })
    .then(() => {
        statusMsg.innerText = 'Terima kasih atas konfirmasinya!';
        rsvpForm.reset();
        submitBtn.disabled = false;
        submitBtn.innerText = 'Kirim Konfirmasi';
        
        setTimeout(() => {
            statusMsg.innerText = '';
        }, 5000);
    })
    .catch(error => {
        console.error('Error!', error.message);
        statusMsg.innerText = 'Maaf, terjadi kesalahan. Coba lagi nanti.';
        submitBtn.disabled = false;
        submitBtn.innerText = 'Kirim Konfirmasi';
    });
});
