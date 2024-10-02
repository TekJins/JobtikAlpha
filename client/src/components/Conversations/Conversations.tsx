import { useMemo, memo, useState, useEffect } from 'react';
import { parseISO, isToday } from 'date-fns';
import { TConversation } from 'librechat-data-provider';
import { groupConversationsByDate } from '~/utils';
import { useLocalize } from '~/hooks';
import Convo from './Convo';
import CategoryDropdown from './categories';

const Conversations = ({
  conversations,
  moveToTop,
  toggleNav,
}: {
  conversations: TConversation[];
  moveToTop: () => void;
  toggleNav: () => void;
}) => {
  const localize = useLocalize();
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  useEffect(() => {
    const storedCategories = Object.keys(localStorage).filter((key) => key.startsWith('category_'));
    setSelectedCategories(
      storedCategories.map((key) => key.replace('category_', '').replace(/_/g, ' ').toLowerCase()),
    );
  }, []);

  const filteredConversations = useMemo(() => {
    if (selectedCategories.length === 0) {
      return conversations;
    }
    return conversations.filter((convo) =>
      selectedCategories.includes(convo.model?.toLowerCase() ?? ''),
    );
  }, [conversations, selectedCategories]);

  const groupedConversations = useMemo(
    () => groupConversationsByDate(filteredConversations),
    [filteredConversations],
  );

  const firstTodayConvoId = useMemo(
    () =>
      filteredConversations.find(
        (convo) => convo && convo.updatedAt && isToday(parseISO(convo.updatedAt)),
      )?.conversationId,
    [filteredConversations],
  );

  const handleCategoryChange = (category: string) => {
    const storageKey = `category_${category.replace(/\s/g, '_').toLowerCase()}`;
    localStorage.setItem(storageKey, 'true');
    setSelectedCategories((prev) => [...prev, category.toLowerCase()]);
    setSelectedCategory('');
  };

  const removeCategory = (category: string) => {
    console.log(`Removing category: ${category}`);
    const storageKey = `category_${category.replace(/\s/g, '_').toLowerCase()}`;
    localStorage.removeItem(storageKey);
    setSelectedCategories((prev) => prev.filter((cat) => cat !== category.toLowerCase()));
    setSelectedCategory('');
  };

  const clearAllCategories = () => {
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('category_')) {
        localStorage.removeItem(key);
      }
    });
    setSelectedCategories([]);
    setSelectedCategory('');
  };

  return (
    <div className="text-token-text-primary flex flex-col gap-2 pb-2 text-sm">
      <div className="mb-4">
        <CategoryDropdown
          selectedCategory={selectedCategory}
          setSelectedCategory={handleCategoryChange}
        />
      </div>
      <div className="mb-4 flex flex-wrap gap-2">
        {selectedCategories.map((category) => (
          <div
            key={category}
            className="flex items-center rounded-full bg-blue-100 px-2 py-1 text-blue-800"
          >
            <span>{category.replace(/_/g, '')}</span>
            <button
              onClick={() => removeCategory(category)}
              className="ml-2 text-blue-600 hover:text-blue-800 focus:outline-none"
            >
              ×
            </button>
          </div>
        ))}
        {selectedCategories.length > 0 && (
          <button
            onClick={clearAllCategories}
            className="rounded-full bg-red-100 px-2 py-1 text-red-800 hover:bg-red-200 focus:outline-none"
          >
            Clear All
          </button>
        )}
      </div>
      <div>
        <span>
          {groupedConversations.map(([groupName, convos]) => (
            <div key={groupName}>
              <div
                style={{
                  color: '#aaa',
                  fontSize: '0.7rem',
                  marginTop: '20px',
                  marginBottom: '5px',
                  paddingLeft: '10px',
                }}
              >
                {localize(groupName) || groupName}
              </div>
              {convos
                .sort((a, b) => a.title.localeCompare(b.title))
                .map((convo, i) => (
                  <Convo
                    key={`${groupName}-${convo.conversationId}-${i}`}
                    isLatestConvo={convo.conversationId === firstTodayConvoId}
                    conversation={convo}
                    retainView={moveToTop}
                    toggleNav={toggleNav}
                  />
                ))}
              <div
                style={{
                  marginTop: '5px',
                  marginBottom: '5px',
                }}
              />
            </div>
          ))}
        </span>
      </div>
    </div>
  );
};

export default memo(Conversations);
