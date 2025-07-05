import React, { useState, useEffect } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import axios from "axios";
import Login from "./Login";

const Item = () => {
  const [customers, setCustomers] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState(null);
  const [formData, setFormData] = useState({
    item: "",
    hsn: "",
    type: "",
    price: 0,
  });

  const url = import.meta.env.VITE_BACKEND_URL;

  const [token, SetToken] = useState("")

  useEffect(() => {
    const tkn = getToken()
    SetToken(tkn)
  }, [])

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

  useEffect(() => {
    getItem();
  }, []);

  const getItem = async () => {
    try {
      const response = await axios.get(`${url}/item/get`);
      setCustomers(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    const newCustomer = {
      id: customers.length + 1,
      ...formData,
    };
    setCustomers((prev) => [...prev, newCustomer]);
    const response = await axios.post(`${url}/item/add`, formData, {
      headers: { "Content-Type": "application/json" },
    });
    setFormData({
      item: "",
      hsn: "",
      type: "",
      price: 0,
    });
    setIsAddModalOpen(false);
  };

  const handleEdit = (customer) => {
    // console.log(customer)
    setCurrentCustomer(customer);
    setFormData(customer);
    setIsEditModalOpen(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    // console.log(formData)
    setCustomers((prev) =>
      prev.map((customer) =>
        customer._id === currentCustomer._id
          ? { ...customer, ...formData }
          : customer
      )
    );
    const response = await axios.put(
      `${url}/item/edit/${currentCustomer._id}`,
      formData,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    setFormData({
      item: "",
      hsn: "",
      type: "",
      price: 0,
    });
    setIsEditModalOpen(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this Item?")) {
      setCustomers((prev) => prev.filter((customer) => customer._id !== id));
      const response = await axios.delete(`${url}/item/delete/${id}`);
    }
  };

  return (
    token ? <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Items</h1>
        <button className="add-button" onClick={() => setIsAddModalOpen(true)}>
          <Plus size={20} />
          Add Item
        </button>
      </div>

      <div className="content-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Item</th>
              <th>HSN Code</th>
              <th>Item Type</th>
              <th>Price</th>
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
                    onClick={() => handleEdit(customer)}
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    className="delete-button"
                    onClick={() => handleDelete(customer._id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>Add New Item</h2>
            <form onSubmit={handleAdd}>
              <div className="form-group">
                <label>Item:</label>
                <input
                  type="text"
                  name="item"
                  value={formData.item}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>HSN Code:</label>
                <input
                  type="text"
                  name="hsn"
                  value={formData.hsn}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Item Type:</label>
                <input
                  type="text"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Price:</label>
                <input
                  type="text"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="modal-actions">
                <button type="submit" className="save-button">
                  Save
                </button>
                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setFormData({
                      item: "",
                      hsn: "",
                      type: "",
                      price: 0,
                    });
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>Edit Item</h2>
            <form onSubmit={handleUpdate}>
              <div className="form-group">
                <label>Item:</label>
                <input
                  type="text"
                  name="item"
                  value={formData.item}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>HSN Code:</label>
                <input
                  type="text"
                  name="hsn"
                  value={formData.hsn}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Item Type:</label>
                <input
                  type="text"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Price:</label>
                <input
                  type="text"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="modal-actions">
                <button type="submit" className="save-button">
                  Update
                </button>
                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setFormData({
                      item: "",
                      hsn: "",
                      type: "",
                      price: 0,
                    });
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div> : <div> <Login /> </div>
  );
};

export default Item;
