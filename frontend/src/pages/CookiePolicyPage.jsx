import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import Layout from '../components/layout/Layout'

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: '2rem' }}>
      <h2 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--c-text)', marginBottom: '0.6rem' }}>{title}</h2>
      <div style={{ fontSize: '0.875rem', color: 'var(--c-text-muted)', lineHeight: 1.8 }}>{children}</div>
    </div>
  )
}

export default function CookiePolicyPage() {
  const { i18n } = useTranslation()
  const isEN = i18n.language === 'en'

  return (
    <Layout>
      <Helmet>
        <title>{isEN ? 'Cookie Policy | Fresco' : 'Cookiebeleid | Fresco'}</title>
      </Helmet>

      <div style={{ maxWidth: 680, margin: '0 auto', padding: '3.5rem var(--layout-pad) 5rem' }}>
        <h1 style={{ margin: 0, fontSize: '2rem', color: 'var(--c-text)', marginBottom: '0.4rem' }}>
          {isEN ? 'Cookie Policy' : 'Cookiebeleid'}
        </h1>
        <p style={{ margin: '0 0 2.5rem', fontSize: '0.82rem', color: 'var(--c-text-subtle)' }}>
          {isEN ? 'Last updated: June 2026' : 'Laatst bijgewerkt: juni 2026'}
        </p>

        {isEN ? (
          <>
            <Section title="What are cookies?">
              Cookies are small text files stored on your device when you visit a website. We only use analytics cookies to understand how visitors use Fresco.
            </Section>

            <Section title="Which cookies do we use?">
              <p style={{ margin: '0 0 0.75rem' }}>We use <strong>Google Analytics 4</strong> for anonymous usage statistics. These cookies collect:</p>
              <ul style={{ margin: 0, paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <li>Pages visited and time spent</li>
                <li>General location (country/city level, not your exact address)</li>
                <li>Device type and browser</li>
                <li>Search terms used on Fresco</li>
                <li>Which deals were clicked</li>
              </ul>
              <p style={{ margin: '0.75rem 0 0' }}>IP addresses are anonymised. We do <strong>not</strong> collect names, email addresses or any personal data.</p>
            </Section>

            <Section title="Cookie details">
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--c-border)' }}>
                    {['Name', 'Purpose', 'Duration'].map(h => (
                      <th key={h} style={{ textAlign: 'left', padding: '0.5rem 0.75rem', color: 'var(--c-text-subtle)', fontWeight: 600 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['_ga', 'Distinguishes unique visitors', '2 years'],
                    ['_ga_XXXX', 'Session tracking', '2 years'],
                  ].map(([name, purpose, dur]) => (
                    <tr key={name} style={{ borderBottom: '1px solid var(--c-border)' }}>
                      <td style={{ padding: '0.5rem 0.75rem', fontFamily: 'monospace' }}>{name}</td>
                      <td style={{ padding: '0.5rem 0.75rem' }}>{purpose}</td>
                      <td style={{ padding: '0.5rem 0.75rem' }}>{dur}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Section>

            <Section title="Your consent">
              When you first visit Fresco, we ask for your consent before loading any analytics cookies. You can withdraw consent at any time by clearing your browser&apos;s local storage, or by contacting us.
            </Section>

            <Section title="Contact">
              Questions about this policy? Email us at{' '}
              <a href="mailto:aditya141105@gmail.com" style={{ color: 'var(--c-brand)' }}>aditya141105@gmail.com</a>.
            </Section>
          </>
        ) : (
          <>
            <Section title="Wat zijn cookies?">
              Cookies zijn kleine tekstbestanden die op je apparaat worden opgeslagen wanneer je een website bezoekt. Wij gebruiken alleen analytische cookies om te begrijpen hoe bezoekers Fresco gebruiken.
            </Section>

            <Section title="Welke cookies gebruiken wij?">
              <p style={{ margin: '0 0 0.75rem' }}>Wij gebruiken <strong>Google Analytics 4</strong> voor anonieme gebruiksstatistieken. Deze cookies verzamelen:</p>
              <ul style={{ margin: 0, paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <li>Bezochte pagina&apos;s en tijd doorgebracht op de site</li>
                <li>Globale locatie (land/stad, niet je exacte adres)</li>
                <li>Apparaattype en browser</li>
                <li>Zoektermen gebruikt op Fresco</li>
                <li>Welke deals er zijn aangeklikt</li>
              </ul>
              <p style={{ margin: '0.75rem 0 0' }}>IP-adressen worden geanonimiseerd. Wij verzamelen <strong>geen</strong> namen, e-mailadressen of andere persoonsgegevens.</p>
            </Section>

            <Section title="Cookie details">
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--c-border)' }}>
                    {['Naam', 'Doel', 'Duur'].map(h => (
                      <th key={h} style={{ textAlign: 'left', padding: '0.5rem 0.75rem', color: 'var(--c-text-subtle)', fontWeight: 600 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['_ga', 'Onderscheidt unieke bezoekers', '2 jaar'],
                    ['_ga_XXXX', 'Sessieregistratie', '2 jaar'],
                  ].map(([name, purpose, dur]) => (
                    <tr key={name} style={{ borderBottom: '1px solid var(--c-border)' }}>
                      <td style={{ padding: '0.5rem 0.75rem', fontFamily: 'monospace' }}>{name}</td>
                      <td style={{ padding: '0.5rem 0.75rem' }}>{purpose}</td>
                      <td style={{ padding: '0.5rem 0.75rem' }}>{dur}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Section>

            <Section title="Jouw toestemming">
              Bij je eerste bezoek aan Fresco vragen wij om toestemming voordat we analytische cookies laden. Je kunt je toestemming op elk moment intrekken door de lokale opslag van je browser te wissen, of door contact met ons op te nemen.
            </Section>

            <Section title="Contact">
              Vragen over dit beleid? Stuur een e-mail naar{' '}
              <a href="mailto:aditya141105@gmail.com" style={{ color: 'var(--c-brand)' }}>aditya141105@gmail.com</a>.
            </Section>
          </>
        )}
      </div>
    </Layout>
  )
}
