import React, { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { saveAs } from "file-saver";
import "./invoice.css";
import Login from "./Login";

const Invoice = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [data, setData] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState(null);
  const [formData, setFormData] = useState({
    invoiceNumber: "",
    invoiceDate: new Date().toISOString().split("T")[0],
    poNumber: "",
    poDate: "",
    toCompany: "",
    address: "",
    city: "",
    state: "",
    gstNumber: "",
    stateCode: "",
    transport: "",
    place: "",
    transportCharge: 0,
    items: [],
  });
  const [page, setPage] = useState(1);
  const [limit] = useState(12);
  const [totalPages, setTotalPages] = useState(1);
  const [invoice, setInvoice] = useState([]);
  const [ivnlen, setInvlen] = useState(0);
  const [showSuggestions, setShowSuggestions] = useState([])
  const [filteredItems, setFilteredItems] = useState([]);

  const url = import.meta.env.VITE_BACKEND_URL;

  const [token, SetToken] = useState("")

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
    const tkn = getToken()
    SetToken(tkn)
    // console.log(tkn)
    getInvoice();
    getCustomer();
  }, []);

  useEffect(() => {
    getInvoice();
  }, [page]);

  const getInvoice = async () => {
    try {
      const res = await axios.get(
        `${url}/invoice/get?page=${page}&limit=${limit}`
      );
      setCustomers(res.data.data);
      setTotalPages(res.data.totalPages);
      setInvlen(res.data.total);
    } catch (err) {
      console.log(err);
    }
  };

  const getCustomer = async () => {
    try {
      const response = await axios.get(
        `${url}/customer/get-all`
      );
      setData(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "poNumber") {
      if (value != "") {
        setFormData((prev) => ({
          ...prev,
          poDate: new Date().toISOString().split("T")[0],
        }));
      }
    }
    if (name === "toCompany") {
      if (value.trim() === '') {
        setFilteredItems([]);
        setShowSuggestions(false);
        return;
      }
      const filtered = data.filter((item) =>
        item.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredItems(filtered);
      setShowSuggestions(true);

      const companyDetails = data.find((company) => company.name === value);
      console.log(value);
      console.log(companyDetails);
      if (companyDetails) {
        setFormData((prev) => ({
          ...prev,
          address: companyDetails.address,
          city: companyDetails.city,
          state: companyDetails.state,
          gstNumber: companyDetails.gstin,
          stateCode: companyDetails.statecode,
        }));
      }
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
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
        { hsnCode: "", dcNumber: "", itemName: "", quantity: 0, price: 0 },
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
    const total = newCustomer.items.reduce(
      (sum, item) =>
        sum + (parseFloat(item.price) || 0) * (parseFloat(item.quantity) || 0),
      0
    );
    const response = await axios.post(
      `${url}/invoice/add`,
      formData,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    setFormData({
      invoiceNumber: "",
      invoiceDate: new Date().toISOString().split("T")[0],
      poNumber: "",
      poDate: "",
      toCompany: "",
      address: "",
      city: "",
      state: "",
      gstNumber: "",
      stateCode: "",
      transport: "",
      place: "",
      transportCharge: 0,
      items: [],
    });
    setIsAddModalOpen(false);
    navigate(`/print`, {
      state: {
        companyName: newCustomer.toCompany,
        address: newCustomer.address,
        city: newCustomer.city,
        state: newCustomer.state,
        gstno: newCustomer.gstNumber,
        stateCode: newCustomer.stateCode,
        invoiceNo: newCustomer.invoiceNumber,
        poNumber: newCustomer.poNumber,
        poDate: newCustomer.poDate
          ? newCustomer.poDate.substring(0, 10).split("-").reverse().join("/")
          : "",
        invoiceDate: newCustomer.invoiceDate.split("-").reverse().join("/"),
        transport: newCustomer.transport,
        place: newCustomer.place,
        items: newCustomer.items,
        totalAmount: total,
        transCharge: newCustomer.transportCharge,
      },
    });
  };

  const handleEdit = (customer) => {
    setCurrentCustomer(customer);
    setFormData(customer);
    setFormData((prev) => ({
      ...prev,
      invoiceDate: customer.invoiceDate.split("T")[0],
      poDate: customer.poDate ? customer.poDate.split("T")[0] : "",
    }));
    // console.log(customer.invoiceDate.split("T")[0])
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
    const response = await axios.put(
      `${url}/invoice/edit/${currentCustomer._id}`,
      formData,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    setFormData({
      invoiceNumber: "",
      invoiceDate: new Date().toISOString().split("T")[0],
      poNumber: "",
      poDate: "",
      toCompany: "",
      address: "",
      city: "",
      state: "",
      gstNumber: "",
      stateCode: "",
      transport: "",
      place: "",
      transportCharge: 0,
      items: [],
    });
    setIsEditModalOpen(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      setCustomers((prev) => prev.filter((customer) => customer._id !== id));
      const response = await axios.delete(
        `${url}/invoice/delete/${id}`
      );
    }
  };

  const handleClick = (newCustomer) => {
    const total = newCustomer.items.reduce(
      (sum, item) =>
        sum + ((parseFloat(item.quantity) || 0) * parseFloat(item.price) || 0),
      0
    );
    navigate(`/print`, {
      state: {
        companyName: newCustomer.toCompany,
        address: newCustomer.address,
        city: newCustomer.city,
        state: newCustomer.state,
        gstno: newCustomer.gstNumber,
        stateCode: newCustomer.stateCode,
        invoiceNo: newCustomer.invoiceNumber,
        poNumber: newCustomer.poNumber,
        poDate: newCustomer.poDate
          ? newCustomer.poDate.substring(0, 10).split("-").reverse().join("/")
          : "",
        invoiceDate: newCustomer.invoiceDate
          .substring(0, 10)
          .split("-")
          .reverse()
          .join("/"),
        transport: newCustomer.transport,
        place: newCustomer.place,
        items: newCustomer.items,
        totalAmount: total,
        transCharge: newCustomer.transportCharge,
      },
    });
  };

  const getTaxAndTotal = (customer) => {
    const total = customer.items
      .reduce(
        (sum, item) =>
          sum +
          ((parseFloat(item.quantity) || 0) * parseFloat(item.price) || 0),
        0
      )
      .toFixed(2);
    const tax = parseFloat(total * 0.18).toFixed(2);
    return {
      total: parseFloat(
        parseFloat(total) +
          parseFloat(tax) +
          parseFloat(customer.transportCharge)
      ).toFixed(2),
      tax,
    };
  };

  const exportToCSV = async () => {
    const headers = [
      "Inv No",
      "Invoice Date",
      "To Company",
      "Amount",
      "Tax",
      "Transport Charge",
      "Total",
    ];

    const inv = await axios.get(`${url}/invoice/get-all`);
    const data = inv.data;

    let totalAmount = 0;
    let totalTax = 0;
    let totalTransport = 0;
    let totalGrand = 0;

    const rows = data.map((customer) => {
      const amount = customer.items.reduce(
        (sum, item) =>
          sum +
          ((parseFloat(item.quantity) || 0) * parseFloat(item.price) || 0),
        0
      );

      const { tax, total } = getTaxAndTotal(customer);
      const transport = parseFloat(customer.transportCharge) || 0;

      // Accumulate totals
      totalAmount += amount;
      totalTax += parseFloat(tax) || 0;
      totalTransport += transport;
      totalGrand += parseFloat(total) || 0;

      return [
        customer.invoiceNumber,
        customer.invoiceDate.substring(0, 10).split("-").reverse().join("/"),
        customer.toCompany,
        amount.toFixed(2),
        parseFloat(tax).toFixed(2),
        transport.toFixed(2),
        parseFloat(total).toFixed(2),
      ];
    });

    // Add a blank line before totals for visual separation
    rows.push(["", "", "", "", "", "", ""]);

    // Add formatted totals row
    const totalsRow = [
      "",
      "",
      "TOTALS",
      totalAmount.toFixed(2),
      totalTax.toFixed(2),
      totalTransport.toFixed(2),
      totalGrand.toFixed(2),
    ];

    const csvContent = [headers, ...rows, totalsRow]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "invoices.csv");
  };

  const handleItem = (name) => {
    console.log(name)
    const companyDetails = data.find((company) => company.name === name);
      console.log(name);
      console.log(companyDetails);
      if (companyDetails) {
        setFormData((prev) => ({
          ...prev,
          toCompany: name,
          address: companyDetails.address,
          city: companyDetails.city,
          state: companyDetails.state,
          gstNumber: companyDetails.gstin,
          stateCode: companyDetails.statecode,
        }));
      }
    // setFormData({toCompany: name});
  }

  return (
    token ? <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Invoice</h1>
        <div className="btn">
          <button onClick={exportToCSV} className="add-button">
            Export CSV
          </button>
          <button
            className="add-button"
            onClick={() => {
              setFormData({
                invoiceNumber: ivnlen + 1,
                invoiceDate: new Date().toISOString().split("T")[0],
                poNumber: "",
                poDate: "",
                toCompany: "",
                address: "",
                city: "",
                state: "",
                gstNumber: "",
                stateCode: "",
                transport: "",
                place: "",
                transportCharge: 0,
                items: [],
              });
              setIsAddModalOpen(true);
            }}
          >
            <Plus size={20} />
            Add Invoice
          </button>
        </div>
      </div>

      <div className="content-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Inv No</th>
              <th>Invoice Date</th>
              <th>To Company</th>
              <th>Amount</th>
              <th>Tax</th>
              <th>Transport Charge</th>
              <th>Total</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.id}>
                <td onClick={() => handleClick(customer)}>
                  {customer.invoiceNumber}
                </td>
                <td onClick={() => handleClick(customer)}>
                  {customer.invoiceDate
                    .substring(0, 10)
                    .split("-")
                    .reverse()
                    .join("/")}
                </td>
                <td onClick={() => handleClick(customer)}>
                  {customer.toCompany}
                </td>
                <td onClick={() => handleClick(customer)}>
                  {customer.items
                    .reduce(
                      (sum, item) =>
                        sum +
                        ((parseFloat(item.quantity) || 0) *
                          parseFloat(item.price) || 0),
                      0
                    )
                    .toFixed(2)}
                </td>
                <td>{getTaxAndTotal(customer).tax}</td>
                <td>{parseFloat(customer.transportCharge).toFixed(2)}</td>
                <td>{getTaxAndTotal(customer).total}</td>
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
                    onClick={() => {
                      handleDelete(customer._id);
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* pagination controller */}
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
                />
              </div>
              <div className="form-group">
                <label>PO Date:</label>
                <input
                  type="date"
                  name="poDate"
                  value={formData.poDate}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group" id="comp">
                <label>To Company:</label>
                <input
                  type="text"
                  name="toCompany"
                  value={formData.toCompany}
                  onChange={handleInputChange}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
                  onFocus={() => formData.toCompany && setShowSuggestions(true)}
                  required
                />
                {showSuggestions && filteredItems.length > 0 && (
                  <ul className="suggestion-list">
                    {filteredItems.map((item) => (
                      <li key={item.id} onClick={() => handleItem(item.name)}>
                        {item.name}
                      </li>
                    ))}
                  </ul>
                )}
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
                />
              </div>
              <div className="form-group">
                <label>Place:</label>
                <input
                  type="text"
                  name="place"
                  value={formData.place}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Transport Chrge:</label>
                <input
                  type="text"
                  name="transportCharge"
                  value={formData.transportCharge}
                  onChange={handleInputChange}
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
                    className="item-name"
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
                  onClick={() => {
                    setIsAddModalOpen(false);
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
                      transportCharge: 0,
                      items: [],
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
                />
              </div>
              <div className="form-group">
                <label>PO Date:</label>
                <input
                  type="date"
                  name="poDate"
                  value={formData.poDate}
                  onChange={handleInputChange}
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
                />
              </div>
              <div className="form-group">
                <label>Place:</label>
                <input
                  type="text"
                  name="place"
                  value={formData.place}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Transport Chrge:</label>
                <input
                  type="text"
                  name="transportCharge"
                  value={formData.transportCharge}
                  onChange={handleInputChange}
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
                  Update
                </button>
                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => {
                    setIsEditModalOpen(false);
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
                      transportCharge: 0,
                      items: [],
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

export default Invoice;
