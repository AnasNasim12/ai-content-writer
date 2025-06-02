import os
# import google.generativeai as genai # No longer directly used if only using Langchain
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
import markdown # For Markdown to HTML conversion
from bs4 import BeautifulSoup # For HTML to text conversion

load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash", google_api_key=os.getenv("GEMINI_API_KEY"))
output_parser = StrOutputParser()

def clean_markdown(md_text):
    """
    Converts Markdown to plain text using the markdown and BeautifulSoup libraries,
    while attempting to preserve meaningful line breaks for lists and paragraphs.
    """
    if not md_text:
        return ""
    try:
        # Convert Markdown to HTML
        html = markdown.markdown(md_text)
        soup = BeautifulSoup(html, "html.parser")

        # Insert newline characters for <br> tags and after block elements
        # to help preserve structure when converting to text.
        for br_tag in soup.find_all("br"):
            br_tag.replace_with("\\n") # Use newline character
        
        for block_element in soup.find_all(['p', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'div', 'tr', 'ul', 'ol']):
            # Append a newline text node to the end of the element's content
            # This helps ensure separation when get_text() is called.
            # Check if the last child is already a newline to avoid duplicates if structure is complex
            if not (block_element.contents and isinstance(block_element.contents[-1], str) and block_element.contents[-1].endswith('\\n')): # Check for newline
                 block_element.append("\\n") # Append newline character

        # Get text; BeautifulSoup will try to be smart about spacing,
        # and we've added our own newlines.
        text = soup.get_text(separator='') # Use empty separator as we manage newlines

        # Clean up: split by our newlines, strip whitespace from each line,
        # filter out empty lines, then rejoin.
        lines = [line.strip() for line in text.split('\\n')] # Split by newline
        cleaned_text = '\\n'.join(filter(None, lines)) # Join with newline
        
        return cleaned_text
    except Exception as e:
        print(f"Error cleaning markdown with library (preserving newlines): {e}")
        # Fallback to returning the original text if library cleaning fails
        return md_text

def generate_text(prompt_template, prompt_input):
    """Generates text using the Gemini API via LangChain and cleans Markdown."""
    try:
        prompt = ChatPromptTemplate.from_template(prompt_template)
        chain = prompt | llm | output_parser
        response_text = chain.invoke(prompt_input)
        return clean_markdown(response_text) # Clean Markdown from LLM response
    except Exception as e:
        print(f"Error generating text: {e}") # This is where your original error was logged
        return None

def basic_seo_score(text, keyword):
    """Checks if the keyword is present in the text."""
    # Text is now cleaned by the library method, keyword is cleaned on frontend
    if keyword.lower() in text.lower():
        return 1
    return 0

@app.route('/related_keywords', methods=['POST'])
def get_related_keywords():
    data = request.get_json()
    seed_keyword = data.get('seed_keyword')
    if not seed_keyword:
        return jsonify({"error": "seed_keyword is required"}), 400

    prompt_template = "Generate 3-5 keywords related to: {seed_keyword}"
    # Input to generate_text is just the seed_keyword for this prompt
    related_keywords_text = generate_text(prompt_template, {"seed_keyword": seed_keyword})
    
    if related_keywords_text:
        # The output of generate_text is already cleaned.
        # Keywords are often line-separated.
        related_keywords = [kw.strip() for kw in related_keywords_text.split('\\n') if kw.strip()]
        return jsonify({"related_keywords": related_keywords[:5]})
    return jsonify({"error": "Failed to generate related keywords"}), 500

@app.route('/seo_titles', methods=['POST'])
def get_seo_titles():
    data = request.get_json()
    keyword = data.get('keyword')
    if not keyword:
        return jsonify({"error": "keyword is required"}), 400

    prompt_template = "Generate 2-3 SEO-optimized titles for the keyword: {keyword}"
    titles_text = generate_text(prompt_template, {"keyword": keyword})
    if titles_text:
        titles = [title.strip() for title in titles_text.split('\\n') if title.strip()]
        return jsonify({"titles": titles[:3]})
    return jsonify({"error": "Failed to generate titles"}), 500

@app.route('/topic_ideas', methods=['POST'])
def get_topic_ideas():
    data = request.get_json()
    title = data.get('title')
    if not title:
        return jsonify({"error": "title is required"}), 400

    prompt_template = "Generate 1-2 topic ideas or a blog outline for the title: {title}"
    topic_ideas_text = generate_text(prompt_template, {"title": title})
    if topic_ideas_text:
        return jsonify({"topic_ideas": topic_ideas_text.strip()}) # Already cleaned
    return jsonify({"error": "Failed to generate topic ideas"}), 500

@app.route('/generate_content', methods=['POST'])
def generate_short_content():
    data = request.get_json()
    topic = data.get('topic') 
    keyword = data.get('keyword')
    if not topic or not keyword:
        return jsonify({"error": "topic and keyword are required"}), 400

    prompt_template = """You are a professional SEO copywriter. Your job is to write engaging, concise, and SEO-optimized short content.

Write a short blog introduction (100–200 words) for the topic: "{topic}".

The content must include the exact keyword: "{keyword}" within the **first sentence**, and use it naturally at least **once more** in the body.

Keep the tone professional and clear. Avoid repeating the keyword unnecessarily.

The content should be engaging and suitable for online readers."""
    
    content = generate_text(prompt_template, {"topic": topic, "keyword": keyword})
    if content:
        score = basic_seo_score(content, keyword)
        return jsonify({"content": content, "seo_score": score})
    return jsonify({"error": "Failed to generate content"}), 500

@app.route('/score_seo', methods=['POST'])
def score_seo_route():
    data = request.get_json()
    text_content = data.get('text') # This text comes from frontend, might not be LLM output
    keyword = data.get('keyword')

    if not text_content or not keyword:
        return jsonify({"error": "text and keyword are required"}), 400

    # It's important to consider if text_content here also needs markdown cleaning.
    # If text_content is user-edited content from the textarea, it's probably plain.
    # If it could contain markdown from other sources, clean it:
    # cleaned_text_for_scoring = clean_markdown(text_content) 
    # For now, assuming text_content from the frontend is plain enough for the LLM.

    prompt_template = """
Analyze the following text for SEO effectiveness based on the primary keyword.
Provide a score from 0 to 100, where 100 is perfectly optimized.
Consider factors like keyword density (without overstuffing), keyword placement (titles, headings, early paragraphs),
relevance of the content to the keyword, and overall readability.
Do not provide any explanation, just the score.

Keyword: {keyword}
Text:
---
{text_content}
---
Score:
"""
    # Note: generate_text will clean the LLM's *response* (the score).
    # The {text_content} and {keyword} are inputs to the LLM.
    score_response_text = generate_text(prompt_template, {"keyword": keyword, "text_content": text_content})

    if score_response_text: # score_response_text is already cleaned by generate_text
        try:
            score = int(''.join(filter(str.isdigit, score_response_text)))
            if 0 <= score <= 100:
                return jsonify({"seo_score": score})
            else:
                print(f"LLM returned score out of range: {score_response_text}")
                basic_score_val = basic_seo_score(text_content, keyword) * 100 
                return jsonify({"seo_score": basic_score_val, "warning": "Advanced SEO scoring returned out-of-range score, used basic scoring."})
        except ValueError:
            print(f"Could not parse score from LLM response: {score_response_text}")
            basic_score_val = basic_seo_score(text_content, keyword) * 100
            return jsonify({"seo_score": basic_score_val, "warning": "Advanced SEO scoring failed to parse, used basic scoring."})
    return jsonify({"error": "Failed to score SEO"}), 500

if __name__ == '__main__':
    if not os.getenv("GEMINI_API_KEY"):
        print("Error: GEMINI_API_KEY not found. Please create a .env file with your API key.")
        print("Example .env content: \\nGEMINI_API_KEY=your_actual_api_key_here")
    else:
        print("Gemini API Key loaded.")
        print("Starting Flask server for LLM services...")
        app.run(debug=True, port=5001)
