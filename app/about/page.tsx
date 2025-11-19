import Navbar from "@/components/Navbar";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">About DRS Digital</h1>
          
          <div className="bg-white rounded-lg shadow-md p-8 space-y-6">
            <section>
              <h2 className="text-2xl font-bold mb-4">Who We Are</h2>
              <p className="text-gray-700 leading-relaxed">
                DRS Digital is your one-stop destination for premium digital products. 
                We offer a curated collection of high-quality digital resources to help 
                you save time and create more.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
              <p className="text-gray-700 leading-relaxed">
                Our mission is to provide instant access to premium digital products 
                that empower creators, entrepreneurs, and businesses to achieve their goals 
                faster and more efficiently.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">What We Offer</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Premium digital templates and resources</li>
                <li>Instant downloadable products</li>
                <li>Secure payment processing</li>
                <li>Lifetime access to purchased products</li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}

