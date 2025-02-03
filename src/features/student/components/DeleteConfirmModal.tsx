import React from 'react';
import Modal from '../../../components/common/Modal';
import Button from '../../../components/common/Button';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message: string;
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  message
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="확인"
    >
      <div className="p-4">
        <p className="mb-4">{message}</p>
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose}>
            취소
          </Button>
          <Button variant="danger" onClick={onConfirm}>
            삭제
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteConfirmModal; 