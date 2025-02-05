import React, { useState, useEffect, useCallback } from "react";
import AdminSidebar from "@/features/manager/AdminSidebar";
import VehicleInfo from "../../features/vehicle/components/VehicleInfo";
import VehicleRegister from "../../features/vehicle/components/VehicleRegister";
import DriverAssign from "../../features/vehicle/components/DriverAssign";
import { Vehicle, Driver } from "../../types/vehicle";
import api from "@/api/axios";
import { AxiosError } from "axios";
import { formatPhoneNumber } from '@/utils/format';

interface ApiErrorResponse {
  message: string;
  status: number;
}

const VehiclePage: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [showDriverList, setShowDriverList] = useState(false);

  const fetchDrivers = useCallback(async () => {
    try {
      const response = await api.get("/user", {
        params: {
          us_level: "driver"
        }
      });
      setDrivers(response.data.data);
    } catch (error) {
      console.error("기사 목록을 불러오는데 실패했습니다:", error);
    }
  }, []);

  const fetchVehicles = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        window.location.href = "/signin";
        return;
      }

      const response = await api.get("/shuttle/car");
      const formattedVehicles = response.data.data.map((vehicle: Vehicle) => {
        if (vehicle.us_idx) {
          const assignedDriver = drivers.find(driver => driver.us_idx === vehicle.us_idx);
          if (assignedDriver) {
            return {
              ...vehicle,
              us_id: assignedDriver.us_id,
              us_contact: assignedDriver.us_contact
            };
          }
        }
        return vehicle;
      });
      setVehicles(formattedVehicles);
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      const errorMessage =
        axiosError.response?.data?.message || "차량 목록을 불러오는데 실패했습니다.";
      setError(errorMessage);
      console.error("차량 목록을 불러오는데 실패했습니다:", error);

      if (axiosError.response?.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/signin";
      }
    } finally {
      setIsLoading(false);
    }
  }, [drivers]);

  useEffect(() => {
    fetchDrivers();
  }, [fetchDrivers]);

  useEffect(() => {
    if (drivers.length > 0) {
      fetchVehicles();
    }
  }, [drivers, fetchVehicles]);

  const handleVehicleSelect = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
  };

  const handleRegisterClick = () => {
    setIsRegistering(true);
    setSelectedVehicle(null);
  };

  const handleSubmit = async () => {
    await fetchVehicles();
  };

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1 p-8">
        <h1 className="mb-6 text-2xl font-bold">차량 관리</h1>
        {error && (
          <div className="mb-4 rounded bg-red-100 p-4 text-red-700">
            {error}
          </div>
        )}
        <div className="flex gap-6">
          <div className="flex-1">
            <VehicleInfo
              vehicles={vehicles}
              onVehicleSelect={handleVehicleSelect}
              onRegisterClick={handleRegisterClick}
              onDriverListClick={() => setShowDriverList(true)}
            />
          </div>
        </div>

        {/* 기사 목록 모달 */}
        {showDriverList && (
          <div className="fixed inset-0 z-50 flex items-start justify-end bg-black bg-opacity-50 p-4">
            <div className="h-screen w-96 overflow-y-auto rounded-lg bg-white p-6 shadow-xl">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-bold">기사 목록</h2>
                <button
                  onClick={() => setShowDriverList(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              <div className="space-y-2">
                {drivers.map((driver) => (
                  <button
                    key={driver.us_idx}
                    className="w-full rounded-lg border p-3 text-left text-sm transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onClick={() => {/* 기사 상세 정보 보기 기능 추가 예정 */}}
                  >
                    <div className="font-medium">{driver.us_name}</div>
                    <div className="text-gray-600">{formatPhoneNumber(driver.us_contact)}</div>
                    <div className="text-gray-500">ID: {driver.us_id}</div>
                    <div className="mt-1">
                      <span className={`inline-block rounded-full px-2 py-0.5 text-xs ${
                        driver.us_idx 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {driver.us_idx ? '배정됨' : '미배정'}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {isRegistering && (
          <VehicleRegister
            onSubmit={handleSubmit}
            onClose={() => setIsRegistering(false)}
            drivers={drivers}
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
              <div className="rounded bg-gray-50 p-4">
                <h3 className="mb-3 font-medium">차량 정보</h3>
                <div className="space-y-2">
                  <p>차량명: {selectedVehicle.sh_name}</p>
                  <p>최대 인원: {selectedVehicle.sh_max_cnt}명</p>
                </div>
              </div>

              <div className="rounded bg-gray-50 p-4">
                <h3 className="mb-3 font-medium">기사 정보</h3>
                {selectedVehicle.us_idx ? (
                  <div className="space-y-2">
                    <p>이름: {selectedVehicle.us_name}</p>
                    <p>ID: {selectedVehicle.us_id}</p>
                    <p>연락처: {formatPhoneNumber(selectedVehicle.us_contact)}</p>
                    <p>상태: <span className="font-medium text-blue-600">배정 완료</span></p>
                  </div>
                ) : (
                  <p className="text-gray-500">배정된 기사가 없습니다</p>
                )}
              </div>

              <div className="rounded bg-gray-50 p-4">
                <h3 className="mb-3 font-medium">담당 지역</h3>
                <div className="flex flex-wrap gap-1">
                  {selectedVehicle.areas?.map((area) => (
                    <span
                      key={area.sa_idx}
                      className="inline-block rounded-full bg-blue-100 px-2 py-0.5 text-sm text-blue-800"
                    >
                      {area.ar_name}
                    </span>
                  ))}
                </div>
              </div>

              {!selectedVehicle.us_idx && (
                <div>
                  <h3 className="mb-2 text-lg font-medium">기사 배정</h3>
                  <DriverAssign
                    vehicle={selectedVehicle}
                    drivers={drivers.filter(driver => !driver.us_idx)}
                    onSubmit={handleSubmit}
                    onClose={() => setSelectedVehicle(null)}
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VehiclePage;
