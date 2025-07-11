import React from 'react';

const HomePage = () => {
    return (
        <>
            {/* Title */}
            <section id="title" className="gradient-background">
                <div className="container col-xxl-8 px-4 pt-3">
                    {/* Flash messages can be handled here with a state management solution */}
                    <div className="row flex-lg-row-reverse align-items-center g-5 pt-5">
                        <div className="col-10 col-sm-8 col-lg-6">
                            <img src="/phone.png" className="d-block mx-lg-auto img-fluid ml-10" alt="Bootstrap Themes" height="200" loading="lazy" />
                        </div>
                        <div className="col-lg-6">
                            <h1 className="display-5 fw-bold text-body-emphasis lh-1 mb-3">Build and simulate stock based on your need</h1>
                            <div className="d-grid gap-2 d-md-flex justify-content-md-start">
                                <button type="button" className="btn btn-light btn-lg px-4 me-md-2">
                                    <i className="bi bi-apple mb-1"></i> Download
                                </button>
                                <button type="button" className="btn btn-outline-light btn-lg px-4">
                                    <i className="bi bi-google-play mb-1"></i> Download
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section id="features">
                <div className="container my-5 py-5">
                    <div className="row g-4 py-5 row-cols-1 row-cols-lg-3">
                        <div className="col d-flex align-items-start">
                             {/* ... feature 1 ... */}
                        </div>
                        <div className="col d-flex align-items-start">
                           {/* ... feature 2 ... */}
                        </div>
                        <div className="col d-flex align-items-start">
                           {/* ... feature 3 ... */}
                        </div>
                    </div>
                </div>
            </section>

            <section className="info-section">
                <h2>Welcome to Our Platform</h2>
                <p>Your go-to platform for market insights, asset tracking, and strategic investments.</p>
                <p>
                    Our platform offers full control over all aspects of portfolio management, from hedging to rebalancing,
                    ensuring a streamlined and efficient trading experience.
                </p>
            </section>
        </>
    );
};

export default HomePage; 