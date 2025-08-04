import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import EmoTeenLogo from "@/components/EmoTeenLogo";
import { 
  Eye, 
  Calendar, 
  Users, 
  TrendingUp, 
  Filter,
  LogOut,
  CheckCircle,
  AlertTriangle,
  AlertCircle
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface RespostaQuiz {
  id: string;
  aluno_nome: string;
  data_envio: string;
  resultado: 'verde' | 'amarelo' | 'vermelho';
  pontuacao: number;
  encaminhado: boolean;
  respostas: number[];
}

const Dashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [respostas, setRespostas] = useState<RespostaQuiz[]>([]);
  const [filtroResultado, setFiltroResultado] = useState<string>("todos");
  const [loading, setLoading] = useState(false);
  const [escola, setEscola] = useState<string>("");
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: escolaData, error } = await supabase
        .from('escolas')
        .select('*')
        .eq('email_admin', email)
        .single();

      if (error || !escolaData) {
        toast({
          title: "Credenciais inválidas",
          description: "Email ou senha incorretos.",
          variant: "destructive"
        });
        return;
      }

      // Verificar senha (simplificado para demo - em produção usar bcrypt)
      if (senha === 'password') {
        setIsAuthenticated(true);
        setEscola(escolaData.nome);
        sessionStorage.setItem('adminAuthenticated', 'true');
        sessionStorage.setItem('escolaAdminId', escolaData.id);
        toast({
          title: "Acesso autorizado! 🎉",
          description: `Bem-vindo ao dashboard de ${escolaData.nome}`,
        });
        loadRespostas(escolaData.id);
      } else {
        toast({
          title: "Senha incorreta",
          description: "Verifique sua senha e tente novamente.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Erro no login:', error);
      toast({
        title: "Erro de conexão",
        description: "Não foi possível conectar. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const loadRespostas = async (escolaId: string) => {
    try {
      const { data, error } = await supabase
        .from('respostas_quiz')
        .select('*')
        .eq('escola_id', escolaId)
        .order('data_envio', { ascending: false });

      if (error) throw error;
      setRespostas((data || []) as RespostaQuiz[]);
    } catch (error) {
      console.error('Erro ao carregar respostas:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os dados.",
        variant: "destructive"
      });
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('adminAuthenticated');
    sessionStorage.removeItem('escolaAdminId');
    setRespostas([]);
    setEmail("");
    setSenha("");
  };

  useEffect(() => {
    const isAuth = sessionStorage.getItem('adminAuthenticated');
    const escolaId = sessionStorage.getItem('escolaAdminId');
    if (isAuth && escolaId) {
      setIsAuthenticated(true);
      loadRespostas(escolaId);
    }
  }, []);

  const getResultadoBadge = (resultado: string) => {
    switch (resultado) {
      case 'verde':
        return <Badge className="bg-emoteen-green text-white"><CheckCircle className="w-3 h-3 mr-1" />Verde</Badge>;
      case 'amarelo':
        return <Badge className="bg-emoteen-yellow text-white"><AlertTriangle className="w-3 h-3 mr-1" />Amarelo</Badge>;
      case 'vermelho':
        return <Badge className="bg-emoteen-red text-white"><AlertCircle className="w-3 h-3 mr-1" />Vermelho</Badge>;
      default:
        return <Badge variant="secondary">{resultado}</Badge>;
    }
  };

  const respostasFiltradas = respostas.filter(resposta => 
    filtroResultado === "todos" || resposta.resultado === filtroResultado
  );

  const stats = {
    total: respostas.length,
    verde: respostas.filter(r => r.resultado === 'verde').length,
    amarelo: respostas.filter(r => r.resultado === 'amarelo').length,
    vermelho: respostas.filter(r => r.resultado === 'vermelho').length,
    encaminhados: respostas.filter(r => r.encaminhado).length
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="text-center">
            <EmoTeenLogo size="md" className="mx-auto mb-4" />
            <CardTitle className="text-2xl">Dashboard da Escola</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="email">Email do Administrador</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@escola.com"
                  required
                />
              </div>
              <div>
                <Label htmlFor="senha">Senha</Label>
                <Input
                  id="senha"
                  type="password"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="Digite sua senha"
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Entrando..." : "Entrar"}
              </Button>
            </form>
            <div className="mt-4 text-xs text-muted-foreground text-center">
              <p>Para teste, use: <strong>admin@escolaexemplo.com</strong> / <strong>password</strong></p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <EmoTeenLogo size="md" />
            <div>
              <h1 className="text-3xl font-bold text-foreground">Dashboard EmoTeen</h1>
              <p className="text-muted-foreground">{escola}</p>
            </div>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emoteen-green" />
                <div>
                  <p className="text-sm text-muted-foreground">Verde</p>
                  <p className="text-2xl font-bold text-emoteen-green">{stats.verde}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-emoteen-yellow" />
                <div>
                  <p className="text-sm text-muted-foreground">Amarelo</p>
                  <p className="text-2xl font-bold text-emoteen-yellow">{stats.amarelo}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-emoteen-red" />
                <div>
                  <p className="text-sm text-muted-foreground">Vermelho</p>
                  <p className="text-2xl font-bold text-emoteen-red">{stats.vermelho}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Encaminhados</p>
                  <p className="text-2xl font-bold">{stats.encaminhados}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Respostas dos Alunos
              </CardTitle>
              <Select value={filtroResultado} onValueChange={setFiltroResultado}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filtrar por resultado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os resultados</SelectItem>
                  <SelectItem value="verde">Verde</SelectItem>
                  <SelectItem value="amarelo">Amarelo</SelectItem>
                  <SelectItem value="vermelho">Vermelho</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {respostasFiltradas.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Nenhuma resposta encontrada.</p>
                </div>
              ) : (
                respostasFiltradas.map((resposta) => (
                  <div key={resposta.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="font-medium">{resposta.aluno_nome}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="w-3 h-3" />
                          {new Date(resposta.data_envio).toLocaleDateString('pt-BR')}
                          <span>•</span>
                          <span>{resposta.pontuacao} pontos</span>
                          {resposta.encaminhado && (
                            <>
                              <span>•</span>
                              <span className="text-primary">Encaminhado</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {getResultadoBadge(resposta.resultado)}
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-1" />
                            Ver Detalhes
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Detalhes da Avaliação - {resposta.aluno_nome}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-sm text-muted-foreground">Data</p>
                                <p className="font-medium">{new Date(resposta.data_envio).toLocaleDateString('pt-BR')}</p>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">Resultado</p>
                                <div className="mt-1">{getResultadoBadge(resposta.resultado)}</div>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">Pontuação</p>
                                <p className="font-medium">{resposta.pontuacao} pontos</p>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">Status</p>
                                <p className="font-medium">{resposta.encaminhado ? 'Encaminhado' : 'Não encaminhado'}</p>
                              </div>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground mb-2">Respostas individuais</p>
                              <div className="grid grid-cols-5 gap-2">
                                {resposta.respostas.map((resp, index) => (
                                  <div key={index} className="text-center p-2 bg-muted rounded">
                                    <p className="text-xs text-muted-foreground">Q{index + 1}</p>
                                    <p className="font-bold">{resp}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;