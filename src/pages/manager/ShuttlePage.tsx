import React from 'react';
import AdminSidebar from '../../components/layout/sidebar';
import ShuttleAssignment from '../../components/shuttle/ShuttleAssignment';

const ShuttlePage = () => {
  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1 p-8">
        <ShuttleAssignment />
      </div>
    </div>
  );
};

export default ShuttlePage;
