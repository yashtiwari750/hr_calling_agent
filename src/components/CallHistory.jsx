import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Phone, Clock, CheckCircle, XCircle } from 'lucide-react';

export default function CallHistory({ calls, onSelectCall, selectedCallId }) {
  const styles = {
    container: {
      width: '100%',
      maxWidth: '400px',
      background: 'rgba(255, 255, 255, 0.1)',
      borderRadius: '1.5rem',
      padding: '1.5rem',
      marginTop: '2rem',
      backdropFilter: 'blur(40px)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
    },
    title: {
      color: 'white',
      fontSize: '1.25rem',
      fontWeight: '600',
      marginBottom: '1rem',
    },
    list: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.75rem',
    },
    callItem: {
      display: 'flex',
      alignItems: 'center',
      padding: '1rem',
      background: 'rgba(255, 255, 255, 0.05)',
      borderRadius: '0.75rem',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
    },
    callInfo: {
      flex: 1,
      marginLeft: '1rem',
    },
    phoneNumber: {
      color: 'white',
      fontSize: '0.875rem',
      fontWeight: '500',
    },
    timestamp: {
      color: '#93c5fd',
      fontSize: '0.75rem',
      marginTop: '0.25rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
    },
    status: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.25rem',
    },
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Recent Calls</h2>
      <div style={styles.list}>
        {calls.map((call) => (
          <div
            key={call.callId}
            style={{
              ...styles.callItem,
              background: selectedCallId === call.callId
                ? 'rgba(59, 130, 246, 0.2)'
                : 'rgba(255, 255, 255, 0.05)',
            }}
            onClick={() => onSelectCall(call)}
          >
            <Phone size={20} color="#60a5fa" />
            <div style={styles.callInfo}>
              <div style={styles.phoneNumber}>{call.customer.number}</div>
              <div style={styles.timestamp}>
                <Clock size={14} />
                {formatDistanceToNow(new Date(call.startTime))} ago
                <div style={styles.status}>
                  {call.status === 'completed' ? (
                    <CheckCircle size={14} color="#4ade80" />
                  ) : (
                    <XCircle size={14} color="#f87171" />
                  )}
                  {call.status}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}