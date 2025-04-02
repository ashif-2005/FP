import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import axios from 'axios';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    gstin: '',
    statecode: ''
  });

  useEffect(()=>{
    getCustomer()
  }, [])

  const getCustomer = async () => {
    try{
          const response = await axios.get("https://fp-backend-3uya.onrender.com/customer/get");
          setCustomers(response.data)
        }
        catch(err){
          console.log(err)
        }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    const newCustomer = {
      id: customers.length + 1,
      ...formData
    };
    setCustomers(prev => [...prev, newCustomer]);
    const response = await axios.post("https://fp-backend-3uya.onrender.com/customer/add", formData, {
      headers: { "Content-Type": "application/json" },
    });
    setFormData({ name: '', address: '', city: '', state: '', gstin: '', statecode: '' });
    setIsAddModalOpen(false);
  };

  const handleEdit = (customer) => {
    setCurrentCustomer(customer);
    setFormData(customer);
    setIsEditModalOpen(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setCustomers(prev =>
      prev.map(customer =>
        customer._id === currentCustomer._id ? { ...customer, ...formData } : customer
      )
    );
    const response = await axios.put(`https://fp-backend-3uya.onrender.com/customer/edit/${currentCustomer._id}`, formData, {
      headers: { "Content-Type": "application/json" },
    });
    setFormData({ name: '', address: '', city: '', state: '', gstin: '', statecode: '' });
    setIsEditModalOpen(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      setCustomers(prev => prev.filter(customer => customer._id !== id));
      const response = await axios.delete(`https://fp-backend-3uya.onrender.com/customer/delete/${id}`);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Customers</h1>
        <button className="add-button" onClick={() => setIsAddModalOpen(true)}>
          <Plus size={20} />
          Add Customer
        </button>
      </div>

      <div className="content-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Address</th>
              <th>City</th>
              <th>State</th>
              <th>GSTIN</th>
              <th>State Code</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map(customer => (
              <tr key={customer.id}>
                <td>{customer.name}</td>
                <td>{customer.address}</td>
                <td>{customer.city}</td>
                <td>{customer.state}</td>
                <td>{customer.gstin}</td>
                <td>{customer.statecode}</td>
                <td className="actions">
                  <button className="edit-button" onClick={() => handleEdit(customer)}>
                    <Pencil size={16} />
                  </button>
                  <button className="delete-button" onClick={() => handleDelete(customer._id)}>
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
                <label>Name:</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Address:</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>City:</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>State:</label>
                <input
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>GSTIN:</label>
                <input
                  name="gstin"
                  value={formData.gstin}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>State Code:</label>
                <input
                  name="statecode"
                  value={formData.statecode}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="modal-actions">
                <button type="submit" className="save-button">Save</button>
                <button type="button" className="cancel-button" onClick={() => {
                  setIsAddModalOpen(false)
                  setFormData({ name: '', address: '', city: '', state: '', gstin: '', statecode: '' });
                }}>Cancel</button>
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
                <label>Name:</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Address:</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>City:</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>State:</label>
                <input
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>GSTIN:</label>
                <input
                  name="gstin"
                  value={formData.gstin}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>State Code:</label>
                <input
                  name="statecode"
                  value={formData.statecode}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="modal-actions">
                <button type="submit" className="save-button">Update</button>
                <button type="button" className="cancel-button" onClick={() => {
                  setIsEditModalOpen(false)
                  setFormData({ name: '', address: '', city: '', state: '', gstin: '', statecode: '' });
                }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;