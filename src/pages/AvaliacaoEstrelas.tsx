import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import EmoTeenLogo from "@/components/EmoTeenLogo";
import { Star, Send, ArrowLeft } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { DEMO_MODE } from "@/config";

const AvaliacaoEstrelas = () => {
  const [avaliacao, setAvaliacao] = useState(0);
  const [comentarios, setComentarios] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const alunoNome = searchParams.get('aluno') || '';
  const escolaNome = searchParams.get('escola') || '';
  const sessaoId = searchParams.get('sessao') || '';

  const handleEstrelaClick = (estrela: number) => {
    setAvaliacao(estrela);
  };

  const handleEnviarAvaliacao = async () => {
    if (avaliacao === 0) {
      toast({
        title: "Avaliação obrigatória",
        description: "Por favor, selecione pelo menos uma estrela para continuar.",
        variant: "destructive"
      });
      return;
    }

    setEnviando(true);

    try {
      if (DEMO_MODE) {
        // Simular envio em modo demo
        setTimeout(() => {
          setEnviado(true);
          setEnviando(false);
          toast({
            title: "Avaliação enviada! ⭐",
            description: "Sua avaliação foi registrada com sucesso. Obrigado pelo seu feedback!",
          });
        }, 1500);
        return;
      }

      // Inserir avaliação no banco de dados
      const { error } = await supabase
        .from('avaliacoes_pos_sessao')
        .insert({
          sessao_id: sessaoId,
          aluno_nome: alunoNome,
          escola_nome: escolaNome,
          avaliacao: `${avaliacao} estrelas`,
          comentarios: comentarios.trim() || null
        });

      if (error) throw error;

      setEnviado(true);
      toast({
        title: "Avaliação enviada! ⭐",
        description: "Sua avaliação foi registrada com sucesso. Obrigado pelo seu feedback!",
      });
    } catch (error) {
      console.error('Erro ao enviar avaliação:', error);
      toast({
        title: "Erro ao enviar",
        description: "Não foi possível registrar sua avaliação. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setEnviando(false);
    }
  };

  const handleVoltar = () => {
    navigate(-1);
  };

  if (enviado) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emoteen-blue via-emoteen-purple to-emoteen-pink flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-6">
            <EmoTeenLogo className="w-16 h-16 mx-auto mb-4" />
            <div className="flex justify-center mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star 
                  key={star} 
                  className={`w-8 h-8 ${star <= avaliacao ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                />
              ))}
            </div>
            <h2 className="text-2xl font-bold text-emoteen-blue mb-2">
              Obrigado pela sua avaliação!
            </h2>
            <p className="text-muted-foreground mb-6">
              Sua avaliação de {avaliacao} estrelas foi registrada com sucesso.
              {comentarios && " Seus comentários também foram salvos."}
            </p>
            <Button onClick={handleVoltar} className="w-full">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emoteen-blue via-emoteen-purple to-emoteen-pink flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center pb-4">
          <EmoTeenLogo className="w-16 h-16 mx-auto mb-4" />
          <CardTitle className="text-2xl font-bold text-emoteen-blue">
            Avalie a Sessão
          </CardTitle>
          {alunoNome && (
            <p className="text-sm text-muted-foreground">
              Sessão do aluno: <span className="font-medium">{alunoNome}</span>
            </p>
          )}
          {escolaNome && (
            <p className="text-sm text-muted-foreground">
              Escola: <span className="font-medium">{escolaNome}</span>
            </p>
          )}
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-4">
              Como você avalia a qualidade da sessão realizada?
            </p>
            
            <div className="flex justify-center gap-2 mb-2">
              {[1, 2, 3, 4, 5].map((estrela) => (
                <button
                  key={estrela}
                  onClick={() => handleEstrelaClick(estrela)}
                  className="transition-all duration-200 hover:scale-110 focus:outline-none"
                  aria-label={`Avaliar com ${estrela} estrela${estrela > 1 ? 's' : ''}`}
                >
                  <Star 
                    className={`w-10 h-10 transition-colors ${
                      estrela <= avaliacao 
                        ? 'text-yellow-400 fill-current' 
                        : 'text-gray-300 hover:text-yellow-200'
                    }`} 
                  />
                </button>
              ))}
            </div>
            
            {avaliacao > 0 && (
              <p className="text-sm text-emoteen-blue font-medium">
                {avaliacao} estrela{avaliacao > 1 ? 's' : ''} selecionada{avaliacao > 1 ? 's' : ''}
              </p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Comentários adicionais (opcional)
            </label>
            <Textarea
              placeholder="Conte-nos mais sobre sua experiência com a sessão..."
              value={comentarios}
              onChange={(e) => setComentarios(e.target.value)}
              rows={4}
              className="mt-2"
            />
          </div>

          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={handleVoltar}
              className="flex-1"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <Button 
              onClick={handleEnviarAvaliacao}
              disabled={enviando || avaliacao === 0}
              className="flex-1"
            >
              <Send className="w-4 h-4 mr-2" />
              {enviando ? "Enviando..." : "Enviar Avaliação"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AvaliacaoEstrelas;