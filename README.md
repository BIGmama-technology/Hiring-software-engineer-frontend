# Collaborative Realtime Document Editing App

![https://github.com/Louai-Zokerburg/Hiring-software-engineer-frontend/blob/louai_boumediene/work/cover.png?raw=true](https://github.com/Louai-Zokerburg/Hiring-software-engineer-frontend/blob/louai_boumediene/work/cover.png?raw=true)

/

## Live Demo

[Live Demo](https://document-colaboration-app-5j1j-ojfu2vmdr-louai-zokerburg.vercel.app/)

## **Overview**

Welcome to my Collaborative Realtime Document Editing App! This application provides a seamless and collaborative environment for users to edit documents in real-time. It leverages cutting-edge technologies to deliver a smooth and efficient user experience with beautiful UI and smooth navigation

## **Features**

- ✨ Astonishing  UI with light and dark theme using the beautiful Shadcn Ui component library
- 🔐 Robust Authentication system using Supabase auth and the Nextjs specifique nextjs-auth-helper package by Supabase.
- 💪 Full CRUD operations using Supabase’s Postgres database system and RLS for secure data retrieval and mutation.
- 👩‍💻 Realtime Collaboration: Edit documents simultaneously with others in real-time using the power of Liveblocks real time infrastructure
- 📃 Tiptap Text Editor and Tiptap collaboration extension
- 🛡 Next.js and TypeScript: Utilize the power of Next.js for efficiency using SSR and server components, coupled with the type safety of TypeScript and Supabase generated database types.

## **Technologies Used**

List the technologies, frameworks, and libraries used in your project.

- Frontend: Next.js, TypeScript, Tailwind CSS, Shadcn UI
- Backend: Supabase
- Realtime Collaboration: Liveblocks

## Resources and additional links

- [Next.js 13 Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Postgres RLS](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)
- [Tailwindcss Docs](https://tailwindcss.com/docs/installation)
- [Shadcn UI Docs](https://ui.shadcn.com/docs)
- [Livebocks Docs](https://liveblocks.io/docs)
- [Yjs Docs](https://yjs.dev/)
- [Livebloks/yjs package](https://liveblocks.io/docs/api-reference/liveblocks-yjs)
- [Supabase’s `@supabase/auth-helpers-nextjs` package](https://supabase.com/docs/guides/auth/auth-helpers/nextjs)
- [Tiptap text editor](https://tiptap.dev/docs/editor/introduction)
- [creating triggers from SQL editor](https://www.youtube.com/watch?v=mcrqn77lUmM)

## **Installation and usage**

1. Clone the GitHub Repo and switch to my branch

```bash
git clone https://github.com/Louai-Zokerburg/Hiring-software-engineer-frontend.git

git checkout boumediene_louai/work
```

1. Create `.env.local` file and initialize the following variables.

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
LIVEBLOCKS_SECRET_KEY=
```

<aside>
💡 How to get the values of the variables

`NEXT_PUBLIC_SUPABASE_URL` and  `NEXT_PUBLIC_SUPABASE_ANON_KEY` you can get it from [Supabase dashboard](https://supabase.com/dashboard/) > Project  > Settings > API

`LIVEBLOCKS_SECRET_KEY` from [liveblocks dashboard](https://liveblocks.io/dashboard/) > project > API keys

</aside>

1. Install all necessary packages

```bash
npm install
```

1. Setup the Supabase project and configure the database and RLS
    1. Create a new Supabase project
    2. Create new table called **`docs`**
        
        
        | Column | foreign key | type | default value | primary |
        | --- | --- | --- | --- | --- |
        | doc_id |  | uuid | gen_random_uuid() | true |
        | creator_name | public.user.id | uuid | not null |  |
        | title |  | text | null |  |
        | content |  | text | null |  |
        | public |  | Boolean | true |  |
        
         go to SQL editor and create the Following RLS policies on the `docs` table
        
        ```sql
        CREATE POLICY "Enable read only for public docs" ON "public"."docs"
        AS PERMISSIVE FOR SELECT
        TO public
        USING (public = true)
        ```
        
        ```sql
        CREATE POLICY "Enable all actions based on creator id" ON "public"."docs"
        AS PERMISSIVE FOR ALL
        TO public
        USING ((auth.uid() = creator_id))
        WITH CHECK ((auth.uid() = creator_id))
        ```
        
    3. Create new table called `users`
        
        
        | Column | foreign key | type | default value | primary |
        | --- | --- | --- | --- | --- |
        | id |  | uuid | gen_random_uuid() | true |
        | email |  | text | not null |  |
        | name |  | text | not null |  |
        
         go to SQL editor and create the Following RLS policies on the `users` table
        
        ```sql
        CREATE POLICY "Enable read access to all users" ON "public"."users"
        AS PERMISSIVE FOR SELECT
        TO public
        USING (true)
        ```
        
    4. Create new function on the `public` Schema called `insert_user_in_users_table_on_signup`
        
        ```
        begin
          insert into public.users(id, name, email)
          values (
            new.id,
            new.raw_user_meta_data->>'name',
            new.email
          );
        
          return new;
        end;
        ```
        
    5. Create a new trigger on the `auth` schema from the SQL Editor ([you can’t manipulate `auth` schema from UI according to latest Supabase updates](https://www.reddit.com/r/Supabase/comments/16uiokd/why_cant_i_create_a_trigger_on_authusers_table/))
        
        ```sql
        create trigger on_auth_user_inserted after insert on auth.users for each row execute function insert_user_in_users_table_on_signup();
        ```
        
2. Run the code locally in your machine
    
    ```bash
    npm run dev
    ```
    
    and access it on `http://localhost:3000/`