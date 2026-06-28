# Week 2 Task Library Data Model

This schema supports the task library, task detail pages, workspace starter files, visible tests,
hidden tests, and rubric-based scoring.

## Core Entities

### `tasks`

Stores the task listing and detail metadata.

- `slug`: stable URL identifier, for example `csv-parser`.
- `title`, `summary`, `instructions`: user-facing task content.
- `category`: skill area such as Python Debugging, Docker, Security, or Code Review.
- `difficulty`: `beginner`, `intermediate`, or `advanced`.
- `estimated_minutes`: expected completion time.
- `tags`: searchable skill tags such as `Python`, `File I/O`, or `Error Handling`.
- `status`: `draft`, `published`, or `archived`.
- `created_by`: admin profile that created the task.

### `task_files`

Stores all files attached to a task.

- `starter`: code or data shown to the learner in the workspace.
- `visible_test`: test files learners can inspect before submitting.
- `hidden_test`: private tests used after submission.
- `solution_reference`: reviewer/admin-only reference implementation or notes.
- `supporting`: documentation, fixtures, or other visible support files.

### `rubrics`

Connects a task to a scoring rubric. Each task can have one active rubric.

### `rubric_items`

Stores each rubric criterion with its own point value and display order.

## Access Rules

- Developers can read published tasks, rubrics, rubric items, starter files, visible tests, and
  supporting files.
- Developers cannot read hidden tests or solution references.
- Reviewers can read all task material so they can evaluate submissions.
- Admins can create, update, delete, and read all task material.
