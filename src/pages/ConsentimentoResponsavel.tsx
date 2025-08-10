import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { DEMO_MODE } from "@/config";
import EmoTeenLogo from "@/components/EmoTeenLogo";

const ConsentimentoResponsavel = () => {
  const [responsavelNome, setResponsavelNome] = useState("");
  const [responsavelCpf, setResponsavelCpf] = useState("");
  const [concordo, setConcordo] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState<any>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const userDataString = sessionStorage.getItem('userData');
    const schoolDataString = sessionStorage.getItem('schoolData');
    
    if (!userDataString || !schoolDataString) {
      toast({
        title: "Sessão expirada",
        description: "Por favor, faça login novamente.",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }

    const userData = JSON.parse(userDataString);
    const schoolData = JSON.parse(schoolDataString);
    setUserInfo({ ...userData, ...schoolData });

    // Check if consent already exists
    checkExistingConsent(userData.nome, schoolData.id);
  }, [navigate, toast]);

  const checkExistingConsent = async (alunoNome: string, escolaId: string) => {
    try {
      if (DEMO_MODE) {
        const hasConsent = localStorage.getItem(`consent_${escolaId}_${alunoNome}`);
        if (hasConsent) navigate('/quiz');
        return;
      }
      const { data, error } = await supabase
        .from('consentimento_responsavel')
        .select('*')
        .eq('aluno_nome', alunoNome)
        .eq('escola_id', escolaId)
        .eq('ativo', true)
        .single();

      if (data && !error) {
        // Consent already exists, proceed to quiz
        navigate('/quiz');
      }
    } catch (error) {
      // No existing consent, user needs to provide it
      console.log('No existing consent found');
    }
  };

  const formatCpf = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCpf(e.target.value);
    setResponsavelCpf(formatted);
  };

  const getUserInfo = () => {
    const userAgent = navigator.userAgent;
    const ipPromise = fetch('https://api.ipify.org?format=json')
      .then(res => res.json())
      .then(data => data.ip)
      .catch(() => 'unknown');
    
    return { userAgent, ipPromise };
  };

  const createSignatureHash = async (data: any) => {
    const signatureData = JSON.stringify({
      responsavel_nome: data.responsavelNome,
      responsavel_cpf: data.responsavelCpf,
      aluno_nome: data.alunoNome,
      escola_id: data.escolaId,
      timestamp: new Date().toISOString(),
      ip: data.ip,
      user_agent: data.userAgent
    });
    
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(signatureData);
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const logAction = async (action: string, details: any = {}) => {
    const { userAgent, ipPromise } = getUserInfo();
    const ip = await ipPromise;
    if (DEMO_MODE) {
      console.log('[DemoMode] logAction', { action, details, ip, userAgent });
      return;
    }
    await supabase.rpc('log_action', {
      p_escola_id: userInfo?.id,
      p_acao: action,
      p_detalhes: details,
      p_ip_address: ip,
      p_user_agent: userAgent
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!responsavelNome.trim() || !responsavelCpf.trim() || !concordo) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos e aceite os termos.",
        variant: "destructive",
      });
      return;
    }

    if (responsavelCpf.replace(/\D/g, '').length !== 11) {
      toast({
        title: "CPF inválido",
        description: "Por favor, insira um CPF válido com 11 dígitos.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { userAgent, ipPromise } = getUserInfo();
      const ip = await ipPromise;
      
      const hashData = await createSignatureHash({
        responsavelNome,
        responsavelCpf,
        alunoNome: userInfo.nome,
        escolaId: userInfo.id,
        ip,
        userAgent
      });

      if (DEMO_MODE) {
        localStorage.setItem(
          `consent_${userInfo.id}_${userInfo.nome}`,
          JSON.stringify({
            aluno_nome: userInfo.nome,
            escola_id: userInfo.id,
            responsavel_nome: responsavelNome,
            responsavel_cpf: responsavelCpf,
            ip_address: ip,
            user_agent: userAgent,
            hash_assinatura: hashData,
            data_consentimento: new Date().toISOString(),
            ativo: true
          })
        );
        await logAction('consentimento_registrado', {
          aluno_nome: userInfo.nome,
          responsavel_nome: responsavelNome
        });
        toast({
          title: 'Consentimento registrado',
          description: 'Consentimento registrado com sucesso. Redirecionando para o quiz...',
        });
        setTimeout(() => navigate('/quiz'), 1200);
        return;
      }

      const { error } = await supabase
        .from('consentimento_responsavel')
        .insert({
          aluno_nome: userInfo.nome,
          escola_id: userInfo.id,
          responsavel_nome: responsavelNome,
          responsavel_cpf: responsavelCpf,
          ip_address: ip,
          user_agent: userAgent,
          hash_assinatura: hashData
        });

      if (error) {
        throw error;
      }

      await logAction('consentimento_registrado', {
        aluno_nome: userInfo.nome,
        responsavel_nome: responsavelNome
      });

      toast({
        title: "Consentimento registrado",
        description: "Consentimento registrado com sucesso. Redirecionando para o quiz...",
      });

      setTimeout(() => {
        navigate('/quiz');
      }, 2000);

    } catch (error: any) {
      console.error('Error registering consent:', error);
      toast({
        title: "Erro",
        description: "Erro ao registrar consentimento. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!userInfo) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader className="text-center space-y-4">
          <EmoTeenLogo />
          <CardTitle className="text-2xl font-bold">Termo de Consentimento</CardTitle>
          <CardDescription>
            Para garantir a segurança e privacidade do(a) estudante <strong>{userInfo.nome}</strong>, 
            é necessário o consentimento do responsável legal.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="bg-muted/50 p-6 rounded-lg space-y-4">
            <h3 className="font-semibold text-lg">Termo de Consentimento para Participação na Avaliação de Bem-estar Emocional</h3>
            
            <div className="space-y-3 text-sm">
              <p>
                Eu, como responsável legal pelo(a) estudante <strong>{userInfo.nome}</strong>, 
                da instituição <strong>{userInfo.nome_escola}</strong>, autorizo a participação na 
                avaliação de bem-estar emocional oferecida pela plataforma EmoTeen.
              </p>
              
              <p><strong>Declaro estar ciente de que:</strong></p>
              
              <ul className="list-disc pl-6 space-y-2">
                <li>A avaliação tem caráter preventivo e educacional, não substituindo atendimento psicológico profissional;</li>
                <li>Os dados coletados serão utilizados exclusivamente para fins educacionais e de apoio ao bem-estar do estudante;</li>
                <li>As informações são protegidas conforme a Lei Geral de Proteção de Dados (LGPD);</li>
                <li>Apenas a escola e profissionais autorizados terão acesso aos resultados;</li>
                <li>Em casos que indiquem necessidade de apoio especializado, a escola será notificada para as providências cabíveis;</li>
                <li>Os dados podem ser excluídos a qualquer momento mediante solicitação formal à escola.</li>
              </ul>
              
              <p>
                <strong>Base legal:</strong> Este consentimento é baseado no Art. 7º, I da LGPD (consentimento livre, 
                informado e inequívoco) e no Art. 14 do Estatuto da Criança e do Adolescente.
              </p>
            </div>
          </div>

          <Separator />

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="responsavel-nome">Nome completo do responsável *</Label>
                <Input
                  id="responsavel-nome"
                  type="text"
                  value={responsavelNome}
                  onChange={(e) => setResponsavelNome(e.target.value)}
                  placeholder="Digite o nome completo"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="responsavel-cpf">CPF do responsável *</Label>
                <Input
                  id="responsavel-cpf"
                  type="text"
                  value={responsavelCpf}
                  onChange={handleCpfChange}
                  placeholder="000.000.000-00"
                  maxLength={14}
                  required
                />
              </div>
            </div>

            <div className="flex items-center space-x-2 p-4 bg-muted/30 rounded-lg">
              <Checkbox
                id="concordo"
                checked={concordo}
                onCheckedChange={(checked) => setConcordo(checked as boolean)}
              />
              <Label htmlFor="concordo" className="text-sm leading-relaxed">
                Li e concordo com todos os termos descritos acima. Autorizo a participação do(a) 
                estudante na avaliação de bem-estar emocional, ciente de que esta autorização 
                é registrada digitalmente com data, hora e identificação técnica para validade legal.
              </Label>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/login')}
                className="flex-1"
              >
                Voltar
              </Button>
              <Button
                type="submit"
                disabled={loading || !concordo}
                className="flex-1"
              >
                {loading ? "Registrando..." : "Confirmar Consentimento"}
              </Button>
            </div>
          </form>

          <div className="text-xs text-muted-foreground text-center space-y-1">
            <p>Este consentimento é registrado com assinatura digital válida conforme a MP 2.200-2/2001.</p>
            <p>Em caso de dúvidas, consulte nossa <a href="/politica-de-privacidade" className="text-primary hover:underline">Política de Privacidade</a>.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConsentimentoResponsavel;