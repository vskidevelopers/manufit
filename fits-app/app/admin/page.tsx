export default function AdminDashboard() {
    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Dashboard Overview</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Stat Card 1 */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="text-gray-500 text-sm font-medium">Total Orders</h3>
                    <p className="text-3xl font-bold text-gray-900 mt-2">0</p>
                </div>

                {/* Stat Card 2 */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="text-gray-500 text-sm font-medium">Pending Orders</h3>
                    <p className="text-3xl font-bold text-orange-600 mt-2">0</p>
                </div>

                {/* Stat Card 3 */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="text-gray-500 text-sm font-medium">Revenue (Today)</h3>
                    <p className="text-3xl font-bold text-green-600 mt-2">KSh 0</p>
                </div>
            </div>

            <div className="mt-8 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Welcome to ManuFit Admin</h3>
                <p className="text-gray-600">
                    Start by adding products in the <strong>Products</strong> tab or managing orders in the <strong>Orders</strong> tab.
                </p>
            </div>
        </div>
    );
}