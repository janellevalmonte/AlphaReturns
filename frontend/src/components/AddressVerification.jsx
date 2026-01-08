import React from 'react';
import { AlertTriangle, CheckCircle, Info } from 'lucide-react';

export const AddressVerification = ({ verifying, recipientAcc, recipient }) => {
    if (!recipient) return null;

    const getStyles = () => {
        if (verifying) return { bg: '#e3f2fd', border: '#90caf9', color: '#333' };
        if (recipientAcc?.validated) return { bg: '#e8f5e9', border: '#4caf50', color: '#2e7d32' };
        if (recipientAcc?.exists) return { bg: '#fff3cd', border: '#ffc107', color: '#856404' };
        return { bg: '#fee', border: '#f44336', color: '#d32f2f' };
    };

    const styles = getStyles();

    return (
        <div style={{
            marginTop: '12px',
            padding: '10px 16px',
            borderRadius: '20px', // Pill shape looks better centered
            fontSize: '13px',
            display: 'inline-flex', // Fits the content width
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: styles.bg,
            border: `1px solid ${styles.border}`,
            color: styles.color,
            alignSelf: 'center' // Centers the badge even if parent is stretch
        }}>
            {verifying ? (
                <>
                    <Info size={16} style={{ marginRight: '8px' }} />
                    Verifying address...
                </>
            ) : recipientAcc?.validated ? (
                <>
                    <CheckCircle size={16} style={{ marginRight: '8px' }} />
                    <span>✓ Trusted contact: <strong>{recipientAcc.name || 'Verified'}</strong></span>
                </>
            ) : recipientAcc?.exists ? (
                <>
                    <AlertTriangle size={16} style={{ marginRight: '8px' }} />
                    <span>⚠️ Unverified address - double check!</span>
                </>
            ) : (
                <>
                    <AlertTriangle size={16} style={{ marginRight: '8px' }} />
                    <span>❌ Address may not exist on network</span>
                </>
            )}
        </div>
    );
};