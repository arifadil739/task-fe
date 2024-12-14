import { getTask } from '@/utils/api';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';

export default function TaskDetailsPage() {
  const { query } = useRouter();
  const { data, isLoading } = useQuery({
        queryKey: ["task"],
    queryFn: () => getTask(query.id as string),
  });
//   const { data, isLoading, isError } = useQuery({
//     queryKey: ["tasks", page, sortDirection, searchTerm],
//     queryFn: () => getTasks({ limit: 10, page: page, search: searchTerm, sort: "desc" }),
//     initialData: initialTasks as Task[],
//   });

  if (isLoading) return <p>Loading...</p>;

  const task = data;
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">{task?.title}</h1>
      <p>{task?.description}</p>
      <p>Status: {task?.status}</p>
      <p>Due Date: {task?.dueDate}</p>
    </div>
  );
}
