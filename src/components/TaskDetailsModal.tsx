import { Modal } from "@/components/Modal";
import { Task } from "@/utils/types";
import { format } from "date-fns";

interface TaskDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
}

export function TaskDetailsModal({ isOpen, onClose, task }: TaskDetailsModalProps) {
  if (!task) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Task Details">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium">Title</h3>
          <p>{task.title}</p>
        </div>
        <div>
          <h3 className="text-lg font-medium">Description</h3>
          <p>{task.description}</p>
        </div>
        <div>
          <h3 className="text-lg font-medium">Status</h3>
          <p>{task.status}</p>
        </div>
        <div>
          <h3 className="text-lg font-medium">Due Date</h3>
          <p>{format(new Date(task.dueDate), "MM/dd/yyyy")}</p>
        </div>
        <div>
          <h3 className="text-lg font-medium">Created At</h3>
          <p>{format(new Date(task.createdAt), "MM/dd/yyyy HH:mm:ss")}</p>
        </div>
        <div>
          <h3 className="text-lg font-medium">Updated At</h3>
          <p>{format(new Date(task.updatedAt), "MM/dd/yyyy HH:mm:ss")}</p>
        </div>
      </div>
      <div className="mt-6 flex justify-end">
        <button onClick={onClose} className="px-4 py-2 text-white rounded bg-indigo-600 hover:bg-indigo-700">
          Close
        </button>
      </div>
    </Modal>
  );
}

