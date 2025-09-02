import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Lock, User } from "lucide-react";
import { toast } from "sonner";
import { DEMO_MODE } from "@/config";

const LoginProfissional = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    tipo: "",
    email: "",
    senha: ""
  });
  const [loading, setLoading] = useState(false);

  // Credenciais demo
  const credenciaisDemo = {
    terapeuta: { email: "terapeuta@emoteen.com", senha: "123456" },
    psicologo: { email: "psicologo@emoteen.com", senha: "123456" }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.tipo || !formData.email || !formData.senha) {
      toast.error("Preencha todos os campos");
      setLoading(false);
      return;
    }

    if (DEMO_MODE) {
      // Validação demo
      const credencial = credenciaisDemo[formData.tipo as keyof typeof credenciaisDemo];
      
      if (credencial && 
          formData.email === credencial.email && 
          formData.senha === credencial.senha) {
        
        // Salvar sessão
        sessionStorage.setItem(`${formData.tipo}_loggedIn`, 'true');
        
        // Redirecionar para dashboard correto
        if (formData.tipo === 'terapeuta') {
          navigate('/dashboard-terapeuta');
        } else {
          navigate('/dashboard-psicologo');
        }
        
        toast.success(`Login realizado com sucesso!`);
      } else {
        toast.error("Credenciais inválidas");
      }
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10 p-4 flex items-center justify-center">
      <div className="w-full max-w-md space-y-6">
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
        </div>

        <Card className="shadow-lg">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-bold text-foreground flex items-center justify-center gap-2">
              <Lock className="w-6 h-6 text-primary" />
              Acesso Profissional
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Área restrita para terapeutas e psicólogos
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="tipo">Tipo de Profissional</Label>
                <Select value={formData.tipo} onValueChange={(value) => setFormData(prev => ({ ...prev, tipo: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="terapeuta">Terapeuta</SelectItem>
                    <SelectItem value="psicologo">Psicólogo</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="seu@email.com"
                  className="text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="senha">Senha</Label>
                <Input
                  id="senha"
                  type="password"
                  value={formData.senha}
                  onChange={(e) => setFormData(prev => ({ ...prev, senha: e.target.value }))}
                  placeholder="••••••"
                  className="text-sm"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={loading}
              >
                {loading ? "Entrando..." : "Entrar"}
              </Button>
            </form>

            {DEMO_MODE && (
              <div className="mt-6 p-4 bg-muted rounded-lg">
                <h4 className="font-semibold text-sm mb-2">Credenciais Demo:</h4>
                <div className="space-y-2 text-xs text-muted-foreground">
                  <div>
                    <strong>Terapeuta:</strong><br />
                    Email: terapeuta@emoteen.com<br />
                    Senha: 123456
                  </div>
                  <div>
                    <strong>Psicólogo:</strong><br />
                    Email: psicologo@emoteen.com<br />
                    Senha: 123456
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginProfissional;