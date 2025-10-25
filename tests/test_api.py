"""
Test suite for Hate Speech Detection API
Tests happy path, foul examples, and invalid inputs
"""

import unittest
import json
import requests
import time
import os

class TestHateSpeechAPI(unittest.TestCase):
    """Test cases for the Hate Speech Detection API"""
    
    @classmethod
    def setUpClass(cls):
        """Set up test environment"""
        cls.base_url = "http://localhost:5004"  # Updated to match API port
        cls.api_url = f"{cls.base_url}/predict"
        cls.health_url = f"{cls.base_url}/health"
        cls.model_info_url = f"{cls.base_url}/model_info"
        cls.batch_url = f"{cls.base_url}/batch_predict"
        
        # Check if we're in the organized structure
        import os
        if not os.path.exists('../api/src/app.py'):
            print("Warning: API not found in expected location")
            print("Make sure to run tests from the tweet-guard-organized directory")
        
        # Wait for API to be ready
        max_retries = 30
        for i in range(max_retries):
            try:
                response = requests.get(cls.health_url, timeout=5)
                if response.status_code == 200:
                    print("API is ready!")
                    break
            except requests.exceptions.RequestException:
                if i == max_retries - 1:
                    raise Exception("API not ready after 30 retries")
                time.sleep(2)
    
    def test_health_check(self):
        """Test health check endpoint"""
        response = requests.get(self.health_url)
        self.assertEqual(response.status_code, 200)
        
        data = response.json()
        self.assertIn('status', data)
        self.assertIn('model_loaded', data)
        self.assertEqual(data['status'], 'healthy')
        self.assertTrue(data['model_loaded'])
    
    def test_model_info(self):
        """Test model information endpoint"""
        response = requests.get(self.model_info_url)
        self.assertEqual(response.status_code, 200)
        
        data = response.json()
        self.assertIn('model_type', data)
        self.assertIn('vectorizer_type', data)
        self.assertIn('threshold', data)
        self.assertIn('performance', data)
    
    def test_happy_path_proper_text(self):
        """Test 1: Happy path - Proper text (should be classified as proper)"""
        test_cases = [
            "This is a beautiful day and I'm feeling great!",
            "I love spending time with my family and friends.",
            "The weather is nice today, perfect for a walk.",
            "Thank you for your help, I really appreciate it.",
            "I'm excited about the new project we're working on."
        ]
        
        for text in test_cases:
            with self.subTest(text=text[:50]):
                response = requests.post(
                    self.api_url,
                    json={"text": text},
                    headers={"Content-Type": "application/json"}
                )
                
                self.assertEqual(response.status_code, 200)
                data = response.json()
                
                # Check response structure
                self.assertIn('prediction', data)
                self.assertIn('probability', data)
                self.assertIn('label', data)
                self.assertIn('confidence', data)
                self.assertIn('threshold', data)
                
                # Should be classified as proper (0)
                self.assertEqual(data['prediction'], 0)
                self.assertEqual(data['label'], 'Proper')
                self.assertLess(data['probability'], data['threshold'])
    
    def test_foul_examples(self):
        """Test 2: Foul examples (should be classified as foul)"""
        test_cases = [
            "You are such a stupid idiot and I hate you",
            "Go kill yourself you worthless piece of shit",
            "I hope you die in a fire you disgusting pig",
            "You're a fucking moron who doesn't deserve to live",
            "This is the worst thing ever, you're a complete failure"
        ]
        
        for text in test_cases:
            with self.subTest(text=text[:50]):
                response = requests.post(
                    self.api_url,
                    json={"text": text},
                    headers={"Content-Type": "application/json"}
                )
                
                self.assertEqual(response.status_code, 200)
                data = response.json()
                
                # Check response structure
                self.assertIn('prediction', data)
                self.assertIn('probability', data)
                self.assertIn('label', data)
                self.assertIn('confidence', data)
                
                # Should be classified as foul (1)
                self.assertEqual(data['prediction'], 1)
                self.assertEqual(data['label'], 'Foul')
                self.assertGreaterEqual(data['probability'], data['threshold'])
    
    def test_invalid_inputs(self):
        """Test 3: Invalid inputs (should return appropriate errors)"""
        
        # Test cases for invalid inputs
        invalid_cases = [
            # Missing text field
            ({"message": "hello"}, 400, "Missing 'text' field"),
            
            # Empty text
            ({"text": ""}, 400, "Text cannot be empty"),
            
            # Non-string text
            ({"text": 123}, 400, "Text must be a string"),
            
            # Text too long
            ({"text": "a" * 1001}, 400, "Text too long"),
            
            # No JSON data
            (None, 400, "No JSON data provided"),
        ]
        
        for payload, expected_status, expected_error in invalid_cases:
            with self.subTest(payload=payload):
                if payload is None:
                    response = requests.post(
                        self.api_url,
                        data="",
                        headers={"Content-Type": "application/json"}
                    )
                else:
                    response = requests.post(
                        self.api_url,
                        json=payload,
                        headers={"Content-Type": "application/json"}
                    )
                
                self.assertEqual(response.status_code, expected_status)
                data = response.json()
                self.assertIn('error', data)
                self.assertIn(expected_error, data['error'])
    
    def test_batch_predict(self):
        """Test batch prediction endpoint"""
        test_texts = [
            "This is a normal message",
            "You are an idiot",
            "I love this weather",
            "Go die in a hole"
        ]
        
        response = requests.post(
            self.batch_url,
            json={"texts": test_texts},
            headers={"Content-Type": "application/json"}
        )
        
        self.assertEqual(response.status_code, 200)
        data = response.json()
        
        self.assertIn('results', data)
        self.assertEqual(len(data['results']), len(test_texts))
        
        # Check that we get predictions for all texts
        for i, result in enumerate(data['results']):
            with self.subTest(text=test_texts[i][:30]):
                self.assertIn('prediction', result)
                self.assertIn('label', result)
                self.assertIn('confidence', result)
    
    def test_batch_predict_invalid(self):
        """Test batch prediction with invalid inputs"""
        invalid_cases = [
            # Empty texts list
            ({"texts": []}, 400, "Texts list cannot be empty"),
            
            # Too many texts
            ({"texts": ["text"] * 101}, 400, "Too many texts"),
            
            # Non-list texts
            ({"texts": "not a list"}, 400, "Texts must be a list"),
            
            # Missing texts field
            ({"messages": ["text"]}, 400, "Missing 'texts' field"),
        ]
        
        for payload, expected_status, expected_error in invalid_cases:
            with self.subTest(payload=payload):
                response = requests.post(
                    self.batch_url,
                    json=payload,
                    headers={"Content-Type": "application/json"}
                )
                
                self.assertEqual(response.status_code, expected_status)
                data = response.json()
                self.assertIn('error', data)
                self.assertIn(expected_error, data['error'])
    
    def test_edge_cases(self):
        """Test edge cases and boundary conditions"""
        
        # Very short text
        response = requests.post(
            self.api_url,
            json={"text": "hi"},
            headers={"Content-Type": "application/json"}
        )
        self.assertEqual(response.status_code, 200)
        
        # Text with special characters
        response = requests.post(
            self.api_url,
            json={"text": "Hello @user #hashtag $money 100%"},
            headers={"Content-Type": "application/json"}
        )
        self.assertEqual(response.status_code, 200)
        
        # Text with emojis
        response = requests.post(
            self.api_url,
            json={"text": "I'm so happy! 😊🎉"},
            headers={"Content-Type": "application/json"}
        )
        self.assertEqual(response.status_code, 200)
    
    def test_response_format(self):
        """Test that response format is consistent"""
        response = requests.post(
            self.api_url,
            json={"text": "This is a test message"},
            headers={"Content-Type": "application/json"}
        )
        
        self.assertEqual(response.status_code, 200)
        data = response.json()
        
        # Check all required fields are present
        required_fields = ['text', 'prediction', 'probability', 'label', 'confidence', 'threshold']
        for field in required_fields:
            self.assertIn(field, data)
        
        # Check data types
        self.assertIsInstance(data['text'], str)
        self.assertIsInstance(data['prediction'], int)
        self.assertIsInstance(data['probability'], float)
        self.assertIsInstance(data['label'], str)
        self.assertIsInstance(data['confidence'], float)
        self.assertIsInstance(data['threshold'], float)
        
        # Check value ranges
        self.assertIn(data['prediction'], [0, 1])
        self.assertIn(data['label'], ['Proper', 'Foul'])
        self.assertGreaterEqual(data['probability'], 0.0)
        self.assertLessEqual(data['probability'], 1.0)
        self.assertGreaterEqual(data['confidence'], 0.0)
        self.assertLessEqual(data['confidence'], 1.0)

def run_tests():
    """Run all tests"""
    print("Starting Hate Speech Detection API Tests...")
    print("=" * 50)
    
    # Create test suite
    suite = unittest.TestLoader().loadTestsFromTestCase(TestHateSpeechAPI)
    
    # Run tests
    runner = unittest.TextTestRunner(verbosity=2)
    result = runner.run(suite)
    
    # Print summary
    print("\n" + "=" * 50)
    print(f"Tests run: {result.testsRun}")
    print(f"Failures: {len(result.failures)}")
    print(f"Errors: {len(result.errors)}")
    
    if result.failures:
        print("\nFAILURES:")
        for test, traceback in result.failures:
            print(f"- {test}: {traceback}")
    
    if result.errors:
        print("\nERRORS:")
        for test, traceback in result.errors:
            print(f"- {test}: {traceback}")
    
    success = len(result.failures) == 0 and len(result.errors) == 0
    print(f"\nOverall result: {'PASSED' if success else 'FAILED'}")
    
    return success

if __name__ == '__main__':
    run_tests()
