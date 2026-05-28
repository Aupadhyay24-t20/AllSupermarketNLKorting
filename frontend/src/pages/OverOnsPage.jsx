import { Helmet } from 'react-helmet-async'
import Layout from '../components/layout/Layout'

export default function OverOnsPage() {
  return (
    <Layout>
      <Helmet>
        <title>Over Ons — SuperDeal NL</title>
      </Helmet>

      <section
        className="w-full min-h-screen px-4 md:px-16 py-12"
        style={{ backgroundColor: '#111614' }}
      >
        <h1 className="text-3xl font-bold text-white">Over SuperDeal NL</h1>
        <p className="mt-4 text-lg max-w-xl" style={{ color: '#a0b8a8' }}>
          SuperDeal NL verzamelt wekelijks de beste aanbiedingen van Nederlandse
          supermarkten op één plek.
        </p>
      </section>
    </Layout>
  )
}
