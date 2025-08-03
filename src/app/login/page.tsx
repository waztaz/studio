import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Icons } from "@/components/icons";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Link href="/" aria-label="매일이불 홈으로">
              <Icons.logo className="h-10 w-10 text-primary" />
            </Link>
          </div>
          <CardTitle className="text-2xl font-headline">로그인</CardTitle>
          <CardDescription>매일이불에 오신 것을 환영합니다.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">이메일</Label>
              <Input id="email" type="email" placeholder="email@example.com" required />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">비밀번호</Label>
                <Link href="#" className="text-sm text-muted-foreground hover:text-primary">
                  비밀번호를 잊으셨나요?
                </Link>
              </div>
              <Input id="password" type="password" required />
            </div>
            <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
              로그인
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center space-y-2">
           <div className="text-sm text-muted-foreground">
             계정이 없으신가요?{" "}
             <Link href="#" className="font-semibold text-primary hover:underline">
               회원가입
             </Link>
           </div>
        </CardFooter>
      </Card>
    </div>
  );
}
