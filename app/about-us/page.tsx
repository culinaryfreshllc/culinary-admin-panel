import AboutUsList from "../../components/about-us/AboutUsList";
import api from "../../lib/axios";

async function getAboutUs() {
    try {
        const response = await api.get('/about-us?page=1&limit=10');
        // API returns an array with single item, get the first one
        return response.data.data[0] || null;
    } catch (error) {
        console.error("Failed to fetch about us:", error);
        return null;
    }
}

export default async function AboutUsPage() {
    const aboutUsData = await getAboutUs();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-800">About Us</h1>
            </div>
            <AboutUsList initialData={aboutUsData} />
        </div>
    );
}
