export interface TargetProduct {
    title: string;
    brand: string;
    price: number | null;
    priceFormatted: string;
    unitPrice: string;
    unitPriceSuffix: string;
    bulletDescriptions: string[];
    softBullets: string[];
    provider: string;
}

export declare function getTargetProducts(
    keyword: string,
    zipCode: string | number,
    sortBy?: string
): Promise<TargetProduct[]>;
