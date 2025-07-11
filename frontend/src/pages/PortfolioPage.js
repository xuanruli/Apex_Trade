import React, { useState, useEffect } from 'react';
import TradeSidebar from '../components/TradeSidebar';

const PortfolioPage = () => {
    const [portfolio, setPortfolio] = useState(null);
    const [loading, setLoading] = useState(true);
    const [tradeableAsset, setTradeableAsset] = useState(null);
    const [isSidebarVisible, setIsSidebarVisible] = useState(false);

    useEffect(() => {
        // Fetch portfolio data from your Flask API
        fetch('http://localhost:5000/api/portfolio_data') // Assuming you create this endpoint
            .then(res => res.json())
            .then(data => {
                setPortfolio(data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching portfolio data:", error);
                setLoading(false);
            });
    }, []);

    const handleTradeClick = (asset) => {
        setTradeableAsset({
            symbol: asset.symbol,
            currentPrice: asset.current_price,
            currentShares: asset.shares
        });
        setIsSidebarVisible(true);
    };

    if (loading) {
        return <div>Loading portfolio...</div>;
    }

    if (!portfolio || portfolio.holdings.length === 0) {
        return <div>Your portfolio is empty.</div>;
    }

    return (
        <div className="portfolio-container">
            <h1>My Portfolio</h1>
            <div className="holdings-table">
                <table>
                    <thead>
                        <tr>
                            <th>Symbol</th>
                            <th>Shares</th>
                            <th>Avg. Cost</th>
                            <th>Current Price</th>
                            <th>Market Value</th>
                            <th>Gain/Loss</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {portfolio.holdings.map(asset => (
                            <tr key={asset.symbol}>
                                <td>{asset.symbol}</td>
                                <td>{asset.shares}</td>
                                <td>${asset.avg_cost.toFixed(2)}</td>
                                <td>${asset.current_price.toFixed(2)}</td>
                                <td>${asset.market_value.toFixed(2)}</td>
                                <td className={asset.gain_loss >= 0 ? 'text-success' : 'text-danger'}>
                                    ${asset.gain_loss.toFixed(2)}
                                </td>
                                <td>
                                    <button className="btn-trade" onClick={() => handleTradeClick(asset)}>
                                        Trade
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <TradeSidebar 
                tradeable={tradeableAsset} 
                isVisible={isSidebarVisible} 
                onClose={() => setIsSidebarVisible(false)} 
            />
        </div>
    );
};

export default PortfolioPage; 