import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Customer from './components/Customer';
import Home from './components/Home';
import Item from './components/Item';
import Invoice from './components/Invoice';
import PrintInvoice from './components/PrintInvoice';

function App() {

  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/customer" element={<Customer />} />
            <Route path="/item" element={<Item />} />
            <Route path="/invoice" element={<Invoice />} />
            <Route path="/print" element={<PrintInvoice />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
