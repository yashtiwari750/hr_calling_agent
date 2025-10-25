import React from 'react';
import { Phone, Clock, User, MessageSquare, Volume2, PhoneOff } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function CallDetails({ call }) {
  if (!call) {
    return (
      <div style={styles.emptyState}>
        <Phone size={48} style={styles.emptyIcon} />
        <p style={styles.emptyText}>Select a call to view details</p>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'queued':
        return '#f59e0b';
      case 'ringing':
        return '#3b82f6';
      case 'in-progress':
        return '#10b981';
      case 'completed':
        return '#4ade80';
      case 'failed':
      case 'busy':
      case 'no-answer':
        return '#ef4444';
      default:
        return '#93c5fd';
    }
  };

  const styles = {
    container: {
      width: '100%',
      maxWidth: '600px',
      background: 'rgba(255, 255, 255, 0.1)',
      borderRadius: '1.5rem',
      padding: '2rem',
      marginTop: '2rem',
      backdropFilter: 'blur(40px)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '1.5rem',
      paddingBottom: '1rem',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    },
    title: {
      color: 'white',
      fontSize: '1.5rem',
      fontWeight: '600',
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
    },
    statusBadge: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.5rem 1rem',
      borderRadius: '9999px',
      fontSize: '0.875rem',
      fontWeight: '500',
      textTransform: 'capitalize',
    },
    section: {
      marginBottom: '1.5rem',
    },
    sectionTitle: {
      color: '#93c5fd',
      fontSize: '0.875rem',
      fontWeight: '600',
      marginBottom: '0.75rem',
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
    },
    infoGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '1rem',
    },
    infoItem: {
      background: 'rgba(255, 255, 255, 0.05)',
      borderRadius: '0.75rem',
      padding: '1rem',
    },
    infoLabel: {
      color: '#93c5fd',
      fontSize: '0.75rem',
      marginBottom: '0.5rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
    },
    infoValue: {
      color: 'white',
      fontSize: '1rem',
      fontWeight: '500',
    },
    transcript: {
      background: 'rgba(255, 255, 255, 0.05)',
      borderRadius: '0.75rem',
      padding: '1rem',
      maxHeight: '300px',
      overflowY: 'auto',
    },
    transcriptItem: {
      marginBottom: '1rem',
      paddingBottom: '1rem',
      borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
    },
    transcriptRole: {
      color: '#60a5fa',
      fontSize: '0.875rem',
      fontWeight: '600',
      marginBottom: '0.25rem',
    },
    transcriptText: {
      color: 'rgba(255, 255, 255, 0.9)',
      fontSize: '0.875rem',
      lineHeight: '1.5',
    },
    emptyState: {
      width: '100%',
      maxWidth: '600px',
      background: 'rgba(255, 255, 255, 0.1)',
      borderRadius: '1.5rem',
      padding: '4rem 2rem',
      marginTop: '2rem',
      backdropFilter: 'blur(40px)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      textAlign: 'center',
    },
    emptyIcon: {
      color: 'rgba(147, 197, 253, 0.3)',
      margin: '0 auto 1rem',
    },
    emptyText: {
      color: 'rgba(191, 219, 254, 0.6)',
      fontSize: '1rem',
    },
  };

  const statusColor = getStatusColor(call.status);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>
          <Phone size={24} color="#60a5fa" />
          Call Details
        </h2>
        <div
          style={{
            ...styles.statusBadge,
            background: `${statusColor}33`,
            color: statusColor,
            border: `1px solid ${statusColor}66`,
          }}
        >
          <div
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: statusColor,
              animation: call.status === 'in-progress' ? 'pulse 2s infinite' : 'none',
            }}
          />
          {call.status}
        </div>
      </div>

      <div style={styles.section}>
        <div style={styles.infoGrid}>
          <div style={styles.infoItem}>
            <div style={styles.infoLabel}>
              <User size={14} />
              Customer Number
            </div>
            <div style={styles.infoValue}>
              {call.customer?.number || 'N/A'}
            </div>
          </div>

          <div style={styles.infoItem}>
            <div style={styles.infoLabel}>
              <Clock size={14} />
              Duration
            </div>
            <div style={styles.infoValue}>
              {call.startedAt
                ? formatDistanceToNow(new Date(call.startedAt), { includeSeconds: true })
                : 'N/A'}
            </div>
          </div>

          {call.type && (
            <div style={styles.infoItem}>
              <div style={styles.infoLabel}>
                <Phone size={14} />
                Call Type
              </div>
              <div style={styles.infoValue}>
                {call.type}
              </div>
            </div>
          )}

          {call.endedReason && (
            <div style={styles.infoItem}>
              <div style={styles.infoLabel}>
                <PhoneOff size={14} />
                End Reason
              </div>
              <div style={styles.infoValue}>
                {call.endedReason}
              </div>
            </div>
          )}
        </div>
      </div>

      {call.transcript && call.transcript.length > 0 && (
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>
            <MessageSquare size={14} style={{ display: 'inline', marginRight: '0.5rem' }} />
            Transcript
          </h3>
          <div style={styles.transcript}>
            {call.transcript.map((item, index) => (
              <div key={index} style={styles.transcriptItem}>
                <div style={styles.transcriptRole}>
                  {item.role === 'assistant' ? 'AI Assistant' : 'Customer'}
                </div>
                <div style={styles.transcriptText}>{item.text}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {call.recordingUrl && (
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>
            <Volume2 size={14} style={{ display: 'inline', marginRight: '0.5rem' }} />
            Recording
          </h3>
          <audio controls style={{ width: '100%', marginTop: '0.5rem' }}>
            <source src={call.recordingUrl} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
