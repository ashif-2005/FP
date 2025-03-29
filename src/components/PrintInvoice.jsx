import logo from "../assets/logo.png";
import { useRef } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { useLocation } from "react-router-dom";
import './InvoiceForm.css'

const PrintInvoice = () => {
  const contentRef = useRef(null);
  const location = useLocation();
  const data = location.state;

  const generatePDF = async () => {
    const doc = new jsPDF("p", "mm", "a4");
    const content = contentRef.current;

    const canvas = await html2canvas(content, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    const pdfWidth = doc.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    doc.addImage(imgData, "PNG", 10, 10, pdfWidth - 20, pdfHeight);
    return doc;
  };

  const previewPDF = async () => {
    const doc = await generatePDF();
    window.open(doc.output("bloburl"), "_blank");
  };

  const downloadPDF = async () => {
    const doc = await generatePDF();
    doc.save("template.pdf");
  };

  const sgst = data?.totalAmount * 0.09;
  const cgst = data?.totalAmount * 0.09;

  function numberToWords(num) {
    const belowTwenty = [
      "",
      "One",
      "Two",
      "Three",
      "Four",
      "Five",
      "Six",
      "Seven",
      "Eight",
      "Nine",
      "Ten",
      "Eleven",
      "Twelve",
      "Thirteen",
      "Fourteen",
      "Fifteen",
      "Sixteen",
      "Seventeen",
      "Eighteen",
      "Nineteen",
    ];
    const tens = [
      "",
      "",
      "Twenty",
      "Thirty",
      "Forty",
      "Fifty",
      "Sixty",
      "Seventy",
      "Eighty",
      "Ninety",
    ];
    const aboveThousand = ["", "Thousand", "Lakh", "Crore"];

    if (num === 0) return "Zero";

    function convertToWords(n) {
      if (n < 20) {
        return belowTwenty[n];
      } else if (n < 100) {
        return (
          tens[Math.floor(n / 10)] +
          (n % 10 !== 0 ? " " + belowTwenty[n % 10] : "")
        );
      } else if (n < 1000) {
        return (
          belowTwenty[Math.floor(n / 100)] +
          " Hundred" +
          (n % 100 !== 0 ? " and " + convertToWords(n % 100) : "")
        );
      }
      return "";
    }

    let parts = [];
    let units = [10000000, 100000, 1000, 1];
    let unitNames = ["Crore", "Lakh", "Thousand", ""];

    for (let i = 0; i < units.length; i++) {
      let divisor = units[i];
      if (num >= divisor) {
        let part = Math.floor(num / divisor);
        num %= divisor;
        if (part > 0) {
          parts.push(
            convertToWords(part) + (unitNames[i] ? " " + unitNames[i] : "")
          );
        }
      }
    }

    return parts.join(" ").trim();
  }

  function adjustToNearestWhole(amount) {
    const rounded = Math.round(amount);
    const difference = (rounded - amount).toFixed(2);

    return {
      roundedTotal: rounded,
      adjustment: difference > 0 ? `+${difference}` : difference,
    };
  }

  let totalQuantity = 0;

  data?.items.forEach((item) => {
    totalQuantity += parseInt(item.quantity);
  });

  const totalAdjusted = adjustToNearestWhole(data?.totalAmount + sgst + cgst);
  const amountInWords = numberToWords(totalAdjusted.roundedTotal);

  return (
    <div className="page-container">
      <div ref={contentRef} className="outer">
        <div className="outer-border">
          <div className="outer-flex">
            <div className="logo-invoice">
              <img src={logo} alt="LOGO" className="inv-logo" />
            </div>
            <div className="company">
              <h1 className="company-name">FRIENDS PACKS</h1>
              <p className="company-address">
                6-A Jeeva Colony(Extn.), A V P LAYOUT 3rd STREET, GANDHINAGAR
                (PO), TIRUPUR-641603
              </p>
              <p className="company-detail">
                Email: friendspacks74@gmail.com, PHONE: 0421 4333524, MOBILE:
                9443373524
              </p>
              <p className="compny-detail">
                GSTIN: 33AGGPR1091N1Z3, STATE: TAMIL NADU, STATE CODE: 33
              </p>
            </div>
          </div>
          <div className="to-company">
            <div className="to-company-detail">
              <h1 className="to">To</h1>
              <p className="to-company-name">
                M/s: {data?.companyName}
              </p>
              <p className="to-company-details">{data?.address}</p>
              <p className="to-company-details"> {data?.city}</p>
              <p className="to-company-details">{data?.state}</p>
              <div className="gst-code">
                <p className="gst">
                  GSTIN: {data?.gstno}
                </p>
                <p className="code">STATE CODE: 33</p>
              </div>
            </div>
            <div className="invoice-detail">
              <div className="tax-invoice">
                <h1 className="tax-text">TAX INVOICE</h1>
              </div>
              <div className="condition">
                <h1 className="condition-text">
                  Tax is payable on reverse change: Yes / No
                </h1>
              </div>
              <div className="invoice-po">
                <div className="inv-details">
                  <p className="inv-po">
                    INVOICE NO:{" "}
                    <span className="inv-no">
                      {data?.invoiceNo}
                    </span>
                  </p>
                  <p className="inv-po">
                    INVOICE DATE:{" "}
                    <span className="inv-po-date">{data?.invoiceDate}</span>
                  </p>
                </div>
                <div className="inv-details">
                  <p className="inv-po">
                    PO NO:{" "}
                    <span className="po-no">{data?.poNumber}</span>
                  </p>
                  <p className="inv-po">
                    PO DATE: <span className="inv-po-date">{data?.poDate}</span>
                  </p>
                </div>
              </div>
              <div className="transport">
                <p className="trans">
                  Transpotation Mode: {data?.transport}
                </p>
                <p className="trans">
                  Place Of Supply: {data?.place}
                </p>
              </div>
            </div>
          </div>
          <div>
            <table className="table">
              <thead>
                <tr>
                  <th className="t-head-normal">S.No</th>
                  <th className="t-head-normal">HSN Code</th>
                  <th className="t-head-normal">DC No</th>
                  <th className="t-head-desc">
                    Description
                  </th>
                  <th className="t-head-normal">
                    Quantity (Kgs/Nos)
                  </th>
                  <th className="t-head-normal">Rate</th>
                  <th className="t-head-amount">Amount</th>
                </tr>
              </thead>
              <tbody className="t-body">
                {data?.items.map((item, index) => (
                  <tr key={index}>
                    <td className="t-data">{index + 1}</td>
                    <td className="t-data">
                      {item.hsnCode}
                    </td>
                    <td className="t-data">
                      {item.dcNumber}
                    </td>
                    <td className="t-data">{item.itemName}</td>
                    {item.quantity != 0 ? (
                      <td className="t-data">
                        {item.quantity}
                      </td>
                    ) : (
                      <td className="t-data"></td>
                    )}
                    {item.price != 0 ? (
                      <td className="t-data">
                        {parseFloat(item.price).toFixed(2)}
                      </td>
                    ) : (
                      <td className="t-data"></td>
                    )}
                    {item.price * item.quantity ? (
                      <td className="t-data">
                        {(
                          parseFloat(item.price) * parseInt(item.quantity)
                        ).toFixed(2)}
                      </td>
                    ) : (
                      <td className="t-data"></td>
                    )}
                  </tr>
                ))}
                {Array.from({ length: 16 - data?.items.length }, (_, index) => (
                  <tr key={index}>
                    <td className="t-data">&nbsp;</td>
                    <td className="t-data">&nbsp;</td>
                    <td className="t-data">&nbsp;</td>
                    <td className="t-data">&nbsp;</td>
                    <td className="t-data">&nbsp;</td>
                    <td className="t-data">&nbsp;</td>
                    <td className="t-data">&nbsp;</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="acc">
            <div className="bank-tot">
              <p>BANK RTGS DETAILS</p>
              <p>TOTAL</p>
            </div>
            <div className="quan-amt">
              <p>{totalQuantity}</p>
              <p>{parseFloat(data?.totalAmount).toFixed(2)}</p>
            </div>
          </div>
          <div className="bank-detail">
            <div className="bank-details">
              <p>
                Bank Name: <span className="bank-name">HDFC BANK LTD,</span>
              </p>
              <p>Account No: 50200014924572,</p>
              <p>IFSC Code: HDFC0002408,</p>
              <p>Branch: INDIRA NAGAR BRANCH, TIRUPPUR.</p>
            </div>
            <div className="amt-detail">
              <div className="calculation">
                <p>SGST @9%:</p>
                <p>{parseFloat(cgst).toFixed(2)}</p>
              </div>
              <div className="calculation">
                <p>CGST @9%:</p>
                <p>{parseFloat(cgst).toFixed(2)}</p>
              </div>
              <div className="calculation">
                <p>IGST @9%:</p>
                <p>0.00</p>
              </div>
              <div className="calculation">
                <p>Round Off:</p>
                <p>{totalAdjusted.adjustment}</p>
              </div>
            </div>
          </div>
          <div className="word-total">
            <div className="word">
              <p className="wrd">AMOUNT IN WORDS</p>
              <p className="amt-word">{amountInWords} only</p>
            </div>
            <div className="grnd-tot">
              <p className="grnd-total">GRAND TOTAL:</p>
              <p>{parseFloat(totalAdjusted.roundedTotal).toFixed(2)}</p>
            </div>
          </div>
          <div className="sign">
            <div className="reciver">
              <p className="space">Receiver Signature</p>
            </div>
            <div className="terms">
              <p>Terms & Condition:</p>
              <p>* Goods once sold cannot be taken back</p>
              <p>
                * The payment should be made only way of crossed Draft/ Cheque
                in favour of FRIENDS PACKS.
              </p>
              <p className="mb-10">
                * All disputes subject to tirupur jurisdiction only.
              </p>
            </div>
            <div className="fp">
              <p className="fp-b">For FRIENDS PACKS</p>
              <p className="space">Authorised Signature</p>
            </div>
          </div>
        </div>
      </div>
      <div className="action">
        <button onClick={previewPDF} className="save-button">
          Print Invoice
        </button>
        <button onClick={downloadPDF} className="save-button">
          Download Invoice
        </button>
      </div>
    </div>
  );
};

export default PrintInvoice;
