
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Tent, AlertTriangle, Users, Edit, Trash2, Plus } from "lucide-react";

const Admin = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const { camps, urgentRequests, donors, addCamp, updateCamp, deleteCamp, addUrgentRequest, updateUrgentRequest, deleteUrgentRequest } = useData();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [campForm, setCampForm] = useState({
    name: "",
    location: "",
    date: "",
    time: "",
    organizer: "",
    contact: "",
  });

  const [urgentRequestForm, setUrgentRequestForm] = useState({
    patientName: "",
    bloodType: "",
    hospital: "",
    contact: "",
    requiredUnits: 1,
    isUrgent: true,
  });

  const [editingCamp, setEditingCamp] = useState<string | null>(null);
  const [editingRequest, setEditingRequest] = useState<string | null>(null);
  const [showCampForm, setShowCampForm] = useState(false);
  const [showRequestForm, setShowRequestForm] = useState(false);

  // Redirect if not logged in or not admin
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

  // Reset forms when dialogs close
  const resetCampForm = () => {
    setCampForm({
      name: "",
      location: "",
      date: "",
      time: "",
      organizer: "",
      contact: "",
    });
    setEditingCamp(null);
  };

  const resetRequestForm = () => {
    setUrgentRequestForm({
      patientName: "",
      bloodType: "",
      hospital: "",
      contact: "",
      requiredUnits: 1,
      isUrgent: true,
    });
    setEditingRequest(null);
  };

  // Handle camp form submission
  const handleCampSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCamp) {
      updateCamp(editingCamp, campForm);
      toast({
        title: "Camp Updated",
        description: "The donation camp has been updated successfully",
      });
    } else {
      addCamp(campForm);
      toast({
        title: "Camp Added",
        description: "New donation camp has been added successfully",
      });
    }
    setShowCampForm(false);
    resetCampForm();
  };

  // Handle urgent request form submission
  const handleRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingRequest) {
      updateUrgentRequest(editingRequest, urgentRequestForm);
      toast({
        title: "Request Updated",
        description: "The urgent request has been updated successfully",
      });
    } else {
      addUrgentRequest(urgentRequestForm);
      toast({
        title: "Request Added",
        description: "New urgent request has been added successfully",
      });
    }
    setShowRequestForm(false);
    resetRequestForm();
  };

  // Edit camp
  const handleEditCamp = (campId: string) => {
    const camp = camps.find((c) => c.id === campId);
    if (camp) {
      setCampForm({
        name: camp.name,
        location: camp.location,
        date: camp.date,
        time: camp.time,
        organizer: camp.organizer,
        contact: camp.contact,
      });
      setEditingCamp(campId);
      setShowCampForm(true);
    }
  };

  // Delete camp
  const handleDeleteCamp = (campId: string) => {
    deleteCamp(campId);
    toast({
      title: "Camp Deleted",
      description: "The donation camp has been deleted",
    });
  };

  // Edit request
  const handleEditRequest = (requestId: string) => {
    const request = urgentRequests.find((r) => r.id === requestId);
    if (request) {
      setUrgentRequestForm({
        patientName: request.patientName,
        bloodType: request.bloodType,
        hospital: request.hospital,
        contact: request.contact,
        requiredUnits: request.requiredUnits,
        isUrgent: request.isUrgent,
      });
      setEditingRequest(requestId);
      setShowRequestForm(true);
    }
  };

  // Delete request
  const handleDeleteRequest = (requestId: string) => {
    deleteUrgentRequest(requestId);
    toast({
      title: "Request Deleted",
      description: "The urgent request has been deleted",
    });
  };

  if (!isAuthenticated || !isAdmin) {
    return null; // Will redirect in the useEffect
  }

  return (
    <div className="container px-4 mx-auto py-10">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">
            Manage donation camps, urgent requests, and donor information
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <Card>
            <CardHeader className="bg-blood-50 pb-4">
              <CardTitle className="flex items-center">
                <Tent className="h-5 w-5 mr-2" />
                Donation Camps
              </CardTitle>
              <CardDescription>
                {camps.length} camps available
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <Button className="w-full" onClick={() => {
                resetCampForm();
                setShowCampForm(true);
              }}>
                <Plus className="h-4 w-4 mr-2" />
                Add New Camp
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="bg-blood-50 pb-4">
              <CardTitle className="flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2" />
                Urgent Requests
              </CardTitle>
              <CardDescription>
                {urgentRequests.length} active requests
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <Button className="w-full" onClick={() => {
                resetRequestForm();
                setShowRequestForm(true);
              }}>
                <Plus className="h-4 w-4 mr-2" />
                Add New Request
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="bg-blood-50 pb-4">
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Registered Donors
              </CardTitle>
              <CardDescription>
                {donors.length} registered donors
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <Button className="w-full" asChild>
                <a href="/donor">
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Donor
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="camps">
          <TabsList className="mb-6">
            <TabsTrigger value="camps">Donation Camps</TabsTrigger>
            <TabsTrigger value="requests">Urgent Requests</TabsTrigger>
            <TabsTrigger value="donors">Donors</TabsTrigger>
          </TabsList>

          {/* Camps Tab */}
          <TabsContent value="camps">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Manage Donation Camps</CardTitle>
                  <Button onClick={() => {
                    resetCampForm();
                    setShowCampForm(true);
                  }}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Camp
                  </Button>
                </div>
                <CardDescription>
                  Add, edit or remove blood donation camps
                </CardDescription>
              </CardHeader>
              <CardContent>
                {camps.length === 0 ? (
                  <div className="text-center py-10">
                    <h3 className="text-lg font-medium text-gray-600 mb-2">No camps available</h3>
                    <p className="text-gray-500 mb-4">Start by adding a new donation camp</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-50 border-b">
                          <th className="text-left p-3">Name</th>
                          <th className="text-left p-3">Location</th>
                          <th className="text-left p-3">Date</th>
                          <th className="text-left p-3">Time</th>
                          <th className="text-left p-3">Organizer</th>
                          <th className="text-center p-3">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {camps.map((camp) => (
                          <tr key={camp.id} className="border-b">
                            <td className="p-3">{camp.name}</td>
                            <td className="p-3">{camp.location}</td>
                            <td className="p-3">{new Date(camp.date).toLocaleDateString()}</td>
                            <td className="p-3">{camp.time}</td>
                            <td className="p-3">{camp.organizer}</td>
                            <td className="p-3">
                              <div className="flex justify-center space-x-2">
                                <Button variant="outline" size="sm" onClick={() => handleEditCamp(camp.id)}>
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="destructive" size="sm" onClick={() => handleDeleteCamp(camp.id)}>
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Requests Tab */}
          <TabsContent value="requests">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Manage Urgent Requests</CardTitle>
                  <Button onClick={() => {
                    resetRequestForm();
                    setShowRequestForm(true);
                  }}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Request
                  </Button>
                </div>
                <CardDescription>
                  Add, edit or remove urgent blood requests
                </CardDescription>
              </CardHeader>
              <CardContent>
                {urgentRequests.length === 0 ? (
                  <div className="text-center py-10">
                    <h3 className="text-lg font-medium text-gray-600 mb-2">No urgent requests</h3>
                    <p className="text-gray-500 mb-4">Add a new urgent request when needed</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-50 border-b">
                          <th className="text-left p-3">Patient</th>
                          <th className="text-left p-3">Blood Type</th>
                          <th className="text-left p-3">Hospital</th>
                          <th className="text-left p-3">Contact</th>
                          <th className="text-left p-3">Units</th>
                          <th className="text-left p-3">Status</th>
                          <th className="text-center p-3">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {urgentRequests.map((request) => (
                          <tr key={request.id} className="border-b">
                            <td className="p-3">{request.patientName}</td>
                            <td className="p-3 font-bold text-blood-600">{request.bloodType}</td>
                            <td className="p-3">{request.hospital}</td>
                            <td className="p-3">{request.contact}</td>
                            <td className="p-3">{request.requiredUnits}</td>
                            <td className="p-3">
                              {request.isUrgent ? (
                                <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">
                                  Urgent
                                </span>
                              ) : (
                                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                                  Regular
                                </span>
                              )}
                            </td>
                            <td className="p-3">
                              <div className="flex justify-center space-x-2">
                                <Button variant="outline" size="sm" onClick={() => handleEditRequest(request.id)}>
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="destructive" size="sm" onClick={() => handleDeleteRequest(request.id)}>
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Donors Tab */}
          <TabsContent value="donors">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Manage Donors</CardTitle>
                  <Button asChild>
                    <a href="/donor">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Donor
                    </a>
                  </Button>
                </div>
                <CardDescription>
                  View and manage registered blood donors
                </CardDescription>
              </CardHeader>
              <CardContent>
                {donors.length === 0 ? (
                  <div className="text-center py-10">
                    <h3 className="text-lg font-medium text-gray-600 mb-2">No registered donors</h3>
                    <p className="text-gray-500 mb-4">Donors will appear here after registration</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-50 border-b">
                          <th className="text-left p-3">Name</th>
                          <th className="text-left p-3">Email</th>
                          <th className="text-left p-3">Phone</th>
                          <th className="text-left p-3">Blood Type</th>
                          <th className="text-left p-3">Age</th>
                          <th className="text-left p-3">Last Donation</th>
                          <th className="text-center p-3">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {donors.map((donor) => (
                          <tr key={donor.id} className="border-b">
                            <td className="p-3">{donor.name}</td>
                            <td className="p-3">{donor.email}</td>
                            <td className="p-3">{donor.phone}</td>
                            <td className="p-3 font-bold text-blood-600">{donor.bloodType}</td>
                            <td className="p-3">{donor.age}</td>
                            <td className="p-3">
                              {donor.lastDonation ? new Date(donor.lastDonation).toLocaleDateString() : "Never"}
                            </td>
                            <td className="p-3">
                              <div className="flex justify-center space-x-2">
                                <Button variant="outline" size="sm">
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Camp Form Dialog */}
      <Dialog open={showCampForm} onOpenChange={setShowCampForm}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingCamp ? "Edit Donation Camp" : "Add New Donation Camp"}</DialogTitle>
            <DialogDescription>
              Fill in the details for the blood donation camp
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCampSubmit}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <label htmlFor="camp-name" className="text-sm font-medium">
                  Camp Name
                </label>
                <Input
                  id="camp-name"
                  name="name"
                  value={campForm.name}
                  onChange={(e) => setCampForm({ ...campForm, name: e.target.value })}
                  placeholder="Enter camp name"
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="camp-location" className="text-sm font-medium">
                  Location
                </label>
                <Input
                  id="camp-location"
                  name="location"
                  value={campForm.location}
                  onChange={(e) => setCampForm({ ...campForm, location: e.target.value })}
                  placeholder="Enter location"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="camp-date" className="text-sm font-medium">
                    Date
                  </label>
                  <Input
                    id="camp-date"
                    name="date"
                    type="date"
                    value={campForm.date}
                    onChange={(e) => setCampForm({ ...campForm, date: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="camp-time" className="text-sm font-medium">
                    Time
                  </label>
                  <Input
                    id="camp-time"
                    name="time"
                    value={campForm.time}
                    onChange={(e) => setCampForm({ ...campForm, time: e.target.value })}
                    placeholder="e.g. 9:00 AM - 5:00 PM"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="camp-organizer" className="text-sm font-medium">
                  Organizer
                </label>
                <Input
                  id="camp-organizer"
                  name="organizer"
                  value={campForm.organizer}
                  onChange={(e) => setCampForm({ ...campForm, organizer: e.target.value })}
                  placeholder="Enter organizer name"
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="camp-contact" className="text-sm font-medium">
                  Contact
                </label>
                <Input
                  id="camp-contact"
                  name="contact"
                  value={campForm.contact}
                  onChange={(e) => setCampForm({ ...campForm, contact: e.target.value })}
                  placeholder="Enter contact number"
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setShowCampForm(false);
                  resetCampForm();
                }}
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-blood-600 hover:bg-blood-700">
                {editingCamp ? "Update Camp" : "Add Camp"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Urgent Request Form Dialog */}
      <Dialog open={showRequestForm} onOpenChange={setShowRequestForm}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingRequest ? "Edit Urgent Request" : "Add New Urgent Request"}</DialogTitle>
            <DialogDescription>
              Fill in the details for the urgent blood request
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleRequestSubmit}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <label htmlFor="patient-name" className="text-sm font-medium">
                  Patient Name
                </label>
                <Input
                  id="patient-name"
                  name="patientName"
                  value={urgentRequestForm.patientName}
                  onChange={(e) => setUrgentRequestForm({ ...urgentRequestForm, patientName: e.target.value })}
                  placeholder="Enter patient name"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="blood-type" className="text-sm font-medium">
                    Blood Type
                  </label>
                  <select
                    id="blood-type"
                    name="bloodType"
                    value={urgentRequestForm.bloodType}
                    onChange={(e) => setUrgentRequestForm({ ...urgentRequestForm, bloodType: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blood-500"
                    required
                  >
                    <option value="">Select Blood Type</option>
                    {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="required-units" className="text-sm font-medium">
                    Required Units
                  </label>
                  <Input
                    id="required-units"
                    name="requiredUnits"
                    type="number"
                    min="1"
                    value={urgentRequestForm.requiredUnits}
                    onChange={(e) => setUrgentRequestForm({ ...urgentRequestForm, requiredUnits: parseInt(e.target.value) })}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="hospital" className="text-sm font-medium">
                  Hospital
                </label>
                <Input
                  id="hospital"
                  name="hospital"
                  value={urgentRequestForm.hospital}
                  onChange={(e) => setUrgentRequestForm({ ...urgentRequestForm, hospital: e.target.value })}
                  placeholder="Enter hospital name"
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="contact" className="text-sm font-medium">
                  Contact Number
                </label>
                <Input
                  id="contact"
                  name="contact"
                  value={urgentRequestForm.contact}
                  onChange={(e) => setUrgentRequestForm({ ...urgentRequestForm, contact: e.target.value })}
                  placeholder="Enter contact number"
                  required
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  id="is-urgent"
                  type="checkbox"
                  checked={urgentRequestForm.isUrgent}
                  onChange={(e) => setUrgentRequestForm({ ...urgentRequestForm, isUrgent: e.target.checked })}
                  className="h-4 w-4 text-blood-600 focus:ring-blood-500 border-gray-300 rounded"
                />
                <label htmlFor="is-urgent" className="text-sm font-medium">
                  Mark as Urgent
                </label>
              </div>
            </div>
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setShowRequestForm(false);
                  resetRequestForm();
                }}
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-blood-600 hover:bg-blood-700">
                {editingRequest ? "Update Request" : "Add Request"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Admin;
