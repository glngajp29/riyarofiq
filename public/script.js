// =======================
// 1. Countdown Timer
// =======================
const targetDate = new Date("31 May, 2025 09:00:00").getTime();
const timerElement = document.getElementById("timer");

setInterval(() => {
  const now = new Date().getTime();
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
function openModal(img) {
  const modal = document.getElementById("imgModal");
  const modalImg = document.getElementById("modalImg");
  modal.style.display = "block";
  modalImg.src = img.src;
}

function closeModal() {
  const modal = document.getElementById("imgModal");
  modal.style.display = "none";
}

// =======================
// 3. Efek Fade Out & Buka Undangan
// =======================
function openInvitation() {
  const hero = document.getElementById("hero");
  const mainContent = document.getElementById("main-content");

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
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const run = ease(timeElapsed, startPosition, distance, duration);
    window.scrollTo(0, run);
    if (timeElapsed < duration) requestAnimationFrame(animation);
  }

  function ease(t, b, c, d) {
    t /= d / 2;
    if (t < 1) return c / 2 * t * t + b;
    t--;
    return -c / 2 * (t * (t - 2) - 1) + b;
  }

  requestAnimationFrame(animation);
}

const openBtn = document.getElementById('openBtn');
openBtn.addEventListener('click', () => {
  const mainContent = document.getElementById('main-content');
  mainContent.style.display = 'block';

  document.body.classList.remove('noscroll');

  mainContent.scrollIntoView({ behavior: 'smooth' });
  openBtn.classList.add('hide');

  setTimeout(() => {
    openBtn.style.display = 'none';
  }, 1000);

  smoothScrollTo(mainContent, 1000);
});

// =======================
// 5. Efek Parallax dan Blur Background Hero Saat Scroll
// =======================
(() => {
  const hero = document.querySelector('.hero');
  let baseOffset = 0;
  let currentOffset = baseOffset;
  let targetOffset = baseOffset;
  let maxBlur = 5;
  let currentBlur = 0;
  let targetBlur = 0;
  let ticking = false;

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

  document.addEventListener('scroll', () => {
    onScroll();
  });
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
// 7. Putar Musik Background Saat Tombol Buka Undangan Diklik
// =======================
const bgMusic = document.getElementById('bg-music');
openBtn.addEventListener('click', () => {
  bgMusic.play().catch(() => {
    console.log("Autoplay ditolak. Musik akan mulai setelah interaksi berikutnya.");
  });
});

// =======================
// 8. Firebase: Inisialisasi dan Setup Firestore
// =======================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, serverTimestamp, query, orderBy } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyD_pcQQfzF_0khbjwpG_IxTqpdVrXysWSc",
  authDomain: "rayarofiqwedding.firebaseapp.com",
  projectId: "rayarofiqwedding",
  storageBucket: "rayarofiqwedding.firebasestorage.app",
  messagingSenderId: "168418586866",
  appId: "1:168418586866:web:632af302bd422bdbd8e06b",
  measurementId: "G-WBTPMHRG1C"

};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// =======================
// 9. Form RSVP: Submit & Load Comments
// =======================
const form = document.getElementById("rsvp-form");
const commentSection = document.getElementById("comment-section");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("guest-name").value.trim();
  const message = document.getElementById("guest-message").value.trim();
  const attendance = document.getElementById("guest-attendance").value;

  if (name && message && attendance) {
    await addDoc(collection(db, "comments"), {
      name,
      message,
      attendance,
      timestamp: serverTimestamp()
    });
    form.reset();
    loadComments();
  }
});

async function loadComments() {
  commentSection.innerHTML = "";
  const q = query(collection(db, "comments"), orderBy("timestamp", "desc"));

  try {
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
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
    console.error("Error memuat komentar:", error);
  }
}

loadComments();

// =======================
// 10. Toggle dan Salin Info Rekening Hadiah
// =======================
const toggleGiftBtn = document.getElementById("toggleGiftBtn");
const giftDetails = document.getElementById("giftDetails");
const copyBtn = document.getElementById('copyBtn');
const toast = document.getElementById('toast');

toggleGiftBtn.addEventListener("click", () => {
  giftDetails.style.display = giftDetails.style.display === "block" ? "none" : "block";
});

function showToast() {
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}

function copyText(text) {
  if (navigator.clipboard) {
    return navigator.clipboard.writeText(text);
  } else {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
    } catch (err) {
      console.error('Fallback: Gagal menyalin teks', err);
    }
    document.body.removeChild(textarea);
    return Promise.resolve();
  }
}

copyBtn.onclick = () => {
  const rekeningText = document.getElementById('rekening-number').childNodes[0].nodeValue.trim();
  copyText(rekeningText).then(() => {
    showToast();
  });
};

// Munculkan animasi saat scroll
const animateOnScroll = () => {
  const elements = document.querySelectorAll('[data-animate]');
  const triggerBottom = window.innerHeight * 0.85;

  elements.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < triggerBottom) {
      el.classList.add('animated');
    }
  });
};

window.addEventListener('scroll', animateOnScroll);
window.addEventListener('load', animateOnScroll);
