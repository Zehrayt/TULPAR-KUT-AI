document.addEventListener('DOMContentLoaded', () => {

    const questions = [
        { text: "Ellerimi kullanarak somut bir şeyler üretmek (örneğin mobilya montajı, model yapımı).", category: 'R' },
        { text: "Açık havada çalışmak veya doğayla iç içe olmak (örneğin bahçe işleri, kamp).", category: 'R' },
        { text: "Mekanik aletleri veya elektronik cihazları tamir etmek.", category: 'R' },

        { text: "Karmaşık bir konu üzerinde derinlemesine araştırma yapmak.", category: 'I' },
        { text: "Bilimsel deneyler tasarlamak veya veri analizi yapmak.", category: 'I' },
        { text: "Zorlu bir bulmacayı veya mantık problemini çözmek.", category: 'I' },
        
        { text: "Hayal gücümü kullanarak özgün bir şeyler tasarlamak (resim, müzik, yazı).", category: 'A' },
        { text: "Yapılandırılmamış ve esnek bir çalışma ortamında yeni fikirler üretmek.", category: 'A' },
        { text: "Bir şeyleri estetik olarak daha güzel hale getirmek (dekorasyon, tasarım).", category: 'A' },
        
        { text: "İnsanlara bir konuda yardımcı olmak veya onlara danışmanlık yapmak.", category: 'S' },
        { text: "Bir ekibin parçası olarak ortak bir hedef için iş birliği yapmak.", category: 'S' },
        { text: "Başkalarını dinlemek ve onların sorunlarına çözüm bulmaya çalışmak.", category: 'S' },
        
        { text: "Bir projeye liderlik etmek ve insanları motive etmek.", category: 'E' },
        { text: "Başkalarını bir ürün veya fikir konusunda ikna etmeye çalışmak.", category: 'E' },
        { text: "Risk alarak yeni bir iş kurma veya bir projeyi yönetme fikri.", category: 'E' },
        
        { text: "Bilgileri dikkatli bir şekilde düzenlemek ve sınıflandırmak.", category: 'C' }, 
        { text: "Belirlenmiş kurallara ve prosedürlere harfiyen uymak.", category: 'C' },
        { text: "Bütçe hazırlamak, hesaplama yapmak gibi detay odaklı görevlerle uğraşmak.", category: 'C' }
    ];

    const descriptions = {
        R: { title: 'Gerçekçi (Realistic)', desc: 'Siz bir "yapıcısınız". Somut, elle tutulur sonuçlar görmekten hoşlanırsınız. Aletlerle çalışmak, doğada olmak ve mekanik sistemler ilginizi çeker.', jobs: 'Mühendis, teknisyen, pilot, marangoz, sporcu.' },
        I: { title: 'Araştırmacı (Investigative)', desc: 'Siz bir "düşünürsünüz". Gözlem yapmayı, öğrenmeyi, araştırmayı ve problemleri analiz ederek çözmeyi seversiniz.', jobs: 'Bilim insanı, doktor, yazılım geliştirici, analist.' },
        A: { title: 'Sanatçı (Artistic)', desc: 'Siz bir "yaratıcısınız". Hayal gücünüzü kullanarak kendinizi ifade etmekten keyif alırsınız. Özgün ve sezgisel bir yapınız var.', jobs: 'Yazar, müzisyen, grafiker, aktör, mimar.' },
        S: { title: 'Sosyal (Social)', desc: 'Siz bir "yardımcısınız". Başkalarıyla çalışmaktan, onlara yardım etmekten ve öğretmekten motive olursunuz.', jobs: 'Öğretmen, psikolog, hemşire, sosyal hizmet uzmanı.' },
        E: { title: 'Girişimci (Enterprising)', desc: 'Siz bir "ikna edicisiniz". Liderlik etmeyi, başkalarını etkilemeyi ve hedeflere ulaşmak için harekete geçmeyi seversiniz.', jobs: 'Yönetici, avukat, satış müdürü, girişimci.' },
        C: { title: 'Geleneksel (Conventional)', desc: 'Siz bir "düzenleyicisiniz". Verilerle çalışmayı, işleri organize etmeyi ve belirli bir düzen içinde hareket etmeyi seversiniz.', jobs: 'Muhasebeci, bankacı, kütüphaneci, ofis yöneticisi.' }
    };

    const questionsContainer = document.getElementById('test-questions');
    const testForm = document.getElementById('test-form');
    const resultsContainer = document.getElementById('results');
    const resultsContent = document.getElementById('results-content');
    
    // Soruları ekrana çiz
    function renderQuestions() {
        questions.forEach((q, index) => {
            const questionGroup = document.createElement('div');
            questionGroup.className = 'question-group';

            questionGroup.innerHTML = `
                <p>${index + 1}. ${q.text}</p>
                <div class="options" data-category="${q.category}">
                    <input type="radio" id="q${index}_opt1" name="q${index}" value="0" required>
                    <label for="q${index}_opt1">Hiç Hoşlanmam</label>
                    
                    <input type="radio" id="q${index}_opt2" name="q${index}" value="1">
                    <label for="q${index}_opt2">Biraz Hoşlanırım</label>
                    
                    <input type="radio" id="q${index}_opt3" name="q${index}" value="2">
                    <label for="q${index}_opt3">Çok Hoşlanırım</label>
                </div>
            `;
            questionsContainer.appendChild(questionGroup);
        });
    }

    testForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const scores = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
        const formData = new FormData(testForm);

        for(let i = 0; i < questions.length; i++){
            const value = formData.get(`q${i}`);
            if(value !== null) {
                const category = questions[i].category;
                scores[category] += parseInt(value);
            }
        }
        
      
        const sortedScores = Object.entries(scores).sort((a, b) => b[1] - a[1]);
        

        displayResults(sortedScores);
    });
   
    function displayResults(sortedScores) {
        resultsContent.innerHTML = '';

        const topThree = sortedScores.slice(0, 3);
        const hollandCode = topThree.map(item => item[0]).join('');

        let resultHTML = `<p>Kariyer eğilimlerinizi yansıtan Holland Kodunuz: <strong>${hollandCode}</strong></p>`;
        resultHTML += `<hr style="margin: 15px 0;">`;
        
        topThree.forEach(([code, score]) => {
            const info = descriptions[code];
            resultHTML += `
                <h4><strong>${info.title}</strong></h4>
                <p>${info.desc}</p>
                <p><em>Örnek Meslekler:</em> ${info.jobs}</p>
                <br>
            `;
        });
        
        resultsContent.innerHTML = resultHTML;
        resultsContainer.classList.remove('hidden');
        resultsContainer.scrollIntoView({ behavior: 'smooth' });
    }
    

    document.getElementById('year').textContent = new Date().getFullYear();

    renderQuestions();

  
});


    
    
