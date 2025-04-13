
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { User, MailOpen, Phone, Shield, History, Award, LogOut } from "lucide-react";

const Profile = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Redirect if not logged in
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  // Mock donation history
  const donationHistory = [
    {
      id: "don1",
      date: "2025-01-15",
      location: "City Hospital",
      bloodType: "A+",
      units: 1,
    },
    {
      id: "don2",
      date: "2024-10-10",
      location: "Red Cross Mobile Unit",
      bloodType: "A+",
      units: 1,
    },
  ];

  // Mock badges/achievements
  const achievements = [
    {
      id: "badge1",
      name: "First Time Donor",
      description: "Completed your first blood donation",
      date: "2024-10-10",
      icon: <Award className="h-8 w-8 text-green-500" />,
    },
    {
      id: "badge2",
      name: "Regular Donor",
      description: "Donated blood multiple times",
      date: "2025-01-15",
      icon: <Award className="h-8 w-8 text-blue-500" />,
    },
  ];

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out",
    });
    navigate("/");
  };

  if (!isAuthenticated || !user) {
    return null; // Will redirect in the useEffect
  }

  return (
    <div className="container px-4 mx-auto py-10">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row items-start justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Profile</h1>
            <p className="text-gray-600">
              Manage your account and view your donation history
            </p>
          </div>
          <Button 
            variant="outline" 
            className="border-blood-600 text-blood-600"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2 text-blood-600" />
                Account Info
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium">{user.name}</p>
                </div>
                <div className="flex items-start">
                  <MailOpen className="h-4 w-4 text-gray-500 mr-2 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Shield className="h-4 w-4 text-gray-500 mr-2 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Role</p>
                    <p className="font-medium capitalize">{user.role}</p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t bg-gray-50 py-3">
              <Button variant="outline" className="w-full" asChild>
                <a href="#">Edit Profile</a>
              </Button>
            </CardFooter>
          </Card>

          <Card className="md:col-span-2">
            <Tabs defaultValue="history">
              <CardHeader className="pb-0">
                <div className="flex justify-between items-center">
                  <CardTitle>Blood Donation</CardTitle>
                  <TabsList>
                    <TabsTrigger value="history">History</TabsTrigger>
                    <TabsTrigger value="achievements">Achievements</TabsTrigger>
                  </TabsList>
                </div>
                <CardDescription>Your blood donation journey</CardDescription>
              </CardHeader>
              
              <TabsContent value="history">
                <CardContent className="pt-6">
                  {donationHistory.length === 0 ? (
                    <div className="text-center py-10">
                      <History className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-600 mb-2">No donation history yet</h3>
                      <p className="text-gray-500 mb-4">Start your donation journey today</p>
                      <Button className="bg-blood-600 hover:bg-blood-700" asChild>
                        <a href="/camps">Find Donation Camp</a>
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {donationHistory.map((donation) => (
                        <div key={donation.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">{new Date(donation.date).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}</p>
                              <p className="text-sm text-gray-600">{donation.location}</p>
                            </div>
                            <div className="text-center">
                              <span className="text-xl font-bold text-blood-600">{donation.bloodType}</span>
                              <p className="text-xs text-gray-500">{donation.units} unit(s)</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
                <CardFooter className="border-t bg-gray-50 py-3">
                  <Button variant="outline" className="w-full" asChild>
                    <a href="/camps">Schedule Next Donation</a>
                  </Button>
                </CardFooter>
              </TabsContent>
              
              <TabsContent value="achievements">
                <CardContent className="pt-6">
                  {achievements.length === 0 ? (
                    <div className="text-center py-10">
                      <Award className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-600 mb-2">No achievements yet</h3>
                      <p className="text-gray-500 mb-4">Start donating to earn badges</p>
                      <Button className="bg-blood-600 hover:bg-blood-700" asChild>
                        <a href="/camps">Find Donation Camp</a>
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {achievements.map((achievement) => (
                        <div key={achievement.id} className="border rounded-lg p-4 flex items-center">
                          <div className="mr-4">
                            {achievement.icon}
                          </div>
                          <div>
                            <p className="font-medium">{achievement.name}</p>
                            <p className="text-sm text-gray-600">{achievement.description}</p>
                            <p className="text-xs text-gray-500 mt-1">Earned on {new Date(achievement.date).toLocaleDateString()}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
                <CardFooter className="border-t bg-gray-50 py-3">
                  <Button variant="outline" className="w-full" asChild>
                    <a href="/donor">View Eligibility</a>
                  </Button>
                </CardFooter>
              </TabsContent>
            </Tabs>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Donation Camps</CardTitle>
            <CardDescription>Find a blood donation camp near you</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">City Hospital Blood Drive</p>
                    <p className="text-sm text-gray-600">May 1, 2025 • 09:00 AM - 05:00 PM</p>
                    <p className="text-sm text-gray-600">City Hospital, Main Building</p>
                  </div>
                  <Button className="bg-blood-600 hover:bg-blood-700" size="sm" asChild>
                    <a href="/camps">Register</a>
                  </Button>
                </div>
              </div>
              <div className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">Community Center Blood Drive</p>
                    <p className="text-sm text-gray-600">May 15, 2025 • 10:00 AM - 06:00 PM</p>
                    <p className="text-sm text-gray-600">Downtown Community Center</p>
                  </div>
                  <Button className="bg-blood-600 hover:bg-blood-700" size="sm" asChild>
                    <a href="/camps">Register</a>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t bg-gray-50 py-3">
            <Button variant="outline" className="w-full" asChild>
              <a href="/camps">View All Camps</a>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
