import {
  Navbar,
  Hero,
  About,
  Skills,
  Experience,
  Projects,
  Education,
  Contact,
  Footer,
} from './components/sections';

/**
 * Main portfolio page assembling all section components in order.
 */
export default function Home() {
  return (
    <>
      <Navbar />
      <main id="main-content">
        <Hero />
        <About />
        <Skills />
        <Experience />
        <Projects />
        <Education />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
