import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import SchemaPreview from "@/components/SchemaPreview";
import SamplePrompts from "@/components/SamplePrompts";
import ExampleFlow from "@/components/ExampleFlow";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <HowItWorks />
      <SchemaPreview />
      <SamplePrompts />
      <ExampleFlow />
      <CTASection />
      <Footer />
    </main>
  );
}