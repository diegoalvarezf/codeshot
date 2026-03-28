export type Framework = "react" | "vue" | "html";

export interface Message {
  role: "user" | "assistant";
  content: string;
}

export const FRAMEWORKS: { id: Framework; label: string; color: string }[] = [
  { id: "react", label: "React", color: "#61dafb" },
  { id: "vue", label: "Vue", color: "#42b883" },
  { id: "html", label: "HTML/CSS/JS", color: "#f16529" },
];
