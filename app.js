import React, { useState } from "react";
import {
  Plus,
  Trash2,
  Edit3,
  Search,
  List,
  BarChart3,
  CalendarDays,
  Circle,
  Users,
  Briefcase,
  LogOut,
  User,
  Shield,
} from "lucide-react";

const TaskManagementApp = () => {
  // Authentication state
  const [currentUser, setCurrentUser] = useState(null);
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });

  // Sample users with credentials
  const users = [
    {
      id: 1,
      username: "john.doe",
      password: "password123",
      name: "John Doe",
      role: "user",
    },
    {
      id: 2,
      username: "jane.smith",
      password: "password123",
      name: "Jane Smith",
      role: "user",
    },
    {
      id: 3,
      username: "mike.johnson",
      password: "password123",
      name: "Mike Johnson",
      role: "user",
    },
    {
      id: 4,
      username: "sarah.wilson",
      password: "password123",
      name: "Sarah Wilson",
      role: "user",
    },
    {
      id: 5,
      username: "admin",
      password: "admin123",
      name: "Admin User",
      role: "admin",
    },
  ];

  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: "Design Landing Page",
      description: "Create responsive landing page mockups",
      project: "Website Redesign",
      assignedTo: "John Doe",
      createdBy: 1,
      startDate: "2025-06-11",
      startTime: "09:00",
      endDate: "2025-06-11",
      endTime: "17:00",
      status: "in-progress",
      priority: "high",
      submittedToAdmin: false,
      planStatus: "draft",
    },
    {
      id: 2,
      title: "API Integration",
      description: "Integrate payment gateway API",
      project: "E-commerce Platform",
      assignedTo: "Jane Smith",
      createdBy: 2,
      startDate: "2025-06-12",
      startTime: "10:00",
      endDate: "2025-06-12",
      endTime: "16:00",
      status: "todo",
      priority: "medium",
      submittedToAdmin: true,
      planStatus: "submitted",
    },
    {
      id: 3,
      title: "Database Migration",
      description: "Migrate legacy data to new schema",
      project: "E-commerce Platform",
      assignedTo: "John Doe",
      createdBy: 1,
      startDate: "2025-06-13",
      startTime: "08:00",
      endDate: "2025-06-13",
      endTime: "16:00",
      status: "todo",
      priority: "high",
      submittedToAdmin: true,
      planStatus: "approved",
    },
    {
      id: 4,
      title: "User Testing",
      description: "Conduct user testing sessions",
      project: "Website Redesign",
      assignedTo: "Mike Johnson",
      createdBy: 3,
      startDate: "2025-06-14",
      startTime: "14:00",
      endDate: "2025-06-14",
      endTime: "18:00",
      status: "todo",
      priority: "medium",
      submittedToAdmin: false,
      planStatus: "draft",
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterProject, setFilterProject] = useState("all");
  const [currentView, setCurrentView] = useState("calendar");
  const [planView, setPlanView] = useState("task");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    project: "",
    assignedTo: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    priority: "medium",
    status: "todo",
    planStatus: "draft",
  });

  // Login handler
  const handleLogin = (e) => {
    e.preventDefault();
    const user = users.find(
      (u) =>
        u.username === loginForm.username && u.password === loginForm.password
    );
    if (user) {
      setCurrentUser(user);
      setLoginForm({ username: "", password: "" });
    } else {
      alert("Invalid credentials");
    }
  };

  // Logout handler
  const handleLogout = () => {
    setCurrentUser(null);
    setShowModal(false);
    setEditingTask(null);
    resetForm();
  };

  // Get filtered tasks based on user role
  const getFilteredTasks = () => {
    if (!currentUser) return [];

    let userTasks = tasks;

    // Regular users only see their own tasks
    if (currentUser.role === "user") {
      userTasks = tasks.filter((task) => task.createdBy === currentUser.id);
    }
    // Admins see all tasks

    // Apply search and project filters
    return userTasks.filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.project.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (task.assignedTo &&
          task.assignedTo.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesProject =
        filterProject === "all" || task.project === filterProject;
      return matchesSearch && matchesProject;
    });
  };

  const filteredTasks = getFilteredTasks();
  const allUsers = users.map((u) => u.name);
  const projects = [...new Set(tasks.map((task) => task.project))];

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      project: "",
      assignedTo: "",
      startDate: "",
      startTime: "",
      endDate: "",
      endTime: "",
      priority: "medium",
      status: "todo",
      planStatus: "draft",
    });
  };

  const handleSubmit = () => {
    if (editingTask) {
      setTasks(
        tasks.map((task) =>
          task.id === editingTask.id ? { ...task, ...formData } : task
        )
      );
      setEditingTask(null);
    } else {
      const newTask = {
        id: Date.now(),
        ...formData,
        createdBy: currentUser.id,
        submittedToAdmin: false,
      };
      setTasks([...tasks, newTask]);
    }
    resetForm();
    setShowModal(false);
  };

  const handleEdit = (task) => {
    // Users can only edit their own tasks, admins can edit any task
    if (currentUser.role === "user" && task.createdBy !== currentUser.id) {
      alert("You can only edit your own tasks");
      return;
    }

    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description,
      project: task.project,
      assignedTo: task.assignedTo || "",
      startDate: task.startDate,
      startTime: task.startTime || "",
      endDate: task.endDate,
      endTime: task.endTime || "",
      priority: task.priority,
      status: task.status,
      planStatus: task.planStatus || "draft",
    });
    setShowModal(true);
  };

  const handleSubmitPlan = (taskId) => {
    const task = tasks.find((t) => t.id === taskId);
    if (currentUser.role === "user" && task.createdBy !== currentUser.id) {
      alert("You can only submit your own tasks");
      return;
    }

    setTasks(
      tasks.map((task) =>
        task.id === taskId
          ? { ...task, submittedToAdmin: true, planStatus: "submitted" }
          : task
      )
    );
  };

  const handleApprovePlan = (taskId) => {
    if (currentUser.role !== "admin") {
      alert("Only admins can approve plans");
      return;
    }

    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, planStatus: "approved" } : task
      )
    );
  };

  const handleRejectPlan = (taskId) => {
    if (currentUser.role !== "admin") {
      alert("Only admins can reject plans");
      return;
    }

    setTasks(
      tasks.map((task) =>
        task.id === taskId
          ? { ...task, planStatus: "rejected", submittedToAdmin: false }
          : task
      )
    );
  };

  const handleDelete = (id) => {
    const task = tasks.find((t) => t.id === id);
    if (currentUser.role === "user" && task.createdBy !== currentUser.id) {
      alert("You can only delete your own tasks");
      return;
    }

    setTasks(tasks.filter((task) => task.id !== id));
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "border-l-red-500";
      case "medium":
        return "border-l-yellow-500";
      case "low":
        return "border-l-green-500";
      default:
        return "border-l-gray-500";
    }
  };

  const getProjectColor = (project) => {
    const colors = [
      "bg-blue-100 text-blue-700",
      "bg-green-100 text-green-700",
      "bg-purple-100 text-purple-700",
      "bg-orange-100 text-orange-700",
      "bg-pink-100 text-pink-700",
      "bg-indigo-100 text-indigo-700",
    ];
    const index =
      Math.abs(
        project?.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
      ) % colors.length;
    return colors[index];
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not set";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getPlanStatusColor = (status) => {
    switch (status) {
      case "draft":
        return "bg-gray-100 text-gray-700";
      case "submitted":
        return "bg-blue-100 text-blue-700";
      case "approved":
        return "bg-green-100 text-green-700";
      case "rejected":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // Login Screen
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Briefcase className="text-white" size={24} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Task Management
            </h1>
            <p className="text-gray-600">Sign in to manage your tasks</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <input
                type="text"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={loginForm.username}
                onChange={(e) =>
                  setLoginForm({ ...loginForm, username: e.target.value })
                }
                placeholder="Enter your username"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={loginForm.password}
                onChange={(e) =>
                  setLoginForm({ ...loginForm, password: e.target.value })
                }
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors"
            >
              Sign In
            </button>
          </form>

          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">
              Demo Credentials:
            </h3>
            <div className="text-sm text-gray-600 space-y-1">
              <div>
                <strong>Users:</strong> john.doe, jane.smith, mike.johnson,
                sarah.wilson
              </div>
              <div>
                <strong>Password:</strong> password123
              </div>
              <div className="mt-2">
                <strong>Admin:</strong> admin / admin123
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Planning List View Component
  const PlanningListView = () => {
    const getTasksByView = () => {
      switch (planView) {
        case "user":
          return allUsers
            .map((user) => ({
              name: user,
              tasks: filteredTasks.filter((task) => task.assignedTo === user),
            }))
            .filter((group) => group.tasks.length > 0);

        case "project":
          return projects
            .map((project) => ({
              name: project,
              tasks: filteredTasks.filter((task) => task.project === project),
              users: [
                ...new Set(
                  filteredTasks
                    .filter((task) => task.project === project)
                    .map((task) => task.assignedTo)
                ),
              ],
            }))
            .filter((group) => group.tasks.length > 0);

        default:
          return [{ name: "All Tasks", tasks: filteredTasks }];
      }
    };

    const groupedData = getTasksByView();

    return (
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b bg-gradient-to-r from-indigo-50 to-purple-50">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Task Planning Dashboard
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {currentUser.role === "admin"
                  ? "Manage and approve task plans"
                  : "Manage and submit task plans for approval"}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-white rounded-lg p-1">
                <button
                  onClick={() => setPlanView("task")}
                  className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                    planView === "task"
                      ? "bg-indigo-600 text-white"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  All Tasks
                </button>
                {currentUser.role === "admin" && (
                  <>
                    <button
                      onClick={() => setPlanView("user")}
                      className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                        planView === "user"
                          ? "bg-indigo-600 text-white"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      By User
                    </button>
                    <button
                      onClick={() => setPlanView("project")}
                      className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                        planView === "project"
                          ? "bg-indigo-600 text-white"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      By Project
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          {groupedData.map((group, groupIndex) => (
            <div key={group.name} className={`${groupIndex > 0 ? "mt-8" : ""}`}>
              {planView !== "task" && (
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    {planView === "user" && (
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-sm font-bold">
                        {group.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                    )}
                    {planView === "project" && (
                      <div className="w-3 h-3 bg-purple-500 rounded"></div>
                    )}
                    {group.name}
                  </h3>
                  <div className="text-sm text-gray-500">
                    {group.tasks.length} task
                    {group.tasks.length !== 1 ? "s" : ""}
                    {planView === "project" && group.users && (
                      <span className="ml-2">
                        • {group.users.length} user
                        {group.users.length !== 1 ? "s" : ""}
                      </span>
                    )}
                  </div>
                </div>
              )}

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="text-left p-3 font-semibold text-gray-700">
                        Task
                      </th>
                      <th className="text-left p-3 font-semibold text-gray-700">
                        Project
                      </th>
                      {(planView !== "user" ||
                        currentUser.role === "admin") && (
                        <th className="text-left p-3 font-semibold text-gray-700">
                          Assigned To
                        </th>
                      )}
                      <th className="text-left p-3 font-semibold text-gray-700">
                        Duration
                      </th>
                      <th className="text-left p-3 font-semibold text-gray-700">
                        Status
                      </th>
                      <th className="text-left p-3 font-semibold text-gray-700">
                        Plan Status
                      </th>
                      <th className="text-left p-3 font-semibold text-gray-700">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {group.tasks.map((task) => (
                      <tr
                        key={task.id}
                        className="border-b hover:bg-gray-50 transition-colors"
                      >
                        <td className="p-3">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-1 h-8 rounded ${getPriorityColor(
                                task.priority
                              ).replace("border-l-", "bg-")}`}
                            ></div>
                            <div>
                              <div className="font-medium text-gray-900">
                                {task.title}
                              </div>
                              <div className="text-sm text-gray-600 truncate max-w-xs">
                                {task.description}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="p-3">
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${getProjectColor(
                              task.project
                            )}`}
                          >
                            {task.project}
                          </span>
                        </td>
                        {(planView !== "user" ||
                          currentUser.role === "admin") && (
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xs font-bold">
                                {task.assignedTo
                                  ?.split(" ")
                                  .map((n) => n[0])
                                  .join("") || "?"}
                              </div>
                              <span className="text-sm text-gray-700">
                                {task.assignedTo || "Unassigned"}
                              </span>
                            </div>
                          </td>
                        )}
                        <td className="p-3">
                          <div className="text-sm">
                            <div className="text-gray-900">
                              {formatDate(task.startDate)} -{" "}
                              {formatDate(task.endDate)}
                            </div>
                            <div className="text-gray-500">
                              {task.startTime} - {task.endTime}
                            </div>
                          </div>
                        </td>
                        <td className="p-3">
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              task.status === "completed"
                                ? "bg-green-100 text-green-700"
                                : task.status === "in-progress"
                                ? "bg-blue-100 text-blue-700"
                                : task.status === "review"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {task.status === "in-progress"
                              ? "In Progress"
                              : task.status.charAt(0).toUpperCase() +
                                task.status.slice(1)}
                          </span>
                        </td>
                        <td className="p-3">
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${getPlanStatusColor(
                              task.planStatus
                            )}`}
                          >
                            {task.planStatus?.charAt(0).toUpperCase() +
                              task.planStatus?.slice(1)}
                          </span>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleEdit(task)}
                              className="text-gray-400 hover:text-blue-600 p-1 rounded hover:bg-blue-50 transition-colors"
                              title="Edit task"
                            >
                              <Edit3 size={14} />
                            </button>

                            {currentUser.role === "user" &&
                              task.planStatus === "draft" &&
                              task.createdBy === currentUser.id && (
                                <button
                                  onClick={() => handleSubmitPlan(task.id)}
                                  className="text-xs px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                                >
                                  Submit
                                </button>
                              )}

                            {currentUser.role === "admin" &&
                              task.planStatus === "submitted" && (
                                <div className="flex gap-1">
                                  <button
                                    onClick={() => handleApprovePlan(task.id)}
                                    className="text-xs px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                                  >
                                    Approve
                                  </button>
                                  <button
                                    onClick={() => handleRejectPlan(task.id)}
                                    className="text-xs px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                                  >
                                    Reject
                                  </button>
                                </div>
                              )}

                            <button
                              onClick={() => handleDelete(task.id)}
                              className="text-gray-400 hover:text-red-600 p-1 rounded hover:bg-red-50 transition-colors"
                              title="Delete task"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}

          {groupedData.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <div className="text-lg font-medium mb-2">No tasks found</div>
              <p className="text-sm">
                Create some tasks to get started with planning
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const CalendarView = () => {
    const [currentWeek, setCurrentWeek] = useState(new Date());

    const getWeekStart = (date) => {
      const d = new Date(date);
      const day = d.getDay();
      const diff = d.getDate() - day;
      return new Date(d.setDate(diff));
    };

    const getWeekDays = (startDate) => {
      const days = [];
      for (let i = 0; i < 7; i++) {
        const day = new Date(startDate);
        day.setDate(startDate.getDate() + i);
        days.push(day);
      }
      return days;
    };

    const weekStart = getWeekStart(currentWeek);
    const weekDays = getWeekDays(weekStart);
    const dayNames = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    const goToPreviousWeek = () => {
      const newWeek = new Date(currentWeek);
      newWeek.setDate(newWeek.getDate() - 7);
      setCurrentWeek(newWeek);
    };

    const goToNextWeek = () => {
      const newWeek = new Date(currentWeek);
      newWeek.setDate(newWeek.getDate() + 7);
      setCurrentWeek(newWeek);
    };

    const goToToday = () => {
      setCurrentWeek(new Date());
    };

    const getTasksForDay = (date) => {
      const dateStr = date.toISOString().split("T")[0];
      return filteredTasks
        .filter((task) => task.startDate === dateStr)
        .sort((a, b) =>
          (a.startTime || "00:00").localeCompare(b.startTime || "00:00")
        );
    };

    const isToday = (date) => {
      const today = new Date();
      return date.toDateString() === today.toDateString();
    };

    const getTaskBgColor = (priority) => {
      switch (priority) {
        case "high":
          return "bg-red-500 text-white border-red-600";
        case "medium":
          return "bg-yellow-500 text-gray-900 border-yellow-600";
        case "low":
          return "bg-green-500 text-white border-green-600";
        default:
          return "bg-gray-500 text-white border-gray-600";
      }
    };

    return (
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Weekly Calendar
            </h2>
            <div className="flex items-center gap-3">
              <button
                onClick={goToToday}
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Today
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={goToPreviousWeek}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  ←
                </button>
                <span className="text-sm font-medium min-w-32 text-center">
                  {weekStart.toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })}
                </span>
                <button
                  onClick={goToNextWeek}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  →
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-7">
          {weekDays.map((day, index) => (
            <div
              key={day.toISOString()}
              className="border-r last:border-r-0 min-h-96"
            >
              <div
                className={`p-4 text-center border-b ${
                  isToday(day) ? "bg-blue-50" : "bg-gray-50"
                }`}
              >
                <div className="text-sm font-medium text-gray-600 mb-1">
                  {dayNames[index]}
                </div>
                <div
                  className={`text-xl font-bold ${
                    isToday(day) ? "text-blue-600" : "text-gray-900"
                  }`}
                >
                  {day.getDate()}
                </div>
              </div>

              <div
                className={`p-3 space-y-3 ${
                  isToday(day) ? "bg-blue-25" : "bg-white"
                }`}
              >
                {getTasksForDay(day).map((task) => (
                  <div
                    key={task.id}
                    className={`p-3 rounded-lg border-2 ${getTaskBgColor(
                      task.priority
                    )} shadow-md cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-200`}
                    onClick={() => handleEdit(task)}
                  >
                    <div className="font-semibold text-sm mb-2 leading-tight">
                      {task.title}
                    </div>
                    <div className="text-xs opacity-90 mb-1">
                      {task.project}
                    </div>
                    {task.assignedTo && (
                      <div className="text-xs opacity-75 mb-1">
                        👤 {task.assignedTo}
                      </div>
                    )}
                    <div className="text-xs opacity-80">
                      {task.startTime} - {task.endTime}
                    </div>
                    <div className="text-xs opacity-75 mt-1">
                      {task.status === "in-progress"
                        ? "In Progress"
                        : task.status.charAt(0).toUpperCase() +
                          task.status.slice(1)}
                    </div>
                  </div>
                ))}

                {getTasksForDay(day).length === 0 && (
                  <div className="text-center py-8 text-gray-400">
                    <div className="text-sm">No tasks</div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const ListView = () => {
    // Categorize tasks by due date for better organization
    const categorizeTasksByDueDate = () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const categories = {
        overdue: {
          title: "Overdue",
          tasks: [],
          color: "bg-red-50 border-red-200",
          headerColor: "bg-red-100 text-red-800",
        },
        today: {
          title: "Due Today",
          tasks: [],
          color: "bg-orange-50 border-orange-200",
          headerColor: "bg-orange-100 text-orange-800",
        },
        tomorrow: {
          title: "Due Tomorrow",
          tasks: [],
          color: "bg-yellow-50 border-yellow-200",
          headerColor: "bg-yellow-100 text-yellow-800",
        },
        thisWeek: {
          title: "Due This Week",
          tasks: [],
          color: "bg-blue-50 border-blue-200",
          headerColor: "bg-blue-100 text-blue-800",
        },
        later: {
          title: "Due Later",
          tasks: [],
          color: "bg-gray-50 border-gray-200",
          headerColor: "bg-gray-100 text-gray-800",
        },
        noDate: {
          title: "No Due Date",
          tasks: [],
          color: "bg-purple-50 border-purple-200",
          headerColor: "bg-purple-100 text-purple-800",
        },
      };

      filteredTasks.forEach((task) => {
        if (!task.endDate) {
          categories.noDate.tasks.push(task);
          return;
        }

        const endDate = new Date(task.endDate);
        endDate.setHours(0, 0, 0, 0);
        const diffTime = endDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 0) {
          categories.overdue.tasks.push(task);
        } else if (diffDays === 0) {
          categories.today.tasks.push(task);
        } else if (diffDays === 1) {
          categories.tomorrow.tasks.push(task);
        } else if (diffDays <= 7) {
          categories.thisWeek.tasks.push(task);
        } else {
          categories.later.tasks.push(task);
        }
      });

      // Sort tasks within each category by priority then by time
      Object.values(categories).forEach((category) => {
        category.tasks.sort((a, b) => {
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          const priorityDiff =
            priorityOrder[b.priority] - priorityOrder[a.priority];
          if (priorityDiff !== 0) return priorityDiff;

          // Then by start time
          return (a.startTime || "00:00").localeCompare(b.startTime || "00:00");
        });
      });

      return categories;
    };

    const taskCategories = categorizeTasksByDueDate();

    // Show different views for admin vs user
    if (currentUser.role === "admin") {
      return (
        <div className="space-y-8">
          {Object.entries(taskCategories).map(([key, category]) => {
            if (category.tasks.length === 0) return null;

            return (
              <div
                key={key}
                className={`bg-white rounded-xl shadow-sm border-2 ${category.color} overflow-hidden`}
              >
                <div className={`px-6 py-4 border-b ${category.headerColor}`}>
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-current opacity-60"></div>
                      {category.title}
                    </h3>
                    <span className="bg-white bg-opacity-70 text-sm px-3 py-1 rounded-full font-semibold">
                      {category.tasks.length} task
                      {category.tasks.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-white bg-opacity-50 border-b">
                        <th className="text-left p-4 font-semibold text-gray-700">
                          Task
                        </th>
                        <th className="text-left p-4 font-semibold text-gray-700">
                          Project
                        </th>
                        <th className="text-left p-4 font-semibold text-gray-700">
                          Assigned To
                        </th>
                        <th className="text-left p-4 font-semibold text-gray-700">
                          Time
                        </th>
                        <th className="text-left p-4 font-semibold text-gray-700">
                          Status
                        </th>
                        <th className="text-left p-4 font-semibold text-gray-700">
                          Priority
                        </th>
                        <th className="text-left p-4 font-semibold text-gray-700">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {category.tasks.map((task) => (
                        <tr
                          key={task.id}
                          className="border-b border-white border-opacity-50 hover:bg-white hover:bg-opacity-30 transition-colors"
                        >
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-1 h-12 rounded-full ${getPriorityColor(
                                  task.priority
                                ).replace("border-l-", "bg-")}`}
                              ></div>
                              <div>
                                <div className="font-semibold text-gray-900 text-sm">
                                  {task.title}
                                </div>
                                <div className="text-xs text-gray-600 mt-1 max-w-xs truncate">
                                  {task.description}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <span
                              className={`text-xs px-3 py-1 rounded-full font-medium ${getProjectColor(
                                task.project
                              )}`}
                            >
                              {task.project}
                            </span>
                          </td>
                          <td className="p-4">
                            {task.assignedTo ? (
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xs font-bold">
                                  {task.assignedTo
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </div>
                                <span className="text-sm text-gray-700 font-medium">
                                  {task.assignedTo}
                                </span>
                              </div>
                            ) : (
                              <span className="text-sm text-gray-400 italic">
                                Unassigned
                              </span>
                            )}
                          </td>
                          <td className="p-4">
                            <div className="text-sm">
                              <div className="font-medium text-gray-900">
                                {formatDate(task.endDate)}
                              </div>
                              <div className="text-gray-500 text-xs">
                                {task.startTime && task.endTime
                                  ? `${task.startTime} - ${task.endTime}`
                                  : "No time set"}
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <span
                              className={`text-xs px-2 py-1 rounded-full font-medium ${
                                task.status === "completed"
                                  ? "bg-green-100 text-green-700"
                                  : task.status === "in-progress"
                                  ? "bg-blue-100 text-blue-700"
                                  : task.status === "review"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-gray-100 text-gray-700"
                              }`}
                            >
                              {task.status === "in-progress"
                                ? "In Progress"
                                : task.status.charAt(0).toUpperCase() +
                                  task.status.slice(1)}
                            </span>
                          </td>
                          <td className="p-4">
                            <span
                              className={`text-xs px-2 py-1 rounded-full font-medium ${
                                task.priority === "high"
                                  ? "bg-red-100 text-red-700"
                                  : task.priority === "medium"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-green-100 text-green-700"
                              }`}
                            >
                              {task.priority.charAt(0).toUpperCase() +
                                task.priority.slice(1)}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleEdit(task)}
                                className="text-gray-400 hover:text-blue-600 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                                title="Edit task"
                              >
                                <Edit3 size={14} />
                              </button>
                              <button
                                onClick={() => handleDelete(task.id)}
                                className="text-gray-400 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition-colors"
                                title="Delete task"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}

          {filteredTasks.length === 0 && (
            <div className="text-center py-16">
              <div className="bg-white rounded-xl shadow-sm border-2 border-gray-200 p-12">
                <List size={64} className="mx-auto mb-4 text-gray-300" />
                <div className="text-xl font-semibold text-gray-900 mb-2">
                  No tasks found
                </div>
                <p className="text-gray-600">
                  Create some tasks to get started with your project management
                </p>
              </div>
            </div>
          )}
        </div>
      );
    }

    // User view - keep the card layout for better mobile experience
    const sortedTasks = filteredTasks.sort((a, b) => {
      // Sort by due date first, then by priority
      const dateA = new Date(a.endDate);
      const dateB = new Date(b.endDate);
      if (dateA.getTime() !== dateB.getTime()) {
        return dateA - dateB;
      }
      // Then by priority (high first)
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });

    const getDateBadge = (endDate) => {
      if (!endDate)
        return { text: "No due date", color: "bg-gray-100 text-gray-700" };
      const today = new Date();
      const end = new Date(endDate);
      const diffDays = Math.ceil((end - today) / (1000 * 60 * 60 * 24));

      if (diffDays < 0)
        return { text: "Overdue", color: "bg-red-100 text-red-700" };
      if (diffDays === 0)
        return { text: "Due Today", color: "bg-red-100 text-red-700" };
      if (diffDays === 1)
        return { text: "Due Tomorrow", color: "bg-orange-100 text-orange-700" };
      if (diffDays <= 7)
        return {
          text: `Due in ${diffDays} days`,
          color: "bg-yellow-100 text-yellow-700",
        };
      return {
        text: `Due in ${diffDays} days`,
        color: "bg-blue-100 text-blue-700",
      };
    };

    return (
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b bg-gradient-to-r from-gray-50 to-blue-50">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">My Tasks</h2>
              <p className="text-sm text-gray-600 mt-1">
                Your personal task list sorted by priority
              </p>
            </div>
            <div className="text-sm text-gray-500">
              {sortedTasks.length} task{sortedTasks.length !== 1 ? "s" : ""}
            </div>
          </div>
        </div>

        <div className="p-6">
          {sortedTasks.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Circle size={48} className="mx-auto mb-4 opacity-50" />
              <div className="text-lg font-medium mb-2">No tasks found</div>
              <p className="text-sm">Create some tasks to get started</p>
            </div>
          ) : (
            <div className="space-y-4">
              {sortedTasks.map((task) => {
                const dateBadge = getDateBadge(task.endDate);

                return (
                  <div
                    key={task.id}
                    className={`bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200 border-l-4 ${getPriorityColor(
                      task.priority
                    )}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-gray-900 text-lg">
                            {task.title}
                          </h3>
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${dateBadge.color}`}
                          >
                            {dateBadge.text}
                          </span>
                        </div>

                        <p className="text-gray-600 mb-3">{task.description}</p>

                        <div className="flex items-center gap-4 flex-wrap">
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-xs px-2 py-1 rounded-full ${getProjectColor(
                                task.project
                              )}`}
                            >
                              {task.project}
                            </span>
                          </div>

                          {task.assignedTo && (
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xs font-bold">
                                {task.assignedTo
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </div>
                              <span className="text-sm text-gray-700">
                                {task.assignedTo}
                              </span>
                            </div>
                          )}

                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div>
                              <span className="font-medium">Start:</span>{" "}
                              {formatDate(task.startDate)}
                              {task.startTime && (
                                <span className="ml-1">
                                  at {task.startTime}
                                </span>
                              )}
                            </div>
                            <div>
                              <span className="font-medium">End:</span>{" "}
                              {formatDate(task.endDate)}
                              {task.endTime && (
                                <span className="ml-1">at {task.endTime}</span>
                              )}
                            </div>
                          </div>

                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              task.status === "completed"
                                ? "bg-green-100 text-green-700"
                                : task.status === "in-progress"
                                ? "bg-blue-100 text-blue-700"
                                : task.status === "review"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {task.status === "in-progress"
                              ? "In Progress"
                              : task.status.charAt(0).toUpperCase() +
                                task.status.slice(1)}
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => handleEdit(task)}
                          className="text-gray-400 hover:text-blue-600 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                          title="Edit task"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(task.id)}
                          className="text-gray-400 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition-colors"
                          title="Delete task"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  };

  const GanttView = () => {
    const [expandedProjects, setExpandedProjects] = useState(new Set());

    // Group tasks by project first, then by user
    const groupTasksByProjectAndUser = () => {
      const projectGroups = {};

      filteredTasks.forEach((task) => {
        if (!projectGroups[task.project]) {
          projectGroups[task.project] = {};
        }

        const assignedUser = task.assignedTo || "Unassigned";
        if (!projectGroups[task.project][assignedUser]) {
          projectGroups[task.project][assignedUser] = [];
        }

        projectGroups[task.project][assignedUser].push(task);
      });

      // Sort tasks within each user group by start date
      Object.keys(projectGroups).forEach((project) => {
        Object.keys(projectGroups[project]).forEach((user) => {
          projectGroups[project][user].sort(
            (a, b) => new Date(a.startDate) - new Date(b.startDate)
          );
        });
      });

      return projectGroups;
    };

    const groupedData = groupTasksByProjectAndUser();
    const allTasks = filteredTasks.sort(
      (a, b) => new Date(a.startDate) - new Date(b.startDate)
    );

    const startDates = allTasks.map((task) => new Date(task.startDate));
    const endDates = allTasks.map((task) => new Date(task.endDate));
    const minDate =
      startDates.length > 0 ? new Date(Math.min(...startDates)) : new Date();
    const maxDate =
      endDates.length > 0 ? new Date(Math.max(...endDates)) : new Date();

    const bufferedMinDate = new Date(minDate);
    bufferedMinDate.setDate(bufferedMinDate.getDate() - 1);
    const bufferedMaxDate = new Date(maxDate);
    bufferedMaxDate.setDate(bufferedMaxDate.getDate() + 1);

    const dateRange = [];
    let currentDate = new Date(bufferedMinDate);
    while (currentDate <= bufferedMaxDate) {
      dateRange.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    const dayWidth = 60;

    const getTaskPosition = (task) => {
      const taskStart = new Date(task.startDate);
      const taskEnd = new Date(task.endDate);
      const startPos =
        ((taskStart - bufferedMinDate) / (1000 * 60 * 60 * 24)) * dayWidth;
      const duration =
        ((taskEnd - taskStart) / (1000 * 60 * 60 * 24) + 1) * dayWidth;
      return { left: startPos, width: Math.max(duration, dayWidth) };
    };

    const getTaskBgColor = (priority) => {
      switch (priority) {
        case "high":
          return "bg-red-500";
        case "medium":
          return "bg-yellow-500";
        case "low":
          return "bg-green-500";
        default:
          return "bg-gray-500";
      }
    };

    const isToday = (date) => {
      const today = new Date();
      return date.toDateString() === today.toDateString();
    };

    const isWeekend = (date) => {
      const day = date.getDay();
      return day === 0 || day === 6;
    };

    const todayIndex = dateRange.findIndex((date) => isToday(date));
    const todayLinePosition =
      todayIndex >= 0 ? 350 + todayIndex * dayWidth + dayWidth / 2 : -1;

    const toggleProject = (projectName) => {
      const newExpanded = new Set(expandedProjects);
      if (newExpanded.has(projectName)) {
        newExpanded.delete(projectName);
      } else {
        newExpanded.add(projectName);
      }
      setExpandedProjects(newExpanded);
    };

    // If user role, show simple flat view
    if (currentUser.role === "user") {
      return (
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-4 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Gantt Chart</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Your task timeline overview
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded"></div>
                  <span>High</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                  <span>Medium</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded"></div>
                  <span>Low</span>
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto relative">
            <div
              className="flex border-b bg-gray-50 sticky top-0 z-10"
              style={{ minWidth: dateRange.length * dayWidth + 300 }}
            >
              <div className="w-72 p-3 font-semibold text-gray-800 border-r bg-white">
                Tasks ({allTasks.length})
              </div>
              {dateRange.map((date) => {
                const isCurrentDay = isToday(date);
                const isWeekendDay = isWeekend(date);

                return (
                  <div
                    key={date.toISOString()}
                    className={`border-r text-center py-2 ${
                      isCurrentDay
                        ? "bg-blue-100 border-blue-300"
                        : isWeekendDay
                        ? "bg-gray-100"
                        : "bg-white"
                    }`}
                    style={{ width: dayWidth }}
                  >
                    <div
                      className={`text-xs font-medium ${
                        isCurrentDay
                          ? "text-blue-800"
                          : isWeekendDay
                          ? "text-gray-500"
                          : "text-gray-700"
                      }`}
                    >
                      {date.toLocaleDateString("en-US", { weekday: "short" })}
                    </div>
                    <div
                      className={`text-lg font-bold ${
                        isCurrentDay
                          ? "text-blue-600"
                          : isWeekendDay
                          ? "text-gray-400"
                          : "text-gray-900"
                      }`}
                    >
                      {date.getDate()}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="relative">
              {allTasks.map((task, index) => {
                const position = getTaskPosition(task);

                return (
                  <div
                    key={task.id}
                    className={`flex border-b hover:bg-gray-50 transition-colors ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-25"
                    }`}
                    style={{ minWidth: dateRange.length * dayWidth + 300 }}
                  >
                    <div className="w-72 p-3 border-r bg-white">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-sm text-gray-900 mb-1 truncate">
                            {task.title}
                          </div>
                          <div
                            className={`text-xs px-2 py-1 rounded-full inline-block ${getProjectColor(
                              task.project
                            )}`}
                          >
                            {task.project}
                          </div>
                        </div>
                        <div className="flex gap-1 ml-2">
                          <button
                            onClick={() => handleEdit(task)}
                            className="text-gray-400 hover:text-blue-600 p-1 rounded hover:bg-blue-50 transition-colors"
                          >
                            <Edit3 size={12} />
                          </button>
                          <button
                            onClick={() => handleDelete(task.id)}
                            className="text-gray-400 hover:text-red-600 p-1 rounded hover:bg-red-50 transition-colors"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    </div>

                    <div
                      className="relative py-3"
                      style={{ width: dateRange.length * dayWidth }}
                    >
                      <div
                        className={`h-6 rounded shadow-md cursor-pointer hover:shadow-lg transition-all duration-200 ${getTaskBgColor(
                          task.priority
                        )} text-white`}
                        style={{
                          left: position.left,
                          width: position.width,
                          position: "absolute",
                        }}
                        onClick={() => handleEdit(task)}
                      >
                        <div className="flex items-center h-full px-2">
                          <span className="text-xs font-medium truncate">
                            {task.title}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {todayLinePosition > 0 && (
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-20 pointer-events-none"
                  style={{ left: todayLinePosition }}
                >
                  <div className="absolute -top-1 -left-1 w-2 h-2 bg-red-500 rounded-full"></div>
                </div>
              )}
            </div>

            {allTasks.length === 0 && (
              <div className="flex items-center justify-center py-12 text-gray-500">
                <div className="text-center">
                  <BarChart3 size={48} className="mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">No tasks to display</p>
                  <p className="text-sm">
                    Add some tasks to see them in the Gantt chart
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      );
    }

    // Admin hierarchical view: Project -> User -> Tasks
    return (
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-4 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Project Gantt Chart
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Hierarchical project timeline: Project → User → Tasks
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded"></div>
                <span>High</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                <span>Medium</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded"></div>
                <span>Low</span>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto relative">
          <div
            className="flex border-b bg-gray-50 sticky top-0 z-10"
            style={{ minWidth: dateRange.length * dayWidth + 350 }}
          >
            <div className="w-80 p-3 font-semibold text-gray-800 border-r bg-white">
              Project Structure ({Object.keys(groupedData).length} projects)
            </div>
            {dateRange.map((date) => {
              const isCurrentDay = isToday(date);
              const isWeekendDay = isWeekend(date);

              return (
                <div
                  key={date.toISOString()}
                  className={`border-r text-center py-2 ${
                    isCurrentDay
                      ? "bg-blue-100 border-blue-300"
                      : isWeekendDay
                      ? "bg-gray-100"
                      : "bg-white"
                  }`}
                  style={{ width: dayWidth }}
                >
                  <div
                    className={`text-xs font-medium ${
                      isCurrentDay
                        ? "text-blue-800"
                        : isWeekendDay
                        ? "text-gray-500"
                        : "text-gray-700"
                    }`}
                  >
                    {date.toLocaleDateString("en-US", { weekday: "short" })}
                  </div>
                  <div
                    className={`text-lg font-bold ${
                      isCurrentDay
                        ? "text-blue-600"
                        : isWeekendDay
                        ? "text-gray-400"
                        : "text-gray-900"
                    }`}
                  >
                    {date.getDate()}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="relative">
            {Object.entries(groupedData).map(([projectName, userGroups]) => {
              const isExpanded = expandedProjects.has(projectName);
              const totalTasks = Object.values(userGroups).reduce(
                (sum, tasks) => sum + tasks.length,
                0
              );

              return (
                <div key={projectName}>
                  {/* Project Header */}
                  <div
                    className="flex border-b bg-gradient-to-r from-purple-50 to-blue-50 hover:from-purple-100 hover:to-blue-100 transition-colors cursor-pointer"
                    style={{ minWidth: dateRange.length * dayWidth + 350 }}
                    onClick={() => toggleProject(projectName)}
                  >
                    <div className="w-80 p-4 border-r bg-white">
                      <div className="flex items-center gap-3">
                        <button className="text-gray-600 hover:text-gray-800">
                          {isExpanded ? "▼" : "▶"}
                        </button>
                        <div className="w-4 h-4 bg-purple-500 rounded"></div>
                        <div className="flex-1">
                          <div className="font-bold text-gray-900 text-base">
                            {projectName}
                          </div>
                          <div className="text-sm text-gray-600">
                            {Object.keys(userGroups).length} user
                            {Object.keys(userGroups).length !== 1 ? "s" : ""} •{" "}
                            {totalTasks} task{totalTasks !== 1 ? "s" : ""}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      className="relative flex-1"
                      style={{ width: dateRange.length * dayWidth }}
                    >
                      {/* Project timeline bar showing overall span */}
                      {(() => {
                        const projectTasks = Object.values(userGroups).flat();
                        if (projectTasks.length > 0) {
                          const projectStart = new Date(
                            Math.min(
                              ...projectTasks.map(
                                (task) => new Date(task.startDate)
                              )
                            )
                          );
                          const projectEnd = new Date(
                            Math.max(
                              ...projectTasks.map(
                                (task) => new Date(task.endDate)
                              )
                            )
                          );
                          const startPos =
                            ((projectStart - bufferedMinDate) /
                              (1000 * 60 * 60 * 24)) *
                            dayWidth;
                          const duration =
                            ((projectEnd - projectStart) /
                              (1000 * 60 * 60 * 24) +
                              1) *
                            dayWidth;

                          return (
                            <div
                              className="absolute top-1/2 transform -translate-y-1/2 h-3 bg-purple-300 rounded opacity-60"
                              style={{
                                left: startPos,
                                width: Math.max(duration, dayWidth),
                              }}
                            />
                          );
                        }
                        return null;
                      })()}
                    </div>
                  </div>

                  {/* User Groups (only show when expanded) */}
                  {isExpanded &&
                    Object.entries(userGroups).map(([userName, userTasks]) => (
                      <div key={`${projectName}-${userName}`}>
                        {/* User Header */}
                        <div
                          className="flex border-b bg-blue-25 hover:bg-blue-50 transition-colors"
                          style={{
                            minWidth: dateRange.length * dayWidth + 350,
                          }}
                        >
                          <div className="w-80 p-3 border-r bg-white">
                            <div className="flex items-center gap-3 ml-8">
                              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-sm font-bold">
                                {userName === "Unassigned"
                                  ? "?"
                                  : userName
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                              </div>
                              <div className="flex-1">
                                <div className="font-semibold text-gray-900">
                                  {userName}
                                </div>
                                <div className="text-sm text-gray-600">
                                  {userTasks.length} task
                                  {userTasks.length !== 1 ? "s" : ""}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div
                            className="relative flex-1"
                            style={{ width: dateRange.length * dayWidth }}
                          >
                            {/* User timeline bar */}
                            {(() => {
                              const userStart = new Date(
                                Math.min(
                                  ...userTasks.map(
                                    (task) => new Date(task.startDate)
                                  )
                                )
                              );
                              const userEnd = new Date(
                                Math.max(
                                  ...userTasks.map(
                                    (task) => new Date(task.endDate)
                                  )
                                )
                              );
                              const startPos =
                                ((userStart - bufferedMinDate) /
                                  (1000 * 60 * 60 * 24)) *
                                dayWidth;
                              const duration =
                                ((userEnd - userStart) / (1000 * 60 * 60 * 24) +
                                  1) *
                                dayWidth;

                              return (
                                <div
                                  className="absolute top-1/2 transform -translate-y-1/2 h-2 bg-blue-300 rounded opacity-60"
                                  style={{
                                    left: startPos,
                                    width: Math.max(duration, dayWidth),
                                  }}
                                />
                              );
                            })()}
                          </div>
                        </div>

                        {/* Tasks for this user */}
                        {userTasks.map((task, taskIndex) => {
                          const position = getTaskPosition(task);

                          return (
                            <div
                              key={task.id}
                              className={`flex border-b hover:bg-gray-50 transition-colors ${
                                taskIndex % 2 === 0 ? "bg-white" : "bg-gray-25"
                              }`}
                              style={{
                                minWidth: dateRange.length * dayWidth + 350,
                              }}
                            >
                              <div className="w-80 p-3 border-r bg-white">
                                <div className="flex items-start gap-2 ml-16">
                                  <div
                                    className={`w-1 h-8 rounded mt-1 ${getPriorityColor(
                                      task.priority
                                    ).replace("border-l-", "bg-")}`}
                                  ></div>
                                  <div className="flex-1 min-w-0">
                                    <div className="font-medium text-sm text-gray-900 mb-1 truncate">
                                      {task.title}
                                    </div>
                                    <div className="text-xs text-gray-600 truncate">
                                      {task.description}
                                    </div>
                                    <div className="flex items-center gap-2 mt-1">
                                      <span
                                        className={`text-xs px-2 py-0.5 rounded-full ${
                                          task.status === "completed"
                                            ? "bg-green-100 text-green-700"
                                            : task.status === "in-progress"
                                            ? "bg-blue-100 text-blue-700"
                                            : task.status === "review"
                                            ? "bg-yellow-100 text-yellow-700"
                                            : "bg-gray-100 text-gray-700"
                                        }`}
                                      >
                                        {task.status === "in-progress"
                                          ? "In Progress"
                                          : task.status
                                              .charAt(0)
                                              .toUpperCase() +
                                            task.status.slice(1)}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="flex gap-1">
                                    <button
                                      onClick={() => handleEdit(task)}
                                      className="text-gray-400 hover:text-blue-600 p-1 rounded hover:bg-blue-50 transition-colors"
                                    >
                                      <Edit3 size={12} />
                                    </button>
                                    <button
                                      onClick={() => handleDelete(task.id)}
                                      className="text-gray-400 hover:text-red-600 p-1 rounded hover:bg-red-50 transition-colors"
                                    >
                                      <Trash2 size={12} />
                                    </button>
                                  </div>
                                </div>
                              </div>

                              <div
                                className="relative py-3"
                                style={{ width: dateRange.length * dayWidth }}
                              >
                                <div
                                  className={`h-6 rounded shadow-md cursor-pointer hover:shadow-lg transition-all duration-200 ${getTaskBgColor(
                                    task.priority
                                  )} text-white`}
                                  style={{
                                    left: position.left,
                                    width: position.width,
                                    position: "absolute",
                                  }}
                                  onClick={() => handleEdit(task)}
                                >
                                  <div className="flex items-center h-full px-2">
                                    <span className="text-xs font-medium truncate">
                                      {task.title}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ))}
                </div>
              );
            })}

            {todayLinePosition > 0 && (
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-20 pointer-events-none"
                style={{ left: todayLinePosition }}
              >
                <div className="absolute -top-1 -left-1 w-2 h-2 bg-red-500 rounded-full"></div>
              </div>
            )}
          </div>

          {Object.keys(groupedData).length === 0 && (
            <div className="flex items-center justify-center py-12 text-gray-500">
              <div className="text-center">
                <BarChart3 size={48} className="mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">No tasks to display</p>
                <p className="text-sm">
                  Add some tasks to see them in the Gantt chart
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Main Dashboard
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Task Management Board
                </h1>
                <p className="text-gray-600 mt-1">
                  {currentUser.role === "admin"
                    ? "Admin Dashboard - Manage all tasks"
                    : `Welcome ${currentUser.name} - Manage your tasks`}
                </p>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 rounded-lg">
                {currentUser.role === "admin" ? (
                  <Shield size={16} className="text-blue-600" />
                ) : (
                  <User size={16} className="text-blue-600" />
                )}
                <span className="text-sm font-medium text-blue-700">
                  {currentUser.role === "admin" ? "Admin" : "User"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  resetForm();
                  setEditingTask(null);
                  setShowModal(true);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <Plus size={20} />
                Add Task
              </button>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mt-6">
            <div className="relative flex-1">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search tasks or projects..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={filterProject}
              onChange={(e) => setFilterProject(e.target.value)}
            >
              <option value="all">All Projects</option>
              {projects.map((project) => (
                <option key={project} value={project}>
                  {project}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-1 mt-6 bg-gray-100 p-1 rounded-lg w-fit">
            {currentUser.role === "user" && (
              <button
                onClick={() => setCurrentView("calendar")}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentView === "calendar"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <CalendarDays size={16} />
                Calendar
              </button>
            )}
            <button
              onClick={() => setCurrentView("list")}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                currentView === "list"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <List size={16} />
              List
            </button>
            <button
              onClick={() => setCurrentView("gantt")}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                currentView === "gantt"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <BarChart3 size={16} />
              Gantt
            </button>
            <button
              onClick={() => setCurrentView("planning")}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                currentView === "planning"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Briefcase size={16} />
              Planning
            </button>
          </div>

          {/* Task Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-blue-600 font-semibold text-sm">
                Total Tasks
              </div>
              <div className="text-2xl font-bold text-blue-800">
                {filteredTasks.length}
              </div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="text-yellow-600 font-semibold text-sm">
                In Progress
              </div>
              <div className="text-2xl font-bold text-yellow-800">
                {filteredTasks.filter((t) => t.status === "in-progress").length}
              </div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-green-600 font-semibold text-sm">
                Completed
              </div>
              <div className="text-2xl font-bold text-green-800">
                {filteredTasks.filter((t) => t.status === "completed").length}
              </div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-purple-600 font-semibold text-sm">
                Pending Approval
              </div>
              <div className="text-2xl font-bold text-purple-800">
                {
                  filteredTasks.filter((t) => t.planStatus === "submitted")
                    .length
                }
              </div>
            </div>
          </div>
        </div>

        {currentUser.role === "user" && currentView === "calendar" && (
          <CalendarView />
        )}
        {currentView === "list" && <ListView />}
        {currentView === "gantt" && <GanttView />}
        {currentView === "planning" && <PlanningListView />}

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-90vh overflow-y-auto">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  {editingTask ? "Edit Task" : "Create New Task"}
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows="3"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Assigned To
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={formData.assignedTo}
                      onChange={(e) =>
                        setFormData({ ...formData, assignedTo: e.target.value })
                      }
                    >
                      <option value="">Select user...</option>
                      {allUsers.map((user) => (
                        <option key={user} value={user}>
                          {user}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Project
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={formData.project}
                      onChange={(e) =>
                        setFormData({ ...formData, project: e.target.value })
                      }
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Start Date
                      </label>
                      <input
                        type="date"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={formData.startDate}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            startDate: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Start Time
                      </label>
                      <input
                        type="time"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={formData.startTime}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            startTime: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        End Date
                      </label>
                      <input
                        type="date"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={formData.endDate}
                        onChange={(e) =>
                          setFormData({ ...formData, endDate: e.target.value })
                        }
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        End Time
                      </label>
                      <input
                        type="time"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={formData.endTime}
                        onChange={(e) =>
                          setFormData({ ...formData, endTime: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({ ...formData, status: e.target.value })
                      }
                    >
                      <option value="todo">To Do</option>
                      <option value="in-progress">In Progress</option>
                      <option value="review">Review</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Priority
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={formData.priority}
                      onChange={(e) =>
                        setFormData({ ...formData, priority: e.target.value })
                      }
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowModal(false);
                        setEditingTask(null);
                        resetForm();
                      }}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSubmit}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      {editingTask ? "Update Task" : "Create Task"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskManagementApp;
