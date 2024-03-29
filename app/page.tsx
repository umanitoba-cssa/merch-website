import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { ListMerchantShopProductsQuery, Product } from "@/types/printify/ShopProducts";
import Link from "next/link";

type ProductPreview = {
    id: string;
    name: string;
    price: number;
    image: string;
};

async function getProducts() {
    function getProductOrderByTags(product: Product): number {
        const order = ["Hoodies", "T-shirts"];
        const tags = product.tags;
        const index = order.findIndex((tag) => tags.includes(tag));
        return index === -1 ? order.length : index;
    }

    const res = await fetch(`https://api.printify.com/v1/shops/${process.env.PRINTIFY_SHOP_ID}/products.json`, {
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
    });

    try {
        const json: ListMerchantShopProductsQuery = await res.json();

        const products: ProductPreview[] = json.data
            .filter((product) => product.visible)
            .sort((a, b) => {
                return getProductOrderByTags(a) - getProductOrderByTags(b);
            })
            .map((product) => {
                return {
                    id: product.id,
                    name: product.title,
                    price: product.variants.reduce(
                        (acc, variant) => (variant.price > acc ? variant.price : acc),
                        0
                    ),
                    image:
                        product.images.find((x) => {
                            x.is_default;
                        })?.src ?? product.images[0].src,
                };
            });

        return products;
    } catch (e) {
        console.error(e);
        return [];
    }
}

export default async function Home() {
    const products = await getProducts();

    const card = ({ id, image, name, price }: ProductPreview) => (
        <div key={id}>
            <Card className="w-80 grow">
                <div className="w-full relative">
                    <img
                        className="rounded-lg w-full h-80"
                        loading="lazy"
                        decoding="async"
                        src={image}
                        alt={""}
                    />
                    <div className="rounded-lg w-full h-full absolute top-0 left-0 right-0 opacity-0 transition-opacity duration-300 ease-in-out bg-gray-800 text-white rounded-md hover:opacity-100 bg-opacity-50">
                        <div className="flex align-center justify-center w-full h-full flex-col p-8 pt-48">
                            <Link className="w-full" href={`/product/${id}`}>
                                <Button variant="outline" className="w-full">
                                    See Details
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
                <CardHeader className="p-4 text-center text-amber-400">{name}</CardHeader>
                <CardHeader className="w-full p-4 pt-0 text-center">${price / 100}</CardHeader>
            </Card>
        </div>
    );

    const cards = products.map(card);

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24 pt-0">
            <div className="container">
                <div className="flex max-w-full flex-wrap content-evenly justify-evenly gap-8">{cards}</div>
            </div>
        </main>
    );
}
