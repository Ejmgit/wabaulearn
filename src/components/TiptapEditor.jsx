"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

export default function Tiptap() {
  const editor = useEditor({
    extensions: [StarterKit],
    content: "<p>Hello World! 🌎️</p>",
    immediatelyRender: false,
  });

  if (!editor) {
    return null;
  }

  return <EditorContent editor={editor} />;
}
