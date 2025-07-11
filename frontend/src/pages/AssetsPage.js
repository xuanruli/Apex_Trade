import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

const AssetsPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [symbol, setSymbol] = useState(searchParams.get('symbol') || 'AAPL');
    const [assetData, setAssetData] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSearchParams({ symbol: symbol });
        const response = await fetch(`http://localhost:5000/api/asset?symbol=${symbol}`);
        const data = await response.json();
        if (data.success) {
            setAssetData(data.data);
        } else {
            setAssetData(null);
        }
        setLoading(false);
    };

    return (
        <div className="container mt-4">
            <h1>Asset Details</h1>
            <form onSubmit={handleSearch} className="mb-4">
                <div className="input-group">
                    <input 
                        type="text" 
                        value={symbol} 
                        onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                        className="form-control"
                        placeholder="Enter stock symbol (e.g., AAPL)"
                    />
                    <button type="submit" className="btn btn-primary">Search</button>
                </div>
            </form>

            {loading && <div>Loading asset data...</div>}

            {assetData && (
                <div>
                    <h2>{assetData.stock.shortName} ({assetData.stock.symbol})</h2>
                    <p>Current Price: ${assetData.stock.regularMarketPrice}</p>
                    {/* Charts and other data would be rendered here */}
                    <h3>Related News</h3>
                    <ul>
                        {assetData.news.titles.map((title, index) => (
                            <li key={index}><a href={assetData.news.urls[index]} target="_blank" rel="noopener noreferrer">{title}</a></li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default AssetsPage; 