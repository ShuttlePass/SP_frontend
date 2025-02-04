import React, { useState, useEffect } from "react";
import AdminSidebar from "@/features/manager/AdminSidebar";
import VehicleInfo from "../../features/vehicle/components/VehicleInfo";
import VehicleRegister from "../../features/vehicle/components/VehicleRegister";
import DriverAssign from "../../features/vehicle/components/DriverAssign";
import { Vehicle } from "../../types/vehicle";
import api from "@/api/axios";

const VehiclePage: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    setIsLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token"); // accessToken에서 token으로 변경

      if (!token) {
        window.location.href = "/signin";
        return;
      }

      const response = await api.get("/shuttle/car");
      setVehicles(response.data.data);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "차량 목록을 불러오는데 실패했습니다.";
      setError(errorMessage);
      console.error("차량 목록을 불러오는데 실패했습니다:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/signin";
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVehicleSelect = (vehicle: Vehicle) => {
    // 기사 배정 여부와 관계없이 차량 선택 가능하도록 수정
    setSelectedVehicle(vehicle);
  };

  const handleRegisterClick = () => {
    setIsRegistering(true);
    setSelectedVehicle(null);
  };

  const handleSubmit = async (data: any) => {
    await fetchVehicles(); // 목록 새로고침
  };

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1 p-8">
        <h1 className="mb-6 text-2xl font-bold">차량 목록</h1>
        {error && (
          <div className="mb-4 rounded bg-red-100 p-4 text-red-700">
            {error}
          </div>
        )}
        <div className="flex">
          <VehicleInfo
            vehicles={vehicles}
            onVehicleSelect={handleVehicleSelect}
            onRegisterClick={handleRegisterClick}
          />
          {isRegistering && (
            <VehicleRegister
              onSubmit={handleSubmit}
              onClose={() => setIsRegistering(false)}
            />
          )}
          {selectedVehicle && (
            <div className="fixed inset-y-0 right-0 w-96 overflow-y-auto bg-white p-6 shadow-lg">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-bold">
                  {selectedVehicle.sh_name} 정보
                </h2>
                <button
                  onClick={() => setSelectedVehicle(null)}
                  className="text-gray-500"
                >
                  ✕
                </button>
              </div>
              <div className="space-y-6">
                <div className="rounded bg-gray-50 p-3">
                  <p>차량명: {selectedVehicle.sh_name}</p>
                  <p>최대 인원: {selectedVehicle.sh_max_cnt}명</p>
                  <p>
                    상태:{" "}
                    {selectedVehicle.us_idx ? (
                      <span className="font-medium text-blue-600">
                        배정 완료
                      </span>
                    ) : (
                      <span className="font-medium text-gray-600">
                        배정 안됨
                      </span>
                    )}
                  </p>
                  {selectedVehicle.us_idx && (
                    <>
                      <p>현재 기사: {selectedVehicle.us_name}</p>
                      <p>연락처: {selectedVehicle.us_contact}</p>
                    </>
                  )}
                </div>
                <div>
                  <h3 className="mb-2 text-lg font-medium">
                    {selectedVehicle.us_idx ? "기사 재배정" : "기사 배정"}
                  </h3>
                  <DriverAssign
                    vehicle={selectedVehicle}
                    onSubmit={handleSubmit}
                    onClose={() => setSelectedVehicle(null)}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VehiclePage;
