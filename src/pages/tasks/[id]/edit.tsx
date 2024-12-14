import { useRouter } from 'next/router';
import TaskForm from '../../../components/TaskForm';
import { useQuery } from '@tanstack/react-query';
import { getTask } from '@/utils/api';

export default function EditTaskPage() {
  const { query } = useRouter();
  const { data, isLoading } = useQuery({
    queryKey: ["task"],
    queryFn: () => getTask(query.id as string),
});
  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="p-4">
      <TaskForm initialData={data} />
    </div>
  );
}
