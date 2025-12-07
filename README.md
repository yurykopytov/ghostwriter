# AI Ghostwriter

> Turn ideas into articles, feel how good it is to be able to actually write something.

A web-based AI ghostwriting interface that generates high-quality, well-researched journalistic articles from simple topic ideas. Built with OpenAI's GPT models and featuring a clean, intuitive user interface.

## Try It Live

🌐 **[Launch AI Ghostwriter](https://yurykopytov.github.io/ghostwriter/)**

## Features

- **Simple Web Interface**: No installation required - just open and start writing
- **Intelligent Article Generation**: Converts brief ideas into full-length (1-3 A4 pages) journalistic articles
- **Narrative Journalism Style**: Produces engaging, first-person content with personal anecdotes
- **Fact-Checked Content**: All factual claims backed by proper citations and references
- **Interactive Refinement**: Iterative improvement through conversational interface
- **Notion Integration**: Optional automatic saving of generated articles to Notion database
- **Multiple Output Formats**: Suitable for Medium, Substack, and other publishing platforms

## How to Use

### 1. Open the Application

Simply open `index.html` in your web browser, or visit the live version at [https://yurykopytov.github.io/ghostwriter/](https://yurykopytov.github.io/ghostwriter/)

### 2. Configure Your API Keys

On first use, you'll need to configure:
- **OpenAI API Key**: Get yours at [platform.openai.com](https://platform.openai.com/)
- **Notion Integration** (Optional): For auto-saving articles

The app stores your keys locally in your browser - they never leave your computer.

### 3. Start Writing

1. Enter your article idea or topic
2. Click "Generate Article"
3. Review the generated content
4. Use follow-up prompts to refine and improve
5. Export or save to Notion

## What Makes This Different?

The AI Ghostwriter specializes in **narrative journalism**:

- **First-person perspective** that feels authentic and personal
- **Well-researched content** with mandatory source citations
- **Personal anecdotes** woven naturally into the narrative
- **Modern, engaging tone** suitable for contemporary publishing platforms
- **Balanced analysis** with nuanced perspectives

## Example Articles

The AI has generated articles on diverse topics:

- **Tech & Philosophy**: Exploring parallels between Agile methodology and French deconstructionism
- **Business & Politics**: Analyzing the transformation of states into corporate structures
- **Leadership**: Connecting ancient concepts of truth-telling with modern founder dynamics

## Local Setup (Optional)

Want to run it locally?

```bash
# Clone the repository
git clone https://github.com/yurykopytov/ghostwriter.git
cd ghostwriter

# Open in browser
open index.html

# Or use a local server
python -m http.server 8000
# Then visit http://localhost:8000
```

## Configuration

### OpenAI API Setup

1. Visit [OpenAI Platform](https://platform.openai.com/)
2. Create an account or sign in
3. Navigate to API Keys
4. Create a new API key
5. Copy and paste into the Ghostwriter settings

**Note**: API usage incurs costs ($0.10 - $1.00 per article typically)

### Notion Integration (Optional)

To enable auto-save to Notion:

1. **Create Integration** at [notion.so/my-integrations](https://www.notion.so/my-integrations)
2. **Create Database** in your Notion workspace with properties:
   - `Title` (Title)
   - `Status` (Select: Generated, Draft, Published)
   - `Created` (Date)
3. **Connect** your integration to the database
4. **Add credentials** in Ghostwriter settings

## Privacy & Security

- **All keys stored locally** in your browser's localStorage
- **No backend server** - connects directly to OpenAI
- **Your data stays private** - nothing sent to our servers
- **Open source** - review the code yourself

## Technical Details

Built with vanilla JavaScript, HTML5, and CSS3:
- No frameworks or build tools required
- Works offline (once loaded)
- Responsive design for mobile and desktop
- Clean, maintainable code

## Browser Compatibility

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- Mobile browsers: ✅ Supported

## Support & Feedback

Having issues or suggestions?
- Open an issue on [GitHub](https://github.com/yurykopytov/ghostwriter/issues)
- Check existing issues for solutions
- Contribute improvements via Pull Request

## License

This project is available for personal and educational use.

## Acknowledgments

- Powered by [OpenAI's GPT models](https://platform.openai.com/)
- Notion integration via [Notion API](https://developers.notion.com/)
- Inspired by modern narrative journalism and AI-assisted writing

---

**Start writing better articles today. No installation, no setup headaches, just great content.**
