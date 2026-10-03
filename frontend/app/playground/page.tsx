import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PlaygroundClient from "@/components/PlaygroundClient";

export default function PlaygroundPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
            Playground
          </h1>
          <p className="text-gray-400 max-w-2xl">
            Type any question. IntentSQL will detect ambiguity, clarify if
            needed, generate SQL, and return a real answer.
          </p>
        </div>
        <PlaygroundClient />
      </div>
      <Footer />
    </main>
  );
}