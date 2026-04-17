"use server";

import { supabase } from "@/lib/supabase";
import { supabaseAdmin } from "@/lib/supabase";

export type Section = "VARC" | "DILR" | "QA";

export type DraftQuestion = {
  label: string; // optional label for standalone questions; send "" if unused
  text: string;
  options: string[];
  answer: number | null;
  explanation: string;
  is_tita: boolean;
  tita_answer: string;
  video_url: string;
};

export type DraftSet = {
  type: "set";
  label: string;
  context: string;
  context_image_urls: string[];
  questions: DraftQuestion[];
};

export type DraftStandalone = {
  type: "standalone";
  question: DraftQuestion;
};

export type DraftGroup = DraftSet | DraftStandalone;

export type SavePaperInput = {
  section: Section;
  year: number;
  slot: number;
  groups: DraftGroup[];
};

export type PYQPaper = {
  id: string;
  section: Section;
  year: number;
  slot: number;
  created_at: string;
};

export async function getPapers(): Promise<PYQPaper[]> {
  const { data, error } = await supabaseAdmin
    .from("pyq_papers")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function deletePaper(id: string): Promise<{ error?: string }> {
  const { error: qError } = await supabaseAdmin
    .from("questions")
    .delete()
    .eq("paper_id", id);
  if (qError) return { error: qError.message };

  const { error: sError } = await supabaseAdmin
    .from("question_sets")
    .delete()
    .eq("paper_id", id);
  if (sError) return { error: sError.message };

  const { error: pError } = await supabaseAdmin
    .from("pyq_papers")
    .delete()
    .eq("id", id);
  if (pError) return { error: pError.message };

  return {};
}

export async function savePaper(
  input: SavePaperInput,
): Promise<{ error?: string; paperId?: string }> {
  const { data: paper, error: paperError } = await supabaseAdmin
    .from("pyq_papers")
    .insert({ section: input.section, year: input.year, slot: input.slot })
    .select()
    .single();

  if (paperError) return { error: paperError.message };

  const paperId = paper.id;

  for (let i = 0; i < input.groups.length; i++) {
    const group = input.groups[i];

    if (group.type === "set") {
      const { data: set, error: setError } = await supabaseAdmin
        .from("question_sets")
        .insert({
          paper_id: paperId,
          label: group.label,
          context: group.context,
          context_images: group.context_image_urls,
          order_index: i,
        })
        .select()
        .single();

      if (setError) return { error: setError.message };

      if (group.questions.length > 0) {
        const { error: qError } = await supabaseAdmin.from("questions").insert(
          group.questions.map((q, qi) => ({
            paper_id: paperId,
            set_id: set.id,
            label: q.label || null, // always null for set questions but kept for consistency
            text: q.text,
            options: q.options,
            answer: q.answer,
            explanation: q.explanation,
            is_tita: q.is_tita,
            tita_answer: q.tita_answer,
            order_index: qi,
            video_url: q.video_url,
          })),
        );
        if (qError) return { error: qError.message };
      }
    } else {
      const q = group.question;
      const { error: qError } = await supabaseAdmin.from("questions").insert({
        paper_id: paperId,
        set_id: null,
        label: q.label || null,
        text: q.text,
        options: q.options,
        answer: q.answer,
        explanation: q.explanation,
        is_tita: q.is_tita,
        tita_answer: q.tita_answer,
        order_index: i,
        video_url: q.video_url,
      });
      if (qError) return { error: qError.message };
    }
  }

  return { paperId };
}

export async function uploadContextImage(
  file: File,
): Promise<{ url?: string; error?: string }> {
  const filename = `${Date.now()}-${file.name}`;
  const { error } = await supabaseAdmin.storage
    .from("content-images")
    .upload(filename, file);

  if (error) return { error: error.message };

  const { data } = supabaseAdmin.storage
    .from("content-images")
    .getPublicUrl(filename);

  return { url: data.publicUrl };
}

export type FullPaper = {
  id: string;
  section: Section;
  year: number;
  slot: number;
  sets: {
    id: string;
    label: string;
    context: string;
    context_images: string[];
    order_index: number;
    questions: {
      id: string;
      label: string | null;
      text: string;
      options: string[];
      answer: number | null;
      explanation: string;
      is_tita: boolean;
      tita_answer: string;
      order_index: number;
      set_id: string | null;
      video_url: string;
    }[];
  }[];
  standalones: {
    id: string;
    label: string | null;
    text: string;
    options: string[];
    answer: number | null;
    explanation: string;
    is_tita: boolean;
    tita_answer: string;
    order_index: number;
    set_id: string | null;
    video_url: string;
  }[];
};

export async function getPaperById(id: string): Promise<FullPaper | null> {
  const { data: paper, error: paperError } = await supabaseAdmin
    .from("pyq_papers")
    .select("*")
    .eq("id", id)
    .single();

  if (paperError || !paper) return null;

  const { data: sets } = await supabaseAdmin
    .from("question_sets")
    .select("*")
    .eq("paper_id", id)
    .order("order_index", { ascending: true });

  const { data: questions } = await supabaseAdmin
    .from("questions")
    .select("*")
    .eq("paper_id", id)
    .order("order_index", { ascending: true });

  const setsWithQuestions = (sets ?? []).map((set) => ({
    ...set,
    questions: (questions ?? []).filter((q) => q.set_id === set.id),
  }));

  const standalones = (questions ?? []).filter((q) => q.set_id === null);

  return { ...paper, sets: setsWithQuestions, standalones };
}

export async function updatePaper(
  id: string,
  input: SavePaperInput,
): Promise<{ error?: string }> {
  const { error: qError } = await supabaseAdmin
    .from("questions")
    .delete()
    .eq("paper_id", id);
  if (qError) return { error: qError.message };

  const { error: sError } = await supabaseAdmin
    .from("question_sets")
    .delete()
    .eq("paper_id", id);
  if (sError) return { error: sError.message };

  const { error: pError } = await supabaseAdmin
    .from("pyq_papers")
    .update({ section: input.section, year: input.year, slot: input.slot })
    .eq("id", id);
  if (pError) return { error: pError.message };

  for (let i = 0; i < input.groups.length; i++) {
    const group = input.groups[i];

    if (group.type === "set") {
      const { data: set, error: setError } = await supabaseAdmin
        .from("question_sets")
        .insert({
          paper_id: id,
          label: group.label,
          context: group.context,
          context_images: group.context_image_urls,
          order_index: i,
        })
        .select()
        .single();

      if (setError) return { error: setError.message };

      if (group.questions.length > 0) {
        const { error: qiError } = await supabaseAdmin.from("questions").insert(
          group.questions.map((q, qi) => ({
            paper_id: id,
            set_id: set.id,
            label: q.label || null,
            text: q.text,
            options: q.options,
            answer: q.answer,
            explanation: q.explanation,
            is_tita: q.is_tita,
            tita_answer: q.tita_answer,
            order_index: qi,
            video_url: q.video_url,
          })),
        );
        if (qiError) return { error: qiError.message };
      }
    } else {
      const q = group.question;
      const { error: qiError } = await supabaseAdmin.from("questions").insert({
        paper_id: id,
        set_id: null,
        label: q.label || null,
        text: q.text,
        options: q.options,
        answer: q.answer,
        explanation: q.explanation,
        is_tita: q.is_tita,
        tita_answer: q.tita_answer,
        order_index: i,
        video_url: q.video_url,
      });
      if (qiError) return { error: qiError.message };
    }
  }

  return {};
}
