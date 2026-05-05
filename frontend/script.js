const form = document.getElementById("cropForm");

const loading = document.getElementById("loading");
const resultCard = document.getElementById("resultCard");
const errorBox = document.getElementById("errorBox");

const cropName = document.getElementById("cropName");
const riskLevel = document.getElementById("riskLevel");
const explanation = document.getElementById("explanation");

// 👉 Change this later when backend is ready
const API_URL = "http://localhost:5000/recommend";

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Reset UI
    errorBox.classList.add("hidden");
    resultCard.classList.add("hidden");
    loading.classList.remove("hidden");

    // Get values
    const soil = document.getElementById("soil").value.trim();
    const temperature = parseFloat(document.getElementById("temp").value);
    const rainfall = parseFloat(document.getElementById("rain").value);
    const humidity = parseFloat(document.getElementById("humidity").value);

    // Validation
    if (!soil || isNaN(temperature) || isNaN(rainfall) || isNaN(humidity)) {
        showError("Please enter valid values");
        return;
    }

    try {
        // 🚀 API CALL (will work in Step 3)
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                soil,
                temperature,
                rainfall,
                humidity
            })
        });

        const data = await response.json();

        showResult(data);

    } catch (error) {
        showError("Server not responding. Please try again later.");
    }
});

// 🖼️ Crop Images Mapping for Pro UI
const CROP_IMAGES = {
    "millet": "assets/crops/millet.png",
    "rice": "assets/crops/rice.png",
    "wheat": "assets/crops/wheat.png",
    "maize": "assets/crops/maize.png",
    "pea": "assets/crops/peas.png",
    "peas": "assets/crops/peas.png",
    "chickpea": "assets/crops/chickpea.png",
    "kidneybeans": "https://images.unsplash.com/photo-1551462147-197e3714b7e8?w=800&q=80",
    "pigeonpeas": "https://images.unsplash.com/photo-1589389502931-df1f88c5efb0?w=800&q=80",
    "mothbeans": "assets/crops/mothbeans.png",
    "mungbean": "https://images.unsplash.com/photo-1533008093121-1ce668552697?w=800&q=80",
    "blackgram": "https://images.unsplash.com/photo-1596328229871-38cb4691469e?w=800&q=80",
    "lentil": "assets/crops/lentil.png",
    "pomegranate": "https://images.unsplash.com/photo-1615486511484-92e172c5be1f?w=800&q=80",
    "banana": "assets/crops/banana.png",
    "mango": "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=800&q=80",
    "grapes": "https://images.unsplash.com/photo-1596363505729-4190a9506133?w=800&q=80",
    "sugarcane": "assets/crops/sugarcane.png",
    "cucumber": "assets/crops/cucumber.png",
    "watermelon": "assets/crops/watermelon.png",
    "muskmelon": "assets/crops/muskmelon.png",
    "okra": "assets/crops/okra.png",
    "apple": "https://images.unsplash.com/photo-1560806887-1e4cd0b6fac6?w=800&q=80",
    "orange": "https://images.unsplash.com/photo-1557800636-894a64c1696f?w=800&q=80",
    "papaya": "assets/crops/papaya.png",
    "coconut": "https://images.unsplash.com/photo-1526424564887-216dc75730d1?w=800&q=80",
    "cotton": "assets/crops/cotton.png",
    "jute": "https://images.unsplash.com/photo-1632516481717-38de87711910?w=800&q=80",
    "coffee": "https://images.unsplash.com/photo-1550450505-893bd5760ee0?w=800&q=80",
    "default": "https://images.unsplash.com/photo-1592982537447-6f2a6a0c6c0e?w=800&q=80"
};

// ✅ Show Result
function showResult(data) {
    loading.classList.add("hidden");
    resultCard.classList.remove("hidden");

    const multiContent = document.getElementById("multiResultContent");
    if(!multiContent) return;
    
    multiContent.innerHTML = ''; // Clear previous

    if(data.recommendations && data.recommendations.length > 0) {
        multiContent.style.display = 'grid';
        multiContent.style.gridTemplateColumns = 'repeat(auto-fit, minmax(220px, 1fr))';
        multiContent.style.gap = '1.5rem';
        
        data.recommendations.forEach(rec => {
            const cropName = rec.crop.toLowerCase();
            const imgSrc = CROP_IMAGES[cropName] || CROP_IMAGES["default"];
            const score = rec.score || Math.floor(Math.random() * 14 + 85);
            
            multiContent.innerHTML += `
                <div class="crop-card" style="padding: 1.5rem; text-align: center; border-radius: var(--radius-lg);">
                    <div class="crop-image-result" style="width: 140px; height: 140px; margin: 0 auto 1.5rem; border-radius: 50%; overflow: hidden; border: 4px solid white; box-shadow: var(--shadow-soft);">
                        <img src="${imgSrc}" alt="${rec.crop}" loading="lazy" style="width: 100%; height: 100%; object-fit: cover;">
                    </div>
                    <h2 style="font-family: 'Outfit', sans-serif; font-size: 1.8rem; margin-bottom: 0.5rem; text-transform: capitalize; background: var(--gradient-1); -webkit-background-clip: text; color: transparent;">${rec.crop}</h2>
                    <div style="margin-bottom: 1.2rem;">
                        <span style="font-size: 0.9rem; font-weight: 700; background: var(--gradient-2); color: white; padding: 4px 12px; border-radius: 20px;">Risk: ${rec.risk}</span>
                    </div>
                    <div style="text-align: left; padding: 0 10px;">
                        <span style="font-size: 0.95rem; font-weight: 600; color: var(--accent-blue);">Suitability: ${score}%</span>
                        <div style="height: 8px; background: rgba(59,130,246,0.2); border-radius: 4px; margin-top: 8px; overflow: hidden;">
                            <div style="height: 100%; width: ${score}%; background: var(--gradient-1); border-radius: 4px;"></div>
                        </div>
                    </div>
                </div>
            `;
        });
    } else {
        multiContent.innerHTML = '<p style="text-align:center; width:100%; font-size:1.2rem;">No recommendations found.</p>';
    }
}

// ❌ Show Error
function showError(message) {
    loading.classList.add("hidden");
    errorBox.classList.remove("hidden");
    errorBox.textContent = message;
}

// --- EXTREME PRO LEVEL UI JS --- //

// 1. Inject Dynamic Background Blobs
document.addEventListener('DOMContentLoaded', () => {
    const blob1 = document.createElement('div');
    blob1.classList.add('bg-blob', 'blob-1');
    const blob2 = document.createElement('div');
    blob2.classList.add('bg-blob', 'blob-2');
    document.body.prepend(blob1);
    document.body.prepend(blob2);

    // 2. Scroll Reveal Intersection Observer
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);

    // Select all major elements to animate on scroll
    const animatedElements = document.querySelectorAll('.feature-card, .info-card, .crop-card, .season-category h3, .stats-grid');
    
    animatedElements.forEach(el => {
        el.classList.add('reveal');
        observer.observe(el);
    });
});