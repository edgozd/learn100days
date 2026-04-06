from flask import Flask, render_template, request, jsonify, session
import google.generativeai as genai
import os
import uuid
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
app.secret_key = os.getenv("SECRET_KEY", "student-chatbot-secret-2024")

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

SYSTEM_PROMPT = "You are a smart learning assistant for university students. Answer in English, clearly, and provide illustrative examples. Do not do assignments for students; instead, guide them step-by-step."

chat_sessions = {}

@app.route("/")
def index():
    if "session_id" not in session:
        session["session_id"] = str(uuid.uuid4())
    return render_template("index.html")

@app.route("/api/chat", methods=["POST"])
def chat():
    data = request.get_json()
    user_message = data.get("message", "").strip()
    if not user_message:
        return jsonify({"error": "Tin nhắn không được để trống"}), 400

    session_id = session.get("session_id", str(uuid.uuid4()))

    try:
        gemini_model = genai.GenerativeModel(
            model_name="gemini-2.0-flash",
            system_instruction=SYSTEM_PROMPT
        )

        if session_id not in chat_sessions:
            chat_sessions[session_id] = gemini_model.start_chat(history=[])

        chat = chat_sessions[session_id]
        response = chat.send_message(user_message)
        assistant_message = response.text

        if len(chat.history) > 40:
            chat_sessions[session_id] = gemini_model.start_chat(history=chat.history[-40:])

        tokens = 0
        if hasattr(response, "usage_metadata") and response.usage_metadata:
            tokens = response.usage_metadata.total_token_count or 0

        return jsonify({
            "reply": assistant_message,
            "model": "gemini-2.0-flash",
            "tokens_used": tokens,
            "timestamp": datetime.now().strftime("%H:%M")
        })

    except Exception as e:
        error_msg = str(e)
        if "api_key" in error_msg.lower() or "api key" in error_msg.lower():
            return jsonify({"error": "API key không hợp lệ. Kiểm tra lại file .env"}), 401
        elif "quota" in error_msg.lower() or "429" in error_msg:
            return jsonify({"error": "Đã đạt giới hạn request. Đợi 1 phút rồi thử lại."}), 429
        else:
            return jsonify({"error": f"Lỗi: {error_msg}"}), 500

@app.route("/api/clear", methods=["POST"])
def clear_history():
    session_id = session.get("session_id")
    if session_id and session_id in chat_sessions:
        del chat_sessions[session_id]
    return jsonify({"status": "ok"})

@app.route("/api/history", methods=["GET"])
def get_history():
    session_id = session.get("session_id")
    chat = chat_sessions.get(session_id)
    return jsonify({"count": len(chat.history) if chat else 0})

if __name__ == "__main__":
    print("=" * 50)
    print("  AI Chatbot Ho Tro Sinh Vien")
    print("  Powered by Google Gemini (FREE)")
    print("  http://localhost:5000")
    print("=" * 50)
    app.run(debug=True, port=5000)
