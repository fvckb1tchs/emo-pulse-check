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
  Filter,
  LogOut,
  CheckCircle,
  AlertTriangle,
  AlertCircle,
  CalendarPlus,
  Plus,
  Trash2,
  Settings
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

interface RespostaQuiz {
  id: string;
  aluno_nome: string;
  data_envio: string;
  resultado: 'verde' | 'amarelo' | 'vermelho';
  pontuacao: number;
  encaminhado: boolean;
  respostas: number[];
  serie_id?: string;
}

interface Serie {
  id: string;
  nome: string;
  ativa: boolean;
  escola_id: string;
}

const Dashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [respostas, setRespostas] = useState<RespostaQuiz[]>([]);
  const [series, setSeries] = useState<Serie[]>([]);
  const [filtroResultado, setFiltroResultado] = useState<string>("todos");
  const [filtroSerie, setFiltroSerie] = useState<string>("todas");
  const [loading, setLoading] = useState(false);
  const [escola, setEscola] = useState<string>("");
  const [escolaId, setEscolaId] = useState<string>("");
  const [agendandoSessao, setAgendandoSessao] = useState<string | null>(null);
  const [novaSerie, setNovaSerie] = useState("");
  const { toast } = useToast();
  const [totalAlunos, setTotalAlunos] = useState(0);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: escolaData, error } = await supabase
        .from('escolas')
        .select('*')
        .eq('email_admin', email)
        .maybeSingle();

      if (error || !escolaData) {
        toast({
          title: "Credenciais inválidas",
          description: "Email ou senha incorretos.",
          variant: "destructive"
        });
        return;
      }

      if (escolaData.senha_admin !== senha) {
        toast({
          title: "Senha incorreta",
          description: "Verifique sua senha e tente novamente.",
          variant: "destructive"
        });
        return;
      }

      setIsAuthenticated(true);
      setEscola(escolaData.nome);
      setEscolaId(escolaData.id);
      sessionStorage.setItem('adminAuthenticated', 'true');
      sessionStorage.setItem('escolaAdminId', escolaData.id);
      toast({
        title: "Acesso autorizado!",
        description: `Bem-vindo ao dashboard de ${escolaData.nome}`,
      });

      // Carregar dados
      loadRespostas(escolaData.id);
      loadSeries(escolaData.id);
      const { count } = await supabase
        .from('consentimento_responsavel')
        .select('*', { count: 'exact', head: true })
        .eq('escola_id', escolaData.id)
        .eq('ativo', true);
      setTotalAlunos(count || 0);
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
        .select(`
          *,
          series (nome)
        `)
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

  const loadSeries = async (escolaId: string) => {
    try {
      const { data, error } = await supabase
        .from('series')
        .select('*')
        .eq('escola_id', escolaId)
        .order('nome');

      if (error) throw error;
      setSeries((data || []) as Serie[]);
    } catch (error) {
      console.error('Erro ao carregar séries:', error);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('adminAuthenticated');
    sessionStorage.removeItem('escolaAdminId');
    setRespostas([]);
    setSeries([]);
    setEmail("");
    setSenha("");
  };

  const handleAgendarSessao = async (resposta: RespostaQuiz) => {
    setAgendandoSessao(resposta.id);
    
    try {
      const { data, error } = await supabase.functions.invoke('agendar-sessao', {
        body: {
          alunoNome: resposta.aluno_nome,
          escolaNome: escola || 'Escola não identificada',
          resultado: resposta.resultado,
          pontuacao: resposta.pontuacao,
          dataEnvio: resposta.data_envio
        }
      });

      if (error) throw error;

      toast({
        title: "Sessão agendada! 📅",
        description: `Solicitação enviada para EmoTeen. O aluno ${resposta.aluno_nome} receberá contato em breve.`,
      });
    } catch (error) {
      console.error('Erro ao agendar sessão:', error);
      toast({
        title: "Erro ao agendar",
        description: "Não foi possível agendar a sessão. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setAgendandoSessao(null);
    }
  };

  const handleAdicionarSerie = async () => {
    if (!novaSerie.trim()) return;

    try {
      const { error } = await supabase
        .from('series')
        .insert({
          escola_id: escolaId,
          nome: novaSerie.trim(),
          ativa: true
        });

      if (error) throw error;

      setNovaSerie("");
      loadSeries(escolaId);
      toast({
        title: "Série adicionada! ✅",
        description: `A série "${novaSerie}" foi criada com sucesso.`,
      });
    } catch (error) {
      console.error('Erro ao adicionar série:', error);
      toast({
        title: "Erro",
        description: "Não foi possível adicionar a série.",
        variant: "destructive"
      });
    }
  };

  const handleToggleSerie = async (serieId: string, ativa: boolean) => {
    try {
      const { error } = await supabase
        .from('series')
        .update({ ativa: !ativa })
        .eq('id', serieId);

      if (error) throw error;

      loadSeries(escolaId);
      toast({
        title: ativa ? "Série desativada" : "Série ativada",
        description: "Status da série atualizado com sucesso.",
      });
    } catch (error) {
      console.error('Erro ao atualizar série:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a série.",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    const isAuth = sessionStorage.getItem('adminAuthenticated');
    const escolaId = sessionStorage.getItem('escolaAdminId');
    if (isAuth && escolaId) {
      setIsAuthenticated(true);
      setEscolaId(escolaId);
      // Carregar dados da escola específica
      loadRespostas(escolaId);
      loadSeries(escolaId);

      // Buscar dados da escola para o nome
      supabase
        .from('escolas')
        .select('nome')
        .eq('id', escolaId)
        .single()
        .then(({ data }) => {
          if (data) setEscola(data.nome);
        });

      // Contar alunos com consentimento ativo
      supabase
        .from('consentimento_responsavel')
        .select('*', { count: 'exact', head: true })
        .eq('escola_id', escolaId)
        .eq('ativo', true)
        .then(({ count }) => setTotalAlunos(count || 0));
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

  const respostasFiltradas = respostas.filter(resposta => {
    const filtroRes = filtroResultado === "todos" || resposta.resultado === filtroResultado;
    const filtroSer = filtroSerie === "todas" || resposta.serie_id === filtroSerie;
    return filtroRes && filtroSer;
  });

  const stats = {
    total: respostas.length,
    verde: respostas.filter(r => r.resultado === 'verde').length,
    amarelo: respostas.filter(r => r.resultado === 'amarelo').length,
    vermelho: respostas.filter(r => r.resultado === 'vermelho').length,
    encaminhados: respostas.filter(r => r.encaminhado).length
  };

  const getSerieNome = (serieId?: string) => {
    if (!serieId) return 'Série não informada';
    const serie = series.find(s => s.id === serieId);
    return serie ? serie.nome : 'Série não encontrada';
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
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <EmoTeenLogo size="md" />
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">Dashboard EmoTeen</h1>
              <p className="text-muted-foreground">{escola}</p>
            </div>
          </div>
          <Button variant="outline" onClick={handleLogout} className="w-full md:w-auto">
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </Button>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="flex w-full gap-2 flex-wrap">
            <TabsTrigger value="dashboard" className="text-xs sm:text-sm py-2">Dashboard</TabsTrigger>
            <TabsTrigger value="respostas" className="text-xs sm:text-sm py-2">Respostas dos Alunos</TabsTrigger>
            <TabsTrigger value="series" className="text-xs sm:text-sm py-2">Gerenciar Séries</TabsTrigger>
          </TabsList>

    <TabsContent value="dashboard" className="space-y-6">
  {/* Cards */}
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
    <Card>
      <CardContent className="p-4 md:p-6">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 md:w-5 md:h-5 text-primary" />
          <div>
            <p className="text-xs md:text-sm text-muted-foreground">Alunos</p>
            <p className="text-lg md:text-2xl font-bold">{totalAlunos}</p>
          </div>
        </div>
      </CardContent>
    </Card>
    <Card>
      <CardContent className="p-4 md:p-6">
        <div className="flex items-center gap-2">
          <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-emoteen-green" />
          <div>
            <p className="text-xs md:text-sm text-muted-foreground">Verde</p>
            <p className="text-lg md:text-2xl font-bold">{stats.verde}</p>
          </div>
        </div>
      </CardContent>
    </Card>
    <Card>
      <CardContent className="p-4 md:p-6">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 md:w-5 md:h-5 text-emoteen-yellow" />
          <div>
            <p className="text-xs md:text-sm text-muted-foreground">Amarelo</p>
            <p className="text-lg md:text-2xl font-bold">{stats.amarelo}</p>
          </div>
        </div>
      </CardContent>
    </Card>
    <Card>
      <CardContent className="p-4 md:p-6">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4 md:w-5 md:h-5 text-emoteen-red" />
          <div>
            <p className="text-xs md:text-sm text-muted-foreground">Vermelho</p>
            <p className="text-lg md:text-2xl font-bold">{stats.vermelho}</p>
          </div>
        </div>
      </CardContent>
    </Card>
    <Card>
      <CardContent className="p-4 md:p-6">
        <div className="flex items-center gap-2">
          <CalendarPlus className="w-4 h-4 md:w-5 md:h-5 text-primary" />
          <div>
            <p className="text-xs md:text-sm text-muted-foreground">Encaminhados</p>
            <p className="text-lg md:text-2xl font-bold">{stats.encaminhados}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</TabsContent>

          <TabsContent value="respostas" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <CardTitle className="flex items-center gap-2">
                    <Filter className="w-5 h-5" />
                    Respostas dos Alunos
                  </CardTitle>
                  <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                    <Select value={filtroSerie} onValueChange={setFiltroSerie}>
                      <SelectTrigger className="w-full sm:w-48">
                        <SelectValue placeholder="Filtrar por série" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todas">Todas as séries</SelectItem>
                        {series.filter(s => s.ativa).map((serie) => (
                          <SelectItem key={serie.id} value={serie.id}>
                            {serie.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select value={filtroResultado} onValueChange={setFiltroResultado}>
                      <SelectTrigger className="w-full sm:w-48">
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
                      <div key={resposta.id} className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors gap-4">
                        <div className="flex items-center gap-4 flex-1">
                          <div className="flex-1">
                            <p className="font-medium">{resposta.aluno_nome}</p>
                            <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                              <Calendar className="w-3 h-3" />
                              {new Date(resposta.data_envio).toLocaleDateString('pt-BR')}
                              <span className="hidden sm:inline">•</span>
                              <span className="block sm:inline">{getSerieNome(resposta.serie_id)}</span>
                              <span className="hidden sm:inline">•</span>
                              <span className="block sm:inline">{resposta.pontuacao} pontos</span>
                              {resposta.encaminhado && (
                                <>
                                  <span className="hidden sm:inline">•</span>
                                  <span className="text-primary block sm:inline">Encaminhado</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full md:w-auto">
                          {getResultadoBadge(resposta.resultado)}
                          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm" className="w-full sm:w-auto">
                                  <Eye className="w-4 h-4 mr-1" />
                                  <span className="hidden sm:inline">Ver Detalhes</span>
                                  <span className="sm:hidden">Detalhes</span>
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
        <p className="text-sm text-muted-foreground">Série</p>
        <p className="font-medium">{getSerieNome(resposta.serie_id)}</p>
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
      <div className="grid grid-cols-7 gap-2">
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
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() => handleAgendarSessao(resposta)}
                              disabled={agendandoSessao === resposta.id}
                              className="flex items-center gap-1 w-full sm:w-auto"
                            >
                              <CalendarPlus className="w-4 h-4" />
                              <span className="hidden sm:inline">
                                {agendandoSessao === resposta.id ? 'Agendando...' : 'Agendar Sessão'}
                              </span>
                              <span className="sm:hidden">
                                {agendandoSessao === resposta.id ? 'Agendando...' : 'Agendar'}
                              </span>
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="series" className="space-y-6">
            {/* Adicionar Nova Série */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Adicionar Nova Série
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Input
                    placeholder="Digite o nome da série (ex: 1º Ano, 2º Médio)"
                    value={novaSerie}
                    onChange={(e) => setNovaSerie(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAdicionarSerie()}
                    className="flex-1"
                  />
                  <Button onClick={handleAdicionarSerie} disabled={!novaSerie.trim()} className="w-full sm:w-auto">
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Lista de Séries */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Séries Cadastradas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {series.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">Nenhuma série cadastrada.</p>
                    </div>
                   ) : (
                     series.map((serie) => (
                       <div key={serie.id} className="flex flex-col sm:flex Кабелна телевизия-row items-start sm:items-center justify-between p-4 border rounded-lg gap-4">
                         <div className="flex items-center gap-3 flex-1">
                           <div className="flex-1">
                             <p className="font-medium">{serie.nome}</p>
                             <p className="text-sm text-muted-foreground">
                               Status: {serie.ativa ? 'Ativa' : 'Inativa'}
                             </p>
                           </div>
                           {serie.ativa && (
                             <Badge variant="outline" className="text-emoteen-green border-emoteen-green">
                               Ativa
                             </Badge>
                           )}
                         </div>
                         <Button
                           variant={serie.ativa ? "destructive" : "default"}
                           size="sm"
                           onClick={() => handleToggleSerie(serie.id, serie.ativa)}
                           className="w-full sm:w-auto"
                         >
                           {serie.ativa ? 'Desativar' : 'Ativar'}
                         </Button>
                       </div>
                     ))
                   )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
