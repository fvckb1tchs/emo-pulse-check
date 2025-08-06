import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import EmoTeenLogo from "@/components/EmoTeenLogo";

const TermosUso = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <EmoTeenLogo />
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Termos de Uso</CardTitle>
            <p className="text-muted-foreground">Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>
          </CardHeader>
          
          <CardContent className="prose prose-sm max-w-none space-y-6">
            <section>
              <h2 className="text-xl font-semibold mb-3">1. Definições</h2>
              <ul className="list-disc pl-6 space-y-1">
                <li><strong>Plataforma:</strong> Sistema EmoTeen para avaliação de bem-estar emocional</li>
                <li><strong>Usuários:</strong> Estudantes menores de idade que utilizam a plataforma</li>
                <li><strong>Responsáveis:</strong> Pais, mães ou responsáveis legais pelos estudantes</li>
                <li><strong>Escola:</strong> Instituição de ensino que contrata os serviços</li>
                <li><strong>Controlador:</strong> EmoTeen Educação Digital</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">2. Objeto e Finalidade</h2>
              <p>
                A plataforma EmoTeen oferece uma ferramenta de avaliação preventiva do bem-estar emocional 
                de estudantes, destinada exclusivamente a fins educacionais e de suporte pedagógico.
              </p>
              <p><strong>Importante:</strong> A plataforma NÃO substitui atendimento psicológico profissional ou diagnóstico médico.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">3. Condições de Uso</h2>
              <h3 className="text-lg font-medium mb-2">3.1 Elegibilidade:</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>Destinado exclusivamente a estudantes matriculados em instituições parceiras</li>
                <li>Requer consentimento prévio dos responsáveis legais</li>
                <li>Acesso mediante código institucional fornecido pela escola</li>
              </ul>

              <h3 className="text-lg font-medium mb-2 mt-4">3.2 Responsabilidades dos Usuários:</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>Fornecer informações verdadeiras e atualizadas</li>
                <li>Utilizar a plataforma apenas para os fins previstos</li>
                <li>Manter a confidencialidade dos códigos de acesso</li>
                <li>Comunicar imediatamente qualquer uso indevido</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">4. Responsabilidades da Escola</h2>
              <ul className="list-disc pl-6 space-y-1">
                <li>Obter consentimento dos responsáveis antes da participação dos estudantes</li>
                <li>Garantir que apenas estudantes autorizados acessem a plataforma</li>
                <li>Utilizar os resultados exclusivamente para fins educacionais e de bem-estar</li>
                <li>Manter sigilo sobre os dados dos estudantes</li>
                <li>Providenciar encaminhamento adequado quando indicado pela plataforma</li>
                <li>Informar aos responsáveis sobre a participação de seus filhos</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">5. Responsabilidades dos Responsáveis</h2>
              <ul className="list-disc pl-6 space-y-1">
                <li>Autorizar ou vetar a participação do menor na avaliação</li>
                <li>Manter atualizados os dados de contato na escola</li>
                <li>Acompanhar os resultados e orientações fornecidas</li>
                <li>Buscar apoio profissional quando recomendado</li>
                <li>Comunicar à escola qualquer alteração no consentimento</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">6. Limitações da Plataforma</h2>
              <p>A EmoTeen reconhece e declara que:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Não realiza diagnósticos médicos ou psicológicos</li>
                <li>Não substitui avaliação profissional especializada</li>
                <li>Os resultados são indicativos e baseados em autorrelato</li>
                <li>Não garante a prevenção de problemas de saúde mental</li>
                <li>Resultados podem variar conforme o estado emocional momentâneo</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">7. Uso de Dados e Privacidade</h2>
              <h3 className="text-lg font-medium mb-2">7.1 Coleta de Dados:</h3>
              <p>A plataforma coleta apenas dados essenciais para sua finalidade educacional.</p>

              <h3 className="text-lg font-medium mb-2 mt-4">7.2 Proteção de Dados:</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>Conformidade total com a LGPD (Lei 13.709/2018)</li>
                <li>Criptografia de dados sensíveis</li>
                <li>Acesso restrito por perfis autorizados</li>
                <li>Logs de auditoria para rastreabilidade</li>
              </ul>

              <h3 className="text-lg font-medium mb-2 mt-4">7.3 Retenção de Dados:</h3>
              <p>Os dados são mantidos pelo tempo mínimo necessário para cumprimento da finalidade educacional.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">8. Propriedade Intelectual</h2>
              <ul className="list-disc pl-6 space-y-1">
                <li>Todos os direitos sobre a plataforma pertencem à EmoTeen</li>
                <li>É vedada a reprodução, distribuição ou modificação do sistema</li>
                <li>O uso é licenciado apenas para a finalidade contratada</li>
                <li>Respostas dos usuários permanecem de propriedade dos responsáveis</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">9. Disponibilidade e Suporte</h2>
              <h3 className="text-lg font-medium mb-2">9.1 Disponibilidade:</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>Esforços para manter 99% de disponibilidade</li>
                <li>Manutenções programadas serão comunicadas previamente</li>
                <li>Não há garantia de funcionamento ininterrupto</li>
              </ul>

              <h3 className="text-lg font-medium mb-2 mt-4">9.2 Suporte:</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>Suporte técnico via escola contratante</li>
                <li>Documentação e treinamento para educadores</li>
                <li>Canal direto para questões de privacidade</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">10. Limitação de Responsabilidade</h2>
              <p>A EmoTeen não se responsabiliza por:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Decisões tomadas com base nos resultados da plataforma</li>
                <li>Danos decorrentes de uso inadequado ou não autorizado</li>
                <li>Problemas de conectividade ou dispositivos dos usuários</li>
                <li>Interpretação incorreta dos resultados</li>
                <li>Falha em buscar ajuda profissional quando recomendado</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">11. Segurança da Informação</h2>
              <h3 className="text-lg font-medium mb-2">11.1 Medidas Implementadas:</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>Comunicação exclusivamente via HTTPS</li>
                <li>Autenticação multifator para administradores</li>
                <li>Monitoramento contínuo de tentativas de acesso</li>
                <li>Backup automático e recuperação de desastres</li>
                <li>Testes regulares de segurança</li>
              </ul>

              <h3 className="text-lg font-medium mb-2 mt-4">11.2 Responsabilidades dos Usuários:</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>Manter sigilo dos códigos de acesso</li>
                <li>Utilizar dispositivos seguros</li>
                <li>Reportar atividades suspeitas</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">12. Modificações dos Termos</h2>
              <p>
                Estes Termos de Uso podem ser alterados a qualquer tempo, com comunicação prévia 
                de 30 dias para modificações substanciais. O uso continuado da plataforma implica 
                aceitação das alterações.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">13. Rescisão</h2>
              <h3 className="text-lg font-medium mb-2">13.1 Pelo Usuário/Responsável:</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>Revogação do consentimento a qualquer momento</li>
                <li>Solicitação de exclusão dos dados</li>
              </ul>

              <h3 className="text-lg font-medium mb-2 mt-4">13.2 Pela EmoTeen:</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>Uso indevido da plataforma</li>
                <li>Violação destes termos</li>
                <li>Atividades que comprometam a segurança</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">14. Jurisdição</h2>
              <p>
                Estes Termos são regidos pela legislação brasileira. Eventuais controvérsias 
                serão submetidas ao foro da comarca da sede da escola contratante.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">15. Contato</h2>
              <p>Para dúvidas sobre estes Termos de Uso:</p>
              <ul className="list-none space-y-1">
                <li><strong>E-mail:</strong> contato@emoteen.com.br</li>
                <li><strong>Suporte técnico:</strong> suporte@emoteen.com.br</li>
                <li><strong>Questões de privacidade:</strong> privacidade@emoteen.com.br</li>
              </ul>
            </section>

            <section className="border-t pt-6">
              <p className="text-sm text-muted-foreground">
                Ao utilizar a plataforma EmoTeen, você concorda com estes Termos de Uso e com nossa 
                <a href="/politica-de-privacidade" className="text-primary hover:underline ml-1">Política de Privacidade</a>.
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TermosUso;