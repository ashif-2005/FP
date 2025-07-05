import React, { useState, useEffect } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import axios from "axios";
import Login from "./Login";
import { useNavigate } from "react-router-dom";

const InvoiceLedger = () => {
  const navigate = useNavigate();

  const [customers, setCustomers] = useState([]);
  const [currentCustomer, setCurrentCustomer] = useState(null);

  const [page, setPage] = useState(1);
  const [limit] = useState(15);
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
        `${url}/customer/get?page=${page}&limit=${limit}`
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

  const handleClick = (customer) => {
    navigate(`/inv-ledger/${customer.name}`);
  };

  return token ? (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Invoice Ledger</h1>
      </div>

      <div className="content-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Name</th>
              <th>GSTIN</th>
              <th>Balance</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer, index) => (
              <tr key={customer.id}>
                <td onClick={() => handleClick(customer)}>{index + 1}</td>
                <td onClick={() => handleClick(customer)}>{customer.name}</td>
                <td onClick={() => handleClick(customer)}>{customer.gstin}</td>
                <td onClick={() => handleClick(customer)} style={{ textAlign: "right" }}>
                  {parseFloat(customer.balance).toFixed(2)}
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
    </div>
  ) : (
    <div>
      {" "}
      <Login />{" "}
    </div>
  );
};

export default InvoiceLedger;
