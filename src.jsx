import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Activity, Bot, BriefcaseBusiness, CalendarDays, Check, CheckCircle2,
  ChevronRight, Circle, Clock3, Dumbbell, GraduationCap, LayoutDashboard,
  ListTodo, MessageCircle, Mic, Plus, Send, Settings2, Sparkles, Trash2,
  TrendingUp, Zap, Menu, X, Download, RotateCcw
} from "lucide-react";
import "./style.css";

const STORAGE_KEY = "ultron-v1-data";
const starterTasks = [
  { id: 1, title: "Review today's college notes", category: "Study", done: false },
  { id: 2, title: "Complete one assignment section", category: "Study", done: false },
  { id: 3, title: "Plan one business action", category: "Business", done: false }
];

const initialData = {
  tasks: starterTasks,
  habits: [
    { id: 1, title: "Study session", icon: "study", done: false },
    { id: 2, title: "Workout / movement", icon: "fitness", done: false },
    { id: 3, title: "Learn a useful skill", icon: "learn", done: false },
    { id: 4, title: "Business progress", icon: "business", done: false }
  ],
  schedule: [
    { id: 1, time: "08:00 AM – 06:00 PM", title: "College", detail: "Classes, notes and practicals" },
    { id: 2, time: "06:00 PM – 10:00 PM", title: "Shop responsibilities", detail: "Work and observe customer needs" },
    { id: 3, time: "10:00 PM – 10:25 PM", title: "Study / assignments", detail: "One focused task" },
    { id: 4, time: "10:25 PM – 10:45 PM", title: "Workout or mobility", detail: "Keep it manageable; rest when needed" },
    { id: 5, time: "10:45 PM – 11:00 PM", title: "Prepare tomorrow", detail: "Set top priorities and wind down" }
  ],
  goals: [
    { id: 1, title: "Improve exam preparation", category: "Study", progress: 15 },
    { id: 2, title: "Build a consistent fitness routine", category: "Fitness", progress: 10 },
    { id: 3, title: "Learn sales and communication", category: "Business", progress: 10 }
  ],
  chat: [
    { role: "assistant", text: "ULTRON online. I can help you plan your day, organize tasks, and make steady progress. Try “plan my day” or “help me study”." }
  ]
};

function loadData() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return initialData;
    const parsed = JSON.parse(saved);
    return { ...initialData, ...parsed };
  } catch {
    return initialData;
  }
}

function dateLabel() {
  return new Intl.DateTimeFormat(undefined, { weekday: "long", month: "long", day: "numeric" }).format(new Date());
}

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

function makeReply(message, data) {
  const text = message.toLowerCase();
  const openTasks = data.tasks.filter(t => !t.done);
  if (/(hello|hi|hey|ultron)/.test(text)) {
    return "I'm online. Tell me what you want to work on: studies, fitness, business, tasks, or planning.";
  }
  if (/(plan my day|schedule|timetable|today)/.test(text)) {
    return "Your starter routine is: college from 8 AM–6 PM, shop responsibilities from 6 PM–10 PM, then use 10 PM–11 PM for one focused study task, light movement if appropriate, and tomorrow's priorities. Adjust this to your real commitments and protect your sleep.";
  }
  if (/(study|exam|assignment|college|homework)/.test(text)) {
    return "Study sprint: 1) choose one small topic or assignment section, 2) work for 20 minutes without distractions, 3) write a 3-line summary from memory, and 4) note the next step. Add the task to your task list so you can track it.";
  }
  if (/(workout|fitness|gym|calisthenic|exercise)/.test(text)) {
    return "Keep it sustainable: choose a short session that fits your energy and experience. Alternate strength days with rest or easy movement, use safe technique, and stop if you feel pain or unwell. Consistency and recovery matter more than exhausting yourself.";
  }
  if (/(business|startup|sell|sales|income|money|customer)/.test(text)) {
    return "Business mini-plan: identify one customer group, ask what they need, compare supplier prices and reliability, calculate every cost before setting a price, and test demand with a small low-risk offer. Track enquiries, sales, expenses and lessons learned.";
  }
  if (/(task|todo|pending|priority|what should i do)/.test(text)) {
    if (!openTasks.length) return "Your task list is clear. Add your next action and keep it small enough to finish.";
    return "You have " + openTasks.length + " open task(s): " + openTasks.slice(0, 4).map(t => t.title).join("; ") + ". Pick the most urgent one and start with a 20-minute focus session.";
  }
  if (/(motivat|lazy|procrastinat|discipline)/.test(text)) {
    return "Don't wait for perfect motivation. Make the next action tiny: open the notes, write the heading, or do the first question. A small completed step is better than a perfect plan you never start.";
  }
  if (/(help|what can you do|commands)/.test(text)) {
    return "I can help with daily planning, study methods, fitness habits, business checklists and prioritizing your saved tasks. Try: “plan my day”, “help me study”, “business idea”, or “show my tasks”. This offline starter uses simple rules, not a full AI model.";
  }
  return "Let's break that down. Define the result you want, choose the smallest next action, and give it a time slot. I’m an offline starter assistant, so I may not understand every request. Try asking about your schedule, studies, fitness, business, or tasks.";
}

function App() {
  const [data, setData] = useState(loadData);
  const [active, setActive] = useState("Overview");
  const [chatInput, setChatInput] = useState("");
  const [taskInput, setTaskInput] = useState("");
  const [taskCategory, setTaskCategory] = useState("Study");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const completedTasks = data.tasks.filter(t => t.done).length;
  const taskProgress = data.tasks.length ? Math.round(completedTasks / data.tasks.length * 100) : 0;
  const completedHabits = data.habits.filter(h => h.done).length;

  const navItems = [
    { name: "Overview", icon: LayoutDashboard },
    { name: "My Tasks", icon: ListTodo },
    { name: "Schedule", icon: CalendarDays },
    { name: "Progress", icon: TrendingUp }
  ];

  function updateData(key, updater) {
    setData(prev => ({ ...prev, [key]: typeof updater === "function" ? updater(prev[key]) : updater }));
  }

  function addTask(e) {
    e?.preventDefault();
    const title = taskInput.trim();
    if (!title) return;
    updateData("tasks", tasks => [{ id: Date.now(), title, category: taskCategory, done: false }, ...tasks]);
    setTaskInput("");
    setNotice("Task added");
    setTimeout(() => setNotice(""), 1800);
  }

  function toggleTask(id) {
    updateData("tasks", tasks => tasks.map(t => t.id === id ? { ...t, done: !t.done } : t));
  }

  function deleteTask(id) {
    updateData("tasks", tasks => tasks.filter(t => t.id !== id));
  }

  function toggleHabit(id) {
    updateData("habits", habits => habits.map(h => h.id === id ? { ...h, done: !h.done } : h));
  }

  function sendChat(e, preset) {
    e?.preventDefault();
    const message = (preset ?? chatInput).trim();
    if (!message) return;
    const userMsg = { role: "user", text: message };
    const reply = { role: "assistant", text: makeReply(message, data) };
    updateData("chat", chat => [...chat, userMsg, reply].slice(-30));
    setChatInput("");
  }

  function resetData() {
    if (confirm("Reset ULTRON to its starter data? This will clear your saved tasks and chat on this browser.")) {
      setData(initialData);
      setNotice("Starter data restored");
      setTimeout(() => setNotice(""), 1800);
    }
  }

  function exportData() {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ultron-backup.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  const title = active === "Overview" ? "Command Center" : active;
  const openTasks = useMemo(() => data.tasks.filter(t => !t.done), [data.tasks]);

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileMenu ? "sidebar-open" : ""}`}>
        <div className="brand">
          <div className="brand-mark"><Zap size={23} fill="currentColor" /></div>
          <div><div className="brand-name">ULTRON<span>.</span></div><div className="brand-sub">PERSONAL SYSTEM</div></div>
          <button className="icon-btn mobile-close" onClick={() => setMobileMenu(false)} aria-label="Close menu"><X size={19} /></button>
        </div>
        <div className="system-status"><span className="status-dot" /> SYSTEM ONLINE <span className="status-version">V1.0</span></div>
        <div className="nav-label">WORKSPACE</div>
        <nav>
          {navItems.map(item => {
            const Icon = item.icon;
            return <button key={item.name} className={`nav-item ${active === item.name ? "active" : ""}`} onClick={() => { setActive(item.name); setMobileMenu(false); }}>
              <Icon size={18} /><span>{item.name}</span>{item.name === "My Tasks" && <span className="nav-count">{openTasks.length}</span>}
            </button>;
          })}
        </nav>
        <div className="sidebar-bottom">
          <div className="mini-orb"><div className="orb-core" /></div>
          <div className="sidebar-quote">“Small steps. Relentless progress.”</div>
          <div className="sidebar-caption">YOUR DAY. YOUR DIRECTION.</div>
        </div>
        <div className="sidebar-footer"><span className="avatar">U</span><div><strong>ULTRON User</strong><small>Personal workspace</small></div><Settings2 size={17} className="muted-icon" /></div>
      </aside>

      {mobileMenu && <button className="scrim" onClick={() => setMobileMenu(false)} aria-label="Close navigation" />}

      <main className="main-area">
        <header className="topbar">
          <div className="topbar-left">
            <button className="icon-btn mobile-menu-btn" onClick={() => setMobileMenu(true)} aria-label="Open menu"><Menu size={21} /></button>
            <div className="breadcrumb">ULTRON <ChevronRight size={14} /> <span>{title}</span></div>
          </div>
          <div className="topbar-right"><span className="date-chip"><CalendarDays size={15} /> {dateLabel()}</span><span className="top-avatar">U</span></div>
        </header>

        <div className="page-content">
          <section className="welcome-row">
            <div>
              <div className="eyebrow"><Sparkles size={14} /> YOUR PERSONAL COMMAND CENTER</div>
              <h1>{active === "Overview" ? `${greeting()}. Let's make it count.` : title}<span className="heading-dot">.</span></h1>
              <p className="subheading">{active === "Overview" ? "One focused step at a time. Your goals, organized in one place." : pageSubtitle(active)}</p>
            </div>
            <div className="quick-date"><div className="date-number">{new Date().getDate().toString().padStart(2, "0")}</div><div><strong>{new Intl.DateTimeFormat(undefined, { month: "long" }).format(new Date())}</strong><small>{new Intl.DateTimeFormat(undefined, { weekday: "long" }).format(new Date())}</small></div></div>
          </section>

          {active === "Overview" && <Overview data={data} taskProgress={taskProgress} completedTasks={completedTasks} completedHabits={completedHabits} onToggleHabit={toggleHabit} onToggleTask={toggleTask} onNavigate={setActive} onSend={sendChat} />}
          {active === "My Tasks" && <TasksPage data={data} taskInput={taskInput} setTaskInput={setTaskInput} taskCategory={taskCategory} setTaskCategory={setTaskCategory} addTask={addTask} toggleTask={toggleTask} deleteTask={deleteTask} />}
          {active === "Schedule" && <SchedulePage data={data} updateData={updateData} />}
          {active === "Progress" && <ProgressPage data={data} updateData={updateData} taskProgress={taskProgress} completedTasks={completedTasks} completedHabits={completedHabits} />}

          <footer className="footer"><span><span className="footer-dot" /> ULTRON V1.0 <span className="footer-sep">/</span> LOCAL MODE</span><div><button onClick={exportData}><Download size={13} /> Export backup</button><button onClick={resetData}><RotateCcw size={13} /> Reset data</button></div></footer>
        </div>
      </main>

      {notice && <div className="toast"><CheckCircle2 size={16} />{notice}</div>}
    </div>
  );
}

function pageSubtitle(page) {
  return {
    "My Tasks": "Capture your next actions and turn plans into completed work.",
    "Schedule": "A starter timetable built around your stated commitments.",
    "Progress": "Track consistency and move your goals forward."
  }[page] || "";
}

function Overview({ data, taskProgress, completedTasks, completedHabits, onToggleHabit, onToggleTask, onNavigate, onSend }) {
  const [chatInput, setChatInput] = useState("");
  const taskList = data.tasks.filter(t => !t.done).slice(0, 4);
  const categoryIcon = { Study: GraduationCap, Fitness: Dumbbell, Business: BriefcaseBusiness, Personal: Circle };
  return <>
    <section className="stats-grid">
      <StatCard icon={ListTodo} label="OPEN TASKS" value={data.tasks.filter(t => !t.done).length} note="Things to move forward" tone="blue" />
      <StatCard icon={CheckCircle2} label="TASKS COMPLETED" value={completedTasks} note={`${taskProgress}% of your task list`} tone="green" />
      <StatCard icon={Activity} label="DAILY HABITS" value={`${completedHabits}/${data.habits.length}`} note="Small actions compound" tone="purple" />
      <StatCard icon={TrendingUp} label="ACTIVE GOALS" value={data.goals.length} note="Keep your direction clear" tone="orange" />
    </section>

    <div className="content-grid">
      <div className="left-column">
        <section className="panel">
          <div className="panel-header"><div><div className="section-kicker">TODAY'S EXECUTION</div><h2>Priority tasks</h2></div><button className="text-link" onClick={() => onNavigate("My Tasks")}>All tasks <ChevronRight size={15} /></button></div>
          {taskList.length ? <div className="task-list">
            {taskList.map(task => {
              const Icon = categoryIcon[task.category] || Circle;
              return <div className="task-row" key={task.id}>
                <button className="check-button" onClick={() => onToggleTask(task.id)} aria-label={`Complete ${task.title}`}><Circle size={19} /></button>
                <div className="task-main"><strong>{task.title}</strong><span className={`category-tag ${task.category.toLowerCase()}`}><Icon size={12} />{task.category}</span></div>
                <button className="subtle-arrow" onClick={() => onNavigate("My Tasks")} aria-label="Open tasks"><ChevronRight size={17} /></button>
              </div>;
            })}
          </div> : <EmptyState title="All clear" text="Add a task to choose your next move." />}
          <button className="wide-secondary" onClick={() => onNavigate("My Tasks")}><Plus size={16} /> Manage tasks</button>
        </section>

        <section className="panel assistant-panel">
          <div className="panel-header"><div className="assistant-title"><div className="assistant-icon"><Bot size={20} /></div><div><div className="section-kicker">LOCAL ASSISTANT</div><h2>Ask ULTRON</h2></div></div><span className="offline-badge"><span className="status-dot" /> OFFLINE READY</span></div>
          <div className="chat-preview">
            {data.chat.slice(-2).map((m, i) => <div key={i} className={`chat-line ${m.role}`}><span className="chat-avatar">{m.role === "assistant" ? <Bot size={14} /> : "U"}</span><p>{m.text}</p></div>)}
          </div>
          <div className="prompt-chips"><button onClick={() => onSend(null, "Plan my day")}>Plan my day</button><button onClick={() => onSend(null, "Help me study")}>Study help</button><button onClick={() => onSend(null, "Business ideas")}>Business</button></div>
          <form className="chat-form" onSubmit={e => { e.preventDefault(); if (chatInput.trim()) { onSend(null, chatInput); setChatInput(""); } }}>
            <input value={chatInput} onChange={e => setChatInput(e.target.value)} placeholder="Ask about your goals or next step..." aria-label="Message ULTRON" />
            <button type="submit" aria-label="Send message"><Send size={17} /></button>
          </form>
          <div className="disclaimer">Starter assistant uses built-in rules, not a full AI model.</div>
        </section>
      </div>

      <div className="right-column">
        <section className="panel">
          <div className="panel-header"><div><div className="section-kicker">CONSISTENCY SYSTEM</div><h2>Daily habits</h2></div><span className="small-counter">{completedHabits} / {data.habits.length}</span></div>
          <div className="habit-list">{data.habits.map(habit => <button key={habit.id} className={`habit-row ${habit.done ? "habit-done" : ""}`} onClick={() => onToggleHabit(habit.id)}><span className={`habit-icon ${habit.icon}`}>{habit.icon === "study" ? <GraduationCap size={17} /> : habit.icon === "fitness" ? <Dumbbell size={17} /> : habit.icon === "business" ? <BriefcaseBusiness size={17} /> : <Sparkles size={17} />}</span><span className="habit-title">{habit.title}</span><span className="habit-check">{habit.done ? <Check size={14} /> : <Plus size={14} />}</span></button>)}</div>
          <div className="habit-progress"><div><span>Daily completion</span><strong>{data.habits.length ? Math.round(completedHabits / data.habits.length * 100) : 0}%</strong></div><div className="progress-track"><span style={{ width: `${data.habits.length ? completedHabits / data.habits.length * 100 : 0}%` }} /></div></div>
        </section>

        <section className="panel schedule-panel">
          <div className="panel-header"><div><div className="section-kicker">TIME BLOCKS</div><h2>Today's schedule</h2></div><button className="icon-link" onClick={() => onNavigate("Schedule")} aria-label="Open schedule"><ChevronRight size={18} /></button></div>
          <div className="timeline">{data.schedule.slice(0, 4).map((item, i) => <div className="timeline-item" key={item.id}><div className={`timeline-marker ${i === 2 ? "highlight" : ""}`}><span /></div><div className="timeline-copy"><small>{item.time}</small><strong>{item.title}</strong></div></div>)}</div>
          <button className="wide-secondary" onClick={() => onNavigate("Schedule")}>View full schedule <ChevronRight size={15} /></button>
        </section>

        <section className="tip-card"><div className="tip-glow" /><div className="tip-icon"><Sparkles size={17} /></div><div className="section-kicker">ULTRON'S REMINDER</div><h3>Progress beats perfection.</h3><p>Pick one important action. Finish it before adding five more.</p></section>
      </div>
    </div>
  </>;
}

function StatCard({ icon: Icon, label, value, note, tone }) {
  return <div className="stat-card"><div className={`stat-icon ${tone}`}><Icon size={19} /></div><div className="stat-label">{label}</div><div className="stat-value">{value}</div><div className="stat-note">{note}</div></div>;
}

function TasksPage({ data, taskInput, setTaskInput, taskCategory, setTaskCategory, addTask, toggleTask, deleteTask }) {
  const [filter, setFilter] = useState("All");
  const filtered = data.tasks.filter(t => filter === "All" || (filter === "Completed" ? t.done : !t.done));
  return <div className="single-column">
    <section className="panel">
      <div className="panel-header"><div><div className="section-kicker">TASK MANAGER</div><h2>Make the next step clear</h2></div><span className="small-counter">{data.tasks.filter(t => !t.done).length} open</span></div>
      <form className="add-task-form" onSubmit={addTask}><input value={taskInput} onChange={e => setTaskInput(e.target.value)} placeholder="Write a task you want to finish..." aria-label="New task" /><select value={taskCategory} onChange={e => setTaskCategory(e.target.value)} aria-label="Task category"><option>Study</option><option>Fitness</option><option>Business</option><option>Personal</option></select><button type="submit"><Plus size={17} /> Add task</button></form>
      <div className="filter-tabs">{["All", "Open", "Completed"].map(f => <button key={f} className={filter === f ? "selected" : ""} onClick={() => setFilter(f)}>{f}</button>)}</div>
      <div className="full-task-list">{filtered.map(task => <div className={`full-task ${task.done ? "done" : ""}`} key={task.id}><button className="check-button" onClick={() => toggleTask(task.id)} aria-label="Toggle task">{task.done ? <CheckCircle2 size={20} /> : <Circle size={20} />}</button><div className="full-task-copy"><strong>{task.title}</strong><span className={`category-tag ${task.category.toLowerCase()}`}>{task.category}</span></div><button className="delete-btn" onClick={() => deleteTask(task.id)} aria-label="Delete task"><Trash2 size={16} /></button></div>)}</div>
      {!filtered.length && <EmptyState title="Nothing in this view" text="Add a task or choose another filter." />}
    </section>
  </div>;
}

function SchedulePage({ data, updateData }) {
  const [time, setTime] = useState("");
  const [title, setTitle] = useState("");
  const [detail, setDetail] = useState("");
  function addBlock(e) {
    e.preventDefault();
    if (!time.trim() || !title.trim()) return;
    updateData("schedule", items => [...items, { id: Date.now(), time: time.trim(), title: title.trim(), detail: detail.trim() }]);
    setTime(""); setTitle(""); setDetail("");
  }
  function removeBlock(id) { updateData("schedule", items => items.filter(i => i.id !== id)); }
  return <div className="single-column">
    <section className="panel">
      <div className="panel-header"><div><div className="section-kicker">TIME MANAGEMENT</div><h2>Your daily blocks</h2></div><span className="small-counter">{data.schedule.length} blocks</span></div>
      <p className="panel-description">This is an editable starting point based on your current routine. Change it whenever your commitments change.</p>
      <div className="schedule-full-list">{data.schedule.map((item, i) => <div className="schedule-block" key={item.id}><div className="schedule-time"><Clock3 size={15} />{item.time}</div><div className="schedule-line"><span className={i === 2 ? "schedule-bullet active" : "schedule-bullet"} /></div><div className="schedule-detail"><strong>{item.title}</strong><p>{item.detail}</p></div><button className="delete-btn" onClick={() => removeBlock(item.id)} aria-label={`Delete ${item.title}`}><Trash2 size={15} /></button></div>)}</div>
      <form className="schedule-add-form" onSubmit={addBlock}><div className="section-kicker">ADD A TIME BLOCK</div><div className="form-row"><input value={time} onChange={e => setTime(e.target.value)} placeholder="e.g. 11:00 PM" aria-label="Time" required /><input value={title} onChange={e => setTitle(e.target.value)} placeholder="Activity" aria-label="Activity" required /></div><input value={detail} onChange={e => setDetail(e.target.value)} placeholder="Optional details" aria-label="Details" /><button type="submit"><Plus size={16} /> Add to schedule</button></form>
    </section>
  </div>;
}

function ProgressPage({ data, updateData, taskProgress, completedTasks, completedHabits }) {
  function changeProgress(id, value) { updateData("goals", goals => goals.map(g => g.id === id ? { ...g, progress: Number(value) } : g)); }
  function addGoal() {
    const title = prompt("What goal do you want to work toward?");
    if (title?.trim()) updateData("goals", goals => [...goals, { id: Date.now(), title: title.trim(), category: "Personal", progress: 0 }]);
  }
  function deleteGoal(id) { updateData("goals", goals => goals.filter(g => g.id !== id)); }
  return <div className="single-column">
    <div className="stats-grid progress-stats"><StatCard icon={CheckCircle2} label="TASKS COMPLETED" value={completedTasks} note={`${taskProgress}% of current tasks`} tone="green" /><StatCard icon={Activity} label="HABITS DONE TODAY" value={`${completedHabits}/${data.habits.length}`} note="Check off habits on Overview" tone="purple" /><StatCard icon={TrendingUp} label="GOALS IN MOTION" value={data.goals.length} note="Update progress below" tone="blue" /></div>
    <section className="panel">
      <div className="panel-header"><div><div className="section-kicker">LONG-TERM DIRECTION</div><h2>Your goals</h2></div><button className="small-primary" onClick={addGoal}><Plus size={15} /> Add goal</button></div>
      <div className="goals-list">{data.goals.map(goal => <div className="goal-row" key={goal.id}><div className="goal-top"><div><span className={`category-tag ${goal.category.toLowerCase()}`}>{goal.category}</span><strong>{goal.title}</strong></div><button className="delete-btn" onClick={() => deleteGoal(goal.id)} aria-label="Delete goal"><Trash2 size={15} /></button></div><div className="goal-meter"><div className="progress-track"><span style={{ width: `${goal.progress}%` }} /></div><strong>{goal.progress}%</strong></div><input className="goal-slider" type="range" min="0" max="100" step="5" value={goal.progress} onChange={e => changeProgress(goal.id, e.target.value)} aria-label={`Progress for ${goal.title}`} /></div>)}</div>
      <div className="privacy-note"><Settings2 size={16} /><span>Your data is saved locally in this browser. Export a backup before clearing browser data or switching devices.</span></div>
    </section>
  </div>;
}

function EmptyState({ title, text }) {
  return <div className="empty-state"><div className="empty-icon"><CheckCircle2 size={22} /></div><strong>{title}</strong><p>{text}</p></div>;
}

createRoot(document.getElementById("root")).render(<App />);
