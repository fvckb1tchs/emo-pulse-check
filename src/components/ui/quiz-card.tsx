import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface QuizCardProps {
  question: string;
  questionNumber: number;
  totalQuestions: number;
  selectedValue: number | null;
  onValueChange: (value: number) => void;
  className?: string;
}

const QuizCard = ({ 
  question, 
  questionNumber, 
  totalQuestions, 
  selectedValue, 
  onValueChange,
  className 
}: QuizCardProps) => {
  const options = [
    { value: 1, label: "Nunca", emoji: "😊" },
    { value: 2, label: "Raramente", emoji: "🙂" },
    { value: 3, label: "Às vezes", emoji: "😐" },
    { value: 4, label: "Frequentemente", emoji: "😟" }
  ];

  return (
    <Card className={cn("w-full max-w-2xl mx-auto shadow-lg", className)}>
      <CardHeader className="text-center pb-4">
        <div className="text-sm text-muted-foreground mb-2">
          Pergunta {questionNumber} de {totalQuestions}
        </div>
        <div className="w-full bg-muted rounded-full h-2 mb-4">
          <div 
            className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all duration-300"
            style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
          />
        </div>
        <CardTitle className="text-lg md:text-xl text-foreground leading-relaxed">
          {question}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {options.map((option) => (
          <Button
            key={option.value}
            variant={selectedValue === option.value ? "default" : "outline"}
            className={cn(
              "w-full justify-start text-left h-auto py-4 px-6 transition-all duration-200",
              selectedValue === option.value 
                ? "bg-primary text-primary-foreground border-primary shadow-md" 
                : "hover:bg-accent hover:text-accent-foreground"
            )}
            onClick={() => onValueChange(option.value)}
          >
            <span className="text-lg mr-3">{option.emoji}</span>
            <div className="flex flex-col items-start">
              <span className="font-medium">{option.label}</span>
            </div>
          </Button>
        ))}
      </CardContent>
    </Card>
  );
};

export default QuizCard;