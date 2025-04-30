import React from 'react'
import Navbar from '../elements/Navbar'
import Footer from '../elements/Footer'

function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main>
        {children}
      </main>
      <Footer />
    </>
  )
}

export default MainLayout