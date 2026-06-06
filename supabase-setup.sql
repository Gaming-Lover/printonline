-- Run in Supabase SQL editor after creating the project.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('documents', 'documents', false, 52428800, array['application/pdf','image/jpeg','image/png'])
on conflict (id) do update set public = false, file_size_limit = 52428800, allowed_mime_types = array['application/pdf','image/jpeg','image/png'];

create policy "Service role manages documents" on storage.objects
for all using (bucket_id = 'documents') with check (bucket_id = 'documents');
