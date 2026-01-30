# 🚀 Quick Start Guide

## Credit Card AI Analyzer - Full-Stack Web Application

Welcome! This guide will help you get the application running in just a few minutes.

---

## ⚡ Prerequisites

Before you begin, make sure you have:

1. **Python 3.12+** installed ([Download here](https://www.python.org/downloads/))
2. **OpenAI API Key** ([Get one here](https://platform.openai.com/api-keys))
3. **Modern web browser** (Chrome, Firefox, Edge, or Safari)

---

## 📦 Step 1: Install Dependencies

Open your terminal/command prompt in the project directory and run:

```bash
pip install -r requirements.txt
```

This will install all necessary Python packages:
- Flask (web framework)
- LangChain (AI orchestration)
- OpenAI (GPT-4o-mini Vision API)
- Flask-CORS (cross-origin support)
- And more...

---

## 🔑 Step 2: Configure Your API Key

1. Open the `.env` file in the project directory
2. Replace `your_openai_api_key_here` with your actual OpenAI API key:

```
OPENAI_API_KEY=your-api-key-goes-here
```

**Important:** Keep your API key secret! Never share it or commit it to version control.

---

## 🎯 Step 3: Start the Backend Server

Run the Flask backend:

```bash
python app.py
```

You should see:
```
✅ OpenAI API key loaded successfully

============================================================
🚀 Credit Card Analysis API Server
============================================================
Phase 1: Statement Data Extraction
Server running on: http://localhost:5000
============================================================
```

**Keep this terminal window open!** The backend must be running for the application to work.

---

## 🌐 Step 4: Open the Frontend

Simply open `index.html` in your web browser:

**Option 1:** Double-click the `index.html` file

**Option 2:** Right-click `index.html` → Open with → Your browser

**Option 3:** Drag and drop `index.html` into your browser window

---

## 🎉 Step 5: Start Using the Application!

### Feature 1: Statement Data Extraction

1. Click on the first upload zone or drag & drop a credit card statement image
2. Click "Extract Data"
3. Wait a few seconds for AI analysis
4. View the extracted information (customer name, card number, dates, amounts)

### Feature 2: Spending Analysis & Reduction

1. Click on the second upload zone or drag & drop a credit card statement image
2. Enter your target reduction percentage (e.g., 20 for 20%)
3. Click "Analyze Spending"
4. Wait for AI to analyze your spending patterns
5. View category breakdown and personalized recommendations!

---

## 📁 Sample Statements

The project includes 3 sample credit card statements in the `sample_statements/` folder:
- `statement1.png` - For testing data extraction
- `statement2.png` - Alternative test statement
- `statement3.png` - For testing spending analysis

Try them out to see how the AI works!

---

## ❌ Troubleshooting

### "Failed to connect to the server"
- **Solution:** Make sure the Flask backend is running (`python app.py`)
- Check that you see the success message in the terminal

### "OPENAI_API_KEY not found"
- **Solution:** Make sure you've created the `.env` file and added your API key
- Restart the Flask server after adding the key

### "Module not found" errors
- **Solution:** Install dependencies: `pip install -r requirements.txt`

### Port 5000 already in use
- **Solution:** Either:
  - Close the application using port 5000
  - Or edit `app.py` and change the port number (line at the bottom)

### API rate limit errors
- **Solution:** You may have exceeded your OpenAI API quota
- Check your usage at https://platform.openai.com/usage

---

## 💡 Tips for Best Results

1. **Use clear images:** Higher quality images produce better extraction results
2. **Standard formats:** PNG and JPEG work best
3. **Realistic percentages:** For spending reduction, try 10-30% for practical recommendations
4. **Multiple statements:** Try different statements to see how the AI adapts

---

## 🎨 Features Highlights

✨ **Modern UI Design**
- Glassmorphism effects
- Smooth animations
- Gradient backgrounds
- Responsive design (works on mobile too!)

🤖 **AI-Powered Analysis**
- GPT-4o-mini Vision API
- Accurate data extraction
- Smart spending categorization
- Personalized recommendations

⚡ **Fast & Efficient**
- Results in 5-10 seconds
- Real-time preview
- Drag & drop support
- Error handling

---

## 📚 Need More Help?

Check out the full `README.md` for:
- Detailed API documentation
- Architecture overview
- Development guide
- Advanced troubleshooting

---

## 🎯 What's Next?

Once you're comfortable with the application:
1. Try uploading your own credit card statements
2. Experiment with different reduction percentages
3. Compare recommendations across different months
4. Use the insights to improve your financial habits!

---

**Enjoy using Credit Card AI Analyzer! 🚀**

Built with ❤️ using OpenAI GPT-4o-mini, LangChain, Flask, and modern web technologies.
