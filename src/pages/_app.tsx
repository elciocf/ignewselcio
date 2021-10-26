import { AppProps } from 'next/app'
import React from 'react'
import { Header } from '../components/Header'
import { Provider as NextauthProvider} from 'next-auth/client'

import '../styles/global.scss'

function MyApp({ Component, pageProps } : AppProps) {
  return (
     <NextauthProvider session={pageProps.session}>
       <Header />
       <Component {...pageProps} />
     </NextauthProvider>
  )
}

export default MyApp
