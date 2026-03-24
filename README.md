🤖 RAG-Based AI Tutor Assistant
A full-stack Intelligent Tutoring System that uses Retrieval-Augmented Generation (RAG) to generate study materials directly from your syllabus. This tool automatically creates Viva questions, Assignments, and Lab/Practical coding exercises using local LLMs.


🌟 Features
Syllabus Parsing: Automatically splits and indexes PDF/Text syllabus files by Unit.
Smart Retrieval: Uses ChromaDB and Sentence Transformers to fetch only the relevant unit content for question generation.
Multi-Mode Question Generation:
Viva: Short, one-word/conceptual questions.
Assignment: In-depth, descriptive theoretical questions.
Lab/Practical: Practical problem statements with complete source code answers.
Privacy-First: Runs locally using Ollama (Llama 3.2 3B), ensuring your data never leaves your machine.


🛠️ Tech Stack
Frontend: React.js, Vite, Tailwind CSS
Backend: FastAPI (Python)
Vector Database: ChromaDB
LLM Engine: Ollama (Llama 3.2 3B)
Embeddings: all-MiniLM-L6-v2 (Sentence-Transformers)


🚀 Getting Started
Prerequisites
Ollama: Install from ollama.com
Model: Run ollama pull llama3.2:3b
Python: 3.9 or higher
Installation
Clone the Repository:
bash
git clone https://github.com
cd ai-tutor-rag
Use code with caution.

Setup Backend:
bash
# Create virtual environment
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install dependencies
pip install fastapi uvicorn chromadb sentence-transformers ollama
Use code with caution.

Setup Frontend:
bash
cd ai-guide-ui-main
npm install
Use code with caution.

Running the Project
Start Backend:
bash
python main.py
Use code with caution.

Start Frontend:
bash
npm run dev
Use code with caution.

Usage: Upload your syllabus.txt, select the Unit and Type (Viva/Lab/Assignment), and generate your study set!
