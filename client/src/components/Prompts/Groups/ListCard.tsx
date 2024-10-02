import CategoryIcon from '~/components/Prompts/Groups/CategoryIcon';
import { useState } from 'react';

export default function ListCard({
  category,
  name,
  snippet,
  onClick,
  children,
}: {
  category: string;
  name: string;
  snippet: string;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  children?: React.ReactNode;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="pb relative my-1.5 flex w-full cursor-pointer flex-col gap-1 rounded-2xl border px-2 pt-1 text-start align-top
      text-[10px] shadow-[0_0_2px_0_rgba(0,0,0,0.05),0_3px_5px_0_rgba(0,0,0,0.02)] transition-all duration-300 ease-in-out hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-700"
    >
      <div className="flex w-full justify-between">
        <div className="flex flex-row gap-1.5">
          <CategoryIcon category={category} className="icon-sm" />
          <h6 className="break-word select-none text-balance text-xs font-semibold text-gray-800 dark:text-gray-200">
            {name + '        :               '}
            {snippet && (
              <span className="text-gray-400">{isHovered ? snippet : snippet.slice(0, 24)}</span>
            )}
          </h6>
        </div>
        <div style={{ transform: 'scale(0.7)', marginTop: '-5px' }}>{children}</div>
      </div>
    </div>
  );
}
