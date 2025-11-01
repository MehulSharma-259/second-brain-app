/** @format */
import {useState, useEffect, useMemo} from "react"; // Import useMemo
import {PlusIcon} from "../components/icons/PlusIcon";
import {ShareIcon} from "../components/icons/ShareIcon";
import {Button} from "../components/ui/Button";
import {Cards} from "../components/ui/Cards";
import {CreateContentModal} from "../components/ui/CreateContentModal";
import {Sidebar} from "../components/ui/Sidebar";
import {useContents} from "../hooks/useContents";

declare global {
  interface Window {
    twttr?: {
      widgets: {
        load: (container?: HTMLElement) => void;
      };
    };
  }
}

// Define the filter type
export type ContentFilter = "all" | "twitter" | "youtube";

export function Dashboard() {
  const [modalOpen, setModalOpen] = useState(false);
  
  // --- 1. GET isLoading from the hook ---
  const [contents, , refetchContents, isLoading] = useContents();
  
  // Add state for filtering
  const [filter, setFilter] = useState<ContentFilter>("all");

  const handleContentAdded = () => {
    setModalOpen(false);
    refetchContents(); 
  };

  const handleContentDeleted = () => {
    refetchContents();
  };

  // Memoize the filtered content
  const filteredContents = useMemo(() => {
    if (filter === "all") {
      return contents;
    }
    return contents.filter(content => content.type === filter);
  }, [contents, filter]);

  // Load Twitter widgets whenever filtered contents change
  useEffect(() => {
    const hasTwitterCards = filteredContents?.some(content => content.type === 'twitter');
    
    if (hasTwitterCards) {
      const loadTwitterWidgets = () => {
        if (window.twttr && window.twttr.widgets) {
          console.log("Loading Twitter widgets...");
          window.twttr.widgets.load();
        } else {
          console.log("Waiting for Twitter widget script...");
          setTimeout(loadTwitterWidgets, 100);
        }
      };
      // Delay to ensure DOM is updated
      setTimeout(loadTwitterWidgets, 100);
    }
  }, [filteredContents]); // Depend on filteredContents

  
  // --- 2. ADD THIS CHECK ---
  // While loading, show a loading screen.
  // The hook will handle the redirect to /signin if auth fails.
  if (isLoading) {
    return (
      <div className="h-screen bg-gray-200 flex justify-center items-center">
        <p className="text-xl font-medium">Loading...</p>
      </div>
    );
  }

  // --- 3. If not loading, render the dashboard ---
  return (
    <>
      <div>
        {/* Pass filter state and setter to Sidebar */}
        <Sidebar filter={filter} setFilter={setFilter} />
      </div>

      <div className="ml-72 p-4 bg-gray-200 min-h-screen">
        <CreateContentModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onContentAdded={handleContentAdded}
        />
        <div className="flex justify-end gap-3 p-4">
          <Button
            variant="primary"
            size="lg"
            text="Add Content"
            startIcon={<PlusIcon />}
            onClick={() => setModalOpen(true)}
          />
          <Button
            variant="secondary"
            size="lg"
            text="Share brain"
            startIcon={<ShareIcon />}
          />
        </div>

        {/* Use the responsive grid layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {/* Map over filteredContents instead of contents */}
          {filteredContents?.map(({type, title, link, _id}) => (
            <Cards
              key={_id}
              _id={_id}
              type={type}
              title={title}
              link={link}
              onDelete={handleContentDeleted}
            />
          ))}
        </div>
      </div>
    </>
  );
}