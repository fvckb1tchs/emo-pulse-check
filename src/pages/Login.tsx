import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import EmoTeenLogo from "@/components/EmoTeenLogo";
import { useSecurityLogger } from "@/hooks/useSecurityLogger";
import { Loader2, School, User, GraduationCap } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Serie {
  id: string;
  nome: string;
}

const Login = () => {
  const [codigoEscola, setCodigoEscola] = useState("");
  const [nomeAluno, setNomeAluno] = useState("");
  const [serieId, setSerieId] = useState("");
  const [series, setSeries] = useState<Serie[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { logAction, logSessionAttempt } = useSecurityLogger();

  // Carregar séries quando código da escola for alterado
  useEffect(() => {
    if (codigoEscola.length >= 3) {
      loadSeries();
    } else {
      setSeries([]);
      setSerieId("");
    }
  }, [codigoEscola]);

  const loadSeries = async () => {
    try {
      // Primeiro buscar a escola pelo código
      const { data: escolaData, error: escolaError } = await supabase
        .from('escolas')
        .select('id')
        .eq('codigo_acesso', codigoEscola.toUpperCase())
        .single();

      if (escolaError || !escolaData) {
        setSeries([]);
        return;
      }

      // Buscar séries ativas da escola
      const { data: seriesData, error: seriesError } = await supabase
        .from('series')
        .select('id, nome')
        .eq('escola_id', escolaData.id)
        .eq('ativa', true)
        .order('nome');

      if (seriesError) throw seriesError;
      setSeries(seriesData || []);
    } catch (error) {
      console.error('Erro ao carregar séries:', error);
      setSeries([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!codigoEscola.trim()) {
      toast({
        title: "Código obrigatório",
        description: "Por favor, informe o código da escola.",
        variant: "destructive"
      });
      return;
    }

    if (!nomeAluno.trim()) {
      toast({
        title: "Nome obrigatório",
        description: "Por favor, informe seu nome completo.",
        variant: "destructive"
      });
      return;
    }

    if (!serieId) {
      toast({
        title: "Série obrigatória",
        description: "Por favor, selecione sua série.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      // Verificar se o código da escola existe
      const { data: escola, error } = await supabase
        .from('escolas')
        .select('id, nome')
        .eq('codigo_acesso', codigoEscola.toUpperCase())
        .single();

      if (error || !escola) {
        toast({
          title: "Código inválido",
          description: "O código da escola não foi encontrado. Verifique e tente novamente.",
          variant: "destructive"
        });
        return;
      }

      // Armazenar dados na sessão
      sessionStorage.setItem('escolaId', escola.id);
      sessionStorage.setItem('escolaNome', escola.nome);
      sessionStorage.setItem('alunoNome', nomeAluno);
      sessionStorage.setItem('serieId', serieId);

      toast({
        title: "Acesso autorizado! 🎉",
        description: `Bem-vindo(a), ${nomeAluno}!`,
      });

      navigate('/quiz');
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      toast({
        title: "Erro de conexão",
        description: "Não foi possível conectar. Tente novamente em alguns instantes.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <EmoTeenLogo size="lg" className="mx-auto" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">EmoTeen</h1>
            <p className="text-muted-foreground mt-2">
              Acesse com o código da sua escola
            </p>
          </div>
        </div>

        {/* Login Form */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl text-center font-semibold">
              Iniciar Avaliação
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="codigo" className="text-sm font-medium">
                  Código da Escola
                </Label>
                <div className="relative">
                  <School className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    id="codigo"
                    type="text"
                    placeholder="Ex: ESCOLA123"
                    value={codigoEscola}
                    onChange={(e) => setCodigoEscola(e.target.value.toUpperCase())}
                    className="pl-10 h-12"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="nome" className="text-sm font-medium">
                  Seu Nome Completo
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    id="nome"
                    type="text"
                    placeholder="Digite seu nome completo"
                    value={nomeAluno}
                    onChange={(e) => setNomeAluno(e.target.value)}
                    className="pl-10 h-12"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="serie" className="text-sm font-medium">
                  Sua Série
                </Label>
                <div className="relative">
                  <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 z-10" />
                  <Select value={serieId} onValueChange={setSerieId} required>
                    <SelectTrigger className="pl-10 h-12">
                      <SelectValue placeholder="Selecione sua série" />
                    </SelectTrigger>
                    <SelectContent>
                      {series.map((serie) => (
                        <SelectItem key={serie.id} value={serie.id}>
                          {serie.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {series.length === 0 && codigoEscola && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {codigoEscola.length < 3 
                      ? "Digite pelo menos 3 caracteres do código" 
                      : "Nenhuma série encontrada para este código"}
                  </p>
                )}
                {series.length > 0 && (
                  <p className="text-sm text-emoteen-green mt-1">
                    ✓ {series.length} séries disponíveis
                  </p>
                )}
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 text-lg font-medium bg-primary hover:bg-primary/90"
                disabled={loading || !serieId}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Conectando...
                  </>
                ) : (
                  'Iniciar Avaliação'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Info Footer */}
        <div className="text-center text-sm text-muted-foreground bg-white/60 p-4 rounded-lg">
          <p>🔒 Suas informações são totalmente seguras e confidenciais</p>
        </div>
      </div>
    </div>
  );
};

export default Login;