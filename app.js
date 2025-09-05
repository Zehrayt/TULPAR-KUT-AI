document.addEventListener("DOMContentLoaded", () => {
    const contentContainer = document.getElementById("content-container");

    const loadPage = async (pageName) => {
        try {
            contentContainer.innerHTML = '<div class="text-center p-5"><div class="spinner-border text-danger" role="status"><span class="visually-hidden">Yükleniyor...</span></div></div>';
            const response = await fetch(`partials/${pageName}.html`);
            if (!response.ok) throw new Error(`'${pageName}.html' bulunamadı.`);
            const html = await response.text();
            contentContainer.innerHTML = html;

            const scripts = Array.from(contentContainer.querySelectorAll("script"));
            for (const oldScript of scripts) {
                const newScript = document.createElement("script");
                Array.from(oldScript.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
                newScript.appendChild(document.createTextNode(oldScript.innerHTML));
                oldScript.parentNode.replaceChild(newScript, oldScript);
            }
        } catch (error) {
            console.error("Sayfa Yükleme Hatası:", error);
            contentContainer.innerHTML = `<div class="alert alert-danger text-center">${error.message}</div>`;
        }
    };

    function attachOyunKonusuEvents() {
        const openBtn = document.getElementById("open-textbox-btn");
        const closeBtn = document.getElementById("close-btn");
        const overlay = document.getElementById("overlay");

        if (openBtn && overlay) {
            openBtn.addEventListener("click", () => {
                overlay.classList.add("active");
            });
        }

        if (closeBtn && overlay) {
            closeBtn.addEventListener("click", () => {
                overlay.classList.remove("active");
            });
        }
        if (overlay) {
            overlay.addEventListener("click", (e) => {
                if (e.target === overlay) {
                    overlay.classList.remove("active");
                }
            });
        }
    }

    const loadSection = async (sectionId) => {
        try {
            const response = await fetch("partials/anasayfa.html");
            if (!response.ok) throw new Error("anasayfa.html bulunamadı.");
            const html = await response.text();
            const tempDiv = document.createElement("div");
            tempDiv.innerHTML = html;
            const section = tempDiv.querySelector(sectionId);
            if (section) {
                contentContainer.innerHTML = "";
                contentContainer.appendChild(section);
                window.scrollTo({ top: contentContainer.offsetTop, behavior: "smooth" });
                if (sectionId === "#oyunkonusu") attachOyunKonusuEvents();
            } else {
                throw new Error("Bölüm bulunamadı.");
            }
        } catch (error) {
            console.error("Bölüm Yükleme Hatası:", error);
            contentContainer.innerHTML = `<div class="alert alert-danger text-center">${error.message}</div>`;
        }
    };

    document.body.addEventListener('click', function(e) {
        const pageLink = e.target.closest('a[data-page]');
        if (pageLink) {
            e.preventDefault();
            loadPage(pageLink.getAttribute('data-page'));
            return;
        }

        const sectionLink = e.target.closest('a[data-section]');
        if (sectionLink) {
            e.preventDefault();
            loadSection(sectionLink.getAttribute('data-section'));
            return;
        }

        const logoutButton = e.target.closest('#logout-button');
        if (logoutButton) {
            e.preventDefault();
            localStorage.removeItem('userToken');
            localStorage.removeItem('userId');
            alert('Başarıyla çıkış yaptınız.');
            window.location.href = 'index.html';
        }
    });

    loadPage("anasayfa");
});