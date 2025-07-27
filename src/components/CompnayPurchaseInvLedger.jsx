import React, { useState, useEffect } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import axios from "axios";
import Login from "./Login";
import { useParams } from "react-router-dom";

const PurchaseCompanyInvLedger = () => {
  const { company } = useParams();

  const [customers, setCustomers] = useState([]);

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
      const res = await axios.post(
        `${url}/purchase-invoice/get?page=${page}&limit=${limit}`,
        {
          company: company,
        }
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
          parseFloat(tax)
          // parseFloat(customer.transportCharge)
      ).toFixed(2),
      tax,
    };
  };

  const adjustToNearestWhole = (amount) => {
    const rounded = Math.round(amount);
    const difference = (rounded - amount).toFixed(2);
    return {
      roundedTotal: rounded,
      adjustment: difference > 0 ? `+${difference}` : difference,
    };
  }

  return token ? (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">{company}'s Purchase Invoice Ledger</h1>
      </div>

      <div className="content-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Purchase Invoice Number</th>
              <th>Purchase Invoice Date</th>
              {/* <th>To Company</th> */}
              <th style={{ textAlign: "right" }}>Amount</th>
              <th style={{ textAlign: "right" }}>Tax</th>
              {/* <th style={{ textAlign: "right" }}>Transport Charge</th> */}
              <th style={{ textAlign: "right" }}>Total</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer, index) => (
              <tr key={customer.id}>
                <td>{index + 1}</td>
                <td>
                  {customer.invoiceNumber}
                </td>
                <td>
                  {customer.invoiceDate
                    .substring(0, 10)
                    .split("-")
                    .reverse()
                    .join("/")}
                </td>
                {/* <td>
                  {customer.toCompany}
                </td> */}
                <td style={{ textAlign: "right" }}>
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
                <td style={{ textAlign: "right" }}>{getTaxAndTotal(customer).tax}</td>
                {/* <td style={{ textAlign: "right" }}>{parseFloat(customer.transportCharge).toFixed(2)}</td> */}
                <td style={{ textAlign: "right" }}>{parseFloat(adjustToNearestWhole(getTaxAndTotal(customer).total).roundedTotal).toFixed(2)}</td>
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
    </div>
  ) : (
    <div>
      {" "}
      <Login />{" "}
    </div>
  );
};

export default PurchaseCompanyInvLedger;
