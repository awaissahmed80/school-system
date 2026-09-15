import PortalLayout from '../../layouts/portal.layout';

function Dashboard() {
    return (
        <div className="space-y-4 p-6">
            <div className="text-foreground">Portal Landing Page</div>
        </div>
    );
}

Dashboard.layout = (page) => <PortalLayout children={page} />;

export default Dashboard;
