import React, { useState, useEffect } from 'react';
import { useRevenueReporting } from '../hooks/useRevenueReporting';
import { Principal } from '@dfinity/principal';

// Example component for reporting new revenue
export const ReportRevenueExample: React.FC = () => {
  const { reportRevenue, loading, error } = useRevenueReporting();
  const [msmeId, setMsmeId] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [result, setResult] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Convert amount string to bigint
      const bigintAmount = BigInt(amount);
      const response = await reportRevenue(msmeId, bigintAmount, description);

      if ('ok' in response) {
        setResult(`Successfully reported revenue with ID: ${response.ok}`);
      } else {
        setResult(`Error: ${JSON.stringify(response.err)}`);
      }
    } catch (error) {
      setResult(`Error: ${error}`);
    }
  };

  return (
    <div>
      <h2>Report Revenue</h2>
      {error && <div className="error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>
            MSME ID:
            <input
              type="text"
              value={msmeId}
              onChange={(e) => setMsmeId(e.target.value)}
              required
            />
          </label>
        </div>

        <div>
          <label>
            Amount:
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </label>
        </div>

        <div>
          <label>
            Description:
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </label>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Report Revenue'}
        </button>
      </form>

      {result && <div className="result">{result}</div>}
    </div>
  );
};

// Example component for retrieving revenue details
export const GetRevenueExample: React.FC = () => {
  const { getRevenue, loading, error } = useRevenueReporting();
  const [revenueId, setRevenueId] = useState('');
  const [revenue, setRevenue] = useState<any>(null);

  const handleFetch = async () => {
    try {
      const result = await getRevenue(revenueId);
      setRevenue(result);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Get Revenue Details</h2>
      {error && <div className="error">{error}</div>}

      <div>
        <label>
          Revenue ID:
          <input
            type="text"
            value={revenueId}
            onChange={(e) => setRevenueId(e.target.value)}
          />
        </label>
        <button onClick={handleFetch} disabled={loading || !revenueId}>
          {loading ? 'Loading...' : 'Get Details'}
        </button>
      </div>

      {revenue && (
        <div className="result">
          <h3>Revenue Details</h3>
          <p>ID: {revenue.id}</p>
          <p>MSME ID: {revenue.msmeId}</p>
          <p>Amount: {revenue.amount.toString()}</p>
          <p>Description: {revenue.description}</p>
          <p>Reported: {new Date(Number(revenue.reportDate) / 1_000_000).toLocaleString()}</p>
          <p>Distributed: {revenue.distributed ? 'Yes' : 'No'}</p>

          {revenue.distributed && revenue.distributionTxs.length > 0 && (
            <div>
              <h4>Distribution Transactions</h4>
              <ul>
                {revenue.distributionTxs.map((tx: any, index: number) => (
                  <li key={index}>
                    Token ID: {tx.tokenId.toString()} -
                    Amount: {tx.amount.toString()} -
                    Recipient: {tx.recipient.owner.toString().slice(0, 10)}...
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Example component for distributing revenue
export const DistributeRevenueExample: React.FC = () => {
  const { distributeRevenue, loading, error } = useRevenueReporting();
  const [revenueId, setRevenueId] = useState('');
  const [result, setResult] = useState<string | null>(null);

  const handleDistribute = async () => {
    try {
      const response = await distributeRevenue(revenueId);

      if ('ok' in response) {
        setResult('Successfully distributed revenue to token holders');
      } else {
        setResult(`Error: ${JSON.stringify(response.err)}`);
      }
    } catch (error) {
      setResult(`Error: ${error}`);
    }
  };

  return (
    <div>
      <h2>Distribute Revenue</h2>
      {error && <div className="error">{error}</div>}

      <div>
        <label>
          Revenue ID to Distribute:
          <input
            type="text"
            value={revenueId}
            onChange={(e) => setRevenueId(e.target.value)}
          />
        </label>
        <button onClick={handleDistribute} disabled={loading || !revenueId}>
          {loading ? 'Processing...' : 'Distribute Revenue'}
        </button>
      </div>

      {result && <div className="result">{result}</div>}
    </div>
  );
};

// Example for viewing MSME revenues
export const MSMERevenuesExample: React.FC = () => {
  const { getMSMERevenues, getRevenue, loading, error } = useRevenueReporting();
  const [msmeId, setMsmeId] = useState('');
  const [revenueIds, setRevenueIds] = useState<string[]>([]);
  const [revenues, setRevenues] = useState<any[]>([]);

  const handleFetchRevenues = async () => {
    try {
      const ids = await getMSMERevenues(msmeId);
      setRevenueIds(ids);

      // Fetch details for each revenue
      const details = await Promise.all(
        ids.map(id => getRevenue(id))
      );

      setRevenues(details.filter(Boolean));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h2>MSME Revenues</h2>
      {error && <div className="error">{error}</div>}

      <div>
        <label>
          MSME ID:
          <input
            type="text"
            value={msmeId}
            onChange={(e) => setMsmeId(e.target.value)}
          />
        </label>
        <button onClick={handleFetchRevenues} disabled={loading || !msmeId}>
          {loading ? 'Loading...' : 'Fetch Revenues'}
        </button>
      </div>

      {revenueIds.length > 0 ? (
        <div className="results">
          <h3>Revenue IDs</h3>
          <ul>
            {revenueIds.map(id => (
              <li key={id}>{id}</li>
            ))}
          </ul>

          <h3>Revenue Details</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Amount</th>
                <th>Description</th>
                <th>Date</th>
                <th>Distributed</th>
              </tr>
            </thead>
            <tbody>
              {revenues.map(rev => (
                <tr key={rev.id}>
                  <td>{rev.id}</td>
                  <td>{rev.amount.toString()}</td>
                  <td>{rev.description}</td>
                  <td>{new Date(Number(rev.reportDate) / 1_000_000).toLocaleString()}</td>
                  <td>{rev.distributed ? 'Yes' : 'No'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No revenues found for this MSME.</p>
      )}
    </div>
  );
};

// Full example showing how to use all the hooks
export const RevenueReportingDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('report');

  return (
    <div className="dashboard">
      <h1>Revenue Reporting Dashboard</h1>

      <div className="tabs">
        <button
          className={activeTab === 'report' ? 'active' : ''}
          onClick={() => setActiveTab('report')}
        >
          Report Revenue
        </button>
        <button
          className={activeTab === 'view' ? 'active' : ''}
          onClick={() => setActiveTab('view')}
        >
          View Revenue
        </button>
        <button
          className={activeTab === 'msme' ? 'active' : ''}
          onClick={() => setActiveTab('msme')}
        >
          MSME Revenues
        </button>
        <button
          className={activeTab === 'distribute' ? 'active' : ''}
          onClick={() => setActiveTab('distribute')}
        >
          Distribute Revenue
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'report' && <ReportRevenueExample />}
        {activeTab === 'view' && <GetRevenueExample />}
        {activeTab === 'msme' && <MSMERevenuesExample />}
        {activeTab === 'distribute' && <DistributeRevenueExample />}
      </div>
    </div>
  );
};