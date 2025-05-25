import React, { useState } from "react";

interface Policeman {
  badgeNumber: string;
  name: string;
  rank: string;
  department: string;
  policeStation: string;
}

const dummyPolicemen: Policeman[] = [
  {
    badgeNumber: "12345",
    name: "Ali Raza",
    rank: "Inspector",
    department: "Traffic",
    policeStation: "Central Police Station",
  },
  {
    badgeNumber: "67890",
    name: "Ahmed Khan",
    rank: "Constable",
    department: "Patrol",
    policeStation: "North Police Station",
  },
];

const Duty: React.FC = () => {
  const [badgeNumber, setBadgeNumber] = useState("");
  const [policeman, setPoliceman] = useState<Policeman | null>(null);
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

  const handleSearch = () => {
    const found = dummyPolicemen.find(
      (p) => p.badgeNumber === badgeNumber.trim()
    );
    setPoliceman(found || null);
    if (!found) alert("Policeman not found!");
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!policeman) return;

    const dutyRecord = {
      ...formData,
      ...policeman,
    };

    console.log("Assigned Duty:", dutyRecord);
    alert("Duty assigned successfully!");

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
            value={badgeNumber}
            onChange={(e) => setBadgeNumber(e.target.value)}
            className="w-full sm:flex-1 px-4 py-3 border rounded-lg bg-gray-100 dark:bg-gray-800
                       text-gray-900 dark:text-white text-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <button
            onClick={handleSearch}
            type="button"
            className="w-full sm:w-auto mt-2 sm:mt-0 p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
            title="Search Policeman"
          >
            Search
          </button>
        </div>

        {/* Policeman Info */}
        {policeman && (
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl shadow-inner p-6 mb-6 max-w-3xl mx-auto">
            <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
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
                <strong>Department:</strong> {policeman.department}
              </div>
              <div>
                <strong>Badge No:</strong> {policeman.badgeNumber}
              </div>
              <div className="sm:col-span-2">
                <strong>Police Station:</strong> {policeman.policeStation}
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
                    required
                    className="w-full px-4 py-3 border rounded-lg bg-gray-100 dark:bg-gray-800
                                 text-gray-900 dark:text-white text-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </>
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
    </div>
  );
};

export default Duty;
