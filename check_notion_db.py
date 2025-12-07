#!/usr/bin/env python3
"""
Check Notion database properties
"""
import os
from dotenv import load_dotenv
from notion_client import Client

def check_database_properties():
    # Load environment variables
    load_dotenv()
    
    notion_token = os.getenv("NOTION_TOKEN")
    database_id = os.getenv("NOTION_DATABASE_ID")
    
    if not notion_token or not database_id:
        print("❌ Missing Notion credentials in .env file")
        return
    
    try:
        notion = Client(auth=notion_token)
        
        # Get database info
        database = notion.databases.retrieve(database_id)
        
        print("📊 Database Properties:")
        print("=" * 50)
        
        for prop_name, prop_info in database['properties'].items():
            print(f"• {prop_name}: {prop_info['type']}")
            
            # Show options for select/multi-select properties
            if prop_info['type'] in ['select', 'multi_select'] and 'options' in prop_info[prop_info['type']]:
                options = [opt['name'] for opt in prop_info[prop_info['type']]['options']]
                if options:
                    print(f"  Options: {', '.join(options)}")
        
        print("=" * 50)
        
    except Exception as e:
        print(f"❌ Error checking database: {str(e)}")

if __name__ == "__main__":
    check_database_properties()