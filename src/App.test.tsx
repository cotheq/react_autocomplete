// describe('Testing sum', () => {
//     function sum(a: number, b: number) {
//        return a + b;
//     }

//     it('should equal 4',()=>{
//        expect(sum(2,2)).toBe(4);
//       })

// });


import React from 'react';
import { render } from "@testing-library/react"
import App from "./App"
import ReactDOM from 'react-dom';

it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<App />, div);
  });

it('renders correctly', () => {
  const {asFragment} = render(<App />)
  expect(asFragment()).toMatchSnapshot();
});