import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Send, User, Calendar, CheckCircle, Clock, LogOut, ArrowLeft } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { DEMO_MODE } from "@/config";

interface SessaoRealizada {
  id: string;
  escolaNome: string;
  alunoNome: string;
  dataRealizacao: string;
  terapeutaNome?: string;
  status: 'sem_relatorio' | 'relatorio_enviado';
  relatorio?: {
    diagnostico: string;
    recomendacoes: string;
    proximosPassos: string;
    observacoes: string;
  };
}

interface AvaliacaoAluno {
  id: string;
  alunoNome: string;
  escolaNome: string;
  sessaoId: string;
  avaliacao: 'bem' | 'melhor' | 'nada_bem';
  comentarios?: string;
  dataAvaliacao: string;
}

const DashboardPsicologo = () => {
  const navigate = useNavigate();
  const [sessoesRealizadas, setSessoesRealizadas] = useState<SessaoRealizada[]>([]);
  const [avaliacoesAlunos, setAvaliacoesAlunos] = useState<AvaliacaoAluno[]>([]);
  const [dialogRelatorio, setDialogRelatorio] = useState(false);
  const [sessaoSelecionada, setSessaoSelecionada] = useState<SessaoRealizada | null>(null);
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

  const carregarDados = () => {
    if (DEMO_MODE) {
      const sessoes: SessaoRealizada[] = [
        {
          id: "1",
          escolaNome: "Colégio Ensino",
          alunoNome: "Maria Silva",
          dataRealizacao: new Date(Date.now() - 86400000).toISOString(),
          terapeutaNome: "Dr. João Terapeuta",
          status: "sem_relatorio"
        },
        {
          id: "2",
          escolaNome: "Escola Exemplo", 
          alunoNome: "Pedro Santos",
          dataRealizacao: new Date(Date.now() - 172800000).toISOString(),
          terapeutaNome: "Dra. Ana Terapeuta",
          status: "relatorio_enviado",
          relatorio: {
            diagnostico: "Ansiedade moderada relacionada ao desempenho escolar",
            recomendacoes: "Acompanhamento psicológico semanal por 3 meses",
            proximosPassos: "Técnicas de respiração e mindfulness",
            observacoes: "Aluno colaborativo durante a sessão"
          }
        }
      ];

      const avaliacoes: AvaliacaoAluno[] = [
        {
          id: "1",
          alunoNome: "Pedro Santos",
          escolaNome: "Escola Exemplo",
          sessaoId: "2", 
          avaliacao: "melhor",
          comentarios: "Me senti mais calmo após a conversa",
          dataAvaliacao: new Date(Date.now() - 86400000).toISOString()
        }
      ];

      setSessoesRealizadas(sessoes);
      setAvaliacoesAlunos(avaliacoes);
    }
  };

  const abrirDialogRelatorio = (sessao: SessaoRealizada) => {
    setSessaoSelecionada(sessao);
    if (sessao.relatorio) {
      setRelatorioForm(sessao.relatorio);
    } else {
      setRelatorioForm({
        diagnostico: "",
        recomendacoes: "",
        proximosPassos: "",
        observacoes: ""
      });
    }
    setDialogRelatorio(true);
  };

  const enviarRelatorio = () => {
    if (!sessaoSelecionada || !relatorioForm.diagnostico.trim() || !relatorioForm.recomendacoes.trim()) {
      toast.error("Por favor, preencha os campos obrigatórios");
      return;
    }

    if (DEMO_MODE) {
      const sessoesAtualizadas = sessoesRealizadas.map(sessao => 
        sessao.id === sessaoSelecionada.id 
          ? { 
              ...sessao, 
              status: 'relatorio_enviado' as const, 
              relatorio: relatorioForm 
            }
          : sessao
      );
      setSessoesRealizadas(sessoesAtualizadas);
      toast.success("Relatório enviado para a escola com sucesso!");
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

  const sessoesComRelatorio = sessoesRealizadas.filter(s => s.status === 'relatorio_enviado');
  const sessoesSemRelatorio = sessoesRealizadas.filter(s => s.status === 'sem_relatorio');

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
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <Card className="p-3 sm:p-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-emoteen-yellow" />
              <div>
                <p className="text-xs sm:text-sm font-medium">Pendentes</p>
                <p className="text-lg sm:text-2xl font-bold">{sessoesSemRelatorio.length}</p>
              </div>
            </div>
          </Card>
          <Card className="p-3 sm:p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-emoteen-green" />
              <div>
                <p className="text-xs sm:text-sm font-medium">Concluídos</p>
                <p className="text-lg sm:text-2xl font-bold">{sessoesComRelatorio.length}</p>
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

        <Tabs defaultValue="relatorios" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="relatorios" className="text-sm">Relatórios</TabsTrigger>
            <TabsTrigger value="avaliacoes" className="text-sm">Avaliações</TabsTrigger>
          </TabsList>

          <TabsContent value="relatorios" className="space-y-6">
            {/* Sessões Pendentes de Relatório */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Clock className="w-5 h-5 text-emoteen-yellow" />
                  Sessões Pendentes
                </CardTitle>
              </CardHeader>
              <CardContent>
                {sessoesSemRelatorio.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">Todos os relatórios foram enviados</p>
                ) : (
                  <div className="grid gap-3">
                    {sessoesSemRelatorio.map(sessao => (
                      <div key={sessao.id} className="border rounded-lg p-3 sm:p-4 hover:bg-muted/50 transition-colors">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="space-y-2">
                            <div className="flex flex-wrap items-center gap-2">
                              <div className="flex items-center gap-2">
                                <User className="w-4 h-4 text-muted-foreground" />
                                <span className="font-medium text-sm sm:text-base">{sessao.alunoNome}</span>
                              </div>
                              <Badge variant="outline" className="text-xs">{sessao.escolaNome}</Badge>
                              <Badge className="bg-emoteen-yellow/20 text-emoteen-yellow border-emoteen-yellow/30 text-xs">
                                PENDENTE
                              </Badge>
                            </div>
                            <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                                {new Date(sessao.dataRealizacao).toLocaleDateString('pt-BR')}
                              </div>
                              {sessao.terapeutaNome && (
                                <span>Terapeuta: {sessao.terapeutaNome}</span>
                              )}
                            </div>
                          </div>
                          <Button 
                            onClick={() => abrirDialogRelatorio(sessao)} 
                            size="sm"
                            className="flex items-center gap-2 text-xs sm:text-sm"
                          >
                            <FileText className="w-3 h-3 sm:w-4 sm:h-4" />
                            Criar Relatório
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Relatórios Enviados */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <CheckCircle className="w-5 h-5 text-emoteen-green" />
                  Relatórios Enviados
                </CardTitle>
              </CardHeader>
              <CardContent>
                {sessoesComRelatorio.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">Nenhum relatório enviado ainda</p>
                ) : (
                  <div className="grid gap-3">
                    {sessoesComRelatorio.map(sessao => (
                      <div key={sessao.id} className="border rounded-lg p-3 sm:p-4 hover:bg-muted/50 transition-colors">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="space-y-2">
                            <div className="flex flex-wrap items-center gap-2">
                              <div className="flex items-center gap-2">
                                <User className="w-4 h-4 text-muted-foreground" />
                                <span className="font-medium text-sm sm:text-base">{sessao.alunoNome}</span>
                              </div>
                              <Badge variant="outline" className="text-xs">{sessao.escolaNome}</Badge>
                              <Badge className="bg-emoteen-green/20 text-emoteen-green border-emoteen-green/30 text-xs">
                                ENVIADO
                              </Badge>
                            </div>
                            <div className="text-xs sm:text-sm text-muted-foreground">
                              <strong>Diagnóstico:</strong> <span className="break-words">{sessao.relatorio?.diagnostico}</span>
                            </div>
                          </div>
                          <Button 
                            variant="outline" 
                            onClick={() => abrirDialogRelatorio(sessao)}
                            size="sm"
                            className="text-xs sm:text-sm"
                          >
                            <FileText className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                            Ver Relatório
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
                              <span className="font-medium text-sm sm:text-base">{avaliacao.alunoNome}</span>
                            </div>
                            <Badge variant="outline" className="text-xs">{avaliacao.escolaNome}</Badge>
                            <Badge className={`${getAvaliacaoColor(avaliacao.avaliacao)} text-xs`}>
                              {getAvaliacaoTexto(avaliacao.avaliacao)}
                            </Badge>
                          </div>
                          <div className="text-xs sm:text-sm text-muted-foreground">
                            <Calendar className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1" />
                            {new Date(avaliacao.dataAvaliacao).toLocaleDateString('pt-BR')}
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

      {/* Dialog de Relatório */}
      <Dialog open={dialogRelatorio} onOpenChange={setDialogRelatorio}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg">
              {sessaoSelecionada?.status === 'relatorio_enviado' ? 'Visualizar Relatório' : 'Criar Relatório'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {sessaoSelecionada && (
              <div className="space-y-2 p-3 bg-muted rounded-lg">
                <p className="text-sm"><strong>Aluno:</strong> {sessaoSelecionada.alunoNome}</p>
                <p className="text-sm"><strong>Escola:</strong> {sessaoSelecionada.escolaNome}</p>
                <p className="text-sm"><strong>Data da Sessão:</strong> {new Date(sessaoSelecionada.dataRealizacao).toLocaleDateString('pt-BR')}</p>
                {sessaoSelecionada.terapeutaNome && (
                  <p className="text-sm"><strong>Terapeuta:</strong> {sessaoSelecionada.terapeutaNome}</p>
                )}
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
                disabled={sessaoSelecionada?.status === 'relatorio_enviado'}
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
                disabled={sessaoSelecionada?.status === 'relatorio_enviado'}
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
                disabled={sessaoSelecionada?.status === 'relatorio_enviado'}
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
                disabled={sessaoSelecionada?.status === 'relatorio_enviado'}
                className="text-sm"
              />
            </div>

            <div className="flex gap-2">
              {sessaoSelecionada?.status !== 'relatorio_enviado' && (
                <Button onClick={enviarRelatorio} className="flex-1 flex items-center gap-2 text-sm">
                  <Send className="w-4 h-4" />
                  Enviar Relatório
                </Button>
              )}
              <Button variant="outline" onClick={() => setDialogRelatorio(false)} className="text-sm">
                {sessaoSelecionada?.status === 'relatorio_enviado' ? 'Fechar' : 'Cancelar'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DashboardPsicologo;