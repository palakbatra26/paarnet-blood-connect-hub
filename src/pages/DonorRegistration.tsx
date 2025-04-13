
import { useState } from "react";
import { useData } from "@/context/DataContext";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

const DonorRegistration = () => {
  const { addDonor } = useData();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    bloodType: "",
    age: "",
    lastDonation: "",
    address: "",
    hasMedicalConditions: false,
    medicalConditions: "",
    agreeToTerms: false,
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phone: "",
    bloodType: "",
    age: "",
    agreeToTerms: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error when user types
    if (errors[name as keyof typeof errors]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData({ ...formData, [name]: checked });
    // Clear error for terms
    if (name === "agreeToTerms" && errors.agreeToTerms) {
      setErrors({ ...errors, agreeToTerms: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {
      name: formData.name ? "" : "Name is required",
      email: /^\S+@\S+\.\S+$/.test(formData.email) ? "" : "Valid email is required",
      phone: /^[0-9+\-\s]{10,15}$/.test(formData.phone) ? "" : "Valid phone number is required",
      bloodType: formData.bloodType ? "" : "Blood type is required",
      age: parseInt(formData.age) >= 18 ? "" : "You must be at least 18 years old",
      agreeToTerms: formData.agreeToTerms ? "" : "You must agree to the terms",
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Process medical conditions
    const medicalConditionsList = formData.hasMedicalConditions && formData.medicalConditions
      ? formData.medicalConditions.split(',').map(item => item.trim())
      : [];

    // Add donor to database
    addDonor({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      bloodType: formData.bloodType,
      age: parseInt(formData.age),
      lastDonation: formData.lastDonation || null,
      medicalConditions: medicalConditionsList,
    });

    // Show success message
    toast({
      title: "Registration Successful!",
      description: "Thank you for registering as a blood donor.",
    });

    // Redirect to home page
    navigate("/");
  };

  // Blood type options
  const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  return (
    <div className="container px-4 mx-auto py-10">
      <div className="max-w-3xl mx-auto">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold mb-2">Register as a Blood Donor</h1>
          <p className="text-gray-600">
            Your donation can save up to three lives. Register today to become a hero!
          </p>
        </div>

        <Card className="mb-10">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>
              Fill out the form below to register as a blood donor
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    Full Name <span className="text-blood-600">*</span>
                  </label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your full name"
                  />
                  {errors.name && <p className="text-sm text-blood-600">{errors.name}</p>}
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email <span className="text-blood-600">*</span>
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Your email address"
                  />
                  {errors.email && <p className="text-sm text-blood-600">{errors.email}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="phone" className="text-sm font-medium">
                    Phone Number <span className="text-blood-600">*</span>
                  </label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Your phone number"
                  />
                  {errors.phone && <p className="text-sm text-blood-600">{errors.phone}</p>}
                </div>
                <div className="space-y-2">
                  <label htmlFor="bloodType" className="text-sm font-medium">
                    Blood Type <span className="text-blood-600">*</span>
                  </label>
                  <select
                    id="bloodType"
                    name="bloodType"
                    value={formData.bloodType}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blood-500"
                  >
                    <option value="">Select Blood Type</option>
                    {bloodTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                  {errors.bloodType && <p className="text-sm text-blood-600">{errors.bloodType}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="age" className="text-sm font-medium">
                    Age <span className="text-blood-600">*</span>
                  </label>
                  <Input
                    id="age"
                    name="age"
                    type="number"
                    min="18"
                    max="65"
                    value={formData.age}
                    onChange={handleChange}
                    placeholder="Your age"
                  />
                  {errors.age && <p className="text-sm text-blood-600">{errors.age}</p>}
                </div>
                <div className="space-y-2">
                  <label htmlFor="lastDonation" className="text-sm font-medium">
                    Last Donation Date (if any)
                  </label>
                  <Input
                    id="lastDonation"
                    name="lastDonation"
                    type="date"
                    value={formData.lastDonation}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="address" className="text-sm font-medium">
                  Address
                </label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Your address"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="hasMedicalConditions"
                    checked={formData.hasMedicalConditions}
                    onCheckedChange={(checked) => 
                      handleCheckboxChange("hasMedicalConditions", checked as boolean)
                    }
                  />
                  <label htmlFor="hasMedicalConditions" className="text-sm font-medium">
                    I have medical conditions that might affect blood donation
                  </label>
                </div>
                
                {formData.hasMedicalConditions && (
                  <div className="mt-2">
                    <label htmlFor="medicalConditions" className="text-sm font-medium">
                      Please list your medical conditions
                    </label>
                    <Input
                      id="medicalConditions"
                      name="medicalConditions"
                      value={formData.medicalConditions}
                      onChange={handleChange}
                      placeholder="List conditions separated by commas"
                    />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onCheckedChange={(checked) => 
                      handleCheckboxChange("agreeToTerms", checked as boolean)
                    }
                  />
                  <label htmlFor="agreeToTerms" className="text-sm font-medium">
                    I agree to the terms and conditions for blood donation
                  </label>
                </div>
                {errors.agreeToTerms && <p className="text-sm text-blood-600">{errors.agreeToTerms}</p>}
              </div>
            </CardContent>
            <CardFooter className="border-t bg-gray-50 py-4">
              <Button 
                type="submit" 
                className="w-full bg-blood-600 hover:bg-blood-700"
                disabled={!isAuthenticated}
              >
                {isAuthenticated ? "Register as Donor" : "Login to Register"}
              </Button>
            </CardFooter>
          </form>
        </Card>

        <div className="bg-gray-50 rounded-lg p-6 border">
          <h3 className="font-semibold text-lg mb-3">Eligibility Requirements</h3>
          <ul className="space-y-2 text-gray-700 list-disc pl-5">
            <li>You must be at least 18 years old</li>
            <li>You must weigh at least 110 pounds (50 kg)</li>
            <li>You must be in good health</li>
            <li>You must not have donated blood in the last 56 days</li>
            <li>You must have normal blood pressure and hemoglobin levels</li>
            <li>You must not have certain medical conditions (hepatitis, HIV, etc.)</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DonorRegistration;
