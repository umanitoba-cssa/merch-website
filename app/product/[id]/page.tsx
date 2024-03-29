import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import ProductInfo from "@/components/view/ProductInfo";
import { Product } from "@/types/printify/ShopProducts";

async function getProduct(id: string): Promise<{ product: Product; price: number }> {
    const res = await fetch(
        `https://api.printify.com/v1/shops/${process.env.PRINTIFY_SHOP_ID}/products/${id}.json`,
        {
            headers: {
                Authorization: `Bearer ${process.env.PRINTIFY_API_KEY}`,
                Accept: "application/json",
                "Accept-Encoding": "gzip",
                Connection: "keep-alive",
                "User-Agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3",
            },
            next: {
                revalidate: 60,
            },
        }
    );

    try {
        const product: Product = await res.json();
        
        product.variants = product.variants.filter((variant) => variant.is_enabled);
        const colorOpts = product.options.find((option) => option.type === "color");
        if (colorOpts) {
            colorOpts.values = colorOpts.values.filter((value) =>
                product.variants.some((variant) => variant.options.includes(value.id))
            );
        }

        const price: number = product.variants.reduce(
            (acc, variant) => (variant.price > acc ? variant.price : acc),
            0
        );

        product.description = product.description.replaceAll(/color: #[0-9a-fA-F]{6};/gm, "")

        return { product, price };
    } catch (e) {
        console.error(e);
        return {} as { product: Product; price: number };
    }
}

export default async function Product({ params }: { params: { id: string } }) {
    const { product, price } = await getProduct(params.id);

    

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24 pt-0">
            <ProductInfo product={product} price={price} />
        </main>
    );
}
