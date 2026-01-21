import AboutUsList from "../../components/about-us/AboutUsList";
import api from "../../lib/axios";

async function getAboutUs() {
    try {
        const response = await api.get('/about-us?page=1&limit=10');
        console.log("About Us response data:", JSON.stringify(response.data, null, 2));

        if (Array.isArray(response.data)) {
            return response.data[0] || null;
        }

        if (response.data && Array.isArray(response.data.data)) {
            return response.data.data[0] || null;
        }

        // Fallback or unexpected structure
        return null;
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
