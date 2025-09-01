import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Send, User, Calendar, CheckCircle, Clock } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
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
    carregarDados();
  }, []);

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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard Psicólogo</h1>
            <p className="text-muted-foreground">Gerencie relatórios e acompanhe avaliações</p>
          </div>
          <div className="flex gap-4">
            <Card className="p-4">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-emoteen-yellow" />
                <div>
                  <p className="text-sm font-medium">Pendentes</p>
                  <p className="text-2xl font-bold">{sessoesSemRelatorio.length}</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emoteen-green" />
                <div>
                  <p className="text-sm font-medium">Concluídos</p>
                  <p className="text-2xl font-bold">{sessoesComRelatorio.length}</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-emoteen-blue" />
                <div>
                  <p className="text-sm font-medium">Avaliações</p>
                  <p className="text-2xl font-bold">{avaliacoesAlunos.length}</p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        <Tabs defaultValue="relatorios" className="space-y-6">
          <TabsList>
            <TabsTrigger value="relatorios">Relatórios</TabsTrigger>
            <TabsTrigger value="avaliacoes">Avaliações dos Alunos</TabsTrigger>
          </TabsList>

          <TabsContent value="relatorios" className="space-y-6">
            {/* Sessões Pendentes de Relatório */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-emoteen-yellow" />
                  Sessões Pendentes de Relatório
                </CardTitle>
              </CardHeader>
              <CardContent>
                {sessoesSemRelatorio.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">Todos os relatórios foram enviados</p>
                ) : (
                  <div className="grid gap-4">
                    {sessoesSemRelatorio.map(sessao => (
                      <div key={sessao.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="space-y-2">
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-2">
                                <User className="w-4 h-4 text-muted-foreground" />
                                <span className="font-medium">{sessao.alunoNome}</span>
                              </div>
                              <Badge variant="outline">{sessao.escolaNome}</Badge>
                              <Badge className="bg-emoteen-yellow/20 text-emoteen-yellow border-emoteen-yellow/30">
                                PENDENTE
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {new Date(sessao.dataRealizacao).toLocaleDateString('pt-BR')}
                              </div>
                              {sessao.terapeutaNome && (
                                <span>Terapeuta: {sessao.terapeutaNome}</span>
                              )}
                            </div>
                          </div>
                          <Button onClick={() => abrirDialogRelatorio(sessao)} className="flex items-center gap-2">
                            <FileText className="w-4 h-4" />
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
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emoteen-green" />
                  Relatórios Enviados
                </CardTitle>
              </CardHeader>
              <CardContent>
                {sessoesComRelatorio.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">Nenhum relatório enviado ainda</p>
                ) : (
                  <div className="grid gap-4">
                    {sessoesComRelatorio.map(sessao => (
                      <div key={sessao.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="space-y-2">
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-2">
                                <User className="w-4 h-4 text-muted-foreground" />
                                <span className="font-medium">{sessao.alunoNome}</span>
                              </div>
                              <Badge variant="outline">{sessao.escolaNome}</Badge>
                              <Badge className="bg-emoteen-green/20 text-emoteen-green border-emoteen-green/30">
                                ENVIADO
                              </Badge>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              <strong>Diagnóstico:</strong> {sessao.relatorio?.diagnostico}
                            </div>
                          </div>
                          <Button variant="outline" onClick={() => abrirDialogRelatorio(sessao)}>
                            <FileText className="w-4 h-4 mr-2" />
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
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5 text-emoteen-blue" />
                  Avaliações Pós-Sessão dos Alunos
                </CardTitle>
              </CardHeader>
              <CardContent>
                {avaliacoesAlunos.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">Nenhuma avaliação recebida ainda</p>
                ) : (
                  <div className="grid gap-4">
                    {avaliacoesAlunos.map(avaliacao => (
                      <div key={avaliacao.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                        <div className="space-y-3">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4 text-muted-foreground" />
                              <span className="font-medium">{avaliacao.alunoNome}</span>
                            </div>
                            <Badge variant="outline">{avaliacao.escolaNome}</Badge>
                            <Badge className={getAvaliacaoColor(avaliacao.avaliacao)}>
                              {getAvaliacaoTexto(avaliacao.avaliacao)}
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            <Calendar className="w-4 h-4 inline mr-1" />
                            {new Date(avaliacao.dataAvaliacao).toLocaleDateString('pt-BR')}
                          </div>
                          {avaliacao.comentarios && (
                            <div className="text-sm">
                              <strong>Comentários:</strong> {avaliacao.comentarios}
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
        <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {sessaoSelecionada?.status === 'relatorio_enviado' ? 'Visualizar Relatório' : 'Criar Relatório'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {sessaoSelecionada && (
              <div className="space-y-2 p-4 bg-muted rounded-lg">
                <p><strong>Aluno:</strong> {sessaoSelecionada.alunoNome}</p>
                <p><strong>Escola:</strong> {sessaoSelecionada.escolaNome}</p>
                <p><strong>Data da Sessão:</strong> {new Date(sessaoSelecionada.dataRealizacao).toLocaleDateString('pt-BR')}</p>
                {sessaoSelecionada.terapeutaNome && (
                  <p><strong>Terapeuta:</strong> {sessaoSelecionada.terapeutaNome}</p>
                )}
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="diagnostico">Diagnóstico/Avaliação *</Label>
              <Textarea
                id="diagnostico"
                value={relatorioForm.diagnostico}
                onChange={(e) => setRelatorioForm(prev => ({ ...prev, diagnostico: e.target.value }))}
                placeholder="Descrição do diagnóstico ou avaliação do caso..."
                rows={4}
                disabled={sessaoSelecionada?.status === 'relatorio_enviado'}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="recomendacoes">Recomendações *</Label>
              <Textarea
                id="recomendacoes"
                value={relatorioForm.recomendacoes}
                onChange={(e) => setRelatorioForm(prev => ({ ...prev, recomendacoes: e.target.value }))}
                placeholder="Recomendações para a escola e família..."
                rows={4}
                disabled={sessaoSelecionada?.status === 'relatorio_enviado'}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="proximosPassos">Próximos Passos</Label>
              <Textarea
                id="proximosPassos"
                value={relatorioForm.proximosPassos}
                onChange={(e) => setRelatorioForm(prev => ({ ...prev, proximosPassos: e.target.value }))}
                placeholder="Próximos passos no tratamento..."
                rows={3}
                disabled={sessaoSelecionada?.status === 'relatorio_enviado'}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="observacoes">Observações Adicionais</Label>
              <Textarea
                id="observacoes"
                value={relatorioForm.observacoes}
                onChange={(e) => setRelatorioForm(prev => ({ ...prev, observacoes: e.target.value }))}
                placeholder="Observações adicionais sobre a sessão..."
                rows={3}
                disabled={sessaoSelecionada?.status === 'relatorio_enviado'}
              />
            </div>

            <div className="flex gap-2">
              {sessaoSelecionada?.status !== 'relatorio_enviado' && (
                <Button onClick={enviarRelatorio} className="flex-1 flex items-center gap-2">
                  <Send className="w-4 h-4" />
                  Enviar Relatório para Escola
                </Button>
              )}
              <Button variant="outline" onClick={() => setDialogRelatorio(false)}>
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