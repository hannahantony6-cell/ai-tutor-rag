from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
import chromadb
from sentence_transformers import SentenceTransformer
import ollama
import re

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

embedding_model = SentenceTransformer("all-MiniLM-L6-v2")
client = chromadb.Client()

@app.post("/generate")
async def generate_study_set(
    unit: str = Form(...),
    difficulty: str = Form(...),
    qtype: str = Form(...),
    file: UploadFile = File(...)
):
    try: client.delete_collection("syllabus_final")
    except: pass
    
    collection = client.get_or_create_collection("syllabus_final")
    content = await file.read()
    text = content.decode("utf-8")
    
    # Split text into units
    parts = re.split(r'(Unit\s+[IVX]+)', text)
    for i in range(1, len(parts), 2):
        u_label = parts[i].strip()
        u_body = parts[i+1].strip() if (i+1) < len(parts) else ""
        collection.add(
            documents=[u_body],
            embeddings=[embedding_model.encode(u_body).tolist()],
            ids=[f"id_{u_label}_{i}"],
            metadatas=[{"unit": u_label}]
        )

    # Retrieval
    search_unit = unit.replace("unit-", "Unit ").upper() if "unit-" in unit else unit
    results = collection.query(query_texts=[search_unit], n_results=1, where={"unit": search_unit})
    raw_docs = results.get("documents", [[]])
    context = raw_docs[0][0] if (raw_docs and len(raw_docs[0]) > 0) else text

    if qtype.lower() == "viva":
        persona_instruction = """
        ROLE: Oral Examiner.
        TASK: Generate 5 SHORT 'Viva Voce' questions.
        - Questions must be direct and conceptual.
        - Answers must be ONE WORD or ONE SHORT SENTENCE only.
        - Do not provide long explanations.
        """
    elif qtype.lower() in ["lab", "practical"]:
        persona_instruction = """
        ROLE: Lab Instructor.
        TASK: Generate 5 CODING/PROGRAMMING exercises.
        - Question: State a programming problem (e.g., 'Write a C program to perform Binary Search').
        - Answer: Provide the complete, working SOURCE CODE for the solution.
        - Format code clearly.
        """
    else: # Assignment / Descriptive
        persona_instruction = f"""
        ROLE: Professor.
        TASK: Generate 5 {difficulty} level descriptive assignment questions.
        - Questions: Ask for 'Explain', 'Describe', or 'Differentiate'.
        - Answer: Provide a detailed, paragraph-style explanation.
        """

    # 2. THE PROMPT (Optimized for Llama 3.2 3B)
    prompt = f"""
    {persona_instruction}
    
    CONTEXT FROM SYLLABUS: {context}
    UNIT: {unit}

    STRICT OUTPUT FORMAT:
    Question: [Your question/task]
    Answer: [Your one-word/descriptive/code answer]
    ---
    (Generate exactly 5. No intro text like 'Here are your questions'.)
    """

    response = ollama.chat(model="llama3.2:3b", messages=[{"role": "user", "content": prompt}])
    raw_text = response["message"]["content"]

    # 3. ROBUST PARSING (Same regex as before, it works for code too!)
    final_questions = []
    pattern = re.compile(r"Question:\s*(.*?)\s*Answer:\s*(.*?)(?=Question:|---|$)", re.DOTALL | re.IGNORECASE)
    matches = pattern.findall(raw_text)

    for q_text, a_text in matches:
        final_questions.append({
            "question": q_text.strip(),
            "answer": a_text.strip()
        })

    return {"questions": final_questions[:5]}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
