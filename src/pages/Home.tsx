
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Droplet, Calendar, AlertTriangle, Users } from "lucide-react";
import { useData } from "@/context/DataContext";

const Home = () => {
  const { urgentRequests } = useData();
  
  // Filter to get only 3 urgent requests
  const topUrgentRequests = urgentRequests
    .filter(req => req.isUrgent)
    .slice(0, 3);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="hero-gradient text-white py-20">
        <div className="container px-4 mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Donate Blood, Save Lives
            </h1>
            <p className="text-xl mb-8">
              Your donation can make a life-changing difference for someone in need.
              Join our community of donors today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-blood-600 hover:bg-gray-100"
                asChild
              >
                <Link to="/donor">Become a Donor</Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-blood-700"
                asChild
              >
                <Link to="/urgent">View Urgent Needs</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Blood Types Section */}
      <section className="py-16 bg-white">
        <div className="container px-4 mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Blood Donation Matters
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-8 rounded-lg text-center">
              <div className="w-16 h-16 bg-blood-100 text-blood-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Droplet size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-3">All Blood Types Needed</h3>
              <p className="text-gray-600">
                Every blood type is valuable. Whether you're O, A, B, or AB, positive or negative, your donation can help save lives.
              </p>
            </div>
            <div className="bg-gray-50 p-8 rounded-lg text-center">
              <div className="w-16 h-16 bg-blood-100 text-blood-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Regular Donations</h3>
              <p className="text-gray-600">
                Blood has a limited shelf life. Regular donations ensure a steady supply for patients in need.
              </p>
            </div>
            <div className="bg-gray-50 p-8 rounded-lg text-center">
              <div className="w-16 h-16 bg-blood-100 text-blood-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Community Impact</h3>
              <p className="text-gray-600">
                Your donation can help accident victims, surgical patients, cancer patients, and many others in your community.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Urgent Needs Section */}
      {topUrgentRequests.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container px-4 mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold">Urgent Blood Needs</h2>
              <Button variant="outline" className="border-blood-600 text-blood-600" asChild>
                <Link to="/urgent">View All</Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {topUrgentRequests.map((request) => (
                <div key={request.id} className="bg-white p-6 rounded-lg border border-red-200 shadow-sm">
                  <div className="flex items-center mb-4">
                    <div className="blood-pulse w-12 h-12 rounded-full text-white flex items-center justify-center mr-4">
                      <AlertTriangle size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{request.bloodType} Blood Needed</h3>
                      <p className="text-gray-500">For {request.patientName}</p>
                    </div>
                  </div>
                  <div className="mb-4">
                    <p className="text-sm"><strong>Hospital:</strong> {request.hospital}</p>
                    <p className="text-sm"><strong>Units Needed:</strong> {request.requiredUnits}</p>
                    <p className="text-sm"><strong>Contact:</strong> {request.contact}</p>
                  </div>
                  <Button className="w-full bg-blood-600 hover:bg-blood-700">Contact to Donate</Button>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Call-to-Action Section */}
      <section className="py-20 bg-blood-50">
        <div className="container px-4 mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Make a Difference?</h2>
          <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto">
            Whether you're a first-time donor or a regular contributor, your blood donation
            can save up to three lives. Schedule your donation today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-blood-600 hover:bg-blood-700" asChild>
              <Link to="/camps">Find a Donation Camp</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-blood-600 text-blood-600" asChild>
              <Link to="/donor">Register as a Donor</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
