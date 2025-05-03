import { Metadata } from "next";
import Header from "@/components/NavBar";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Política de Privacidade - Furia",
  description:
    "Política de privacidade e proteção de dados da plataforma Furia",
};

export default function PrivacyPage() {
  return (
    <>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Header />
        <h1 className="text-3xl font-bold mb-6">Política de Privacidade</h1>

      <div className="space-y-6 text-gray-600 dark:text-gray-200">
        <section className="mb-8">
          <p>
            Quando você realiza uma compra ou contrata um serviço na Furia, você
            nos fornece alguns dados pessoais com o objetivo de viabilizar a sua
            operação. A Furia preza pela segurança dos seus dados, pelo respeito
            a sua privacidade e pela transparência com você e, por isso,
            dedicamos este documento para explicar como os seus dados pessoais
            serão tratados e quais são as medidas que aplicamos para mantê-los
            seguros.
          </p>
          <p className="mt-4">
            Antes de mais nada, nos apresentamos, nós somos a Furia Lifestyle
            Ltda., inscrito no CNPJ 42.374.282/0001-37, com sede na Cidade de
            São Paulo e segundo a definição trazida pela Lei Geral de Proteção
            de Dados 'LGPD' (Lei Federal nº 13.709.2018), na maior parte do
            tempo seremos o controlador das suas informações, sendo assim,
            responsável por definir o que acontece com estes dados e por
            protegê-los.
          </p>
          <p className="mt-4">
            Para facilitar a compreensão desta política, todas as vezes que
            encontrar os termos 'Furia', 'nós' ou 'nossos', estamos nos
            referindo ao controlador dos seus dados pessoais e, todas as vezes
            que ler 'usuário', 'você', 'seu' ou 'sua', nos referimos a você,
            nosso cliente ou usuário da nossa plataforma.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">
            QUAIS DADOS SÃO COLETADOS PELA FURIA
          </h2>
          <p className="mb-4">
            Durante sua experiência em uma de nossas lojas, podemos coletar
            diferentes tipos de dados pessoais, de forma automática com o
            objetivo de conferência, monitoramento e controle, ou fornecidas
            diretamente por você, como por exemplo para a realização de seu
            cadastro. Veja abaixo quais dados pessoais nós podemos coletar e em
            cada situação:
          </p>

          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Durante o cadastro:</h3>
              <ul className="list-disc pl-6">
                <li>Nome completo</li>
                <li>Foto</li>
                <li>Número de CPF</li>
                <li>Endereço de e-mail</li>
                <li>Número de celular</li>
                <li>Data de nascimento</li>
                <li>Dados referentes aos seus endereços</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">
                Durante o preenchimento do local de entrega e forma de
                pagamento:
              </h3>
              <ul className="list-disc pl-6">
                <li>Endereço de cobrança</li>
                <li>Endereço de entrega</li>
                <li>
                  Dados do cartão de crédito, quando escolhido como forma de
                  pagamento
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">
                Durante a análise e o monitoramento de suas compras ou outras
                transações financeiras:
              </h3>
              <ul className="list-disc pl-6">
                <li>Dados cadastrais</li>
                <li>Tipo de produto</li>
                <li>Quantidade</li>
                <li>Valor da mercadoria (unitário)</li>
                <li>Valor total da compra ou transação</li>
                <li>Natureza da transação financeira</li>
                <li>Informações da conta bancária e outros meios utilizados</li>
                <li>Filiação</li>
                <li>Informações de renda</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">
                Durante a navegação na plataforma:
              </h3>
              <ul className="list-disc pl-6">
                <li>Endereço de IP</li>
                <li>
                  Informações sobre o dispositivo utilizado para a navegação
                </li>
                <li>Produtos e categorias pesquisados ou visualizados</li>
                <li>Contagem de visualizações</li>
                <li>Páginas visitadas em outros sites</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">
                Outras informações que poderão ser coletadas:
              </h3>
              <ul className="list-disc pl-6">
                <li>
                  Informações de login social, caso você realize seu cadastro
                  por meio de uma conta em rede social
                </li>
                <li>Informações sobre você que se tornaram públicas</li>
                <li>Informações que coletamos de terceiros</li>
                <li>Informações fornecidas por você, voluntariamente</li>
                <li>Cópias de documentos enviados por você</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">
            COMO NÓS UTILIZAMOS OS SEUS DADOS PESSOAIS
          </h2>
          <p className="mb-4">
            Nós utilizamos os dados pessoais para garantir um atendimento de
            qualidade e uma melhor experiência na sua compra. Listamos abaixo as
            finalidades que poderemos utilizar seus dados pessoais:
          </p>

          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Dados cadastrais:</h3>
              <ul className="list-disc pl-6">
                <li>
                  Para viabilizar a prestação de diferentes serviços disponíveis
                  em nossas lojas
                </li>
                <li>
                  Para realizar o atendimento de solicitações e dúvidas em nossa
                  Central de Atendimento
                </li>
                <li>Para identificar corretamente o Usuário</li>
                <li>
                  Para enviar os produtos adquiridos ou comunicações de ofertas
                </li>
                <li>Para entrar em contato com você, quando necessário</li>
                <li>
                  Para auxiliar no diagnóstico e solução de problemas técnicos
                </li>
                <li>Para desenvolver novas funcionalidades e melhorias</li>
                <li>
                  Para consultar suas informações nas bases de dados de agências
                  de crédito
                </li>
                <li>
                  Para realizar investigações e medidas de prevenção e combate a
                  ilícitos
                </li>
                <li>
                  Para garantir o cumprimento de obrigação legal ou regulatória
                </li>
                <li>Para colaborar com o cumprimento de ordem judicial</li>
                <li>
                  Para viabilizar o cadastro na Yapay e realizar a abertura de
                  sua conta de pagamento
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Geolocalização:</h3>
              <ul className="list-disc pl-6">
                <li>Exibir anúncios personalizados</li>
                <li>Para envio de mensagens contextualizadas via push</li>
                <li>Para auxiliar nas análises de segurança</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Dados de Navegação:</h3>
              <ul className="list-disc pl-6">
                <li>
                  Para auxiliar no diagnóstico e solução de problema técnicos
                </li>
                <li>Para desenvolver novas funcionalidades e melhorias</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">
            COM QUEM NÓS PODEMOS COMPARTILHAR OS DADOS PESSOAIS
          </h2>
          <p className="mb-4">
            Para a execução das atividades acima listadas, sempre que
            necessário, nós poderemos compartilhar os seus dados pessoais com:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              Prestadores de serviço: para que possamos disponibilizar nossos
              produtos e prestar os nossos serviços com qualidade
            </li>
            <li>
              Autoridades judiciais, policiais ou governamentais: em atendimento
              à ordem judicial, solicitações de autoridades administrativas,
              obrigação legal ou regulatória
            </li>
            <li>
              Potenciais compradores: em caso de negociação de venda ou
              transferência de parte ou da totalidade da atividade comercial
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">
            ARMAZENAMENTO E SEGURANÇA DOS DADOS PESSOAIS
          </h2>
          <p className="mb-4">
            Nós armazenamos seus dados de forma segura em data centers
            localizados no Brasil, bem como no exterior. Neste caso de
            armazenamento no exterior, são adotadas todas as medidas legais
            aplicáveis, em conformidade com a Lei Geral de Proteção de Dados e
            suas futuras regulamentações, garantindo a proteção e privacidade
            dos seus dados pessoais.
          </p>
          <p className="mb-4">
            Nós adotamos as melhores técnicas para proteger os dados pessoais
            coletados de acessos não autorizados, destruição, perda, alteração,
            comunicação ou qualquer forma de tratamento inadequado ou ilícito,
            inclusive mecanismos de criptografia.
          </p>
          <p className="mb-4">
            Seus dados pessoais serão mantidos durante todo o período que for um
            cliente ativo da Furia. Após esse período, podemos armazenar os seus
            dados pessoais por um período adicional para fins de auditoria, para
            possibilitar o cumprimento de obrigações legais ou regulatórias.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">
            COOKIES E TECNOLOGIAS DE MONITORAMENTO
          </h2>
          <p className="mb-4">
            Podemos utilizar certas tecnologias de monitoramento para coletar as
            informações das atividades realizadas em nosso Site de forma
            automatizada. As informações coletadas por meio de tais tecnologias
            são utilizadas para:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Realizar métricas de performance do aplicativo</li>
            <li>Identificar problemas no uso</li>
            <li>Captar o comportamento dos Usuários</li>
            <li>Coletar dados de impressão de conteúdos</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">
            SEUS DIREITOS COMO TITULAR DOS DADOS PESSOAIS
          </h2>
          <p className="mb-4">
            A transparência sobre o tratamento dos seus dados pessoais é
            prioridade para a Furia. Você pode exercer os seguintes direitos:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Confirmação da existência de tratamento de dados pessoais</li>
            <li>Acesso aos dados pessoais</li>
            <li>Revogação do consentimento</li>
            <li>
              Correção de dados pessoais incompletos, inexatos ou desatualizados
            </li>
            <li>Eliminação dos dados pessoais tratados com o consentimento</li>
            <li>Informação sobre as hipóteses de compartilhamento de dados</li>
            <li>
              Informação sobre a possibilidade de não fornecer consentimento
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">FALE CONOSCO</h2>
          <p className="mb-4">
            Sempre que você tiver alguma dúvida sobre esta Política de
            Privacidade, mesmo após sua leitura, ou precisar interagir conosco
            sobre assuntos envolvendo os seus dados pessoais, poderá fazê-lo:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Por meio dos nossos canais de atendimento</li>
            <li>Pelo e-mail: sac@furia.gg</li>
          </ul>
          <p className="mt-4">
            Recomendamos que verifiquem a versão atualizada desta Política de
            Privacidade sempre que navegarem em qualquer das nossas lojas
            virtuais. Estamos sempre à disposição para esclarecer suas dúvidas e
            colocar você no controle dos seus dados pessoais.
          </p>
        </section>
        </div>
      </div>
      <Footer />
    </>
  );
}
