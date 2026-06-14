"use client";

import { useEffect, useState } from "react";

const branches = [
  { value: "CSE", label: "CSE" },
  { value: "ECE", label: "ECE" },
  { value: "IT", label: "IT" },
  { value: "CSM", label: "CS & AIML" },
  { value: "EEE", label: "EEE" },
];

export default function Home() {
  const [data, setData] = useState([]);
  const [branch, setBranch] = useState("CSE");
  const [averageCgpa, setAverageCgpa] = useState("--");
  const [branchAverages, setBranchAverages] = useState(
    Object.fromEntries(branches.map((item) => [item.value, "--"]))
  );
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function fetchAllBranchAverages() {
      const averages = await Promise.all(
        branches.map(async (item) => [
          item.value,
          await fetchAverageCgpa(item.value, controller.signal),
        ])
      );

      setBranchAverages(Object.fromEntries(averages));
    }

    fetchAllBranchAverages().catch((err) => {
      if (err.name !== "AbortError") {
        setBranchAverages(
          Object.fromEntries(branches.map((item) => [item.value, "--"]))
        );
      }
    });

    return () => controller.abort();
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchData() {
      setStatus("loading");
      setError("");

      try {
        const rankingsResponse = await fetch(
          `https://rankers-eqqy.onrender.com/top/200/${branch}`,
          { signal: controller.signal }
        );

        if (!rankingsResponse.ok) {
          throw new Error("Unable to load rankings right now.");
        }

        const json = await rankingsResponse.json();
        setData(Array.isArray(json) ? json : []);
        setStatus("success");

        const average = await fetchAverageCgpa(branch, controller.signal);
        setAverageCgpa(average);
      } catch (err) {
        if (err.name === "AbortError") return;
        setError(err.message || "Something went wrong while loading rankings.");
        setData([]);
        setAverageCgpa("--");
        setStatus("error");
      }
    }

    fetchData();

    return () => controller.abort();
  }, [branch]);

  const selectedBranch = branches.find((item) => item.value === branch);
  const topStudents = data.slice(0, 3);

  return (
    <main className="min-h-screen bg-[#f5f0e8] text-[#17211b]">
      <section
        className="relative isolate min-h-[86vh] overflow-hidden bg-[#17211b] text-white"
        style={{
          backgroundImage:
            "linear-gradient(90deg, rgba(23,33,27,0.96) 0%, rgba(23,33,27,0.78) 48%, rgba(23,33,27,0.28) 100%), url('https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=1800&q=80')",
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      >
        <div className="absolute inset-x-0 top-0 border-b border-white/15">
          <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
            <a href="#" className="text-lg font-black tracking-wide">
              RankVista
            </a>
            <a
              href="#rankings"
              className="rounded-md border border-white/30 bg-white/10 px-4 py-2 text-sm font-bold text-white backdrop-blur transition hover:bg-white hover:text-[#17211b]"
            >
              View rankings
            </a>
          </div>
        </div>

        <div className="mx-auto flex min-h-[86vh] w-full max-w-7xl items-end px-5 pb-12 pt-28 sm:px-8 lg:pb-16">
          <div className="max-w-4xl">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#f3c85b]">
              Branch-wise academic leaderboard
            </p>
            <h1 className="mt-5 max-w-3xl text-5xl font-black leading-[1.02] text-white sm:text-6xl lg:text-7xl">
              RankVista
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/82">
              A sharp, fast leaderboard for discovering top student performance
              across CSE, ECE, IT, CS & AIML, and EEE.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#rankings"
                className="rounded-md bg-[#f3c85b] px-5 py-3 text-sm font-black text-[#17211b] shadow-lg shadow-black/20 transition hover:bg-white"
              >
                Explore leaderboard
              </a>
              <span className="rounded-md border border-white/25 bg-white/10 px-5 py-3 text-sm font-bold text-white backdrop-blur">
                Top 200 by branch
              </span>
            </div>

            <div className="mt-10 grid max-w-4xl grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {branches.map((item) => (
                <article
                  key={item.value}
                  className="rounded-lg border border-white/18 bg-white/12 p-4 backdrop-blur"
                >
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-[#f3c85b]">
                    {item.label}
                  </p>
                  <p className="mt-2 text-3xl font-black text-white">
                    {branchAverages[item.value]}
                  </p>
                  <p className="mt-1 text-xs font-semibold text-white/70">
                    Average CGPA
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-[#d8d0c3] bg-[#fffaf1]">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-5 py-8 sm:px-8 lg:flex-row lg:items-end lg:justify-between lg:py-10">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#7b4f24]">
              Student rankings
            </p>
            <h1 className="mt-3 text-4xl font-black leading-tight text-[#17211b] sm:text-5xl">
              {selectedBranch?.label} leaderboard
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-[#59635d]">
              Browse the top 200 students by branch with quick context, clear
              ranking order, and a table built for scanning.
            </p>
          </div>

          <label className="flex w-full max-w-xs flex-col gap-2 text-sm font-semibold text-[#3d463f]">
            Branch
            <select
              value={branch}
              onChange={(event) => setBranch(event.target.value)}
              className="h-12 rounded-md border border-[#b9aa98] bg-white px-4 text-base font-bold text-[#17211b] shadow-sm outline-none transition focus:border-[#1f7a5a] focus:ring-4 focus:ring-[#1f7a5a]/15"
            >
              {branches.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </section>

      <section
        id="rankings"
        className="scroll-mt-6 mx-auto w-full max-w-7xl px-5 py-6 sm:px-8 lg:py-8"
      >
        <div className="grid gap-3 sm:grid-cols-3">
          <Metric label="Students shown" value={status === "success" ? data.length : "--"} />
          <Metric label="Average CGPA" value={averageCgpa} />
          <Metric label="Active branch" value={selectedBranch?.label || branch} />
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {branches.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => setBranch(item.value)}
              className={`h-10 rounded-md border px-4 text-sm font-bold transition ${
                branch === item.value
                  ? "border-[#1f7a5a] bg-[#1f7a5a] text-white shadow-sm"
                  : "border-[#cfc4b4] bg-white text-[#3d463f] hover:border-[#1f7a5a] hover:text-[#1f7a5a]"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {topStudents.length > 0 && (
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {topStudents.map((student, index) => (
              <article
                key={`${student.htno}-${student.rank}`}
                className="rounded-lg border border-[#d7ccb9] bg-white p-5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#b05f2c]">
                      Rank {student.rank}
                    </p>
                    <h2 className="mt-2 text-xl font-black text-[#17211b]">
                      {student.name}
                    </h2>
                  </div>
                  <span className="grid h-10 w-10 place-items-center rounded-md bg-[#f3c85b] text-lg font-black text-[#17211b]">
                    {index + 1}
                  </span>
                </div>
                <div className="mt-5 flex items-center justify-between border-t border-[#eee5d7] pt-4 text-sm">
                  <span className="font-semibold text-[#667069]">{student.htno}</span>
                  <span className="text-lg font-black text-[#1f7a5a]">
                    {student.CGPA}
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}

        <section className="mt-8 overflow-hidden rounded-lg border border-[#d7ccb9] bg-white shadow-sm">
          <div className="flex flex-col gap-2 border-b border-[#eee5d7] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-black text-[#17211b]">Rankings</h2>
              <p className="text-sm text-[#667069]">
                Sorted by the latest data from the rankings API.
              </p>
            </div>
            <span className="w-fit rounded-md bg-[#e8f3ed] px-3 py-2 text-sm font-bold text-[#1f7a5a]">
              {selectedBranch?.label}
            </span>
          </div>

          {status === "loading" && <StateMessage title="Loading rankings" />}
          {status === "error" && <StateMessage title={error} tone="error" />}
          {status === "success" && data.length === 0 && (
            <StateMessage title="No rankings found for this branch." />
          )}

          {status === "success" && data.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] border-collapse text-left">
                <thead className="bg-[#17211b] text-white">
                  <tr>
                    <TableHead>Rank</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>CGPA</TableHead>
                    <TableHead>Roll No.</TableHead>
                    <TableHead>Branch</TableHead>
                  </tr>
                </thead>
                <tbody>
                  {data.map((student) => (
                    <tr
                      key={`${student.htno}-${student.rank}`}
                      className="border-b border-[#eee5d7] transition hover:bg-[#fff7e8]"
                    >
                      <TableCell>
                        <span className="inline-flex h-8 min-w-8 items-center justify-center rounded-md bg-[#f3c85b]/30 px-2 font-black text-[#7b4f24]">
                          {student.rank}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="font-extrabold text-[#17211b]">
                          {student.name}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="font-black text-[#1f7a5a]">{student.CGPA}</span>
                      </TableCell>
                      <TableCell>{student.htno}</TableCell>
                      <TableCell>{student.branch}</TableCell>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </section>
    </main>
  );
}

function Metric({ label, value }) {
  return (
    <article className="rounded-lg border border-[#d7ccb9] bg-white px-5 py-4 shadow-sm">
      <p className="text-sm font-semibold text-[#667069]">{label}</p>
      <p className="mt-2 text-3xl font-black text-[#17211b]">{value}</p>
    </article>
  );
}

function TableHead({ children }) {
  return (
    <th className="px-5 py-4 text-sm font-black uppercase tracking-[0.12em]">
      {children}
    </th>
  );
}

function TableCell({ children }) {
  return <td className="px-5 py-4 align-middle text-sm text-[#3d463f]">{children}</td>;
}

function StateMessage({ title, tone = "neutral" }) {
  return (
    <div
      className={`px-5 py-12 text-center font-bold ${
        tone === "error" ? "text-[#b42318]" : "text-[#667069]"
      }`}
    >
      {title}
    </div>
  );
}

async function fetchAverageCgpa(branch, signal) {
  try {
    const response = await fetch(
      `https://rankers-eqqy.onrender.com/${branch}/average`,
      { signal }
    );

    if (!response.ok) return "--";

    const responseText = await response.text();

    try {
      return formatAverage(JSON.parse(responseText));
    } catch {
      return formatAverage(responseText);
    }
  } catch (err) {
    if (err.name === "AbortError") throw err;
    return "--";
  }
}

function formatAverage(payload) {
  const value = extractNumericValue(payload);
  return value === null ? "--" : value.toFixed(2);
}

function extractNumericValue(payload) {
  if (typeof payload === "number" && Number.isFinite(payload)) return payload;
  if (typeof payload === "string") {
    const numericValue = Number(payload);
    return Number.isFinite(numericValue) ? numericValue : null;
  }

  if (!payload || typeof payload !== "object") return null;

  const likelyKeys = ["average", "avg", "averageCgpa", "averageCGPA", "CGPA"];

  for (const key of likelyKeys) {
    const value = extractNumericValue(payload[key]);
    if (value !== null) return value;
  }

  return null;
}

