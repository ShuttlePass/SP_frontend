import React, { useState } from "react";
import AdminSidebar from "../../components/layout/sidebar";
import VehicleInfo from "../../features/vehicle/components/VehicleInfo";
import VehicleRegister from "../../features/vehicle/components/VehicleRegister";
import { Vehicle } from "../../types/vehicle";
import { MOCK_VEHICLES } from "@/mocks/mockData";

const VehiclePage: React.FC = () => {
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | undefined>();
  const [isRegistering, setIsRegistering] = useState(false);

  const handleVehicleSelect = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setIsRegistering(true);
  };

  const handleRegisterClick = () => {
    setSelectedVehicle(undefined);
    setIsRegistering(true);
  };

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1 p-8">
        <h1 className="mb-6 text-2xl font-bold">차량 관리</h1>
        <div className="flex">
          <VehicleInfo
            vehicles={MOCK_VEHICLES.rows}
            onVehicleSelect={handleVehicleSelect}
            onRegisterClick={handleRegisterClick}
          />
          {isRegistering && (
            <VehicleRegister
              vehicle={selectedVehicle}
              onClose={() => setIsRegistering(false)}
              onSubmit={(data) => {
                console.log("Vehicle data:", data);
                setIsRegistering(false);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default VehiclePage;
