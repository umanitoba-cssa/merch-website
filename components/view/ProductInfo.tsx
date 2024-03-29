"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    Carousel,
    CarouselApi,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { Product } from "@/types/printify/ShopProducts";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@radix-ui/react-select";
import { useEffect, useState } from "react";
import { Input } from "../ui/input";

export default function ProductInfo({ product, price }: { product: Product; price: number }) {
    const [api, setApi] = useState<CarouselApi>();
    const [selectedImage, setSelectedImage] = useState(0);
    const [selectedColor, setSelectedColor] = useState(0);
    const [selectedSize, setSelectedSize] = useState(0);

    useEffect(() => {
        const opt = product.options.find((option) => option.type === "color")?.values?.at(selectedColor);

        console.log(opt);

        if (opt) {
            const colorId = opt.id;
            const variantIds = product.variants
                .filter((variant) => variant.options.includes(colorId))
                .map((variant) => variant.id);
            const image = product.images.findIndex((image) =>
                image.variant_ids?.some((id) => variantIds.includes(id))
            );
            setSelectedImage(image);
            if (api) {
                api.scrollTo(image);
            }
        }
    }, [selectedColor, api, product.images, product.options, product.variants]);

    const sizes = product.options.find((option) => option.type === "size")?.values;
    const sizeButtons = sizes?.map((size) => (
        <Button key={size.id} variant={"outline"} className="min-w-12 h-12">
            {size.title}
        </Button>
    ));

    const colors = product.options.find((option) => option.type === "color")?.values;
    const colorButtons = colors?.map((color, i) => (
        <Button
            key={color.id}
            variant={"outline"}
            className={`w-12 h-12 p-2 flex ${i == selectedColor ? "border-amber-400 border-2" : ""}`}
            onClick={() => {
                setSelectedColor(i);
            }}
        >
            <div
                className="w-8 h-8 rounded-3xl border border-white"
                style={{ backgroundColor: color.colors?.at(0) ?? "#ffffff" }}
            ></div>
        </Button>
    ));

    const imageButtons = product.images.map((image, i) => (
        <CarouselItem
            key={image.src}
            className="md:basis-1/4 lg:basis-1/6"
            onClick={() => {
                setSelectedImage(i);
            }}
        >
            <div className="p-1">
                <Card
                    className={`hover:cursor-pointer ${i == selectedImage ? "border-amber-400 border-2" : ""}`}
                >
                    <CardContent className="flex aspect-square items-center justify-center p-1">
                        <img fetchPriority="low" className="w-full" src={image.src} alt={`Product image ${selectedImage}`} />
                    </CardContent>
                </Card>
            </div>
        </CarouselItem>
    ));

    return (
        <div className="container">
            <div className="grid grid-cols-2 gap-24">
                <div className="col-span-1">
                    <div className="w-full">
                        <img fetchPriority="high" className="w-full" src={product.images[selectedImage].src} alt={`Product image ${selectedImage}`} />
                        <Carousel setApi={setApi}>
                            <CarouselContent>{imageButtons}</CarouselContent>
                            <CarouselPrevious />
                            <CarouselNext />
                        </Carousel>
                    </div>
                </div>
                <div className="col-span-1 flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                        <h2 className="text-3xl">{product.title}</h2>
                        <h3 className="text-xl font-bold">${price / 100} CAD</h3>
                    </div>
                    <div className="flex flex-col gap-1">
                        <h4 className="text-lg font-bold">SELECT SIZE</h4>
                        <div className="flex gap-2 wrap">{sizeButtons}</div>
                    </div>
                    <div className="flex flex-col gap-1">
                        <h4 className="text-lg font-bold">SELECT COLOUR</h4>
                        <div className="flex flex-row gap-2 flex-wrap max-w-full">{colorButtons}</div>
                    </div>
                    <div className="flex flex-col gap-1">
                        <div className="flex flex-row justify-between items-end max-w-full gap-8">
                            <div className="flex flex-col gap-2">
                                <h4 className="text-lg font-bold">QUANTITY</h4>
                                <Input placeholder="1" type="number" className="w-20" />
                            </div>
                        </div>
                    </div>
                            <Button variant={"secondary"} className="text-md font-sans p-6 ">Add to Cart</Button>
                    <div className="flex flex-col gap-1">
                        <h4 className="text-lg font-bold">PRODUCT DETAILS</h4>
                        <div>
                            <div className="flex flex-col gap-4" dangerouslySetInnerHTML={{ __html: product.description }}></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
