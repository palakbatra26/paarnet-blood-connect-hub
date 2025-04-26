import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Tent, AlertTriangle, Users, Edit, Trash2, Plus } from "lucide-react";
import axios from "axios";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  bloodType: string;
  phone: string;
}

interface Camp {
  _id: string;
  name: string;
  date: string;
  location: string;
  organizer: string;
  contact: string;
  status: string;
  maxDonors: number;
  registeredDonors: any[];
}

interface Request {
  _id: string;
  patientName: string;
  bloodType: string;
  hospital: string;
  requiredUnits: number;
  status: string;
  createdBy?: {
    name: string;
  };
}

const Admin = () => {
  const { isAuthenticated, isAdmin, token } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [users, setUsers] = useState<User[]>([]);
  const [camps, setCamps] = useState<Camp[]>([]);
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch all data
  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        toast({
          title: "Error",
          description: "Authentication token not found",
          variant: "destructive",
        });
        return;
      }

      try {
        const [usersRes, campsRes, requestsRes] = await Promise.all([
          axios.get('http://localhost:5000/api/users', {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get('http://localhost:5000/api/camps', {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get('http://localhost:5000/api/requests', {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        setUsers(usersRes.data);
        setCamps(campsRes.data);
        setRequests(requestsRes.data);
        setLoading(false);
      } catch (error: any) {
        console.error('Error fetching data:', error);
        toast({
          title: "Error",
          description: error.response?.data?.message || "Failed to fetch data",
          variant: "destructive",
        });
        setLoading(false);
      }
    };

    if (isAuthenticated && isAdmin) {
      fetchData();
    }
  }, [isAuthenticated, isAdmin, token, toast]);

  // Redirect if not admin
  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      navigate("/login");
      toast({
        title: "Access Denied",
        description: "You must be an admin to access this page",
        variant: "destructive",
      });
    }
  }, [isAuthenticated, isAdmin, navigate, toast]);

  const handleUserStatusUpdate = async (userId: string, currentStatus: string) => {
    if (!token) {
      toast({
        title: "Error",
        description: "Authentication token not found",
        variant: "destructive",
      });
      return;
    }

    try {
      const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
      await axios.patch(
        `http://localhost:5000/api/users/${userId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUsers(users.map(user => 
        user._id === userId ? { ...user, status: newStatus } : user
      ));

      toast({
        title: "Success",
        description: `User status updated to ${newStatus}`,
      });
    } catch (error: any) {
      console.error('Error updating user status:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update user status",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="camps">Camps</TabsTrigger>
          <TabsTrigger value="requests">Requests</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Total Users</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{users.length}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Active Camps</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{camps.length}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Pending Requests</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">
                  {requests.filter(req => req.status === 'pending').length}
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users">
          <div className="grid gap-4 mt-4">
            {users.map(user => (
              <Card key={user._id}>
                <CardHeader>
                  <CardTitle>{user.name}</CardTitle>
                  <CardDescription>Email: {user.email}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Role: {user.role}</p>
                  <p>Status: {user.status}</p>
                  <p>Blood Type: {user.bloodType}</p>
                  <p>Phone: {user.phone}</p>
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="outline" 
                    onClick={() => handleUserStatusUpdate(user._id, user.status)}
                  >
                    {user.status === 'active' ? 'Suspend User' : 'Activate User'}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="camps">
          <div className="grid gap-4 mt-4">
            {camps.map(camp => (
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
                  <p>Status: {camp.status}</p>
                  <p>Registered Donors: {camp.registeredDonors.length}/{camp.maxDonors}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="requests">
          <div className="grid gap-4 mt-4">
            {requests.map(request => (
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
                  <p>Created By: {request.createdBy?.name}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;
