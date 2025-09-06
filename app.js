document.addEventListener("DOMContentLoaded", () => {
  const contentContainer = document.getElementById("content-container");

  // ======================================================
  // SAYFA YÜKLEME
  // ======================================================
  const loadPage = async (pageName) => {
    try {
      contentContainer.innerHTML = `
        <div class="text-center p-5">
          <div class="spinner-border text-danger" role="status">
            <span class="visually-hidden">Yükleniyor...</span>
          </div>
        </div>`;
      
      // Kullanıcı paneli farklı path ise buraya düzelt
      let path = pageName === "KullanıcıSayfa" ? `KullanıcıSayfa.html` : `partials/${pageName}.html`;
      const response = await fetch(path);
      if (!response.ok) throw new Error(`'${pageName}.html' bulunamadı.`);
      const html = await response.text();
      contentContainer.innerHTML = html;

      // Partial içindeki scriptleri çalıştır
      const scripts = Array.from(contentContainer.querySelectorAll("script"));
      for (const oldScript of scripts) {
        const newScript = document.createElement("script");
        Array.from(oldScript.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
        newScript.appendChild(document.createTextNode(oldScript.innerHTML));
        oldScript.parentNode.replaceChild(newScript, oldScript);
      }

      // Sayfa açıldığında hikaye ve anket eventlerini ekle
      attachOyunKonusuEvents();
      attachSurveyEvents();
      initCharacterCarousel();
      animateCounters();

    } catch (error) {
      console.error("Sayfa Yükleme Hatası:", error);
      contentContainer.innerHTML = `<div class="alert alert-danger text-center">${error.message}</div>`;
    }
  };

  // ======================================================
  // BÖLÜM YÜKLEME
  // ======================================================
  const loadSection = async (sectionId) => {
    try {
      const response = await fetch("partials/anasayfa.html");
      if (!response.ok) throw new Error("anasayfa.html bulunamadı.");
      const html = await response.text();
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = html;
      const section = tempDiv.querySelector(sectionId);
      if (!section) throw new Error("Bölüm bulunamadı.");
      contentContainer.innerHTML = "";
      contentContainer.appendChild(section);
      window.scrollTo({ top: contentContainer.offsetTop, behavior: "smooth" });

      // Section içi eventler
      attachOyunKonusuEvents();
      attachSurveyEvents();
      initCharacterCarousel();
      animateCounters();
    } catch (error) {
      console.error("Bölüm Yükleme Hatası:", error);
      contentContainer.innerHTML = `<div class="alert alert-danger text-center">${error.message}</div>`;
    }
  };

  // ======================================================
  // HİKAYE / OYUN KONUSU MODAL
  // ======================================================
  const attachOyunKonusuEvents = () => {
    const openBtn = document.getElementById("open-textbox-btn");
    const closeBtn = document.getElementById("close-btn");
    const overlay = document.getElementById("overlay");

    if (openBtn && overlay) openBtn.addEventListener("click", () => overlay.classList.add("active"));
    if (closeBtn && overlay) closeBtn.addEventListener("click", () => overlay.classList.remove("active"));
    if (overlay) overlay.addEventListener("click", (e) => {
      if (e.target === overlay) overlay.classList.remove("active");
    });
  };

  // ======================================================
  // ANKET MODAL
  // ======================================================
  const attachSurveyEvents = () => {
    document.querySelectorAll(".btn-outline-primary").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const modalId = btn.getAttribute("data-target");
        const modal = document.querySelector(modalId);
        if (modal) modal.classList.add("active");
      });
    });

    document.querySelectorAll(".close-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const modal = btn.closest(".survey-modal");
        if (modal) modal.classList.remove("active");
      });
    });

    document.querySelectorAll(".survey-modal").forEach(modal => {
      modal.addEventListener("click", (e) => {
        if (e.target === modal) modal.classList.remove("active");
      });
    });
  };

  // ======================================================
  // SCROLL ANİMASYONLARI
  // ======================================================
  const animateOnScroll = () => {
    document.querySelectorAll(".animate-on-scroll").forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) el.classList.add("active");
      else el.classList.remove("active");
    });
  };
  window.addEventListener("scroll", animateOnScroll);
  animateOnScroll();

  // ======================================================
  // COUNTER ANİMASYONU
  // ======================================================
  const animateCounters = () => {
    const counters = [
      { id: "counter1", target: 12 },
      { id: "counter2", target: 5 },
      { id: "counter3", target: 50 }
    ];
    counters.forEach(counter => {
      const el = document.getElementById(counter.id);
      if (!el) return;
      let current = 0;
      const increment = Math.ceil(counter.target / 100);
      const interval = setInterval(() => {
        current += increment;
        if (current >= counter.target) {
          el.textContent = counter.target;
          clearInterval(interval);
        } else {
          el.textContent = current;
        }
      }, 20);
    });
  };

  // ======================================================
  // KARAKTERLER CAROUSEL
  // ======================================================
  const initCharacterCarousel = () => {
    const carousel = document.querySelector(".character-carousel");
    const cards = document.querySelectorAll(".character-card");
    if (!carousel || cards.length === 0) return;

    const prevBtn = document.querySelector(".prev-btn");
    const nextBtn = document.querySelector(".next-btn");
    let currentIndex = 0;

    const updateCarousel = () => {
      cards.forEach((card, index) => {
        card.classList.toggle("active", index === currentIndex);
      });
      // Yerleri sabit, sadece offset
      const cardWidth = cards[0].offsetWidth + 40;
      const offset = -(cardWidth * currentIndex - (carousel.offsetWidth - cardWidth) / 2);
      carousel.style.transform = `translateX(${offset}px)`;
    };

    if (prevBtn) prevBtn.addEventListener("click", () => {
      currentIndex = (currentIndex - 1 + cards.length) % cards.length;
      updateCarousel();
    });

    if (nextBtn) nextBtn.addEventListener("click", () => {
      currentIndex = (currentIndex + 1) % cards.length;
      updateCarousel();
    });

    updateCarousel();
  };

  // ======================================================
  // NAVBAR / SAYFA GEÇİŞLERİ
  // ======================================================
  document.body.addEventListener("click", (e) => {
    // Sayfa linkleri
    const pageLink = e.target.closest('a[data-page]');
    if (pageLink) {
      e.preventDefault();
      loadPage(pageLink.getAttribute('data-page'));
      return;
    }

    // Section linkleri
    const sectionLink = e.target.closest('a[data-section]');
    if (sectionLink) {
      e.preventDefault();
      loadSection(sectionLink.getAttribute('data-section'));
      return;
    }

    // Logout
    const logoutButton = e.target.closest('#logout-button');
    if (logoutButton) {
      e.preventDefault();
      localStorage.removeItem('userToken');
      localStorage.removeItem('userId');
      alert('Başarıyla çıkış yaptınız.');
      window.location.href = 'index.html';
    }
  });

  // ======================================================
  // SAYFA İLK YÜKLENDİĞİNDE
  // ======================================================
  loadPage("anasayfa");
});
