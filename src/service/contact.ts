import { EmailData } from './email';

// 같은 서버 내 클라이언트 -> 서버
export async function sendContactEmail(email: EmailData) {
  const response = await fetch('/api/contact', {
    method: 'POST',
    body: JSON.stringify(email),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || '서버 요청에 실패함 😂');
  }
  return data;
}
