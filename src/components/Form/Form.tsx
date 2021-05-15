import React, { useState, useRef, useCallback } from "react";
import styles from "./Form.module.scss"
import loader from "../../assets/images/loader.svg"
import User, {IUser} from "./User"
import useOnClickOutside from "../../UseOnClickOutside"
import {debounce} from "lodash"

export const getUsersAndPhotos = async (searchText?: string) => {
    let response = await fetch("https://jsonplaceholder.typicode.com/users")
    let newUsersList: IUser[] = (await response.json()).map((u: IUser) => ({
        id: u.id,
        name: u.name,
        username: u.username,
    }))
    
    response = await fetch("https://jsonplaceholder.typicode.com/photos")
    let userPhotos = await response.json()
    for (let i = 0; i < newUsersList.length; i++) {
        const userId = newUsersList[i].id
        const userPhotoIndex = userPhotos.findIndex((item: {id?: number}) => item.id === userId)
        newUsersList[i].photo = userPhotos[userPhotoIndex].thumbnailUrl
        userPhotos.splice(userPhotoIndex, 1)
    }

    if (searchText) {
        newUsersList = newUsersList.filter(u => (
            u.username.toLowerCase().indexOf(searchText.toLowerCase()) !== -1 ||
            u.name.toLowerCase().indexOf(searchText.toLowerCase()) !== -1
        ))
    }

    return newUsersList
}


function Form() {
    const [isFetching, setIsFetching] = useState(false)
    const [inputText, setInputText] = useState("")
    const [usersList, setUsersList] = useState<IUser[]>([])
    const [selectedUser, setSelectedUser] = useState(-1)
    const [isFormOpened, setFormOpened] = useState(false)

    const ref = useRef(null);
    useOnClickOutside(ref, () => {setFormOpened(false)});

    const fetchUsers = useCallback(debounce(async (searchText?: string) => {
        setIsFetching(true)
        const newUsersList = await getUsersAndPhotos(searchText)
        setUsersList(newUsersList)
        setIsFetching(false)
        setSelectedUser(-1)
    }, 500), []);

    const onInputKeyDown = (key: string) => {
        let index: number
        switch(key) {
            case "ArrowDown": 
                index = usersList.findIndex(u => u.id === selectedUser)                       
                setSelectedUser((usersList[(index + 1) % usersList.length]).id)
                return
            case "ArrowUp":
                index = usersList.findIndex(u => u.id === selectedUser)
                const newIndex: number = (index > 0) ? index - 1 : usersList.length - 1
                setSelectedUser((usersList[newIndex]).id)
                return
            case "Enter": 
                index = usersList.findIndex(u => u.id === selectedUser)
                if (index === -1) return
                const s = usersList[index]
                setInputText(s.name)
                setFormOpened(false)                
                return
            default: return
        }
    }

    const onInputChange = (value: string) => {
        if (value === inputText) return
        setInputText(value)
        setFormOpened(true)
        fetchUsers(value)
    }

    const onUserClick = (name: string) => {
        setInputText(name)
        setFormOpened(false)
    }

    return (
        <div data-testid="form_container" ref={ref} className={styles.search_form} onKeyDown={(e) => {onInputKeyDown(e.key)}}>
            <input data-testid="input" type="text" placeholder="Search" value={inputText}
                onChange={(e) => onInputChange(e.target.value) }
                onFocus={(e) => fetchUsers(e.target.value) }
                onClick={() => setFormOpened(true) }
            />
            { (isFormOpened) ?
                <div data-testid="users_list" className={styles.users_list}>
                    
                    { (isFetching) ?
                        <img alt="loader" src={loader} className={styles.loader} />
                        
                    :
                        usersList.map( u =>
                            <User
                                {...u}
                                key={u.id}
                                selected={u.id === selectedUser}
                                onUserClick={() => { onUserClick(u.name) }}
                                onUserMouseOver={() => { setSelectedUser(u.id) }}
                            />
                        )
                    }
                </div>
            : "" }            
        </div>
    )
}

export default Form