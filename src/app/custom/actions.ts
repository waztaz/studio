'use server';

import { recommendDuvet, type RecommendDuvetInput, type RecommendDuvetOutput } from '@/ai/flows/smart-duvet-advisor';
import { z } from 'zod';

const RecommendDuvetFormSchema = z.object({
  temperature: z.string().min(1, '선호 온도를 선택해주세요.'),
  allergy: z.string().min(1, '알러지 여부를 선택해주세요.'),
  weight: z.string().min(1, '선호 무게를 선택해주세요.'),
  style: z.string().min(1, '선호 스타일을 선택해주세요.'),
  budget: z.string().min(1, '예산을 선택해주세요.'),
});

export type FormState = {
  message: string;
  result?: RecommendDuvetOutput;
  success: boolean;
};

export async function handleDuvetRecommendation(
  prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  try {
    const rawFormData = Object.fromEntries(formData.entries());
    const validatedFields = RecommendDuvetFormSchema.safeParse(rawFormData);
    
    if (!validatedFields.success) {
      return {
        message: '모든 필드를 올바르게 입력해주세요.',
        success: false,
      };
    }
    
    const inputData: RecommendDuvetInput = validatedFields.data;

    const result = await recommendDuvet(inputData);

    return {
      message: '성공적으로 추천을 받았습니다!',
      result,
      success: true,
    };
  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.';
    return {
      message: `추천을 받는 중 오류가 발생했습니다: ${errorMessage}`,
      success: false,
    };
  }
}
