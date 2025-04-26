import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Heart, Bell, User } from "lucide-react";
import axios from "axios";

interface Donation {
  _id: string;
  date: string;
  bloodType: string;
  location: string;
  userId: string;
}

interface Camp {
  _id: string;
  name: string;
  date: string;
  location: string;
  organizer: string;
  contact: string;
  status: string;
}

interface UrgentRequest {
  _id: string;
  patientName: string;
  bloodType: string;
  hospital: string;
  requiredUnits: number;
  status: string;
  createdBy: {
    _id: string;
    name: string;
  };
}

const UserPanel = () => {
  const { isAuthenticated, user, token } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [donations, setDonations] = useState<Donation[]>([]);
  const [camps, setCamps] = useState<Camp[]>([]);
  const [requests, setRequests] = useState<UrgentRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [donationsRes, campsRes, requestsRes] = await Promise.all([
          axios.get('http://localhost:5001/api/donations', {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get('http://localhost:5001/api/camps', {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get('http://localhost:5001/api/requests', {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        setDonations(donationsRes.data);
        setCamps(campsRes.data);
        setRequests(requestsRes.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: "Error",
          description: "Failed to fetch data",
          variant: "destructive",
        });
      }
    };

    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated, token, toast]);

  // Redirect if not logged in
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      toast({
        title: "Access Denied",
        description: "Please login to access your dashboard",
        variant: "destructive",
      });
    }
  }, [isAuthenticated, navigate, toast]);

  if (!isAuthenticated || loading) {
    return null;
  }

  const userDonations = donations.filter(donation => donation.userId === user?._id);
  const upcomingCamps = camps.filter(camp => new Date(camp.date) > new Date());
  const userRequests = requests.filter(request => request.createdBy._id === user?._id);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Welcome, {user?.name}</h1>
      
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="donations">My Donations</TabsTrigger>
          <TabsTrigger value="camps">Upcoming Camps</TabsTrigger>
          <TabsTrigger value="requests">My Requests</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  Total Donations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{userDonations.length}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Upcoming Camps
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{upcomingCamps.length}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Active Requests
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{userRequests.length}</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="donations">
          <div className="grid gap-4 mt-4">
            {userDonations.map((donation) => (
              <Card key={donation._id}>
                <CardHeader>
                  <CardTitle>Donation #{donation._id}</CardTitle>
                  <CardDescription>
                    Date: {new Date(donation.date).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Blood Type: {donation.bloodType}</p>
                  <p>Location: {donation.location}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="camps">
          <div className="grid gap-4 mt-4">
            {upcomingCamps.map((camp) => (
              <Card key={camp._id}>
                <CardHeader>
                  <CardTitle>{camp.name}</CardTitle>
                  <CardDescription>
                    Date: {new Date(camp.date).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Location: {camp.location}</p>
                  <p>Organizer: {camp.organizer}</p>
                  <p>Contact: {camp.contact}</p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    Register for Camp
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="requests">
          <div className="grid gap-4 mt-4">
            {userRequests.map((request) => (
              <Card key={request._id}>
                <CardHeader>
                  <CardTitle>Request #{request._id}</CardTitle>
                  <CardDescription>
                    Status: {request.status}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Patient: {request.patientName}</p>
                  <p>Blood Type: {request.bloodType}</p>
                  <p>Hospital: {request.hospital}</p>
                  <p>Required Units: {request.requiredUnits}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserPanel; 