import { memo, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { useGetMessagesByConvoId } from 'librechat-data-provider/react-query';
import type { ChatFormValues } from '~/common';
import { ChatContext, AddedChatContext, useFileMapContext, ChatFormProvider } from '~/Providers';
import { useChatHelpers, useAddedResponse, useSSE } from '~/hooks';
import MessagesView from './Messages/MessagesView';
import { Spinner } from '~/components/svg';
import Presentation from './Presentation';
import ChatForm from './Input/ChatForm';
import { buildTree } from '~/utils';
import Landing from './Landing';
import Header from './Header';
import Footer from './Footer';
import store from '~/store';
import { set } from 'date-fns';

function ChatView({ index = 0 }: { index?: number }) {
  const { conversationId } = useParams();
  // useRecoilValue is a hook from the Recoil library that retrieves the current value of a Recoil state
  // It's used here to get the submission states for the root and added chat contexts
  // store.submissionByIndex is likely an atom or selector that holds submission data for different chat indices
  const rootSubmission = useRecoilValue(store.submissionByIndex(index)); // Get submission state for the current chat
  const addedSubmission = useRecoilValue(store.submissionByIndex(index + 1)); // Get submission state for the next chat index
  const [query, setQuery] = useState(''); // Use useState for query state

  const fileMap = useFileMapContext();

  const { data: messagesTree = null, isLoading } = useGetMessagesByConvoId(conversationId ?? '', {
    select: (data) => {
      const dataTree = buildTree({ messages: data, fileMap });
      return dataTree?.length === 0 ? null : dataTree ?? null;
    },
    enabled: !!fileMap,
  });

  const chatHelpers = useChatHelpers(index, conversationId);
  const addedChatHelpers = useAddedResponse({ rootIndex: index });

  useSSE(rootSubmission, chatHelpers, false);
  useSSE(addedSubmission, addedChatHelpers, true);

  const methods = useForm<ChatFormValues>({
    defaultValues: { text: '' },
  });

  return (
    <ChatFormProvider {...methods}>
      <ChatContext.Provider value={chatHelpers}>
        <AddedChatContext.Provider value={addedChatHelpers}>
          <Presentation useSidePanel={true} query={query} setQuery={setQuery}>
            {isLoading && conversationId !== 'new' ? (
              <div className="flex h-screen items-center justify-center">
                <Spinner className="opacity-0" />
              </div>
            ) : messagesTree && messagesTree.length !== 0 ? (
              <MessagesView messagesTree={messagesTree} Header={<Header />} />
            ) : (
              <Landing Header={<Header />} />
            )}
            <div className="w-full border-t-0 pl-0 pt-2 dark:border-white/20 md:w-[calc(100%-.5rem)] md:border-t-0 md:border-transparent md:pl-0 md:pt-0 md:dark:border-transparent">
              <ChatForm index={index} query={query} setQuery={setQuery} />
              <Footer />
            </div>
          </Presentation>
        </AddedChatContext.Provider>
      </ChatContext.Provider>
    </ChatFormProvider>
  );
}

export default memo(ChatView);
