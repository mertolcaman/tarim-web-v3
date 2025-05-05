const Loader = () => (
    <div className="d-flex flex-column justify-content-center align-items-center vh-100">
        <h2 className="mb-4">IoT Dashboard</h2>
        <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Loading...</span>
        </div>
    </div>
);

export default Loader;
