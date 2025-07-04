import axios from "axios";
import { useEffect, useState } from "react";
import { MdOutlineArrowDropDown } from "react-icons/md";

const DriverLedger = () => {
  const [driver, setDriver] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDriver, setSelectedDriver] = useState("");
  const openingBalance = 2000;
  let previousBalance = openingBalance;

  // Fetch driver ledger data
  useEffect(() => {
    axios
      .get("https://api.tramessy.com/mstrading/api/driverLedger/list")
      .then((response) => {
        if (response.data.status === "Success") {
          setDriver(response.data.data);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching driver data:", error);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-center mt-16">Loading Driver...</p>;

  const driverNames = [...new Set(driver.map((d) => d.driver_name))];

  const filteredDriver = selectedDriver
    ? driver.filter((d) => d.driver_name === selectedDriver)
    : driver;

  const footerTotals = filteredDriver.reduce(
    (totals, item) => {
      const sales = Number(item.trip_rent || 0);
      const commission = Number(item.commission || 0);
      const advance = Number(item.advanced || 0);
      const totalExpense =
        Number(item.labor || 0) +
        Number(item.parking_cost || 0) +
        Number(item.night_guard || 0) +
        Number(item.toll_cost || 0) +
        Number(item.feri_cost || 0) +
        Number(item.police_cost || 0) +
        Number(item.chada || 0);
      const balance = advance - totalExpense;

      totals.sales += sales;
      totals.commission += commission;
      totals.advance += advance;
      totals.total += totalExpense;
      totals.balance += balance;

      return totals;
    },
    {
      sales: 0,
      commission: 0,
      advance: 0,
      total: 0,
      balance: 0,
    }
  );

  return (
    <div className="bg-gradient-to-br from-gray-100 to-white md:p-4">
      <div className="overflow-hidden overflow-x-auto max-w-5xl mx-auto bg-gradient-to-br from-gray-100 to-white">
        {/* Header */}
        <div className="md:flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-[#11375B] capitalize flex items-center gap-3">
            Driver ledger : {selectedDriver}
          </h1>
          <div className="mt-3 md:mt-0 flex gap-2"></div>
        </div>

        {/* Export and Driver Dropdown */}
        <div className="md:flex items-center justify-between mb-4">
          <div className="flex gap-1 md:gap-3 flex-wrap">
            <button className="py-2 px-5 bg-gray-200 text-primary font-semibold rounded-md hover:bg-primary hover:text-white transition-all cursor-pointer">
              Excel
            </button>
            <button className="py-2 px-5 bg-gray-200 text-primary font-semibold rounded-md hover:bg-primary hover:text-white transition-all cursor-pointer">
              PDF
            </button>
            <button className="py-2 px-5 bg-gray-200 text-primary font-semibold rounded-md hover:bg-primary hover:text-white transition-all cursor-pointer">
              Print
            </button>
          </div>

          {/* Driver dropdown */}
          <div className="mt-3 md:mt-0">
            <div className="relative w-full">
              <label className="text-primary text-sm font-semibold">
                Select Driver
              </label>
              <select
                value={selectedDriver}
                onChange={(e) => setSelectedDriver(e.target.value)}
                className="mt-1 w-full text-gray-500 text-sm border border-gray-300 bg-white p-2 rounded appearance-none outline-none"
              >
                <option value="">All Drivers</option>
                {driverNames.map((name, idx) => (
                  <option key={idx} value={name}>
                    {name}
                  </option>
                ))}
              </select>
              <MdOutlineArrowDropDown className="absolute top-[35px] right-2 pointer-events-none text-xl text-gray-500" />
            </div>
          </div>
        </div>

        {/* Table with scroll */}
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left text-gray-900">
            <thead>
              <tr>
                <th rowSpan="2" className="border border-black px-2 py-1">
                  Date
                </th>
                <th colSpan="4" className="border border-black py-1">
                  Particulars
                </th>
                <th rowSpan="2" className="border border-black px-2 py-1">
                  Advance
                </th>
                <th colSpan="8" className="border border-black px-2 py-1">
                  Expense
                </th>
                <th rowSpan="2" className="border border-black py-1">
                  <p className="border-b">OpeningBalance : 2000</p> Balance
                </th>
              </tr>
              <tr>
                <th className="border border-black px-2 py-1">Load</th>
                <th className="border border-black px-2 py-1">Unload</th>
                <th className="border border-black px-2 py-1">Sales</th>
                <th className="border border-black px-2 py-1">Commission</th>
                <th className="border border-black px-2 py-1">Labor</th>
                <th className="border border-black px-2 py-1">Parking</th>
                <th className="border border-black px-2 py-1">Night</th>
                <th className="border border-black px-2 py-1">Toll</th>
                <th className="border border-black px-2 py-1">Ferry</th>
                <th className="border border-black px-2 py-1">Police</th>
                <th className="border border-black px-2 py-1">Chada</th>
                <th className="border border-black px-2 py-1">Total</th>
              </tr>
            </thead>
            <tbody className="overflow-x-auto">
              {filteredDriver.map((item, index) => {
                const {
                  labor = 0,
                  parking_cost = 0,
                  night_guard = 0,
                  toll_cost = 0,
                  feri_cost = 0,
                  police_cost = 0,
                  chada = 0,
                  advanced = 0,
                } = item;

                const totalExpense =
                  Number(labor) +
                  Number(parking_cost) +
                  Number(night_guard) +
                  Number(toll_cost) +
                  Number(feri_cost) +
                  Number(police_cost) +
                  Number(chada);

                const balance =
                  previousBalance + Number(advanced) - totalExpense;

                previousBalance = balance;

                return (
                  <tr key={index}>
                    <td className="border border-black px-2 py-1">
                      {item.date}
                    </td>
                    <td className="border border-black px-2 py-1">
                      {item.load_point}
                    </td>
                    <td className="border border-black px-2 py-1">
                      {item.unload_point}
                    </td>
                    <td className="border border-black px-2 py-1">
                      {item.trip_rent}
                    </td>
                    <td className="border border-black px-2 py-1">
                      {item.commission}
                    </td>
                    <td className="border border-black px-2 py-1">
                      {item.advanced}
                    </td>
                    <td className="border border-black px-2 py-1">
                      {item.labor}
                    </td>
                    <td className="border border-black px-2 py-1">
                      {item.parking_cost}
                    </td>
                    <td className="border border-black px-2 py-1">
                      {item.night_guard}
                    </td>
                    <td className="border border-black px-2 py-1">
                      {item.toll_cost}
                    </td>
                    <td className="border border-black px-2 py-1">
                      {item.feri_cost}
                    </td>
                    <td className="border border-black px-2 py-1">
                      {item.police_cost}
                    </td>
                    <td className="border border-black px-2 py-1">
                      {item.chada}
                    </td>
                    <td className="border border-black px-2 py-1">
                      {totalExpense}
                    </td>
                    <td className="border border-black px-2 py-1">
                      {balance < 0 ? `(${Math.abs(balance)})` : balance}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="font-bold bg-gray-100">
                <td
                  colSpan={3}
                  className="border border-black px-2 py-1 text-right"
                >
                  Total:
                </td>
                <td className="border border-black px-2 py-1">
                  {footerTotals.sales}
                </td>
                <td className="border border-black px-2 py-1">
                  {footerTotals.commission}
                </td>
                <td className="border border-black px-2 py-1">
                  {footerTotals.advance}
                </td>
                <td colSpan={7} className="border border-black px-2 py-1"></td>
                <td className="border border-black px-2 py-1">
                  {footerTotals.total}
                </td>
                <td className="border border-black px-2 py-1">
                  {footerTotals.balance + openingBalance}
                </td>
              </tr>
              <tr className="font-bold bg-gray-100">
                <td
                  colSpan={3}
                  className="border border-black px-2 py-1 text-right"
                >
                  Monthly report :
                </td>
                <td
                  colSpan={12}
                  className="border border-black px-8 py-1 text-right"
                >
                  {footerTotals.balance +
                    openingBalance -
                    footerTotals.commission <
                  0
                    ? `(${Math.abs(
                        footerTotals.balance +
                          openingBalance -
                          footerTotals.commission
                      )})`
                    : footerTotals.balance +
                      openingBalance -
                      footerTotals.commission}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DriverLedger;
