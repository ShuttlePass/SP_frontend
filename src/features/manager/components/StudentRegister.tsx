import React, { useState } from "react";
import { studentService } from '../../../services/studentService';
import Button from '../../../components/common/Button';
import StudentForm from '../../student/components/StudentForm';

interface StudentRegisterProps {
  student?: Student;
  onSubmit: (studentData: any) => void;
  onClose: (modalType: 'register' | 'detail', hasContent: boolean) => void;
  showSuccessModal: boolean;
  onSuccessModalClose: () => void;
  onCourseAssignmentClick: () => void;
}

const StudentRegister: React.FC<StudentRegisterProps> = ({
  student,
  onSubmit,
  onClose,
  showSuccessModal,
  onSuccessModalClose,
  onCourseAssignmentClick,
}) => {
  const [formData, setFormData] = useState({
    name: student?.name || '',
    phone: student?.phone || '',
    address: student?.address || ''
  });
  const [touched, setTouched] = useState({
    name: false,
    phone: false,
    address: false
  });
  const [error, setError] = useState<string | null>(null);

  const isFormValid = formData.name && formData.phone && formData.address;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
  };

  const validateForm = () => {
    let isValid = true;
    const errors: string[] = [];

    if (!formData.name) {
      errors.push('성명');
      isValid = false;
    }
    if (!formData.phone) {
      errors.push('연락처');
      isValid = false;
    }
    if (!formData.address) {
      errors.push('주소');
      isValid = false;
    }

    if (!isValid) {
      setError(`${errors.join(', ')}을(를) 입력해주세요.`);
      // 모든 필드를 touched로 설정하여 빨간 테두리 표시
      setTouched({
        name: true,
        phone: true,
        address: true
      });
    }

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }
    
    try {
      const studentData = {
        area_idx: 1,
        st_name: formData.name,
        st_contact: formData.phone,
        st_address: formData.address
      };

      await studentService.registerStudent(studentData);
      onSubmit(studentData);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('등록 중 오류가 발생했습니다.');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-4">
      {error && (
        <div className="p-3 mb-4 text-red-500 bg-red-50 rounded text-center">
          {error}
        </div>
      )}
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            성명 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full p-2 border-2 rounded ${
              touched.name && !formData.name 
                ? 'border-red-500' 
                : 'border-[#B0B8C1]'
            }`}
            placeholder="이름을 입력하세요"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            연락처 <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full p-2 border-2 rounded ${
              touched.phone && !formData.phone 
                ? 'border-red-500' 
                : 'border-[#B0B8C1]'
            }`}
            placeholder="010-XXXX-XXXX"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            주소 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full p-2 border-2 rounded ${
              touched.address && !formData.address 
                ? 'border-red-500' 
                : 'border-[#B0B8C1]'
            }`}
            placeholder="주소를 입력하세요"
          />
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <Button
          type="submit"
          variant="primary"
          className="w-[100px]"
        >
          {student ? '수정' : '등록'}
        </Button>
      </div>
    </form>
  );
};

export default StudentRegister;