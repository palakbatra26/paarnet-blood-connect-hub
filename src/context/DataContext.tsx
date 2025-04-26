import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface BloodCamp {
  id: string;
  name: string;
  location: string;
  date: string;
  time: string;
  organizer: string;
  contact: string;
}

interface UrgentRequest {
  id: string;
  patientName: string;
  bloodType: string;
  hospital: string;
  contact: string;
  requiredUnits: number;
  createdAt: string;
  status: string;
  isUrgent: boolean;
}

interface Donor {
  id: string;
  name: string;
  email: string;
  phone: string;
  bloodType: string;
  age: number;
  lastDonation: string | null;
  medicalConditions: string[];
}

interface DataContextType {
  camps: BloodCamp[];
  urgentRequests: UrgentRequest[];
  donors: Donor[];
  addCamp: (camp: Omit<BloodCamp, "id">) => void;
  updateCamp: (id: string, camp: Partial<BloodCamp>) => void;
  deleteCamp: (id: string) => void;
  addUrgentRequest: (request: Omit<UrgentRequest, "id" | "createdAt">) => void;
  updateUrgentRequest: (id: string, request: Partial<UrgentRequest>) => void;
  deleteUrgentRequest: (id: string) => void;
  addDonor: (donor: Omit<Donor, "id">) => void;
}

// Mock initial data
const initialCamps: BloodCamp[] = [
  {
    id: "camp1",
    name: "City Hospital Blood Drive",
    location: "City Hospital, Main Building",
    date: "2025-05-01",
    time: "09:00 AM - 05:00 PM",
    organizer: "City Hospital",
    contact: "+1-555-123-4567",
  },
  {
    id: "camp2",
    name: "Community Center Blood Drive",
    location: "Downtown Community Center",
    date: "2025-05-15",
    time: "10:00 AM - 06:00 PM",
    organizer: "Red Heart Foundation",
    contact: "+1-555-987-6543",
  },
  {
    id: "camp3",
    name: "University Campus Donation",
    location: "University Stadium",
    date: "2025-05-20",
    time: "11:00 AM - 04:00 PM",
    organizer: "Medical Students Association",
    contact: "+1-555-234-5678",
  },
];

const initialUrgentRequests: UrgentRequest[] = [
  {
    id: "req1",
    patientName: "John Doe",
    bloodType: "O-",
    hospital: "General Hospital",
    contact: "+1-555-111-2222",
    requiredUnits: 3,
    createdAt: "2025-04-12T10:30:00",
    status: "Pending",
    isUrgent: true,
  },
  {
    id: "req2",
    patientName: "Jane Smith",
    bloodType: "AB+",
    hospital: "Medical Center",
    contact: "+1-555-333-4444",
    requiredUnits: 2,
    createdAt: "2025-04-13T09:15:00",
    status: "Pending",
    isUrgent: true,
  },
];

const initialDonors: Donor[] = [];

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [camps, setCamps] = useState<BloodCamp[]>(initialCamps);
  const [urgentRequests, setUrgentRequests] = useState<UrgentRequest[]>(initialUrgentRequests);
  const [donors, setDonors] = useState<Donor[]>(initialDonors);

  // Camp operations
  const addCamp = (camp: Omit<BloodCamp, "id">) => {
    const newCamp = {
      ...camp,
      id: `camp-${Date.now()}`,
    };
    setCamps([...camps, newCamp]);
  };

  const updateCamp = (id: string, updatedCamp: Partial<BloodCamp>) => {
    setCamps(
      camps.map((camp) => (camp.id === id ? { ...camp, ...updatedCamp } : camp))
    );
  };

  const deleteCamp = (id: string) => {
    setCamps(camps.filter((camp) => camp.id !== id));
  };

  // Urgent Request operations
  const addUrgentRequest = (request: Omit<UrgentRequest, "id" | "createdAt">) => {
    const newRequest = {
      ...request,
      id: `req-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setUrgentRequests([...urgentRequests, newRequest]);
  };

  const updateUrgentRequest = (id: string, updatedRequest: Partial<UrgentRequest>) => {
    setUrgentRequests(
      urgentRequests.map((request) =>
        request.id === id ? { ...request, ...updatedRequest } : request
      )
    );
  };

  const deleteUrgentRequest = (id: string) => {
    setUrgentRequests(urgentRequests.filter((request) => request.id !== id));
  };

  // Donor operations
  const addDonor = (donor: Omit<Donor, "id">) => {
    const newDonor = {
      ...donor,
      id: `donor-${Date.now()}`,
    };
    setDonors([...donors, newDonor]);
  };

  return (
    <DataContext.Provider
      value={{
        camps,
        urgentRequests,
        donors,
        addCamp,
        updateCamp,
        deleteCamp,
        addUrgentRequest,
        updateUrgentRequest,
        deleteUrgentRequest,
        addDonor,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};
