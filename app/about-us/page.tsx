import AboutUsList from "../../components/about-us/AboutUsList";

export default function AboutUsPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-800">About Us</h1>
            </div>
            <AboutUsList />
        </div>
    );
}
