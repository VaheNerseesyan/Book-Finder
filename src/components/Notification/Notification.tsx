import { useEffect } from "react";
import style from './Notification.module.css'

export default function Notification({ show, message}) {

    useEffect(() => {
        if (show) {
            const timer = setTimeout(() => { }, 3000)
            return () => clearTimeout(timer)
        }
    }, [show])

    if (!show) {
        return null
    }

    return (
        <div className={style.modalOverlay}>
            <div className={style.modalContent}>
                <p>{message}</p>
            </div>
        </div>
    );
}