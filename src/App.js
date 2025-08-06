import { useState } from 'react';

function calculateFees({
  weeksPerYear,
  longDays,
  shortDays,
  fundedHoursPerWeek,
  hourlyRate,
  consumableFee,
  forestFee,
}) {
  const fundedWeeks = 38;
  const longDayHours = 9.5;
  const shortDayHours = 8;

  // Day rates (used only when fundedHoursPerWeek === 0)
  const longDayRate = 116;
  const shortDayRate = 105;

  const totalHours = ((longDays * longDayHours) + (shortDays * shortDayHours)) * weeksPerYear;

  let fundedHours = 0;
  let fundedCost = 0;
  let unfundedHours = 0;
  let unfundedCost = 0;
  let annualTotal = 0;

  if (fundedHoursPerWeek === 0) {
    // No funding: use day rate pricing
    annualTotal = ((longDays * longDayRate) + (shortDays * shortDayRate)) * weeksPerYear;
  } else {
    fundedHours = fundedHoursPerWeek * fundedWeeks;
    fundedCost = fundedHours * (consumableFee + forestFee);
    unfundedHours = totalHours - fundedHours;
    unfundedCost = unfundedHours * hourlyRate;
    annualTotal = fundedCost + unfundedCost;
  }

  const monthlyTotal = annualTotal / 12;
  const deposit = ((longDays * longDayRate) + (shortDays * shortDayRate)) * 4;

  return {
    totalHours,
    fundedHours,
    unfundedHours,
    fundedCost,
    unfundedCost,
    annualTotal,
    monthlyTotal: monthlyTotal.toFixed(2),
    deposit: deposit.toFixed(2),
  };
}

function App() {
  const [inputs, setInputs] = useState({
    weeksPerYear: 47,
    longDays: 3,
    shortDays: 0,
    fundedHoursPerWeek: 15,
    hourlyRate: 12.5,
    consumableFee: 2,
    forestFee: 2.5,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs({ ...inputs, [name]: parseFloat(value) || 0 });
  };

  const result = calculateFees(inputs);

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: 20 }}>
      <h2>Childcare Fee Calculator</h2>

      <label>
        Weeks per Year:
        <select name="weeksPerYear" value={inputs.weeksPerYear} onChange={handleChange}>
          <option value={47}>47 (Full Year)</option>
          <option value={39}>39 (Term-Time)</option>
        </select>
      </label>

      <br /><br />

      <label>
        Long Days per Week:
        <input type="number" name="longDays" value={inputs.longDays} onChange={handleChange} />
      </label>

      <br /><br />

      <label>
        Short Days per Week:
        <input type="number" name="shortDays" value={inputs.shortDays} onChange={handleChange} />
      </label>

      <br /><br />

      <label>
        Funded Hours per Week:
        <select name="fundedHoursPerWeek" value={inputs.fundedHoursPerWeek} onChange={handleChange}>
          <option value={0}>0</option>
          <option value={15}>15</option>
          <option value={30}>30</option>
        </select>
      </label>

      <hr />

      <h3>Results:</h3>
      <p><strong>Total Hours per Year:</strong> {result.totalHours.toFixed(1)}</p>

      {inputs.fundedHoursPerWeek > 0 && (
        <>
          <p><strong>Funded Hours:</strong> {result.fundedHours}</p>
          <p><strong>Unfunded Hours:</strong> {result.unfundedHours.toFixed(1)}</p>
          <p><strong>Funded Cost:</strong> £{result.fundedCost.toFixed(2)}</p>
          <p><strong>Unfunded Cost:</strong> £{result.unfundedCost.toFixed(2)}</p>
        </>
      )}

      <p><strong>Annual Total:</strong> £{result.annualTotal.toFixed(2)}</p>
      <p><strong>Monthly Fee:</strong> £{result.monthlyTotal}</p>
      <p><strong>Deposit Amount:</strong> £{result.deposit}</p>
    </div>
  );
}

export default App;
