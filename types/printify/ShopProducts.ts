export interface ListMerchantShopProductsQuery {
    current_page: number;
    data: Product[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: Link[];
    next_page_url: string;
    path: string;
    per_page: number;
    prev_page_url: any;
    to: number;
    total: number;
}

export interface Product {
    id: string;
    title: string;
    description: string;
    tags: string[];
    options: Option[];
    variants: Variant[];
    images: Image[];
    created_at: string;
    updated_at: string;
    visible: boolean;
    is_locked: boolean;
    external: External;
    blueprint_id: number;
    user_id: number;
    shop_id: number;
    print_provider_id: number;
    print_areas: PrintArea[];
    print_details: any[];
    sales_channel_properties: any[];
    is_printify_express_eligible: boolean;
    is_printify_express_enabled: boolean;
}

export interface Option {
    name: string;
    type: string;
    values: OptionValue[];
}

export interface OptionValue {
    id: number;
    title: string;
    colors?: string[];
}

export interface Variant {
    id: number;
    sku: string;
    cost: number;
    price: number;
    title: string;
    grams: number;
    is_enabled: boolean;
    is_default: boolean;
    is_available: boolean;
    is_printify_express_eligible: boolean;
    options: number[];
    quantity: number;
}

export interface Image {
    src: string;
    variant_ids: number[];
    position: string;
    is_default: boolean;
    is_selected_for_publishing: boolean;
}

export interface External {
    id: string;
    handle: string;
}

export interface PrintArea {
    variant_ids: number[];
    placeholders: Placeholder[];
    font_color: string;
    font_family: string;
}

export interface Placeholder {
    position: string;
    images: MockupAsset[];
}

export interface MockupAsset {
    id: string;
    name: string;
    type: string;
    height: number;
    width: number;
    x: number;
    y: number;
    scale: number;
    angle: number;
}

export interface Link {
    url?: string;
    label: string;
    active: boolean;
}
