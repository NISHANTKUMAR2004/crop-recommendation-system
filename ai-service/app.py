from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route("/")
def home():
    return "🤖 AI Service Running"

@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()

    soil = data.get("soil", "").lower()
    temp = float(data.get("temperature", 0))
    rain = float(data.get("rainfall", 0))
    humidity = float(data.get("humidity", 0))

    if rain < 300:
        recommendations = [
            {"crop": "millet", "score": 92, "risk": "Low"},
            {"crop": "maize", "score": 85, "risk": "Medium"},
            {"crop": "cotton", "score": 78, "risk": "High"},
            {"crop": "mothbeans", "score": 70, "risk": "Low"}
        ]
    elif temp > 30:
        recommendations = [
            {"crop": "rice", "score": 95, "risk": "Low"},
            {"crop": "sugarcane", "score": 88, "risk": "Medium"},
            {"crop": "banana", "score": 82, "risk": "Low"},
            {"crop": "papaya", "score": 75, "risk": "High"}
        ]
    else:
        recommendations = [
            {"crop": "wheat", "score": 96, "risk": "Low"},
            {"crop": "peas", "score": 89, "risk": "Low"},
            {"crop": "chickpea", "score": 84, "risk": "Medium"},
            {"crop": "lentil", "score": 77, "risk": "High"}
        ]

    return jsonify({
        "recommendations": recommendations,
        "message": "AI suggests 4 crops based on given conditions."
    })

if __name__ == "__main__":
    app.run(port=5001, debug=True)