
function Footer() {
  const currentYear = new Date().getFullYear(); 

  return (
    <footer className="bg-teal-300 m-2 rounded-md text-white py-8 mt-10">
      <div className="container mx-auto px-4 md:px-8 lg:px-16 text-center">
        <p className="text-lg font-semibold">Tüm Hakları Saklıdır</p>
        <p className="text-sm">
          &copy; {currentYear} E-Ticaret Sitesi.
        </p>
        <div className="flex justify-center space-x-4 mt-4">
          <a href="#" className="text-white hover:text-primary transition-colors">
            <i className="fab fa-facebook-f"></i>
          </a>
          <a href="#" className="text-white hover:text-primary transition-colors">
            <i className="fab fa-twitter"></i> 
          </a>
          <a href="#" className="text-white hover:text-primary transition-colors">
            <i className="fab fa-instagram"></i> 
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
