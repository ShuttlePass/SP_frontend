import React from 'react';
import AdminSidebar from '../../components/layout/sidebar';
import SearchBar from '../../components/common/SearchBar';

const ShuttlePage = () => {
  return (
    <div className="flex">
      <AdminSidebar />
      <div className="m-4">
        <SearchBar data={[]} onSearchResult={() => {}} searchKeys={[]} placeholder="검색" />
      </div>
    </div>
  );
};

export default ShuttlePage;

