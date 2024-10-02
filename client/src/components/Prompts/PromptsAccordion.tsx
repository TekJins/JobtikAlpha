import PromptSidePanel from '~/components/Prompts/Groups/GroupSidePanel';
import AutoSendPrompt from '~/components/Prompts/Groups/AutoSendPrompt';
import FilterPrompts from '~/components/Prompts/Groups/FilterPrompts';
import ManagePrompts from '~/components/Prompts/ManagePrompts';
import { usePromptGroupsNav } from '~/hooks';
import { PlusIcon } from '@radix-ui/react-icons';

export default function PromptsAccordion() {
  const groupsNav = usePromptGroupsNav();
  return (
    <div className="flex h-full w-full flex-col">
      <PromptSidePanel className="lg:w-full xl:w-full" {...groupsNav}>
        <div className="flex w-full flex-row items-center justify-between px-2 pt-2">
          <ManagePrompts className="select-none" />
          <FilterPrompts setName={groupsNav.setName} className="items-center justify-center px-2" />
          <AutoSendPrompt className="text-xs dark:text-white" />
          <span
            className="ml-2 cursor-pointer rounded border border-gray-300 p-1 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700"
            onClick={() => (window.location.href = '/d/prompts/new')}
          >
            <PlusIcon className="h-4 w-4" />
          </span>
        </div>
      </PromptSidePanel>
    </div>
  );
}
