/** @format */
import {useState, useEffect} from "react"; // <-- Import useEffect
import {PlusIcon} from "../components/icons/PlusIcon";
import {ShareIcon} from "../components/icons/ShareIcon";
import {Button} from "../components/ui/Button";
import {Cards} from "../components/ui/Cards";
import {CreateContentModal} from "../components/ui/CreateContentModal";
import {Sidebar} from "../components/ui/Sidebar";
import {useContents} from "../hooks/useContents";

// --- Define twttr on window ---
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

  // --- NEW useEffect to load tweets ---
  useEffect(() => {
    // When contents change (load, add, delete), check for twitter cards
    const hasTwitterCards = contents?.some(content => content.type === 'twitter');
    
    if (hasTwitterCards) {
      // If the twitter script object is loaded, call its load function
      // This will scan the document and embed any new <blockquote class="twitter-tweet">
      if (window.twttr && window.twttr.widgets && typeof window.twttr.widgets.load === 'function') {
        console.log("Found twitter cards, calling widgets.load()");
        window.twttr.widgets.load();
      }
    }
  }, [contents]); // Run this effect whenever the 'contents' array changes

  return (
    <>
      <div>
        <Sidebar />
      </div>

      <div className="ml-72 p-4 bg-gray-200 min-h-screen">
        <CreateContentModal
          open={modalOpen}
          onClose={() => {
            setModalOpen(false);
          }}
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