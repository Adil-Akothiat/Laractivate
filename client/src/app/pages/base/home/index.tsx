import { Link } from "react-router-dom";

export default function Home() {
    return (
        <div>
            <Link to="/pricing" className="link">Pricing</Link>
        </div>
    )
}