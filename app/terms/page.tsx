import Navbar from "@/components/Navbar";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
          
          <div className="bg-white rounded-lg shadow-md p-8 space-y-6">
            <section>
              <h2 className="text-2xl font-bold mb-4">Acceptance of Terms</h2>
              <p className="text-gray-700 leading-relaxed">
                By accessing and using DRS Digital, you accept and agree to be bound by 
                the terms and provision of this agreement.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Product Usage</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                All digital products purchased from DRS Digital are licensed for personal 
                or commercial use as specified in the product description. You may not:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Resell or redistribute the products</li>
                <li>Share download links with others</li>
                <li>Claim ownership of the products</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Payment and Refunds</h2>
              <p className="text-gray-700 leading-relaxed">
                All payments are processed securely through our payment gateway. Due to the 
                digital nature of our products, we do not offer refunds once a product has 
                been downloaded. If you experience technical issues, please contact our 
                support team.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Account Responsibility</h2>
              <p className="text-gray-700 leading-relaxed">
                You are responsible for maintaining the confidentiality of your account 
                credentials and for all activities that occur under your account.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
              <p className="text-gray-700 leading-relaxed">
                If you have any questions about these Terms of Service, please contact us 
                at support@drsdigital.com
              </p>
            </section>

            <p className="text-sm text-gray-500 mt-8">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

