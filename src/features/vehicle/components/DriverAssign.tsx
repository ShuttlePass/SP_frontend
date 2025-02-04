import React, { useState, useEffect } from "react";
import { Vehicle } from "../../../types/vehicle";
import api from "@/api/axios";

interface DriverAssignProps {
  vehicle: Vehicle;
  onSubmit: (data: any) => void;
  onClose: () => void;
}

interface Driver {
  us_idx: number;
  us_id: string;
  us_level: string;
  company_idx: number;
  us_contact: string;
  us_name: string;
  sh_idx: number | null;
}

const DriverAssign: React.FC<DriverAssignProps> = ({
  vehicle,
  onSubmit,
  onClose,
}) => {
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [searchKeyword, setSearchKeyword] = useState("");

  // 기사 목록 가져오기
  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const response = await api.get("/user", {
          params: {
            us_level: "driver",
          },
        });

        if (response.data.code === 1) {
          const availableDrivers = response.data.data.filter(
            (driver: Driver) => driver.sh_idx === null,
          );
          setDrivers(availableDrivers);
        }
      } catch (err) {
        console.error("기사 목록 조회 실패:", err);
        setError("기사 목록을 불러오는데 실패했습니다.");
      }
    };

    fetchDrivers();
  }, []);

  // 기사 검색 필터링
  const filteredDrivers = drivers.filter(
    (driver) =>
      driver.us_name.includes(searchKeyword) ||
      driver.us_contact.includes(searchKeyword) ||
      driver.us_id.includes(searchKeyword),
  );

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

      // baseURL이 올바르게 설정되어 있는지 확인
      console.log('Sending request to:', `${import.meta.env.VITE_API_SERVER_URL}/shuttle/driver`);
      
      const response = await api.put("/shuttle/driver", driverAssignData);
      
      if (response.data.code === 1) {
        onSubmit(response.data);
        onClose();
      } else {
        throw new Error(response.data.message || "기사 배정에 실패했습니다.");
      }
    } catch (err: any) {
      console.error("API Error Details:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "기사 배정에 실패했습니다. 네트워크 연결을 확인해주세요."
      );
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

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 차량 정보 표시 */}
        <div>
          <h3 className="mb-2 font-medium">차량 정보</h3>
          <div className="rounded bg-gray-50 p-3">
            <p>차량명: {vehicle.sh_name}</p>
            <p>최대 인원: {vehicle.sh_max_cnt}명</p>
          </div>
        </div>

        {/* 기사 검색 및 선택 */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            배정할 기사 선택
          </label>
          <input
            type="text"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            className="w-full rounded border p-2"
            placeholder="기사 이름, ID 또는 연락처 검색"
          />

          {searchKeyword && (
            <div className="mt-2 max-h-48 overflow-y-auto rounded border">
              {filteredDrivers.map((driver) => (
                <div
                  key={driver.us_idx}
                  className="cursor-pointer p-2 hover:bg-gray-100"
                  onClick={() => {
                    setSelectedDriver(driver);
                    setSearchKeyword("");
                  }}
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
              {filteredDrivers.length === 0 && (
                <div className="p-2 text-gray-500">검색 결과가 없습니다</div>
              )}
            </div>
          )}

          {selectedDriver && (
            <div className="mt-2 rounded bg-gray-50 p-3">
              <div className="font-medium">선택된 기사</div>
              <div>{selectedDriver.us_name}</div>
              <div className="text-sm text-gray-500">
                ID: {selectedDriver.us_id}
              </div>
              <div className="text-sm text-gray-500">
                연락처: {selectedDriver.us_contact}
              </div>
              <button
                type="button"
                onClick={() => setSelectedDriver(null)}
                className="mt-2 text-sm text-red-500"
              >
                선택 해제
              </button>
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-end space-x-2">
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