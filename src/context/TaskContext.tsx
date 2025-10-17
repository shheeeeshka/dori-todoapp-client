import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

export type Subtask = {
  _id: string;
  title: string;
  completed: boolean;
};

export type FileAttachment = {
  _id: string;
  name: string;
  url: string;
  type: string;
  size: number;
};

export type Task = {
  _id: string;
  title: string;
  description: string;
  dueDate: string;
  dueTime?: string | null;
  completed: boolean;
  category: string;
  priority: "low" | "medium" | "high";
  createdAt: string;
  updatedAt: string;
  projectId?: string;
  subtasks?: Subtask[];
  attachments?: FileAttachment[];
};

type TaskContextType = {
  tasks: Task[];
  categories: string[];
  addTask: (
    task: Omit<Task, "_id" | "createdAt" | "updatedAt" | "completed" | "subtasks" | "attachments"> & {
      subtasks?: Subtask[];
    }
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
      _id: "1",
      title: "Meeting with UNGLO",
      description: "Discuss project requirements and timeline",
      dueDate: now.toISOString(),
      dueTime: "14:00",
      completed: false,
      category: "Work",
      priority: "high",
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      projectId: "project1",
      subtasks: [
        { _id: "1-1", title: "Prepare agenda", completed: false },
        { _id: "1-2", title: "Review documents", completed: true }
      ]
    },
    {
      _id: "2",
      title: "Design Review",
      description: "Review mobile app design with team",
      dueDate: now.toISOString(),
      dueTime: "16:30",
      completed: false,
      category: "Design",
      priority: "medium",
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    },
    {
      _id: "3",
      title: "Daily Standup",
      description: "Team daily standup meeting",
      dueDate: now.toISOString(),
      dueTime: "10:00",
      completed: true,
      category: "Work",
      priority: "medium",
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    },
    {
      _id: "4",
      title: "Client Presentation",
      description: "Present final deliverables to client",
      dueDate: tomorrow.toISOString(),
      dueTime: "11:00",
      completed: false,
      category: "Work",
      priority: "high",
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      projectId: "project2",
    },
    {
      _id: "5",
      title: "Code Review",
      description: "Review pull requests and provide feedback",
      dueDate: now.toISOString(),
      dueTime: "15:00",
      completed: false,
      category: "Development",
      priority: "medium",
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    },
    {
      _id: "6",
      title: "Team Lunch",
      description: "Monthly team building lunch",
      dueDate: now.toISOString(),
      dueTime: "13:00",
      completed: false,
      category: "Personal",
      priority: "low",
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    },
    {
      _id: "7",
      title: "Project Planning",
      description: "Plan next sprint and assign tasks",
      dueDate: nextWeek.toISOString(),
      dueTime: "09:00",
      completed: false,
      category: "Work",
      priority: "high",
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      projectId: "project1",
    },
    {
      _id: "8",
      title: "Documentation Update",
      description: "Update project documentation",
      dueDate: now.toISOString(),
      completed: false,
      category: "Documentation",
      priority: "low",
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
      : [
          "Work",
          "Design",
          "Development",
          "Personal",
          "Documentation",
          "General",
        ];
  });

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("categories", JSON.stringify(categories));
  }, [categories]);

  const addTask = (
    task: Omit<Task, "_id" | "createdAt" | "updatedAt" | "completed" | "subtasks" | "attachments"> & {
      subtasks?: Subtask[];
    }
  ) => {
    const newTask: Task = {
      ...task,
      _id: Date.now().toString(),
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      subtasks: task.subtasks || [],
      attachments: [],
    };
    setTasks([...tasks, newTask]);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(
      tasks.map((task) =>
        task._id === id
          ? { ...task, ...updates, updatedAt: new Date().toISOString() }
          : task
      )
    );
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task._id !== id));
  };

  const toggleTaskCompletion = (id: string) => {
    setTasks(
      tasks.map((task) =>
        task._id === id
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