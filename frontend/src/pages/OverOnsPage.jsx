import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import Layout from '../components/layout/Layout'

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

export default function OverOnsPage() {
  return (
    <Layout>
      <Helmet>
        <title>Over Ons — SuperDeal NL</title>
      </Helmet>

      <motion.section
        className="w-full min-h-screen px-4 md:px-16 py-12"
        style={{ backgroundColor: '#090909' }}
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }}
        initial="hidden"
        animate="visible"
      >
        <motion.h1 className="text-3xl font-bold text-white" variants={fadeUp}>
          Over SuperDeal NL
        </motion.h1>
        <motion.p className="mt-4 text-lg max-w-xl" style={{ color: '#666666' }} variants={fadeUp}>
          SuperDeal NL verzamelt wekelijks de beste aanbiedingen van Nederlandse
          supermarkten op één plek.
        </motion.p>
      </motion.section>
    </Layout>
  )
}
