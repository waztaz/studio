import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ChevronRight, Gift, MapPin, Heart, MessageSquare, Settings } from "lucide-react";
import Link from "next/link";

export default function MyPage() {
  return (
    <div className="bg-secondary">
      <div className="container mx-auto px-4 py-8">
        <Card className="shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src="https://placehold.co/100x100.png" alt="User" data-ai-hint="user avatar" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-bold">로그인해주세요</h2>
                <p className="text-muted-foreground text-sm">로그인하고 맞춤 서비스를 이용해보세요.</p>
              </div>
            </div>
            <Button asChild className="w-full mt-4 bg-primary hover:bg-primary/90 text-primary-foreground">
              <Link href="/login">로그인 / 회원가입</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="mt-6 shadow-lg">
          <CardHeader>
            <CardTitle>쇼핑 정보</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 divide-x text-center">
              <div className="flex flex-col items-center gap-1">
                <span className="font-bold text-lg">0</span>
                <span className="text-sm text-muted-foreground">쿠폰</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <span className="font-bold text-lg">0</span>
                <span className="text-sm text-muted-foreground">포인트</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <span className="font-bold text-lg">0</span>
                <span className="text-sm text-muted-foreground">찜</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6 shadow-lg">
          <CardContent className="p-0">
            <MenuItem icon={Gift} label="주문/배송조회" />
            <Separator />
            <MenuItem icon={MapPin} label="배송지 관리" />
            <Separator />
            <MenuItem icon={Heart} label="찜한 상품" />
            <Separator />
            <MenuItem icon={MessageSquare} label="상품 문의" />
          </CardContent>
        </Card>

        <Card className="mt-6 shadow-lg">
          <CardContent className="p-0">
            <MenuItem icon={Settings} label="설정" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function MenuItem({ icon: Icon, label }: { icon: React.ElementType, label: string }) {
  return (
    <Link href="#" className="flex items-center justify-between p-4 hover:bg-muted">
      <div className="flex items-center gap-3">
        <Icon className="w-5 h-5 text-muted-foreground" />
        <span>{label}</span>
      </div>
      <ChevronRight className="w-5 h-5 text-muted-foreground" />
    </Link>
  );
}
