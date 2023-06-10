type Props = {
  categories: string[];
  selected: string;
  // NOTE: useState의 set 함수 타입을 필요한 파라미터로만 표현 가능
  onClick: (category: string) => void;
};
export default function Categories({ categories, selected, onClick }: Props) {
  return (
    <section className='text-center p-4'>
      <h2 className='text-lg font-bold border-b border-sky-500 mb-2'>
        Category
      </h2>
      <ul>
        {categories.map((category) => (
          <li
            // NOTE: className `` 사용하여 동적 설정
            className={`cursor-pointer hover:text-sky-500 ${
              category === selected && 'text-sky-600'
            }`}
            key={category}
            onClick={() => onClick(category)}
          >
            {category}
          </li>
        ))}
      </ul>
    </section>
  );
}
