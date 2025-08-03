'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

import { handleDuvetRecommendation, type FormState } from '@/app/custom/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { RecommendDuvetOutput } from '@/ai/flows/smart-duvet-advisor';

const formSchema = z.object({
  temperature: z.string().min(1, '선호 온도를 선택해주세요.'),
  allergy: z.string().min(1, '알러지 여부를 선택해주세요.'),
  weight: z.string().min(1, '선호 무게를 선택해주세요.'),
  style: z.string().min(1, '선호 스타일을 선택해주세요.'),
  budget: z.string().min(1, '예산을 선택해주세요.'),
});

type FormData = z.infer<typeof formSchema>;

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} size="lg" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      AI 추천받기
    </Button>
  );
}

export default function DuvetAdvisorForm() {
  const { toast } = useToast();

  const initialState: FormState = { message: '', success: false };
  const [state, formAction] = useFormState(handleDuvetRecommendation, initialState);
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      temperature: '',
      allergy: '',
      weight: '',
      style: '',
      budget: '',
    },
  });

  useEffect(() => {
    if (state.message && !state.success) {
      toast({
        variant: 'destructive',
        title: '오류',
        description: state.message,
      });
    }
  }, [state, toast]);

  return (
    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
      <Card>
        <CardHeader>
          <CardTitle>스마트 이불 어드바이저</CardTitle>
          <CardDescription>아래 설문에 답해주시면 최적의 이불을 추천해 드립니다.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form action={formAction} className="space-y-6">
              <FormField
                control={form.control}
                name="temperature"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>선호하는 수면 온도</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} name={field.name}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="수면 온도를 선택하세요" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="warm">따뜻하게 자는 편</SelectItem>
                        <SelectItem value="cool">시원하게 자는 편</SelectItem>
                        <SelectItem value="neutral">온도에 민감하지 않음</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="allergy"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>알러지 유무</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} name={field.name}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="알러지 정보를 선택하세요" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="yes">알러지 있음 (먼지, 진드기 등)</SelectItem>
                        <SelectItem value="no">알러지 없음</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="weight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>선호하는 이불 무게감</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} name={field.name}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="선호하는 무게감을 선택하세요" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="light">가벼운 이불</SelectItem>
                        <SelectItem value="medium">적당한 무게감</SelectItem>
                        <SelectItem value="heavy">무게감 있는 이불</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="style"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>침실 인테리어 스타일</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} name={field.name}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="선호하는 스타일을 선택하세요" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="modern">모던</SelectItem>
                        <SelectItem value="minimalist">미니멀</SelectItem>
                        <SelectItem value="natural">내추럴</SelectItem>
                        <SelectItem value="classic">클래식</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="budget"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>예산 범위</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} name={field.name}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="예산 범위를 선택하세요" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="under_100">10만원 미만</SelectItem>
                        <SelectItem value="100_200">10만원 - 20만원</SelectItem>
                        <SelectItem value="over_200">20만원 이상</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <SubmitButton />
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {state.success && state.result ? (
        <Card className="bg-background animate-in fade-in">
          <CardHeader>
            <CardTitle>AI 추천 결과</CardTitle>
            <CardDescription>고객님을 위한 최적의 이불을 추천합니다.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg text-primary">{state.result.recommendation}</h3>
            </div>
            <div>
              <h4 className="font-semibold">추천 이유</h4>
              <p className="text-muted-foreground mt-1 text-sm">{state.result.reasoning}</p>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">추천 제품 보러가기</Button>
          </CardFooter>
        </Card>
      ) : (
        <div className="flex items-center justify-center h-full bg-secondary rounded-lg border-2 border-dashed">
            <p className="text-muted-foreground">설문을 작성하면 여기에 추천 결과가 표시됩니다.</p>
        </div>
      )}
    </div>
  );
}
