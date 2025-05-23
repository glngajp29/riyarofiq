// =======================
// 1. Countdown Timer
// =======================
const targetDate = new Date("31 May 2025 09:00:00").getTime();
const timerElement = document.getElementById("timer");

setInterval(() => {
  const now = Date.now();
  let distance = targetDate - now;
  if (distance < 0) distance = 0;

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hrs = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const min = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const sec = Math.floor((distance % (1000 * 60)) / 1000);

  timerElement.innerHTML = `
    <div class="time-box">
      <div class="number">${String(days).padStart(2, '0')}</div>
      <div class="label">Hari</div>
    </div>
    <div class="time-box">
      <div class="number">${String(hrs).padStart(2, '0')}</div>
      <div class="label">Jam</div>
    </div>
    <div class="time-box">
      <div class="number">${String(min).padStart(2, '0')}</div>
      <div class="label">Menit</div>
    </div>
    <div class="time-box">
      <div class="number">${String(sec).padStart(2, '0')}</div>
      <div class="label">Detik</div>
    </div>
  `;
}, 1000);

// =======================
// 2. Modal Galeri Foto
// =======================
export function openModal(img) {
  const modal = document.getElementById("imgModal");
  const modalImg = document.getElementById("modalImg");
  if (modal && modalImg) {
    modal.style.display = "block";
    modalImg.src = img.src;
  }
}

export function closeModal() {
  const modal = document.getElementById("imgModal");
  if (modal) modal.style.display = "none";
}

// =======================
// 3. Efek Fade Out & Buka Undangan
// =======================
function openInvitation() {
  const hero = document.getElementById("hero");
  const mainContent = document.getElementById("main-content");

  if (!hero || !mainContent) return;

  hero.classList.add("fade-out");
  setTimeout(() => {
    hero.style.display = "none";
    mainContent.style.display = "block";
  }, 1000);
}

// =======================
// 4. Scroll Control dan Event Listener Tombol Buka Undangan
// =======================
document.body.classList.add('noscroll');

function smoothScrollTo(element, duration = 1000) {
  const targetPosition = element.getBoundingClientRect().top + window.pageYOffset;
  const startPosition = window.pageYOffset;
  const distance = targetPosition - startPosition;
  let startTime = null;

  function animation(currentTime) {
    if (!startTime) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const run = ease(timeElapsed, startPosition, distance, duration);
    window.scrollTo(0, run);
    if (timeElapsed < duration) requestAnimationFrame(animation);
  }

  function ease(t, b, c, d) {
    t /= d / 2;
    if (t < 1) return (c / 2) * t * t + b;
    t--;
    return (-c / 2) * (t * (t - 2) - 1) + b;
  }

  requestAnimationFrame(animation);
}

const openBtn = document.getElementById('openBtn');
openBtn?.addEventListener('click', () => {
  const mainContent = document.getElementById('main-content');
  if (!mainContent) return;

  mainContent.style.display = 'block';
  document.body.classList.remove('noscroll');
  mainContent.scrollIntoView({ behavior: 'smooth' });

  openBtn.classList.add('hide');
  setTimeout(() => {
    openBtn.style.display = 'none';
  }, 1000);

  smoothScrollTo(mainContent, 1000);

  // Putar musik saat buka undangan
  bgMusic.play().catch(() => {
    console.log("Autoplay ditolak, musik akan mulai setelah interaksi berikutnya.");
  });
});

// =======================
// 5. Efek Parallax dan Blur Background Hero Saat Scroll
// =======================
(() => {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  let baseOffset = 0,
      currentOffset = baseOffset,
      targetOffset = baseOffset,
      maxBlur = 5,
      currentBlur = 0,
      targetBlur = 0,
      ticking = false;

  function lerp(start, end, t) {
    return start + (end - start) * t;
  }

  function onScroll() {
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;
    targetOffset = baseOffset - scrollY * 0.08;
    targetOffset = Math.min(baseOffset, Math.max(targetOffset, baseOffset - 100));
    targetBlur = maxBlur * Math.min(scrollY / 2300, 1);

    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  }

  function update() {
    currentOffset = lerp(currentOffset, targetOffset, 0.1);
    currentBlur = lerp(currentBlur, targetBlur, 0.1);

    hero.style.backgroundPositionY = `${currentOffset.toFixed(2)}px`;
    hero.style.filter = `blur(${currentBlur.toFixed(2)}px)`;

    if (Math.abs(currentOffset - targetOffset) > 0.2 || Math.abs(currentBlur - targetBlur) > 0.1) {
      requestAnimationFrame(update);
    } else {
      ticking = false;
    }
  }

  document.addEventListener('scroll', onScroll);
})();

// =======================
// 6. Intersection Observer untuk Animasi Elemen Saat Muncul di Viewport
// =======================
const animateEls = document.querySelectorAll('[data-animate]');
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    } else {
      entry.target.classList.remove('visible');
    }
  });
}, { threshold: 0.1 });

animateEls.forEach(el => observer.observe(el));

// =======================
// 7. Firebase: Inisialisasi dan Setup Firestore
// =======================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, serverTimestamp, query, orderBy } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyD_pcQQfzF_0khbjwpG_IxTqpdVrXysWSc",
  authDomain: "rayarofiqwedding.firebaseapp.com",
  projectId: "rayarofiqwedding",
  storageBucket: "rayarofiqwedding.appspot.com",
  messagingSenderId: "168418586866",
  appId: "1:168418586866:web:632af302bd422bdbd8e06b",
  measurementId: "G-WBTPMHRG1C"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// =======================
// 8. Form RSVP: Submit & Load Comments
// =======================
const form = document.getElementById("rsvp-form");
const commentSection = document.getElementById("comment-section");

form?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("guest-name")?.value.trim();
  const message = document.getElementById("guest-message")?.value.trim();
  const attendance = document.getElementById("guest-attendance")?.value;

  if (!name || !message || !attendance) {
    alert("Mohon isi semua kolom RSVP dengan benar.");
    return;
  }

  try {
    await addDoc(collection(db, "comments"), {
      name,
      message,
      attendance,
      timestamp: serverTimestamp()
    });
    form.reset();
    await loadComments();
  } catch (error) {
    console.error("Gagal mengirim komentar:", error);
  }
});

async function loadComments() {
  if (!commentSection) return;
  commentSection.innerHTML = "Memuat komentar...";

  const q = query(collection(db, "comments"), orderBy("timestamp", "desc"));

  try {
    const querySnapshot = await getDocs(q);
    commentSection.innerHTML = "";
    querySnapshot.forEach(doc => {
      const data = doc.data();
      const time = data.timestamp ? new Date(data.timestamp.seconds * 1000) : new Date();
      const formattedTime = time.toLocaleString('id-ID');

      const div = document.createElement("div");
      div.classList.add("comment-card");
      div.innerHTML = `
        <div class="comment-name">
          <strong>${data.name}</strong> <span class="attendance">(${data.attendance})</span>
        </div>
        <div class="comment-message">${data.message}</div>
        <div class="comment-time">🕒 ${formattedTime}</div>
      `;
      commentSection.appendChild(div);
    });
  } catch (error) {
    commentSection.innerHTML = "Gagal memuat komentar.";
    console.error("Error memuat komentar:", error);
  }
}

// Load comments saat awal halaman dibuka
loadComments();

// =======================
// 9. Toggle dan Salin Info Rekening Hadiah
// =======================
const toggleGiftBtn = document.getElementById("toggleGiftBtn");
const giftDetails = document.getElementById("giftDetails");
const copyBtn = document.getElementBy
