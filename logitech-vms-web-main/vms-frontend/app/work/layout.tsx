import '@styles/globals.css';
// import '@styles/work.css';

export default function WorkLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return (
      <section className=''>
        {children}
      </section>
    )
  }