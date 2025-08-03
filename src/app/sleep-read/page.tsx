import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { Bookmark, Search } from "lucide-react";

const articles = [
  { title: "올바른 이불 세탁 및 관리법", category: "케어", image: "https://placehold.co/400x300.png", hint: "laundry care", excerpt: "이불을 오래도록 새것처럼 유지하는 세탁 노하우를 알려드립니다." },
  { title: "숙면을 위한 침구 소재 가이드", category: "소재", image: "https://placehold.co/400x300.png", hint: "fabric guide", excerpt: "면, 모달, 텐셀, 구스... 어떤 소재가 나에게 맞을까요?" },
  { title: "여름밤, 시원하게 보내는 방법", category: "계절", image: "https://placehold.co/400x300.png", hint: "summer bedding", excerpt: "열대야에도 끄떡없는 시원한 여름 침구 선택법." },
  { title: "신혼부부를 위한 침구 세트 추천", category: "스타일", image: "https://placehold.co/400x300.png", hint: "wedding bedding", excerpt: "새로운 시작을 더욱 특별하게 만들어 줄 침구 스타일링." },
  { title: "알레르기 비염, 이불부터 바꿔보세요", category: "건강", image: "https://placehold.co/400x300.png", hint: "allergy relief", excerpt: "알레르기 방지 기능성 침구로 건강한 잠자리를 만드세요." },
  { title: "수면의 질을 높이는 과학적인 방법", category: "수면과학", image: "https://placehold.co/400x300.png", hint: "sleep science", excerpt: "단순히 오래 자는 것보다 중요한 '잘' 자는 법을 알아봅니다." },
];


export default function SleepReadPage() {
  return (
    <div className="bg-background">
      <header className="bg-background shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <h1 className="font-bold text-lg">침구 지식</h1>
            <Search className="h-6 w-6 text-muted-foreground" />
        </div>
      </header>
      
      <div className="container py-8">
        <div className="flex gap-2 mb-8">
          <Input placeholder="궁금한 점을 검색해보세요..." className="flex-grow" />
          <Button aria-label="검색">
            <Search className="h-5 w-5" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article, index) => (
            <Card key={index} className="overflow-hidden group">
              <CardContent className="p-0">
                <div className="relative">
                  <Image src={article.image} alt={article.title} width={400} height={300} className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-110" data-ai-hint={article.hint}/>
                  <Button size="icon" variant="secondary" className="absolute top-3 right-3 rounded-full opacity-80 group-hover:opacity-100" aria-label="저장하기">
                    <Bookmark className="h-5 w-5"/>
                  </Button>
                </div>
                <div className="p-4">
                  <p className="text-sm font-semibold text-primary">{article.category}</p>
                  <h3 className="text-lg font-bold mt-1 leading-tight">{article.title}</h3>
                  <p className="text-muted-foreground text-sm mt-2">{article.excerpt}</p>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Button variant="link" className="p-0 h-auto">자세히 보기 →</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-12">
            <Button size="lg" variant="outline">더 많은 글 보기</Button>
        </div>
      </div>
    </div>
  );
}
