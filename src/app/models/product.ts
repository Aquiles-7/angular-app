export interface Product {
    id: number;
    title: string;
    price: number;
    description: string;
    images: string[];
    category: {
        id: number;
        name: string;
        slug: string;
        image: string;
        creationAt: string;
        updatedAt: string;
    };
    creationAt: string;
    updatedAt: string;
}

// Alias para compatibilidad con código existente
export interface ProductCompat extends Product {
    name?: string;
    image?: string;
    stock?: number;
}
