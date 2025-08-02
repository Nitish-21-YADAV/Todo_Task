import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from './store';
import { addTask, editTask, deleteTask,Task} from './features/todos/todosSlice';

export const useTodos = () => {
  const dispatch = useDispatch<AppDispatch>();
  const tasks = useSelector((state: RootState) => state.todos.tasks);
    return {
        tasks,
        addNewTask:(task:Task)=>dispatch(addTask(task)),
        updateTask:(task: Task) => dispatch(editTask(task)),
        removeTask:(id: string) => dispatch(deleteTask(id))
    }
};