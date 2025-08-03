import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Bookmark, Search, Menu } from 'lucide-react';
import { Icons } from '@/components/icons';
import Link from 'next/link';

const recommendationCards = [
  { title: "더위를 많이 타는 분께", description: "시원한 소재로 쾌적한 잠자리를", image: "https://placehold.co/600x400.png", hint: "cool fabric" },
  { title: "추위를 잘 느끼는 분께", description: "포근하고 따뜻한 구스다운", image: "https://placehold.co/600x400.png", hint: "warm goose" },
  { title: "알러지가 있는 분께", description: "진드기 방지, 항균 처리 소재", image: "https://placehold.co/600x400.png", hint: "hypoallergenic textile" },
  { title: "부드러운 감촉을 원하면", description: "실크처럼 부드러운 모달", image: "https://placehold.co/600x400.png", hint: "soft modal" },
];

const articles = [
  { title: "올바른 이불 세탁 및 관리법", category: "관리 팁", image: "https://placehold.co/600x400.png", hint: "laundry care" },
  { title: "숙면을 위한 침구 소재 가이드", category: "소재 가이드", image: "https://placehold.co/600x400.png", hint: "fabric guide" },
  { title: "여름밤, 시원하게 보내는 방법", category: "계절별 침구", image: "https://placehold.co/600x400.png", hint: "summer bedding" },
  { title: "신혼부부를 위한 침구 세트 추천", category: "스타일링", image: "https://placehold.co/600x400.png", hint: "wedding bedding" },
];

export default function Home() {
  return (
    <div className="bg-background">
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2" aria-label="매일이불 홈으로">
            <Icons.logo className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg">매일이불</span>
          </Link>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" aria-label="검색">
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" aria-label="메뉴" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <section className="relative h-[60vh] min-h-[400px] w-full">
        <Image
          src="https://placehold.co/1600x900.png"
          alt="편안한 침실"
          fill
          className="object-cover"
          data-ai-hint="cozy bedroom"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 flex h-full flex-col items-center justify-center text-center text-white p-4">
          <h1 className="text-4xl md:text-6xl font-bold font-headline">어떤 이불이 맞을까요?</h1>
          <p className="mt-4 max-w-2xl text-lg text-gray-200">
            나에게 꼭 맞는 완벽한 이불을 찾아보세요.
            <br />
            몇 가지 질문에 답하고 최적의 침구를 추천받으세요.
          </p>
          <Button asChild size="lg" className="mt-8 bg-primary hover:bg-primary/90 text-primary-foreground">
            <Link href="/custom">맞춤 이불 찾기 <ArrowRight className="ml-2 h-5 w-5" /></Link>
          </Button>
        </div>
      </section>

      <section className="py-12 md:py-20 bg-secondary">
        <div className="container">
          <h2 className="text-3xl font-bold text-center font-headline">목적별 추천</h2>
          <p className="text-center text-muted-foreground mt-2">어떤 고민이 있으신가요? 상황에 맞는 침구를 추천해드려요.</p>
          <div className="grid grid-cols-1 gap-6 mt-8 sm:grid-cols-2 lg:grid-cols-4">
            {recommendationCards.map((item) => (
              <Card key={item.title} className="overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-lg">
                <CardHeader className="p-0">
                  <Image src={item.image} alt={item.title} width={600} height={400} className="w-full h-48 object-cover" data-ai-hint={item.hint}/>
                </CardHeader>
                <CardContent className="p-4">
                  <h3 className="text-lg font-bold">{item.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      <section className="py-12 md:py-20 bg-background">
        <div className="container">
          <h2 className="text-3xl font-bold text-center font-headline">카테고리별 지식</h2>
          <p className="text-center text-muted-foreground mt-2">침구에 대한 유용한 정보들을 확인해보세요.</p>
          <div className="grid grid-cols-1 gap-6 mt-8 md:grid-cols-2 lg:grid-cols-4">
            {articles.map((article) => (
              <Card key={article.title} className="flex flex-col">
                <CardHeader className="p-0">
                   <Image src={article.image} alt={article.title} width={600} height={400} className="w-full h-48 object-cover rounded-t-lg" data-ai-hint={article.hint} />
                </CardHeader>
                <CardContent className="p-4 flex-grow">
                  <p className="text-sm font-semibold text-primary">{article.category}</p>
                  <h3 className="font-bold mt-1">{article.title}</h3>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                   <Button variant="outline" className="w-full">
                     자세히 보기
                   </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
