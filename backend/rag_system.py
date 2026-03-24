import chromadb
from sentence_transformers import SentenceTransformer
import ollama
import re

# 1. Setup Models
# Llama 3.2 3B is perfect for your 7.7GB RAM
embedding_model = SentenceTransformer("all-MiniLM-L6-v2")
client = chromadb.Client()

def load_syllabus():
    global collection
    try:
        client.delete_collection("syllabus")
    except:
        pass
    
    collection = client.get_or_create_collection("syllabus")

    # Ensure syllabus.txt exists in your folder
    try:
        with open("syllabus.txt", "r", encoding="utf-8") as f:
            text = f.read()
    except FileNotFoundError:
        print("❌ Error: syllabus.txt not found!")
        return

    # Split by Unit headers (e.g., Unit I, Unit II)
    pattern = r'(Unit\s+[IVX]+)'
    parts = re.split(pattern, text)
    
    for i in range(1, len(parts), 2):
        unit_label = parts[i].strip()
        unit_content = parts[i+1].strip() if (i+1) < len(parts) else ""
        
        collection.add(
            documents=[unit_content],
            embeddings=[embedding_model.encode(unit_content).tolist()],
            ids=[f"chunk_{unit_label}_{i}"],
            metadatas=[{"unit": unit_label}]
        )

    print(f"✅ Indexed {collection.count()} units into ChromaDB.")

def generate_questions(unit_id, qtype, difficulty):
    # 1. Retrieval
    results = collection.query(
        query_texts=[unit_id],
        n_results=1,
        where={"unit": unit_id} 
    )

    if not results["documents"] or not results["documents"][0]:
        return []

    context = results["documents"][0][0]

    # 2. Strict Prompting for Llama 3.2 3B
    prompt = f"Context: {context}\nGenerate 5 {difficulty} {qtype} questions..."
    

    response = ollama.chat(
        model="llama3.2:3b",
        messages=[{"role": "user", "content": prompt}]
    )
    
    raw_text = response["message"]["content"]
    
    # 3. Robust Parsing Logic (The "Shift" Fix)
    # This ignores preambles and looks only for Q&A pairs
    final_questions = []
    # Find all occurrences of Question: ... Answer: ...
    pattern = re.compile(r"Question:\s*(.*?)\s*Answer:\s*(.*?)(?=Question:|---|$)", re.DOTALL | re.IGNORECASE)
    matches = pattern.findall(raw_text)

    for q_text, a_text in matches:
        final_questions.append({
            "question": q_text.strip(),
            "answer": a_text.strip()
        })

    return final_questions

if __name__ == "__main__":
    load_syllabus()
    
    u = input("Enter Unit (e.g., Unit II): ").strip()
    t = input("Enter Type (Assignment/Viva): ").strip()
    d = input("Enter Difficulty (Easy/Medium/Hard): ").strip()

    print(f"\n🔍 Generating {d} questions for {u}...")
    questions = generate_questions(u, t, d)

    if not questions:
        print("No questions were generated. Check your syllabus content.")
    else:
        for idx, item in enumerate(questions, 1):
            print(f"\n[{idx}] QUESTION: {item['question']}")
            print(f"    ANSWER: {item['answer']}")
