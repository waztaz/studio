import { Card, CardContent } from "@/components/ui/card";
import { Search, ChevronDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const categories = [
  { name: "침구세트", image: "https://placehold.co/300x300.png", hint: "bedding set" },
  { name: "이불", image: "https://placehold.co/300x300.png", hint: "duvet" },
  { name: "베개", image: "https://placehold.co/300x300.png", hint: "pillow" },
  { name: "매트리스커버", image: "https://placehold.co/300x300.png", hint: "mattress cover" },
  { name: "여름침구", image: "https://placehold.co/300x300.png", hint: "summer bedding" },
  { name: "겨울침구", image: "https://placehold.co/300x300.png", hint: "winter bedding" },
  { name: "키즈", image: "https://placehold.co/300x300.png", hint: "kids bedding" },
  { name: "SALE", image: "https://placehold.co/300x300.png", hint: "sale items" },
];

export default function CategoryPage() {
  return (
    <div className="bg-background">
      <header className="sticky top-0 bg-background z-10 shadow-sm">
        <div className="container h-16 flex items-center justify-between">
          <h1 className="text-xl font-bold">카테고리</h1>
          <Search className="h-6 w-6 text-muted-foreground" />
        </div>
      </header>
      <div className="container py-6">
        <div className="grid grid-cols-2 gap-4">
          {categories.map((cat) => (
            <Link href="#" key={cat.name}>
              <Card className="overflow-hidden aspect-square flex flex-col items-center justify-center text-center hover:shadow-lg transition-shadow">
                <Image src={cat.image} width={150} height={150} alt={cat.name} className="w-24 h-24 object-cover" data-ai-hint={cat.hint} />
                <p className="mt-2 font-semibold">{cat.name}</p>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
