do $$
declare
  seed_admin_id uuid;
  python_task_id uuid;
  docker_task_id uuid;
  git_task_id uuid;
  ai_review_task_id uuid;
  rubric_id uuid;
  seed_task_id uuid;
begin
  select id into seed_admin_id
  from public.profiles
  where role = 'admin'::public.app_role
  order by created_at
  limit 1;

  if seed_admin_id is null then
    raise notice 'Skipping sample task seed because no admin profile exists yet.';
    return;
  end if;

  insert into public.tasks (
    slug,
    title,
    summary,
    instructions,
    category,
    difficulty,
    estimated_minutes,
    tags,
    status,
    created_by,
    published_at
  )
  values (
    'csv-parser',
    'Fix broken Python CSV parser',
    'The parser works for simple files but fails on empty rows, quoted commas, and missing headers.',
    'Investigate the existing CSV parser, fix the edge cases, update the tests, and explain the changes you made.',
    'Python Debugging',
    'intermediate',
    35,
    array['Python', 'File I/O', 'Error Handling', 'String Parsing'],
    'published',
    seed_admin_id,
    now()
  )
  on conflict (slug) do update set
    title = excluded.title,
    summary = excluded.summary,
    instructions = excluded.instructions,
    category = excluded.category,
    difficulty = excluded.difficulty,
    estimated_minutes = excluded.estimated_minutes,
    tags = excluded.tags,
    status = excluded.status,
    published_at = excluded.published_at
  returning id into python_task_id;

  insert into public.tasks (
    slug,
    title,
    summary,
    instructions,
    category,
    difficulty,
    estimated_minutes,
    tags,
    status,
    created_by,
    published_at
  )
  values (
    'docker-multistage',
    'Fix Docker multi-stage build',
    'The Dockerfile builds locally but fails in CI. Fix the multi-stage build and reduce the final image size.',
    'Review the Dockerfile and CI logs, fix the missing dependency and stage-copy issue, and keep the runtime image small.',
    'Docker',
    'intermediate',
    30,
    array['Docker', 'CI/CD', 'Build Optimization'],
    'published',
    seed_admin_id,
    now()
  )
  on conflict (slug) do update set
    title = excluded.title,
    summary = excluded.summary,
    instructions = excluded.instructions,
    category = excluded.category,
    difficulty = excluded.difficulty,
    estimated_minutes = excluded.estimated_minutes,
    tags = excluded.tags,
    status = excluded.status,
    published_at = excluded.published_at
  returning id into docker_task_id;

  insert into public.tasks (
    slug,
    title,
    summary,
    instructions,
    category,
    difficulty,
    estimated_minutes,
    tags,
    status,
    created_by,
    published_at
  )
  values (
    'git-rebase',
    'Resolve Git rebase conflict',
    'A feature branch has conflicts after rebasing onto main. Resolve the conflicts and maintain both changes.',
    'Inspect both sides of the conflict, preserve the intended behavior, run the tests, and summarize the resolution.',
    'Git',
    'beginner',
    20,
    array['Git', 'Version Control', 'Conflict Resolution'],
    'published',
    seed_admin_id,
    now()
  )
  on conflict (slug) do update set
    title = excluded.title,
    summary = excluded.summary,
    instructions = excluded.instructions,
    category = excluded.category,
    difficulty = excluded.difficulty,
    estimated_minutes = excluded.estimated_minutes,
    tags = excluded.tags,
    status = excluded.status,
    published_at = excluded.published_at
  returning id into git_task_id;

  insert into public.tasks (
    slug,
    title,
    summary,
    instructions,
    category,
    difficulty,
    estimated_minutes,
    tags,
    status,
    created_by,
    published_at
  )
  values (
    'ai-dockerfile-review',
    'Review AI-generated Dockerfile',
    'Review an AI-generated Dockerfile and identify security issues, inefficiencies, and best practice violations.',
    'Read the generated Dockerfile, identify security and reliability issues, and write clear review comments with fixes.',
    'Code Review',
    'intermediate',
    25,
    array['Docker', 'Security', 'Code Review', 'AI Evaluation'],
    'published',
    seed_admin_id,
    now()
  )
  on conflict (slug) do update set
    title = excluded.title,
    summary = excluded.summary,
    instructions = excluded.instructions,
    category = excluded.category,
    difficulty = excluded.difficulty,
    estimated_minutes = excluded.estimated_minutes,
    tags = excluded.tags,
    status = excluded.status,
    published_at = excluded.published_at
  returning id into ai_review_task_id;

  delete from public.task_files
  where task_id in (python_task_id, docker_task_id, git_task_id, ai_review_task_id);

  insert into public.task_files (task_id, file_path, language, file_role, content, sort_order)
  values
    (python_task_id, 'parser.py', 'Python', 'starter', '# Fix parse_csv without changing its public signature.', 1),
    (python_task_id, 'test_parser.py', 'Python', 'visible_test', '# Visible tests cover empty files and quoted commas.', 2),
    (python_task_id, 'hidden_csv_edge_cases.py', 'Python', 'hidden_test', '# Hidden tests cover malformed rows and line endings.', 3),
    (docker_task_id, 'Dockerfile', 'Dockerfile', 'starter', '# Multi-stage Dockerfile with a CI-only failure.', 1),
    (docker_task_id, 'build.test.sh', 'Shell', 'visible_test', '# Visible test builds and runs the container.', 2),
    (docker_task_id, 'image_size.hidden.sh', 'Shell', 'hidden_test', '# Hidden test checks final image size.', 3),
    (git_task_id, 'profile_service.ts', 'TypeScript', 'starter', '// Resolve the conflict while preserving both behaviors.', 1),
    (git_task_id, 'profile_service.test.ts', 'TypeScript', 'visible_test', '// Visible tests confirm validation and formatting.', 2),
    (git_task_id, 'diff_quality.hidden.ts', 'TypeScript', 'hidden_test', '// Hidden checks guard against unrelated changes.', 3),
    (ai_review_task_id, 'Dockerfile.generated', 'Dockerfile', 'starter', '# Review this generated Dockerfile for production risks.', 1),
    (ai_review_task_id, 'review_template.md', 'Markdown', 'starter', '## Findings\n\n## Suggested fixes\n', 2),
    (ai_review_task_id, 'security_findings.hidden.md', 'Markdown', 'hidden_test', 'Hidden evaluator checks high-impact findings.', 3);

  delete from public.rubrics
  where task_id in (python_task_id, docker_task_id, git_task_id, ai_review_task_id);

  foreach seed_task_id in array array[python_task_id, docker_task_id, git_task_id, ai_review_task_id]
  loop
    insert into public.rubrics (task_id, title, description, total_points)
    values (
      seed_task_id,
      'Scoring rubric',
      'Scores correctness, edge cases, code quality, tests, and explanation quality.',
      100
    )
    returning id into rubric_id;

    insert into public.rubric_items (rubric_id, position, label, description, max_points)
    values
      (rubric_id, 1, 'Correctness', 'The solution satisfies the required behavior.', 40),
      (rubric_id, 2, 'Edge cases', 'The solution handles realistic boundary and failure cases.', 20),
      (rubric_id, 3, 'Code quality', 'The implementation is simple, readable, and maintainable.', 20),
      (rubric_id, 4, 'Testing', 'The solution adds or updates useful tests.', 10),
      (rubric_id, 5, 'Explanation', 'The submission explains the approach and assumptions.', 10);
  end loop;
end $$;
