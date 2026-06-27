import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Services from './components/Services'
import Certifications from './components/Certifications'
import Careers from './components/Careers'
import Admin from './components/Admin'
import Stats from './components/Stats'
import WhyUs from './components/WhyUs'
import Team from './components/Team'
import Gallery from './components/Gallery'
import Support from './components/Support'
import Feedback from './components/Feedback'
import Footer from './components/Footer'
import ChatBox from './components/ChatBox'

function Home() {
  return (
    <>
      <Hero />
      <Stats />
      <WhyUs />
    </>
  )
}

function PageWrapper({ children }) {
  return <div className="pt-24">{children}</div>
}

export default function App() {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'hsl(0 0% 4%)', color: 'hsl(0 0% 98%)' }}>
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<PageWrapper><Services /></PageWrapper>} />
          <Route path="/certifications" element={<PageWrapper><Certifications /></PageWrapper>} />
          <Route path="/careers" element={<PageWrapper><Careers /></PageWrapper>} />
          <Route path="/why-us" element={<PageWrapper><WhyUs showVisual={false} /></PageWrapper>} />
          <Route path="/team" element={<PageWrapper><Team /></PageWrapper>} />
          <Route path="/gallery" element={<PageWrapper><Gallery /></PageWrapper>} />
          <Route path="/support" element={<PageWrapper><Support /></PageWrapper>} />
          <Route path="/feedback" element={<PageWrapper><Feedback /></PageWrapper>} />
          <Route path="/admin" element={<PageWrapper><Admin /></PageWrapper>} />
        </Routes>
      </main>
      <Footer />
      <ChatBox />
    </div>
  )
}
