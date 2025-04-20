import { useEffect, useRef, useState } from "react";
import { booksApi } from "../../const/apis";
import style from './BookList.module.css';
import Book from '../Book/Book';
import darkModeIcon from '../../assets/darkModeIcon.svg'
import bookIcon from '../../assets/book.svg'
import Pagination from "../Pagination/Pagination";

function BookList() {
    const [books, setBooks] = useState([]);
    const [input, setInput] = useState('');
    const [isDarkMode, setisDarkMode] = useState(false)
    const [currentPage, setCurrentPage] = useState(1);
    const [isFavBooksMode, setIsFavBooksMode] = useState(false)
    const [isLoadingInitial, setIsLoadingInitial] = useState(true);
    const [isLoadingSearch, setIsLoadingSearch] = useState(false);
    const [favBooks, setFavBooks] = useState([]);
    const [debouncedSearch, setDebouncedSearch] = useState('')

    useEffect(() => {
        const favData = window.localStorage.getItem('FAVORITE_BOOKS');
        if (favData !== null) setFavBooks(JSON.parse(favData))
    }, [])

    useEffect(() => {
        const favorites = window.localStorage.setItem('FAVORITE_BOOKS', JSON.stringify(favBooks))
    }, [favBooks])

    useEffect(() => {
        const timeOut = setTimeout(() => {
            setDebouncedSearch(input)
        }, 300)

        return () => clearTimeout(timeOut)
    }, [input])

    const getBooks = () => {
        const timeOutID = setTimeout(() => {
            (async () => {
                setIsLoadingInitial(true);
                const res = await booksApi('all');
                setBooks(res);
                setIsLoadingInitial(false);
            })();
        }, 500);

        return timeOutID;
    };

    useEffect(() => {
        const timeOutId = getBooks();
        return () => clearTimeout(timeOutId)
    }, []);

    const toggleFavorite = (book) => {
        setFavBooks((prevFavs) => {
            const isAlreadyFav = prevFavs.some(b => b.key === book.key);
            if (isAlreadyFav) {
                return prevFavs.filter(b => b.key !== book.key);
            } else {
                return [...prevFavs, book];
            }
        });
    };

    useEffect(() => {
        const darkModeStorage = window.localStorage.getItem('DARK_LIGHT_MODS');
        setisDarkMode(JSON.parse(darkModeStorage))
    }, [])

    useEffect(() => {
        const darkMode = window.localStorage.setItem('DARK_LIGHT_MODS', JSON.stringify(isDarkMode))
    }, [isDarkMode])

    const toggleDarkMode = () => {
        setisDarkMode(!isDarkMode)
    }

    const toggleFavBooksMode = () => {
        setIsFavBooksMode(!isFavBooksMode)
    }

    useEffect(() => {
        const fetchBooks = async () => {
            setIsLoadingSearch(true);
            const term = debouncedSearch || 'all';
            const res = await booksApi(term);
            setBooks(res);
            setCurrentPage(1);
            setIsLoadingSearch(false);
        };
        fetchBooks();
    }, [debouncedSearch]);

    const handleInput = (e) => {
        setInput(e.target.value)
    }

    useEffect(() => {
        setCurrentPage(1);
    }, [isFavBooksMode]);

    const booksInOnePage = 36;
    const indexOfLastBook = currentPage * booksInOnePage;
    const indexOfFirstBook = indexOfLastBook - booksInOnePage;
    const currentPageBooks = books.slice(indexOfFirstBook, indexOfLastBook);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [currentPage, isFavBooksMode, debouncedSearch]);

    return (
        <div className={`${style.container} ${!isDarkMode ? style.light : style.dark}`}>
            {isLoadingInitial ? (
                <div className={style.loadingContainer}>
                    <div className={style.loader}></div>
                    <p className={style.loadingText}>Loading books...</p>
                </div>
            ) : (
                <>
                    <div className={style.headerContainer}>
                        <div className={style.favBooks}>
                            <img src={bookIcon} onClick={toggleFavBooksMode} className={style.bookIcon} alt="" />
                            <span className={style.bookCount}>{favBooks.length}</span>
                        </div>
                        <img onClick={toggleDarkMode} src={darkModeIcon} className={style.darkModeIcon} alt="" />

                        <div className={style.searchContainer}>
                            <input
                                value={input}
                                onChange={handleInput}
                                type="text"
                                placeholder="Search by title or author..."
                                className={style.input}
                            />
                            {isLoadingSearch && (
                                <span className={style.searchLoading}>Loading...</span>
                            )}
                        </div>
                    </div>

                    <div className={style.bookGrid}>
                        {
                            (isFavBooksMode ? favBooks : currentPageBooks).map((book) => (
                                <Book
                                    key={book.key}
                                    id={book.key}
                                    title={book.title}
                                    author={book.author_name}
                                    cover_edition_key={book.cover_edition_key}
                                    first_publish_year={book.first_publish_year}
                                    favorites={isFavBooksMode || favBooks.some(b => b.key === book.key)}
                                    toggleFavorite={() => toggleFavorite(book)}
                                />
                            ))
                        }
                    </div>

                    {!isFavBooksMode && (
                        <div className={style.pagination}>
                            <Pagination
                                currentPage={currentPage}
                                setCurrentPage={setCurrentPage}
                                booksInOnePage={booksInOnePage}
                                books={books}
                            />
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export { BookList };