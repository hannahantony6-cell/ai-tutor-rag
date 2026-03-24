import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface QuestionCardProps {
  question: string;
  answer: string;
  index: number;
}

const QuestionCard = ({ question, answer, index }: QuestionCardProps) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
        delay: index * 0.05,
      }}
      className="group cursor-pointer rounded-lg border border-border bg-card p-5 shadow-sm transition-[border-color,box-shadow] duration-[40ms] hover:border-primary/30 hover:shadow-md"
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex items-start justify-between gap-3">
        <span className="text-xs font-medium text-muted-foreground">
          Q{index + 1}
        </span>
        <p className="flex-1 font-serif text-base leading-[1.6] text-foreground">
          {question}
        </p>
        <ChevronDown
          className={`mt-0.5 h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 ${
            expanded ? "rotate-180" : ""
          }`}
        />
      </div>
      {expanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.2 }}
          className="mt-4 border-t border-border pt-4"
        >
          <p className="font-serif text-sm leading-relaxed text-muted-foreground">
            {answer}
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default QuestionCard;
