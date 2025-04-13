
import { useState } from "react";
import { useData } from "@/context/DataContext";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, MapPin, Clock, Phone, User } from "lucide-react";

const Camps = () => {
  const { camps } = useData();
  const { isAuthenticated } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");

  // Filter camps based on search term
  const filteredCamps = camps.filter(
    (camp) =>
      camp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      camp.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      camp.organizer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container px-4 mx-auto py-10">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-bold mb-2">Blood Donation Camps</h1>
            <p className="text-gray-600">
              Find a blood donation camp near you and save lives
            </p>
          </div>
          <div className="w-full md:w-auto mt-4 md:mt-0">
            <Input
              placeholder="Search camps..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-64"
            />
          </div>
        </div>

        {filteredCamps.length === 0 ? (
          <div className="text-center py-20">
            <h3 className="text-xl font-medium text-gray-600 mb-4">No donation camps found</h3>
            <p className="text-gray-500">Try adjusting your search or check back later for new camps</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {filteredCamps.map((camp) => (
              <Card key={camp.id} className="overflow-hidden">
                <CardHeader className="bg-blood-50 pb-4">
                  <CardTitle>{camp.name}</CardTitle>
                  <CardDescription>Organized by {camp.organizer}</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <MapPin className="h-5 w-5 text-blood-500 mr-3 mt-0.5" />
                      <div>
                        <p className="font-medium">Location</p>
                        <p className="text-sm text-gray-600">{camp.location}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Calendar className="h-5 w-5 text-blood-500 mr-3 mt-0.5" />
                      <div>
                        <p className="font-medium">Date</p>
                        <p className="text-sm text-gray-600">
                          {new Date(camp.date).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Clock className="h-5 w-5 text-blood-500 mr-3 mt-0.5" />
                      <div>
                        <p className="font-medium">Time</p>
                        <p className="text-sm text-gray-600">{camp.time}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Phone className="h-5 w-5 text-blood-500 mr-3 mt-0.5" />
                      <div>
                        <p className="font-medium">Contact</p>
                        <p className="text-sm text-gray-600">{camp.contact}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t bg-gray-50 py-3 px-6">
                  <div className="flex justify-between items-center w-full">
                    <Button
                      variant="outline"
                      className="border-blood-600 text-blood-600"
                      onClick={() => window.open(`https://maps.google.com/?q=${encodeURIComponent(camp.location)}`, '_blank')}
                    >
                      <MapPin className="h-4 w-4 mr-2" />
                      Directions
                    </Button>
                    {isAuthenticated ? (
                      <Button className="bg-blood-600 hover:bg-blood-700">
                        <User className="h-4 w-4 mr-2" />
                        Register to Donate
                      </Button>
                    ) : (
                      <Button className="bg-blood-600 hover:bg-blood-700" disabled>
                        Login to Register
                      </Button>
                    )}
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Camps;
