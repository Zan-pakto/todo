import { useState, useEffect } from 'react'

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'active', 'completed'
  const [isFormExpanded, setIsFormExpanded] = useState(false);

  const API_URL = 'http://localhost/backend/tasks.php';

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(API_URL);
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addTask = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTask),
      });
      const data = await response.json();
      setTasks([data, ...tasks]);
      setNewTask({ title: '', description: '' });
      setIsFormExpanded(false);
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const toggleTask = async (task) => {
    try {
      const response = await fetch(API_URL, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: task.id,
          completed: !task.completed,
        }),
      });
      const updatedTask = await response.json();
      setTasks(tasks.map(t => t.id === task.id ? updatedTask : t));
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await fetch(`${API_URL}?id=${taskId}`, {
        method: 'DELETE',
      });
      setTasks(tasks.filter(task => task.id !== taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.completed).length,
    active: tasks.filter(t => !t.completed).length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Task Management
          </h1>
          <p className="mt-4 text-xl text-gray-600">
            Organize your tasks efficiently
          </p>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-4 rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105">
            <div className="text-sm font-medium text-gray-500">Total Tasks</div>
            <div className="mt-2 text-3xl font-bold text-indigo-600">{stats.total}</div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105">
            <div className="text-sm font-medium text-gray-500">Active Tasks</div>
            <div className="mt-2 text-3xl font-bold text-green-600">{stats.active}</div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105">
            <div className="text-sm font-medium text-gray-500">Completed Tasks</div>
            <div className="mt-2 text-3xl font-bold text-purple-600">{stats.completed}</div>
          </div>
        </div>
        
        {/* Add Task Button */}
        {!isFormExpanded && (
          <button
            onClick={() => setIsFormExpanded(true)}
            className="w-full mb-8 bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-3 px-6 rounded-xl font-medium hover:from-indigo-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
          >
            <div className="flex items-center justify-center space-x-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              <span>Add New Task</span>
            </div>
          </button>
        )}

        {/* Task Form */}
        {isFormExpanded && (
          <form onSubmit={addTask} className="bg-white p-6 rounded-2xl shadow-xl mb-8 transform transition-all duration-300 hover:shadow-2xl">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800">Add New Task</h2>
                <button
                  type="button"
                  onClick={() => setIsFormExpanded(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Task Title
                </label>
                <input
                  id="title"
                  type="text"
                  placeholder="Enter task title"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  placeholder="Enter task description"
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 min-h-[120px] resize-y"
                />
              </div>
              <button 
                type="submit"
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-3 px-6 rounded-lg font-medium hover:from-indigo-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              >
                Add Task
              </button>
            </div>
          </form>
        )}

        {/* Filter Buttons */}
        <div className="flex space-x-4 mb-8">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              filter === 'all'
                ? 'bg-indigo-500 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              filter === 'active'
                ? 'bg-green-500 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              filter === 'completed'
                ? 'bg-purple-500 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            Completed
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTasks.map(task => (
              <div 
                key={task.id} 
                className={`bg-white p-6 rounded-xl shadow-lg flex justify-between items-center transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                  task.completed ? 'opacity-75' : ''
                }`}
              >
                <div className="flex-1">
                  <h3 className={`text-lg font-semibold ${
                    task.completed ? 'text-gray-400 line-through' : 'text-gray-800'
                  }`}>
                    {task.title}
                  </h3>
                  <p className={`mt-2 ${
                    task.completed ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {task.description}
                  </p>
                  <div className="mt-2 text-sm text-gray-500">
                    {new Date(task.created_at).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex space-x-3 ml-4">
                  <button
                    onClick={() => toggleTask(task)}
                    className={`p-2 rounded-full transition-all duration-200 ${
                      task.completed 
                        ? 'bg-green-100 text-green-600 hover:bg-green-200' 
                        : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                    }`}
                  >
                    {task.completed ? (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                      </svg>
                    )}
                  </button>
                  <button 
                    onClick={() => deleteTask(task.id)}
                    className="p-2 text-red-500 bg-red-50 rounded-full hover:bg-red-100 transition-colors duration-200"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
            {filteredTasks.length === 0 && (
              <div className="text-center py-12 bg-white rounded-xl shadow-lg">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No tasks found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {filter === 'all' 
                    ? "Get started by creating a new task."
                    : filter === 'active'
                    ? "No active tasks found."
                    : "No completed tasks found."}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default App
