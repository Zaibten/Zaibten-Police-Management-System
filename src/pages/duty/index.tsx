import React, { useState } from "react";

interface Policeman {
  badgeNumber: string;
  name: string;
  rank: string;
  status: string;
  contact: string;
  policeStation: string;
}

const Duty: React.FC = () => {
  const [badgeNumber, setBadgeNumber] = useState("");
  const [policeman, setPoliceman] = useState<Policeman | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const today = new Date().toISOString().split("T")[0];
  const [dateError, setDateError] = useState("");
  const [isErrorMessage, setIsErrorMessage] = useState(false);


  const [formData, setFormData] = useState({
    location: "",
    xCoord: "",
    yCoord: "",
    shift: "",
    dutyType: "single", // "single" or "multiple"
    dutyDate: "",
    fromDate: "",
    toDate: "",
  });

const handleSearch = async () => {
  if (!badgeNumber.trim()) {
    alert("Please enter a badge number");
    return;
  }
setLoading(true);
  try {
    const response = await fetch(`https://zaibtenpoliceserver.vercel.app/api/constable/${badgeNumber.trim()}`);
    if (!response.ok) throw new Error("Policeman not found");
    const data = await response.json();
    setPoliceman({
      badgeNumber: data.badgeNumber,
      name: data.fullName,
      rank: data.rank,
      status: data.status, // replace with real field if you have it
      contact:data.contactNumber,
      policeStation: data.policeStation,
    });
  } catch (err) {
    alert('This Badge no not exist in our record !!');
    // setModalVisible(true);  // Show modal instead of alert
    // setPoliceman(null);
    // setPoliceman(null);
  }
  finally {
    setLoading(false);
  }
};

const getStatusBgColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "active":
      return "bg-green-500 text-white";
    case "onleave":
      return "bg-yellow-400 text-black";
    case "suspended":
      return "bg-red-600 text-white";
    case "retired":
      return "bg-gray-500 text-white";
    default:
      return "bg-gray-300 text-black"; // fallback color
  }
};


  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!policeman) return alert("Please search and select a policeman first.");

  // 🚫 Date validation for "multiple" dutyType
  if (formData.dutyType === "multiple") {
    const from = new Date(formData.fromDate);
    const to = new Date(formData.toDate);

    if (!formData.fromDate || !formData.toDate) {
      setDateError("Both From Date and To Date are required.");
      return;
    }

    if (from > to) {
      setDateError("From Date cannot be greater than To Date.");
      return;
    }

    setDateError(""); // ✅ Clear error if valid
  }

  // Prepare data for API
const payload = {
  badgeNumber: policeman.badgeNumber,
  name: policeman.name,
  rank: policeman.rank,
  status: policeman.status,
  contact: policeman.contact,
  policeStation: policeman.policeStation,
  location: formData.location,
  xCoord: Number(formData.xCoord),
  yCoord: Number(formData.yCoord),
  shift: formData.shift,
  dutyType: formData.dutyType,
  dutyDate: formData.dutyType === "single" ? formData.dutyDate : formData.fromDate,
  fromDate: formData.dutyType === "multiple" ? formData.fromDate : undefined,
  toDate: formData.dutyType === "multiple" ? formData.toDate : undefined,
  batchNumber: "Batch1",
};

  try {
    const res = await fetch("https://zaibtenpoliceserver.vercel.app/api/assign-duty", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to assign duty");

    setModalMessage(data.message);
    setIsErrorMessage(false);
    setModalVisible(true);

    setFormData({
      location: "",
      xCoord: "",
      yCoord: "",
      shift: "",
      dutyType: "single",
      dutyDate: "",
      fromDate: "",
      toDate: "",
    });
    setBadgeNumber("");
    setPoliceman(null);
  } catch (error: any) {
    setModalMessage(error.message);
    setIsErrorMessage(true);
    setModalVisible(true);
  }
};




  return (
    <div className="min-h-screen bg-gray-100 dark:bg-[#0b1120] p-6 flex justify-center items-start">
      {/* Full width container */}
      <div
        className="w-full max-w-full bg-white dark:bg-gray-900 rounded-xl shadow-md p-6
                      overflow-auto max-h-[90vh]"
        style={{ maxWidth: "100%" }}
      >
        <h2 className="text-3xl font-bold mb-8 text-center text-blue-700">Assign Duty to Policeman</h2>


        {/* Badge Number Search */}
        <div className="flex flex-col sm:flex-row items-center gap-3 mb-6 max-w-md mx-auto">
          <input
            type="text"
            placeholder="Enter Badge Number"
            required
            value={badgeNumber}
            onChange={(e) => setBadgeNumber(e.target.value)}
            className="w-full sm:flex-1 px-4 py-3 border rounded-lg bg-gray-100 dark:bg-gray-800
                       text-gray-900 dark:text-white text-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <button
  onClick={handleSearch}
  type="button"
  disabled={loading}
  className={`w-full sm:w-auto mt-2 sm:mt-0 p-3 rounded-lg transition text-white ${
    loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
  }`}
  title="Search Policeman"
>
  {loading ? "Loading..." : "Search"}
</button>

        </div>

        {/* Policeman Info */}
{policeman && (
  <div className="bg-gray-50 dark:bg-gray-800 rounded-xl shadow-inner p-6 mb-6 max-w-3xl mx-auto">
    <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 text-center tracking-wide border-b border-gray-300 dark:border-gray-600 pb-2 mb-6">
  Policeman Details
</h3>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-800 dark:text-gray-300 text-lg">
      <div>
        <strong>Name:</strong> {policeman.name}
      </div>
      <div>
        <strong>Rank:</strong> {policeman.rank}
      </div>
      <div>
        <strong>Badge No:</strong> {policeman.badgeNumber}
      </div>
      <div>
        <strong>Police Station:</strong> {policeman.policeStation}
      </div>
      <div>
        <strong>Contact Number:</strong> {policeman.contact}
      </div>
      <div>
        <strong>Status:</strong>
        <span
          className={`px-2 py-1 rounded-md ml-2 ${getStatusBgColor(policeman.status)}`}
        >
          {policeman.status}
        </span>
      </div>
    </div>
  </div>
)}


        {/* Assignment Form */}
        {policeman && (
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto"
          >
            <div>
              <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300 text-lg">
                Duty Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border rounded-lg bg-gray-100 dark:bg-gray-800
                             text-gray-900 dark:text-white text-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300 text-lg">
                X Coordinate
              </label>
              <input
                type="number"
                name="xCoord"
                value={formData.xCoord}
                onChange={handleChange}
                required
                step="any"
                className="w-full px-4 py-3 border rounded-lg bg-gray-100 dark:bg-gray-800
                             text-gray-900 dark:text-white text-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300 text-lg">
                Y Coordinate
              </label>
              <input
                type="number"
                name="yCoord"
                value={formData.yCoord}
                onChange={handleChange}
                required
                step="any"
                className="w-full px-4 py-3 border rounded-lg bg-gray-100 dark:bg-gray-800
                             text-gray-900 dark:text-white text-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300 text-lg">
                Shift Time
              </label>
              <input
                type="text"
                name="shift"
                placeholder="e.g., 9:00 AM - 5:00 PM"
                value={formData.shift}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border rounded-lg bg-gray-100 dark:bg-gray-800
                             text-gray-900 dark:text-white text-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            {/* Duty Type Select */}
            <div>
              <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300 text-lg">
                Duty Type
              </label>
              <select
                name="dutyType"
                value={formData.dutyType}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-lg bg-gray-100 dark:bg-gray-800
                           text-gray-900 dark:text-white text-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="single">Single Day</option>
                <option value="multiple">Multiple Days</option>
              </select>
            </div>

            {/* Date Inputs */}
            {formData.dutyType === "single" ? (
              <div>
                <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300 text-lg">
                  Duty Date
                </label>
                <input
                  type="date"
                  name="dutyDate"
                  value={formData.dutyDate}
                  onChange={handleChange}
                  min={today}
                  required
                  className="w-full px-4 py-3 border rounded-lg bg-gray-100 dark:bg-gray-800
                               text-gray-900 dark:text-white text-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            ) : (
              <>
                <div>
                  <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300 text-lg">
                    From Date
                  </label>
                  <input
                    type="date"
                    name="fromDate"
                    value={formData.fromDate}
                    onChange={handleChange}
                    min={today}
                    required
                    className="w-full px-4 py-3 border rounded-lg bg-gray-100 dark:bg-gray-800
                                 text-gray-900 dark:text-white text-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300 text-lg">
                    To Date
                  </label>
                  <input
                    type="date"
                    name="toDate"
                    value={formData.toDate}
                    onChange={handleChange}
                    
                    min={today}
                    required
                    className="w-full px-4 py-3 border rounded-lg bg-gray-100 dark:bg-gray-800
                                 text-gray-900 dark:text-white text-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </>
            )}

<br></br>
<style>{`
  .error-message {
    color: #e74c3c;
    background-color: #fdecea;
    border: 1px solid #e74c3c;
    padding: 12px 20px;
    margin-bottom: 15px;
    border-radius: 5px;
    font-weight: 600;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    animation: shake 0.5s ease-in-out;
  }

  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    20%, 60% { transform: translateX(-8px); }
    40%, 80% { transform: translateX(8px); }
  }
`}</style>

{dateError && (
  <div className="error-message max-w-2xl mx-auto mb-4">{dateError}</div>
)}

            <div className="sm:col-span-2 flex justify-center mt-4">
              <button
                type="submit"
                className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg
                           hover:bg-blue-700 transition text-lg w-full sm:w-auto"
              >
                Assign Duty
              </button>
            </div>
          </form>
        )}
      </div>
      {modalVisible && (
  <div
    style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 9999,
      animation: 'fadeIn 0.4s ease-in-out',
      fontFamily: "'Poppins', sans-serif",
    }}
  >
    <div
      style={{
        backgroundColor: '#fff',
        padding: '3rem 2.5rem',
        borderRadius: '1.5rem',
        maxWidth: '500px',
        width: '90%',
        textAlign: 'center',
        boxShadow: '0 25px 70px rgba(0, 0, 0, 0.3)',
        animation: 'slideUpFade 0.5s ease-out forwards',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <img
        src="/logo.png"
        alt="Zaibten Logo"
        style={{
          width: '90px',
          height: '90px',
          margin: '0 auto 1.2rem auto',
          animation: 'bounceIn 0.8s ease',
          borderRadius: '50%',
          boxShadow: '0 6px 18px rgba(0,0,0,0.2)',
        }}
      />

      <h1
        style={{
          fontSize: '1.6rem',
          fontWeight: 'bold',
          color: '#1e293b',
          marginBottom: '0.75rem',
          animation: 'fadeInText 0.6s ease-in-out 0.4s forwards',
          opacity: 1,
        }}
      >
        Zaibten Police Management System
      </h1>

      <h2
        style={{
          fontSize: '1.2rem',
          fontWeight: 600,
          color: '#dc2626',  // red color for error
          marginBottom: '2rem',
          animation: 'fadeInText 0.6s ease-in-out 0.6s forwards',
          opacity: 1,
        }}
      >
        Police Record Not Found!
      </h2>

      <button
        onClick={() => setModalVisible(false)}
        style={{
          backgroundColor: '#dc2626',
          color: '#fff',
          padding: '0.75rem 2rem',
          borderRadius: '10px',
          border: 'none',
          fontWeight: 600,
          fontSize: '1rem',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          animation: 'fadeInText 0.6s ease-in-out 0.8s forwards',
          opacity: 0,
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.backgroundColor = '#b91c1c';
          e.currentTarget.style.transform = 'scale(1.05)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = '#dc2626';
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        Close
      </button>
    </div>

    <style>
      {`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUpFade {
          0% { transform: translateY(30px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }

        @keyframes fadeInText {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes bounceIn {
          0% {
            transform: scale(0.3);
            opacity: 0;
          }
          50% {
            transform: scale(1.1);
            opacity: 1;
          }
          70% {
            transform: scale(0.95);
          }
          100% {
            transform: scale(1);
          }
        }
      `}
    </style>
  </div>
)}
{/* Modal */}
      {modalVisible && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
            animation: "fadeIn 0.4s ease-in-out",
            fontFamily: "'Poppins', sans-serif",
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              padding: "3rem 2.5rem",
              borderRadius: "1.5rem",
              maxWidth: "500px",
              width: "90%",
              textAlign: "center",
              boxShadow: "0 25px 70px rgba(0, 0, 0, 0.3)",
              animation: "slideUpFade 0.5s ease-out forwards",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <img
              src="/logo.png"
              alt="Zaibten Logo"
              style={{
                width: "90px",
                height: "90px",
                margin: "0 auto 1.2rem auto",
                animation: "bounceIn 0.8s ease",
                borderRadius: "50%",
                boxShadow: "0 6px 18px rgba(0,0,0,0.2)",
              }}
            />

            <h1
              style={{
                fontSize: "1.6rem",
                fontWeight: "bold",
                color: "#1e293b",
                marginBottom: "0.75rem",
                animation: "fadeInText 0.6s ease-in-out 0.4s forwards",
                opacity: 1,
              }}
            >
              Zaibten Police Management System
            </h1>

              <p className={`text-lg font-semibold mb-4 ${isErrorMessage ? 'text-red-600' : 'text-green-600'}`}>
        {modalMessage}
      </p>
            <button
              onClick={() => setModalVisible(false)}
              style={{
                backgroundColor: "#dc2626",
                color: "#fff",
                padding: "0.75rem 2rem",
                borderRadius: "10px",
                border: "none",
                fontWeight: 600,
                fontSize: "1rem",
                cursor: "pointer",
                transition: "all 0.3s ease",
                animation: "fadeInText 0.6s ease-in-out 0.8s forwards",
                opacity: 0,
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = "#b91c1c";
                e.currentTarget.style.transform = "scale(1.05)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = "#dc2626";
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              Close
            </button>
          </div>

          <style>
            {`
              @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
              }

              @keyframes slideUpFade {
                0% { transform: translateY(30px); opacity: 0; }
                100% { transform: translateY(0); opacity: 1; }
              }

              @keyframes fadeInText {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
              }

              @keyframes bounceIn {
                0% {
                  transform: scale(0.3);
                  opacity: 0;
                }
                50% {
                  transform: scale(1.1);
                  opacity: 1;
                }
                70% {
                  transform: scale(0.95);
                }
                100% {
                  transform: scale(1);
                }
              }
            `}
          </style>
        </div>
      )}

    </div>
  );
};

export default Duty;
