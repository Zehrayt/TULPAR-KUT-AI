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
    
    // Sadece sayfa linklerini ve çıkış butonunu dinle
    document.body.addEventListener('click', function(e) {
        const pageLink = e.target.closest('a[data-page]');
        if (pageLink) {
            e.preventDefault();
            loadPage(pageLink.getAttribute('data-page'));
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