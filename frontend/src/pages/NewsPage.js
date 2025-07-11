import React, { useState, useEffect } from 'react';

const NewsPage = () => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNews = async () => {
            const response = await fetch('http://localhost:5000/api/news');
            const data = await response.json();
            if (data.success) {
                setArticles(data.data.articles);
            }
            setLoading(false);
        };
        fetchNews();
    }, []);

    if (loading) return <div>Loading news...</div>;

    return (
        <div className="container mt-4">
            <h1>Latest Financial News</h1>
            <div className="row">
                {articles.map((article, index) => (
                    <div className="col-md-4 mb-4" key={index}>
                        <div className="card">
                            <img src={article.urlToImage || 'default-news.jpg'} className="card-img-top" alt={article.title} />
                            <div className="card-body">
                                <h5 className="card-title">{article.title}</h5>
                                <p className="card-text">{article.description}</p>
                                <a href={article.url} target="_blank" rel="noopener noreferrer" className="btn btn-primary">Read More</a>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default NewsPage; 