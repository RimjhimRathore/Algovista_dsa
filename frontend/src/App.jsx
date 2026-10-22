
import { useState } from "react";
import "./App.css";

const INITIAL_ARRAY = [8, 3, 6, 1, 5];

const ALGORITHMS = {
  sort: [
    { value: "bubble", label: "Bubble Sort" },
    { value: "selection", label: "Selection Sort" },
    { value: "insertion", label: "Insertion Sort" },
  ],
  search: [
    { value: "linear", label: "Linear Search" },
    { value: "binary", label: "Binary Search" },
  ],
  structure: [
    { value: "stack", label: "Stack" },
    { value: "queue", label: "Queue" },
    { value: "linkedlist", label: "Linked List" },
  ],
};

const ARRAY_PRESETS = [
  { value: "random", label: "Random values" },
  { value: "sorted", label: "Sorted array" },
  { value: "reverse", label: "Reverse sorted" },
  { value: "nearly", label: "Nearly sorted" },
  { value: "duplicates", label: "Duplicate values" },
  { value: "negative", label: "Negative & positive" },
];

const STRUCTURE_OPERATIONS = {
  stack: [
    { value: "push", label: "Push" },
    { value: "pop", label: "Pop" },
  ],
  queue: [
    { value: "enqueue", label: "Enqueue" },
    { value: "dequeue", label: "Dequeue" },
  ],
  linkedlist: [
    { value: "insert", label: "Insert" },
    { value: "delete", label: "Delete" },
  ],
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function createPreset(preset) {
  switch (preset) {
    case "sorted":
      return [2, 5, 8, 12, 17, 21, 26, 32];

    case "reverse":
      return [32, 26, 21, 17, 12, 8, 5, 2];

    case "nearly": {
      const values = [2, 5, 8, 12, 17, 21, 26, 32];
      [values[2], values[3]] = [values[3], values[2]];
      return values;
    }

    case "duplicates":
      return [4, 8, 4, 12, 8, 4, 15, 12];

    case "negative":
      return [-12, 7, -3, 15, 0, -8, 11, 4];

    case "random":
    default:
      return Array.from(
        { length: 8 },
        () => Math.floor(Math.random() * 40) + 1
      );
  }
}

function parseIntegerArray(input) {
  const trimmed = input.trim();

  if (!trimmed) {
    throw new Error("Please enter some integers.");
  }

  const parts = trimmed.split(/[\s,]+/);

  if (parts.some((part) => !/^-?\d+$/.test(part))) {
    throw new Error("Enter integers separated by commas or spaces.");
  }

  const values = parts.map(Number);

  if (!values.every(Number.isSafeInteger)) {
    throw new Error("Please enter valid safe integers.");
  }

  if (values.length > 100) {
    throw new Error("Please use at most 100 integers.");
  }

  return values;
}

function App() {
  const [category, setCategory] = useState("sort");
  const [algorithm, setAlgorithm] = useState("bubble");

  const [arrayInput, setArrayInput] = useState(INITIAL_ARRAY.join(", "));
  const [currentArray, setCurrentArray] = useState(INITIAL_ARRAY);
  const [arrayPreset, setArrayPreset] = useState("random");

  const [target, setTarget] = useState("6");
  const [operation, setOperation] = useState("push");
  const [value, setValue] = useState("10");
  const [speed, setSpeed] = useState(400);

  const [activeIndices, setActiveIndices] = useState([]);
  const [foundIndex, setFoundIndex] = useState(-1);
  const [eventIndex, setEventIndex] = useState(0);
  const [totalEvents, setTotalEvents] = useState(0);

  const [message, setMessage] = useState("Ready to visualize");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const minValue = currentArray.length
    ? Math.min(...currentArray)
    : 0;

  const maxValue = currentArray.length
    ? Math.max(...currentArray)
    : 0;

  function getBarHeight(number) {
    const range = maxValue - minValue;

    if (range === 0) return 100;

    return 45 + ((number - minValue) / range) * 180;
  }

  function clearVisualizationState() {
    setActiveIndices([]);
    setFoundIndex(-1);
    setEventIndex(0);
    setTotalEvents(0);
    setError("");
  }

  function generateArray(preset = arrayPreset) {
    if (busy) return;

    const values = createPreset(preset);

    setArrayPreset(preset);
    setArrayInput(values.join(", "));
    setCurrentArray(values);
    clearVisualizationState();
    setMessage("New array generated");
  }

  function resetVisualization() {
    if (busy) return;

    try {
      const values = parseIntegerArray(arrayInput);

      setCurrentArray(values);
      clearVisualizationState();
      setMessage("Array reset successfully");
    } catch (err) {
      setError(err.message);
    }
  }

  function handleCategoryChange(nextCategory) {
    if (busy) return;

    setCategory(nextCategory);
    setAlgorithm(ALGORITHMS[nextCategory][0].value);

    if (nextCategory === "structure") {
      setOperation(STRUCTURE_OPERATIONS.stack[0].value);
    }

    clearVisualizationState();
    setMessage("Choose an algorithm and start visualization");
  }

  function handleAlgorithmChange(nextAlgorithm) {
    if (busy) return;

    setAlgorithm(nextAlgorithm);

    if (category === "structure") {
      setOperation(STRUCTURE_OPERATIONS[nextAlgorithm][0].value);
    }

    clearVisualizationState();
    setMessage("Algorithm selected");
  }

  async function startVisualization() {
    if (busy) return;

    clearVisualizationState();

    let values;

    try {
      values = parseIntegerArray(arrayInput);
    } catch (err) {
      setError(err.message);
      setMessage("Invalid array");
      return;
    }

    if (category === "search") {
      if (!/^-?\d+$/.test(target.trim()) ||
          !Number.isSafeInteger(Number(target))) {
        setError("Please enter a valid integer to search.");
        setMessage("Invalid target");
        return;
      }
    }

    if (category === "structure") {
      if (!/^-?\d+$/.test(value.trim()) ||
          !Number.isSafeInteger(Number(value))) {
        setError("Please enter a valid integer value.");
        setMessage("Invalid value");
        return;
      }
    }

    if (category === "search" && algorithm === "binary") {
      const isSorted = values.every(
        (number, index) => index === 0 || values[index - 1] <= number
      );

      if (!isSorted) {
        setError(
          "Binary Search requires a sorted array. Choose the Sorted array preset or sort the input yourself."
        );
        setMessage("Array must be sorted");
        return;
      }
    }

    setBusy(true);
    setCurrentArray(values);
    setMessage("Connecting to C++ backend...");

    try {
      const response = await fetch("/api/visualize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          category,
          algorithm,
          array: values,
          target: Number(target),
          operation,
          value: Number(value),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "The backend returned an error.");
      }

      if (!Array.isArray(data.events)) {
        throw new Error("The backend response does not contain events.");
      }

      setTotalEvents(data.events.length);

      for (let i = 0; i < data.events.length; i++) {
        const event = data.events[i];

        await sleep(Number(speed));

        if (Array.isArray(event.array)) {
          setCurrentArray(event.array);
        }

        const indices = [];

        if (Number.isInteger(event.index1) && event.index1 >= 0) {
          indices.push(event.index1);
        }

        if (
          Number.isInteger(event.index2) &&
          event.index2 >= 0 &&
          event.index2 !== event.index1
        ) {
          indices.push(event.index2);
        }

        setActiveIndices(indices);
        setEventIndex(i + 1);

        setMessage(
          event.type
            ? event.type
                .replace(/_/g, " ")
                .replace(/\b\w/g, (character) => character.toUpperCase())
            : "Processing..."
        );
      }

      if (Array.isArray(data.result)) {
        setCurrentArray(data.result);
        setArrayInput(data.result.join(", "));
      }

      const resultIndex = Number.isInteger(data.foundIndex)
        ? data.foundIndex
        : -1;

      setFoundIndex(resultIndex);
      setActiveIndices(resultIndex >= 0 ? [resultIndex] : []);

      if (category === "search") {
        setMessage(
          resultIndex >= 0
            ? `Target found at index ${resultIndex}`
            : "Target not found"
        );
      } else if (category === "sort") {
        setMessage("Sorting completed successfully");
      } else {
        setMessage(data.message || "Operation completed successfully");
      }
    } catch (err) {
      setError(
        err.message || "Unable to complete the visualization."
      );
      setMessage("Visualization failed");
    } finally {
      setBusy(false);
    }
  }

  const progress =
    totalEvents > 0
      ? Math.round((eventIndex / totalEvents) * 100)
      : 0;

  const selectedAlgorithm = ALGORITHMS[category].find(
    (item) => item.value === algorithm
  );

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <div className="brand-icon">A</div>
          <div>
            <h1>AlgoVista</h1>
            <p>Data Structures & Algorithm Visualizer</p>
          </div>
        </div>

        <div className="backend-status">
          <span className="status-dot" />
          C++ Algorithm Engine
        </div>
      </header>

      <main className="main-content">
        <section className="hero">
          <p className="eyebrow">ALGORITHM PLAYGROUND</p>
          <h2>See how algorithms work.</h2>
          <p className="hero-description">
            Choose an algorithm, try different inputs, and follow each
            step as it executes.
          </p>
        </section>

        <section className="workspace">
          <aside className="control-panel">
            <div className="section-heading">
              <span className="step-number">01</span>
              <div>
                <h3>Configuration</h3>
                <p>Choose an algorithm and input</p>
              </div>
            </div>

            <label className="field-label" htmlFor="category">
              Category
            </label>
            <select
              id="category"
              value={category}
              disabled={busy}
              onChange={(event) =>
                handleCategoryChange(event.target.value)
              }
            >
              <option value="sort">Sorting</option>
              <option value="search">Searching</option>
              <option value="structure">Data Structures</option>
            </select>

            <label className="field-label" htmlFor="algorithm">
              Algorithm
            </label>
            <select
              id="algorithm"
              value={algorithm}
              disabled={busy}
              onChange={(event) =>
                handleAlgorithmChange(event.target.value)
              }
            >
              {ALGORITHMS[category].map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>

            <label className="field-label" htmlFor="array-input">
              Array values
            </label>
            <textarea
              id="array-input"
              rows={3}
              value={arrayInput}
              disabled={busy}
              onChange={(event) => setArrayInput(event.target.value)}
              placeholder="Example: 8, 3, 6, 1, 5"
            />
            <p className="field-hint">
              Separate integers with commas or spaces. Maximum 100 values.
            </p>

            <div className="preset-row">
              <div className="preset-field">
                <label className="field-label" htmlFor="array-preset">
                  Array preset
                </label>
                <select
                  id="array-preset"
                  value={arrayPreset}
                  disabled={busy}
                  onChange={(event) =>
                    setArrayPreset(event.target.value)
                  }
                >
                  {ARRAY_PRESETS.map((preset) => (
                    <option key={preset.value} value={preset.value}>
                      {preset.label}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                className="generate-button"
                disabled={busy}
                onClick={() => generateArray()}
              >
                Generate
              </button>
            </div>

            {category === "search" && (
              <>
                <label className="field-label" htmlFor="target">
                  Target value
                </label>
                <input
                  id="target"
                  type="number"
                  value={target}
                  disabled={busy}
                  onChange={(event) => setTarget(event.target.value)}
                />

                {algorithm === "binary" && (
                  <p className="field-hint">
                    Binary Search requires sorted input.
                  </p>
                )}
              </>
            )}

            {category === "structure" && (
              <>
                <label className="field-label" htmlFor="operation">
                  Operation
                </label>
                <select
                  id="operation"
                  value={operation}
                  disabled={busy}
                  onChange={(event) => setOperation(event.target.value)}
                >
                  {STRUCTURE_OPERATIONS[algorithm].map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>

                <label className="field-label" htmlFor="structure-value">
                  Value
                </label>
                <input
                  id="structure-value"
                  type="number"
                  value={value}
                  disabled={busy}
                  onChange={(event) => setValue(event.target.value)}
                />
              </>
            )}

            <div className="speed-heading">
              <label className="field-label" htmlFor="speed">
                Animation speed
              </label>
              <span>{speed} ms</span>
            </div>

            <input
              id="speed"
              type="range"
              min="50"
              max="1000"
              step="50"
              value={speed}
              disabled={busy}
              onChange={(event) => setSpeed(Number(event.target.value))}
            />

            <div className="range-labels">
              <span>Fast</span>
              <span>Slow</span>
            </div>

            <button
              className="primary-button"
              onClick={startVisualization}
              disabled={busy}
            >
              {busy ? "Visualizing..." : "Start Visualization"}
            </button>

            <button
              className="secondary-button"
              onClick={resetVisualization}
              disabled={busy}
            >
              Reset Array
            </button>
          </aside>

          <section className="visualizer-panel">
            <div className="visualizer-heading">
              <div className="section-heading">
                <span className="step-number">02</span>
                <div>
                  <h3>Visualization</h3>
                  <p>{selectedAlgorithm?.label}</p>
                </div>
              </div>

              <span className={`state-pill ${busy ? "running" : ""}`}>
                <span className="status-dot" />
                {busy ? "Running" : "Ready"}
              </span>
            </div>

            <div className="stats-grid">
              <div className="stat-card">
                <span>Array size</span>
                <strong>{currentArray.length}</strong>
              </div>
              <div className="stat-card">
                <span>Steps</span>
                <strong>
                  {eventIndex} / {totalEvents}
                </strong>
              </div>
              <div className="stat-card">
                <span>Progress</span>
                <strong>{progress}%</strong>
              </div>
            </div>

            <div className="array-card">
              <div className="array-card-heading">
                <div>
                  <h4>Array</h4>
                  <p>Each bar represents one array element.</p>
                </div>
                <span className="array-count">
                  {currentArray.length} items
                </span>
              </div>

              <div className="array-stage">
                {currentArray.length === 0 ? (
                  <p className="empty-state">Your array is empty.</p>
                ) : (
                  currentArray.map((number, index) => {
                    const isActive = activeIndices.includes(index);
                    const isFound = foundIndex === index;

                    return (
                      <div className="array-item" key={index}>
                        <div
                          className={[
                            "array-bar",
                            isActive ? "active" : "",
                            isFound ? "found" : "",
                          ]
                            .filter(Boolean)
                            .join(" ")}
                          style={{
                            height: `${getBarHeight(number)}px`,
                          }}
                          title={`Index ${index}: ${number}`}
                        >
                          <span>{number}</span>
                        </div>
                        <span className="array-index">{index}</span>
                      </div>
                    );
                  })
                )}
              </div>

              <div className="legend">
                <span>
                  <i className="legend-normal" /> Unprocessed
                </span>
                <span>
                  <i className="legend-active" /> Active
                </span>
                <span>
                  <i className="legend-found" /> Found
                </span>
              </div>
            </div>

            <div className="execution-card">
              <div>
                <h4>Execution status</h4>
                <p>{message}</p>
              </div>
              <div className="execution-icon">
                {busy ? "…" : error ? "!" : "✓"}
              </div>
            </div>

            {totalEvents > 0 && (
              <div
                className="progress-track"
                role="progressbar"
                aria-valuenow={progress}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div
                  className="progress-fill"
                  style={{ width: `${progress}%` }}
                />
              </div>
            )}

            {error && (
              <div className="error-message" role="alert">
                <strong>Something went wrong</strong>
                <p>{error}</p>
              </div>
            )}
          </section>
        </section>

        <section className="info-section">
          <div>
            <p className="eyebrow">EXPLORE</p>
            <h3>Learn by experimenting.</h3>
          </div>

          <div className="info-cards">
            <article className="info-card">
              <span>01</span>
              <h4>Sorting</h4>
              <p>Compare how different algorithms arrange values.</p>
            </article>

            <article className="info-card">
              <span>02</span>
              <h4>Searching</h4>
              <p>Follow the steps used to find a target element.</p>
            </article>

            <article className="info-card">
              <span>03</span>
              <h4>Data Structures</h4>
              <p>Try operations on stacks, queues, and linked lists.</p>
            </article>
          </div>
        </section>
      </main>

      <footer className="footer">
        <span>AlgoVista</span>
        <span>React · C++ · Data Structures & Algorithms</span>
      </footer>
    </div>
  );
}

export default App;
