import '@styles/globals.css';

import Nav from '@components/Nav';
import Provider from '@components/Provider';

export const metadata = {
  title: 'Logitech VMS demo',
  description: 'demo purposes of Logitech VMS',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en'>
      <head>
      </head>
      <body>
        <Provider>
          <main className=''>
            <Nav />
            {children}
          </main>
        </Provider>
      </body>
  </html>
  )
}
