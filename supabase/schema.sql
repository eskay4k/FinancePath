-- Run in your FinancePath Supabase project's SQL editor.
-- No passwords are stored in this table. Supabase Auth handles credentials.
create table if not exists public.financepath_learning_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  nickname text not null check (length(trim(nickname)) between 1 and 40),
  progress jsonb not null,
  revision bigint not null default 1,
  updated_at timestamptz not null default now()
);
alter table public.financepath_learning_profiles enable row level security;
revoke all on public.financepath_learning_profiles from anon, authenticated;
grant select on public.financepath_learning_profiles to authenticated;
create policy "Read own learning profile" on public.financepath_learning_profiles
  for select to authenticated using ((select auth.uid()) = user_id);

-- Compare-and-swap prevents a stale browser silently overwriting another device.
create or replace function public.save_financepath_profile(p_nickname text, p_progress jsonb, p_revision bigint)
returns bigint language plpgsql security definer set search_path = '' as $$
declare current_user_id uuid := auth.uid(); next_revision bigint;
begin
  if current_user_id is null then raise exception 'Authentication required'; end if;
  if length(trim(p_nickname)) not between 1 and 40 or p_progress is null
     or jsonb_typeof(p_progress) <> 'object' or p_progress->>'version' is distinct from '1'
     or octet_length(p_progress::text) > 1048576 then
    raise exception 'Invalid learning data';
  end if;
  if p_revision = 0 then
    insert into public.financepath_learning_profiles(user_id, nickname, progress)
      values(current_user_id, trim(p_nickname), p_progress)
      on conflict (user_id) do nothing returning revision into next_revision;
  else
    update public.financepath_learning_profiles set nickname=trim(p_nickname), progress=p_progress,
      revision=revision+1, updated_at=now()
      where user_id=current_user_id and revision=p_revision returning revision into next_revision;
  end if;
  if next_revision is null then raise exception 'SYNC_CONFLICT'; end if;
  return next_revision;
end; $$;
revoke all on function public.save_financepath_profile(text,jsonb,bigint) from public, anon;
grant execute on function public.save_financepath_profile(text,jsonb,bigint) to authenticated;

-- Deletes only the authenticated user's account and its cascaded learning row.
create or replace function public.delete_financepath_account()
returns void language plpgsql security definer set search_path = '' as $$
begin
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  if extract(epoch from now()) - (auth.jwt()->>'iat')::bigint > 300 then
    raise exception 'Please sign in again before deleting your account';
  end if;
  delete from auth.users where id = auth.uid();
end; $$;
revoke all on function public.delete_financepath_account() from public, anon;
grant execute on function public.delete_financepath_account() to authenticated;
