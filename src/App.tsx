import './App.css'
import {Form} from "./components/Form.tsx";
import {List} from "./components/List.tsx";
import {Item} from "./components/Item.tsx";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {Navbar} from "./components/Navbar.tsx";

function App() {

  return (
    <>
        <BrowserRouter>
            <Navbar/>
            <Routes>
                <Route path="/list" element={<List />} />
                <Route path="/item/:id" element={<Item />} />
                <Route path="/edit/:id" element={<Form isEdit />} />
                <Route path="/form" element={<Form />} />
            </Routes>

        </BrowserRouter>
    </>
  )
}

export default App
