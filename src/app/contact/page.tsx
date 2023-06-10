import ContactForm from '@/components/ContactForm';
import { AiFillGithub, AiFillLinkedin, AiFillYoutube } from 'react-icons/ai';

const LINKS = [
  { icon: <AiFillGithub />, url: 'https://github.com/windragon0807' },
  { icon: <AiFillLinkedin />, url: '' },
  { icon: <AiFillYoutube />, url: '' },
];

export default function ContactPage() {
  return (
    <section className='flex flex-col items-center'>
      <h2 className='text-3xl font-bold my-2'>Contact Me</h2>
      <p>tmdfyd95@naver.com</p>
      <ul className='flex gap-4 my-2'>
        {LINKS.map(({ icon, url }, index) => (
          <a
            key={index}
            href={url}
            target='_blank'
            rel='noreferrer'
            className='text-5xl hover:text-yellow-400'
          >
            {icon}
          </a>
        ))}
      </ul>
      <h2 className='text-3xl font-bold my-8'>Or Send me an email</h2>
      <ContactForm />
    </section>
  );
}
