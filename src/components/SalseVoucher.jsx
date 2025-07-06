import React, { useState, useEffect, use } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import axios from "axios";
import Login from "./Login";

const SalseVoucher = () => {
  const [customers, setCustomers] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState(null);
  const [formData, setFormData] = useState({
    voucherNum: "",
    voucherDate: new Date().toISOString().split("T")[0],
    partyCompany: "",
    paymentMode: "NA",
    bank: "",
    chequeNum: "",
    amount: 0,
  });
  const [page, setPage] = useState(1);
  const [limit] = useState(12);
  const [totalPages, setTotalPages] = useState(1);
  const [voucherLen, setVoucherLen] = useState(0);
  const [showSuggestions, setShowSuggestions] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [data, setData] = useState([]);
  const paymentOptions = ["Cheque", "NEFT/RTGS", "Cash"];

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
    getVoucher();
  }, []);

  useEffect(() => {
    getVoucher();
  }, [page]);

  const getVoucher = async () => {
    try {
      const res = await axios.get(
        `${url}/voucher/get?page=${page}&limit=${limit}`
      );
      setCustomers(res.data.data);
      setTotalPages(res.data.totalPages);
      setVoucherLen(res.data.total);
    } catch (err) {
      console.log(err);
    }
  };

  const getCustomer = async () => {
    try {
      const response = await axios.get(`${url}/customer/get-all`);
      setData(response.data);
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
    if (name === "partyCompany") {
      if (value.trim() === "") {
        setFilteredItems([]);
        setShowSuggestions(false);
        return;
      }
      const filtered = data.filter((item) =>
        item.name.toLowerCase().includes(value.toLowerCase())
      );
      // console.log(filtered)
      setFilteredItems(filtered);
      setShowSuggestions(true);
      console.log(showSuggestions);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    const newCustomer = {
      id: customers.length + 1,
      ...formData,
    };
    setCustomers((prev) => [...prev, newCustomer]);
    const response = await axios.post(`${url}/voucher/add`, formData, {
      headers: { "Content-Type": "application/json" },
    });
    setFormData({
      voucherNum: "",
      voucherDate: new Date().toISOString().split("T")[0],
      partyCompany: "",
      paymentMode: "NA",
      bank: "",
      chequeNum: "",
      amount: 0,
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
    // console.log(currentCustomer._id)
    const response = await axios.put(
      `${url}/voucher/edit/${currentCustomer._id}`,
      formData,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    setFormData({
      voucherNum: "",
      voucherDate: new Date().toISOString().split("T")[0],
      partyCompany: "",
      paymentMode: "NA",
      bank: "",
      chequeNum: "",
      amount: 0,
    });
    setIsEditModalOpen(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this voucher?")) {
      setCustomers((prev) => prev.filter((customer) => customer._id !== id));
      const response = await axios.delete(`${url}/voucher/delete/${id}`);
    }
  };

  const handleItem = (name) => {
    setFormData((prev) => ({ ...prev, partyCompany: name }));
    setShowSuggestions(false);
  };

  useEffect(() => {
    console.log("Suggestions visible?", showSuggestions);
  }, [showSuggestions]);

  return token ? (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Voucher</h1>
        <button
          className="add-button"
          onClick={() => {
            setIsAddModalOpen(true);
            setFormData({
              voucherNum: voucherLen + 1,
              voucherDate: new Date().toISOString().split("T")[0],
              partyCompany: "",
              paymentMode: "NA",
              bank: "",
              chequeNum: "",
              amount: 0,
            });
          }}
        >
          <Plus size={20} />
          Add Voucher
        </button>
      </div>

      <div className="content-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Voucher Number</th>
              <th>Voucher Date</th>
              <th>Party Name</th>
              <th>paymentMode</th>
              <th>Bank</th>
              <th>cheque Number</th>
              <th>amount</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.id}>
                <td>{customer.voucherNum}</td>
                <td>
                  {customer.voucherDate
                    .substring(0, 10)
                    .split("-")
                    .reverse()
                    .join("/")}
                </td>
                <td>{customer.partyCompany}</td>
                <td>{customer.paymentMode}</td>
                <td>{customer.bank}</td>
                <td>{customer.chequeNum}</td>
                <td>{customer.amount}</td>
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
            <h2>Add New Voucher</h2>
            <form onSubmit={handleAdd}>
              <div className="form-group">
                <label>Voucher Number:</label>
                <input
                  type="text"
                  name="voucherNum"
                  value={formData.voucherNum}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Voucher Date:</label>
                <input
                  type="date"
                  name="voucherDate"
                  value={formData.voucherDate}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Party Name:</label>
                <select
                  name="partyCompany"
                  value={formData.partyCompany}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">-- Select Party Name --</option>
                  {data.map((mode) => (
                    <option key={mode._id} value={mode.name}>
                      {mode.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Payment Mode:</label>
                <select
                  name="paymentMode"
                  value={formData.paymentMode}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">-- Select Payment Mode --</option>
                  {paymentOptions.map((mode) => (
                    <option key={mode} value={mode}>
                      {mode}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Bank:</label>
                <input
                  name="bank"
                  value={formData.bank}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Cheque Number:</label>
                <input
                  name="chequeNum"
                  value={formData.chequeNum}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Amount:</label>
                <input
                  name="amount"
                  value={formData.amount}
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
                      voucherNum: "",
                      voucherDate: new Date().toISOString().split("T")[0],
                      partyCompany: "",
                      paymentMode: "",
                      bank: "",
                      chequeNum: "",
                      amount: 0,
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
            <h2>Edit Voucher</h2>
            <form onSubmit={handleUpdate}>
              <div className="form-group">
                <label>Voucher Number:</label>
                <input
                  type="text"
                  name="voucherNum"
                  value={formData.voucherNum}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Voucher Date:</label>
                <input
                  type="date"
                  name="voucherDate"
                  value={formData.voucherDate}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Party Name:</label>
                <input
                  type="text"
                  name="partyCompany"
                  value={formData.partyCompany}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Payment Mode:</label>
                <select
                  name="paymentMode"
                  value={formData.paymentMode}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">-- Select Payment Mode --</option>
                  {paymentOptions.map((mode) => (
                    <option key={mode} value={mode}>
                      {mode}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Bank:</label>
                <input
                  name="bank"
                  value={formData.bank}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Cheque Number:</label>
                <input
                  name="chequeNum"
                  value={formData.chequeNum}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Amount:</label>
                <input
                  name="amount"
                  value={formData.amount}
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
                    setIsEditModalOpen(false);
                    setFormData({
                      voucherNum: "",
                      voucherDate: new Date().toISOString().split("T")[0],
                      partyCompany: "",
                      paymentMode: "NA",
                      bank: "",
                      chequeNum: "",
                      amount: 0,
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

export default SalseVoucher;
