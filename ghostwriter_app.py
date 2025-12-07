import os
from dotenv import load_dotenv
from openai import OpenAI
from notion_client import Client
from datetime import datetime

def save_to_notion(title, content, notion_token, database_id):
    """Save article to Notion database"""
    try:
        notion = Client(auth=notion_token)
        
        # Split content into chunks of 2000 characters or less
        def split_content(text, max_length=2000):
            chunks = []
            while text:
                if len(text) <= max_length:
                    chunks.append(text)
                    break
                
                # Find the last space before max_length to avoid breaking words
                split_at = text.rfind(' ', 0, max_length)
                if split_at == -1:  # No space found, force split
                    split_at = max_length
                
                chunks.append(text[:split_at])
                text = text[split_at:].lstrip()
            
            return chunks
        
        # Create blocks for each chunk
        content_chunks = split_content(content)
        children = []
        
        for chunk in content_chunks:
            children.append({
                "object": "block",
                "type": "paragraph",
                "paragraph": {
                    "rich_text": [
                        {
                            "type": "text",
                            "text": {
                                "content": chunk
                            }
                        }
                    ]
                }
            })
        
        # Create a new page in the database
        new_page = notion.pages.create(
            parent={"database_id": database_id},
            properties={
                "Name": {
                    "title": [
                        {
                            "text": {
                                "content": title
                            }
                        }
                    ]
                }
            },
            children=children
        )
        
        print(f"\n✅ Article saved to Notion: {new_page['url']}")
        return new_page
        
    except Exception as e:
        print(f"\n❌ Error saving to Notion: {str(e)}")
        return None

def main():
    # Load environment variables from .env
    load_dotenv()
    
    # Initialize OpenAI client
    client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    
    # Get Notion credentials
    notion_token = os.getenv("NOTION_TOKEN")
    database_id = os.getenv("NOTION_DATABASE_ID")

    # Read the system prompt for the Ghostwriter Agent from a file
    with open("system_prompt.md", "r") as f:
        system_prompt_text = f.read()

    # Read the article idea from idea.txt
    with open("idea.txt", "r") as f:
        idea = f.read().strip()
    
    # Initialize conversation history with system prompt and initial user message
    messages = [
        {"role": "system", "content": system_prompt_text},
        {"role": "user", "content": (
            "Based on the following idea, write a high-quality journalistic article that is between one and three A4 pages long. "
            "Your article should include detailed explanations, analysis, proper citations for every factual claim, and may incorporate humor when appropriate:\n\n"
            f"{idea}"
        )}
    ]
    
    # Generate the initial article using GPT-5
    response = client.chat.completions.create(
        model="gpt-5-2025-08-07",
        messages=messages,
        max_completion_tokens=15000
    )
    article = response.choices[0].message.content.strip()
    print("\n--- Generated Article ---\n")
    print(article)
    
    # Extract title from article (first line)
    lines = article.split('\n')
    title = lines[0].replace('#', '').strip() if lines else "Generated Article"
    
    # Save to Notion if credentials are provided
    if notion_token and database_id:
        save_to_notion(title, article, notion_token, database_id)

    # Add the initial article response to conversation history
    messages.append({"role": "assistant", "content": article})

    # Start an interactive dialogue loop for follow-up commands/comments
    while True:
        command = input("\nEnter a command/comment (or type 'exit' to quit): ")
        if command.lower().strip() == "exit":
            break

        # Append the user's follow-up command to conversation history
        messages.append({"role": "user", "content": command})

        # Call the API with the updated conversation history
        response = client.chat.completions.create(
            model="gpt-5-2025-08-07",
            messages=messages,
            max_completion_tokens=15000
        )
        reply = response.choices[0].message.content.strip()
        print("\n--- Agent Response ---\n")
        print(reply)

        # Append the assistant's reply to conversation history
        messages.append({"role": "assistant", "content": reply})

if __name__ == "__main__":
    main()


