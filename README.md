# 🎬 AI Video Search & Explainer Engine

An open-source web application that extracts video transcripts and metadata using **yt-dlp** without downloading heavy video files, indexes key concepts, and generates comprehensive 3-paragraph structural breakdowns using modern instruction models.

---

## 🚀 Features

- **Instant Metadata & Subtitle Ingestion**: Uses `yt-dlp` in `skip_download` mode for zero-disk-bloat speed.
- **Split-Screen Dashboard**: Video preview & semantic querying on the left; deep AI narrative breakdown on the right.
- **Open-Weights AI Inference**: Connects directly to Hugging Face or Gemini APIs with zero heavy GPU overhead.
- **Streamlit Cloud Native**: Entrypoint is configured as `streamlit_app.py` for automatic 1-click deployment on **Streamlit Community Cloud**.

---

## 🛠️ Local Development

1. **Clone the repository**:
```bash
git clone https://github.com/your-username/my-video-search-engine.git
cd my-video-search-engine
```

2. **Create and activate a virtual environment**:
```bash
python -m venv venv
# On macOS/Linux:
source venv/bin/activate
# On Windows:
venv\Scripts\activate
```

3. **Install dependencies**:
```bash
pip install -r requirements.txt
```

4. **Run the Streamlit application**:
```bash
streamlit run streamlit_app.py
```

---

## ☁️ Deploy to Streamlit Cloud in 2 Minutes

1. Push your code to a public GitHub repository:
```bash
git add streamlit_app.py requirements.txt .streamlit/
git commit -m "feat: add streamlit_app.py for Streamlit Cloud"
git push origin main
```
2. Visit [share.streamlit.io](https://share.streamlit.io) and sign in with GitHub.
3. Click **"New app"**, select your repository and `main` branch.
4. Main file path: `streamlit_app.py` (automatically detected).
5. Click **Deploy!**
