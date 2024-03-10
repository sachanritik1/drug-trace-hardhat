export default function Home() {
  return (
    <div className="bg-gray-100 min-h-screen">
      <header className="bg-blue-600 text-white py-8 text-center">
        <h1 className="text-4xl font-bold">Welcome to the Drug Trace</h1>
        <p className="text-lg">
          Your One-Stop Destination for Tracking Drugs and Medications
        </p>
      </header>
      <main className="container mx-auto py-8 px-4">
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">About Us</h2>
          <p className="text-lg">
            The Drug is a comprehensive platform dedicated to providing reliable
            and up-to-date information about pharmaceuticals, treatments, and
            healthcare topics. Whether you're a healthcare professional or an
            individual seeking medical guidance, we're here to empower you with
            knowledge.
          </p>
        </section>
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Services</h2>
          <ul className="list-disc pl-4 text-lg">
            <li>Explore our vast database of drugs and medications</li>
            <li>Discover articles and resources on health and wellness</li>
            <li>Connect with experts and community members</li>
          </ul>
        </section>
      </main>
    </div>
  );
}
