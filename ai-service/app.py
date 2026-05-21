from flask import Flask, request, jsonify
import google.generativeai as genai
import json
import re
import os

app = Flask(__name__)

# Configure Gemini API
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    print("❌ ERROR: GEMINI_API_KEY environment variable not set")
    raise ValueError("GEMINI_API_KEY is required")

genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel('gemini-pro')

@app.route("/")
def home():
    return "🤖 AI Service Running with Gemini Integration"

def get_base_recommendations(soil, temp, rain, humidity):
    """Get initial crop recommendations based on conditions"""
    recommendations = []
    
    if rain < 300:
        recommendations = [
            {"crop": "millet", "reason": "Drought-resistant, ideal for low rainfall"},
            {"crop": "maize", "reason": "Moderate water requirements"},
            {"crop": "cotton", "reason": "Requires less water, suitable for dry regions"},
            {"crop": "mothbeans", "reason": "Legume with low water needs"},
            {"crop": "chickpea", "reason": "Winter crop requiring minimal irrigation"}
        ]
    elif temp > 30:
        recommendations = [
            {"crop": "rice", "reason": "Thrives in warm, wet climates"},
            {"crop": "sugarcane", "reason": "Heat-loving crop with high yields in warm weather"},
            {"crop": "banana", "reason": "Tropical crop perfect for hot, humid regions"},
            {"crop": "papaya", "reason": "Tropical fruit crop for warm regions"},
            {"crop": "coconut", "reason": "Ideal for hot, humid tropical areas"}
        ]
    elif temp < 15:
        recommendations = [
            {"crop": "wheat", "reason": "Cool-season crop, perfect for cold regions"},
            {"crop": "peas", "reason": "Winter crop requiring cool temperatures"},
            {"crop": "barley", "reason": "Cold-resistant cereal crop"},
            {"crop": "apple", "reason": "Requires chilling hours for optimal growth"},
            {"crop": "cabbage", "reason": "Cool-season vegetable with high yield"}
        ]
    else:
        recommendations = [
            {"crop": "wheat", "reason": "Moderate temperature requirements"},
            {"crop": "peas", "reason": "Adaptable to moderate climates"},
            {"crop": "chickpea", "reason": "Good for diverse climate conditions"},
            {"crop": "lentil", "reason": "Legume with moderate climate needs"},
            {"crop": "cucumber", "reason": "Summer vegetable for moderate regions"}
        ]
    
    return recommendations

def enhance_with_gemini(crop, soil, temp, rain, humidity):
    """Use Gemini API to enhance crop recommendation with detailed information"""
    try:
        prompt = f"""
You are an expert agricultural advisor. Based on the following farming conditions, provide detailed, comprehensive, and highly structured information about growing {crop}:

Farming Conditions:
- Soil Type: {soil}
- Temperature: {temp}°C
- Annual Rainfall: {rain}mm
- Humidity: {humidity}%

Please provide a response in valid JSON format with the following exact structure:
{{
    "suitability_score": <number between 70-98>,
    "risk_level": "<Low/Medium/High>",
    "growing_tips": "<2-3 practical growing tips separated by semicolons>",
    "season": "<Best season to plant>",
    "yield_estimate": "<Expected yield range>",
    "water_requirement": "<Water needs assessment>",
    "special_notes": "<Any special considerations or benefits for this soil and climate>",
    "soil_compatibility": "<Detailed explanation of why {crop} is suitable or compatible with {soil} soil under these climate conditions>",
    "npk_ratio": "<Recommended Nitrogen(N) : Phosphorus(P) : Potassium(K) ratio, e.g., 60:40:40 or 120:60:40>",
    "organic_matter": "<Suggestions for organic compost, manure, or green manure improvements>",
    "pests_diseases": [
        {{
            "name": "<Name of Pest/Disease 1>",
            "symptoms": "<Key visual warning symptoms to watch out for>",
            "prevention": "<Practical biological or chemical prevention action>"
        }},
        {{
            "name": "<Name of Pest/Disease 2>",
            "symptoms": "<Key visual warning symptoms to watch out for>",
            "prevention": "<Practical biological or chemical prevention action>"
        }}
    ],
    "market_demand": "<High/Medium/Low>",
    "roi_potential": "<1-2 sentence profitability, pricing, or return on investment outlook>",
    "harvest_duration": <average duration in days from sowing to harvest as an integer, e.g. 120>,
    "harvest_indicators": "<Physical visual markers showing crop maturity and readiness for harvest>"
}}

Ensure the response is fully valid JSON. Do not include markdown code block characters around the JSON, just return the raw JSON text. All values must be strings except suitability_score and harvest_duration which must be integers.
"""
        response = model.generate_content(prompt, safety_settings={
            'HARASSMENT': 'BLOCK_NONE',
            'HATE_SPEECH': 'BLOCK_NONE',
            'SEXUAL': 'BLOCK_NONE',
            'DANGEROUS': 'BLOCK_NONE'
        })
        
        response_text = response.text.strip()
        
        # Try to extract JSON from the response
        json_match = re.search(r'\{[\s\S]*\}', response_text)
        if json_match:
            json_str = json_match.group(0)
            data = json.loads(json_str)
            return data
        else:
            # Fallback if JSON extraction fails
            return {
                "suitability_score": 80,
                "risk_level": "Medium",
                "growing_tips": "Follow standard cultivation practices; ensure proper irrigation",
                "season": "Check local growing calendar",
                "yield_estimate": "Depends on local conditions",
                "water_requirement": "Moderate",
                "special_notes": "Consult local agricultural experts",
                "soil_compatibility": f"Adaptable to {soil} soil under moderate conditions",
                "npk_ratio": "60:40:20",
                "organic_matter": "Apply 5-10 tons of well-decomposed farmyard manure per acre",
                "pests_diseases": [
                    {
                        "name": "Common Aphids",
                        "symptoms": "Curled leaves and yellowing spots",
                        "prevention": "Spray neem oil solution or insecticidal soap"
                    },
                    {
                        "name": "Root Rot",
                        "symptoms": "Wilting plant and darkened, soft roots",
                        "prevention": "Ensure good drainage and apply bio-fungicide like Trichoderma"
                    }
                ],
                "market_demand": "Medium",
                "roi_potential": "Steady market prices with stable investment returns.",
                "harvest_duration": 100,
                "harvest_indicators": "Yellowing leaves and dry seed pods/husks"
            }
            
    except Exception as e:
        print(f"Gemini API Error: {str(e)}")
        # Fallback response
        return {
            "suitability_score": 75,
            "risk_level": "Medium",
            "growing_tips": "Standard cultivation practices recommended",
            "season": "Check local season",
            "yield_estimate": "Variable",
            "water_requirement": "Moderate",
            "special_notes": "Consult local experts",
            "soil_compatibility": f"General compatibility with {soil} soil",
            "npk_ratio": "80:40:40",
            "organic_matter": "Incorporate compost before sowing",
            "pests_diseases": [
                {
                    "name": "Standard Pests",
                    "symptoms": "Leaf damage or spots",
                    "prevention": "Maintain proper sanitation and monitor regularly"
                },
                {
                    "name": "Fungal Spot",
                    "symptoms": "Brown circular spots on lower leaves",
                    "prevention": "Avoid overhead watering and apply copper fungicide"
                }
            ],
            "market_demand": "Medium",
            "roi_potential": "Moderate returns expected with standard farming overheads.",
            "harvest_duration": 110,
            "harvest_indicators": "Physical maturity indicators vary by variety"
        }

@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()

        soil = data.get("soil", "").lower()
        temp = float(data.get("temperature", 0))
        rain = float(data.get("rainfall", 0))
        humidity = float(data.get("humidity", 0))

        print(f"Processing: Soil={soil}, Temp={temp}, Rain={rain}, Humidity={humidity}")

        # Get base recommendations
        base_recommendations = get_base_recommendations(soil, temp, rain, humidity)

        # Enhance each with Gemini
        enhanced_recommendations = []
        for rec in base_recommendations[:4]:  # Limit to top 4 to manage API calls
            crop = rec["crop"]
            enhanced_data = enhance_with_gemini(crop, soil, temp, rain, humidity)
            
            enhanced_recommendations.append({
                "crop": crop,
                "score": enhanced_data.get("suitability_score", 75),
                "risk": enhanced_data.get("risk_level", "Medium"),
                "growing_tips": enhanced_data.get("growing_tips", ""),
                "season": enhanced_data.get("season", ""),
                "yield_estimate": enhanced_data.get("yield_estimate", ""),
                "water_requirement": enhanced_data.get("water_requirement", ""),
                "special_notes": enhanced_data.get("special_notes", ""),
                "soil_compatibility": enhanced_data.get("soil_compatibility", ""),
                "npk_ratio": enhanced_data.get("npk_ratio", ""),
                "organic_matter": enhanced_data.get("organic_matter", ""),
                "pests_diseases": enhanced_data.get("pests_diseases", []),
                "market_demand": enhanced_data.get("market_demand", "Medium"),
                "roi_potential": enhanced_data.get("roi_potential", ""),
                "harvest_duration": enhanced_data.get("harvest_duration", 100),
                "harvest_indicators": enhanced_data.get("harvest_indicators", "")
            })

        return jsonify({
            "recommendations": enhanced_recommendations,
            "message": "AI-enhanced recommendations powered by Google Gemini API",
            "farming_conditions": {
                "soil": soil,
                "temperature": temp,
                "rainfall": rain,
                "humidity": humidity
            }
        })

    except Exception as e:
        print(f"Error in predict: {str(e)}")
        return jsonify({
            "error": "Error processing recommendation",
            "details": str(e)
        }), 500

if __name__ == "__main__":
    print("🚀 AI Service starting on 0.0.0.0:5001 with Gemini Integration...")
    app.run(host="0.0.0.0", port=5001, debug=False)