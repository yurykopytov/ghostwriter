# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an AI Ghostwriter Agent that generates high-quality journalistic articles using OpenAI's GPT models. The application reads article ideas from text files and produces publication-ready content for platforms like Medium and Substack.

## Commands

### Setup
```bash
# Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Copy and configure environment file
cp .env.example .env
# Edit .env and add your credentials:
# - OpenAI API key
# - Notion integration token
# - Notion database ID
```

### Running the Application
```bash
python ghostwriter_app.py
```

## Architecture

### Core Components

1. **Main Application** (`ghostwriter_app.py`): 
   - Single-file Python application that orchestrates the article generation process
   - Uses OpenAI's chat completions API with GPT-5-turbo model
   - Implements interactive dialogue loop for iterative article refinement

2. **System Prompt** (`system_prompt.md`):
   - Comprehensive instructions defining the AI agent's behavior and writing style
   - Specifies journalistic standards, citation requirements, and narrative tone
   - Includes example text demonstrating the expected writing style

3. **Input System**:
   - `idea.txt`: Contains the article topic/idea to be developed
   - Schema and example content files provide context and structure

### Application Flow

1. Loads OpenAI API key from environment variables
2. Reads system prompt from `system_prompt.md`
3. Reads article idea from `idea.txt`
4. Generates initial article using GPT-5-turbo
5. Enters interactive mode allowing user to refine the article with follow-up commands
6. Uses GPT-5-turbo for all subsequent iterations

### Key Features

- **Narrative Journalism Style**: Produces engaging, first-person journalistic content
- **Citation Requirements**: Ensures all factual claims are properly sourced
- **Interactive Refinement**: Allows iterative improvements through conversational interface
- **Length Control**: Targets 1-3 A4 pages of content
- **Personal Anecdotes**: Incorporates authentic-feeling personal stories for engagement
- **Notion Integration**: Automatically saves generated articles to Notion database

## Notion Integration Setup

### Prerequisites
1. **Create a Notion Integration**:
   - Go to https://www.notion.so/my-integrations
   - Click "New integration"
   - Name it and select workspace
   - Copy the integration token

2. **Create a Database**:
   - Create a new database in Notion
   - Add these properties:
     - `Title` (Title)
     - `Status` (Select: Generated, Draft, Published)
     - `Created` (Date)
   - Copy the database ID from the URL

3. **Connect Integration to Database**:
   - In your database, click "..." → "Connect to"
   - Select your integration

### Environment Variables
```bash
NOTION_TOKEN=your_integration_token
NOTION_DATABASE_ID=your_database_id
```

## Important Notes

- Proper dependency management with `requirements.txt` and `.env.example` files
- Uses GPT-5-2025-08-07 model for consistent, high-quality output
- Articles automatically saved to Notion database when configured
- Written articles are stored in the `Written texts/` folder for organization
- Virtual environment setup recommended for dependency isolation