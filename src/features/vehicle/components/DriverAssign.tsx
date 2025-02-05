import React, { useState } from "react";
import { Vehicle, Driver } from "@/types/vehicle";
import api from "@/api/axios";

interface DriverAssignProps {
  vehicle: Vehicle;
  drivers: Driver[];
  onSubmit: () => void;
  onClose: () => void;
}

const DriverAssign: React.FC<DriverAssignProps> = ({
  vehicle,
  drivers,
  onSubmit,
  onClose,
}) => {
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);

  // 미배정 기사만 필터링
  const availableDrivers = drivers.filter(driver => !driver.sh_idx);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDriver) return;

    setError("");
    setIsLoading(true);

    try {
      const driverAssignData = {
        sh_idx: vehicle.sh_idx,
        us_idx: selectedDriver.us_idx,
      };

      const response = await api.put("/shuttle/driver", driverAssignData);
      if (response.data.code === 1) {
        onSubmit();
        onClose();
      } else {
        throw new Error(response.data.message || "기사 배정에 실패했습니다.");
      }
    } catch (err: Error | unknown) {
      const errorMessage = err instanceof Error ? err.message : "알 수 없는 에러가 발생했습니다.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 w-96 overflow-y-auto bg-white p-6 shadow-lg">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold">{vehicle.sh_name} 기사 배정</h2>
        <button onClick={onClose} className="text-gray-500">
          ✕
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded bg-red-100 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* 차량 정보 표시 */}
        <div>
          <h3 className="mb-2 font-medium">차량 정보</h3>
          <div className="rounded bg-gray-50 p-3">
            <p>차량명: {vehicle.sh_name}</p>
            <p>최대 인원: {vehicle.sh_max_cnt}명</p>
          </div>
        </div>

        {/* 기사 목록 */}
        <div>
          <h3 className="mb-2 font-medium">기사 선택</h3>
          <div className="h-[calc(100vh-24rem)] overflow-y-auto rounded border">
            <div className="space-y-2 p-2">
              {availableDrivers.map((driver) => (
                <div
                  key={driver.us_idx}
                  className={`cursor-pointer rounded p-3 hover:bg-gray-50 ${
                    selectedDriver?.us_idx === driver.us_idx
                      ? "bg-blue-50 ring-2 ring-blue-500"
                      : ""
                  }`}
                  onClick={() => setSelectedDriver(driver)}
                >
                  <div className="font-medium">{driver.us_name}</div>
                  <div className="text-sm text-gray-500">
                    ID: {driver.us_id}
                  </div>
                  <div className="text-sm text-gray-500">
                    연락처: {driver.us_contact}
                  </div>
                </div>
              ))}
              {availableDrivers.length === 0 && (
                <div className="p-4 text-center text-gray-500">
                  배정 가능한 기사가 없습니다
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300"
            disabled={isLoading}
          >
            취소
          </button>
          <button
            type="submit"
            className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:bg-blue-300"
            disabled={isLoading || !selectedDriver}
          >
            {isLoading ? "처리 중..." : "기사 배정"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DriverAssign;
