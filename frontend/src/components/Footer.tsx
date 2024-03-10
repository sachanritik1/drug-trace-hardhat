export default function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="fixed left-0 right-0 bottom-0 bg-gray-800 text-white py-4 text-center">
      <p>&copy; {currentYear} Drug Trace. All rights reserved.</p>
    </footer>
  );
}
