import { sendEmail } from '@/service/email';
import * as yup from 'yup';

// yup 라이브러리를 활용한 유효성 검사
const bodySchema = yup.object().shape({
  from: yup.string().email().required(),
  subject: yup.string().required(),
  message: yup.string().required(),
});

// 같은 서버 내 서버 -> 클라이언트
export async function POST(req: Request) {
  // req는 Readable Stream이므로 json으로 변환해줘야 함
  const body = await req.json();
  if (!bodySchema.isValidSync(body)) {
    return new Response(JSON.stringify({ message: '메일 전송에 실패함!' }), {
      status: 400,
    });
  }
  return sendEmail(body)
    .then(() =>
      new Response(JSON.stringify({ message: '메일을 성공적으로 보냈음' }), {
        status: 200,
      })
    )
    .catch((error) => {
      console.error(error);
      return new Response(JSON.stringify({ message: '메일 전송에 실패함!' }), {
        status: 500,
      });
    });
}
