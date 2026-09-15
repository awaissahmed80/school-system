
import PortalLayout from "../../layouts/portal.layout";
// import { Layout } from "../components/layout";
import { Button } from "../../components/ui/button"

function Dashboard() {
    return(        
        <div>
            <div>Portal Landing Page</div>        
            <Button>Hello</Button>
        </div>
    )
}


Dashboard.layout = (page) => <PortalLayout children={page} />;

export default Dashboard