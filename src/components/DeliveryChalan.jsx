import React, { useState, useEffect } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import axios from "axios";
import Login from "./Login";

const DeliveryChalan = () => {
    const [customers, setCustomers] = useState([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [currentCustomer, setCurrentCustomer] = useState(null);
    const [formData, setFormData] = useState({
      DCNum: "",
      DCDate: new Date().toISOString().split("T")[0],
      toCompany: "",
      ponum: "",
      items: []
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

    useEffect(()=>{
        getDC()
    }, [])

    const getDC = async () => {
        try{
            const response = await axios.get(`${url}/dc/get`);
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
          { hsnCode: "", dcNumber: formData.DCNum, itemName: "", quantity: "" },
        ],
      });
    };
  
    const deleteItem = (index) => {
      const updatedItems = formData.items.filter((_, i) => i !== index);
      setFormData({ ...formData, items: updatedItems });
    };
  
    const handleAdd = async (e) => {
      e.preventDefault();
      const newCustomer = {
        id: customers.length + 1,
        ...formData,
      };
      setCustomers((prev) => [...prev, newCustomer]);
      const response = await axios.post(`${url}/dc/add`, formData, {
        headers: { "Content-Type": "application/json" },
      });
      setFormData({
        DCNum: "",
        DCDate: new Date().toISOString().split("T")[0],
        toCompany: "",
        ponum: "",
        items: []
      });
      setIsAddModalOpen(false);
    };
  
    const handleEdit = (customer) => {
      // console.log(customer)
      setCurrentCustomer(customer);
      setFormData(customer);
      setIsEditModalOpen(true);
    };
  
    const handleUpdate = async(e) => {
      e.preventDefault();
      // console.log(currentCustomer)
      setCustomers((prev) =>
        prev.map((customer) =>
          customer._id === currentCustomer._id
            ? { ...customer, ...formData }
            : customer
        )
      );
      // console.log(currentCustomer._id)
      const response = await axios.put(`${url}/dc/edit/${currentCustomer._id}`, formData, {
        headers: { "Content-Type": "application/json" },
      });
      setFormData({
        DCNum: "",
        DCDate: new Date().toISOString().split("T")[0],
        toCompany: "",
        ponum: "",
        items: []
      });
      setIsEditModalOpen(false);
    };
  
    const handleDelete = async (id) => {
      if (window.confirm("Are you sure you want to delete this DC?")) {
        setCustomers((prev) => prev.filter((customer) => customer._id !== id));
        const response = await axios.delete(`${url}/dc/delete/${id}`);
      }
    };
  
    return (
      token ? <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">Delivery Challan</h1>
          <button className="add-button" onClick={() => setIsAddModalOpen(true)}>
            <Plus size={20} />
            Add DC
          </button>
        </div>
  
        <div className="content-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>DC Number</th>
                <th>DC Date</th>
                <th>To Company</th>
                <th>Quantity</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.id}>
                  <td>{customer.DCNum}</td>
                  <td>{customer.DCDate.split("-").reverse().join("/")}</td>
                  <td>{customer.toCompany}</td>
                  <td>
                    {customer.items
                      .reduce((sum, item) => sum + item.quantity * 1, 0)
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
                  <label>DC Number:</label>
                  <input
                    type="text"
                    name="DCNum"
                    value={formData.DCNum}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>DC Date:</label>
                  <input
                    type="date"
                    name="DCDate"
                    value={formData.DCDate}
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
                  <label>PO Number:</label>
                  <input
                    type="text"
                    name="ponum"
                    value={formData.ponum}
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
                    onClick={() => {
                        setIsAddModalOpen(false)
                        setFormData({
                            DCNum: "",
                            DCDate: new Date().toISOString().split("T")[0],
                            toCompany: "",
                            ponum: "",
                            items: []
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
                  <label>DC Number:</label>
                  <input
                    type="text"
                    name="DCNum"
                    value={formData.DCNum}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>DC Date:</label>
                  <input
                    type="date"
                    name="DCDate"
                    value={formData.DCDate}
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
                  <label>PO Number:</label>
                  <input
                    type="text"
                    name="ponum"
                    value={formData.ponum}
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
                    onClick={() => {
                        setIsEditModalOpen(false)
                        setFormData({
                            DCNum: "",
                            DCDate: new Date().toISOString().split("T")[0],
                            toCompany: "",
                            ponum: "",
                            items: []
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
}

export default DeliveryChalan