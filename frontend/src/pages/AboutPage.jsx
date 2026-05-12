import { Helmet } from 'react-helmet-async'
import Layout from '../components/layout/Layout'

export default function AboutPage() {
  return (
    <Layout>
      <Helmet>
        <title>Over Ons — SuperDeal NL</title>
      </Helmet>

      <div className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl md:text-4xl font-bold text-[#F9FAFB] mb-6">
          Over Ons
        </h1>
        <p className="text-[#9CA3AF] leading-relaxed">
          SuperDeal NL vergelijkt wekelijkse aanbiedingen van de grootste Nederlandse
          supermarkten — waaronder Albert Heijn, Jumbo, Lidl en meer. Ons doel is om
          jou snel en overzichtelijk te laten zien waar je het meeste bespaart, zonder
          dat je zelf alle folders hoeft door te spitten.
        </p>
      </div>
    </Layout>
  )
}
