import AboutUsList from "../../components/about-us/AboutUsList";
import api from "../../lib/axios";
import { AboutUs } from "../../context/StoreContext";

async function getAllAboutUs(): Promise<AboutUs[]> {
    try {
        // API returns an array directly (not paginated)
        const response = await api.get('/about-us');

        // Response is an array of AboutUs items
        if (Array.isArray(response.data)) {
            return response.data;
        }

        // Fallback for unexpected structure
        console.warn("Unexpected About Us API response structure:", response.data);
        return [];
    } catch (error) {
        console.error("Failed to fetch about us:", error);
        return [];
    }
}

export default async function AboutUsPage() {
    const aboutUsItems = await getAllAboutUs();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-800">About Us</h1>
            </div>
            <AboutUsList initialData={aboutUsItems} />
        </div>
    );
}
