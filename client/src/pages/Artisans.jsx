
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UserRound, ArrowRight } from "lucide-react";
import { getArtisans } from "../services/artisanService";


function Artisans() {
    const [artisans, setArtisans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchArtisans = async () => {
            try {
                const data = await getArtisans();
                setArtisans(data.artisans || []);
            } catch (err) {
                setError("Failed to load artisans.");
            } finally {
                setLoading(false);
            }
        };

        fetchArtisans();
    }, []);

    if (loading) {
        return <div className="artisans-message">Loading artisans...</div>;
    }

    if (error) {
        return <div className="artisans-message error">{error}</div>;
    }

    return (
        <div className="artisans-page">
            <div className="artisans-header">
                <h1>Meet Our Artisans</h1>
                <p>
                    Discover talented creators and explore their handmade
                    creations.
                </p>
            </div>

            {artisans.length === 0 ? (
                <div className="artisans-message">
                    No artisans found.
                </div>
            ) : (
                <div className="artisans-grid">
                    {artisans.map((artisan) => (
                        <div className="artisan-card" key={artisan._id}>
                            <div className="artisan-icon">
                                <UserRound size={42} />
                            </div>

                            <h2>{artisan.name}</h2>

                            <p>
                                Handmade creator on Craftivo
                            </p>

                            <Link
                                to={`/products?artisan=${artisan._id}`}
                                className="view-artisan-products"
                            >
                                View Products
                                <ArrowRight size={17} />
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Artisans;

