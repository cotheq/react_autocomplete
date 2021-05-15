import React from "react"
import Form from "./Form"
import { getUsersAndPhotos } from "./Form"
import { IUser } from "./User"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

it("gets users and photos from api", () => {
    getUsersAndPhotos().then((usersList: IUser[]) => {
        expect(usersList.length).toBe(10)
    })
})

it("is an empty input value when render", () => {
    render(<Form />)
    expect(screen.getByTestId("input")).toHaveDisplayValue("")
})

it("renders form with closed users list", () => {
    render(<Form />)
    expect(screen.queryByTestId("users_list")).toBeNull()
})

it("shows users list when click on input", () => {
    render(<Form />)
    fireEvent.click(screen.getByPlaceholderText("Search"))
    expect(screen.getByTestId("users_list")).toBeInTheDocument()    
})

it("shows loader image", async () => {
    const {debug} = render(<Form />)
    const input = screen.getByPlaceholderText("Search")
    fireEvent.click(input)
    fireEvent.focus(input)
    await waitFor(() => screen.findByAltText("loader"))
    expect(screen.getByAltText("loader")).toBeInTheDocument()    
})

it("fetches users", async () => {
    const {debug} = render(<Form />)
    const input = screen.getByPlaceholderText("Search")
    fireEvent.click(input)
    fireEvent.focus(input)

    await waitFor(() => screen.findAllByRole("user"))
    expect(screen.getByTestId("users_list").childElementCount).toBe(10)
    expect(screen.getByText(/leanne/i)).toBeInTheDocument()    
})

it("searches users by keyword", async () => {
    const {debug} = render(<Form />)
    const input = screen.getByPlaceholderText("Search")
    fireEvent.click(input)
    fireEvent.focus(input)
   
    userEvent.type(input, "ant")
    expect(input).toHaveDisplayValue("ant")
   
    await waitFor(() => screen.findAllByRole("user"))
    expect(screen.getByTestId("users_list").childElementCount).toBe(3)
    expect(screen.getByText(/ervin/i)).toBeInTheDocument()    
    expect(screen.queryByText(/leanne/i)).toBeNull()    
})

it("closes form when click on user", async () => {
    const {debug} = render(<Form />)
    const input = screen.getByPlaceholderText("Search")
    expect(input).toHaveDisplayValue("")
    fireEvent.click(input)
    fireEvent.focus(input)
    await waitFor(() => screen.findAllByRole("user"))
    expect(screen.getByText(/leanne/i)).toBeInTheDocument()    
    fireEvent.click(screen.getByText(/leanne/i))
    expect(input).toHaveDisplayValue(/leanne/i)
    expect(screen.queryByTestId("users_list")).toBeNull()
})
