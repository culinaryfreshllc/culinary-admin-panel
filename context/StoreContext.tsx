"use client";

import React, { createContext, useContext, useState, ReactNode, useCallback } from "react";
import { DUMMY_ABOUT_US, DUMMY_CONTACT_US } from "../lib/mock-data";

export type ProductStatus = "In Stock" | "Out of Stock";

export interface Product {
    id: string;
    name: string;
    sku: string;
    price: number;
    stock: number;
    views: number;
    status: ProductStatus;
    featured: boolean;
    category: string;
    categoryId?: string[]; // Array of category IDs for multi-select
    imageUrl?: string;
    rating?: number;
    reviews?: number;
    tag?: string;
    description?: string;
    weight?: string;
}

export interface Tag {
    id: string;
    name: string;
    slug: string;
}

export interface Category {
    id: string;
    name: string;
    description?: string;
    image_url?: string;
    created_at?: string;
    updated_at?: string;
}

export interface AboutUs {
    id: string;
    title: string;
    content: string;
    image_url?: string;
    created_at?: string;
    updated_at?: string;
}

export interface ContactUs {
    id: string;
    name: string;
    email: string;
    phone?: string;
    subject?: string;
    message: string;
    created_at?: string; // Mapped from createdAt
    createdAt?: string; // Direct from API
    status?: "pending" | "responded" | "archived"; // Not in API example but used in UI
}

interface StoreContextType {
    products: Product[];
    categories: Category[];
    aboutUs: AboutUs[];
    contactUs: ContactUs[];
    setProducts: (products: Product[]) => void;
    setCategories: (categories: Category[]) => void;
    setContactUs: (contactUs: ContactUs[]) => void;
    addProduct: (product: Omit<Product, "id" | "views">) => void;
    updateProduct: (id: string, product: Partial<Product>) => void;
    deleteProduct: (id: string) => void;
    toggleFeatured: (id: string) => void;
    addCategory: (category: Omit<Category, "id" | "created_at" | "updated_at">) => void;
    updateCategory: (id: string, category: Partial<Category>) => void;
    deleteCategory: (id: string) => void;
    addAboutUs: (aboutUs: Omit<AboutUs, "id" | "created_at" | "updated_at">) => void;
    updateAboutUs: (id: string, aboutUs: Partial<AboutUs>) => void;
    deleteAboutUs: (id: string) => void;
    addContactUs: (contactUs: Omit<ContactUs, "id" | "created_at">) => void;
    updateContactUs: (id: string, contactUs: Partial<ContactUs>) => void;
    deleteContactUs: (id: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const DUMMY_PRODUCTS: Product[] = [
    { id: "1", name: "Gabriela Cashmere Blazer", sku: "T14116", price: 113.99, stock: 1113, views: 14012, status: "In Stock", featured: false, category: "Jackets" },
    { id: "2", name: "Loewe blend Jacket - Blue", sku: "T14116", price: 113.99, stock: 721, views: 13212, status: "In Stock", featured: true, category: "Jackets" },
    { id: "3", name: "Sandro - Jacket - Black", sku: "T14116", price: 113.99, stock: 407, views: 8201, status: "In Stock", featured: false, category: "Jackets" },
    { id: "4", name: "Adidas By Stella McCartney", sku: "T14116", price: 113.99, stock: 1203, views: 1002, status: "In Stock", featured: false, category: "Jackets" },
    { id: "5", name: "Meteo Hooded Wool Jacket", sku: "T14116", price: 113.99, stock: 306, views: 807, status: "In Stock", featured: true, category: "Jackets" },
    { id: "6", name: "Hida Down Ski Jacket - Red", sku: "T14116", price: 113.99, stock: 201, views: 406, status: "In Stock", featured: false, category: "Jackets" },
    { id: "7", name: "Dolce & Gabbana", sku: "T14116", price: 113.99, stock: 108, views: 204, status: "In Stock", featured: false, category: "Jackets" },
];

const DUMMY_CATEGORIES: Category[] = [
    { id: "1", name: "Fresh Vegetables", description: "Farm-fresh organic vegetables", image_url: "", created_at: new Date().toISOString() },
    { id: "2", name: "Fruits", description: "Seasonal fresh fruits", image_url: "", created_at: new Date().toISOString() },
    { id: "3", name: "Dairy Products", description: "Fresh dairy and milk products", image_url: "", created_at: new Date().toISOString() },
];

export function StoreProvider({ children }: { children: ReactNode }) {
    const [products, setProductsState] = useState<Product[]>(DUMMY_PRODUCTS);
    const [categories, setCategoriesState] = useState<Category[]>(DUMMY_CATEGORIES);
    const [aboutUs, setAboutUs] = useState<AboutUs[]>(DUMMY_ABOUT_US);
    const [contactUs, setContactUs] = useState<ContactUs[]>(DUMMY_CONTACT_US as ContactUs[]);

    const setProducts = useCallback((newProducts: Product[]) => {
        setProductsState(newProducts);
    }, []);

    const setCategories = useCallback((newCategories: Category[]) => {
        setCategoriesState(newCategories);
    }, []);

    const setContactUsWrapped = useCallback((newContactUs: ContactUs[]) => {
        setContactUs(newContactUs);
    }, []);

    const addProduct = (product: Omit<Product, "id" | "views">) => {
        const newProduct: Product = {
            ...product,
            id: Math.random().toString(36).substr(2, 9),
            views: 0,
        };
        setProductsState((prev) => [newProduct, ...prev]);
    };

    const updateProduct = (id: string, updates: Partial<Product>) => {
        setProductsState((prev) =>
            prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
        );
    };

    const deleteProduct = (id: string) => {
        setProductsState((prev) => prev.filter((p) => p.id !== id));
    };

    const toggleFeatured = (id: string) => {
        setProductsState((prev) =>
            prev.map((p) => (p.id === id ? { ...p, featured: !p.featured } : p))
        );
    };



    // Category CRUD operations
    const addCategory = (category: Omit<Category, "id" | "created_at" | "updated_at">) => {
        const newCategory: Category = {
            ...category,
            id: Math.random().toString(36).substr(2, 9),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        };
        setCategoriesState((prev) => [newCategory, ...prev]);
    };

    const updateCategory = (id: string, updates: Partial<Category>) => {
        setCategoriesState((prev) =>
            prev.map((c) => (c.id === id ? { ...c, ...updates, updated_at: new Date().toISOString() } : c))
        );
    };

    const deleteCategory = (id: string) => {
        setCategoriesState((prev) => prev.filter((c) => c.id !== id));
    };

    // About Us CRUD operations
    const addAboutUs = (aboutUs: Omit<AboutUs, "id" | "created_at" | "updated_at">) => {
        const newAboutUs: AboutUs = {
            ...aboutUs,
            id: Math.random().toString(36).substr(2, 9),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        };
        setAboutUs((prev) => [newAboutUs, ...prev]);
    };

    const updateAboutUs = (id: string, updates: Partial<AboutUs>) => {
        setAboutUs((prev) =>
            prev.map((a) => (a.id === id ? { ...a, ...updates, updated_at: new Date().toISOString() } : a))
        );
    };

    const deleteAboutUs = (id: string) => {
        setAboutUs((prev) => prev.filter((a) => a.id !== id));
    };

    // Contact Us CRUD operations
    const addContactUs = (contactUs: Omit<ContactUs, "id" | "created_at">) => {
        const newContactUs: ContactUs = {
            ...contactUs,
            id: Math.random().toString(36).substr(2, 9),
            created_at: new Date().toISOString(),
        };
        setContactUs((prev) => [newContactUs, ...prev]);
    };

    const updateContactUs = (id: string, updates: Partial<ContactUs>) => {
        setContactUs((prev) =>
            prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
        );
    };

    const deleteContactUs = (id: string) => {
        setContactUs((prev) => prev.filter((c) => c.id !== id));
    };


    return (
        <StoreContext.Provider
            value={{
                products,
                categories,
                aboutUs,
                contactUs,
                setProducts,
                setCategories,
                setContactUs: setContactUsWrapped,
                addProduct,
                updateProduct,
                deleteProduct,
                toggleFeatured,
                addCategory,
                updateCategory,
                deleteCategory,
                addAboutUs,
                updateAboutUs,
                deleteAboutUs,
                addContactUs,
                updateContactUs,
                deleteContactUs,
            }}
        >
            {children}
        </StoreContext.Provider>
    );
}

export function useStore() {
    const context = useContext(StoreContext);
    if (context === undefined) {
        throw new Error("useStore must be used within a StoreProvider");
    }
    return context;
}

