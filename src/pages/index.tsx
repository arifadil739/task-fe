import { Modal } from "@/components/Modal";
import { IPaginatedRecords, Task } from "@/utils/types";
import { ChevronDownIcon, ChevronUpIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { GetServerSideProps } from "next";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { deleteTask, getTasks } from "../utils/api";

interface HomeProps {
  initialTasks: IPaginatedRecords<Task>;
}

export default function Home({ initialTasks }: HomeProps) {
  const [page, setPage] = useState(1);
  const [sortField, setSortField] = useState<keyof Task>("createdAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  const { data, refetch } = useQuery({
    queryKey: ["tasks", page, sortField, sortDirection, debouncedSearchTerm, statusFilter],
    queryFn: () => getTasks({ limit: 10, page: page, search: debouncedSearchTerm, sort: sortDirection, sortBy: sortField, status: statusFilter }),
    initialData: initialTasks,
  });

  useEffect(() => {
    const handler = setTimeout(() => {
      const trimmedTerm = searchTerm.trim();
      if (trimmedTerm) {
        setDebouncedSearchTerm(trimmedTerm);
      } else {
        setDebouncedSearchTerm("");
      }
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  const sortTasks = (field: keyof Task) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const openDeleteModal = async (id: string) => {
    setTaskToDelete(id);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (taskToDelete) {
      try {
        await deleteTask(taskToDelete);
        refetch();
        toast.success("The task has been successfully deleted.");
      } catch (error) {
        toast.error("Failed to delete the task. Please try again.");
      }
    }
    setDeleteModalOpen(false);
    setTaskToDelete(null);
  };

  return (
    <>
      <div className="mb-4 flex justify-between items-center">
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="p-2 border rounded outline-none cursor-pointer text-[10px] md:text-base">
          <option value="">All Statuses</option>
          <option value="PENDING">Pending</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="COMPLETED">Completed</option>
        </select>
        <div className="flex items-center space-x-4">
          <input
            type="text"
            placeholder="Search tasks..."
            className="p-2 border rounded outline-none text-[10px] md:text-base w-[100px] md:w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Link href="/tasks/create" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded text-[10px] md:text-base">
            Create Task
          </Link>
        </div>
      </div>
      <div className="overflow-x-auto overflow-y-hidden bg-white shadow-md rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              >
                Title
                {sortField === "title" &&
                  (sortDirection === "asc" ? <ChevronUpIcon className="w-4 h-4 inline ml-1" /> : <ChevronDownIcon className="w-4 h-4 inline ml-1" />)}
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              >
                Description
                {sortField === "description" &&
                  (sortDirection === "asc" ? <ChevronUpIcon className="w-4 h-4 inline ml-1" /> : <ChevronDownIcon className="w-4 h-4 inline ml-1" />)}
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              >
                Status
                {sortField === "status" &&
                  (sortDirection === "asc" ? <ChevronUpIcon className="w-4 h-4 inline ml-1" /> : <ChevronDownIcon className="w-4 h-4 inline ml-1" />)}
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => sortTasks("dueDate")}
              >
                Due Date
                {sortField === "dueDate" &&
                  (sortDirection === "asc" ? <ChevronUpIcon className="w-4 h-4 inline ml-1" /> : <ChevronDownIcon className="w-4 h-4 inline ml-1" />)}
              </th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.data.map((task) => (
              <tr key={task._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{task.title}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{task.description}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      task.status === "COMPLETED"
                        ? "bg-green-100 text-green-800"
                        : task.status === "IN_PROGRESS"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {task.status.toLocaleUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{format(task.dueDate, "MM/dd/yyyy")}</td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                  <Link href={`/tasks/${task._id}/edit`} className="text-indigo-600 hover:text-indigo-900 mr-4">
                    <PencilIcon className="w-5 h-5 inline" />
                  </Link>
                  <button onClick={() => openDeleteModal(task._id)} className="text-red-600 hover:text-red-900">
                    <TrashIcon className="w-5 h-5 inline" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex justify-center">
        {Array.from({ length: Math.ceil(data.totalPages) }, (_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={`mx-1 px-3 py-1 rounded ${page === i + 1 ? "bg-indigo-600 hover:bg-indigo-700 text-white" : "bg-gray-200"}`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      <Modal isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} title="Delete Task">
        <p>Are you sure you want to delete this task?</p>
        <div className="mt-4 flex justify-end space-x-2">
          <button onClick={() => setDeleteModalOpen(false)} className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100">
            Cancel
          </button>
          <button onClick={handleDelete} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
            Delete
          </button>
        </div>
      </Modal>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const tasks = await getTasks({ limit: 10, page: 1, search: "", sort: "desc", sortBy: "createdAt", status: "" });
  return {
    props: {
      initialTasks: tasks,
    },
  };
};
