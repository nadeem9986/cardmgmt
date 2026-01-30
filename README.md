# Credit Card Analysis Web Application

A modern full-stack web application that uses AI to analyze credit card statements and provide intelligent spending recommendations.

## 🎯 Features

### Phase 1: Statement Data Extraction ✅
- Upload credit card statement images
- Extract key information using OpenAI Vision API:
  - Customer Name
  - Card Account Number
  - Statement Date
  - Total Amount Due
  - Minimum Amount Due
  - Due Date

### Phase 2: Spending Analysis (Coming Soon)
- Categorize transactions automatically
- Get AI-powered spending reduction recommendations
- Visualize spending patterns by category

## 🛠️ Technology Stack

### Backend
- **Python 3.12+**
- **Flask** - Web framework
- **LangChain** - AI orchestration
- **OpenAI GPT-4o-mini** - Vision API for image analysis
- **Flask-CORS** - Cross-origin resource sharing

### Frontend (Phase 3)
- HTML5, CSS3, JavaScript
- Modern UI with glassmorphism and animations

## 📋 Prerequisites

- Python 3.12 or higher
- OpenAI API key ([Get one here](https://platform.openai.com/api-keys))
- pip (Python package manager)

## 🚀 Setup Instructions

### 1. Clone or Navigate to Project Directory

```bash
cd "c:\Users\nad\Desktop\ai assignment"
```

### 2. Create Virtual Environment (Recommended)

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure Environment Variables

1. Copy the example environment file:
   ```bash
   copy .env.example .env
   ```

2. Edit `.env` file and add your OpenAI API key:
   ```
   OPENAI_API_KEY=your-api-key-goes-here
   ```

### 5. Run the Backend Server

```bash
python app.py
```

The server will start on `http://localhost:5000`

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

## 🧪 Testing the API

### Method 1: Using curl (Command Line)

```bash
# Test health check
curl http://localhost:5000/

# Test statement extraction
curl -X POST http://localhost:5000/api/extract -F "image=@sample_statements/statement1.png"
```

### Method 2: Using Python

Create a test file `test_api.py`:

```python
import requests

# Test extraction
url = "http://localhost:5000/api/extract"
files = {"image": open("sample_statements/statement1.png", "rb")}
response = requests.post(url, files=files)

print(response.json())
```

Run it:
```bash
python test_api.py
```

### Expected Response

```json
{
  "status": "success",
  "message": "Statement data extracted successfully",
  "data": {
    "customer_name": "MR. HITESH KUMAR",
    "card_account_number": "4375 XXXX XXXX 8007",
    "statement_date": "23/04/2018",
    "total_amount_due": "₹ 8,795.59",
    "minimum_amount_due": "₹ 6,620.00",
    "due_date": "11/05/2018"
  }
}
```

## 📁 Project Structure

```
ai assignment/
├── app.py                  # Flask backend application
├── requirements.txt        # Python dependencies
├── .env                    # Environment variables (create this)
├── .env.example           # Environment template
├── .gitignore             # Git ignore rules
├── assignment_1.ipynb     # Original Jupyter notebook (Assignment 1)
├── assignment_2.ipynb     # Original Jupyter notebook (Assignment 2)
├── sample_statements/     # Sample credit card statements
│   ├── statement1.png
│   ├── statement2.png
│   └── statement3.png
└── README.md              # This file
```

## 🔧 API Documentation

### Endpoints

#### `GET /`
Health check endpoint

**Response:**
```json
{
  "status": "success",
  "message": "Credit Card Analysis API is running",
  "version": "1.0.0",
  "endpoints": {
    "extract": "/api/extract",
    "analyze": "/api/analyze (Coming in Phase 2)"
  }
}
```

#### `POST /api/extract`
Extract credit card statement data from image

**Request:**
- Method: `POST`
- Content-Type: `multipart/form-data`
- Body: `image` file (PNG, JPG, JPEG, WEBP)

**Response:**
```json
{
  "status": "success",
  "message": "Statement data extracted successfully",
  "data": {
    "customer_name": "string",
    "card_account_number": "string",
    "statement_date": "string",
    "total_amount_due": "string",
    "minimum_amount_due": "string",
    "due_date": "string"
  }
}
```

**Error Response:**
```json
{
  "status": "error",
  "message": "Error description"
}
```

## ⚠️ Troubleshooting

### Issue: "OPENAI_API_KEY not found"
**Solution:** Make sure you've created a `.env` file with your API key:
```
OPENAI_API_KEY=sk-your-key-here
```

### Issue: "Module not found" errors
**Solution:** Install dependencies:
```bash
pip install -r requirements.txt
```

### Issue: Port 5000 already in use
**Solution:** Change the port in `app.py`:
```python
app.run(debug=True, host='0.0.0.0', port=5001)  # Use different port
```

### Issue: CORS errors when testing from browser
**Solution:** The backend already has CORS enabled via `flask-cors`. Make sure the backend is running.

## 🎯 Current Status

- ✅ **Phase 1**: Backend Foundation & Statement Extraction - **COMPLETE**
- ⏳ **Phase 2**: Backend Spending Analysis - Coming Next
- ⏳ **Phase 3**: Frontend Development - Planned
- ⏳ **Phase 4**: Integration & Testing - Planned

## 📝 Next Steps

1. Test the `/api/extract` endpoint with all sample statements
2. Verify extraction accuracy
3. Move to Phase 2: Implement spending analysis endpoint

## 🤝 Contributing

This is a learning project for AI-powered credit card analysis. Feel free to experiment and extend!

## 📄 License

Educational project - Free to use and modify
