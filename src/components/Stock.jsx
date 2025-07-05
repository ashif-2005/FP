import React, { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2 } from "lucide-react";
import Login from './Login';

const Stock = () => {
  const [token, SetToken] = useState("")

  useEffect(() => {
    const tkn = getToken()
    SetToken(tkn)
  }, [])

  const customers = []

  const getToken = () => {
    const name = 'token=';
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookies = decodedCookie.split(';');
    for (let c of cookies) {
        c = c.trim();
        if (c.indexOf(name) === 0) {
        return c.substring(name.length);
        }
    }
    return null;
  }

  return (
    token ? 
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Stocks</h1>
        <button className="add-button">
          <Plus size={20} />
          Add Stock
        </button>
      </div>

      <div className="content-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Item</th>
              <th>HSN Code</th>
              <th>Item Type</th>
              <th>Quantity</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.id}>
                <td>{customer.item}</td>
                <td>{customer.hsn}</td>
                <td>{customer.type}</td>
                <td>{customer.price}</td>
                <td className="actions">
                  <button
                    className="edit-button"
                    // onClick={() => handleEdit(customer)}
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    className="delete-button"
                    // onClick={() => handleDelete(customer._id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    : 
    <div>
        <Login />
    </div>
  )
}

export default Stock;