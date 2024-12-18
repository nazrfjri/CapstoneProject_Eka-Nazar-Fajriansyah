import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-slate-600 text-white py-4 mt-10">
      <div className="container mx-auto text-center">
        <p>&copy; 2024 E-Shop. All Rights Reserved.</p>
        <div className="mt-4">
          <a href="#" className="text-slate-400 hover:text-stone-400 mx-2">Privacy Policy</a>
          <a href="#" className="text-slate-400 hover:text-stone-400 mx-2">Terms of Service</a>
          <a href="#" className="text-slate-400 hover:text-stone-400 mx-2">Help</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
