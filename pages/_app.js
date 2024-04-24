import '../styles/globals.css'
import { TravelProvider } from '../context/travel'
import 'bootstrap/dist/css/bootstrap.min.css';

function MyApp({ Component, pageProps }) {
  return (
    <TravelProvider>
      <Component {...pageProps} />
    </TravelProvider>

  )
}

export default MyApp
