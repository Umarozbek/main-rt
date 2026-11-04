import { LangProvider } from '../lib/i18n'
import ClientPage from '../components/ClientPage'

export default function Home() {
  return (
    <LangProvider>
      <ClientPage />
    </LangProvider>
  )
}
