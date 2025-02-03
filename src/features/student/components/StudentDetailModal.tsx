import React, { useState, useEffect } from 'react';
import Modal from '../../../components/common/Modal';
import Button from '../../../components/common/Button';
import StudentForm from './StudentForm';
import AlertModal from '../../../components/common/AlertModal';
import { Student } from '../../../types/student';

interface StudentDetailModalProps {
  isOpen: boolean;
  student: Student | null;
  onClose: () => void;
  onSave: (student: Student) => void;
}

interface FormErrors {
  name?: string;
  phone?: string;
  address?: string;
}

const StudentDetailModal: React.FC<StudentDetailModalProps> = ({
  isOpen,
  student,
  onClose,
  onSave
}) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: ''
  });
  const [hasChanges, setHasChanges] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (student) {
      setFormData({
        name: student.name,
        phone: student.phone,
        address: student.address
      });
      setHasChanges(false);
    } else {
      // 등록 모드일 때는 폼 초기화
      setFormData({
        name: '',
        phone: '',
        address: ''
      });
      setHasChanges(true); // 등록 모드에서는 항상 저장 가능하도록
    }
  }, [student]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = '이름을 입력해주세요';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = '연락처를 입력해주세요';
    } else if (!/^[0-9]{2,3}-[0-9]{3,4}-[0-9]{4}$/.test(formData.phone)) {
      newErrors.phone = '올바른 연락처 형식이 아닙니다 (예: 010-1234-5678)';
    }
    
    if (!formData.address.trim()) {
      newErrors.address = '주소를 입력해주세요';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (student && !hasChanges) {
      setAlertMessage('수정된 내용이 없습니다.');
      setShowAlert(true);
      return;
    }
    
    onSave({
      ...(student || { id: '' }),
      ...formData
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'phone') {
      const phoneNumber = value.replace(/[^0-9]/g, '');
      let formattedNumber = '';
      
      if (phoneNumber.length <= 3) {
        formattedNumber = phoneNumber;
      } else if (phoneNumber.length <= 7) {
        formattedNumber = `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3)}`;
      } else {
        formattedNumber = `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3, 7)}-${phoneNumber.slice(7, 11)}`;
      }
      
      setFormData(prev => ({
        ...prev,
        [name]: formattedNumber
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }

    if (student) {
      const newFormData = {
        ...formData,
        [name]: value
      };
      
      setHasChanges(
        newFormData.name !== student.name ||
        newFormData.phone !== student.phone ||
        newFormData.address !== student.address
      );
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={student ? "학생 정보 수정" : "학생 등록"}
      preventClose={false}
      showCloseButton={true}
    >
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        <StudentForm
          name={formData.name}
          phone={formData.phone}
          address={formData.address}
          isEditing={true}
          onChange={handleChange}
          errors={errors}
        />

        <div className="flex justify-end gap-2 pt-4 border-t mt-6">
          <Button
            variant="secondary"
            type="button"
            onClick={onClose}
          >
            취소
          </Button>
          <Button
            variant="primary"
            type="submit"
            disabled={student ? !hasChanges : false}
          >
            {student ? '수정' : '등록'}
          </Button>
        </div>
      </form>

      <AlertModal
        isOpen={showAlert}
        onClose={() => setShowAlert(false)}
        message={alertMessage}
      />
    </Modal>
  );
};

export default StudentDetailModal; 