import style from './Pagination.module.css'

function Pagination({currentPage, setCurrentPage, books, booksInOnePage}) {
    const totalPages = Math.ceil(books.length / booksInOnePage);
    return (
        <div>
            <button onClick={() => {
                if (currentPage > 1) {
                    setCurrentPage(currentPage - 1);
                }
            }} disabled={currentPage === 1}>Prev</button>

            <span className={style.currentPage}>  Page {currentPage}  </span>

            <button onClick={() => {
                if (currentPage < totalPages) {
                    setCurrentPage(currentPage + 1);
                }
            }} disabled={currentPage === totalPages}>Next</button>
        </div>
    )
}

export default Pagination