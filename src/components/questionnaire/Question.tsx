import { useState } from "react";
import { motion } from "framer-motion";

interface QuestionProps {
  question: string;
  onAnswer: (answer: string) => void;
}

const Question = ({ question, onAnswer }: QuestionProps) => {
  const [answer, setAnswer] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (answer.trim()) {
      onAnswer(answer);
      setAnswer("");
    }
  };

  return (
    <div className="questionnaire-card max-w-2xl w-full mx-auto">
      <h2 className="text-2xl font-display mb-6">{question}</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          className="w-full p-4 rounded-lg border border-gray-200 h-32 resize-none
                     focus:ring-2 focus:ring-primary focus:border-transparent"
          placeholder="Share your thoughts..."
        />
        <button
          type="submit"
          className="primary-button mt-4 w-full"
          disabled={!answer.trim()}
        >
          Continue
        </button>
      </form>
    </div>
  );
};

export default Question;