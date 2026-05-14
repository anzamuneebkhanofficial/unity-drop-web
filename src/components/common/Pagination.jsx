/** @format */

import ReactPaginate from 'react-paginate';

const Pagination = ({ pageCount, onPageChange, currentPage }) => {
  if (pageCount <= 0) return null;

  return (
    <ReactPaginate
      previousLabel={'←'}
      nextLabel={'→'}
      breakLabel={'...'}
      pageCount={pageCount}
      marginPagesDisplayed={1}
      pageRangeDisplayed={2}
      onPageChange={({ selected }) => {
        // ReactPaginate 0-based hai, tumhara backend 1-based
        onPageChange(selected + 1);
      }}
      forcePage={currentPage ? currentPage - 1 : 0} // ✅ hamesha sync rakho
      containerClassName="flex items-center space-x-2 mt-4 justify-end text-[--color-tx]"
      pageClassName="px-3 py-1 rounded-md text-sm bg-[--color-bg] cursor-pointer hover:bg-[--color-lk2] transition"
      activeClassName="bg-[--color-lk] text-white"
      previousClassName="px-3 py-1 rounded-md text-sm bg-[--color-bg] cursor-pointer hover:bg-[--color-lk1] transition"
      nextClassName="px-3 py-1 rounded-md text-sm bg-[--color-bg] cursor-pointer hover:bg-[--color-lk1] transition"
      breakClassName="px-3 py-1 rounded-md text-sm bg-[--color-bg] cursor-pointer"
      disabledClassName="opacity-50 cursor-not-allowed"
    />
  );
};

export default Pagination;
