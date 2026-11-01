
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

type Task = {
  _id: string;
  title: string;
  done: boolean;
};

const API = "https://taskflow-78cifmvnw-smit-0801.vercel.app/api";

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  async function loadTasks() {
    try {
      const res = await fetch(`${API}/tasks`);
      if (!res.ok) throw new Error();
      setTasks(await res.json());
      setError("");
    } catch {
      setError("Unable to connect to server. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTasks();
  }, []);

  async function addTask() {
    if (!title.trim()) {
      setError("Please enter a task first.");
      return;
    }

    try {
      const res = await fetch(`${API}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });
      if (!res.ok) throw new Error();
      setTitle("");
      await loadTasks();
    } catch {
      setError("Could not add task.");
    }
  }

  async function toggleTask(task: Task) {
    try {
      const res = await fetch(`${API}/tasks/${task._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ done: !task.done }),
      });
      if (!res.ok) throw new Error();
      await loadTasks();
    } catch {
      setError("Could not update task.");
    }
  }

  async function deleteTask(id: string) {
    try {
      const res = await fetch(`${API}/tasks/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();
      await loadTasks();
    } catch {
      setError("Could not delete task.");
    }
  }

  const completed = tasks.filter(task => task.done).length;
  const pending = tasks.length - completed;
  const progress = tasks.length
    ? Math.round((completed / tasks.length) * 100)
    : 0;

  const filteredTasks = tasks.filter(task => {
    if (filter === "completed") return task.done;
    if (filter === "pending") return !task.done;
    return true;
  });

  return (
    <main className="min-h-screen bg-[#190D13] px-4 py-8 text-[#F7E9E9] md:px-10 md:py-12">
      <div className="mx-auto max-w-5xl space-y-8">

        {/* Header */}
        <header className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Badge className="mb-4 border border-[#B76E79]/30 bg-[#B76E79]/10 text-[#E6BFC5] hover:bg-[#B76E79]/10">
              ✦ PERSONAL WORKSPACE
            </Badge>

            <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
              Task<span className="text-[#C58A94]">Flow.</span>
            </h1>

            <p className="mt-2 text-sm text-[#BBA5AB]">
              Plan smarter. Stay focused. Get things done.
            </p>
          </div>

          <div className="rounded-2xl border border-[#B76E79]/20 bg-[#321B26] px-5 py-4">
            <p className="text-xs tracking-widest text-[#C9A9B1]">
              YOUR PROGRESS
            </p>
            <p className="mt-1 text-3xl font-bold text-[#E4AEB8]">
              {progress}%
            </p>
          </div>
        </header>

        {/* Statistics */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card className="border-[#70404F]/40 bg-[#2A1720] text-[#F7E9E9] shadow-xl">
            <CardContent className="p-5">
              <p className="text-sm text-[#C1AAB1]">Total Tasks</p>
              <p className="mt-3 text-4xl font-bold">{tasks.length}</p>
              <p className="mt-2 text-xs text-[#D6A3AD]">✦ All your tasks</p>
            </CardContent>
          </Card>

          <Card className="border-[#70404F]/40 bg-[#2A1720] text-[#F7E9E9] shadow-xl">
            <CardContent className="p-5">
              <p className="text-sm text-[#C1AAB1]">Completed</p>
              <p className="mt-3 text-4xl font-bold text-[#A9C7AC]">
                {completed}
              </p>
              <p className="mt-2 text-xs text-[#A9C7AC]">
                ✓ Successfully finished
              </p>
            </CardContent>
          </Card>

          <Card className="border-[#70404F]/40 bg-[#2A1720] text-[#F7E9E9] shadow-xl">
            <CardContent className="p-5">
              <p className="text-sm text-[#C1AAB1]">Pending</p>
              <p className="mt-3 text-4xl font-bold text-[#E5A0B0]">
                {pending}
              </p>
              <p className="mt-2 text-xs text-[#E5A0B0]">
                ◷ Waiting to be done
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Progress */}
        <Card className="border-[#70404F]/40 bg-[#2A1720] text-[#F7E9E9]">
          <CardContent className="space-y-4 p-6">
            <div className="flex justify-between text-sm">
              <span className="font-medium">Your daily progress</span>
              <span className="text-[#E4AEB8]">
                {completed}/{tasks.length}
              </span>
            </div>

            <div className="h-3 overflow-hidden rounded-full bg-[#492B37]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#9F5368] via-[#C17C8B] to-[#E5B1B9] transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Add Task */}
        <Card className="border-[#70404F]/40 bg-[#2A1720] text-[#F7E9E9] shadow-xl">
          <CardContent className="space-y-5 p-6">
            <div>
              <h2 className="text-xl font-semibold">Create a New Task</h2>
              <p className="mt-1 text-sm text-[#BBA5AB]">
                What's on your mind today?
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Input
                placeholder="Write your next task..."
                value={title}
                onChange={e => setTitle(e.target.value)}
                onKeyDown={e => {
                  if (e.key === "Enter") addTask();
                }}
                className="h-12 border-[#70404F]/50 bg-[#190D13] text-[#F7E9E9] placeholder:text-[#987C85] focus-visible:ring-[#B76E79]"
              />

              <Button
                onClick={addTask}
                className="h-12 bg-[#A65D70] px-7 text-white hover:bg-[#89475B]"
              >
                + Add Task
              </Button>
            </div>

            {error && (
              <p className="text-sm text-red-300">{error}</p>
            )}
          </CardContent>
        </Card>

        {/* Task List */}
        <Card className="border-[#70404F]/40 bg-[#2A1720] text-[#F7E9E9] shadow-xl">
          <CardContent className="space-y-6 p-6">

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold">Your Tasks</h2>
                <p className="mt-1 text-sm text-[#BBA5AB]">
                  Manage your daily activities.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {["all", "pending", "completed"].map(item => (
                  <Button
                    key={item}
                    size="sm"
                    variant="outline"
                    onClick={() => setFilter(item)}
                    className={
                      filter === item
                        ? "border-[#A65D70] bg-[#A65D70] text-white hover:bg-[#89475B]"
                        : "border-[#70404F]/50 bg-transparent text-[#D5BDC4] hover:bg-[#492B37] hover:text-white"
                    }
                  >
                    {item.charAt(0).toUpperCase() + item.slice(1)}
                  </Button>
                ))}
              </div>
            </div>

            {loading ? (
              <p className="py-10 text-center text-[#BBA5AB]">
                Loading your tasks...
              </p>
            ) : filteredTasks.length === 0 ? (
              <div className="rounded-xl border border-dashed border-[#70404F]/60 py-12 text-center">
                <p className="text-3xl text-[#C58A94]">✦</p>
                <p className="mt-3 font-medium">
                  {tasks.length === 0
                    ? "Your workspace is empty"
                    : "No tasks in this category"}
                </p>
                <p className="mt-1 text-sm text-[#BBA5AB]">
                  {tasks.length === 0
                    ? "Add your first task to get started."
                    : "Try another filter."}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredTasks.map(task => (
                  <div
                    key={task._id}
                    className="group flex items-center gap-4 rounded-xl border border-[#70404F]/30 bg-[#190D13] p-4 transition hover:border-[#B76E79]/70"
                  >
                    <Checkbox
                      checked={task.done}
                      onCheckedChange={() => toggleTask(task)}
                      className="border-[#C58A94] data-[state=checked]:border-[#A65D70] data-[state=checked]:bg-[#A65D70]"
                    />

                    <span
                      className={`flex-1 break-words text-sm ${
                        task.done
                          ? "text-[#8D747D] line-through"
                          : "font-medium text-[#F3E1E5]"
                      }`}
                    >
                      {task.title}
                    </span>

                    <Badge
                      className={
                        task.done
                          ? "bg-[#45654D]/20 text-[#A9C7AC] hover:bg-[#45654D]/20"
                          : "bg-[#A65D70]/15 text-[#E4AEB8] hover:bg-[#A65D70]/15"
                      }
                    >
                      {task.done ? "Done" : "Pending"}
                    </Badge>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteTask(task._id)}
                      className="text-[#BBA5AB] hover:bg-red-500/10 hover:text-red-300"
                    >
                      Delete
                    </Button>
                  </div>
                ))}
              </div>
            )}

          </CardContent>
        </Card>

        <footer className="pb-4 text-center text-xs tracking-wide text-[#987C85]">
          Made with focus & creativity ✦ TaskFlow Workspace
        </footer>

      </div>
    </main>
  );
}
