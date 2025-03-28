import React, { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Invoice = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([
    {
      id: Date.now(),
      invoiceNumber: "1",
      invoiceDate: new Date().toISOString().split("T")[0],
      poNumber: "1",
      poDate: new Date().toISOString().split("T")[0],
      toCompany: "PELO",
      address: "Kumar Nagar",
      city: "Tiruppur",
      state: "Tamil Nadu",
      gstNumber: "123456789",
      stateCode: "33",
      transport: "Auto",
      place: "Tiruppur",
      items: [],
    },
  ]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState(null);
  const [formData, setFormData] = useState({
    invoiceNumber: "",
    invoiceDate: new Date().toISOString().split("T")[0],
    poNumber: "",
    poDate: new Date().toISOString().split("T")[0],
    toCompany: "",
    address: "",
    city: "",
    state: "",
    gstNumber: "",
    stateCode: "",
    transport: "",
    place: "",
    items: [],
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    const updatedItems = [...formData.items];
    updatedItems[index][name] = value;
    setFormData({ ...formData, items: updatedItems });
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [
        ...formData.items,
        { hsnCode: "", dcNumber: "", itemName: "", quantity: "", price: "" },
      ],
    });
  };

  const deleteItem = (index) => {
    const updatedItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: updatedItems });
  };

  const handleAdd = (e) => {
    e.preventDefault();
    const newCustomer = {
      id: customers.length + 1,
      ...formData,
    };
    setCustomers((prev) => [...prev, newCustomer]);
    const total = newCustomer.items.reduce(
      (sum, item) =>
        sum + (parseFloat(item.price) || 0) * (parseInt(item.quantity) || 0),
      0
    );
    setFormData({
      invoiceNumber: "",
      invoiceDate: new Date().toISOString().split("T")[0],
      poNumber: "",
      poDate: new Date().toISOString().split("T")[0],
      toCompany: "",
      address: "",
      city: "",
      state: "",
      gstNumber: "",
      stateCode: "",
      transport: "",
      place: "",
    });
    setIsAddModalOpen(false);
    navigate(`/print`, { state: { companyName: newCustomer.toCompany, address: newCustomer.address, city: newCustomer.city, state: newCustomer.state, gstno: newCustomer.gstNumber, stateCode: newCustomer.stateCode, invoiceNo: newCustomer.invoiceNumber, poNumber: newCustomer.poNumber, poDate: newCustomer.poDate.split("-").reverse().join("/"), invoiceDate: newCustomer.invoiceDate.split("-").reverse().join("/"), transport: newCustomer.transport, place: newCustomer.place, items: newCustomer.items, totalAmount: total } });
  };

  const handleEdit = (customer) => {
    setCurrentCustomer(customer);
    setFormData(customer);
    setIsEditModalOpen(true);
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    setCustomers((prev) =>
      prev.map((customer) =>
        customer.id === currentCustomer.id
          ? { ...customer, ...formData }
          : customer
      )
    );
    setIsEditModalOpen(false);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      setCustomers((prev) => prev.filter((customer) => customer.id !== id));
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
              <th>Invoice Number</th>
              <th>Invoice Date</th>
              <th>To Company</th>
              <th>Amount</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.id}>
                <td>{customer.invoiceNumber}</td>
                <td>{customer.invoiceDate}</td>
                <td>{customer.toCompany}</td>
                <td>
                  ₹
                  {customer.items
                    .reduce((sum, item) => sum + item.quantity * item.price, 0)
                    .toFixed(2)}
                </td>
                {/* <td>1000.00</td> */}
                <td className="actions">
                  <button
                    className="edit-button"
                    onClick={() => handleEdit(customer)}
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    className="delete-button"
                    onClick={() => handleDelete(customer.id)}
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
                <label>Invoice Number:</label>
                <input
                  type="text"
                  name="invoiceNumber"
                  value={formData.invoiceNumber}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Invoice Date:</label>
                <input
                  type="date"
                  name="invoiceDate"
                  value={formData.invoiceDate}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>PO Number:</label>
                <input
                  type="text"
                  name="poNumber"
                  value={formData.poNumber}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>PO Date:</label>
                <input
                  type="date"
                  name="poDate"
                  value={formData.poDate}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>To Company:</label>
                <input
                  type="text"
                  name="toCompany"
                  value={formData.toCompany}
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
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>GST Number:</label>
                <input
                  type="text"
                  name="gstNumber"
                  value={formData.gstNumber}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>State Code:</label>
                <input
                  type="text"
                  name="stateCode"
                  value={formData.stateCode}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Transport:</label>
                <input
                  type="text"
                  name="transport"
                  value={formData.transport}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Place:</label>
                <input
                  type="text"
                  name="place"
                  value={formData.place}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <h3>Items</h3>
              {formData.items.map((item, index) => (
                <div key={index} className="item-row">
                  <input
                    type="text"
                    name="hsnCode"
                    placeholder="HSN Code"
                    value={item.hsnCode}
                    onChange={(e) => handleItemChange(index, e)}
                  />
                  <input
                    type="text"
                    name="dcNumber"
                    placeholder="DC Number"
                    value={item.dcNumber}
                    onChange={(e) => handleItemChange(index, e)}
                  />
                  <input
                    type="text"
                    name="itemName"
                    placeholder="Item Name"
                    value={item.itemName}
                    onChange={(e) => handleItemChange(index, e)}
                    required
                  />
                  <input
                    type="number"
                    name="quantity"
                    placeholder="Quantity"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, e)}
                  />
                  <input
                    type="number"
                    name="price"
                    placeholder="Price"
                    value={item.price}
                    onChange={(e) => handleItemChange(index, e)}
                  />
                  <button
                    type="button"
                    className="delete-button"
                    onClick={() => deleteItem(index)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="add-item-button"
                onClick={addItem}
              >
                + Add Item
              </button>
              <div className="modal-actions">
                <button type="submit" className="save-button">
                  Save
                </button>
                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => setIsAddModalOpen(false)}
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
                <label>Invoice Number:</label>
                <input
                  type="text"
                  name="invoiceNumber"
                  value={formData.invoiceNumber}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Invoice Date:</label>
                <input
                  type="date"
                  name="invoiceDate"
                  value={formData.invoiceDate}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>PO Number:</label>
                <input
                  type="text"
                  name="poNumber"
                  value={formData.poNumber}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>PO Date:</label>
                <input
                  type="date"
                  name="poDate"
                  value={formData.poDate}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>To Company:</label>
                <input
                  type="text"
                  name="toCompany"
                  value={formData.toCompany}
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
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>GST Number:</label>
                <input
                  type="text"
                  name="gstNumber"
                  value={formData.gstNumber}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>State Code:</label>
                <input
                  type="text"
                  name="stateCode"
                  value={formData.stateCode}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Transport:</label>
                <input
                  type="text"
                  name="transport"
                  value={formData.transport}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Place:</label>
                <input
                  type="text"
                  name="place"
                  value={formData.place}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <h3>Items</h3>
              {formData.items.map((item, index) => (
                <div key={index} className="item-row">
                  <input
                    type="text"
                    name="hsnCode"
                    placeholder="HSN Code"
                    value={item.hsnCode}
                    onChange={(e) => handleItemChange(index, e)}
                    required
                  />
                  <input
                    type="text"
                    name="dcNumber"
                    placeholder="DC Number"
                    value={item.dcNumber}
                    onChange={(e) => handleItemChange(index, e)}
                    required
                  />
                  <input
                    type="text"
                    name="itemName"
                    placeholder="Item Name"
                    value={item.itemName}
                    onChange={(e) => handleItemChange(index, e)}
                    required
                  />
                  <input
                    type="number"
                    name="quantity"
                    placeholder="Quantity"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, e)}
                    required
                  />
                  <input
                    type="number"
                    name="price"
                    placeholder="Price"
                    value={item.price}
                    onChange={(e) => handleItemChange(index, e)}
                    required
                  />
                  <button
                    type="button"
                    className="delete-button"
                    onClick={() => deleteItem(index)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="add-item-button"
                onClick={addItem}
              >
                + Add Item
              </button>
              <div className="modal-actions">
                <button type="submit" className="save-button">
                  Update
                </button>
                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => setIsEditModalOpen(false)}
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

export default Invoice;
