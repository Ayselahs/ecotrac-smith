import '../styles/globals.css'
import { TravelProvider } from '../context/travel'

function MyApp({ Component, pageProps }) {
  return (
    <TravelProvider>
      <Component {...pageProps} />
    </TravelProvider>

  )
}

export default MyApp
