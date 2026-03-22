import QuestionCard from "./QuestionCard";
import { motion } from "framer-motion";

export interface Question {
  id: string;
  question: string;
  answer: string;
}

interface QuestionFeedProps {
  questions: Question[];
  loading: boolean;
}

const QuestionFeed = ({ questions, loading }: QuestionFeedProps) => {
  if (loading) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center">
        <motion.div
          className="h-px w-48 bg-primary/30"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 2, ease: "easeInOut", repeat: Infinity }}
          style={{ transformOrigin: "left" }}
        />
        <p className="mt-4 text-sm text-muted-foreground">
          Discovering questions…
        </p>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <p className="font-serif text-lg text-muted-foreground">
          Upload your syllabus to begin the extraction.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-8">
      <div className="mx-auto w-full max-w-[65ch] space-y-3">
        {questions.map((q, i) => (
          <QuestionCard
            key={q.id}
            question={q.question}
            answer={q.answer}
            index={i}
          />
        ))}
      </div>
    </div>
  );
};

export default QuestionFeed;
