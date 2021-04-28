import React from "react";
import styles from "./Form.module.css"

export interface IUser {
    id: number,
    name: string,
    username: string,
    photo?: string,

    onUserClick?: () => void,
    onUserMouseOver?: () => void,
    selected?: boolean
}

function User(props: IUser) {
    return (
        <div
            onClick={props.onUserClick}
            className={`${styles.user}${(props.selected) ? " " + styles.selected : ""}`}
            onMouseOver={props.onUserMouseOver}
        >
            <img src={props.photo} className={styles.user_photo} />
            <div className={styles.user_name}>
                <div>{props.name}</div>
                <small>@{props.username}</small>
            </div>
        </div>
    )
}

export default User;


