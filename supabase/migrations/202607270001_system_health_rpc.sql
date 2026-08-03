-- =====================================================
-- Policies
-- =====================================================

create or replace function public.system_health_policies()
returns table (
    tablename text,
    policyname text
)
language sql
security definer
set search_path = public
as
$$
select
    tablename,
    policyname
from pg_policies
where schemaname = 'public';
$$;

grant execute on function public.system_health_policies()
to service_role;

-- =====================================================
-- Indexes
-- =====================================================

create or replace function public.system_health_indexes()
returns table (
    indexname text
)
language sql
security definer
set search_path = public
as
$$
select
    indexname
from pg_indexes
where schemaname = 'public';
$$;

grant execute on function public.system_health_indexes()
to service_role;

-- =====================================================
-- Triggers
-- =====================================================

create or replace function public.system_health_triggers()
returns table (
    trigger_name text
)
language sql
security definer
set search_path = public
as
$$
select
    trigger_name
from information_schema.triggers
where trigger_schema = 'public';
$$;

grant execute on function public.system_health_triggers()
to service_role;