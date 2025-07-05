import React, { useState, useEffect } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import axios from "axios";
import Login from "./Login";
import { useParams } from "react-router-dom";

const CompanyPartyLedger = () => {
  const { company } = useParams();

  const [customers, setCustomers] = useState([]);

  const [page, setPage] = useState(1);
  const [limit] = useState(15);
  const [totalPages, setTotalPages] = useState(1);
  const [data, setData] = useState({})
  const [amountTotal, setAmounTotal] = useState(0);
  const [paymentTotal, setPaymentTotal] = useState(0);

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
    getCompany();
  }, []);

  useEffect(() => {
    getCustomer();
  }, [page]);

  const getCustomer = async () => {
    try {
      const res = await axios.post(
        `${url}/log/get?page=${page}&limit=${limit}`,
        {
          company: company,
        }
      );
      let amtTotal = 0;
      let pmtTotal = 0;
      res.data.data.map((customer)=>{
        amtTotal += customer.amount;
        pmtTotal += customer.paymentTotal;
      })
      setAmounTotal(amtTotal);
      setPaymentTotal(pmtTotal);
      setCustomers(res.data.data);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.log(err);
    }
  };

  const getCompany = async () => {
    try{
      const res = await axios.post(
        `${url}/customer/get`,
        {
          company: company,
        }
      );
      setData(res.data)
    } catch(err){
      console.log(err)
    }
  }

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
          parseFloat(tax) +
          parseFloat(customer.transportCharge)
      ).toFixed(2),
      tax,
    };
  };

  return token ? (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">{company}'s Sales Ledger</h1>
      </div>

      <div className="content-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>S No</th>
              <th>Invoice / Voucher Date</th>
              {/* <th>Party Name</th> */}
              <th>Invoice / Voucher Number</th>
              <th>Type</th>
              <th>Payment Mode</th>
              <th>Bank</th>
              <th>Cheque Number</th>
              <th>Amount</th>
              <th>Payment</th>
              <th>Balance</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan="8" style={{ textAlign: "center", fontWeight: "bold" }}>OPENING BALANCE</td>
              <td style={{ textAlign: "right", fontWeight: "bold" }}>{parseFloat(data.op_balance).toFixed(2)}</td>
              <td></td>
              <td style={{ textAlign: "right", fontWeight: "bold" }}>{parseFloat(data.op_balance).toFixed(2)}</td>
            </tr>
            {customers.map((customer, index) => (
              <tr key={customer.id}>
                <td>{index + 1}</td>
                <td>
                  {customer.logDate
                    .substring(0, 10)
                    .split("-")
                    .reverse()
                    .join("/")}
                </td>
                {/* <td>{customer.partyCompany}</td> */}
                <td>{customer.refNum}</td>
                <td>{customer.logType}</td>
                <td>{customer.paymentMode}</td>
                <td>{customer.bank}</td>
                <td>{customer.chequeNum}</td>
                <td style={{ textAlign: "right" }}>{parseFloat(customer.amount).toFixed(2)}</td>
                <td style={{ textAlign: "right" }}>{parseFloat(customer.payment).toFixed(2)}</td>
                <td style={{ textAlign: "right" }}>{parseFloat(customer.balance).toFixed(2)}</td>
              </tr>
            ))}
            {/* <tr>
              <td colSpan="8" style={{ textAlign: "center", fontWeight: "bold" }}>TOTAL</td>
              <td style={{ fontWeight: "bold" }}>{parseFloat(amountTotal).toFixed(2)}</td>
              {paymentTotal ? <td style={{ fontWeight: "bold" }}>{parseFloat(paymentTotal).toFixed(2)}</td> : <td style={{ fontWeight: "bold" }}>0.00</td>}
              <td></td>
            </tr> */}
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

export default CompanyPartyLedger;
