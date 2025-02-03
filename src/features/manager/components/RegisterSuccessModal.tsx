import React from 'react';
import Modal from '../../../components/common/Modal';
import Button from '../../../components/common/Button';

interface RegisterSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAssignCourse: () => void;
  studentName: string;
}

const RegisterSuccessModal: React.FC<RegisterSuccessModalProps> = ({
  isOpen,
  onClose,
  onAssignCourse,
  studentName
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="등록 완료"
    >
      <div className="p-6 space-y-4">
        <p className="text-center mb-4">
          {studentName} 학생이 등록되었습니다.
        </p>
        <div className="flex justify-center gap-2">
          <Button
            variant="secondary"
            onClick={onClose}
          >
            닫기
          </Button>
          <Button
            variant="primary"
            onClick={onAssignCourse}
          >
            수업 배정하기
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default RegisterSuccessModal; 