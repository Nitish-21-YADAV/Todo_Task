'use client';

import { useTodos } from './lib//hook';
import { useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { X, Menu, ToggleLeft, ToggleRight } from 'lucide-react';

export default function Home() {
  const { tasks, addNewTask, updateTask, removeTask } = useTodos();
  const [open, setOpen] = useState(false);
  const [isbgDark, setIsbgDark] = useState<'dark' | 'light'>('dark');
  const sidebarRef = useRef<HTMLDivElement | null>(null);
  const [prioritystatus, setPrioritystatus] = useState<'Pending' | 'In Progress' | 'Completed'>('Pending');
  const [formdata, setFormData] = useState({
    title: '',
    description: '',
    status: 'Pending',
    dueDate: '',
  });
  const [priority, setPriority] = useState<'Low' | 'Medium' | 'High'>('Low');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterPriority, setFilterPriority] = useState('All');
  const [sortBy, setSortBy] = useState('Due Date');
  const [searchTerm, setSearchTerm] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'dueDate' ? new Date(value).toISOString() : value,
    }));
  };

  const handleAddTask = () => {
    if (formdata.title.trim()) {
      addNewTask({
        id: uuidv4(),
        title: formdata.title,
        description: formdata.description,
        dueDate: formdata.dueDate,
        status: prioritystatus,
        priority,
      });
      setFormData({
        title: '',
        description: '',
        status: 'Pending',
        dueDate: '',
      });
    }
  };

  const handleStatusChange = (taskId: string, newStatus: 'Pending' | 'In Progress' | 'Completed') => {
    const taskToUpdate = tasks.find((task) => task.id === taskId);
    if (taskToUpdate) {
      updateTask({ ...taskToUpdate, status: newStatus });
    }
  };

  const handleDeleteTask = (taskId: string) => {
    removeTask(taskId);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  const filteredTasks = tasks.filter((task) => {
    const matchesStatus = filterStatus === 'All' || task.status === filterStatus;
    const matchesPriority = filterPriority === 'All' || task.priority === filterPriority;
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesPriority && matchesSearch;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    switch (sortBy) {
      case 'Due Date':
        return new Date(a.dueDate || '').getTime() - new Date(b.dueDate || '').getTime();
      case 'Priority':
        const priorityOrder = { Low: 0, Medium: 1, High: 2 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      case 'Status':
        const statusOrder = { Pending: 0, 'In Progress': 1, Completed: 2 };
        return statusOrder[a.status] - statusOrder[b.status];
      default:
        return 0;
    }
  });

  const handleToggleTheme = () => {
    const newTheme = isbgDark === 'dark' ? 'light' : 'dark';
    setIsbgDark(newTheme);
    console.log('Toggling to:', newTheme);
  };

  const getThemeStyles = () => {
    if (isbgDark === 'dark') {
      return {
        backgroundColor: '#2c2c2c',
        foregroundColor: '#ededed',
        sidebarBg: '#3a3a3a',
      };
    } else {
      return {
        backgroundColor: '#ffffff',
        foregroundColor: '#000000',
        sidebarBg: '#f0f0f0',
      };
    }
  };

  const themeStyles = getThemeStyles();

  return (
    <div className="lg:h-[100vh] sm:h-full w-full container mx-auto p-4 flex flex-col justify-center " style={{backgroundColor: themeStyles.backgroundColor,  color: themeStyles.foregroundColor }}>
      <h1 className="text-2xl font-bold mb-4 text-center" style={{ color: themeStyles.foregroundColor }}>Todo List</h1>
      <div className="h-[100%] flex flex-col lg:flex-row items-center justify-evenly gap-6">
        <div className="w-full lg:w-1/2 border py-20 px-4 rounded" style={{ borderRadius: '100px', backdropFilter: 'blur(10px)', backgroundColor: themeStyles.backgroundColor }}>
          <h1 style={{ fontSize: '4rem', textAlign: 'center', color: themeStyles.foregroundColor }}>Have a Plan?</h1>
          <div className="flex flex-col items-center gap-3">
            <div className="flex flex-col p-3 w-full">
              <input
                type="text"
                name="title"
                value={formdata.title}
                onChange={handleInputChange}
                className="py-2 px-4 border-b focus:outline-none"
                placeholder="Add Title"
                style={{ backgroundColor: themeStyles.backgroundColor, color: themeStyles.foregroundColor, borderColor: themeStyles.foregroundColor }}
              />
              <input
                type="text"
                name="description"
                value={formdata.description}
                onChange={handleInputChange}
                className="py-2 px-4 focus:outline-none"
                placeholder="Add Description"
                style={{ backgroundColor: themeStyles.backgroundColor, color: themeStyles.foregroundColor, borderColor: themeStyles.foregroundColor }}
              />
            </div>
            <input
              type="date"
              name="dueDate"
              value={formdata.dueDate ? new Date(formdata.dueDate).toISOString().split('T')[0] : ''}
              onChange={handleInputChange}
              className="p-2 border rounded w-full focus:outline-none"
              style={{ backgroundColor: themeStyles.backgroundColor, color: themeStyles.foregroundColor, borderColor: themeStyles.foregroundColor }}
            />
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as 'Low' | 'Medium' | 'High')}
              className="p-2 border rounded w-full focus:outline-none"
              style={{ backgroundColor: themeStyles.backgroundColor, color: themeStyles.foregroundColor, borderColor: themeStyles.foregroundColor }}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
            <button
              onClick={handleAddTask}
              className="p-2 bg-blue-500 text-white rounded w-full hover:bg-blue-600 transition"
              style={{ backgroundColor: isbgDark === 'dark' ? '#3b82f6' : '#1d4ed8' }}
            >
              Add
            </button>
          </div>
        </div>

        <div className="w-full h-[95%] lg:w-1/2 space-y-4 p-5 overflow-scroll border" style={{ backgroundColor: themeStyles.backgroundColor, color: themeStyles.foregroundColor }}>
          <div className="w-full p-2 rounded" style={{ backgroundColor: isbgDark === 'dark' ? '#4a4a4a' : '#e0e0e0' }}>
            <header className="w-full flex justify-between items-center relative">
              <button
                onClick={() => setOpen(!open)}
                className="p-2 text-gray-700 focus:outline-none rounded-full hover:bg-gray-200 transition"
                style={{ color: themeStyles.foregroundColor }}
              >
                {open ? <X size={24} /> : <Menu size={24} />}
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleToggleTheme}
                  className="p-2 rounded-full focus:outline-none toggle-button"
                  style={{
                    backgroundColor: isbgDark === 'dark' ? '#c7bdbdff' : '#000000ff',
                    transition: 'background-color 0.3s',
                  }}
                >
                  {isbgDark === 'dark' ? <ToggleLeft size={20} /> : <ToggleRight size={20} />}
                </button>
                <input
                  type="search"
                  placeholder="Search by title"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="p-2 rounded border focus:outline-none w-full max-w-xs"
                  style={{ backgroundColor: themeStyles.backgroundColor, color: themeStyles.foregroundColor, borderColor: themeStyles.foregroundColor }}
                />
              </div>
              {open && (
                <div
                  ref={sidebarRef}
                  className="absolute top-10 left-0 w-52 p-4 rounded shadow-lg z-10"
                  style={{ backgroundColor: themeStyles.sidebarBg, color: themeStyles.foregroundColor, border: `1px solid ${isbgDark === 'dark' ? '#555' : '#ccc'}` }}
                >
                  <h2 className="text-lg font-bold mb-2">Filter</h2>
                  <div className="mb-4">
                    <h3 className="font-bold mb-2">By Status</h3>
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="w-full p-1 border rounded focus:outline-none"
                      style={{ backgroundColor: themeStyles.sidebarBg, color: themeStyles.foregroundColor, borderColor: themeStyles.foregroundColor }}
                    >
                      <option value="All">All</option>
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                    <h3 className="font-bold mt-2 mb-2">By Priority</h3>
                    <select
                      value={filterPriority}
                      onChange={(e) => setFilterPriority(e.target.value)}
                      className="w-full p-1 border rounded focus:outline-none"
                      style={{ backgroundColor: themeStyles.sidebarBg, color: themeStyles.foregroundColor, borderColor: themeStyles.foregroundColor }}
                    >
                      <option value="All">All</option>
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                  <h3 className="font-bold mb-2">Sort</h3>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full p-1 border rounded focus:outline-none"
                    style={{ backgroundColor: themeStyles.sidebarBg, color: themeStyles.foregroundColor, borderColor: themeStyles.foregroundColor }}
                  >
                    <option value="Due Date">Due Date</option>
                    <option value="Priority">Priority</option>
                    <option value="Status">Status</option>
                  </select>
                </div>
              )}
            </header>
          </div>
          <div className="w-full max-w-3xl mx-auto px-4 mt-6">
            {tasks.length === 0 ? (
              <div className="flex flex-col justify-center items-center h-[50vh]">
                <h1 className="text-center text-xl font-bold" style={{ color: themeStyles.foregroundColor, fontSize: '4rem' }}>Add Task</h1>
              </div>
            ) : (
              <>
                <h1 className="text-center font-bold text-2xl mb-4" style={{ color: themeStyles.foregroundColor }}>Your Tasks</h1>
                <ul className="space-y-4">
                  {sortedTasks.map((task) => (
                    <li
                      key={task.id}
                      className="border rounded-lg p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3"
                      style={{ backgroundColor: themeStyles.backgroundColor, color: themeStyles.foregroundColor }}
                    >
                      <div className="flex flex-col text-sm sm:text-base">
                        <strong className="mb-1">{task.title}</strong>
                        <span className="mb-1">{task.description}</span>
                        <span className="text-sm">
                          {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No Date'}
                        </span>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
                        <select
                          className="p-2 border rounded-md text-sm focus:outline-none"
                          value={task.status}
                          onChange={(e) =>
                            handleStatusChange(task.id, e.target.value as 'Pending' | 'In Progress' | 'Completed')
                          }
                          style={{ backgroundColor: themeStyles.backgroundColor, color: themeStyles.foregroundColor, borderColor: themeStyles.foregroundColor }}
                        >
                          <option value="Pending">Pending</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Completed">Completed</option>
                        </select>
                        <button
                          onClick={() => handleDeleteTask(task.id)}
                          className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-md text-sm transition"
                          style={{ backgroundColor: isbgDark === 'dark' ? '#dc2626' : '#ef4444' }}
                        >
                          Delete
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}