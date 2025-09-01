import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User, CheckCircle, AlertCircle, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { DEMO_MODE } from "@/config";

interface SessaoAgendada {
  id: string;
  escolaNome: string;
  alunoNome: string;
  dataAgendada: string;
  status: 'pendente' | 'agendada' | 'realizada';
  resultado?: string;
  pontuacao?: number;
  linkSessao?: string;
  observacoes?: string;
}

const DashboardTerapeuta = () => {
  const [sessoes, setSessoes] = useState<SessaoAgendada[]>([]);
  const [dialogAberto, setDialogAberto] = useState(false);
  const [sessaoSelecionada, setSessaoSelecionada] = useState<SessaoAgendada | null>(null);
  const [linkSessao, setLinkSessao] = useState("");
  const [observacoes, setObservacoes] = useState("");

  useEffect(() => {
    carregarSessoes();
  }, []);

  const carregarSessoes = () => {
    if (DEMO_MODE) {
      const sessoesDemo: SessaoAgendada[] = [
        {
          id: "1",
          escolaNome: "Colégio Ensino",
          alunoNome: "Maria Silva",
          dataAgendada: new Date().toISOString(),
          status: "pendente",
          resultado: "vermelho",
          pontuacao: 85
        },
        {
          id: "2", 
          escolaNome: "Escola Exemplo",
          alunoNome: "João Santos",
          dataAgendada: new Date(Date.now() + 86400000).toISOString(),
          status: "agendada",
          resultado: "amarelo",
          pontuacao: 65,
          linkSessao: "https://meet.google.com/abc-defg-hij"
        }
      ];
      setSessoes(sessoesDemo);
    }
  };

  const agendarSessao = (sessao: SessaoAgendada) => {
    setSessaoSelecionada(sessao);
    setLinkSessao(sessao.linkSessao || "");
    setObservacoes(sessao.observacoes || "");
    setDialogAberto(true);
  };

  const salvarAgendamento = () => {
    if (!sessaoSelecionada || !linkSessao.trim()) {
      toast.error("Por favor, preencha o link da sessão");
      return;
    }

    if (DEMO_MODE) {
      const sessoesAtualizadas = sessoes.map(sessao => 
        sessao.id === sessaoSelecionada.id 
          ? { ...sessao, status: 'agendada' as const, linkSessao, observacoes }
          : sessao
      );
      setSessoes(sessoesAtualizadas);
      toast.success("Sessão agendada com sucesso! Link enviado para a escola.");
    }

    setDialogAberto(false);
    setSessaoSelecionada(null);
    setLinkSessao("");
    setObservacoes("");
  };

  const marcarComoRealizada = (id: string) => {
    if (DEMO_MODE) {
      const sessoesAtualizadas = sessoes.map(sessao => 
        sessao.id === id 
          ? { ...sessao, status: 'realizada' as const }
          : sessao
      );
      setSessoes(sessoesAtualizadas);
      toast.success("Sessão marcada como realizada");
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

  const sessoesPendentes = sessoes.filter(s => s.status === 'pendente');
  const sessoesAgendadas = sessoes.filter(s => s.status === 'agendada');
  const sessoesRealizadas = sessoes.filter(s => s.status === 'realizada');

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard Terapeuta</h1>
            <p className="text-muted-foreground">Gerencie suas sessões e atendimentos</p>
          </div>
          <div className="flex gap-4">
            <Card className="p-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-emoteen-red" />
                <div>
                  <p className="text-sm font-medium">Pendentes</p>
                  <p className="text-2xl font-bold">{sessoesPendentes.length}</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-emoteen-blue" />
                <div>
                  <p className="text-sm font-medium">Agendadas</p>
                  <p className="text-2xl font-bold">{sessoesAgendadas.length}</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emoteen-green" />
                <div>
                  <p className="text-sm font-medium">Realizadas</p>
                  <p className="text-2xl font-bold">{sessoesRealizadas.length}</p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Sessões Pendentes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-emoteen-red" />
              Sessões Pendentes de Agendamento
            </CardTitle>
          </CardHeader>
          <CardContent>
            {sessoesPendentes.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">Nenhuma sessão pendente</p>
            ) : (
              <div className="grid gap-4">
                {sessoesPendentes.map(sessao => (
                  <div key={sessao.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-muted-foreground" />
                            <span className="font-medium">{sessao.alunoNome}</span>
                          </div>
                          <Badge variant="outline">{sessao.escolaNome}</Badge>
                          <Badge className={getResultadoColor(sessao.resultado || '')}>
                            {sessao.resultado?.toUpperCase()} ({sessao.pontuacao} pts)
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          Solicitado em {new Date(sessao.dataAgendada).toLocaleDateString('pt-BR')}
                        </div>
                      </div>
                      <Button onClick={() => agendarSessao(sessao)} className="flex items-center gap-2">
                        <Plus className="w-4 h-4" />
                        Agendar Sessão
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Sessões Agendadas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-emoteen-blue" />
              Sessões Agendadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            {sessoesAgendadas.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">Nenhuma sessão agendada</p>
            ) : (
              <div className="grid gap-4">
                {sessoesAgendadas.map(sessao => (
                  <div key={sessao.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-muted-foreground" />
                            <span className="font-medium">{sessao.alunoNome}</span>
                          </div>
                          <Badge variant="outline">{sessao.escolaNome}</Badge>
                          <Badge className={getStatusColor(sessao.status)}>AGENDADA</Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                          <span>Link: <a href={sessao.linkSessao} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{sessao.linkSessao}</a></span>
                        </div>
                        {sessao.observacoes && (
                          <div className="text-sm text-muted-foreground">
                            <strong>Observações:</strong> {sessao.observacoes}
                          </div>
                        )}
                      </div>
                      <Button onClick={() => marcarComoRealizada(sessao.id)} variant="outline">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Marcar como Realizada
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Sessões Realizadas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emoteen-green" />
              Sessões Realizadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            {sessoesRealizadas.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">Nenhuma sessão realizada</p>
            ) : (
              <div className="grid gap-4">
                {sessoesRealizadas.map(sessao => (
                  <div key={sessao.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-muted-foreground" />
                            <span className="font-medium">{sessao.alunoNome}</span>
                          </div>
                          <Badge variant="outline">{sessao.escolaNome}</Badge>
                          <Badge className={getStatusColor(sessao.status)}>REALIZADA</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Dialog de Agendamento */}
      <Dialog open={dialogAberto} onOpenChange={setDialogAberto}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Agendar Sessão</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {sessaoSelecionada && (
              <div className="space-y-2">
                <p><strong>Aluno:</strong> {sessaoSelecionada.alunoNome}</p>
                <p><strong>Escola:</strong> {sessaoSelecionada.escolaNome}</p>
                <Badge className={getResultadoColor(sessaoSelecionada.resultado || '')}>
                  {sessaoSelecionada.resultado?.toUpperCase()} ({sessaoSelecionada.pontuacao} pts)
                </Badge>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="link">Link da Sessão *</Label>
              <Input
                id="link"
                value={linkSessao}
                onChange={(e) => setLinkSessao(e.target.value)}
                placeholder="https://meet.google.com/..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="observacoes">Observações</Label>
              <Textarea
                id="observacoes"
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
                placeholder="Observações sobre a sessão..."
                rows={3}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={salvarAgendamento} className="flex-1">
                Confirmar Agendamento
              </Button>
              <Button variant="outline" onClick={() => setDialogAberto(false)}>
                Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DashboardTerapeuta;