document.addEventListener('DOMContentLoaded', () => {
  const guestNameElement = document.querySelector('.guest-name');
  if (guestNameElement) {
    const params = new URLSearchParams(window.location.search);
    // Cek nama parameter yang dipakai
    let guestName = params.get('to') || params.get('nama');
    if (guestName && guestName.trim() !== "") {
      guestName = decodeURIComponent(guestName.replace(/\+/g, ' '));
      guestNameElement.textContent = guestName;
    }
  }
});

// =======================
// 1. Countdown Timer
// =======================
const targetDate = new Date("31 May, 2025 09:00:00").getTime();
const timerElement = document.getElementById("timer");

// Ensure timerElement exists before attempting to update it
if (timerElement) {
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
}


// =======================
// 2. Modal Galeri Foto
// =======================
function openModal(img) {
  const modal = document.getElementById("imgModal");
  const modalImg = document.getElementById("modalImg");
  if (modal && modalImg) { // Added check for modal and modalImg
    modal.style.display = "block";
    modalImg.src = img.src;
  }
}

function closeModal() {
  const modal = document.getElementById("imgModal");
  if (modal) { // Added check for modal
    modal.style.display = "none";
  }
}

// =======================
// 3. Efek Fade Out & Buka Undangan (Merged with 4)
// =======================

// =======================
// 4. Scroll Control dan Event Listener Tombol Buka Undangan
// =======================
// Initial state: body has 'noscroll' class
document.body.classList.add('noscroll');

// Helper function for smooth scrolling (if still needed, though scrollIntoView is used)
function smoothScrollTo(element, duration = 3000) {
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
if (openBtn) { // Ensure openBtn exists
  openBtn.addEventListener('click', () => {
    const hero = document.getElementById("hero");
    const mainContent = document.getElementById('main-content');

    // Fade out the hero section
    if (hero) {
      hero.classList.add("fade-out");
      setTimeout(() => {
        hero.style.display = "none";
        // mainContent will be shown below
      }, 1000);
    }

    // Show main content and remove no-scroll
    if (mainContent) {
      mainContent.style.display = 'block';
      document.body.classList.remove('noscroll');
      mainContent.scrollIntoView({ behavior: 'smooth' });
    }

    // Hide the open button
    openBtn.classList.add('hide');
    setTimeout(() => {
      openBtn.style.display = 'none';
    }, 1000);

    // Play background music (moved from section 7 for better organization)
    const bgMusic = document.getElementById('bg-music');
    if (bgMusic) {
      bgMusic.play().catch(() => {
        console.log("Autoplay ditolak. Musik akan mulai setelah interaksi berikutnya.");
      });
    }
  });
}


// =======================
// 5. Efek Parallax dan Blur Background Hero Saat Scroll
// =======================
(() => {
  const hero = document.querySelector('.hero');
  if (!hero) return; // Exit if hero element is not found

  let baseOffset = -100;
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
    targetOffset = Math.min(baseOffset, Math.max(targetOffset, baseOffset - 100)); // Clamp targetOffset
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
// Ensure observer is created only if there are elements to observe
if (animateEls.length > 0) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      } else {
        // Optionally remove 'visible' class when out of view
        entry.target.classList.remove('visible');
      }
    });
  }, { threshold: 0.1 });

  animateEls.forEach(el => observer.observe(el));
}


// =======================
// 7. Putar Musik Background Saat Tombol Buka Undangan Diklik (Logic moved to section 4)
// =======================
// This section is now just for the general body click to play music if paused
const bgMusic = document.getElementById('bg-music');
if (bgMusic) { // Ensure bgMusic element exists
  document.body.addEventListener('click', () => {
    if (bgMusic.paused) bgMusic.play();
  }, { once: true });
}


// =======================
// 8. Firebase: Inisialisasi dan Setup Firestore
// =======================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, serverTimestamp, query, orderBy } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCX1_3YA9L1xx1AHQsUXGZ4x7p_U0_Pczc",
  authDomain: "undangan-rofiq.firebaseapp.com",
  projectId: "undangan-rofiq",
  storageBucket: "undangan-rofiq.firebasestorage.app",
  messagingSenderId: "647019327634",
  appId: "1:647019327634:web:76dca38c2bbe91e82f764b",
  measurementId: "G-25GHYB1YPQ"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// =======================
// 9. Form RSVP: Submit & Load Comments
// =======================
const form = document.getElementById("rsvp-form");
const commentSection = document.getElementById("comment-section");

if (form && commentSection) { // Ensure form and commentSection exist
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const nameInput = document.getElementById("guest-name"); // Get the input element
    const messageInput = document.getElementById("guest-message"); // Get the input element
    const attendanceInput = document.getElementById("guest-attendance"); // Get the input element

    const name = nameInput ? nameInput.value.trim() : ''; // Get value and trim
    const message = messageInput ? messageInput.value.trim() : ''; // Get value and trim
    const attendance = attendanceInput ? attendanceInput.value : ''; // Get value

    if (name && message && attendance) {
      await addDoc(collection(db, "comments"), {
        name,
        message,
        attendance,
        timestamp: serverTimestamp()
      });
      form.reset();
      // Store the name in local storage after a successful submission
      localStorage.setItem("guestName", name);
      loadComments();
    }
  });
}


async function loadComments() {
  if (!commentSection) return; // Exit if commentSection is not found

  commentSection.innerHTML = "";
  const q = query(collection(db, "comments"), orderBy("timestamp", "desc"));

  try {
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      commentSection.innerHTML = "<p>Belum ada ucapan. Jadilah yang pertama!</p>";
    } else {
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        // Handle cases where timestamp might be missing or not a Timestamp object
        const time = data.timestamp && data.timestamp.seconds ? new Date(data.timestamp.seconds * 1000) : new Date();
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
    }
  } catch (error) {
    console.error("Error memuat komentar:", error);
    commentSection.innerHTML = "<p>Gagal memuat komentar. Silakan coba lagi nanti.</p>"; // User-friendly error message
  }
}

// Load saved name from local storage when the page loads
document.addEventListener('DOMContentLoaded', () => {
  const savedName = localStorage.getItem("guestName");
  const guestNameInput = document.getElementById("guest-name");
  if (savedName && guestNameInput) {
    guestNameInput.value = savedName;
  }
});

// Initial load of comments
loadComments();

// =======================
// 10. Toggle dan Salin Info Rekening Hadiah
// =======================
const toggleGiftBtn = document.getElementById("toggleGiftBtn");
const giftDetails = document.getElementById("giftDetails");
const copyBtn = document.getElementById('copyBtn');
const toast = document.getElementById('toast');

if (toggleGiftBtn && giftDetails) { // Ensure elements exist
  toggleGiftBtn.addEventListener("click", () => {
    giftDetails.style.display = giftDetails.style.display === "block" ? "none" : "block";
  });
}

function showToast() {
  if (toast) { // Ensure toast element exists
    toast.classList.add("show");
    setTimeout(() => {
      toast.classList.remove("show");
    }, 2500);
  }
}

function copyText(text) {
  if (navigator.clipboard) {
    return navigator.clipboard.writeText(text);
  } else {
    // Fallback for older browsers
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

if (copyBtn) { // Ensure copyBtn exists
  copyBtn.onclick = () => {
    const rekeningNumberElement = document.getElementById('rekening-number');
    if (rekeningNumberElement) { // Ensure rekeningNumberElement exists
      const rekeningText = rekeningNumberElement.childNodes[0].nodeValue.trim();
      copyText(rekeningText).then(() => {
        showToast();
      }).catch(err => {
        console.error('Error copying text:', err);
      });
    }
  };
}


// Munculkan animasi saat scroll (Re-checked for proper use)
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
