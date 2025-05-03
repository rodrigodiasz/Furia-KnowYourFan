import { Metadata } from "next";
import Header from "@/components/NavBar";
import { Footer } from "@/components/Footer";
export const metadata: Metadata = {
  title: "Termos e Condições - Furia",
  description: "Termos e condições de uso da plataforma Furia",
};

export default function TermsPage() {
  return (
    <>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Header />
        <h1 className="text-3xl font-bold mb-6">Termos e Condições</h1>

        <div className="space-y-6 text-gray-600 dark:text-gray-200">
          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Introdução</h2>
            <p>
              Bem-vindo ao furiausa.com. Esses termos e condições expõem as
              regras e regulamentos para a utilização do nosso site. Ao acessar
              o site, presumimos que você aceita esses termos e condições
              integralmente. Não continue o uso de furiausa.com se você não
              aceita todos os termos e condições declarados nessa página.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              2. Direitos de Propriedade Intelectual
            </h2>
            <p>
              Salvo indicação em contrário, furiausa.com e/ou seus licenciadores
              possuem os direitos de propriedade intelectual de todo o material
              de furiausa.com. Todos os direitos de propriedade intelectual são
              reservados. Você pode visualizar e/ou imprimir páginas de
              furiausa.com para seu uso pessoal, sujeito às restrições
              estabelecidas nestes termos e condições.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. Restrições</h2>
            <p className="mb-4">
              Você está especificamente restrito a todos os itens a seguir:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Publicar qualquer material do site em qualquer outra mídia.
              </li>
              <li>
                Vender, sublicenciar e/ou comercializar qualquer material do
                site.
              </li>
              <li>
                Executar e/ou exibir publicamente qualquer material do site sem
                a devida atribuição.
              </li>
              <li>
                Usar o site de qualquer forma que seja ou possa ser prejudicial
                a ele.
              </li>
              <li>
                Usar o site de qualquer forma que afete o acesso do usuário a
                este site.
              </li>
              <li>
                Usar o site de forma contrária às leis e regulamentos aplicáveis
                ou de uma forma que cause ou possa causar danos ao site ou a
                qualquer pessoa ou entidade empresarial.
              </li>
              <li>
                Envolver-se em qualquer mineração de dados, coleta de dados,
                extração de dados ou qualquer outra atividade semelhante em
                relação a este site.
              </li>
              <li>
                Usar o site para se envolver em qualquer publicidade ou
                marketing.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Seu conteúdo</h2>
            <p>
              Nesses termos e condições, "Seu Conteúdo" significa qualquer
              áudio, vídeo, texto, imagens ou outro material que você opte por
              exibir no site. Ao exibir Seu Conteúdo, você concede a
              furiausa.com uma licença não exclusiva, irrevogável e
              sublicenciável em todo o mundo para usá-lo, reproduzi-lo,
              adaptá-lo, publicá-lo, traduzi-lo e distribuí-lo em toda e
              qualquer mídia. Seu Conteúdo deve ser seu e não deve infringir os
              direitos de terceiros. furiausa.com se reserva o direito de
              remover qualquer conteúdo do site a qualquer momento, sem aviso
              prévio.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. Sem garantias</h2>
            <p>
              Esse site é fornecido "como está", com todas as falhas, e
              furiausa.com não expressa representações ou garantias de qualquer
              tipo relacionadas a esse site ou aos materiais contidos nele. Além
              disso, nada contido nesse site deve ser interpretado como um
              aviso.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              6. Limitação de Responsabilidade
            </h2>
            <p>
              Em nenhum caso furiausa.com ou qualquer um de seus executivos,
              diretores e funcionários serão responsabilizado por qualquer coisa
              decorrente ou de alguma forma relacionada ao uso desse site, quer
              tal responsabilidade esteja sob contrato. furiausa.com, incluindo
              seus executivos, diretores e funcionários, não serão
              responsabilizados por qualquer fato indireto, consequencial ou
              especial decorrente ou de alguma forma relacionado ao uso deste
              site.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">7. Indenização</h2>
            <p>
              Você indeniza em toda a extensão o site furiausa.com de e contra
              todas e quaisquer responsabilidades, custos, demandas, causas de
              ação, danos e despesas decorrentes de qualquer forma relacionadas
              à violação de qualquer uma das disposições destes termos e
              condições.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">8. Divisibilidade</h2>
            <p>
              Se qualquer disposição desses termos e condições for considerada
              inaplicável ou inválida sob qualquer lei aplicável, tal
              inaplicabilidade ou invalidez não tornará esses termos e condições
              inaplicáveis ou inválidos como um todo, e tais disposições serão
              excluídas sem afetar as demais disposições aqui contidas.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              9. Variação de Termos
            </h2>
            <p>
              Furiausa.com tem permissão para revisar esses termos e condições a
              qualquer momento que julgar adequado e, ao uso contínuo do site, é
              esperado que você revise esses termos e condições regularmente
              para garantir que compreende todos os termos e condições que regem
              o uso desse site.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">10. Atribuição</h2>
            <p>
              Furiausa.com terá permissão para ceder, transferir e subcontratar
              seus direitos e/ou obrigações sob estes termos e condições sem
              qualquer notificação ou consentimento necessário. No entanto, você
              não terá permissão para ceder, transferir ou subcontratar qualquer
              um dos seus direitos e/ou obrigações sob estes termos e condições.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">11. Acordo Integral</h2>
            <p>
              Esses termos e condições, incluindo quaisquer avisos legais e
              isenções de responsabilidade contidos neste site, constituem o
              acordo integral entre furiausa.com e você em relação ao uso deste
              site e substituem todos os acordos e entendimentos anteriores com
              relação ao mesmo. Ao utilizar esse site, você concorda com esses
              termos e condições e concorda em cumpri-los.
            </p>
          </section>
        </div>
      </div>
      <Footer />
    </>
  );
}
