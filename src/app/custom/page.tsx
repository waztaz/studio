import DuvetAdvisorForm from "@/components/duvet-advisor-form";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { MessageSquare, TestTube2 } from "lucide-react";

export default function CustomBeddingPage() {
  return (
    <div className="bg-secondary min-h-screen">
      <header className="bg-background shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center">
          <Link href="/" className="flex items-center gap-2" aria-label="매일이불 홈으로">
            <Icons.logo className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg">매일이불</span>
          </Link>
        </div>
      </header>
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold font-headline text-foreground">나만의 침구 찾기</h1>
          <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">
            몇 가지 간단한 질문에 답하고 AI가 추천하는 최적의 이불을 만나보세요.
          </p>
        </div>

        <DuvetAdvisorForm />

        <div className="mt-16">
          <h2 className="text-2xl md:text-3xl font-bold text-center font-headline text-foreground">필터링된 제품</h2>
          <p className="mt-2 text-muted-foreground text-center">추천 또는 선호도에 따라 제품을 찾아보세요.</p>
          {/* Placeholder for filtered product grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <Image src={`https://placehold.co/400x300.png`} width={400} height={300} alt={`제품 ${i}`} className="rounded-lg" data-ai-hint="duvet product" />
                </CardHeader>
                <CardContent>
                  <CardTitle className="text-base">프리미엄 구스다운 이불</CardTitle>
                  <p className="text-muted-foreground text-sm mt-1">헝가리산 거위털 90%</p>
                  <p className="font-bold text-lg mt-2">199,000원</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="mt-16 bg-background rounded-lg p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-bold">상담이 필요하신가요?</h3>
            <p className="text-muted-foreground mt-2">전문가와 실시간으로 상담하고 더 자세한 추천을 받아보세요.</p>
          </div>
          <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <MessageSquare className="mr-2 h-5 w-5" />
            실시간 채팅 상담
          </Button>
        </div>

        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold">AR로 미리보기</h3>
           <p className="text-muted-foreground mt-2">증강현실을 통해 내 방에 이불을 놓아보세요.</p>
          <Button variant="outline" size="lg" className="mt-4">
            <TestTube2 className="mr-2 h-5 w-5"/>
            AR 체험하기
          </Button>
        </div>
      </div>
    </div>
  );
}
