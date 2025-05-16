import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

export type Task = {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  completed: boolean;
  category: string;
  priority: "low" | "medium" | "high";
  createdAt: string;
  updatedAt: string;
};

type TaskContextType = {
  tasks: Task[];
  categories: string[];
  addTask: (
    task: Omit<Task, "id" | "createdAt" | "updatedAt" | "completed">
  ) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTaskCompletion: (id: string) => void;
  addCategory: (category: string) => void;
  deleteCategory: (category: string) => void;
};

const TaskContext = createContext<TaskContextType | undefined>(undefined);

const getInitialDemoTasks = (): Task[] => {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const nextWeek = new Date(now);
  nextWeek.setDate(nextWeek.getDate() + 7);

  return [
    {
      id: "1",
      title: "Complete project presentation",
      description: "Prepare slides and practice speech",
      dueDate: tomorrow.toISOString(),
      completed: false,
      category: "Work",
      priority: "high",
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    },
    {
      id: "2",
      title: "Buy groceries",
      description: "Milk, eggs, bread, fruits",
      dueDate: now.toISOString(),
      completed: true,
      category: "Shopping",
      priority: "medium",
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    },
    {
      id: "3",
      title: "Morning workout",
      description: "30 minutes of cardio",
      dueDate: now.toISOString(),
      completed: false,
      category: "Personal",
      priority: "low",
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    },
    {
      id: "4",
      title: "Plan weekend trip",
      description: "Research destinations and book hotels",
      dueDate: nextWeek.toISOString(),
      completed: false,
      category: "Personal",
      priority: "medium",
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    },
    {
      id: "5",
      title: "Call mom",
      description: "Wish happy birthday",
      dueDate: now.toISOString(),
      completed: false,
      category: "Personal",
      priority: "high",
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    },
  ];
};

export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const savedTasks = localStorage.getItem("tasks");
    return savedTasks ? JSON.parse(savedTasks) : getInitialDemoTasks();
  });

  const [categories, setCategories] = useState<string[]>(() => {
    const savedCategories = localStorage.getItem("categories");
    return savedCategories
      ? JSON.parse(savedCategories)
      : ["General", "Work", "Personal", "Shopping"];
  });

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("categories", JSON.stringify(categories));
  }, [categories]);

  const addTask = (
    task: Omit<Task, "id" | "createdAt" | "updatedAt" | "completed">
  ) => {
    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setTasks([...tasks, newTask]);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(
      tasks.map((task) =>
        task.id === id
          ? { ...task, ...updates, updatedAt: new Date().toISOString() }
          : task
      )
    );
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const toggleTaskCompletion = (id: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === id
          ? {
              ...task,
              completed: !task.completed,
              updatedAt: new Date().toISOString(),
            }
          : task
      )
    );
  };

  const addCategory = (category: string) => {
    if (!categories.includes(category)) {
      setCategories([...categories, category]);
    }
  };

  const deleteCategory = (category: string) => {
    // Move tasks from deleted category to 'General'
    setTasks(
      tasks.map((task) =>
        task.category === category ? { ...task, category: "General" } : task
      )
    );
    setCategories(categories.filter((c) => c !== category));
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        categories,
        addTask,
        updateTask,
        deleteTask,
        toggleTaskCompletion,
        addCategory,
        deleteCategory,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error("useTasks must be used within a TaskProvider");
  }
  return context;
};
