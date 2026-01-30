"""
Test script for Phase 1: Statement Data Extraction API
"""

import requests
import json
import os

# API endpoint
BASE_URL = "http://localhost:5000"

def test_health_check():
    """Test the health check endpoint"""
    print("\n" + "="*60)
    print("TEST 1: Health Check")
    print("="*60)
    
    try:
        response = requests.get(f"{BASE_URL}/")
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        return response.status_code == 200
    except Exception as e:
        print(f"❌ Error: {e}")
        return False


def test_extract_statement(image_path):
    """Test statement extraction endpoint"""
    print("\n" + "="*60)
    print(f"TEST 2: Extract Statement - {os.path.basename(image_path)}")
    print("="*60)
    
    try:
        with open(image_path, 'rb') as f:
            files = {'image': f}
            response = requests.post(f"{BASE_URL}/api/extract", files=files)
        
        print(f"Status Code: {response.status_code}")
        result = response.json()
        
        if result['status'] == 'success':
            print("✅ Extraction successful!")
            print("\nExtracted Data:")
            print("-" * 60)
            data = result['data']
            print(f"Customer Name:        {data['customer_name']}")
            print(f"Card Account Number:  {data['card_account_number']}")
            print(f"Statement Date:       {data['statement_date']}")
            print(f"Total Amount Due:     {data['total_amount_due']}")
            print(f"Minimum Amount Due:   {data['minimum_amount_due']}")
            print(f"Due Date:             {data['due_date']}")
            return True
        else:
            print(f"❌ Error: {result['message']}")
            return False
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return False


def test_invalid_file():
    """Test with invalid file type"""
    print("\n" + "="*60)
    print("TEST 3: Invalid File Type (Error Handling)")
    print("="*60)
    
    try:
        # Create a dummy text file
        with open("test_invalid.txt", "w") as f:
            f.write("This is not an image")
        
        with open("test_invalid.txt", 'rb') as f:
            files = {'image': f}
            response = requests.post(f"{BASE_URL}/api/extract", files=files)
        
        print(f"Status Code: {response.status_code}")
        result = response.json()
        print(f"Response: {result['message']}")
        
        # Clean up
        os.remove("test_invalid.txt")
        
        # Should return error
        return response.status_code == 400
        
    except Exception as e:
        print(f"❌ Error: {e}")
        return False


def main():
    """Run all tests"""
    print("\n" + "="*60)
    print("🧪 PHASE 1 API TESTING")
    print("="*60)
    print("Testing Credit Card Statement Extraction API")
    print("Make sure the Flask server is running on http://localhost:5000")
    print("="*60)
    
    # Check if server is running
    try:
        requests.get(BASE_URL, timeout=2)
    except:
        print("\n❌ ERROR: Flask server is not running!")
        print("Please start the server first: python app.py")
        return
    
    # Run tests
    results = []
    
    # Test 1: Health check
    results.append(("Health Check", test_health_check()))
    
    # Test 2: Extract from sample statements
    sample_statements = [
        "sample_statements/statement1.png",
        "sample_statements/statement2.png",
        "sample_statements/statement3.png"
    ]
    
    for statement in sample_statements:
        if os.path.exists(statement):
            results.append((f"Extract {os.path.basename(statement)}", test_extract_statement(statement)))
        else:
            print(f"\n⚠️  Warning: {statement} not found, skipping...")
    
    # Test 3: Error handling
    results.append(("Error Handling", test_invalid_file()))
    
    # Summary
    print("\n" + "="*60)
    print("TEST SUMMARY")
    print("="*60)
    
    passed = sum(1 for _, result in results if result)
    total = len(results)
    
    for test_name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{status} - {test_name}")
    
    print("="*60)
    print(f"Results: {passed}/{total} tests passed")
    print("="*60)
    
    if passed == total:
        print("\n🎉 All tests passed! Phase 1 is complete!")
    else:
        print(f"\n⚠️  {total - passed} test(s) failed. Please review the errors above.")


if __name__ == "__main__":
    main()
