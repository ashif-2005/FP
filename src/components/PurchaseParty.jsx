import React, { useState, useEffect } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import axios from "axios";
import Login from "./Login";

const PurchaseParty = () => {
  const [customers, setCustomers] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    gstin: "",
    statecode: "",
    fp_balance: 0,
    purchase_balance: 0
  });
  const [page, setPage] = useState(1);
  const [limit] = useState(12);
  const [totalPages, setTotalPages] = useState(1);

  const url = import.meta.env.VITE_BACKEND_URL;

  const [token, SetToken] = useState("");

  useEffect(() => {
    const tkn = getToken();
    SetToken(tkn);
  }, []);

  const getToken = () => {
    const name = "token=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookies = decodedCookie.split(";");
    for (let c of cookies) {
      c = c.trim();
      if (c.indexOf(name) === 0) {
        return c.substring(name.length);
      }
    }
    return null;
  };

  useEffect(() => {
    getCustomer();
  }, []);

  useEffect(() => {
    getCustomer();
  }, [page]);

  const getCustomer = async () => {
    try {
      const res = await axios.get(
        `${url}/purchase-party/get?page=${page}&limit=${limit}`
      );
      setCustomers(res.data.data);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.log(err);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
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
    const response = await axios.post(`${url}/purchase-party/add`, formData, {
      headers: { "Content-Type": "application/json" },
    });
    setFormData({
      name: "",
      address: "",
      city: "",
      state: "",
      gstin: "",
      statecode: "",
      fp_balance: 0,
      purchase_balance: 0,
    });
    setIsAddModalOpen(false);
    await getCustomer();
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
    // console.log(currentCustomer._id)
    const response = await axios.put(
      `${url}/purchase-party/edit/${currentCustomer._id}`,
      formData,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    setFormData({
      name: "",
      address: "",
      city: "",
      state: "",
      gstin: "",
      statecode: "",
      fp_balance: 0,
      purchase_balance: 0,
    });
    setIsEditModalOpen(false);
    await getCustomer();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      setCustomers((prev) => prev.filter((customer) => customer._id !== id));
      const response = await axios.delete(`${url}/purchase-party/delete/${id}`);
      await getCustomer();
    }
  };

  return token ? (
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
              <th style={{ textAlign: "right" }}>Opening Balance</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.id}>
                <td>{customer.name}</td>
                <td>{customer.address}</td>
                <td>{customer.city}</td>
                <td>{customer.state}</td>
                <td>{customer.gstin}</td>
                <td>{customer.statecode}</td>
                <td style={{ textAlign: "right" }}>
                  {parseFloat(customer.fp_balance).toFixed(2)}
                </td>
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
        {/* Pagination controller */}
        <div className="container">
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            className="prev"
          >
            Prev
          </button>

          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              onClick={() => handlePageChange(index + 1)}
              className={`button ${
                page === index + 1 ? "button-active" : "button-default"
              }`}
            >
              {index + 1}
            </button>
          ))}

          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages}
            className="next"
          >
            Next
          </button>
        </div>
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
              <div className="form-group">
                <label>Opening Balance:</label>
                <input
                  name="fp_balance"
                  value={formData.fp_balance}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Balance:</label>
                <input
                  name="purchase_balance"
                  value={formData.purchase_balance}
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
                      name: "",
                      address: "",
                      city: "",
                      state: "",
                      gstin: "",
                      statecode: "",
                      fp_balance: 0,
                      purchase_balance: 0,
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
                <div className="form-group">
                  <label>Opening Balance:</label>
                  <input
                    name="fp_balance"
                    value={formData.fp_balance}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Balance:</label>
                <input
                  name="purchase_balance"
                  value={formData.purchase_balance}
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
                      name: "",
                      address: "",
                      city: "",
                      state: "",
                      gstin: "",
                      statecode: "",
                      fp_balance: 0,
                      purchase_balance: 0
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
  ) : (
    <div>
      {" "}
      <Login />{" "}
    </div>
  );
};

export default PurchaseParty;
