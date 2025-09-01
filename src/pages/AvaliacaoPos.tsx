import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle, Heart, Frown, Meh, Smile } from "lucide-react";
import { toast } from "sonner";
import { DEMO_MODE } from "@/config";
import EmoTeenLogo from "@/components/EmoTeenLogo";

const AvaliacaoPos = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [avaliacaoSelecionada, setAvaliacaoSelecionada] = useState<'bem' | 'melhor' | 'nada_bem' | null>(null);
  const [comentarios, setComentarios] = useState("");
  const [alunoNome, setAlunoNome] = useState("");
  const [escolaNome, setEscolaNome] = useState("");
  const [enviado, setEnviado] = useState(false);

  useEffect(() => {
    // Capturar dados da URL ou sessionStorage
    const aluno = searchParams.get('aluno') || sessionStorage.getItem('alunoNome') || '';
    const escola = searchParams.get('escola') || sessionStorage.getItem('escolaNome') || '';
    
    setAlunoNome(aluno);
    setEscolaNome(escola);

    if (!aluno || !escola) {
      toast.error("Dados da sessão não encontrados");
      navigate('/');
      return;
    }
  }, [searchParams, navigate]);

  const enviarAvaliacao = async () => {
    if (!avaliacaoSelecionada) {
      toast.error("Por favor, selecione como você se sente");
      return;
    }

    if (DEMO_MODE) {
      // Salvar no localStorage em demo mode
      const avaliacao = {
        id: Date.now().toString(),
        alunoNome,
        escolaNome,
        avaliacao: avaliacaoSelecionada,
        comentarios,
        dataAvaliacao: new Date().toISOString()
      };

      const avaliacoes = JSON.parse(localStorage.getItem('avaliacoes_pos_sessao') || '[]');
      avaliacoes.push(avaliacao);
      localStorage.setItem('avaliacoes_pos_sessao', JSON.stringify(avaliacoes));
      
      toast.success("Sua avaliação foi enviada com sucesso!");
    }

    setEnviado(true);
  };

  const opcoes = [
    {
      valor: 'nada_bem' as const,
      titulo: 'Nada Bem',
      descricao: 'Ainda me sinto muito mal',
      icon: Frown,
      cor: 'bg-emoteen-red/20 text-emoteen-red border-emoteen-red/30 hover:bg-emoteen-red/30'
    },
    {
      valor: 'bem' as const,
      titulo: 'Bem',
      descricao: 'Me sinto igual ao antes',
      icon: Meh,
      cor: 'bg-emoteen-yellow/20 text-emoteen-yellow border-emoteen-yellow/30 hover:bg-emoteen-yellow/30'
    },
    {
      valor: 'melhor' as const,
      titulo: 'Melhor',
      descricao: 'Me sinto melhor que antes',
      icon: Smile,
      cor: 'bg-emoteen-green/20 text-emoteen-green border-emoteen-green/30 hover:bg-emoteen-green/30'
    }
  ];

  if (enviado) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-8 pb-8">
            <div className="space-y-6">
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-emoteen-green/20 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-emoteen-green" />
                </div>
              </div>
              
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-foreground">Obrigado!</h2>
                <p className="text-muted-foreground">
                  Sua avaliação foi enviada com sucesso. Ela ajudará a melhorar nossos serviços.
                </p>
              </div>

              <Button onClick={() => navigate('/')} className="w-full">
                Voltar ao Início
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10">
      {/* Header */}
      <header className="px-4 py-6">
        <div className="max-w-4xl mx-auto flex items-center justify-center">
          <div className="flex items-center gap-3">
            <EmoTeenLogo size="md" />
            <h1 className="text-2xl font-bold text-foreground">EmoTeen</h1>
          </div>
        </div>
      </header>

      <div className="px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center">
                  <Heart className="w-8 h-8 text-primary" />
                </div>
              </div>
              <CardTitle className="text-2xl">Como você se sente após a sessão?</CardTitle>
              <div className="space-y-1 text-muted-foreground">
                <p><strong>Aluno:</strong> {alunoNome}</p>
                <p><strong>Escola:</strong> {escolaNome}</p>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Label className="text-base font-medium">Selecione como você se sente agora:</Label>
                <div className="grid gap-3">
                  {opcoes.map((opcao) => {
                    const Icon = opcao.icon;
                    const isSelected = avaliacaoSelecionada === opcao.valor;
                    
                    return (
                      <button
                        key={opcao.valor}
                        onClick={() => setAvaliacaoSelecionada(opcao.valor)}
                        className={`
                          p-4 rounded-lg border-2 transition-all duration-200 text-left
                          ${isSelected 
                            ? opcao.cor.replace('hover:', '') 
                            : 'border-border hover:border-primary/30 hover:bg-muted/50'
                          }
                        `}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`
                            w-12 h-12 rounded-full flex items-center justify-center
                            ${isSelected ? 'bg-white/20' : 'bg-muted'}
                          `}>
                            <Icon className={`w-6 h-6 ${isSelected ? 'text-current' : 'text-muted-foreground'}`} />
                          </div>
                          <div>
                            <h3 className={`font-semibold ${isSelected ? 'text-current' : 'text-foreground'}`}>
                              {opcao.titulo}
                            </h3>
                            <p className={`text-sm ${isSelected ? 'text-current/80' : 'text-muted-foreground'}`}>
                              {opcao.descricao}
                            </p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {avaliacaoSelecionada && (
                <div className="space-y-2">
                  <Label htmlFor="comentarios">
                    Gostaria de compartilhar algo mais? (Opcional)
                  </Label>
                  <Textarea
                    id="comentarios"
                    value={comentarios}
                    onChange={(e) => setComentarios(e.target.value)}
                    placeholder="Conte-nos como foi a experiência ou se há algo que gostaria de adicionar..."
                    rows={4}
                    className="resize-none"
                  />
                </div>
              )}

              <div className="flex gap-3">
                <Button 
                  onClick={enviarAvaliacao}
                  disabled={!avaliacaoSelecionada}
                  className="flex-1"
                >
                  Enviar Avaliação
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/')}
                  className="flex-1"
                >
                  Pular
                </Button>
              </div>

              <div className="text-center text-sm text-muted-foreground">
                <p>Sua avaliação é confidencial e nos ajuda a melhorar nossos serviços.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AvaliacaoPos;