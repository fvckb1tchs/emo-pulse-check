import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import EmoTeenLogo from "@/components/EmoTeenLogo";
import { ArrowRight, Shield, Heart, Users, BarChart3, UserCheck, MessageSquare, Target, HeadphonesIcon } from "lucide-react";

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

          {/* Acesso Profissionais */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button 
              variant="secondary" 
              size="lg"
              onClick={() => navigate('/dashboard-terapeuta')}
              className="text-lg px-8 py-6 h-auto"
            >
              Dashboard Terapeuta
              <HeadphonesIcon className="ml-2 w-5 h-5" />
            </Button>
            <Button 
              variant="secondary" 
              size="lg"
              onClick={() => navigate('/dashboard-psicologo')}
              className="text-lg px-8 py-6 h-auto"
            >
              Dashboard Psicólogo
              <UserCheck className="ml-2 w-5 h-5" />
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
          <div className="space-y-12">
            <div className="text-center space-y-4">
              <h3 className="text-3xl md:text-4xl font-bold text-foreground">Como funciona</h3>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Um processo simples e seguro para avaliar e apoiar o bem-estar emocional dos estudantes
              </p>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Step 1 */}
              <Card className="group relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-primary/5 to-secondary/10 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-8">
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <UserCheck className="w-8 h-8 text-white" />
                      </div>
                      <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center mx-auto mt-3">
                        <span className="text-primary font-bold text-lg">1</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <h4 className="text-xl font-bold text-foreground">Identificação Segura</h4>
                      <p className="text-muted-foreground leading-relaxed">
                        Acesse com o código da sua escola, nome completo e selecione sua série. 
                        Todas as informações são protegidas e confidenciais.
                      </p>
                      <div className="flex flex-wrap gap-2 pt-2">
                        <span className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full font-medium">Código da escola</span>
                        <span className="text-xs bg-secondary/10 text-secondary px-3 py-1 rounded-full font-medium">Nome + Série</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Step 2 */}
              <Card className="group relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-secondary/5 to-primary/10 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-8">
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-gradient-to-br from-secondary to-secondary/80 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <MessageSquare className="w-8 h-8 text-white" />
                      </div>
                      <div className="w-8 h-8 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mt-3">
                        <span className="text-secondary font-bold text-lg">2</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <h4 className="text-xl font-bold text-foreground">Triagem Emocional</h4>
                      <p className="text-muted-foreground leading-relaxed">
                        Responda 35 perguntas cuidadosamente elaboradas sobre seus sentimentos, 
                        comportamentos e bem-estar geral.
                      </p>
                      <div className="flex flex-wrap gap-2 pt-2">
                        <span className="text-xs bg-secondary/10 text-secondary px-3 py-1 rounded-full font-medium">35 questões</span>
                        <span className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full font-medium">Base científica</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Step 3 */}
              <Card className="group relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-primary/5 to-secondary/10 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-8">
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <Target className="w-8 h-8 text-white" />
                      </div>
                      <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center mx-auto mt-3">
                        <span className="text-primary font-bold text-lg">3</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <h4 className="text-xl font-bold text-foreground">Resultado Personalizado</h4>
                      <p className="text-muted-foreground leading-relaxed">
                        Receba uma análise completa do seu bem-estar emocional com orientações 
                        específicas e recursos de apoio adaptados às suas necessidades.
                      </p>
                      <div className="flex flex-wrap gap-2 pt-2">
                        <span className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full font-medium">Análise detalhada</span>
                        <span className="text-xs bg-secondary/10 text-secondary px-3 py-1 rounded-full font-medium">Orientações</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Step 4 */}
              <Card className="group relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-secondary/5 to-primary/10 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-8">
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-gradient-to-br from-secondary to-secondary/80 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <HeadphonesIcon className="w-8 h-8 text-white" />
                      </div>
                      <div className="w-8 h-8 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mt-3">
                        <span className="text-secondary font-bold text-lg">4</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <h4 className="text-xl font-bold text-foreground">Apoio Profissional</h4>
                      <p className="text-muted-foreground leading-relaxed">
                        Quando necessário, o sistema identifica automaticamente a necessidade de 
                        suporte especializado e facilita o encaminhamento adequado.
                      </p>
                      <div className="flex flex-wrap gap-2 pt-2">
                        <span className="text-xs bg-secondary/10 text-secondary px-3 py-1 rounded-full font-medium">Automático</span>
                        <span className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full font-medium">Especializado</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Call to Action */}
            <div className="text-center pt-8">
              <div className="inline-flex items-center gap-4 p-6 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl border border-primary/20">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-foreground">Pronto para começar?</p>
                  <p className="text-sm text-muted-foreground">O processo leva apenas alguns minutos</p>
                </div>
                <Button 
                  onClick={() => navigate('/login')}
                  className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white shadow-lg"
                >
                  Iniciar Avaliação
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
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
