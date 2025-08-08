import React, { useState, Fragment } from 'react';
import ReactDOM from 'react-dom/client';

const App = () => {
  const [totalHeld, setTotalHeld] = useState('');
  const [attended, setAttended] = useState('');
  const [totalSemester, setTotalSemester] = useState('');
  const [requiredPercent, setRequiredPercent] = useState('75');

  const [currentPercent, setCurrentPercent] = useState(null);
  const [prediction, setPrediction] = useState('');
  const [error, setError] = useState('');

  const handleCalculate = (e) => {
    e.preventDefault();

    const th = Number(totalHeld);
    const a = Number(attended);
    const ts = Number(totalSemester);
    const rp = Number(requiredPercent);

    if (!totalHeld || !attended || !totalSemester || !requiredPercent) {
      setError('Please fill out all fields.');
      setCurrentPercent(null);
      setPrediction('');
      return;
    }

    if (th < 0 || a < 0 || ts < 0 || rp < 0 || rp > 100) {
      setError('Please enter valid, non-negative numbers. Required percentage must be between 0 and 100.');
      setCurrentPercent(null);
      setPrediction('');
      return;
    }

    if (a > th) {
      setError('Classes attended cannot be more than classes held.');
      setCurrentPercent(null);
      setPrediction('');
      return;
    }

    if (th > ts) {
      setError('Classes held cannot be more than total semester classes.');
      setCurrentPercent(null);
      setPrediction('');
      return;
    }

    setError('');

    const current = th > 0 ? (a / th) * 100 : 0;
    setCurrentPercent(current);

    const totalRequired = Math.ceil((rp / 100) * ts);
    const remainingClasses = ts - th;
    const needToAttend = totalRequired - a;

    if (needToAttend <= 0) {
      const canMissTotal = ts - totalRequired;
      const missedSoFar = th - a;
      const canMissMore = canMissTotal - missedSoFar;
      setPrediction(`🎉 You've already met your goal! You can afford to miss ${canMissMore} more class(es).`);
    } else if (needToAttend > remainingClasses) {
      const maxPossible = ((a + remainingClasses) / ts) * 100;
      setPrediction(`😕 It's not possible to reach ${rp}%. The maximum you can achieve is ${maxPossible.toFixed(2)}%.`);
    } else {
      const canMiss = remainingClasses - needToAttend;
      setPrediction(`You need to attend ${needToAttend} of the remaining ${remainingClasses} class(es). You can miss ${canMiss} class(es).`);
    }
  };

  return (
    <Fragment>
      <style>{`
        :root {
          --primary-color: #007bff;
          --success-color: #28a745;
          --warning-color: #ffc107;
          --danger-color: #dc3545;
          --light-color: #f8f9fa;
          --dark-color: #343a40;
          --bg-color: #e9ecef;
          --font-family: 'Poppins', sans-serif;
          --card-shadow: 0 4px 8px rgba(0,0,0,0.1);
          --border-radius: 8px;
        }
        
        body {
          font-family: var(--font-family);
          background-color: var(--bg-color);
          margin: 0;
          padding: 1rem;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          box-sizing: border-box;
        }

        .container {
          background: white;
          padding: 2rem;
          border-radius: var(--border-radius);
          box-shadow: var(--card-shadow);
          width: 100%;
          max-width: 500px;
          text-align: center;
        }

        h1 {
          color: var(--dark-color);
          margin-bottom: 1.5rem;
        }
        
        form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .input-group {
          display: flex;
          flex-direction: column;
          text-align: left;
        }

        .input-group label {
          margin-bottom: 0.5rem;
          color: #6c757d;
          font-weight: 500;
        }

        .input-group input {
          padding: 0.75rem;
          border: 1px solid #ced4da;
          border-radius: var(--border-radius);
          font-family: var(--font-family);
          font-size: 1rem;
        }
        
        .input-group input:focus {
          outline: none;
          border-color: var(--primary-color);
          box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
        }

        .button {
          padding: 0.75rem;
          border: none;
          border-radius: var(--border-radius);
          background-color: var(--primary-color);
          color: white;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        
        .button:hover {
          background-color: #0056b3;
        }
        
        .results {
          margin-top: 2rem;
        }
        
        .error {
          color: var(--danger-color);
          background-color: #f8d7da;
          padding: 1rem;
          border-radius: var(--border-radius);
          margin-bottom: 1.5rem;
        }

        .prediction-text {
           font-size: 1.1rem;
           font-weight: 500;
           color: var(--dark-color);
           line-height: 1.6;
        }
        
        .current-percent-container {
            margin-bottom: 1rem;
        }

        .current-percent-text {
            font-size: 1.2rem;
            color: #6c757d;
        }
        
        .current-percent-value {
            font-size: 2rem;
            font-weight: 700;
        }

        .percent-green { color: var(--success-color); }
        .percent-yellow { color: var(--warning-color); }
        .percent-red { color: var(--danger-color); }
         /* Mobile Responsive Styles */
        @media (max-width: 600px) {
          body {
            padding: 0.5rem;
          }
          .container {
            padding: 1rem;
            max-width: 98vw;
            border-radius: 0;
            box-shadow: none;
          }
          h1 {
            font-size: 1.5rem;
            margin-bottom: 1rem;
          }
          .input-group input {
            font-size: 0.95rem;
            padding: 0.6rem;
          }
          .button {
            font-size: 1rem;
            padding: 0.6rem;
          }
          .results {
            margin-top: 1rem;
          }
          .current-percent-value {
            font-size: 1.5rem;
          }
        }
      `}</style>
      <main className="container">
        <h1>Attendance Predictor</h1>
        <form onSubmit={handleCalculate}>
          <div className="input-group">
            <label htmlFor="total-held">Total Classes Held So Far</label>
            <input id="total-held" type="number" value={totalHeld} onChange={e => setTotalHeld(e.target.value)} placeholder="e.g., 20" aria-label="Total Classes Held So Far" />
          </div>
          <div className="input-group">
            <label htmlFor="attended">Classes Attended</label>
            <input id="attended" type="number" value={attended} onChange={e => setAttended(e.target.value)} placeholder="e.g., 15" aria-label="Classes Attended" />
          </div>
          <div className="input-group">
            <label htmlFor="total-semester">Total Classes in Semester</label>
            <input id="total-semester" type="number" value={totalSemester} onChange={e => setTotalSemester(e.target.value)} placeholder="e.g., 50" aria-label="Total Classes in Semester" />
          </div>
          <div className="input-group">
            <label htmlFor="required-percent">Required Attendance %</label>
            <input id="required-percent" type="number" value={requiredPercent} onChange={e => setRequiredPercent(e.target.value)} placeholder="e.g., 75" aria-label="Required Attendance Percentage" />
          </div>
          <button className="button" type="submit">Calculate</button>
        </form>

        {error && <p className="error">{error}</p>}

        {(currentPercent !== null || prediction) && !error && (
          <div className="results">
            {currentPercent !== null && (
              <div className="current-percent-container">
                <p className="current-percent-text">Your current attendance is</p>
                <p className={`current-percent-value ${currentPercent >= (Number(requiredPercent) || 75) ? 'percent-green' : currentPercent >= (Number(requiredPercent) || 75) - 10 ? 'percent-yellow' : 'percent-red'}`}>
                  {currentPercent.toFixed(2)}%
                </p>
              </div>
            )}
            {prediction && <p className="prediction-text">{prediction}</p>}
          </div>
        )}
      </main>
    </Fragment>
  );
};

const container = document.getElementById("root");
const root = ReactDOM.createRoot(container);
root.render(<App />);