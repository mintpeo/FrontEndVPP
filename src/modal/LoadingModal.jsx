import React from 'react';
import './loadingModal.css';

const LoadingModal = ({ isLoading }) => {
    if (!isLoading) return null;

    return (
        <div className="loading-overlay">
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Đang xử lý, vui lòng đợi...</p>
            </div>
        </div>
    );
};

export default LoadingModal;