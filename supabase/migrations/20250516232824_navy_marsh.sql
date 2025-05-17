/*
  # Initial Schema Setup for TaskMe AI

  1. Tables
    - profiles: User profiles with connection status
    - tasks: Core tasks table
    - task_actions: Actions associated with tasks
    - related_emails: Emails linked to tasks
    - related_events: Calendar events linked to tasks

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  avatar_url text,
  is_connected jsonb DEFAULT '{"gmail": false, "calendar": false}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text,
  type text NOT NULL,
  status text DEFAULT 'pending',
  priority text DEFAULT 'medium',
  due_date timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

-- Create task_actions table
CREATE TABLE IF NOT EXISTS task_actions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id uuid REFERENCES tasks(id) ON DELETE CASCADE NOT NULL,
  type text NOT NULL,
  status text DEFAULT 'pending',
  scheduled_for timestamptz,
  completed_at timestamptz,
  details jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create related_emails table
CREATE TABLE IF NOT EXISTS related_emails (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id uuid REFERENCES tasks(id) ON DELETE CASCADE NOT NULL,
  subject text NOT NULL,
  sender text NOT NULL,
  received_at timestamptz NOT NULL,
  snippet text,
  is_read boolean DEFAULT false,
  gmail_id text UNIQUE,
  created_at timestamptz DEFAULT now()
);

-- Create related_events table
CREATE TABLE IF NOT EXISTS related_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id uuid REFERENCES tasks(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  start_time timestamptz NOT NULL,
  end_time timestamptz NOT NULL,
  location text,
  attendees jsonb DEFAULT '[]'::jsonb,
  calendar_id text UNIQUE,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE related_emails ENABLE ROW LEVEL SECURITY;
ALTER TABLE related_events ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can read own tasks"
  ON tasks FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own tasks"
  ON tasks FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tasks"
  ON tasks FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own tasks"
  ON tasks FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policies for task actions
CREATE POLICY "Users can read own task actions"
  ON task_actions FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM tasks 
    WHERE tasks.id = task_actions.task_id 
    AND tasks.user_id = auth.uid()
  ));

-- Policies for related emails
CREATE POLICY "Users can read own related emails"
  ON related_emails FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM tasks 
    WHERE tasks.id = related_emails.task_id 
    AND tasks.user_id = auth.uid()
  ));

-- Policies for related events
CREATE POLICY "Users can read own related events"
  ON related_events FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM tasks 
    WHERE tasks.id = related_events.task_id 
    AND tasks.user_id = auth.uid()
  ));