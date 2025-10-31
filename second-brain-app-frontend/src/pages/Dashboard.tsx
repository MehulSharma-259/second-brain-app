/** @format */
import {useState, useEffect} from "react";
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

export function Dashboard() {
  const [modalOpen, setModalOpen] = useState(false);
  const [contents, setContents, refetchContents] = useContents();

  const handleContentAdded = () => {
    setModalOpen(false);
    refetchContents(); 
  };

  const handleContentDeleted = () => {
    refetchContents();
  };

  // Load Twitter widgets whenever contents change
  useEffect(() => {
    const hasTwitterCards = contents?.some(content => content.type === 'twitter');
    
    if (hasTwitterCards) {
      // Wait for twttr to be available
      const loadTwitterWidgets = () => {
        if (window.twttr && window.twttr.widgets) {
          console.log("Loading Twitter widgets...");
          window.twttr.widgets.load();
        } else {
          // If twttr not loaded yet, wait and try again
          console.log("Waiting for Twitter widget script...");
          setTimeout(loadTwitterWidgets, 100);
        }
      };

      // Small delay to ensure DOM is updated
      setTimeout(loadTwitterWidgets, 100);
    }
  }, [contents]);

  return (
    <>
      <div>
        <Sidebar />
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

        <div className="flex gap-4 flex-wrap">
          {contents?.map(({type, title, link, _id}) => (
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