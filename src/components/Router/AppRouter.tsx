import { Route, Routes } from "react-router-dom";
import { TaskProvider } from "../../context/TaskContext";
import { HomePage } from "../../pages/Home/HomePage";
import { TasksPage } from "../../pages/Tasks/TasksPage";
import { ProfilePage } from "../../pages/Profile/ProfilePage";
import { Layout } from "../Layout/Layout";
import { SharedTasksPage } from "../../pages/SharedTasksPage/SharedTasksPage";

export const AppRouter = () => {
  return (
    <TaskProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="tasks" element={<TasksPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="/shared" element={<SharedTasksPage />} />
          <Route path="*" element={<div>404 Not Found</div>} />
        </Route>
      </Routes>
    </TaskProvider>
  );
};
