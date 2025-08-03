import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { Bookmark, Search } from "lucide-react";
import { Icons } from "@/components/icons";
import Link from "next/link";

const categories = ["케어", "수면과학", "스타일", "계절", "소재", "건강"];

const articles = [
  { title: "올바른 이불 세탁 및 관리법", category: "케어", image: "https://placehold.co/400x300.png", hint: "laundry care", excerpt: "이불을 오래도록 새것처럼 유지하는 세탁 노하우를 알려드립니다." },
  { title: "숙면을 위한 침구 소재 가이드", category: "소재", image: "https://placehold.co/400x300.png", hint: "fabric guide", excerpt: "면, 모달, 텐셀, 구스... 어떤 소재가 나에게 맞을까요?" },
  { title: "여름밤, 시원하게 보내는 방법", category: "계절", image: "https://placehold.co/400x300.png", hint: "summer bedding", excerpt: "열대야에도 끄떡없는 시원한 여름 침구 선택법." },
  { title: "신혼부부를 위한 침구 세트 추천", category: "스타일", image: "https://placehold.co/400x300.png", hint: "wedding bedding", excerpt: "새로운 시작을 더욱 특별하게 만들어 줄 침구 스타일링." },
  { title: "알레르기 비염, 이불부터 바꿔보세요", category: "건강", image: "https://placehold.co/400x300.png", hint: "allergy relief", excerpt: "알레르기 방지 기능성 침구로 건강한 잠자리를 만드세요." },
  { title: "수면의 질을 높이는 과학적인 방법", category: "수면과학", image: "https://placehold.co/400x300.png", hint: "sleep science", excerpt: "단순히 오래 자는 것보다 중요한 '잘' 자는 법을 알아봅니다." },
  { title: "호텔 침구처럼 바삭하게 관리하기", category: "케어", image: "https://placehold.co/400x300.png", hint: "hotel bedding", excerpt: "매일 호텔에 온 듯한 기분을 느낄 수 있는 침구 관리 비법." },
  { title: "아이방 침구, 어떻게 고를까?", category: "스타일", image: "https://placehold.co/400x300.png", hint: "kids bedding", excerpt: "성장기 아이들을 위한 안전하고 포근한 침구 선택 가이드." },
];


export default function SleepReadPage() {
  return (
    <div className="bg-background">
      <header className="bg-background shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center">
            <Link href="/" className="flex items-center gap-2" aria-label="매일이불 홈으로">
              <Icons.logo className="h-6 w-6 text-primary" />
              <span className="font-bold text-lg">매일이불</span>
            </Link>
        </div>
      </header>

      <section className="bg-secondary py-12 md:py-20">
        <div className="container text-center">
          <h1 className="text-4xl md:text-5xl font-bold font-headline">침구 지식 센터</h1>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            더 나은 수면을 위한 모든 것. 매일이불의 전문가들이 제공하는 다양한 침구 지식과 팁을 만나보세요.
          </p>
        </div>
      </section>

      <div className="container py-12">
        <div className="relative w-full h-80 rounded-lg overflow-hidden mb-12">
          <Image src="https://placehold.co/1200x400.png" alt="Featured article" layout="fill" objectFit="cover" data-ai-hint="reading sleep" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 p-8 text-white">
            <h2 className="text-3xl font-bold">에디터 추천: 최고의 수면 환경 만들기</h2>
            <p className="mt-2 max-w-lg">온도, 습도, 빛... 완벽한 수면을 위한 환경적 요소를 알아보고 오늘 밤부터 적용해보세요.</p>
            <Button className="mt-4 bg-primary text-primary-foreground hover:bg-primary/90">자세히 보기</Button>
          </div>
        </div>
        
        <Carousel opts={{ align: "start", loop: true }} className="w-full mb-8">
          <CarouselContent>
            {categories.map((category, index) => (
              <CarouselItem key={index} className="basis-1/3 md:basis-1/4 lg:basis-1/6">
                <Button variant="outline" className="w-full">{category}</Button>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex" />
          <CarouselNext className="hidden md:flex" />
        </Carousel>
        
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
