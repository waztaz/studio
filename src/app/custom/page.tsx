import DuvetAdvisorForm from "@/components/duvet-advisor-form";
import { Button } from "@/components/ui/button";
import { MessageSquare, TestTube2 } from "lucide-react";

export default function CustomBeddingPage() {
  return (
    <div className="bg-secondary min-h-screen">
       <header className="bg-background shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 h-16 flex items-center">
          <h1 className="font-bold text-lg">나만의 침구 찾기</h1>
        </div>
      </header>
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="text-center">
          <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">
            몇 가지 간단한 질문에 답하고 AI가 추천하는 최적의 이불을 만나보세요.
          </p>
        </div>

        <DuvetAdvisorForm />

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
