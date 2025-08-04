import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import EmoTeenLogo from "@/components/EmoTeenLogo";
import { ArrowRight, Shield, Heart, Users, BarChart3 } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10">
      {/* Header */}
      <header className="px-4 py-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <EmoTeenLogo size="md" />
            <h1 className="text-2xl font-bold text-foreground">EmoTeen</h1>
          </div>
          <Button 
            variant="outline" 
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2"
          >
            <BarChart3 className="w-4 h-4" />
            Dashboard Escola
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-8 mb-16">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-6xl font-bold text-foreground leading-tight">
                Cuidando do bem-estar<br />
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  emocional dos jovens
                </span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Uma plataforma moderna e segura para avaliação do bem-estar emocional de estudantes, 
                promovendo o cuidado preventivo e o apoio adequado.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => navigate('/login')}
                size="lg"
                className="text-lg px-8 py-6 h-auto bg-primary hover:bg-primary/90"
              >
                Fazer Avaliação
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => navigate('/dashboard')}
                className="text-lg px-8 py-6 h-auto"
              >
                Acesso Escolar
                <Shield className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            <Card className="text-center border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-xl">Avaliação Cuidadosa</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Questionário desenvolvido com base em evidências científicas para identificar necessidades de apoio emocional.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-xl">Totalmente Seguro</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Todas as informações são criptografadas e protegidas, garantindo a privacidade e confidencialidade dos estudantes.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-xl">Apoio Direcionado</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Sistema inteligente que identifica quando é necessário encaminhamento para apoio profissional especializado.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* How it works */}
          <div className="text-center space-y-8">
            <h3 className="text-3xl font-bold text-foreground">Como funciona</h3>
            
            <div className="grid md:grid-cols-4 gap-6">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-primary font-bold text-xl">1</span>
                </div>
                <h4 className="font-semibold">Acesso Seguro</h4>
                <p className="text-sm text-muted-foreground">
                  Entre com o código da sua escola e seu nome completo
                </p>
              </div>

              <div className="space-y-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-primary font-bold text-xl">2</span>
                </div>
                <h4 className="font-semibold">Responda o Quiz</h4>
                <p className="text-sm text-muted-foreground">
                  10 perguntas simples sobre como você se sente
                </p>
              </div>

              <div className="space-y-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-primary font-bold text-xl">3</span>
                </div>
                <h4 className="font-semibold">Receba o Resultado</h4>
                <p className="text-sm text-muted-foreground">
                  Veja seu nível de bem-estar e orientações personalizadas
                </p>
              </div>

              <div className="space-y-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-primary font-bold text-xl">4</span>
                </div>
                <h4 className="font-semibold">Apoio se Necessário</h4>
                <p className="text-sm text-muted-foreground">
                  Encaminhamento automático para suporte profissional quando indicado
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-4 py-8 border-t border-border/50">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <EmoTeenLogo size="sm" />
            <span className="font-semibold text-foreground">EmoTeen</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Promovendo o bem-estar emocional de estudantes com tecnologia segura e cuidadosa.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
