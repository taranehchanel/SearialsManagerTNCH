import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";

const pageSize = 15;

const SerialsPaginate = ({ setData, allData, forcePage, setPageInfo }) => {
    const [pageCount, setPageCount] = useState(0);
    // Here we use item offsets; we could also use page offsets
    // following the API or data you're working with.
    const [itemOffset, setItemOffset] = useState(0);
    const [pageNumber, setPageNumber] = useState(0);


    useEffect(() => {
        // Fetch items from another resources.
        const endOffset = itemOffset + pageSize;
        setData(allData.slice(itemOffset, endOffset));
        console.log("pagination : allData , endOffset ,itemOffset", allData, endOffset, itemOffset)
        // setPageCount(Math.ceil(allData.length / pageSize));
        const pageCount = Math.ceil(allData.length / pageSize);
        setPageCount(pageCount);
        setPageInfo && setPageInfo({ pageCount });
        console.log({allData});
    }, [itemOffset, allData]);


    useEffect(() => {
        if (forcePage !== undefined) {
            handlePageClick({ selected: forcePage });
        }
    }, [forcePage]);


    // Invoke when user click to request another page.
    const handlePageClick = (event) => {
        const newOffset = (event.selected * pageSize) % allData.length;
        setItemOffset(newOffset);
        setPageNumber(event.selected);
        setPageInfo && setPageInfo({ pageNumber: event.selected });
    };

    return (
        <ReactPaginate
            breakLabel="..."
            nextLabel="بعدی"
            forcePage={pageNumber}
            onPageChange={handlePageClick}
            pageRangeDisplayed={2}
            pageCount={pageCount}
            previousLabel="قبلی"
            renderOnZeroPageCount={null}

            pageClassName="page-item"
            pageLinkClassName="page-link"
            previousClassName="page-item"
            previousLinkClassName="page-link"
            nextClassName="page-item"
            nextLinkClassName="page-link"
            breakClassName="page-item"
            breakLinkClassName="page-link"
            marginPagesDisplayed={2}
            containerClassName="pagination"
            activeClassName="active"
        />
    )
}

export default SerialsPaginate;
