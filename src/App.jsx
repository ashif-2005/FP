import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Customer from './components/Customer';
import Home from './components/Home';
import Item from './components/Item';
import Invoice from './components/Invoice';
import PrintInvoice from './components/PrintInvoice';
import DeliveryChalan from './components/DeliveryChalan';
import Login from './components/Login';
import Stock from './components/Stock';
import InvoiceLedger from './components/InvoiceLedger';
import CompanyInvLedger from './components/CompanyInvLedger';
import SalseVoucher from './components/SalseVoucher';
import SalseParyLedger from './components/SalseParyLedger';
import CompanyPartyLedger from './components/CompanyPartyLedger';

function App() {

  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/customer" element={<Customer />} />
            <Route path="/item" element={<Item />} />
            <Route path="/invoice" element={<Invoice />} />
            <Route path="/print" element={<PrintInvoice />} />
            <Route path="/dc" element={<DeliveryChalan />} />
            <Route path="/stock" element={<Stock />} />
            <Route path="/inv-ledger" element={<InvoiceLedger />} />
            <Route path="/inv-ledger/:company" element={<CompanyInvLedger />} />
            <Route path="/salse-voucher" element={<SalseVoucher />} />
            <Route path="/salse-party-ledger" element={<SalseParyLedger />} />
            <Route path="/salse-party-ledger/:company" element={<CompanyPartyLedger />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
