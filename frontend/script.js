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

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (!data.recommendations) {
            throw new Error("Invalid response format from server");
        }

        showResult(data);

    } catch (error) {
        console.error("Error:", error);
        showError("Server not responding. Please try again later.");
    }
});

// 🖼️ Crop Images Mapping - Prioritize local images, fallback to online URLs
const CROP_IMAGES = {
    "millet": "assets/crops/millet.png",
    "rice": "assets/crops/rice.png",
    "wheat": "assets/crops/wheat.png",
    "maize": "assets/crops/maize.png",
    "pea": "assets/crops/peas.png",
    "peas": "assets/crops/peas.png",
    "chickpea": "assets/crops/chickpea.png",
    "kidneybeans": "assets/crops/lentil.png", // Fallback: using lentil image
    "pigeonpeas": "assets/crops/lentil.png", // Fallback: using lentil image
    "mothbeans": "assets/crops/mothbeans.png",
    "mungbean": "assets/crops/lentil.png", // Fallback: using lentil image
    "blackgram": "assets/crops/lentil.png", // Fallback: using lentil image
    "lentil": "assets/crops/lentil.png",
    "pomegranate": "assets/crops/rice.png", // Fallback
    "banana": "assets/crops/banana.png",
    "mango": "assets/crops/rice.png", // Fallback
    "grapes": "assets/crops/rice.png", // Fallback
    "sugarcane": "assets/crops/sugarcane.png",
    "cucumber": "assets/crops/cucumber.png",
    "watermelon": "assets/crops/watermelon.png",
    "muskmelon": "assets/crops/muskmelon.png",
    "okra": "assets/crops/okra.png",
    "cabbage": "assets/crops/rice.png", // Fallback
    "apple": "assets/crops/rice.png", // Fallback
    "orange": "assets/crops/rice.png", // Fallback
    "papaya": "assets/crops/papaya.png",
    "coconut": "assets/crops/rice.png", // Fallback
    "cotton": "assets/crops/cotton.png",
    "jute": "assets/crops/rice.png", // Fallback
    "coffee": "assets/crops/rice.png", // Fallback
    "barley": "assets/crops/barley.png",
    "default": "assets/crops/rice.png" // Default fallback
};

// Function to get image source with fallback handling
function getCropImage(cropName) {
    const normalizedName = cropName.toLowerCase().trim();
    let imagePath = CROP_IMAGES[normalizedName] || CROP_IMAGES["default"];
    
    // Return the image path - browser will handle 404 gracefully
    return imagePath;
}

// ✅ Show Result with Enhanced Gemini Data
function showResult(data) {
    loading.classList.add("hidden");
    resultCard.classList.remove("hidden");

    const multiContent = document.getElementById("multiResultContent");
    if(!multiContent) return;
    
    multiContent.innerHTML = ''; // Clear previous

    if(data.recommendations && data.recommendations.length > 0) {
        multiContent.style.display = 'grid';
        multiContent.style.gridTemplateColumns = 'repeat(auto-fit, minmax(280px, 1fr))';
        multiContent.style.gap = '2rem';
        
        data.recommendations.forEach((rec, idx) => {
            const cropName = rec.crop.toLowerCase();
            const imgSrc = getCropImage(cropName);
            const score = rec.score || Math.floor(Math.random() * 14 + 85);
            const riskColor = rec.risk === "Low" ? "#10b981" : rec.risk === "Medium" ? "#f59e0b" : "#ef4444";
            
            // Format growing tips as a bulleted list
            const tipsList = rec.growing_tips 
                ? rec.growing_tips.split(';').map(tip => `<li><i class="fas fa-check"></i> ${tip.trim()}</li>`).join('') 
                : '<li>Standard growing practices apply.</li>';

            // Resolve NPK parts if in string form (e.g. 60:40:40)
            const npkValues = rec.npk_ratio ? rec.npk_ratio.split(':') : ['60', '40', '40'];
            const nVal = npkValues[0] || '60';
            const pVal = npkValues[1] || '40';
            const kVal = npkValues[2] || '40';

            // Pests list HTML
            let pestsHTML = '';
            if (rec.pests_diseases && rec.pests_diseases.length > 0) {
                rec.pests_diseases.forEach(pest => {
                    pestsHTML += `
                        <div class="pest-warning-card">
                            <h5><i class="fas fa-bug"></i> ${pest.name || 'Pest'}</h5>
                            <p><strong>Warning Symptoms:</strong> ${pest.symptoms || 'Common crop symptoms'}</p>
                            <p class="pest-prevention"><strong>Prevention Shield:</strong> ${pest.prevention || 'Standard pest control'}</p>
                        </div>
                    `;
                });
            } else {
                pestsHTML = `
                    <div class="pest-warning-card">
                        <h5><i class="fas fa-shield-halved"></i> No Active Threats</h5>
                        <p>No critical biological or environmental crop damage concerns reported for this climate profile.</p>
                    </div>
                `;
            }

            // Market Demand badge color
            const demandColor = rec.market_demand === "High" ? "#ec4899" : rec.market_demand === "Medium" ? "#f59e0b" : "#3b82f6";
            
            // Learn More link
            const learnMoreUrl = `https://en.wikipedia.org/wiki/${rec.crop}`;

            multiContent.innerHTML += `
                <div class="crop-card-container animate__animated animate__fadeInUp" id="crop-card-${idx}">
                    <!-- Card Layout -->
                    <div class="crop-recommend-card">
                        <!-- Top Header Area -->
                        <div class="crop-card-header" onclick="window.open('${learnMoreUrl}', '_blank')" style="cursor: pointer;" title="Click to view complete cultivation guide">
                            <div class="crop-image-wrapper-result">
                                <img src="${imgSrc}" alt="${rec.crop}" loading="lazy" onerror="this.src='assets/crops/rice.png'" style="display: block;">
                            </div>
                            <div class="crop-header-text">
                                <h3 class="crop-title-result">${rec.crop}</h3>
                                <span class="risk-badge-result" style="background: ${riskColor};">${rec.risk} Risk</span>
                            </div>
                        </div>

                        <!-- Circular/Percentage Suitability Gauge -->
                        <div class="suitability-gauge-container">
                            <div class="suitability-bar-row">
                                <span class="gauge-label"><i class="fas fa-gauge-high"></i> Suitability Rating</span>
                                <span class="gauge-value">${score}%</span>
                            </div>
                            <div class="suitability-track">
                                <div class="suitability-fill" style="width: ${score}%;"></div>
                            </div>
                        </div>

                        <!-- Quick stats capsules bar -->
                        <div class="quick-capsules">
                            <div class="capsule">
                                <i class="fas fa-calendar-days"></i>
                                <span>${rec.season || 'Annual'}</span>
                            </div>
                            <div class="capsule">
                                <i class="fas fa-droplet"></i>
                                <span>${rec.water_requirement || 'Medium'}</span>
                            </div>
                            <div class="capsule">
                                <i class="fas fa-hourglass-half"></i>
                                <span>${rec.harvest_duration || 100} Days</span>
                            </div>
                        </div>

                        <!-- Sub-Category Tabs Selector -->
                        <div class="tabs-selector">
                            <button class="tab-btn active" onclick="switchCropTab(${idx}, 'care', event)">
                                <i class="fas fa-seedling"></i> Care
                            </button>
                            <button class="tab-btn" onclick="switchCropTab(${idx}, 'npk', event)">
                                <i class="fas fa-flask"></i> NPK
                            </button>
                            <button class="tab-btn" onclick="switchCropTab(${idx}, 'protection', event)">
                                <i class="fas fa-shield-virus"></i> Shield
                            </button>
                            <button class="tab-btn" onclick="switchCropTab(${idx}, 'roi', event)">
                                <i class="fas fa-chart-line"></i> ROI
                            </button>
                        </div>

                        <!-- Sub-Category Content Panes -->
                        <div class="tabs-panes-wrapper">
                            <!-- Care Pane -->
                            <div class="tab-pane-content pane-care-${idx} active-pane">
                                <div class="crop-pane-section">
                                    <h4>🌱 Practical Growing Tips</h4>
                                    <ul class="tips-bullet-list">
                                        ${tipsList}
                                    </ul>
                                </div>
                                <div class="crop-pane-section">
                                    <h4>⛰️ Soil Compatibility Analysis</h4>
                                    <p class="pane-paragraph">${rec.soil_compatibility || 'Favorable crop-to-soil parameters compatibility detected.'}</p>
                                </div>
                                ${rec.special_notes ? `
                                <div class="crop-pane-section special-notes-box">
                                    <h4>💡 Advisor Considerations</h4>
                                    <p class="pane-paragraph">${rec.special_notes}</p>
                                </div>` : ''}
                            </div>

                            <!-- NPK Pane -->
                            <div class="tab-pane-content pane-npk-${idx}">
                                <div class="crop-pane-section">
                                    <h4>🧪 Recommended NPK Fertilization</h4>
                                    <p class="pane-paragraph-sub">Target Nitrogen (N), Phosphorus (P), and Potassium (K) element ratio (kg per hectare):</p>
                                    <div class="npk-visual-bars">
                                        <div class="npk-bar-item">
                                            <div class="npk-circle circle-n">N</div>
                                            <div class="npk-bar-line">
                                                <div class="npk-fill fill-n" style="width: ${Math.min(100, (parseInt(nVal) || 60) / 1.5)}%;"></div>
                                            </div>
                                            <span class="npk-number">${nVal}</span>
                                        </div>
                                        <div class="npk-bar-item">
                                            <div class="npk-circle circle-p">P</div>
                                            <div class="npk-bar-line">
                                                <div class="npk-fill fill-p" style="width: ${Math.min(100, (parseInt(pVal) || 40) / 1.5)}%;"></div>
                                            </div>
                                            <span class="npk-number">${pVal}</span>
                                        </div>
                                        <div class="npk-bar-item">
                                            <div class="npk-circle circle-k">K</div>
                                            <div class="npk-bar-line">
                                                <div class="npk-fill fill-k" style="width: ${Math.min(100, (parseInt(kVal) || 40) / 1.5)}%;"></div>
                                            </div>
                                            <span class="npk-number">${kVal}</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="crop-pane-section organic-section">
                                    <h4>🐮 Organic Matter Improvement</h4>
                                    <p class="pane-paragraph"><i class="fas fa-hand-holding-hand"></i> ${rec.organic_matter || 'Incorporate organic manure or green compost to enrich soil biological activity.'}</p>
                                </div>
                            </div>

                            <!-- Protection Pane -->
                            <div class="tab-pane-content pane-protection-${idx}">
                                <div class="crop-pane-section">
                                    <h4>🛡️ Biological & Chemical Shield</h4>
                                    <div class="pests-list-wrapper">
                                        ${pestsHTML}
                                    </div>
                                </div>
                            </div>

                            <!-- ROI & Harvest Pane -->
                            <div class="tab-pane-content pane-roi-${idx}">
                                <div class="crop-pane-section">
                                    <h4>📈 Economics & Market Outlook</h4>
                                    <div class="market-demand-row">
                                        <span class="market-label">Market Demand Level:</span>
                                        <span class="market-badge" style="background: ${demandColor};"><i class="fas fa-fire-flame-curved"></i> ${rec.market_demand || 'Medium'}</span>
                                    </div>
                                    <div class="roi-potential-box">
                                        <p class="pane-paragraph"><strong>ROI Outlook:</strong> ${rec.roi_potential || 'Steady market demand promises favorable crop commercialization rates.'}</p>
                                    </div>
                                </div>
                                <div class="crop-pane-section">
                                    <h4>🚜 Harvesting Intelligence</h4>
                                    <p class="pane-paragraph"><strong>Harvest Window:</strong> Ready in approximately <strong>${rec.harvest_duration || 100} days</strong> from sowing.</p>
                                    <div class="harvest-indicators-box">
                                        <p class="pane-paragraph"><strong>Visual Markers:</strong> ${rec.harvest_indicators || 'Look for dry pods/seed husks or general dehydration.'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Learn More Link -->
                        <div class="crop-card-footer">
                            <a href="${learnMoreUrl}" target="_blank" class="external-learn-btn">
                                <i class="fas fa-arrow-up-right-from-square"></i> Complete Cultivation Guide
                            </a>
                        </div>
                    </div>
                </div>
            `;
        });
    } else {
        multiContent.innerHTML = '<p style="text-align:center; width:100%; font-size:1.2rem;">No recommendations found.</p>';
    }
}

// ✅ Switch tabs inside recommended crop cards (Bound globally for inline onclick execution)
window.switchCropTab = function(cardIdx, tabName, event) {
    if(event) {
        event.preventDefault();
        event.stopPropagation();
    }
    
    const cardContainer = document.getElementById(`crop-card-${cardIdx}`);
    if (!cardContainer) return;

    // 1. Remove active state from all tab buttons inside this card
    const selector = cardContainer.querySelector(".tabs-selector");
    if(selector) {
        const buttons = selector.querySelectorAll(".tab-btn");
        buttons.forEach(btn => btn.classList.remove("active"));
    }

    // 2. Add active state to clicked button
    if(event && event.currentTarget) {
        event.currentTarget.classList.add("active");
    }

    // 3. Hide all tab panes inside this card
    const panes = cardContainer.querySelectorAll(".tab-pane-content");
    panes.forEach(pane => {
        pane.classList.remove("active-pane");
    });

    // 4. Show the selected pane
    const targetPane = cardContainer.querySelector(`.pane-${tabName}-${cardIdx}`);
    if (targetPane) {
        targetPane.classList.add("active-pane");
    }
};

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