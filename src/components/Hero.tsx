import Image from 'next/image';
import Link from 'next/link';
import profileImage from '../../public/images/profile.png';

export default function Hero() {
  return (
    <section className='text-center'>
      <Image
        className='rounded-full mx-auto'
        src={profileImage}
        alt='Picture of the author'
        width={250}
        height={250}
        // 이미지 다운로드 우선순위
        priority
      />
      <h2 className='text-3xl font-bold mt-4'>{"Hi, I'm Ryong"}</h2>
      <h3 className='text-xl font-semibold mt-2'>Full-stack Engineer</h3>
      <p>꿈을 코딩하는 사람, winDragon</p>
      <Link href='/contact'>
        <button className='bg-yellow-500 font-bold rounded-xl py-1 px-4 mt-4'>
          Contact Me
        </button>
      </Link>
    </section>
  );
}
