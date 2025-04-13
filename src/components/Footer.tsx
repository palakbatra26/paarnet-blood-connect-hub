
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-white border-t py-8">
      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Link to="/" className="inline-block mb-4">
              <div className="text-blood-600 font-bold text-xl">
                PaAr <span className="text-blood-700">BloodConnect</span>
              </div>
            </Link>
            <p className="text-sm text-gray-600 mb-4">
              Connecting blood donors with those in need, saving lives one donation at a time.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-sm text-gray-600 hover:text-blood-600 transition">Home</Link></li>
              <li><Link to="/camps" className="text-sm text-gray-600 hover:text-blood-600 transition">Donation Camps</Link></li>
              <li><Link to="/urgent" className="text-sm text-gray-600 hover:text-blood-600 transition">Urgent Needs</Link></li>
              <li><Link to="/donor" className="text-sm text-gray-600 hover:text-blood-600 transition">Become a Donor</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">Resources</h3>
            <ul className="space-y-2">
              <li><Link to="#" className="text-sm text-gray-600 hover:text-blood-600 transition">Donation FAQs</Link></li>
              <li><Link to="#" className="text-sm text-gray-600 hover:text-blood-600 transition">Eligibility</Link></li>
              <li><Link to="#" className="text-sm text-gray-600 hover:text-blood-600 transition">Blood Types</Link></li>
              <li><Link to="#" className="text-sm text-gray-600 hover:text-blood-600 transition">About Blood Donation</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">Contact</h3>
            <ul className="space-y-2">
              <li className="text-sm text-gray-600">contact@paarbloodconnect.com</li>
              <li className="text-sm text-gray-600">+1 (800) BLOOD-HELP</li>
              <li className="text-sm text-gray-600">123 Donation Street, City</li>
              <li className="text-sm text-gray-600">Available 24/7 for emergencies</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-600 mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} PaAr BloodConnect. All rights reserved.
          </p>
          <div className="flex items-center text-sm text-gray-600">
            Made with <Heart className="h-4 w-4 mx-1 text-blood-600" /> by PaAr Team
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
