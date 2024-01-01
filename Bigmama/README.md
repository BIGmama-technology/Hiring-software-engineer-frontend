
# Real-Time Document Collaboration Platform

made with next 14 supabase and liveblocks


## Run Locally

Clone the project

```bash
  git clone https://github.com/Bretis2019/Hiring-software-engineer-frontend.git
```

Go to the project directory

```bash
  cd Bigmama
```

Go to the my branch

```bash
  git checkout Added-document-creation-#9

```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run dev
```


## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`LIVEBLOCKS_SECRET_KEY`

`NEXT_PUBLIC_SUPABASE_URL`

`NEXT_PUBLIC_SUPABASE_ANON_KEY`


## Database Setup

Create a Supabase project at Supabase Dashboard.

Go to the SQL Editor in your Supabase project and execute the following SQL queries:

```sql
  -- Create a table for public profiles
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
  updated_at TIMESTAMP WITH TIME ZONE,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  website TEXT,
  profile_color VARCHAR(7),
  rooms TEXT[],  -- Adding an array of strings for rooms
  CONSTRAINT username_length CHECK (CHAR_LENGTH(username) >= 3)
);

-- Set up Row Level Security (RLS)
ALTER TABLE profiles
  ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone." ON profiles
  FOR SELECT USING (TRUE);

CREATE POLICY "Users can insert their own profile." ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile." ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- This trigger automatically creates a profile entry when a new user signs up via Supabase Auth.
CREATE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url, rooms)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'avatar_url', ARRAY[]::TEXT[]);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Set up Storage!
INSERT INTO storage.buckets (id, name)
  VALUES ('avatars', 'avatars');

-- Set up access controls for storage.
CREATE POLICY "Avatar images are publicly accessible." ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Anyone can upload an avatar." ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'avatars');

```


  

## Set up Authentication Providers

  

**Discord Authentication**

1. In the "Authentication" tab, find the "Discord" provider.

2. Enable the Discord provider.

3. Head over to the [Discord Developer Portal](https://discord.com/developers/applications) and create a new application.

4. In the Oauth2 tab, copy the client ID and secret back to Supabase.

5. From Supabse copy Callback URL and paste in the discord Oauth2 tab.

**Google Authentication**

Mainly the same steps as Discord but feel free to check out [this](https://www.youtube.com/watch?v=_XM9ziOzWk4) tutorial from Supabase.

## Features

- Social login using supabase
- Profile customization
- Collaborative documents
- Live document editing


## Screenshots

![Social login](https://i.imgur.com/UxT9Aoh.jpeg)
![Document creation](https://i.imgur.com/0NMs60a.png)
![Profile page](https://i.imgur.com/6gFMa2h.png)
![Collaborative document editing](https://i.imgur.com/aGJceus.jpeg)

