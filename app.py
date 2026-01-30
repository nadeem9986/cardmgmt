"""
Credit Card Analysis Web Application - Flask Backend
Phase 1: Statement Data Extraction
"""

import os
import base64
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage
from langchain_core.output_parsers import JsonOutputParser
from pydantic import BaseModel, Field
from typing import Optional

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for frontend communication

# Initialize OpenAI model
llm = ChatOpenAI(
    model="gpt-4o-mini",
    temperature=0,
    openai_api_key=os.getenv("OPENAI_API_KEY")
)

# ============================================================================
# DATA MODELS
# ============================================================================

class CreditCardStatement(BaseModel):
    """Pydantic model for credit card statement data extraction"""
    customer_name: str = Field(description="Full name of the credit card holder")
    card_account_number: str = Field(description="Credit card account number (masked if needed)")
    statement_date: str = Field(description="Statement date in DD/MM/YYYY format")
    total_amount_due: str = Field(description="Total amount due including currency symbol")
    minimum_amount_due: str = Field(description="Minimum amount due including currency symbol")
    due_date: str = Field(description="Payment due date in DD/MM/YYYY format")


class Transaction(BaseModel):
    """Pydantic model for individual transaction"""
    description: str = Field(description="Transaction description")
    amount: float = Field(description="Transaction amount (positive for debits, negative for credits)")
    category: str = Field(description="Expense category: Cash Withdrawal, Shopping, Dining, Bills, Transfer, Interest, or Other")


class StatementAnalysis(BaseModel):
    """Pydantic model for complete statement analysis"""
    total_debits: float = Field(description="Total debit amount from statement summary")
    total_credits: float = Field(description="Total credit amount from statement summary")
    closing_balance: float = Field(description="Closing balance from statement")
    transactions: list[Transaction] = Field(description="List of all transactions with categories")


class CategoryRecommendation(BaseModel):
    """Pydantic model for category-wise reduction recommendation"""
    category: str = Field(description="Expense category name")
    current_spending: float = Field(description="Current spending in this category")
    reduction_percentage: float = Field(description="Recommended reduction percentage")
    amount_to_save: float = Field(description="Amount to save from this category")
    new_spending: float = Field(description="New target spending for this category")
    advice: str = Field(description="Specific actionable advice for reducing spending")


class ReductionRecommendations(BaseModel):
    """Pydantic model for complete reduction recommendations"""
    recommendations: list[CategoryRecommendation] = Field(description="List of category-wise recommendations")
    total_savings: float = Field(description="Total projected savings")


# ============================================================================
# HELPER FUNCTIONS
# ============================================================================

def encode_image(image_bytes):
    """Convert image bytes to base64 string"""
    return base64.b64encode(image_bytes).decode('utf-8')


def extract_statement_data(base64_image):
    """
    Extract credit card statement data using OpenAI Vision API
    
    Args:
        base64_image: Base64 encoded image string
        
    Returns:
        dict: Extracted statement data
    """
    # Create parser
    parser = JsonOutputParser(pydantic_object=CreditCardStatement)
    
    # Create prompt
    prompt = f"""You are a credit card statement data extraction expert.

Analyze this credit card statement image and extract the following information:
- Customer Name
- Card Account Number
- Statement Date
- Total Amount Due
- Minimum Amount Due
- Due Date

Return the data in the following JSON format:
{parser.get_format_instructions()}

Be precise and extract exactly what you see in the image.
"""
    
    # Create message with image
    message = HumanMessage(
        content=[
            {"type": "text", "text": prompt},
            {
                "type": "image_url",
                "image_url": {"url": f"data:image/png;base64,{base64_image}"}
            }
        ]
    )
    
    # Get response from AI
    response = llm.invoke([message])
    
    # Parse the response
    extracted_data = parser.parse(response.content)
    
    return extracted_data


def analyze_spending(base64_image, reduction_percentage):
    """
    Analyze credit card spending and generate reduction recommendations
    
    Args:
        base64_image: Base64 encoded image string
        reduction_percentage: Target reduction percentage (e.g., 20 for 20%)
        
    Returns:
        dict: Analysis results with recommendations
    """
    # Step 1: Extract statement data and categorize transactions
    parser = JsonOutputParser(pydantic_object=StatementAnalysis)
    
    extraction_prompt = f"""You are a credit card statement analysis expert.

Analyze this credit card statement image and extract:

1. Statement Summary:
   - Total Debits (total spending)
   - Total Credits (payments/refunds received)
   - Closing Balance

2. All Individual Transactions:
   - Description
   - Amount (use positive for debits/spending, negative for credits)
   - Category (categorize each transaction into: Cash Withdrawal, Shopping, Dining, Bills, Transfer, Interest, or Other)

Analyze the transaction descriptions carefully and assign appropriate categories.

Return data in this JSON format:
{parser.get_format_instructions()}

Be precise and extract all visible transactions.
"""
    
    message = HumanMessage(
        content=[
            {"type": "text", "text": extraction_prompt},
            {"type": "image_url", "image_url": {"url": f"data:image/png;base64,{base64_image}"}}
        ]
    )
    
    response = llm.invoke([message])
    statement_data = parser.parse(response.content)
    
    # Step 2: Calculate category-wise spending
    category_spending = {}
    for txn in statement_data['transactions']:
        category = txn['category']
        amount = txn['amount']
        
        # Only count debits (positive amounts) as spending
        if amount > 0:
            if category not in category_spending:
                category_spending[category] = 0
            category_spending[category] += amount
    
    # Sort by spending amount (highest first)
    sorted_categories = sorted(category_spending.items(), key=lambda x: x[1], reverse=True)
    
    # Step 3: Calculate target amounts
    current_spending = statement_data['total_debits']
    target_reduction_amount = current_spending * (reduction_percentage / 100)
    target_spending = current_spending - target_reduction_amount
    
    # Step 4: Generate AI-powered recommendations
    analysis_context = f"""Credit Card Spending Analysis:

Current Total Spending: INR {current_spending:,.2f}
Target Reduction: {reduction_percentage}%
Amount to Save: INR {target_reduction_amount:,.2f}

Category-wise Spending:
"""
    
    for category, amount in sorted_categories:
        percentage = (amount / current_spending) * 100
        analysis_context += f"- {category}: INR {amount:,.2f} ({percentage:.1f}%)\n"
    
    recommendation_prompt = f"""{analysis_context}

Based on your spending patterns, I'll help you create a personalized plan to reduce your expenses by {reduction_percentage}% (saving INR {target_reduction_amount:,.2f}).

Please analyze each spending category and provide warm, conversational, and highly specific recommendations as if you're a friendly financial advisor talking to a friend. 

For each category you recommend reducing:
1. Explain WHY this category is a good target for reduction (based on the actual spending amount)
2. Suggest SPECIFIC, PRACTICAL ways to cut costs in that category
3. Give realistic reduction percentages that feel achievable
4. Use a friendly, encouraging tone - like you're helping a friend save money
5. Include real-world examples and actionable tips

Guidelines:
- Focus on high-spending categories first (they have the most savings potential)
- Be gentle with essential categories like Bills and Interest
- Suggest aggressive cuts for discretionary spending (Cash Withdrawal, Shopping, Dining)
- Make the advice feel personal and specific to their spending patterns
- Use conversational language, not corporate jargon
- Include motivational phrases and encouragement

Return recommendations in JSON format:
{{
  "recommendations": [
    {{
      "category": "category name",
      "current_spending": amount,
      "reduction_percentage": percentage,
      "amount_to_save": amount,
      "new_spending": amount,
      "advice": "Write 2-3 sentences of warm, specific, actionable advice. Start by acknowledging their current spending, then suggest specific ways to reduce it. Include real examples like 'Instead of eating out 4 times a week, try cooking at home 2-3 times - you could save around INR X per month!' or 'I noticed you're spending a lot on cash withdrawals - consider using digital payments to track your spending better and avoid unnecessary ATM fees.' Make it feel like a conversation with a helpful friend who genuinely wants to help them save money."
    }}
  ],
  "total_savings": {target_reduction_amount}
}}

Remember: Make each piece of advice feel personal, specific, and achievable. Use actual numbers from their spending when giving examples.
"""
    
    recommendation_response = llm.invoke([HumanMessage(content=recommendation_prompt)])
    
    # Parse JSON from response (handle markdown code blocks)
    response_text = recommendation_response.content
    
    if "```json" in response_text:
        json_start = response_text.find("```json") + 7
        json_end = response_text.find("```", json_start)
        response_text = response_text[json_start:json_end].strip()
    elif "```" in response_text:
        json_start = response_text.find("```") + 3
        json_end = response_text.find("```", json_start)
        response_text = response_text[json_start:json_end].strip()
    
    import json
    recommendations = json.loads(response_text)
    
    # Return complete analysis
    return {
        "statement_summary": {
            "total_debits": statement_data['total_debits'],
            "total_credits": statement_data['total_credits'],
            "closing_balance": statement_data['closing_balance']
        },
        "category_breakdown": [
            {
                "category": category,
                "amount": amount,
                "percentage": (amount / current_spending) * 100
            }
            for category, amount in sorted_categories
        ],
        "reduction_target": {
            "current_spending": current_spending,
            "reduction_percentage": reduction_percentage,
            "target_spending": target_spending,
            "amount_to_save": target_reduction_amount
        },
        "recommendations": recommendations['recommendations'],
        "total_projected_savings": recommendations['total_savings']
    }


# ============================================================================
# API ENDPOINTS
# ============================================================================

@app.route('/')
def home():
    """Health check endpoint"""
    return jsonify({
        "status": "success",
        "message": "Credit Card Analysis API is running",
        "version": "1.0.0",
        "endpoints": {
            "extract": "/api/extract",
            "analyze": "/api/analyze (Coming in Phase 2)"
        }
    })


@app.route('/api/extract', methods=['POST'])
def extract_statement():
    """
    Extract credit card statement data from uploaded image
    
    Expected: multipart/form-data with 'image' file
    Returns: JSON with extracted statement data
    """
    try:
        # Validate request
        if 'image' not in request.files:
            return jsonify({
                "status": "error",
                "message": "No image file provided"
            }), 400
        
        image_file = request.files['image']
        
        # Validate file
        if image_file.filename == '':
            return jsonify({
                "status": "error",
                "message": "No file selected"
            }), 400
        
        # Check file extension
        allowed_extensions = {'png', 'jpg', 'jpeg', 'webp'}
        file_ext = image_file.filename.rsplit('.', 1)[1].lower() if '.' in image_file.filename else ''
        
        if file_ext not in allowed_extensions:
            return jsonify({
                "status": "error",
                "message": f"Invalid file type. Allowed: {', '.join(allowed_extensions)}"
            }), 400
        
        # Read and encode image
        image_bytes = image_file.read()
        base64_image = encode_image(image_bytes)
        
        # Extract data using AI
        extracted_data = extract_statement_data(base64_image)
        
        # Return success response
        return jsonify({
            "status": "success",
            "message": "Statement data extracted successfully",
            "data": extracted_data
        }), 200
        
    except Exception as e:
        # Handle errors
        return jsonify({
            "status": "error",
            "message": f"An error occurred: {str(e)}"
        }), 500


@app.route('/api/analyze', methods=['POST'])
def analyze_statement():
    """
    Analyze credit card spending and provide reduction recommendations
    
    Expected: multipart/form-data with 'image' file and 'reduction_percentage' field
    Returns: JSON with spending analysis and recommendations
    """
    try:
        # Validate request
        if 'image' not in request.files:
            return jsonify({
                "status": "error",
                "message": "No image file provided"
            }), 400
        
        if 'reduction_percentage' not in request.form:
            return jsonify({
                "status": "error",
                "message": "No reduction percentage provided"
            }), 400
        
        image_file = request.files['image']
        reduction_percentage = float(request.form['reduction_percentage'])
        
        # Validate file
        if image_file.filename == '':
            return jsonify({
                "status": "error",
                "message": "No file selected"
            }), 400
        
        # Validate reduction percentage
        if reduction_percentage <= 0 or reduction_percentage > 100:
            return jsonify({
                "status": "error",
                "message": "Reduction percentage must be between 1 and 100"
            }), 400
        
        # Check file extension
        allowed_extensions = {'png', 'jpg', 'jpeg', 'webp'}
        file_ext = image_file.filename.rsplit('.', 1)[1].lower() if '.' in image_file.filename else ''
        
        if file_ext not in allowed_extensions:
            return jsonify({
                "status": "error",
                "message": f"Invalid file type. Allowed: {', '.join(allowed_extensions)}"
            }), 400
        
        # Read and encode image
        image_bytes = image_file.read()
        base64_image = encode_image(image_bytes)
        
        # Analyze spending using AI
        analysis_results = analyze_spending(base64_image, reduction_percentage)
        
        # Return success response
        return jsonify({
            "status": "success",
            "message": "Spending analysis completed successfully",
            "data": analysis_results
        }), 200
        
    except Exception as e:
        # Handle errors
        return jsonify({
            "status": "error",
            "message": f"An error occurred: {str(e)}"
        }), 500


# ============================================================================
# ERROR HANDLERS
# ============================================================================

@app.errorhandler(404)
def not_found(error):
    """Handle 404 errors"""
    return jsonify({
        "status": "error",
        "message": "Endpoint not found"
    }), 404


@app.errorhandler(500)
def internal_error(error):
    """Handle 500 errors"""
    return jsonify({
        "status": "error",
        "message": "Internal server error"
    }), 500


# ============================================================================
# MAIN
# ============================================================================

if __name__ == '__main__':
    # Check if API key is set
    if not os.getenv("OPENAI_API_KEY"):
        print("⚠️  WARNING: OPENAI_API_KEY not found in environment variables!")
        print("Please create a .env file with your OpenAI API key.")
        print("See .env.example for reference.")
    else:
        print("✅ OpenAI API key loaded successfully")
    
    print("\n" + "="*60)
    print("🚀 Credit Card Analysis API Server")
    print("="*60)
    print("Phase 1: Statement Data Extraction")
    print("Server running on: http://localhost:5000")
    print("="*60 + "\n")
    
    # Run Flask app
    app.run(debug=True, host='0.0.0.0', port=5000)
