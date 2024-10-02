import React, { useState, useEffect } from 'react';
import { useCombobox } from 'downshift';
import categories from '~/categories.json';

interface CategoryDropdownProps {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
}

const CategoryDropdown: React.FC<CategoryDropdownProps> = ({
  selectedCategory,
  setSelectedCategory,
}) => {
  const [inputItems, setInputItems] = useState<string[]>(categories);
  const [localSelectedCategory, setLocalSelectedCategory] = useState<string>(selectedCategory);

  const {
    isOpen,
    getToggleButtonProps,
    getMenuProps,
    getInputProps,
    highlightedIndex,
    getItemProps,
    reset,
  } = useCombobox<string>({
    items: inputItems,
    initialInputValue: localSelectedCategory,
    onInputValueChange: ({ inputValue }) => {
      setInputItems(
        categories.filter((item) => item.toLowerCase().startsWith(inputValue?.toLowerCase() ?? '')),
      );
    },
    onSelectedItemChange: ({ selectedItem }) => {
      if (selectedItem) {
        setLocalSelectedCategory(selectedItem);
        setSelectedCategory(selectedItem);
        setTimeout(() => {
          reset();
          setLocalSelectedCategory('');
        }, 300); // Reset after 300m seconds
      }
    },
  });

  useEffect(() => {
    setLocalSelectedCategory(selectedCategory);
  }, [selectedCategory]);

  const handleClear = () => {
    reset();
    setLocalSelectedCategory('');
    setSelectedCategory('');
  };

  return (
    <div className="relative w-full">
      <div className="flex items-center">
        <input
          {...getInputProps()}
          className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 text-sm leading-tight text-gray-700 shadow focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          placeholder="Select a category"
          value={localSelectedCategory}
        />
        {localSelectedCategory && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-8 flex items-center px-2 text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
          >
            &#x2715;
          </button>
        )}
        <button
          type="button"
          {...getToggleButtonProps()}
          className="absolute right-0 flex items-center px-2 text-gray-700 dark:text-gray-300"
        >
          &#8595;
        </button>
      </div>
      <ul
        {...getMenuProps()}
        className={`${
          isOpen ? 'block' : 'hidden'
        } absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white shadow-lg dark:bg-gray-800`}
      >
        {isOpen &&
          inputItems.map((item, index) => (
            <li
              key={`${item}${index}`}
              {...getItemProps({ item, index })}
              className={`${
                highlightedIndex === index ? 'bg-blue-100 dark:bg-blue-900' : ''
              } cursor-pointer px-3 py-2 text-sm hover:bg-blue-50 dark:hover:bg-blue-800`}
            >
              {item}
            </li>
          ))}
      </ul>
    </div>
  );
};

export default CategoryDropdown;
