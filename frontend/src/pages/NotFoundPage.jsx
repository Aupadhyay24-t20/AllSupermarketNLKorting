import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import Layout from '../components/layout/Layout'

export default function NotFoundPage() {
  const { t } = useTranslation()
  return (
    <Layout>
      <Helmet><title>404 | Fresco</title></Helmet>
      <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem var(--layout-pad)', textAlign: 'center' }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(5rem, 20vw, 9rem)', lineHeight: 1, color: 'var(--c-brand-tint)', marginBottom: '1rem' }}>
          404
        </div>
        <h1 style={{ margin: 0, fontSize: '1.5rem', color: 'var(--c-text)', marginBottom: '0.6rem' }}>
          {t('notfound.title')}
        </h1>
        <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--c-text-subtle)', marginBottom: '2rem' }}>
          {t('notfound.desc')}
        </p>
        <Link
          to="/"
          style={{
            display: 'inline-block',
            padding: '0.6rem 1.5rem',
            borderRadius: 'var(--r-pill)',
            background: 'var(--c-brand)',
            color: '#fff',
            fontSize: '0.85rem',
            fontWeight: 600,
          }}
        >
          {t('notfound.btn')}
        </Link>
      </div>
    </Layout>
  )
}
