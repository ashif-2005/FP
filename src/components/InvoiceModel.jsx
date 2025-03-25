import React, { useState, useEffect } from 'react';
import { PlusCircle, Trash2, X } from 'lucide-react';

export default function InvoiceModal({ isOpen, onClose, onSave, lastInvoiceNumber, editingInvoice }) {
  const [invoice, setInvoice] = useState({
    id: Date.now(),
    invoiceNumber: '',
    invoiceDate: new Date().toISOString().split('T')[0],
    poNumber: '',
    poDate: new Date().toISOString().split('T')[0],
    toCompany: '',
    address: '',
    city: '',
    state: '',
    gstNumber: '',
    stateCode: '',
    transport: '',
    place: '',
    items: []
  });

  useEffect(() => {
    if (editingInvoice) {
      setInvoice(editingInvoice);
    } else {
      const nextNumber = parseInt(lastInvoiceNumber || '0') + 1;
      setInvoice(prev => ({
        ...prev,
        id: Date.now(),
        invoiceNumber: String(nextNumber).padStart(4, '0'),
        invoiceDate: new Date().toISOString().split('T')[0],
        poDate: new Date().toISOString().split('T')[0],
        items: []
      }));
    }
  }, [editingInvoice, lastInvoiceNumber]);

  const addItem = () => {
    setInvoice(prev => ({
      ...prev,
      items: [...prev.items, { hsnCode: '', dcNumber: '', itemName: '', quantity: 0, price: 0 }]
    }));
  };

  const removeItem = (index) => {
    setInvoice(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const updateItem = (index, field, value) => {
    setInvoice(prev => ({
      ...prev,
      items: prev.items.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-content">
          <div className="modal-header">
            <h2 className="modal-title">
              {editingInvoice ? 'Edit Invoice' : 'New Invoice'}
            </h2>
            <button onClick={onClose} className="close-button">
              <X size={24} />
            </button>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Invoice Number</label>
              <input
                type="text"
                value={invoice.invoiceNumber}
                readOnly
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Invoice Date</label>
              <input
                type="date"
                value={invoice.invoiceDate}
                onChange={e => setInvoice(prev => ({ ...prev, invoiceDate: e.target.value }))}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">PO Number</label>
              <input
                type="text"
                value={invoice.poNumber}
                onChange={e => setInvoice(prev => ({ ...prev, poNumber: e.target.value }))}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">PO Date</label>
              <input
                type="date"
                value={invoice.poDate}
                onChange={e => setInvoice(prev => ({ ...prev, poDate: e.target.value }))}
                className="form-input"
              />
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">To Company</label>
              <input
                type="text"
                value={invoice.toCompany}
                onChange={e => setInvoice(prev => ({ ...prev, toCompany: e.target.value }))}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Address</label>
              <input
                type="text"
                value={invoice.address}
                onChange={e => setInvoice(prev => ({ ...prev, address: e.target.value }))}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">City</label>
              <input
                type="text"
                value={invoice.city}
                onChange={e => setInvoice(prev => ({ ...prev, city: e.target.value }))}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">State</label>
              <input
                type="text"
                value={invoice.state}
                onChange={e => setInvoice(prev => ({ ...prev, state: e.target.value }))}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">GST Number</label>
              <input
                type="text"
                value={invoice.gstNumber}
                onChange={e => setInvoice(prev => ({ ...prev, gstNumber: e.target.value }))}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">State Code</label>
              <input
                type="text"
                value={invoice.stateCode}
                onChange={e => setInvoice(prev => ({ ...prev, stateCode: e.target.value }))}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Transport</label>
              <input
                type="text"
                value={invoice.transport}
                onChange={e => setInvoice(prev => ({ ...prev, transport: e.target.value }))}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Place</label>
              <input
                type="text"
                value={invoice.place}
                onChange={e => setInvoice(prev => ({ ...prev, place: e.target.value }))}
                className="form-input"
              />
            </div>
          </div>

          <div className="items-section">
            <div className="items-header">
              <h3 className="items-title">Items</h3>
              <button onClick={addItem} className="button button-primary">
                <PlusCircle size={20} />
                Add Item
              </button>
            </div>

            {invoice.items.map((item, index) => (
              <div key={index} className="item-grid">
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">HSN Code</label>
                  <input
                    type="text"
                    value={item.hsnCode}
                    onChange={e => updateItem(index, 'hsnCode', e.target.value)}
                    className="form-input"
                  />
                </div>
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">DC Number</label>
                  <input
                    type="text"
                    value={item.dcNumber}
                    onChange={e => updateItem(index, 'dcNumber', e.target.value)}
                    className="form-input"
                  />
                </div>
                <div className="form-group" style={{ gridColumn: 'span 4' }}>
                  <label className="form-label">Item Name</label>
                  <input
                    type="text"
                    value={item.itemName}
                    onChange={e => updateItem(index, 'itemName', e.target.value)}
                    className="form-input"
                  />
                </div>
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">Quantity</label>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={e => updateItem(index, 'quantity', parseInt(e.target.value))}
                    className="form-input"
                  />
                </div>
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">Price</label>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input
                      type="number"
                      value={item.price}
                      onChange={e => updateItem(index, 'price', parseFloat(e.target.value))}
                      className="form-input"
                    />
                    <button
                      onClick={() => removeItem(index)}
                      className="delete-button"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="modal-footer">
            <button onClick={onClose} className="button button-secondary">
              Cancel
            </button>
            <button onClick={() => onSave(invoice)} className="button button-primary">
              Save Invoice
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}