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
  const [answers, setAnswers] = useState<number[]>(new Array(35).fill(0));
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
    const serieId = sessionStorage.getItem('serieId');
    
    if (!escolaId || !alunoNome || !serieId) {
      navigate('/login');
    }
  }, [navigate]);

  const questions = [
    // 🟢 Perguntas de Bem-estar (15 perguntas)
    "Eu consigo me concentrar bem durante as aulas.",
    "Eu costumo dormir bem e acordo disposto(a).",
    "Me sinto confortável conversando com amigos e familiares.",
    "Eu me sinto seguro(a) na escola.",
    "Me sinto motivado(a) a estudar ou fazer atividades que gosto.",
    "Eu tenho facilidade em lidar com pequenas frustrações.",
    "Sinto que tenho pessoas que se importam comigo.",
    "Me sinto confiante com quem sou.",
    "Eu costumo manter minha rotina organizada.",
    "Sinto que minha saúde física está boa.",
    "Eu consigo controlar minha raiva ou irritação com facilidade.",
    "Me sinto feliz com frequência.",
    "Consigo pedir ajuda quando preciso.",
    "Me sinto incluído(a) nas atividades da escola.",
    "Me divirto e aproveito meu tempo livre.",
    
    // 🟡 Perguntas de Atenção (12 perguntas)
    "Me sinto muito cansado(a), mesmo sem fazer esforço físico.",
    "Tenho dificuldade para dormir ou insônia frequente.",
    "Me sinto sobrecarregado(a) com as cobranças do dia a dia.",
    "Tenho dificuldade em me concentrar nas aulas ou tarefas.",
    "Às vezes evito contato com pessoas próximas.",
    "Sinto que não estou rendendo como antes.",
    "Me sinto inseguro(a) sobre o meu futuro.",
    "Tenho tido muitas mudanças de humor.",
    "Sinto falta de vontade de fazer coisas que antes gostava.",
    "Costumo me sentir sozinho(a), mesmo quando há pessoas por perto.",
    "Já pensei em faltar à escola para evitar algum desconforto.",
    "Me sinto pressionado(a) para agradar os outros o tempo todo.",
    
    // 🔴 Perguntas Críticas (8 perguntas)
    "Sinto que minha vida não faz sentido.",
    "Já pensei em machucar a mim mesmo(a).",
    "Sinto uma tristeza profunda que não passa.",
    "Já chorei escondido(a) por não saber o que fazer com o que estou sentindo.",
    "Sinto que ninguém me entende ou me escuta de verdade.",
    "Já pensei em desistir de tudo.",
    "Tenho vontade de desaparecer ou sumir por um tempo.",
    "Sinto que estou no limite, como se fosse explodir."
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

    // Contar respostas críticas (perguntas 28-35 com resposta 3 ou 4)
    const perguntasCriticas = answers.slice(27, 35); // índices 27-34 (perguntas 28-35)
    const respostasCriticasAltas = perguntasCriticas.filter(resposta => resposta >= 3).length;

    // Determinar resultado conforme nova lógica
    let resultadoFinal: 'verde' | 'amarelo' | 'vermelho';
    
    if (respostasCriticasAltas >= 3 || totalScore >= 81) {
      resultadoFinal = 'vermelho';
    } else if (respostasCriticasAltas >= 1 || (totalScore >= 46 && totalScore <= 80)) {
      resultadoFinal = 'amarelo';
    } else {
      resultadoFinal = 'verde';
    }
    
    setResultado(resultadoFinal);

    // Salvar no banco de dados
    try {
      const escolaId = sessionStorage.getItem('escolaId');
      const alunoNome = sessionStorage.getItem('alunoNome');
      const serieId = sessionStorage.getItem('serieId');

      const { error } = await supabase
        .from('respostas_quiz')
        .insert({
          aluno_nome: alunoNome,
          escola_id: escolaId,
          serie_id: serieId,
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