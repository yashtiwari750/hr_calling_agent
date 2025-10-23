import React, { useState, useEffect, useRef } from 'react';
import { Phone, Sparkles, Zap, CheckCircle, AlertCircle } from 'lucide-react';

export default function VapiVoiceCaller() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const canvasRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2 + 1,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5
      });
    }

    let animationFrame;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      ctx.fillStyle = 'rgba(59, 130, 246, 0.1)';
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      particles.forEach((p1, i) => {
        particles.slice(i + 1).forEach(p2 => {
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < 150) {
            ctx.strokeStyle = `rgba(59, 130, 246, ${0.2 * (1 - dist / 150)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        });
      });

      animationFrame = requestAnimationFrame(animate);
    };
    animate();

    return () => cancelAnimationFrame(animationFrame);
  }, []);

  const formatPhoneNumber = (value) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.startsWith('91')) {
      return '+' + cleaned;
    } else if (cleaned.startsWith('1')) {
      return '+' + cleaned;
    } else if (cleaned.length > 0) {
      return '+91' + cleaned;
    }
    return '';
  };

  const validatePhoneNumber = (number) => {
    const cleaned = number.replace(/\D/g, '');
    return cleaned.length >= 10 && cleaned.length <= 15;
  };

  const handleCall = async () => {
    if (!phoneNumber || !validatePhoneNumber(phoneNumber)) {
      setStatus({
        type: 'error',
        message: 'Please enter a valid phone number'
      });
      return;
    }

    setIsLoading(true);
    setStatus(null);

    try {
      const formattedNumber = formatPhoneNumber(phoneNumber);
      
      const response = await fetch('https://api.vapi.ai/call', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer 8e8cc903-f589-4c78-ac5d-069f89b16d88',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          assistantId: '6e4e2467-1b7a-4b33-b6a0-279b20625da3',
          phoneNumberId: '80dae03b-4cc5-46d3-a711-44d97585bfdb',
          customer: {
            number: formattedNumber
          }
        })
      });

      const data = await response.json();

      if (response.ok) {
        setStatus({
          type: 'success',
          message: 'Call initiated successfully! You should receive a call shortly.'
        });
        setPhoneNumber('');
      } else {
        setStatus({
          type: 'error',
          message: data.message || 'Failed to initiate call. Please try again.'
        });
      }
    } catch (error) {
      setStatus({
        type: 'error',
        message: 'Network error. Please check your connection and try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleCall();
    }
  };

  const styles = {
    container: {
      position: 'relative',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #0f172a 100%)',
      overflow: 'hidden',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    },
    canvas: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: 0
    },
    gradientOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'linear-gradient(to top, rgba(59, 130, 246, 0.1), transparent, rgba(168, 85, 247, 0.1))',
      zIndex: 0
    },
    mouseGradient: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      opacity: 0.3,
      zIndex: 0,
      background: `radial-gradient(circle at ${50 + mousePosition.x * 20}% ${50 + mousePosition.y * 20}%, rgba(59, 130, 246, 0.3), transparent 50%)`
    },
    content: {
      position: 'relative',
      zIndex: 10,
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem'
    },
    mainCard: {
      maxWidth: '42rem',
      width: '100%'
    },
    header: {
      textAlign: 'center',
      marginBottom: '3rem',
      animation: 'fadeIn 0.6s ease-out'
    },
    iconWrapper: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: '1.5rem'
    },
    iconContainer: {
      position: 'relative'
    },
    iconBlur: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: '#3b82f6',
      filter: 'blur(3rem)',
      opacity: 0.5,
      animation: 'pulse 2s infinite'
    },
    icon: {
      position: 'relative',
      color: '#60a5fa',
      animation: 'bounce 1s infinite'
    },
    title: {
      fontSize: '3.75rem',
      fontWeight: 'bold',
      color: 'white',
      marginBottom: '1rem',
      letterSpacing: '-0.025em'
    },
    subtitle: {
      fontSize: '1.25rem',
      color: '#bfdbfe',
      marginBottom: '0.5rem'
    },
    features: {
      fontSize: '0.875rem',
      color: 'rgba(147, 197, 253, 0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem'
    },
    card: {
      backdropFilter: 'blur(40px)',
      background: 'rgba(255, 255, 255, 0.1)',
      borderRadius: '1.5rem',
      padding: '2rem',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      transition: 'transform 0.3s ease'
    },
    formGroup: {
      marginBottom: '1.5rem'
    },
    label: {
      display: 'block',
      color: 'white',
      fontSize: '0.875rem',
      fontWeight: '600',
      marginBottom: '0.75rem'
    },
    inputWrapper: {
      position: 'relative'
    },
    inputIcon: {
      position: 'absolute',
      left: '1rem',
      top: '50%',
      transform: 'translateY(-50%)',
      color: '#93c5fd',
      width: '1.25rem',
      height: '1.25rem'
    },
    input: {
      width: '100%',
      paddingLeft: '3rem',
      paddingRight: '1rem',
      paddingTop: '1rem',
      paddingBottom: '1rem',
      background: 'rgba(255, 255, 255, 0.1)',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      borderRadius: '0.75rem',
      color: 'white',
      fontSize: '1.125rem',
      outline: 'none',
      transition: 'all 0.3s ease',
      boxSizing: 'border-box'
    },
    inputHint: {
      fontSize: '0.75rem',
      color: 'rgba(191, 219, 254, 0.6)',
      marginTop: '0.5rem',
      marginLeft: '0.25rem'
    },
    button: {
      width: '100%',
      background: 'linear-gradient(to right, #3b82f6, #9333ea)',
      color: 'white',
      fontWeight: 'bold',
      padding: '1rem 1.5rem',
      borderRadius: '0.75rem',
      transition: 'all 0.3s ease',
      border: 'none',
      cursor: 'pointer',
      fontSize: '1.125rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.75rem',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
    },
    buttonDisabled: {
      opacity: 0.5,
      cursor: 'not-allowed'
    },
    spinner: {
      width: '1.25rem',
      height: '1.25rem',
      border: '2px solid white',
      borderTopColor: 'transparent',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    },
    alert: {
      marginTop: '1.5rem',
      padding: '1rem',
      borderRadius: '0.75rem',
      display: 'flex',
      alignItems: 'flex-start',
      gap: '0.75rem',
      animation: 'fadeIn 0.3s ease-out'
    },
    alertSuccess: {
      background: 'rgba(34, 197, 94, 0.2)',
      border: '1px solid rgba(34, 197, 94, 0.5)'
    },
    alertError: {
      background: 'rgba(239, 68, 68, 0.2)',
      border: '1px solid rgba(239, 68, 68, 0.5)'
    },
    alertIcon: {
      width: '1.25rem',
      height: '1.25rem',
      flexShrink: 0,
      marginTop: '0.125rem'
    },
    alertText: {
      fontSize: '0.875rem'
    },
    featureGrid: {
      marginTop: '2rem',
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '1rem',
      textAlign: 'center'
    },
    featureCard: {
      backdropFilter: 'blur(8px)',
      background: 'rgba(255, 255, 255, 0.05)',
      borderRadius: '0.75rem',
      padding: '1rem',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      transition: 'background 0.3s ease'
    },
    featureIcon: {
      width: '1.5rem',
      height: '1.5rem',
      color: '#60a5fa',
      margin: '0 auto 0.5rem'
    },
    featureTitle: {
      color: 'white',
      fontWeight: '600',
      fontSize: '0.875rem',
      marginBottom: '0.25rem'
    },
    featureSub: {
      color: 'rgba(191, 219, 254, 0.6)',
      fontSize: '0.75rem'
    },
    footer: {
      position: 'absolute',
      bottom: '1rem',
      left: 0,
      right: 0,
      textAlign: 'center',
      color: 'rgba(191, 219, 254, 0.4)',
      fontSize: '0.75rem',
      zIndex: 10
    }
  };

  return (
    <div style={styles.container}>
      <canvas ref={canvasRef} style={styles.canvas} />
      <div style={styles.gradientOverlay} />
      <div style={styles.mouseGradient} />

      <div style={styles.content}>
        <div style={styles.mainCard}>
          <div style={styles.header}>
            <div style={styles.iconWrapper}>
              <div style={styles.iconContainer}>
                <div style={styles.iconBlur} />
                <Sparkles size={64} style={styles.icon} />
              </div>
            </div>
            
            <h1 style={styles.title}>HR Calling Assistant</h1>
            <p style={styles.subtitle}>Powered by Ruvanta Technology</p>
            <p style={styles.features}>
              <Zap size={16} />
              Instant connection • Natural conversation • 24/7 Available
            </p>
          </div>

          <div 
            style={styles.card}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <div style={styles.formGroup}>
              <label style={styles.label}>Enter Phone Number</label>
              <div style={styles.inputWrapper}>
                <Phone style={styles.inputIcon} />
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="+91 9876543210"
                  style={styles.input}
                  onFocus={(e) => {
                    e.target.style.boxShadow = '0 0 0 2px #3b82f6';
                    e.target.style.borderColor = 'transparent';
                  }}
                  onBlur={(e) => {
                    e.target.style.boxShadow = 'none';
                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                  }}
                />
              </div>
              <p style={styles.inputHint}>
                Include country code (e.g., +91 for India, +1 for US)
              </p>
            </div>

            <button
              onClick={handleCall}
              disabled={isLoading}
              style={{
                ...styles.button,
                ...(isLoading ? styles.buttonDisabled : {})
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(59, 130, 246, 0.5)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
              }}
            >
              {isLoading ? (
                <>
                  <div style={styles.spinner} />
                  Initiating Call...
                </>
              ) : (
                <>
                  <Phone size={20} />
                  Start Voice Call
                </>
              )}
            </button>

            {status && (
              <div style={{
                ...styles.alert,
                ...(status.type === 'success' ? styles.alertSuccess : styles.alertError)
              }}>
                {status.type === 'success' ? (
                  <CheckCircle style={{...styles.alertIcon, color: '#4ade80'}} />
                ) : (
                  <AlertCircle style={{...styles.alertIcon, color: '#f87171'}} />
                )}
                <p style={{
                  ...styles.alertText,
                  color: status.type === 'success' ? '#d1fae5' : '#fecaca'
                }}>
                  {status.message}
                </p>
              </div>
            )}
          </div>

          <div style={styles.featureGrid}>
            {[
              { Icon: Zap, text: 'Instant', sub: 'Connect' },
              { Icon: Phone, text: 'HD Voice', sub: 'Quality' },
              { Icon: Sparkles, text: 'AI Powered', sub: 'Smart' }
            ].map((item, i) => (
              <div 
                key={i} 
                style={styles.featureCard}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'}
              >
                <item.Icon style={styles.featureIcon} />
                <p style={styles.featureTitle}>{item.text}</p>
                <p style={styles.featureSub}>{item.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={styles.footer}>
        Powered by Yash Tiwari
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 0.8; }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        input::placeholder {
          color: rgba(191, 219, 254, 0.5);
        }
      `}</style>
    </div>
  );
}