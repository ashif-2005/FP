import React, { useState, useEffect } from 'react';
import { Plus, FileText, Pencil, Trash2,  PlusCircle, X } from 'lucide-react';
import InvoiceModal from './InvoiceModel';

const Invoice = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [invoices, setInvoices] = useState([]);
  const [editingInvoice, setEditingInvoice] = useState(null);

  const handleSaveInvoice = (invoice) => {
    if (editingInvoice) {
      setInvoices(prev => prev.map(inv => inv.id === editingInvoice.id ? invoice : inv));
    } else {
      setInvoices(prev => [...prev, invoice]);
    }
    setIsModalOpen(false);
    setEditingInvoice(null);
  };

  const handleEditInvoice = (invoice) => {
    setEditingInvoice(invoice);
    setIsModalOpen(true);
  };

  const handleDeleteInvoice = (id) => {
    if (confirm('Are you sure you want to delete this invoice?')) {
      setInvoices(prev => prev.filter(invoice => invoice.id !== id));
    }
  };

  const getLastInvoiceNumber = () => {
    if (invoices.length === 0) return '0000';
    const lastInvoice = invoices[invoices.length - 1].invoiceNumber;
    return String(Number(lastInvoice) + 1).padStart(4, '0');
  };

  return (
    <div className="page-container">
        <div className="page-header">
        <h1 className="page-title">Invoice</h1>
        <button className="add-button" onClick={() => setIsModalOpen(true)}>
          <Plus size={20} />
          Add Invoice
        </button>
      </div>

        {invoices.length === 0 ? (
          <div className="empty-state">
            <FileText size={48} className="empty-state-icon" />
            <p className="empty-state-text">No invoices yet. Create your first invoice!</p>
          </div>
        ) : (
          <div className="content-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Invoice Number</th>
                  <th>Date</th>
                  <th>Company</th>
                  <th>Amount</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map(invoice => (
                  <tr key={invoice.id}>
                    <td>{invoice.invoiceNumber}</td>
                    <td>{new Date(invoice.invoiceDate).toLocaleDateString()}</td>
                    <td>{invoice.toCompany}</td>
                    <td>
                      ₹{invoice.items.reduce((sum, item) => sum + (item.quantity * item.price), 0).toFixed(2)}
                    </td>
                    <td>
                      <div className="actions">
                        <button
                          onClick={() => handleEditInvoice(invoice)}
                          className="edit-button"
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteInvoice(invoice.id)}
                          className="delete-button"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <InvoiceModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingInvoice(null);
          }}
          onSave={handleSaveInvoice}
          lastInvoiceNumber={getLastInvoiceNumber()}
          editingInvoice={editingInvoice}
        />
    </div>
  );
}

export default Invoice;