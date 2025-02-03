import React, { useState } from 'react';
import { Vehicle } from '../../../types/vehicle';
import ConfirmModal from '../../../components/common/ConfirmModal';
import AlertModal from '../../../components/common/AlertModal';

interface Driver {
  id: string;
  name: string;
  contact: string;
}

interface VehicleRegisterProps {
  vehicle?: Vehicle;
  onSubmit: (data: Vehicle) => void;
  onClose: () => void;
}

const VehicleRegister: React.FC<VehicleRegisterProps> = ({
  vehicle,
  onSubmit,
  onClose
}) => {
  const [formData, setFormData] = useState({
    number: vehicle?.number || '',
    type: vehicle?.type || '등원',
    route: vehicle?.route || '',
    instructor: vehicle?.instructor || '',
    contact: vehicle?.contact || ''
  });

  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // 테스트용 임시 데이터
  const mockDrivers: Driver[] = [
    { id: '1', name: '김유진', contact: '010-1234-5678' },
    { id: '2', name: '김유진', contact: '010-8765-4321' },
    { id: '3', name: '김유성', contact: '010-6678-4321' }
  ];

  const mockRoutes = [
    '영통구 망포동',
    '영통구 영통동',
    '영통구 광교동',
    '팔달구 인계동',
    '팔달구 우만동',
    '권선구 권선동',
    '장안구 정자동'
  ];

  const filteredDrivers = mockDrivers.filter(driver => 
    driver.name.includes(searchKeyword)
  );

  const [routeSearchKeyword, setRouteSearchKeyword] = useState('');
  const [showRouteList, setShowRouteList] = useState(false);

  const filteredRoutes = mockRoutes.filter(route => 
    route.toLowerCase().includes(routeSearchKeyword.toLowerCase())
  );

  const vehicleTypes = [
    { value: '등원', label: '등원' },
    { value: '하원', label: '하원' }
  ];

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, number: e.target.value });
    if (validationErrors.includes('number')) {
      setValidationErrors(validationErrors.filter(error => error !== 'number'));
    }
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({ ...formData, type: e.target.value as '등원' | '하원' });
    if (validationErrors.includes('type')) {
      setValidationErrors(validationErrors.filter(error => error !== 'type'));
    }
  };

  const handleRouteSelect = (route: string) => {
    setFormData({ ...formData, route });
    if (validationErrors.includes('route')) {
      setValidationErrors(validationErrors.filter(error => error !== 'route'));
    }
    setRouteSearchKeyword('');
    setShowRouteList(false);
  };

  const handleDriverSelect = (driver: Driver) => {
    setSelectedDriver(driver);
    setFormData({
      ...formData,
      instructor: driver.name,
      contact: driver.contact
    });
    if (validationErrors.includes('driver')) {
      setValidationErrors(validationErrors.filter(error => error !== 'driver'));
    }
    setSearchKeyword('');
  };

  const handleConfirmAction = () => {
    if (selectedDriver) {
      const vehicleData = {
        id: vehicle?.id || String(Date.now()),
        ...formData,
        type: formData.type as '등원' | '하원',
        name: selectedDriver.name,
        phone: selectedDriver.contact
      };

      onSubmit(vehicleData);
      setShowConfirmModal(false);
      setShowAlertModal(true);
    }
  };

  const handleAlertClose = () => {
    setShowAlertModal(false);
    onClose();
  };

  const validateForm = () => {
    const errors: string[] = [];
    
    if (!formData.number.trim()) {
      errors.push('number');
    }
    if (!formData.type) {
      errors.push('type');
    }
    if (!formData.route.trim()) {
      errors.push('route');
    }
    if (!selectedDriver) {
      errors.push('driver');
    }

    setValidationErrors(errors);

    if (errors.length > 0) {
      setShowValidationModal(true);
      return false;
    }
    return true;
  };

  const handleSubmitClick = () => {
    if (validateForm()) {
      setShowConfirmModal(true);
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-lg p-6 overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">차량 {vehicle ? '수정' : '등록'}</h2>
        <button onClick={onClose} className="text-gray-500">
          ✕
        </button>
      </div>

      <div className="space-y-6">
        {/* 호차 선택 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            호차 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.number}
            onChange={handleNumberChange}
            className={`w-full p-2 border rounded transition-colors ${
              validationErrors.includes('number') ? 'border-2 border-rose-300' : 'border-gray-300'
            }`}
            placeholder="1호차"
          />
        </div>

        {/* 운행 타입 선택 - 등록시에만 검사 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            등/하원 {validationErrors.includes('type') && <span className="text-red-500">*</span>}
          </label>
          <select
            title="등/하원"
            value={formData.type}
            onChange={handleTypeChange}
            className={`w-full p-2 border rounded transition-colors ${
              validationErrors.includes('type') ? 'border-2 border-rose-300' : 'border-gray-300'
            }`}
          >
            {vehicleTypes.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* 운행 지역 정보 */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            운행 지역 정보 <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              value={routeSearchKeyword}
              onChange={(e) => {
                setRouteSearchKeyword(e.target.value);
                setShowRouteList(true);
              }}
              onFocus={() => setShowRouteList(true)}
              className={`w-full p-2 border rounded transition-colors ${
                validationErrors.includes('route') ? 'border-2 border-rose-300' : 'border-gray-300'
              }`}
              placeholder="운행 지역을 검색하세요"
            />
            <button 
              className="absolute right-2 top-2 text-gray-400"
              onClick={() => setShowRouteList(true)}
            >
              🔍
            </button>
            
            {/* 선택된 경로 표시 */}
            {formData.route && (
              <div className="mt-2 p-2 bg-gray-50 rounded flex justify-between items-center">
                <span>{formData.route}</span>
                <button 
                  onClick={() => setFormData({ ...formData, route: '' })}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
            )}

            {/* 검색 결과 목록 */}
            {showRouteList && routeSearchKeyword && (
              <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-48 overflow-y-auto">
                {filteredRoutes.map((route, index) => (
                  <div
                    key={index}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleRouteSelect(route)}
                  >
                    {route}
                  </div>
                ))}
                {filteredRoutes.length === 0 && (
                  <div className="p-2 text-gray-500">검색 결과가 없습니다</div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* 기사 조회 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            기사 조회 <span className="text-500">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="검색..."
            />
            <button className="absolute right-2 top-2">
              🔍
            </button>
          </div>
          {searchKeyword && (
            <div className="mt-2 border rounded max-h-40 overflow-y-auto">
              {filteredDrivers.map(driver => (
                <div
                  key={driver.id}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    handleDriverSelect(driver);
                  }}
                >
                  <div>{driver.name}</div>
                  <div className="text-sm text-gray-500">{driver.contact}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {selectedDriver && (
          <div className="p-3 bg-gray-50 rounded">
            <div className="font-medium">선택된 기사님</div>
            <div>{selectedDriver.name}</div>
            <div className="text-sm text-gray-500">{selectedDriver.contact}</div>
          </div>
        )}

        {/* 버튼 그룹 */}
        <div className="flex justify-center mt-6">
          <button
            onClick={handleSubmitClick}
            className="w-full px-4 py-3 bg-blue-500 text-white rounded hover:bg-blue-600 font-medium"
          >
            {vehicle ? '수정' : '등록'}
          </button>
        </div>
      </div>

      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmAction}
      />

      <AlertModal
        isOpen={showAlertModal}
        onClose={handleAlertClose}
        message="등록되었습니다."
      />

      <AlertModal
        isOpen={showValidationModal}
        onClose={() => setShowValidationModal(false)}
        message="필수 정보를 모두 입력해주세요."
      />
    </div>
  );
};

export default VehicleRegister; 