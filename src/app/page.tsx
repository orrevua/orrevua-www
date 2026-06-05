import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { Hero } from "@/components/sections/hero"
import { About } from "@/components/sections/about"
import { Experience } from "@/components/sections/experience"
import { Projects } from "@/components/sections/projects"
import { fetchOgPreviews } from "@/lib/og"
import { Skills } from "@/components/sections/skills"
import { Testimonials } from "@/components/sections/testimonials"
import { Contact } from "@/components/sections/contact"

export default async function Home() {
  const ogPreviews = await fetchOgPreviews()

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Experience />
        <Projects ogPreviews={ogPreviews} />
        <Skills />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
