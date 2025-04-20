import { useState } from "react";
import style from "./Book.module.css";
import star from '../../assets/star.png';
import starEmpty from '../../assets/star-empty.png';
import Notification from "../Notification/Notification";

function Book({ id, title, author, first_publish_year, cover_edition_key, favorites, toggleFavorite }) {
    const [imageError, setImageError] = useState(false);
    const [showNotification, setShowNotification] = useState(false)
    const [isFavorite, setIsFavorite] = useState(false)
    const cover = cover_edition_key ? `https://covers.openlibrary.org/b/olid/${cover_edition_key}-M.jpg` : null;

    const showFavNotification = () => {
        setIsFavorite(!isFavorite)
        if (!isFavorite) {
            setShowNotification(!showNotification)
            const timeId = setTimeout(() => {
                setShowNotification(false)
            }, 3000)
            return () => clearTimeout(timeId)
        }
    }

    const fewFuncs = () => {
        toggleFavorite()
        showFavNotification()
    }

    return (
        <div className={style.bookCard} key = {id}>
            <Notification 
            show = {showNotification}
            message = {`"${title}" added to favorites🙂`}
            />
            <h6>{title}</h6>
            {cover && !imageError ? (
                <img
                    src={cover}
                    alt=''
                    onError={() => setImageError(true)}
                />
            ) : (
                <div className={style.imagePlaceholder}>
                    Book Image is not available
                </div>
            )}
            <h6>{author?.join(', ') || 'Unknown Author'}</h6>
            <h6>Published in {first_publish_year}</h6>
            <div className={`${style.bookFavorite} ${favorites ? style.favorite : ''}`}
                onClick={fewFuncs} >
                <img src={starEmpty} alt="Not favorite" />
                <img src={star} className={style.filled} alt="Favorite" />
            </div>
        </div>
    );
}

export default Book;