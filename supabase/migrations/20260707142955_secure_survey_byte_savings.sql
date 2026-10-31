begin;

create schema if not exists private;

drop view if exists public.survey_byte_savings;

create table public.survey_byte_savings (
  question_id text,
  answer text,
  avg_daily_bytes_saved numeric,
  avg_daily_compressions numeric
);

alter table public.survey_byte_savings enable row level security;

create policy "Survey byte savings are publicly readable"
  on public.survey_byte_savings
  for select
  to anon, authenticated
  using (true);

revoke all on schema private from public, anon, authenticated;
grant usage on schema private to service_role;

create or replace function private.refresh_survey_byte_savings()
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  truncate table public.survey_byte_savings;

  insert into public.survey_byte_savings (
    question_id,
    answer,
    avg_daily_bytes_saved,
    avg_daily_compressions
  )
  select
    sa.question_id,
    sa.answer,
    avg(c.bytes_saved / greatest(extract(day from now() - u.created_at), 1::numeric)) as avg_daily_bytes_saved,
    avg(c.compression_count::numeric / greatest(extract(day from now() - u.created_at), 1::numeric)) as avg_daily_compressions
  from public."SurveyAnswers" sa
  join (
    select
      compressions.user_id,
      sum(compressions.bytes_saved) as bytes_saved,
      count(*) as compression_count
    from public.compressions
    group by compressions.user_id
  ) c on sa.user_id = c.user_id
  join auth.users u on sa.user_id = u.id
  where u.created_at < (now() - '1 day'::interval)
  group by sa.question_id, sa.answer;
end;
$$;

revoke all on function private.refresh_survey_byte_savings() from public, anon, authenticated;
grant execute on function private.refresh_survey_byte_savings() to service_role;

select private.refresh_survey_byte_savings();

revoke all on public.survey_byte_savings from public, anon, authenticated;
grant select on public.survey_byte_savings to anon, authenticated;

commit;
