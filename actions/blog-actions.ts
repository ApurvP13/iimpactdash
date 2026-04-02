"use server";

import { supabase } from "@/lib/supabase";

export type Blog = {
  id: string;
  title: string;
  blurb: string;
  content: string;
  cover_image_url: string;
  slug: string;
  created_at: string;
  updated_at: string;
};

export async function getBlogs(): Promise<Blog[]> {
  const { data, error } = await supabase
    .from("blogs")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function deleteBlog(id: string): Promise<{ error?: string }> {
  const { error } = await supabase.from("blogs").delete().eq("id", id);
  if (error) return { error: error.message };
  return {};
}
