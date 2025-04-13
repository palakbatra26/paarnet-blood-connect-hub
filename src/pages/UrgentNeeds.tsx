
import { useState } from "react";
import { useData } from "@/context/DataContext";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertTriangle, Filter, Hospital, Clock, User, Phone } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const UrgentNeeds = () => {
  const { urgentRequests } = useData();
  const { isAuthenticated } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBloodType, setFilterBloodType] = useState("");

  // Blood type options
  const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  // Filter urgent needs based on search term and blood type
  const filteredRequests = urgentRequests.filter(
    (request) =>
      (request.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.hospital.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filterBloodType === "" || request.bloodType === filterBloodType)
  );

  // Sort by urgency and recency
  const sortedRequests = [...filteredRequests].sort((a, b) => {
    // First sort by urgency
    if (a.isUrgent && !b.isUrgent) return -1;
    if (!a.isUrgent && b.isUrgent) return 1;
    
    // Then sort by date (most recent first)
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className="container px-4 mx-auto py-10">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-bold mb-2">Urgent Blood Needs</h1>
            <p className="text-gray-600">
              Your donation can save lives in critical moments
            </p>
          </div>
        </div>

        <div className="bg-white p-4 border rounded-lg mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search by patient name or hospital..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="w-full md:w-64">
              <select
                value={filterBloodType}
                onChange={(e) => setFilterBloodType(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blood-500"
              >
                <option value="">All Blood Types</option>
                {bloodTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {sortedRequests.length === 0 ? (
          <div className="text-center py-20">
            <h3 className="text-xl font-medium text-gray-600 mb-4">No urgent requests found</h3>
            <p className="text-gray-500">Try adjusting your search or check back later</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {sortedRequests.map((request) => (
              <Card key={request.id} className={`overflow-hidden ${request.isUrgent ? 'border-blood-500' : ''}`}>
                <CardHeader className={`${request.isUrgent ? 'bg-blood-50' : 'bg-gray-50'} pb-4 flex flex-row items-center justify-between`}>
                  <div>
                    <CardTitle className="flex items-center">
                      {request.patientName}
                      {request.isUrgent && (
                        <Badge className="ml-2 bg-blood-600">URGENT</Badge>
                      )}
                    </CardTitle>
                    <p className="text-sm text-gray-600">Needs {request.requiredUnits} units of {request.bloodType} blood</p>
                  </div>
                  <div className="text-4xl font-bold text-blood-600">{request.bloodType}</div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <Hospital className="h-5 w-5 text-blood-500 mr-3 mt-0.5" />
                      <div>
                        <p className="font-medium">Hospital</p>
                        <p className="text-sm text-gray-600">{request.hospital}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Phone className="h-5 w-5 text-blood-500 mr-3 mt-0.5" />
                      <div>
                        <p className="font-medium">Contact</p>
                        <p className="text-sm text-gray-600">{request.contact}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Clock className="h-5 w-5 text-blood-500 mr-3 mt-0.5" />
                      <div>
                        <p className="font-medium">Requested on</p>
                        <p className="text-sm text-gray-600">
                          {new Date(request.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t bg-gray-50 py-3 px-6">
                  <div className="flex justify-between items-center w-full">
                    <Button
                      variant="outline"
                      className="border-blood-600 text-blood-600"
                      onClick={() => window.open(`tel:${request.contact.replace(/\D/g, '')}`)}
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      Call Contact
                    </Button>
                    {isAuthenticated ? (
                      <Button className="bg-blood-600 hover:bg-blood-700">
                        <User className="h-4 w-4 mr-2" />
                        Volunteer to Donate
                      </Button>
                    ) : (
                      <Button className="bg-blood-600 hover:bg-blood-700" disabled>
                        Login to Volunteer
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

export default UrgentNeeds;
