import React from 'react';

export const TransactionStatus = ({ status, txHash }) => {
    if (!status && !txHash) return null;

    const isError = status?.includes('❌');
    const isSuccess = status?.includes('✅') || status?.includes('🎉');

    return (
        <div style={{ marginTop: '25px', textAlign: 'center' }}>
            {status && (
                <div style={{
                    padding: '15px',
                    backgroundColor: isError ? '#fee' : isSuccess ? '#efe' : '#fef9e7',
                    borderRadius: '10px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                }}>
                    <strong>Status:</strong> {status}

                    {status.includes('Click here to sign') && (
                        <div style={{ marginTop: '10px' }}>
                            <a
                                href={status.split('Click here to sign: ')[1]}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    display: 'inline-block',
                                    padding: '10px 20px',
                                    backgroundColor: '#007bff',
                                    color: 'white',
                                    textDecoration: 'none',
                                    borderRadius: '6px',
                                    fontWeight: '600'
                                }}
                            >
                                🔗 Open Xumm to Sign
                            </a>
                        </div>
                    )}
                </div>
            )}

            {txHash && (
                <div style={{
                    marginTop: '15px',
                    padding: '15px',
                    backgroundColor: '#e3f2fd',
                    border: '2px solid #90caf9',
                    borderRadius: '8px',
                    fontSize: '13px',
                    wordBreak: 'break-all'
                }}>
                    <strong>Transaction Hash:</strong><br />
                    <code style={{ color: '#1565c0' }}>{txHash}</code>
                    <br /><br />
                    <a href={`https://testnet.xrpl.org/transactions/${txHash}`} target="_blank" rel="noopener noreferrer">
                        View on Explorer →
                    </a>
                </div>
            )}
        </div>
    );
};