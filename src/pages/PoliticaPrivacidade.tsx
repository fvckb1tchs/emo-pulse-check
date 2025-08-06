import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import EmoTeenLogo from "@/components/EmoTeenLogo";

const PoliticaPrivacidade = () => {
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
            <CardTitle className="text-2xl">Política de Privacidade</CardTitle>
            <p className="text-muted-foreground">Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>
          </CardHeader>
          
          <CardContent className="prose prose-sm max-w-none space-y-6">
            <section>
              <h2 className="text-xl font-semibold mb-3">1. Informações Gerais</h2>
              <p>
                A EmoTeen é uma plataforma educacional dedicada ao bem-estar emocional de estudantes menores de idade. 
                Esta Política de Privacidade descreve como coletamos, usamos, armazenamos e protegemos as informações 
                pessoais dos usuários, em conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei 13.709/2018).
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">2. Dados Coletados</h2>
              <h3 className="text-lg font-medium mb-2">2.1 Dados dos Estudantes:</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>Nome completo</li>
                <li>Série escolar</li>
                <li>Escola de origem (código identificador)</li>
                <li>Respostas ao questionário de bem-estar emocional</li>
                <li>Pontuação e resultado da avaliação</li>
              </ul>

              <h3 className="text-lg font-medium mb-2 mt-4">2.2 Dados dos Responsáveis:</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>Nome completo</li>
                <li>CPF (para validação do consentimento)</li>
                <li>Consentimento digital com assinatura eletrônica</li>
              </ul>

              <h3 className="text-lg font-medium mb-2 mt-4">2.3 Dados Técnicos:</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>Endereço IP</li>
                <li>Informações do navegador (user-agent)</li>
                <li>Data e hora de acesso</li>
                <li>Logs de segurança e auditoria</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">3. Base Legal para Tratamento</h2>
              <p>O tratamento dos dados pessoais é realizado com base em:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li><strong>Consentimento (Art. 7º, I da LGPD):</strong> Consentimento livre, informado e inequívoco dos responsáveis legais</li>
                <li><strong>Interesse legítimo (Art. 7º, IX da LGPD):</strong> Para fins educacionais e de bem-estar do estudante</li>
                <li><strong>Proteção da vida (Art. 7º, IV da LGPD):</strong> Em situações que indiquem risco ao bem-estar do menor</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">4. Finalidade do Tratamento</h2>
              <p>Os dados pessoais são utilizados exclusivamente para:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Realização da avaliação de bem-estar emocional</li>
                <li>Geração de relatórios para a escola</li>
                <li>Identificação de estudantes que necessitam apoio especializado</li>
                <li>Cumprimento de obrigações legais e regulamentares</li>
                <li>Garantia da segurança da plataforma</li>
                <li>Auditoria e controle de acesso</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">5. Compartilhamento de Dados</h2>
              <p>Os dados pessoais poderão ser compartilhados com:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li><strong>Escola:</strong> Acesso aos resultados dos estudantes da própria instituição</li>
                <li><strong>Profissionais autorizados:</strong> Psicólogos e orientadores educacionais da escola</li>
                <li><strong>Autoridades competentes:</strong> Quando exigido por lei ou ordem judicial</li>
                <li><strong>Prestadores de serviço:</strong> Apenas para processamento técnico, sob acordo de confidencialidade</li>
              </ul>
              <p className="mt-2"><strong>Importante:</strong> Os dados nunca são vendidos ou utilizados para fins comerciais.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">6. Segurança dos Dados</h2>
              <p>Implementamos medidas técnicas e organizacionais para proteger os dados:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Criptografia de dados em trânsito e em repouso</li>
                <li>Controle de acesso baseado em funções (RBAC)</li>
                <li>Monitoramento contínuo de segurança</li>
                <li>Backup e recuperação de dados</li>
                <li>Auditoria de logs de acesso</li>
                <li>Proteção contra ataques XSS, CSRF e injeção</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">7. Tempo de Retenção</h2>
              <p>Os dados pessoais são mantidos pelo período:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li><strong>Dados do estudante:</strong> Durante o período letivo + 5 anos para fins de acompanhamento</li>
                <li><strong>Consentimento dos responsáveis:</strong> Durante todo o período de tratamento + 2 anos</li>
                <li><strong>Logs de segurança:</strong> 6 meses para fins de auditoria</li>
                <li><strong>Dados sensíveis:</strong> Prazo mínimo necessário para cumprimento da finalidade</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">8. Direitos dos Titulares</h2>
              <p>Conforme a LGPD, os titulares dos dados (responsáveis pelos menores) têm direito a:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Confirmação da existência de tratamento</li>
                <li>Acesso aos dados pessoais</li>
                <li>Correção de dados incompletos, inexatos ou desatualizados</li>
                <li>Anonimização, bloqueio ou eliminação de dados desnecessários</li>
                <li>Portabilidade dos dados</li>
                <li>Eliminação dos dados tratados com consentimento</li>
                <li>Informação sobre entidades com as quais os dados foram compartilhados</li>
                <li>Revogação do consentimento</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">9. Proteção de Menores</h2>
              <p>Reconhecemos que os dados de menores de idade requerem proteção especial:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Consentimento sempre obtido dos responsáveis legais</li>
                <li>Tratamento realizado no melhor interesse da criança/adolescente</li>
                <li>Acesso restrito aos dados por profissionais qualificados</li>
                <li>Procedimentos específicos para identificação de situações de risco</li>
                <li>Comunicação transparente com responsáveis sobre o tratamento</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">10. Incidentes de Segurança</h2>
              <p>
                Em caso de incidente de segurança que possa acarretar risco aos titulares, 
                notificaremos a Autoridade Nacional de Proteção de Dados (ANPD) em até 72 horas 
                e os responsáveis pelos estudantes em prazo razoável.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">11. Alterações na Política</h2>
              <p>
                Esta Política de Privacidade pode ser atualizada periodicamente. As alterações 
                serão comunicadas através da plataforma e, quando necessário, novo consentimento 
                será solicitado.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">12. Contato do Controlador</h2>
              <p>Para exercer seus direitos ou esclarecer dúvidas sobre esta política:</p>
              <ul className="list-none space-y-1">
                <li><strong>Controlador:</strong> EmoTeen Educação Digital</li>
                <li><strong>E-mail:</strong> privacidade@emoteen.com.br</li>
                <li><strong>DPO (Encarregado):</strong> dpo@emoteen.com.br</li>
                <li><strong>Endereço:</strong> [Endereço da instituição responsável]</li>
              </ul>
            </section>

            <section className="border-t pt-6">
              <p className="text-sm text-muted-foreground">
                Esta Política de Privacidade está em conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei 13.709/2018), 
                o Marco Civil da Internet (Lei 12.965/2014) e o Estatuto da Criança e do Adolescente (Lei 8.069/1990).
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PoliticaPrivacidade;