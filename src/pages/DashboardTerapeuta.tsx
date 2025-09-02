import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User, CheckCircle, AlertCircle, Plus, LogOut, ArrowLeft } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
  const navigate = useNavigate();
  const [sessoes, setSessoes] = useState<SessaoAgendada[]>([]);
  const [dialogAberto, setDialogAberto] = useState(false);
  const [sessaoSelecionada, setSessaoSelecionada] = useState<SessaoAgendada | null>(null);
  const [linkSessao, setLinkSessao] = useState("");
  const [observacoes, setObservacoes] = useState("");

  useEffect(() => {
    verificarAutenticacao();
    carregarSessoes();
  }, []);

  const verificarAutenticacao = () => {
    if (DEMO_MODE) {
      const isLoggedIn = sessionStorage.getItem('terapeuta_loggedIn');
      if (!isLoggedIn) {
        navigate('/login-profissional');
        return;
      }
    }
  };

  const logout = () => {
    if (DEMO_MODE) {
      sessionStorage.removeItem('terapeuta_loggedIn');
      navigate('/');
    }
  };

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
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Dashboard Terapeuta</h1>
              <p className="text-sm text-muted-foreground">Gerencie suas sessões e atendimentos</p>
            </div>
          </div>
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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
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
        </div>

        {/* Sessões Pendentes */}
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
                            <span className="font-medium text-sm sm:text-base">{sessao.alunoNome}</span>
                          </div>
                          <Badge variant="outline" className="text-xs">{sessao.escolaNome}</Badge>
                          <Badge className={`${getResultadoColor(sessao.resultado || '')} text-xs`}>
                            {sessao.resultado?.toUpperCase()} ({sessao.pontuacao}pts)
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                          <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                          {new Date(sessao.dataAgendada).toLocaleDateString('pt-BR')}
                        </div>
                      </div>
                      <Button 
                        onClick={() => agendarSessao(sessao)} 
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

        {/* Dialog de Agendamento */}
        <Dialog open={dialogAberto} onOpenChange={setDialogAberto}>
          <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-lg">Agendar Sessão</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {sessaoSelecionada && (
                <div className="space-y-2 p-3 bg-muted rounded-lg">
                  <p className="text-sm"><strong>Aluno:</strong> {sessaoSelecionada.alunoNome}</p>
                  <p className="text-sm"><strong>Escola:</strong> {sessaoSelecionada.escolaNome}</p>
                  <Badge className={`${getResultadoColor(sessaoSelecionada.resultado || '')} text-xs`}>
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
                  value={observacoes}
                  onChange={(e) => setObservacoes(e.target.value)}
                  placeholder="Observações sobre a sessão..."
                  rows={3}
                  className="text-sm"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={salvarAgendamento} className="flex-1 text-sm">
                  Confirmar
                </Button>
                <Button variant="outline" onClick={() => setDialogAberto(false)} className="text-sm">
                  Cancelar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default DashboardTerapeuta;