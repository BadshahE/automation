import React, { useState, useEffect } from 'react';
import { adminApi } from '../../services/api';
import { Activity, Search, CheckCircle2, AlertTriangle, Info } from 'lucide-react';

export default function ActivityLogs() {
  const [logs, setLogs] = useState([]);
  const [filterEvent, setFilterEvent] = useState('all');

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const res = await adminApi.getActivityLogs();
      setLogs(res.data.logs);
    } catch (err) {
      console.error('Error loading logs:', err);
    }
  };

  const getStatusBadge = (status) => {
    if (status === 'success') return <span className="badge badge-success"><CheckCircle2 size={12} /> Success</span>;
    if (status === 'warning') return <span className="badge badge-warning"><AlertTriangle size={12} /> Warning</span>;
    return <span className="badge badge-info"><Info size={12} /> Info</span>;
  };

  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '6px' }}>System Activity Logs</h1>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
          Real-time audit trail of background worker executions, Meta API publishing events, AI provider failovers, and Comment-to-DM triggers.
        </p>
      </div>

      <div className="glass-panel" style={{ overflowX: 'auto' }}>
        <table className="custom-table">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>User / Actor</th>
              <th>Event</th>
              <th>Platform</th>
              <th>Status</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {logs.map(log => (
              <tr key={log.id}>
                <td style={{ fontSize: '12px', color: 'var(--text-dim)', whiteSpace: 'nowrap' }}>
                  {new Date(log.timestamp).toLocaleString()}
                </td>
                <td><strong>{log.user}</strong></td>
                <td><span className="badge badge-info">{log.event}</span></td>
                <td>{log.platform}</td>
                <td>{getStatusBadge(log.status)}</td>
                <td style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{log.details}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
