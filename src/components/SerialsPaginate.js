import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate"; // از این کتابخانه استفاده شده در داکیومنتش هست

const pageSize = 150;

const SerialsPaginate = ({ setData, allData, forcePage, setPageInfo }) => {
    const [pageCount, setPageCount] = useState(0); // تعداد کل صفحات رانگه و آپدیت میکنیم
    // Here we use item offsets; we could also use page offsets
    // following the API or data you're working with.
    const [itemOffset, setItemOffset] = useState(0);  // صفحه اول 15 تا بود مثلا میریم صفحه دوم، آیتمآفست تعداد قبلی را نشان میدهد یعنی تعداد آیتمهای صفحه قبل
    const [pageNumber, setPageNumber] = useState(0); // شماره صفحه فعلی


    useEffect(() => {
        // Fetch items from another resources.
        const endOffset = itemOffset + pageSize;
        setData(allData.slice(itemOffset, endOffset));
        console.log("pagination : allData , endOffset ,itemOffset", allData, endOffset, itemOffset)
        // setPageCount(Math.ceil(allData.length / pageSize));
        const pageCount = Math.ceil(allData.length / pageSize);
        setPageCount(pageCount);
        setPageInfo && setPageInfo({ pageCount });
        console.log({ allData });
    }, [itemOffset, allData]); //جایی که کل داده ها تغییر کند لاجیک داخل این یوزافکت کال میشود
    //و بعد داخلش ما ست دیتا میکنیم یعنی عوض شدن آلدیتا باعث عوض شدن ست دیتا میشودو توی یوزافکتهایی که در سریالز نوشته بودیم اونجا لاجیک های داخل یوزافکت اجرا میشود


    useEffect(() => { //برای اینه که ما مجبورش کنیم بره صفحه بعدی، قبلی، هرجایی
        if (forcePage !== undefined) {
            handlePageClick({ selected: forcePage }); // لاجیک خود کتابخانه است
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
