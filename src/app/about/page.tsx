import Hero from '@/components/Hero';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Me',
  description: 'Ryong 커리어 소개',
};

const TITLE_CLASS = 'text-2xl font-bold text-gray-800 my-2';

export default function AboutPage() {
  return (
    <>
      <Hero />
      <section className='bg-gray-100 shadow-lg p-8 m-8 text-center rounded-2xl'>
        <h2 className={TITLE_CLASS}>Who Am I?</h2>
        <p>
          개발을 사랑하는 풀스택 개발자 <br />
          사람과 디자인을 담는 웹앱을 만들고 있음
        </p>
        <h2 className={TITLE_CLASS}>Career</h2>
        <p>
          미디어젠 (2022-Now)
        </p>
        <h2 className={TITLE_CLASS}>Skills</h2>
        <p>
          React, TypeScript, Next.js, Node
          <br />
          Git, Clean Code <br />
          VS Code, MongoDB
        </p>
      </section>
    </>
  );
}
