
'use client';
import ReactPaginate from 'react-paginate';
const Pagination = ({ pageCount, onPageChange, currentPage }) => {
  if (pageCount <= 0) return null;
  return (
    <ReactPaginate
      previousLabel="←"
      nextLabel="→"
      breakLabel="..."
      pageCount={pageCount}
      marginPagesDisplayed={1}
      pageRangeDisplayed={2}
      onPageChange={({ selected }) => onPageChange(selected + 1)}
      forcePage={currentPage ? currentPage - 1 : 0}
      containerClassName="flex items-center space-x-2 mt-4 justify-end text-sm font-black uppercase tracking-widest text-gray-400"
      pageClassName="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 hover:text-white transition-all"
      activeClassName="!bg-[var(--portal-focus)] !text-black !border-[var(--portal-focus)]"
      previousClassName="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 hover:text-white transition-all"
      nextClassName="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 hover:text-white transition-all"
      breakClassName="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 cursor-pointer"
      disabledClassName="opacity-30 cursor-not-allowed pointer-events-none"
    />
  );
};

export default Pagination;