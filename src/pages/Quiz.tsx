import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import EmoTeenLogo from "@/components/EmoTeenLogo";
import QuizCard from "@/components/ui/quiz-card";
import ResultCard from "@/components/ui/result-card";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Quiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>(new Array(10).fill(0));
  const [showResult, setShowResult] = useState(false);
  const [resultado, setResultado] = useState<'verde' | 'amarelo' | 'vermelho'>('verde');
  const [pontuacao, setPontuacao] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Verificar se usuário está autenticado
  useEffect(() => {
    const escolaId = sessionStorage.getItem('escolaId');
    const alunoNome = sessionStorage.getItem('alunoNome');
    
    if (!escolaId || !alunoNome) {
      navigate('/login');
    }
  }, [navigate]);

  const questions = [
    "Como você se sente quando precisa falar em público ou apresentar algo para a turma?",
    "Você tem dificuldade para dormir ou relaxar quando algo te preocupa?",
    "Quando alguém te critica, como você costuma reagir?",
    "Você se sente sobrecarregado(a) com as atividades escolares ou da vida?",
    "Como você lida quando as coisas não saem como planejado?",
    "Você sente que tem apoio suficiente de amigos e família?",
    "Quando você erra em algo, como se sente sobre si mesmo(a)?",
    "Você consegue expressar seus sentimentos para pessoas próximas?",
    "Como você se sente em relação ao seu futuro?",
    "Você sente que consegue controlar suas emoções na maioria das vezes?"
  ];

  const handleAnswerChange = (value: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = value;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (answers[currentQuestion] === 0) {
      toast({
        title: "Selecione uma resposta",
        description: "Por favor, escolha uma opção antes de continuar.",
        variant: "destructive"
      });
      return;
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateResult();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateResult = async () => {
    setLoading(true);
    
    // Calcular pontuação
    const totalScore = answers.reduce((sum, answer) => sum + answer, 0);
    setPontuacao(totalScore);

    // Determinar resultado
    let resultadoFinal: 'verde' | 'amarelo' | 'vermelho';
    if (totalScore <= 20) {
      resultadoFinal = 'verde';
    } else if (totalScore <= 30) {
      resultadoFinal = 'amarelo';
    } else {
      resultadoFinal = 'vermelho';
    }
    
    setResultado(resultadoFinal);

    // Salvar no banco de dados
    try {
      const escolaId = sessionStorage.getItem('escolaId');
      const alunoNome = sessionStorage.getItem('alunoNome');

      const { error } = await supabase
        .from('respostas_quiz')
        .insert({
          aluno_nome: alunoNome,
          escola_id: escolaId,
          respostas: answers,
          resultado: resultadoFinal,
          pontuacao: totalScore,
          encaminhado: false
        });

      if (error) throw error;

      setShowResult(true);
      
      toast({
        title: "Avaliação concluída! ✅",
        description: "Suas respostas foram registradas com sucesso.",
      });
    } catch (error) {
      console.error('Erro ao salvar respostas:', error);
      toast({
        title: "Erro ao salvar",
        description: "Houve um problema ao registrar suas respostas. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEncaminhar = async () => {
    try {
      const escolaId = sessionStorage.getItem('escolaId');
      const alunoNome = sessionStorage.getItem('alunoNome');

      const { error } = await supabase
        .from('respostas_quiz')
        .update({ encaminhado: true })
        .eq('aluno_nome', alunoNome)
        .eq('escola_id', escolaId);

      if (error) throw error;

      toast({
        title: "Solicitação enviada! 💙",
        description: "A escola foi notificada e entrará em contato em breve.",
      });
    } catch (error) {
      console.error('Erro ao encaminhar:', error);
      toast({
        title: "Erro",
        description: "Não foi possível enviar a solicitação. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const handleFinish = () => {
    // Limpar sessão e voltar ao início
    sessionStorage.clear();
    navigate('/');
  };

  if (showResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10 flex items-center justify-center p-4">
        <div className="w-full max-w-4xl space-y-8">
          <div className="text-center">
            <EmoTeenLogo size="md" className="mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-foreground">Resultado da Avaliação</h1>
          </div>

          <ResultCard 
            resultado={resultado}
            pontuacao={pontuacao}
            onEncaminhar={resultado === 'vermelho' ? handleEncaminhar : undefined}
          />

          <div className="text-center">
            <Button 
              onClick={handleFinish}
              variant="outline"
              className="px-8 py-2"
            >
              Finalizar
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <EmoTeenLogo size="md" className="mx-auto" />
          <div>
            <h1 className="text-2xl font-bold text-foreground">Avaliação de Bem-estar</h1>
            <p className="text-muted-foreground">
              Responda com sinceridade. Não existem respostas certas ou erradas.
            </p>
          </div>
        </div>

        {/* Quiz */}
        <QuizCard
          question={questions[currentQuestion]}
          questionNumber={currentQuestion + 1}
          totalQuestions={questions.length}
          selectedValue={answers[currentQuestion] || null}
          onValueChange={handleAnswerChange}
        />

        {/* Navigation */}
        <div className="flex justify-between items-center max-w-2xl mx-auto">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Anterior
          </Button>

          <span className="text-sm text-muted-foreground">
            {currentQuestion + 1} de {questions.length}
          </span>

          <Button
            onClick={handleNext}
            disabled={loading}
            className="flex items-center gap-2"
          >
            {currentQuestion === questions.length - 1 ? (
              loading ? 'Finalizando...' : 'Finalizar'
            ) : (
              <>
                Próxima
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Quiz;