import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, AlertTriangle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ResultCardProps {
  resultado: 'verde' | 'amarelo' | 'vermelho';
  pontuacao: number;
  onEncaminhar?: () => void;
  className?: string;
}

const ResultCard = ({ resultado, pontuacao, onEncaminhar, className }: ResultCardProps) => {
  const getResultConfig = () => {
    switch (resultado) {
      case 'verde':
        return {
          title: "Tudo em ordem! 😊",
          description: "Suas respostas indicam que você está lidando bem com suas emoções. Continue assim!",
          icon: <CheckCircle className="w-16 h-16 text-emoteen-green" />,
          bgColor: "bg-gradient-to-br from-green-50 to-emerald-50",
          borderColor: "border-emoteen-green",
          textColor: "text-emoteen-green"
        };
      case 'amarelo':
        return {
          title: "Atenção necessária 😌",
          description: "Algumas situações podem estar afetando você. É importante conversar com alguém de confiança.",
          icon: <AlertTriangle className="w-16 h-16 text-emoteen-yellow" />,
          bgColor: "bg-gradient-to-br from-yellow-50 to-amber-50",
          borderColor: "border-emoteen-yellow",
          textColor: "text-emoteen-yellow"
        };
      case 'vermelho':
        return {
          title: "Apoio recomendado 🤗",
          description: "Suas respostas indicam que conversar com um profissional pode te ajudar muito.",
          icon: <AlertCircle className="w-16 h-16 text-emoteen-red" />,
          bgColor: "bg-gradient-to-br from-red-50 to-rose-50",
          borderColor: "border-emoteen-red",
          textColor: "text-emoteen-red"
        };
    }
  };

  const config = getResultConfig();

  return (
    <Card className={cn("w-full max-w-2xl mx-auto shadow-xl", config.bgColor, config.borderColor, "border-2", className)}>
      <CardHeader className="text-center pb-6">
        <div className="flex justify-center mb-4">
          {config.icon}
        </div>
        <CardTitle className={cn("text-2xl md:text-3xl font-bold", config.textColor)}>
          {config.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center space-y-6">
        <p className="text-lg text-muted-foreground leading-relaxed">
          {config.description}
        </p>
        
        <div className="bg-white/50 rounded-lg p-4 border">
          <p className="text-sm text-muted-foreground mb-1">Pontuação obtida:</p>
          <p className="text-2xl font-bold text-foreground">{pontuacao} pontos</p>
        </div>

        {resultado === 'vermelho' && onEncaminhar && (
          <Button 
            onClick={onEncaminhar}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 text-lg font-medium"
          >
            💙 Solicitar Apoio Profissional
          </Button>
        )}

        <div className="text-xs text-muted-foreground mt-6 p-4 bg-white/30 rounded-lg">
          <p>Suas informações foram registradas de forma segura. A escola tem acesso apenas aos resultados necessários para oferecer o melhor suporte.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResultCard;