import Hero from '../components/Hero'
import ProblemSection from '../components/ProblemSection'
import EvidenceFlow from '../components/EvidenceFlow'
import Pillars from '../components/Pillars'
import Pathways from '../components/Pathways'
import Journey from '../components/Journey'
import Roadmap from '../components/Roadmap'
import EvidenceSystem from '../components/EvidenceSystem'
import Founder from '../components/Founder'
import CaseStudies from '../components/CaseStudies'
import Credibility from '../components/Credibility'
import Assessment from '../components/Assessment'
import Comparison from '../components/Comparison'
import FAQ from '../components/FAQ'
import InsightsPreview from '../components/insights/InsightsPreview'
import Offerings from '../components/Offerings'
import FinalCTA from '../components/FinalCTA'
import { HOME_SEO, useSeo } from '../lib/seo'

export default function HomePage() {
  useSeo(HOME_SEO)
  return (
    <>
      <Hero />
      <ProblemSection />
      <EvidenceFlow />
      <Pillars />
      <Pathways />
      <Journey />
      <Roadmap />
      <EvidenceSystem />
      <Founder />
      <CaseStudies />
      <Credibility />
      <Assessment />
      <Comparison />
      <FAQ />
      <InsightsPreview />
      <Offerings />
      <FinalCTA />
    </>
  )
}
