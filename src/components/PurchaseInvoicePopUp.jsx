import React from 'react';
import './InvoicePopup.css';

const InvoicePopUp = ({ onClose, invoiceData }) => {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <span className="close-icon" onClick={onClose}>&times;</span>

        <div className="header">
          <h2>{invoiceData.toCompany}</h2>
          <p>INV No: {invoiceData.invoiceNo}</p>
          <p>INV Date: {invoiceData.invoiceDate}</p>
        </div>

        <table>
          <thead>
            <tr>
              <th>SNO</th>
              <th>Description</th>
              <th>QTY</th>
              <th>Rate</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {invoiceData.items.map((item) => (
              <tr key={item.sno}>
                <td>{item.sno}</td>
                <td>{item.description}</td>
                <td>{item.qty}</td>
                <td>{item.rate}</td>
                <td>{item.amount}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="4" style={{ textAlign: 'right' }}>TOTAL</td>
              <td>{invoiceData.total}</td>
            </tr>
            <tr>
              <td colSpan="4" style={{ textAlign: 'right' }}>GST</td>
              <td>{invoiceData.gst}</td>
            </tr>
            <tr>
              <td colSpan="4" style={{ textAlign: 'right', fontWeight: 'bold' }}>Grand Total</td>
              <td style={{ fontWeight: 'bold' }}>{invoiceData.grandTotal}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default InvoicePopUp;
