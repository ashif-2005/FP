import React, { useState, useEffect } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import axios from "axios";

const Item = () => {
  const [customers, setCustomers] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState(null);
  const [formData, setFormData] = useState({
    item: "",
    hsn: "",
    type: "",
    price: 0
  });

  useEffect(()=>{
    getItem()
  }, [])

  const getItem = async() => {
    try{
      const response = await axios.get("https://fp-backend-3uya.onrender.com/item/get");
      setCustomers(response.data)
    }
    catch(err){
      console.log(err)
    }
  }

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
    const response = await axios.post("https://fp-backend-3uya.onrender.com/item/add", formData, {
      headers: { "Content-Type": "application/json" },
    });
    setFormData({
      item: "",
      hsn: "",
      type: "",
      price: 0
    });
    setIsAddModalOpen(false);
  };

  const handleEdit = (customer) => {
    setCurrentCustomer(customer);
    setFormData(customer);
    setIsEditModalOpen(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setCustomers((prev) =>
      prev.map((customer) =>
        customer._id === currentCustomer._id
          ? { ...customer, ...formData }
          : customer
      )
    );
    const response = await axios.put(`https://fp-backend-3uya.onrender.com/item/edit/${currentCustomer._id}`, formData, {
      headers: { "Content-Type": "application/json" },
    });
    setFormData({
      item: "",
      hsn: "",
      type: "",
      price: 0
    });
    setIsEditModalOpen(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      setCustomers((prev) => prev.filter((customer) => customer.id !== id));
      const response = await axios.delete(`https://fp-backend-3uya.onrender.com/invoice/delete/${id}`);
    }
  };

  return (
    <div className="page-container">
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
            <h2>Add New Customer</h2>
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
                    setIsAddModalOpen(false)
                    setFormData({
                      item: "",
                      hsn: "",
                      type: "",
                      price: 0
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
            <h2>Edit Customer</h2>
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
                    setIsEditModalOpen(false)
                    setFormData({
                      item: "",
                      hsn: "",
                      type: "",
                      price: 0
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
    </div>
  );
};

export default Item;
