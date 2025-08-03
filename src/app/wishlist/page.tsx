import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, ShoppingCart } from "lucide-react";
import Image from "next/image";

const likedProducts = [
  { id: 1, name: "프리미엄 호텔 침구 세트", price: "129,000", image: "https://placehold.co/400x400.png", hint: "hotel bedding" },
  { id: 2, name: "알러지케어 마이크로파이버 이불", price: "89,000", image: "https://placehold.co/400x400.png", hint: "microfiber duvet" },
];

const likedBrands = [
  { id: 1, name: "코지슬립", followers: "1.2k", image: "https://placehold.co/100x100.png", hint: "brand logo" },
  { id: 2, name: "꿈의자리", followers: "890", image: "https://placehold.co/100x100.png", hint: "brand logo" },
];

export default function WishlistPage() {
  return (
    <div className="bg-background min-h-screen">
      <header className="sticky top-0 bg-background z-10 shadow-sm">
        <div className="container h-16 flex items-center">
          <h1 className="text-xl font-bold">찜</h1>
        </div>
      </header>
      <div className="container py-4">
        <Tabs defaultValue="products" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="products">상품</TabsTrigger>
            <TabsTrigger value="brands">브랜드</TabsTrigger>
          </TabsList>
          <TabsContent value="products">
            <div className="grid grid-cols-2 gap-4 mt-4">
              {likedProducts.map((product) => (
                <Card key={product.id} className="relative group">
                   <div className="absolute top-2 right-2 bg-white/70 rounded-full p-1.5 z-10">
                    <Heart className="w-5 h-5 text-primary fill-current" />
                  </div>
                  <CardContent className="p-0">
                    <Image src={product.image} width={400} height={400} alt={product.name} className="aspect-square object-cover rounded-t-lg" data-ai-hint={product.hint}/>
                    <div className="p-3">
                      <p className="text-sm font-medium truncate">{product.name}</p>
                      <p className="text-lg font-bold mt-1">{product.price}원</p>
                    </div>
                  </CardContent>
                  <CardFooter className="p-2 pt-0">
                    <Button variant="outline" size="sm" className="w-full">
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      담기
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
             {likedProducts.length === 0 && (
                <div className="text-center py-20">
                  <Heart className="mx-auto h-12 w-12 text-muted-foreground" />
                  <p className="mt-4 text-muted-foreground">찜한 상품이 없습니다.</p>
                </div>
              )}
          </TabsContent>
          <TabsContent value="brands">
            <div className="space-y-4 mt-4">
                {likedBrands.map((brand) => (
                  <Card key={brand.id}>
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Image src={brand.image} width={60} height={60} alt={brand.name} className="rounded-full" data-ai-hint={brand.hint} />
                        <div>
                          <p className="font-bold">{brand.name}</p>
                          <p className="text-sm text-muted-foreground">팔로워 {brand.followers}</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">찜하기</Button>
                    </CardContent>
                  </Card>
                ))}
            </div>
            {likedBrands.length === 0 && (
                <div className="text-center py-20">
                    <Heart className="mx-auto h-12 w-12 text-muted-foreground" />
                    <p className="mt-4 text-muted-foreground">찜한 브랜드가 없습니다.</p>
                </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
