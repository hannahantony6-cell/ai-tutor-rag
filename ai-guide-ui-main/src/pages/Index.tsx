import { useState } from "react";
import { toast } from "sonner";
import ControlSidebar from "@/components/ControlSidebar";
import QuestionFeed, { type Question } from "@/components/QuestionFeed";

const API_URL = "http://127.0.0.1:8000/generate";

const Index = () => {
  const [file, setFile] = useState<File | null>(null);
  const [unit, setUnit] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [qtype, setQtype] = useState("viva"); 
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!file || !unit || !difficulty || !qtype) {
      toast.error("Please fill all fields and upload a syllabus.");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("unit", unit);
      formData.append("difficulty", difficulty);
      formData.append("qtype", qtype);

      const response = await fetch(API_URL, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server Error: ${response.status}`);
      }

      const data = await response.json();
      console.log("Backend Response:", data);

      const rawQuestions = data.questions || [];

      // ✅ Robust Mapping: Handles both String arrays and Object arrays
      const parsed: Question[] = rawQuestions.map((item: any, i: number) => {
        if (typeof item === 'string') {
          return {
            id: String(i + 1),
            question: item,
            answer: "Click to see study details..."
          };
        }
        return {
          id: item.id || String(i + 1),
          question: item.question || item.text || "No question text found",
          answer: item.answer || "No answer details available.",
        };
      });

      setQuestions(parsed);
      
      if (parsed.length > 0) {
        toast.success(`${qtype.toUpperCase()} generated successfully!`);
      } else {
        toast.warning("Backend returned 0 questions. Check syllabus text.");
      }

    } catch (err: any) {
      console.error("Generation failed:", err);
      toast.error("Failed to connect to backend server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <ControlSidebar
        file={file}
        onFileChange={setFile}
        unit={unit}
        onUnitChange={setUnit}
        difficulty={difficulty}
        onDifficultyChange={setDifficulty}
        qtype={qtype}
        onQtypeChange={setQtype}
        onGenerate={handleGenerate}
        loading={loading}
        locked={loading}
      />
      <main className="flex flex-1 flex-col overflow-hidden">
        {loading && (
          <div className="h-1 w-full bg-primary/10">
            <div className="h-full w-full animate-progress-loading bg-primary" />
          </div>
        )}
        <div className="flex-1 overflow-y-auto p-6">
          <QuestionFeed questions={questions} loading={loading} />
        </div>
      </main>
    </div>
  );
};

export default Index;
