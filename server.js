/**
 * Project 4: Full Stack Backend - DecodeLabs Intern Management API
 * Demonstrates: RESTful principles, CORS, HTTP status codes, JSON responses
 */

const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors()); // Enables CORS so frontend (different origin) can communicate
app.use(express.json()); // Parses incoming JSON request bodies

// ─── In-Memory Database ───────────────────────────────────────────────────────
let interns = [
  { id: 1, name: 'Aarav Sharma',   role: 'Frontend Developer', batch: '2026', skills: ['HTML', 'CSS', 'React'],           status: 'active'   },
  { id: 2, name: 'Priya Patel',    role: 'Backend Developer',  batch: '2026', skills: ['Node.js', 'MongoDB', 'Express'],  status: 'active'   },
  { id: 3, name: 'Rohan Mehta',    role: 'Full Stack Dev',     batch: '2026', skills: ['React', 'Node.js', 'PostgreSQL'], status: 'active'   },
  { id: 4, name: 'Sneha Gupta',    role: 'UI/UX Designer',     batch: '2026', skills: ['Figma', 'CSS', 'Tailwind'],       status: 'inactive' },
  { id: 5, name: 'Vikram Nair',    role: 'DevOps Intern',      batch: '2026', skills: ['Docker', 'Linux', 'CI/CD'],       status: 'active'   },
];
let nextId = 6;

// ─── Routes ───────────────────────────────────────────────────────────────────

// GET /api/interns — Retrieve all interns (idempotent ✓)
app.get('/api/interns', (req, res) => {
  res.status(200).json({
    success: true,
    count: interns.length,
    data: interns,
  });
});

// GET /api/interns/:id — Retrieve a single intern by ID
app.get('/api/interns/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const intern = interns.find(i => i.id === id);

  if (!intern) {
    return res.status(404).json({ success: false, message: `Intern with id ${id} not found.` });
  }

  res.status(200).json({ success: true, data: intern });
});

// POST /api/interns — Create a new intern (not idempotent ✗)
app.post('/api/interns', (req, res) => {
  const { name, role, batch, skills } = req.body;

  // Validation — return 400 if required fields are missing
  if (!name || !role) {
    return res.status(400).json({ success: false, message: 'Name and role are required fields.' });
  }

  const newIntern = {
    id: nextId++,
    name,
    role,
    batch: batch || '2026',
    skills: skills || [],
    status: 'active',
  };

  interns.push(newIntern);
  res.status(201).json({ success: true, message: 'Intern registered successfully.', data: newIntern });
});

// PUT /api/interns/:id — Replace entire intern record (idempotent ✓)
app.put('/api/interns/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = interns.findIndex(i => i.id === id);

  if (index === -1) {
    return res.status(404).json({ success: false, message: `Intern with id ${id} not found.` });
  }

  const { name, role, batch, skills, status } = req.body;
  if (!name || !role) {
    return res.status(400).json({ success: false, message: 'Name and role are required.' });
  }

  interns[index] = { id, name, role, batch: batch || '2026', skills: skills || [], status: status || 'active' };
  res.status(200).json({ success: true, message: 'Intern profile updated.', data: interns[index] });
});

// PATCH /api/interns/:id — Partial update (not idempotent ✗ in general)
app.patch('/api/interns/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = interns.findIndex(i => i.id === id);

  if (index === -1) {
    return res.status(404).json({ success: false, message: `Intern with id ${id} not found.` });
  }

  interns[index] = { ...interns[index], ...req.body, id }; // Merge changes
  res.status(200).json({ success: true, message: 'Intern partially updated.', data: interns[index] });
});

// DELETE /api/interns/:id — Remove an intern (idempotent ✓)
app.delete('/api/interns/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = interns.findIndex(i => i.id === id);

  if (index === -1) {
    return res.status(404).json({ success: false, message: `Intern with id ${id} not found.` });
  }

  const deleted = interns.splice(index, 1)[0];
  res.status(200).json({ success: true, message: `Intern "${deleted.name}" removed.`, data: deleted });
});

// ─── 404 Fallback ─────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found.' });
});

// ─── Start Server ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n✅ DecodeLabs Intern API running on http://localhost:${PORT}`);
  console.log(`   GET    http://localhost:${PORT}/api/interns`);
  console.log(`   POST   http://localhost:${PORT}/api/interns`);
  console.log(`   PUT    http://localhost:${PORT}/api/interns/:id`);
  console.log(`   PATCH  http://localhost:${PORT}/api/interns/:id`);
  console.log(`   DELETE http://localhost:${PORT}/api/interns/:id\n`);
});
