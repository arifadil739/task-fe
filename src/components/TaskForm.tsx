import { createTask, updateTask } from "@/utils/api";
import { Task, TaskStatus } from "@/utils/types";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

export default function TaskForm({ initialData }: { initialData?: Task }) {
  const [loading, setLoading] = useState<boolean>(false);
  const preloadedData = initialData ? { ...initialData, dueDate: initialData.dueDate.split("T")[0] } : undefined;

  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: preloadedData });

  const onSubmit = async (data: Task) => {
    setLoading(true);
    try {
      let response;
      const body = {
        title: data.title,
        description: data.description,
        status: data.status,
        dueDate: data.dueDate,
      };
      if (initialData) {
        response = await updateTask(initialData._id, body);
      } else {
        response = await createTask(body);
      }

      if (response) {
        toast.success(`Task ${initialData ? "updated" : "created"} successfully`);
        router.push("/");
      }
    } catch (error) {
      setLoading(false);
      console.error("Task operation failed:", error);
      toast.error(`An error occurred while ${initialData ? "updating" : "creating"} the task.`);
    }
  };

  return (
    <div className="flex justify-center bg-gray-100">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full max-w-md bg-white shadow-md rounded-lg p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">{initialData ? "Edit Task" : "Create New Task"}</h2>

        <div className="space-y-2">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            {...register("title", { required: "Title is required" })}
            id="title"
            placeholder="Enter task title"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.title && <p className="text-red-500 text-sm mt-1">{errors?.title?.message as string}</p>}
        </div>

        <div className="space-y-2">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            {...register("description", { required: "Description is required" })}
            id="description"
            placeholder="Enter task description"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            rows={3}
          />
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors?.description?.message as string}</p>}
        </div>

        <div className="space-y-2">
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <select
            {...register("status", { required: "Status is required" })}
            id="status"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none text-black"
          >
            <option value={TaskStatus.PENDING}>Pending</option>
            <option value={TaskStatus.IN_PROGRESS}>In Progress</option>
            <option value={TaskStatus.COMPLETED}>Completed</option>
          </select>
          {errors.status && <p className="text-red-500 text-sm mt-1">{errors?.status?.message as string}</p>}
        </div>

        <div className="space-y-2">
          <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">
            Due Date
          </label>
          <input
            {...register("dueDate", { required: "Due date is required" })}
            id="dueDate"
            type="date"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none text-blac"
          />
          {errors.dueDate && <p className="text-red-500 text-sm mt-1">{errors?.dueDate?.message as string}</p>}
        </div>

        <button
          type="submit"
          className="w-full flex items-center justify-center text-white py-2 px-4 rounded-md bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-offset-2 transition duration-150 ease-in-out"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {initialData ? "Updating..." : "Creating..."}
            </>
          ) : initialData ? (
            "Update Task"
          ) : (
            "Create Task"
          )}
        </button>
      </form>
    </div>
  );
}
