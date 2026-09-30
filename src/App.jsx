import { useEffect, useMemo, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  NavLink,
  Navigate,
  useNavigate,
  useParams,
  Outlet,
  Link,
} from "react-router-dom";
import "./App.css";

/* =========================
   INITIAL TASKS
========================= */

const initialTasks = [
  {
    id: 1,
    header: "Finish React Assignment",
    description:
      "Complete the React Task Manager assignment with routing, dynamic routes and protected routes.",
    priority: "High",
    category: "Academic",
    raisedAt: "2026-09-30T09:30",
    dueDate: "2026-08-28",
    status: "Pending",
  },
  {
    id: 2,
    header: "Prepare Presentation",
    description:
      "Prepare the presentation slides and revise the important topics before submission.",
    priority: "Medium",
    category: "Academic",
    raisedAt: "2026-09-29T14:20",
    dueDate: "2026-10-03",
    status: "Raised",
  },
  {
    id: 3,
    header: "Grocery Shopping",
    description:
      "Buy groceries and household items for the upcoming week.",
    priority: "Low",
    category: "Personal",
    raisedAt: "2026-09-28T17:45",
    dueDate: "2026-10-02",
    status: "Raised",
  },
  {
    id: 4,
    header: "Complete Java Project",
    description:
      "Finish the remaining modules and test all pages of the Java project.",
    priority: "High",
    category: "Academic",
    raisedAt: "2026-09-26T10:10",
    dueDate: "2026-10-01",
    status: "Pending",
  },
  {
    id: 5,
    header: "Organize Study Notes",
    description:
      "Arrange all class notes and important study materials.",
    priority: "Low",
    category: "Personal",
    raisedAt: "2026-09-25T12:30",
    dueDate: "2026-09-27",
    status: "Closed",
  },
];

/* =========================
   APP
========================= */

function App() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("taskflow-tasks");
    return saved ? JSON.parse(saved) : initialTasks;
  });

  const [loggedIn, setLoggedIn] = useState(() => {
    return localStorage.getItem("taskflow-login") === "true";
  });

  useEffect(() => {
    localStorage.setItem("taskflow-tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    if (loggedIn) {
      localStorage.setItem("taskflow-login", "true");
    } else {
      localStorage.removeItem("taskflow-login");
    }
  }, [loggedIn]);

  const addTask = (task) => {
    setTasks((prev) => [
      {
        ...task,
        id: Date.now(),
      },
      ...prev,
    ]);
  };

  const updateTask = (id, updatedTask) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === Number(id)
          ? { ...task, ...updatedTask }
          : task
      )
    );
  };

  const deleteTask = (id) => {
    setTasks((prev) =>
      prev.filter((task) => task.id !== Number(id))
    );
  };

  const completeTask = (id) => {
    updateTask(id, { status: "Closed" });
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            loggedIn ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Login setLoggedIn={setLoggedIn} />
            )
          }
        />

        <Route
          element={
            <ProtectedRoute loggedIn={loggedIn}>
              <Layout
                tasks={tasks}
                loggedIn={loggedIn}
                setLoggedIn={setLoggedIn}
              />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          <Route
            path="/dashboard"
            element={<Dashboard tasks={tasks} />}
          />

          <Route
            path="/tasks"
            element={
              <Tasks
                tasks={tasks}
                deleteTask={deleteTask}
                completeTask={completeTask}
              />
            }
          />

          <Route
            path="/tasks/new"
            element={<AddTask addTask={addTask} />}
          />

          <Route
            path="/tasks/:id"
            element={
              <TaskDetails
                tasks={tasks}
                deleteTask={deleteTask}
                completeTask={completeTask}
              />
            }
          />

          <Route
            path="/tasks/:id/edit"
            element={
              <EditTask
                tasks={tasks}
                updateTask={updateTask}
              />
            }
          />

          <Route
            path="/completed"
            element={<CompletedTasks tasks={tasks} />}
          />

          <Route path="/profile" element={<Profile />} />

          <Route path="/settings" element={<Settings />} />
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

/* =========================
   PROTECTED ROUTE
========================= */

function ProtectedRoute({ loggedIn, children }) {
  if (!loggedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

/* =========================
   LOGIN
========================= */

function Login({ setLoggedIn }) {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setLoggedIn(true);
    navigate("/dashboard");
  };

  return (
    <div className="login-page">
      <div className="login-left">
        <div className="login-brand">
          <div className="brand-mark">✓</div>
          <span>TASKFLOW</span>
        </div>

        <div className="login-content">
          <span className="eyebrow">SMART TASK MANAGEMENT</span>

          <h1>
            Organize your work.
            <br />
            <span>Achieve more.</span>
          </h1>

          <p>
            Manage academic and personal tasks from one simple,
            powerful workspace.
          </p>

          <div className="login-points">
            <div>
              <span>✓</span> Smart task tracking
            </div>
            <div>
              <span>✓</span> Priority & deadline management
            </div>
            <div>
              <span>✓</span> Complete productivity overview
            </div>
          </div>
        </div>
      </div>

      <div className="login-right">
        <form className="login-card" onSubmit={handleLogin}>
          <img
            src="/profile.jpg"
            alt="Profile"
            className="login-avatar"
          />

          <h2>Welcome back</h2>
          <p>Sign in to continue to TaskFlow</p>

          <label>Email Address</label>
          <input
            type="email"
            placeholder="you@example.com"
            required
            defaultValue="student@example.com"
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Enter password"
            required
            defaultValue="123456"
          />

          <button className="primary-btn login-btn">
            Sign In
          </button>

          <small className="demo-note">
            Demo login — any valid email and password will work.
          </small>
        </form>
      </div>
    </div>
  );
}

/* =========================
   LAYOUT
========================= */

function Layout({ tasks, setLoggedIn }) {
  const navigate = useNavigate();

  const logout = () => {
    setLoggedIn(false);
    navigate("/login");
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="brand-mark">✓</div>

          <div>
            <strong>TASKFLOW</strong>
            <span>Task Manager</span>
          </div>
        </div>

        <div className="profile-mini">
          <img src="/profile.jpg" alt="Profile" />

          <div>
            <strong>Ankita</strong>
            <span>Student Account</span>
          </div>

          <span className="online-dot"></span>
        </div>

        <div className="nav-label">WORKSPACE</div>

        <nav className="sidebar-nav">
          <NavLink to="/dashboard">
            <span>▦</span>
            Dashboard
          </NavLink>

          <NavLink to="/tasks">
            <span>☷</span>
            All Tasks
            <b>{tasks.length}</b>
          </NavLink>

          <NavLink to="/tasks/new">
            <span>＋</span>
            Add Task
          </NavLink>

          <NavLink to="/completed">
            <span>✓</span>
            Completed
          </NavLink>
        </nav>

        <div className="nav-label">ACCOUNT</div>

        <nav className="sidebar-nav">
          <NavLink to="/profile">
            <span>◉</span>
            My Profile
          </NavLink>

          <NavLink to="/settings">
            <span>⚙</span>
            Settings
          </NavLink>
        </nav>

        <div className="sidebar-bottom">
          <div className="productivity-card">
            <div className="productivity-icon">⚡</div>
            <strong>Stay productive</strong>
            <p>Keep your tasks organized and on time.</p>
          </div>

          <button className="logout-btn" onClick={logout}>
            <span>↪</span>
            Sign Out
          </button>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <span className="topbar-small">TASK MANAGEMENT</span>
            <h2>My Workspace</h2>
          </div>

          <div className="topbar-actions">
            <button className="notification-btn">
              ♧
              <span></span>
            </button>

            <Link to="/profile" className="top-profile">
              <img src="/profile.jpg" alt="Profile" />
              <div>
                <strong>Ankita</strong>
                <span>Student</span>
              </div>
              <b>⌄</b>
            </Link>
          </div>
        </header>

        <div className="page-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

/* =========================
   DASHBOARD
========================= */

function Dashboard({ tasks }) {
  const navigate = useNavigate();

  const total = tasks.length;
  const raised = tasks.filter((t) => t.status === "Raised").length;
  const pending = tasks.filter((t) => t.status === "Pending").length;
  const closed = tasks.filter((t) => t.status === "Closed").length;

  const completion =
    total === 0 ? 0 : Math.round((closed / total) * 100);

  const upcoming = tasks
    .filter((task) => task.status !== "Closed")
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
    .slice(0, 4);

  const high = tasks.filter((t) => t.priority === "High").length;
  const medium = tasks.filter((t) => t.priority === "Medium").length;
  const low = tasks.filter((t) => t.priority === "Low").length;

  return (
    <>
      <div className="welcome-row">
        <div>
          <span className="eyebrow">OVERVIEW</span>
          <h1>
            Good morning, <span>Ankita</span> 👋
          </h1>
          <p>
            Here&apos;s what&apos;s happening with your tasks today.
          </p>
        </div>

        <button
          className="primary-btn"
          onClick={() => navigate("/tasks/new")}
        >
          ＋ Create New Task
        </button>
      </div>

      <div className="stats-grid">
        <StatCard
          icon="☷"
          number={total}
          title="Total Tasks"
          color="blue"
        />

        <StatCard
          icon="○"
          number={raised}
          title="Raised"
          color="orange"
        />

        <StatCard
          icon="◐"
          number={pending}
          title="Pending"
          color="purple"
        />

        <StatCard
          icon="✓"
          number={closed}
          title="Completed"
          color="green"
        />
      </div>

      <div className="dashboard-grid">
        <section className="panel upcoming-panel">
          <div className="panel-header">
            <div>
              <h3>Upcoming Tasks</h3>
              <p>Your nearest deadlines</p>
            </div>

            <Link to="/tasks">View all →</Link>
          </div>

          <div className="upcoming-list">
            {upcoming.length === 0 ? (
              <EmptyState text="No upcoming tasks." />
            ) : (
              upcoming.map((task) => (
                <Link
                  to={`/tasks/${task.id}`}
                  className="upcoming-item"
                  key={task.id}
                >
                  <div className="task-check">
                    {task.status === "Closed" ? "✓" : ""}
                  </div>

                  <div className="upcoming-info">
                    <strong>{task.header}</strong>

                    <div>
                      <span>{task.category}</span>
                      <span>•</span>
                      <span>
                        Due {formatDate(task.dueDate)}
                      </span>
                    </div>
                  </div>

                  <PriorityBadge priority={task.priority} />

                  <span className="arrow">→</span>
                </Link>
              ))
            )}
          </div>
        </section>

        <section className="panel progress-panel">
          <div className="panel-header">
            <div>
              <h3>Task Progress</h3>
              <p>Overall completion</p>
            </div>
          </div>

          <div className="progress-circle">
            <div>
              <strong>{completion}%</strong>
              <span>Complete</span>
            </div>
          </div>

          <div className="progress-summary">
            <div>
              <span className="legend blue"></span>
              <span>Total Tasks</span>
              <strong>{total}</strong>
            </div>

            <div>
              <span className="legend green"></span>
              <span>Completed</span>
              <strong>{closed}</strong>
            </div>

            <div>
              <span className="legend purple"></span>
              <span>Pending</span>
              <strong>{pending}</strong>
            </div>
          </div>
        </section>
      </div>

      <div className="dashboard-grid bottom-grid">
        <section className="panel">
          <div className="panel-header">
            <div>
              <h3>Priority Overview</h3>
              <p>Tasks grouped by priority</p>
            </div>
          </div>

          <div className="priority-overview">
            <PriorityRow
              label="High"
              value={high}
              total={total}
              type="high"
            />

            <PriorityRow
              label="Medium"
              value={medium}
              total={total}
              type="medium"
            />

            <PriorityRow
              label="Low"
              value={low}
              total={total}
              type="low"
            />
          </div>
        </section>

        <section className="panel activity-panel">
          <div className="panel-header">
            <div>
              <h3>Quick Actions</h3>
              <p>Manage your workflow</p>
            </div>
          </div>

          <div className="quick-actions">
            <Link to="/tasks/new">
              <span>＋</span>
              <div>
                <strong>Create task</strong>
                <small>Add a new task</small>
              </div>
              <b>→</b>
            </Link>

            <Link to="/tasks">
              <span>☷</span>
              <div>
                <strong>View all tasks</strong>
                <small>Browse your workspace</small>
              </div>
              <b>→</b>
            </Link>

            <Link to="/completed">
              <span>✓</span>
              <div>
                <strong>Completed tasks</strong>
                <small>Review finished work</small>
              </div>
              <b>→</b>
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}

/* =========================
   STAT CARD
========================= */

function StatCard({ icon, number, title, color }) {
  return (
    <div className={`stat-card ${color}`}>
      <div className="stat-icon">{icon}</div>

      <div>
        <strong>{number}</strong>
        <span>{title}</span>
      </div>

      <div className="stat-arrow">↗</div>
    </div>
  );
}

/* =========================
   TASKS
========================= */

function Tasks({ tasks, deleteTask, completeTask }) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [priority, setPriority] = useState("All");
  const [category, setCategory] = useState("All");

  const filtered = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch =
        task.header
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        task.description
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesStatus =
        status === "All" || task.status === status;

      const matchesPriority =
        priority === "All" || task.priority === priority;

      const matchesCategory =
        category === "All" || task.category === category;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPriority &&
        matchesCategory
      );
    });
  }, [tasks, search, status, priority, category]);

  return (
    <>
      <PageHeading
        eyebrow="WORKSPACE"
        title="All Tasks"
        description="Create, organize and manage everything you need to get done."
        buttonText="＋ Add New Task"
        buttonLink="/tasks/new"
      />

      <section className="panel task-panel">
        <div className="task-toolbar">
          <div className="search-box">
            <span>⌕</span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tasks..."
            />
          </div>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Raised">Raised</option>
            <option value="Pending">Pending</option>
            <option value="Closed">Closed</option>
          </select>

          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="All">All Priorities</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="All">All Categories</option>
            <option value="Academic">Academic</option>
            <option value="Personal">Personal</option>
          </select>
        </div>

        <div className="task-count">
          Showing <strong>{filtered.length}</strong> of{" "}
          <strong>{tasks.length}</strong> tasks
        </div>

        <div className="task-table-wrap">
          <table className="task-table">
            <thead>
              <tr>
                <th>Task</th>
                <th>Priority</th>
                <th>Category</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((task) => (
                <TaskRow
                  key={task.id}
                  task={task}
                  deleteTask={deleteTask}
                  completeTask={completeTask}
                />
              ))}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <EmptyState text="No tasks match your filters." />
          )}
        </div>
      </section>
    </>
  );
}

/* =========================
   TASK ROW
========================= */

function TaskRow({ task, deleteTask, completeTask }) {
  const navigate = useNavigate();

  const handleDelete = () => {
    if (
      window.confirm(
        `Delete "${task.header}" permanently?`
      )
    ) {
      deleteTask(task.id);
    }
  };

  return (
    <tr>
      <td>
        <div className="table-task">
          <div className={`task-symbol ${task.priority.toLowerCase()}`}>
            {task.priority === "High"
              ? "!"
              : task.priority === "Medium"
              ? "•"
              : "↓"}
          </div>

          <div>
            <Link to={`/tasks/${task.id}`}>
              {task.header}
            </Link>

            <small>
              Raised {formatDateTime(task.raisedAt)}
            </small>
          </div>
        </div>
      </td>

      <td>
        <PriorityBadge priority={task.priority} />
      </td>

      <td>
        <span className="category-text">
          {task.category}
        </span>
      </td>

      <td>
        <span
          className={
            isOverdue(task) ? "due overdue" : "due"
          }
        >
          {formatDate(task.dueDate)}
        </span>
      </td>

      <td>
        <StatusBadge status={task.status} />
      </td>

      <td>
        <div className="row-actions">
          <button
            className="icon-action"
            title="View"
            onClick={() => navigate(`/tasks/${task.id}`)}
          >
            →
          </button>

          <button
            className="icon-action"
            title="Edit"
            onClick={() =>
              navigate(`/tasks/${task.id}/edit`)
            }
          >
            ✎
          </button>

          {task.status !== "Closed" && (
            <button
              className="complete-action"
              onClick={() => completeTask(task.id)}
            >
              ✓
            </button>
          )}

          <button
            className="delete-action"
            onClick={handleDelete}
          >
            ×
          </button>
        </div>
      </td>
    </tr>
  );
}

/* =========================
   ADD TASK
========================= */

function AddTask({ addTask }) {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    header: "",
    description: "",
    priority: "Medium",
    category: "Academic",
    dueDate: "2026-08-28",
    status: "Raised",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.header.trim()) {
      setError("Please enter a task header.");
      return;
    }

    if (!form.description.trim()) {
      setError("Please enter a task description.");
      return;
    }

    addTask({
      ...form,
      raisedAt: new Date().toISOString().slice(0, 16),
    });

    navigate("/tasks");
  };

  return (
    <>
      <PageHeading
        eyebrow="CREATE"
        title="Add New Task"
        description="Create a task and keep your work organized."
      />

      <section className="form-layout">
        <form className="panel task-form" onSubmit={handleSubmit}>
          <div className="form-section-title">
            <span>01</span>
            Task Information
          </div>

          <div className="form-group">
            <label>
              Task Header <i>*</i>
            </label>

            <input
              name="header"
              value={form.header}
              onChange={handleChange}
              placeholder="e.g. Complete React Assignment"
            />
          </div>

          <div className="form-group">
            <label>
              Task Description <i>*</i>
            </label>

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe what needs to be completed..."
              rows="5"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Priority</label>

              <select
                name="priority"
                value={form.priority}
                onChange={handleChange}
              >
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
            </div>

            <div className="form-group">
              <label>Category</label>

              <select
                name="category"
                value={form.category}
                onChange={handleChange}
              >
                <option>Academic</option>
                <option>Personal</option>
              </select>
            </div>
          </div>

          <div className="form-section-title second">
            <span>02</span>
            Schedule & Status
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Raised Date & Time</label>

              <input
                value={formatDateTime(
                  new Date().toISOString().slice(0, 16)
                )}
                readOnly
              />

              <small className="helper">
                Automatically generated when task is created.
              </small>
            </div>

            <div className="form-group">
              <label>Due Date</label>

              <input
                type="date"
                name="dueDate"
                value={form.dueDate}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Status</label>

            <select
              name="status"
              value={form.status}
              onChange={handleChange}
            >
              <option>Raised</option>
              <option>Pending</option>
              <option>Closed</option>
            </select>
          </div>

          {error && <div className="form-error">{error}</div>}

          <div className="form-actions">
            <button
              type="button"
              className="secondary-btn"
              onClick={() => navigate("/tasks")}
            >
              Cancel
            </button>

            <button className="primary-btn">
              ✓ Create Task
            </button>
          </div>
        </form>

        <div className="form-side">
          <div className="info-card">
            <div className="info-icon">💡</div>

            <h3>TaskFlow tip</h3>

            <p>
              Set the correct priority and deadline so you
              can focus on the most important work first.
            </p>
          </div>

          <div className="mini-preview">
            <span>LIVE PREVIEW</span>

            <div className="preview-task">
              <div className="task-symbol medium">•</div>

              <div>
                <strong>
                  {form.header || "Your task title"}
                </strong>

                <small>
                  {form.category} · {form.priority} priority
                </small>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

/* =========================
   TASK DETAILS
========================= */

function TaskDetails({ tasks, deleteTask, completeTask }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const task = tasks.find(
    (item) => item.id === Number(id)
  );

  if (!task) {
    return (
      <div className="not-found">
        <div>404</div>
        <h2>Task not found</h2>
        <p>The requested task does not exist.</p>

        <Link to="/tasks" className="primary-btn">
          Back to Tasks
        </Link>
      </div>
    );
  }

  const handleDelete = () => {
    if (window.confirm("Delete this task?")) {
      deleteTask(task.id);
      navigate("/tasks");
    }
  };

  return (
    <>
      <div className="breadcrumb">
        <Link to="/tasks">Tasks</Link>
        <span>/</span>
        <span>Task #{task.id}</span>
      </div>

      <div className="details-top">
        <div>
          <span className="eyebrow">TASK DETAILS</span>

          <h1>{task.header}</h1>

          <div className="details-meta">
            <StatusBadge status={task.status} />
            <PriorityBadge priority={task.priority} />
            <span>{task.category}</span>
          </div>
        </div>

        <div className="details-actions">
          <button
            className="secondary-btn"
            onClick={() =>
              navigate(`/tasks/${task.id}/edit`)
            }
          >
            ✎ Edit Task
          </button>

          {task.status !== "Closed" && (
            <button
              className="primary-btn"
              onClick={() => completeTask(task.id)}
            >
              ✓ Complete
            </button>
          )}
        </div>
      </div>

      <div className="details-grid">
        <section className="panel details-main">
          <div className="detail-heading">
            <span>DESCRIPTION</span>
          </div>

          <p className="description">
            {task.description}
          </p>

          <div className="detail-divider"></div>

          <div className="detail-heading">
            <span>TASK INFORMATION</span>
          </div>

          <div className="info-grid">
            <InfoItem
              label="Task ID"
              value={`#${task.id}`}
            />

            <InfoItem
              label="Category"
              value={task.category}
            />

            <InfoItem
              label="Priority"
              value={task.priority}
            />

            <InfoItem
              label="Status"
              value={task.status}
            />

            <InfoItem
              label="Raised Date"
              value={formatDate(task.raisedAt)}
            />

            <InfoItem
              label="Due Date"
              value={formatDate(task.dueDate)}
            />
          </div>
        </section>

        <aside className="panel timeline-panel">
          <div className="detail-heading">
            <span>ACTIVITY</span>
          </div>

          <div className="timeline">
            <TimelineItem
              title="Task created"
              date={formatDateTime(task.raisedAt)}
              active
            />

            {task.status === "Pending" && (
              <TimelineItem
                title="Task moved to pending"
                date="Current status"
                active
              />
            )}

            {task.status === "Closed" && (
              <TimelineItem
                title="Task completed"
                date="Completed"
                active
              />
            )}

            <TimelineItem
              title={`Due ${formatDate(task.dueDate)}`}
              date="Deadline"
            />
          </div>

          <button
            className="danger-outline"
            onClick={handleDelete}
          >
            Delete Task
          </button>
        </aside>
      </div>
    </>
  );
}

/* =========================
   EDIT TASK
========================= */

function EditTask({ tasks, updateTask }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const task = tasks.find(
    (item) => item.id === Number(id)
  );

  const [form, setForm] = useState(
    task || {
      header: "",
      description: "",
      priority: "Medium",
      category: "Academic",
      dueDate: "2026-08-28",
      status: "Raised",
    }
  );

  if (!task) {
    return (
      <div className="not-found">
        <div>404</div>
        <h2>Task not found</h2>
        <Link to="/tasks" className="primary-btn">
          Back to Tasks
        </Link>
      </div>
    );
  }

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    updateTask(id, {
      header: form.header,
      description: form.description,
      priority: form.priority,
      category: form.category,
      dueDate: form.dueDate,
      status: form.status,
    });

    navigate(`/tasks/${id}`);
  };

  return (
    <>
      <PageHeading
        eyebrow="EDIT TASK"
        title="Update Task"
        description="Modify task information and save your changes."
      />

      <form className="panel task-form edit-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Task Header</label>

          <input
            name="header"
            value={form.header}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Task Description</label>

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows="5"
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Priority</label>

            <select
              name="priority"
              value={form.priority}
              onChange={handleChange}
            >
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
          </div>

          <div className="form-group">
            <label>Category</label>

            <select
              name="category"
              value={form.category}
              onChange={handleChange}
            >
              <option>Academic</option>
              <option>Personal</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Due Date</label>

            <input
              type="date"
              name="dueDate"
              value={form.dueDate}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Status</label>

            <select
              name="status"
              value={form.status}
              onChange={handleChange}
            >
              <option>Raised</option>
              <option>Pending</option>
              <option>Closed</option>
            </select>
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="secondary-btn"
            onClick={() => navigate(`/tasks/${id}`)}
          >
            Cancel
          </button>

          <button className="primary-btn">
            ✓ Save Changes
          </button>
        </div>
      </form>
    </>
  );
}

/* =========================
   COMPLETED TASKS
========================= */

function CompletedTasks({ tasks }) {
  const completed = tasks.filter(
    (task) => task.status === "Closed"
  );

  return (
    <>
      <PageHeading
        eyebrow="COMPLETED"
        title="Completed Tasks"
        description="Review everything you have successfully finished."
      />

      <section className="panel completed-panel">
        <div className="completed-header">
          <div className="completed-big">
            <strong>{completed.length}</strong>
            <span>completed tasks</span>
          </div>

          <div className="success-message">
            ✓ Great work! Keep going.
          </div>
        </div>

        <div className="completed-list">
          {completed.length === 0 ? (
            <EmptyState text="No completed tasks yet." />
          ) : (
            completed.map((task) => (
              <Link
                to={`/tasks/${task.id}`}
                className="completed-item"
                key={task.id}
              >
                <div className="completed-check">✓</div>

                <div className="completed-info">
                  <strong>{task.header}</strong>
                  <span>
                    {task.category} · Due{" "}
                    {formatDate(task.dueDate)}
                  </span>
                </div>

                <PriorityBadge priority={task.priority} />

                <span>→</span>
              </Link>
            ))
          )}
        </div>
      </section>
    </>
  );
}

/* =========================
   PROFILE
========================= */

function Profile() {
  return (
    <>
      <PageHeading
        eyebrow="ACCOUNT"
        title="My Profile"
        description="Manage your TaskFlow account information."
      />

      <div className="profile-grid">
        <section className="panel profile-card-large">
          <div className="profile-cover"></div>

          <div className="profile-main">
            <img
              src="/profile.jpg"
              alt="Ankita"
              className="profile-large-img"
            />

            <div>
              <h2>Ankita</h2>
              <p>Student · TaskFlow Member</p>
            </div>

            <button className="secondary-btn">
              Edit Profile
            </button>
          </div>

          <div className="profile-info-grid">
            <InfoItem
              label="Full Name"
              value="Ankita"
            />

            <InfoItem
              label="Email"
              value="student@example.com"
            />

            <InfoItem
              label="Role"
              value="Student"
            />

            <InfoItem
              label="Account Status"
              value="Active"
            />
          </div>
        </section>

        <section className="panel account-security">
          <div className="detail-heading">
            <span>ACCOUNT SECURITY</span>
          </div>

          <div className="security-item">
            <span>🔒</span>
            <div>
              <strong>Password</strong>
              <p>Last updated recently</p>
            </div>
            <button>Change</button>
          </div>

          <div className="security-item">
            <span>✓</span>
            <div>
              <strong>Protected Route</strong>
              <p>Authentication is enabled</p>
            </div>
            <b className="active-text">Active</b>
          </div>
        </section>
      </div>
    </>
  );
}

/* =========================
   SETTINGS
========================= */

function Settings() {
  const [notifications, setNotifications] = useState(true);
  const [email, setEmail] = useState(true);

  return (
    <>
      <PageHeading
        eyebrow="ACCOUNT"
        title="Settings"
        description="Customize your TaskFlow experience."
      />

      <section className="panel settings-panel">
        <div className="settings-section">
          <div>
            <h3>Notifications</h3>
            <p>Manage how TaskFlow keeps you updated.</p>
          </div>

          <Toggle
            checked={notifications}
            setChecked={setNotifications}
          />
        </div>

        <div className="settings-section">
          <div>
            <h3>Email Updates</h3>
            <p>Receive reminders about upcoming deadlines.</p>
          </div>

          <Toggle checked={email} setChecked={setEmail} />
        </div>

        <div className="settings-section">
          <div>
            <h3>Appearance</h3>
            <p>Current interface theme</p>
          </div>

          <span className="theme-label">Light Mode</span>
        </div>
      </section>
    </>
  );
}

/* =========================
   TOGGLE
========================= */

function Toggle({ checked, setChecked }) {
  return (
    <button
      className={`toggle ${checked ? "on" : ""}`}
      onClick={() => setChecked(!checked)}
    >
      <span></span>
    </button>
  );
}

/* =========================
   PAGE HEADING
========================= */

function PageHeading({
  eyebrow,
  title,
  description,
  buttonText,
  buttonLink,
}) {
  return (
    <div className="page-heading">
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>

      {buttonText && buttonLink && (
        <Link to={buttonLink} className="primary-btn">
          {buttonText}
        </Link>
      )}
    </div>
  );
}

/* =========================
   BADGES
========================= */

function PriorityBadge({ priority }) {
  return (
    <span
      className={`priority-badge ${priority.toLowerCase()}`}
    >
      <i></i>
      {priority}
    </span>
  );
}

function StatusBadge({ status }) {
  return (
    <span
      className={`status-badge ${status.toLowerCase()}`}
    >
      <i></i>
      {status}
    </span>
  );
}

/* =========================
   PRIORITY ROW
========================= */

function PriorityRow({ label, value, total, type }) {
  const percentage =
    total === 0 ? 0 : Math.round((value / total) * 100);

  return (
    <div className="priority-row">
      <div className="priority-row-top">
        <span>
          <i className={`dot ${type}`}></i>
          {label}
        </span>

        <strong>{value}</strong>
      </div>

      <div className="priority-bar">
        <span
          className={type}
          style={{ width: `${percentage}%` }}
        ></span>
      </div>
    </div>
  );
}

/* =========================
   INFO ITEM
========================= */

function InfoItem({ label, value }) {
  return (
    <div className="info-item">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

/* =========================
   TIMELINE
========================= */

function TimelineItem({ title, date, active }) {
  return (
    <div className={`timeline-item ${active ? "active" : ""}`}>
      <div className="timeline-dot"></div>

      <div>
        <strong>{title}</strong>
        <span>{date}</span>
      </div>
    </div>
  );
}

/* =========================
   EMPTY STATE
========================= */

function EmptyState({ text }) {
  return (
    <div className="empty-state">
      <div>✓</div>
      <p>{text}</p>
    </div>
  );
}

/* =========================
   HELPERS
========================= */

function formatDate(dateString) {
  if (!dateString) return "-";

  const date = new Date(dateString + "T00:00");

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatDateTime(dateString) {
  if (!dateString) return "-";

  const date = new Date(dateString);

  return date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function isOverdue(task) {
  if (task.status === "Closed") return false;

  return (
    new Date(task.dueDate + "T23:59") <
    new Date()
  );
}

export default App;