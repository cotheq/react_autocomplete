import React, { useState, useRef } from "react";
import styles from "./Form.module.css"
import loader from "../../assets/images/loader.svg"
import User, {IUser} from "./User"
import * as axios from "axios"
import useOnClickOutside from "../../UseOnClickOutside"

function Form() {

    const [isFetching, setIsFetching] = useState(false)
    const [inputText, setInputText] = useState("")
    const [usersList, setUsersList] = useState([])
    const [selectedUser, setSelectedUser] = useState(-1)
    const [isFormOpened, setFormOpened] = useState(false)

    const ref = useRef(null);
    const scrollRef = useRef(null)

    useOnClickOutside(ref, () => {console.log("shit"); setFormOpened(false)});

    async function fetchUsers(searchText?: string) {
        setIsFetching(true)
        let response = await fetch("https://jsonplaceholder.typicode.com/users")
        let newUsersList = (await response.json()).map((u: IUser) => ({
            id: u.id,
            name: u.name,
            username: u.username,
        }))
        
        response = await fetch("https://jsonplaceholder.typicode.com/photos")
        let userPhotos = await response.json()
        for (let i = 0; i < newUsersList.length; i++) {
            newUsersList[i].photo = userPhotos[i].thumbnailUrl
        }

        if (searchText) {
            //Это имитация поиска, по идее слово для поиска должно передаваться в get параметре
            //но в API нет такой возможности
            newUsersList = newUsersList.filter((u: IUser) => (
                u.username.toLowerCase().indexOf(searchText.toLowerCase()) !== -1 ||
                u.name.toLowerCase().indexOf(searchText.toLowerCase()) !== -1
            ))
        }
        
        setUsersList(newUsersList)
        setIsFetching(false)
        setSelectedUser(-1)
    }

    return (
        <div ref={ref} className={styles.search_form} onKeyDown={(e) => {
            let index: number
            switch(e.key) {
                case "ArrowDown": 
                    index = usersList.findIndex((u: IUser) => u.id === selectedUser)                       
                    setSelectedUser((usersList[(index + 1) % usersList.length] as IUser).id)
                    return
                case "ArrowUp":
                    index = usersList.findIndex((u: IUser) => u.id === selectedUser)
                    const newIndex: number = (index > 0) ? index - 1 : usersList.length - 1
                    setSelectedUser((usersList[newIndex] as IUser).id)
                    return
                case "Enter": 
                    index = usersList.findIndex((u: IUser) => u.id === selectedUser)
                    if (index === -1) return
                    const s: IUser = usersList[index]
                    setInputText(s.name)
                    setFormOpened(false)                
                    return

                default: return
            }
        }}
        >
            <input type="text" placeholder="Search" value={inputText}
                onChange={async (e) => {
                    if (e.target.value === inputText) return
                    setInputText(e.target.value)
                    setFormOpened(true)
                    await fetchUsers(e.target.value)
                }}
                onFocus={async (e) => { await fetchUsers(e.target.value) }}
                onClick={() => { setFormOpened(true) }}
            />
            { (isFormOpened) ?
                <div className={styles.users_list}>
                    {
                        (isFetching) ?
                            <img src={loader} className={styles.loader} />
                        :
                            usersList.map( (u: IUser) =>
                                <User
                                    {...u}
                                    key={u.id}
                                    selected={u.id === selectedUser}
                                    onUserClick={() => {
                                        console.log("shit")
                                        setInputText(u.name)
                                        setFormOpened(false)
                                    }}
                                    onUserMouseOver={() => {
                                        setSelectedUser(u.id)
                                    }}
                                />
                            )
                    }
                </div>
            : "" }            
        </div>
    )

}
        

    


export default Form