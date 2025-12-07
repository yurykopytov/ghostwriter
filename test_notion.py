#!/usr/bin/env python3
"""
Test script for Notion integration
"""
import os
from dotenv import load_dotenv
from datetime import datetime

# Import the save_to_notion function from our main app
from ghostwriter_app import save_to_notion

def test_notion_integration():
    # Load environment variables
    load_dotenv()
    
    notion_token = os.getenv("NOTION_TOKEN")
    database_id = os.getenv("NOTION_DATABASE_ID")
    
    if not notion_token or not database_id:
        print("❌ Missing Notion credentials in .env file")
        return False
    
    # Test content - short enough to fit in one block
    test_title = "Test Article - Notion Integration"
    test_content = """This is a test article to verify the Notion integration is working correctly.

The 21st century has revealed a striking paradox at the heart of American power: while political leaders rail against "globalism" and promise to put their nation first, the administration's most influential companies are fundamentally global actors.

This content should be saved to your Notion database as a new page with the title above and status set to "Generated".

Test completed at: """ + datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    
    print("🧪 Testing Notion integration...")
    print(f"Title: {test_title}")
    print(f"Content length: {len(test_content)} characters")
    print("---")
    
    # Test the save function
    result = save_to_notion(test_title, test_content, notion_token, database_id)
    
    if result:
        print("✅ Test completed successfully!")
        return True
    else:
        print("❌ Test failed!")
        return False

if __name__ == "__main__":
    test_notion_integration()