import './App.css'
import { Form } from './components/Form/Form.tsx'
import { List } from './components/List/List.tsx'
import { Item } from './components/Item/Item.tsx'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Navbar } from './components/Navbar/Navbar.tsx'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function App() {
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<List />} />
          <Route path="/list" element={<List />} />
          <Route path="/item/:id" element={<Item />} />
          <Route path="/edit/:id" element={<Form isEdit />} />
          <Route path="/form" element={<Form />} />
        </Routes>

        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          className="custom-toast-container"
        />
      </BrowserRouter>
    </>
  )
}

export default App
