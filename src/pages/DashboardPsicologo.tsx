import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Send, User, Calendar, CheckCircle, Clock, LogOut, ArrowLeft, Plus, AlertCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { DEMO_MODE } from "@/config";
import { supabase } from "@/integrations/supabase/client";

interface SessaoAgendada {
  id: string;
  escola_nome: string;
  aluno_nome: string;
  data_encaminhamento: string;
  resultado: 'verde' | 'amarelo' | 'vermelho';
  pontuacao: number;
  status: 'pendente' | 'agendada' | 'realizada';
  link_sessao?: string;
  observacoes?: string;
  data_agendada?: string;
  data_realizacao?: string;
  terapeuta_nome?: string;
}

interface RelatorioSessao {
  id: string;
  sessao_id: string;
  diagnostico: string;
  recomendacoes: string;
  proximos_passos?: string;
  observacoes?: string;
  status: 'rascunho' | 'enviado';
}

interface AvaliacaoAluno {
  id: string;
  sessao_id: string;
  aluno_nome: string;
  escola_nome: string;
  avaliacao: 'bem' | 'melhor' | 'nada_bem';
  comentarios?: string;
  created_at: string;
}

const DashboardPsicologo = () => {
  const navigate = useNavigate();
  const [sessoesPendentes, setSessoesPendentes] = useState<SessaoAgendada[]>([]);
  const [sessoesAgendadas, setSessoesAgendadas] = useState<SessaoAgendada[]>([]);
  const [sessoesRealizadas, setSessoesRealizadas] = useState<SessaoAgendada[]>([]);
  const [avaliacoesAlunos, setAvaliacoesAlunos] = useState<AvaliacaoAluno[]>([]);
  const [dialogAgendamento, setDialogAgendamento] = useState(false);
  const [dialogRelatorio, setDialogRelatorio] = useState(false);
  const [sessaoSelecionada, setSessaoSelecionada] = useState<SessaoAgendada | null>(null);
  const [linkSessao, setLinkSessao] = useState("");
  const [observacoesSessao, setObservacoesSessao] = useState("");
  const [relatorioForm, setRelatorioForm] = useState({
    diagnostico: "",
    recomendacoes: "",
    proximosPassos: "",
    observacoes: ""
  });

  useEffect(() => {
    verificarAutenticacao();
    carregarDados();
  }, []);

  const verificarAutenticacao = () => {
    if (DEMO_MODE) {
      const isLoggedIn = sessionStorage.getItem('psicologo_loggedIn');
      if (!isLoggedIn) {
        navigate('/login-profissional');
        return;
      }
    }
  };

  const logout = () => {
    if (DEMO_MODE) {
      sessionStorage.removeItem('psicologo_loggedIn');
      navigate('/');
    }
  };

  const carregarDados = async () => {
    if (DEMO_MODE) {
      const sessoesPend: SessaoAgendada[] = [
        {
          id: "1",
          escola_nome: "Colégio Ensino",
          aluno_nome: "Maria Silva",
          data_encaminhamento: new Date().toISOString(),
          resultado: "vermelho",
          pontuacao: 85,
          status: "pendente"
        }
      ];

      const sessoesAg: SessaoAgendada[] = [
        {
          id: "2",
          escola_nome: "Escola Exemplo", 
          aluno_nome: "João Santos",
          data_encaminhamento: new Date(Date.now() - 86400000).toISOString(),
          resultado: "amarelo",
          pontuacao: 65,
          status: "agendada",
          link_sessao: "https://meet.google.com/abc-defg-hij",
          data_agendada: new Date(Date.now() + 86400000).toISOString()
        }
      ];

      const sessoesReal: SessaoAgendada[] = [
        {
          id: "3",
          escola_nome: "Escola Demo",
          aluno_nome: "Pedro Santos",
          data_encaminhamento: new Date(Date.now() - 172800000).toISOString(),
          resultado: "amarelo",
          pontuacao: 55,
          status: "realizada",
          data_realizacao: new Date(Date.now() - 86400000).toISOString(),
          terapeuta_nome: "Dr. João Psicólogo"
        }
      ];

      const avaliacoes: AvaliacaoAluno[] = [
        {
          id: "1",
          aluno_nome: "Pedro Santos",
          escola_nome: "Escola Demo",
          sessao_id: "3", 
          avaliacao: "melhor",
          comentarios: "Me senti mais calmo após a conversa",
          created_at: new Date(Date.now() - 43200000).toISOString()
        }
      ];

      setSessoesPendentes(sessoesPend);
      setSessoesAgendadas(sessoesAg);
      setSessoesRealizadas(sessoesReal);
      setAvaliacoesAlunos(avaliacoes);
      return;
    }

    try {
      // Carregar sessões
      const { data: sessoes, error: sessoesError } = await supabase
        .from('sessoes_agendadas')
        .select('*')
        .order('created_at', { ascending: false });

      if (sessoesError) throw sessoesError;

      const sessoesList = sessoes || [];
      setSessoesPendentes(sessoesList.filter(s => s.status === 'pendente') as SessaoAgendada[]);
      setSessoesAgendadas(sessoesList.filter(s => s.status === 'agendada') as SessaoAgendada[]);
      setSessoesRealizadas(sessoesList.filter(s => s.status === 'realizada') as SessaoAgendada[]);

      // Carregar avaliações
      const { data: avaliacoes, error: avaliacoesError } = await supabase
        .from('avaliacoes_pos_sessao')
        .select('*')
        .order('created_at', { ascending: false });

      if (avaliacoesError) throw avaliacoesError;
      setAvaliacoesAlunos((avaliacoes || []) as AvaliacaoAluno[]);

    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast.error("Erro ao carregar dados do dashboard");
    }
  };

  const abrirDialogAgendamento = (sessao: SessaoAgendada) => {
    setSessaoSelecionada(sessao);
    setLinkSessao(sessao.link_sessao || "");
    setObservacoesSessao(sessao.observacoes || "");
    setDialogAgendamento(true);
  };

  const abrirDialogRelatorio = (sessao: SessaoAgendada) => {
    setSessaoSelecionada(sessao);
    setRelatorioForm({
      diagnostico: "",
      recomendacoes: "",
      proximosPassos: "",
      observacoes: ""
    });
    setDialogRelatorio(true);
  };

  const salvarAgendamento = async () => {
    if (!sessaoSelecionada || !linkSessao.trim()) {
      toast.error("Por favor, preencha o link da sessão");
      return;
    }

    try {
      if (DEMO_MODE) {
        const sessoesAtualizadas = sessoesAgendadas.map(sessao => 
          sessao.id === sessaoSelecionada.id 
            ? { 
                ...sessao, 
                status: 'agendada' as const, 
                link_sessao: linkSessao,
                observacoes: observacoesSessao,
                data_agendada: new Date().toISOString()
              }
            : sessao
        );
        setSessoesAgendadas(sessoesAtualizadas);
        
        // Remover da lista de pendentes
        setSessoesPendentes(prev => prev.filter(s => s.id !== sessaoSelecionada.id));
        toast.success("Sessão agendada com sucesso!");
      } else {
        const { error } = await supabase
          .from('sessoes_agendadas')
          .update({
            status: 'agendada',
            link_sessao: linkSessao,
            observacoes: observacoesSessao,
            data_agendada: new Date().toISOString()
          })
          .eq('id', sessaoSelecionada.id);

        if (error) throw error;
        toast.success("Sessão agendada com sucesso!");
        carregarDados();
      }
    } catch (error) {
      console.error('Erro ao agendar sessão:', error);
      toast.error("Erro ao agendar sessão");
    }

    setDialogAgendamento(false);
    setLinkSessao("");
    setObservacoesSessao("");
  };

  const marcarComoRealizada = async (sessaoId: string) => {
    try {
      if (DEMO_MODE) {
        const sessaoAtualizada = sessoesAgendadas.find(s => s.id === sessaoId);
        if (sessaoAtualizada) {
          setSessoesRealizadas(prev => [...prev, {
            ...sessaoAtualizada,
            status: 'realizada',
            data_realizacao: new Date().toISOString()
          }]);
          setSessoesAgendadas(prev => prev.filter(s => s.id !== sessaoId));
          toast.success("Sessão marcada como realizada");
        }
      } else {
        const { error } = await supabase
          .from('sessoes_agendadas')
          .update({
            status: 'realizada',
            data_realizacao: new Date().toISOString()
          })
          .eq('id', sessaoId);

        if (error) throw error;
        toast.success("Sessão marcada como realizada");
        carregarDados();
      }
    } catch (error) {
      console.error('Erro ao marcar como realizada:', error);
      toast.error("Erro ao atualizar sessão");
    }
  };

  const enviarRelatorio = async () => {
    if (!sessaoSelecionada || !relatorioForm.diagnostico.trim() || !relatorioForm.recomendacoes.trim()) {
      toast.error("Por favor, preencha os campos obrigatórios");
      return;
    }

    try {
      if (DEMO_MODE) {
        toast.success("Relatório enviado para a escola com sucesso!");
      } else {
        const { error } = await supabase
          .from('relatorios_sessao')
          .insert({
            sessao_id: sessaoSelecionada.id,
            diagnostico: relatorioForm.diagnostico,
            recomendacoes: relatorioForm.recomendacoes,
            proximos_passos: relatorioForm.proximosPassos,
            observacoes: relatorioForm.observacoes,
            status: 'enviado'
          });

        if (error) throw error;
        toast.success("Relatório enviado para a escola com sucesso!");
        carregarDados();
      }
    } catch (error) {
      console.error('Erro ao enviar relatório:', error);
      toast.error("Erro ao enviar relatório");
    }

    setDialogRelatorio(false);
    setSessaoSelecionada(null);
  };

  const getAvaliacaoColor = (avaliacao: string) => {
    switch (avaliacao) {
      case 'bem':
        return 'bg-emoteen-green/20 text-emoteen-green border-emoteen-green/30';
      case 'melhor':
        return 'bg-emoteen-blue/20 text-emoteen-blue border-emoteen-blue/30';
      case 'nada_bem':
        return 'bg-emoteen-red/20 text-emoteen-red border-emoteen-red/30';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getAvaliacaoTexto = (avaliacao: string) => {
    switch (avaliacao) {
      case 'bem':
        return 'BEM';
      case 'melhor':
        return 'MELHOR';
      case 'nada_bem':
        return 'NADA BEM';
      default:
        return '';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pendente':
        return 'bg-emoteen-yellow/20 text-emoteen-yellow border-emoteen-yellow/30';
      case 'agendada':
        return 'bg-emoteen-blue/20 text-emoteen-blue border-emoteen-blue/30';
      case 'realizada':
        return 'bg-emoteen-green/20 text-emoteen-green border-emoteen-green/30';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getResultadoColor = (resultado: string) => {
    switch (resultado) {
      case 'vermelho':
        return 'bg-emoteen-red/20 text-emoteen-red border-emoteen-red/30';
      case 'amarelo':
        return 'bg-emoteen-yellow/20 text-emoteen-yellow border-emoteen-yellow/30';
      case 'verde':
        return 'bg-emoteen-green/20 text-emoteen-green border-emoteen-green/30';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10 p-3 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate('/')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </Button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Dashboard Psicólogo</h1>
              <p className="text-sm text-muted-foreground">Gerencie relatórios e avaliações</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={logout}
              className="flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Sair
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 sm:gap-4">
          <Card className="p-3 sm:p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-emoteen-red" />
              <div>
                <p className="text-xs sm:text-sm font-medium">Pendentes</p>
                <p className="text-lg sm:text-2xl font-bold">{sessoesPendentes.length}</p>
              </div>
            </div>
          </Card>
          <Card className="p-3 sm:p-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-emoteen-blue" />
              <div>
                <p className="text-xs sm:text-sm font-medium">Agendadas</p>
                <p className="text-lg sm:text-2xl font-bold">{sessoesAgendadas.length}</p>
              </div>
            </div>
          </Card>
          <Card className="p-3 sm:p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-emoteen-green" />
              <div>
                <p className="text-xs sm:text-sm font-medium">Realizadas</p>
                <p className="text-lg sm:text-2xl font-bold">{sessoesRealizadas.length}</p>
              </div>
            </div>
          </Card>
          <Card className="p-3 sm:p-4">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 sm:w-5 sm:h-5 text-emoteen-blue" />
              <div>
                <p className="text-xs sm:text-sm font-medium">Avaliações</p>
                <p className="text-lg sm:text-2xl font-bold">{avaliacoesAlunos.length}</p>
              </div>
            </div>
          </Card>
        </div>

        <Tabs defaultValue="pendentes" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="pendentes" className="text-xs sm:text-sm">Pendentes</TabsTrigger>
            <TabsTrigger value="agendadas" className="text-xs sm:text-sm">Agendadas</TabsTrigger>
            <TabsTrigger value="realizadas" className="text-xs sm:text-sm">Realizadas</TabsTrigger>
            <TabsTrigger value="avaliacoes" className="text-xs sm:text-sm">Avaliações</TabsTrigger>
          </TabsList>

          <TabsContent value="pendentes" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <AlertCircle className="w-5 h-5 text-emoteen-red" />
                  Sessões Pendentes
                </CardTitle>
              </CardHeader>
              <CardContent>
                {sessoesPendentes.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">Nenhuma sessão pendente</p>
                ) : (
                  <div className="grid gap-3">
                    {sessoesPendentes.map(sessao => (
                      <div key={sessao.id} className="border rounded-lg p-3 sm:p-4 hover:bg-muted/50 transition-colors">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="space-y-2">
                            <div className="flex flex-wrap items-center gap-2">
                              <div className="flex items-center gap-2">
                                <User className="w-4 h-4 text-muted-foreground" />
                                <span className="font-medium text-sm sm:text-base">{sessao.aluno_nome}</span>
                              </div>
                              <Badge variant="outline" className="text-xs">{sessao.escola_nome}</Badge>
                              <Badge className={`${getResultadoColor(sessao.resultado)} text-xs`}>
                                {sessao.resultado?.toUpperCase()} ({sessao.pontuacao}pts)
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                              <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                              {new Date(sessao.data_encaminhamento).toLocaleDateString('pt-BR')}
                            </div>
                          </div>
                          <Button 
                            onClick={() => abrirDialogAgendamento(sessao)} 
                            size="sm"
                            className="flex items-center gap-2 text-xs sm:text-sm"
                          >
                            <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                            Agendar
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="agendadas" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Calendar className="w-5 h-5 text-emoteen-blue" />
                  Sessões Agendadas
                </CardTitle>
              </CardHeader>
              <CardContent>
                {sessoesAgendadas.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">Nenhuma sessão agendada</p>
                ) : (
                  <div className="grid gap-3">
                    {sessoesAgendadas.map(sessao => (
                      <div key={sessao.id} className="border rounded-lg p-3 sm:p-4 hover:bg-muted/50 transition-colors">
                        <div className="flex flex-col gap-3">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="space-y-2">
                              <div className="flex flex-wrap items-center gap-2">
                                <div className="flex items-center gap-2">
                                  <User className="w-4 h-4 text-muted-foreground" />
                                  <span className="font-medium text-sm sm:text-base">{sessao.aluno_nome}</span>
                                </div>
                                <Badge variant="outline" className="text-xs">{sessao.escola_nome}</Badge>
                                <Badge className={`${getResultadoColor(sessao.resultado)} text-xs`}>
                                  {sessao.resultado?.toUpperCase()} ({sessao.pontuacao}pts)
                                </Badge>
                              </div>
                              <div className="text-xs sm:text-sm text-muted-foreground">
                                <strong>Agendado para:</strong> {sessao.data_agendada ? new Date(sessao.data_agendada).toLocaleDateString('pt-BR') : 'Data não definida'}
                              </div>
                              {sessao.link_sessao && (
                                <div className="text-xs sm:text-sm text-emoteen-blue">
                                  <strong>Link:</strong> {sessao.link_sessao}
                                </div>
                              )}
                            </div>
                            <Button 
                              onClick={() => marcarComoRealizada(sessao.id)} 
                              size="sm"
                              className="flex items-center gap-2 text-xs sm:text-sm"
                            >
                              <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                              Realizada
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="realizadas" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <CheckCircle className="w-5 h-5 text-emoteen-green" />
                  Sessões Realizadas
                </CardTitle>
              </CardHeader>
              <CardContent>
                {sessoesRealizadas.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">Nenhuma sessão realizada ainda</p>
                ) : (
                  <div className="grid gap-3">
                    {sessoesRealizadas.map(sessao => (
                      <div key={sessao.id} className="border rounded-lg p-3 sm:p-4 hover:bg-muted/50 transition-colors">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="space-y-2">
                            <div className="flex flex-wrap items-center gap-2">
                              <div className="flex items-center gap-2">
                                <User className="w-4 h-4 text-muted-foreground" />
                                <span className="font-medium text-sm sm:text-base">{sessao.aluno_nome}</span>
                              </div>
                              <Badge variant="outline" className="text-xs">{sessao.escola_nome}</Badge>
                              <Badge className={`${getResultadoColor(sessao.resultado)} text-xs`}>
                                {sessao.resultado?.toUpperCase()} ({sessao.pontuacao}pts)
                              </Badge>
                            </div>
                            <div className="text-xs sm:text-sm text-muted-foreground">
                              <strong>Realizada em:</strong> {sessao.data_realizacao ? new Date(sessao.data_realizacao).toLocaleDateString('pt-BR') : 'Data não informada'}
                            </div>
                          </div>
                          <Button 
                            onClick={() => abrirDialogRelatorio(sessao)} 
                            size="sm"
                            className="flex items-center gap-2 text-xs sm:text-sm"
                          >
                            <FileText className="w-3 h-3 sm:w-4 sm:h-4" />
                            Enviar Relatório
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="avaliacoes" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <User className="w-5 h-5 text-emoteen-blue" />
                  Avaliações Pós-Sessão
                </CardTitle>
              </CardHeader>
              <CardContent>
                {avaliacoesAlunos.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">Nenhuma avaliação recebida ainda</p>
                ) : (
                  <div className="grid gap-3">
                    {avaliacoesAlunos.map(avaliacao => (
                      <div key={avaliacao.id} className="border rounded-lg p-3 sm:p-4 hover:bg-muted/50 transition-colors">
                        <div className="space-y-3">
                          <div className="flex flex-wrap items-center gap-2">
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4 text-muted-foreground" />
                              <span className="font-medium text-sm sm:text-base">{avaliacao.aluno_nome}</span>
                            </div>
                            <Badge variant="outline" className="text-xs">{avaliacao.escola_nome}</Badge>
                            <Badge className={`${getAvaliacaoColor(avaliacao.avaliacao)} text-xs`}>
                              {getAvaliacaoTexto(avaliacao.avaliacao)}
                            </Badge>
                          </div>
                          <div className="text-xs sm:text-sm text-muted-foreground">
                            <Calendar className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1" />
                            {new Date(avaliacao.created_at).toLocaleDateString('pt-BR')}
                          </div>
                          {avaliacao.comentarios && (
                            <div className="text-xs sm:text-sm">
                              <strong>Comentários:</strong> <span className="break-words">{avaliacao.comentarios}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Dialog de Agendamento */}
      <Dialog open={dialogAgendamento} onOpenChange={setDialogAgendamento}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg">Agendar Sessão</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {sessaoSelecionada && (
              <div className="space-y-2 p-3 bg-muted rounded-lg">
                <p className="text-sm"><strong>Aluno:</strong> {sessaoSelecionada.aluno_nome}</p>
                <p className="text-sm"><strong>Escola:</strong> {sessaoSelecionada.escola_nome}</p>
                <Badge className={`${getResultadoColor(sessaoSelecionada.resultado)} text-xs`}>
                  {sessaoSelecionada.resultado?.toUpperCase()} ({sessaoSelecionada.pontuacao}pts)
                </Badge>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="link" className="text-sm">Link da Sessão *</Label>
              <Input
                id="link"
                value={linkSessao}
                onChange={(e) => setLinkSessao(e.target.value)}
                placeholder="https://meet.google.com/..."
                className="text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="observacoes" className="text-sm">Observações</Label>
              <Textarea
                id="observacoes"
                value={observacoesSessao}
                onChange={(e) => setObservacoesSessao(e.target.value)}
                placeholder="Observações sobre a sessão..."
                rows={3}
                className="text-sm"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={salvarAgendamento} className="flex-1 text-sm">
                Confirmar
              </Button>
              <Button variant="outline" onClick={() => setDialogAgendamento(false)} className="text-sm">
                Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog de Relatório */}
      <Dialog open={dialogRelatorio} onOpenChange={setDialogRelatorio}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg">Criar Relatório</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {sessaoSelecionada && (
              <div className="space-y-2 p-3 bg-muted rounded-lg">
                <p className="text-sm"><strong>Aluno:</strong> {sessaoSelecionada.aluno_nome}</p>
                <p className="text-sm"><strong>Escola:</strong> {sessaoSelecionada.escola_nome}</p>
                <p className="text-sm"><strong>Data da Sessão:</strong> {sessaoSelecionada.data_realizacao ? new Date(sessaoSelecionada.data_realizacao).toLocaleDateString('pt-BR') : 'Não informada'}</p>
                <Badge className={`${getResultadoColor(sessaoSelecionada.resultado)} text-xs`}>
                  {sessaoSelecionada.resultado?.toUpperCase()} ({sessaoSelecionada.pontuacao}pts)
                </Badge>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="diagnostico" className="text-sm">Diagnóstico/Avaliação *</Label>
              <Textarea
                id="diagnostico"
                value={relatorioForm.diagnostico}
                onChange={(e) => setRelatorioForm(prev => ({ ...prev, diagnostico: e.target.value }))}
                placeholder="Descrição do diagnóstico ou avaliação do caso..."
                rows={4}
                disabled={false}
                className="text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="recomendacoes" className="text-sm">Recomendações *</Label>
              <Textarea
                id="recomendacoes"
                value={relatorioForm.recomendacoes}
                onChange={(e) => setRelatorioForm(prev => ({ ...prev, recomendacoes: e.target.value }))}
                placeholder="Recomendações para a escola e família..."
                rows={4}
                disabled={false}
                className="text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="proximosPassos" className="text-sm">Próximos Passos</Label>
              <Textarea
                id="proximosPassos"
                value={relatorioForm.proximosPassos}
                onChange={(e) => setRelatorioForm(prev => ({ ...prev, proximosPassos: e.target.value }))}
                placeholder="Próximos passos no tratamento..."
                rows={3}
                disabled={false}
                className="text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="observacoes" className="text-sm">Observações Adicionais</Label>
              <Textarea
                id="observacoes"
                value={relatorioForm.observacoes}
                onChange={(e) => setRelatorioForm(prev => ({ ...prev, observacoes: e.target.value }))}
                placeholder="Observações adicionais sobre a sessão..."
                rows={3}
                disabled={false}
                className="text-sm"
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={enviarRelatorio} className="flex-1 flex items-center gap-2 text-sm">
                <Send className="w-4 h-4" />
                Enviar Relatório
              </Button>
              <Button variant="outline" onClick={() => setDialogRelatorio(false)} className="text-sm">
                Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DashboardPsicologo;