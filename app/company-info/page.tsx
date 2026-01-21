import CompanyInfoList from "../../components/company-info/CompanyInfoList";
import api from "../../lib/axios";

async function getCompanyInfo() {
    try {
        const response = await api.get('/company-info?page=1&limit=100');
        // Handle response.data being the array, or response.data.data being the array
        if (Array.isArray(response.data)) {
            return response.data;
        }
        if (response.data && Array.isArray(response.data.data)) {
            return response.data.data;
        }
        return [];
    } catch (error) {
        console.error("Failed to fetch company info:", error);
        return [];
    }
}

export default async function CompanyInfoPage() {
    const companyData = await getCompanyInfo();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-800">Company Information</h1>
            </div>
            <CompanyInfoList initialData={companyData} />
        </div>
    );
}
