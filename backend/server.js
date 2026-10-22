
const express = require("express");
const path = require("path");
const { execFile } = require("child_process");

const app = express();
const PORT = 3001;
const executable = path.join(__dirname, "algovista.exe");

app.use(express.json({ limit: "20kb" }));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "AlgoVista API is running" });
});

app.post("/api/visualize", (req, res) => {
  const {
    category,
    algorithm,
    array,
    target = 0,
    operation = "",
    value = 0
  } = req.body;

  const validCategories = ["sort", "search", "structure"];

  if (!validCategories.includes(category)) {
    return res.status(400).json({ error: "Invalid category" });
  }

  if (!["bubble", "selection", "insertion", "linear", "binary",
        "stack", "queue", "linkedlist"].includes(algorithm)) {
    return res.status(400).json({ error: "Invalid algorithm" });
  }

  if (!Array.isArray(array) || array.length > 100 ||
      !array.every(Number.isSafeInteger)) {
    return res.status(400).json({
      error: "Array must contain at most 100 integers"
    });
  }

  if (category === "sort" &&
      !["bubble", "selection", "insertion"].includes(algorithm)) {
    return res.status(400).json({ error: "Invalid sorting algorithm" });
  }

  if (category === "search" &&
      !["linear", "binary"].includes(algorithm)) {
    return res.status(400).json({ error: "Invalid searching algorithm" });
  }

  if (category === "structure" &&
      !["stack", "queue", "linkedlist"].includes(algorithm)) {
    return res.status(400).json({ error: "Invalid data structure" });
  }

  if (category === "search" && !Number.isSafeInteger(target)) {
    return res.status(400).json({ error: "Target must be an integer" });
  }

  if (category === "structure" && !Number.isSafeInteger(value)) {
    return res.status(400).json({ error: "Value must be an integer" });
  }

  const args = [
    category,
    algorithm,
    array.join(",")
  ];

  if (category === "search") {
    args.push(String(target));
  }

  if (category === "structure") {
    const validOperations = {
      stack: ["push", "pop"],
      queue: ["enqueue", "dequeue"],
      linkedlist: ["insert", "delete"]
    };

    if (!validOperations[algorithm]?.includes(operation)) {
      return res.status(400).json({ error: "Invalid operation" });
    }

    args.push(operation, String(value));
  }

  execFile(
    executable,
    args,
    { timeout: 5000, maxBuffer: 5 * 1024 * 1024 },
    (error, stdout, stderr) => {
      if (error) {
        return res.status(500).json({
          error: stderr.trim() || "C++ execution failed"
        });
      }

      try {
        res.json(JSON.parse(stdout));
      } catch {
        res.status(500).json({ error: "Invalid output from C++ program" });
      }
    }
  );
});

app.listen(PORT, () => {
  console.log(`AlgoVista API running at http://localhost:${PORT}`);
});
