/** @format */
import {useState} from "react";
import {PlusIcon} from "../components/icons/PlusIcon";
import {ShareIcon} from "../components/icons/ShareIcon";
import {Button} from "../components/ui/Button";
import {Cards} from "../components/ui/Cards";
import {CreateContentModal} from "../components/ui/CreateContentModal";
import {Sidebar} from "../components/ui/Sidebar";
import {useContents} from "../hooks/useContents";

export function Dashboard() {
  const [modalOpen, setModalOpen] = useState(false);
  const [contents, setContents] = useContents();

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
          {/* {JSON.stringify(contents)} */}
          {contents?.map(({type, title, link, _id}) => (
            <Cards key={_id} type={type} title={title} link={link} />
          ))}
        </div>
      </div>
    </>
  );
}
