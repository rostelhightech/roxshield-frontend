'use client';
import "@blocknote/core/fonts/inter.css";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useCreateBlockNote } from "@blocknote/react";
import { useEffect, useMemo } from "react";
import { useTheme } from "@/contexts/theme.context";

interface BlockNoteEditorProps {
  initialContent?: string;
  onChange?: (content: string, markdown?: string) => void;
  editable?: boolean;
}

export function BlockNoteEditor({ initialContent, onChange, editable = true }: BlockNoteEditorProps) {
  const { theme } = useTheme();

  // Parse initial content
  const parsedContent = useMemo(() => {
    if (!initialContent) return undefined;
    try {
      const parsed = JSON.parse(initialContent);
      return Array.isArray(parsed) ? parsed : undefined;
    } catch {
      // Si c'est du texte brut, le convertir en blocks BlockNote
      if (initialContent && initialContent.trim()) {
        return [
          {
            type: 'paragraph',
            content: [{ type: 'text', text: initialContent, styles: {} }],
          },
        ];
      }
      return undefined;
    }
  }, [initialContent]);

  // Creates a new editor instance.
  const editor = useCreateBlockNote({
    initialContent: parsedContent,
  });

  // Handle content changes
  useEffect(() => {
    if (!editor || !onChange) return;

    const handleUpdate = async () => {
      const blocks = editor.document;
      const jsonContent = JSON.stringify(blocks);
      
      // Convertir aussi en markdown pour avoir une version texte simple
      const markdown = await editor.blocksToMarkdownLossy(blocks);
      
      onChange(jsonContent, markdown);
    };

    // Subscribe to editor changes
    editor.onChange(handleUpdate);
  }, [editor, onChange]);

  return (
    <div className="blocknote-editor-wrapper">
      <BlockNoteView 
        editor={editor} 
        editable={editable}
        theme={theme === 'dark' ? 'dark' : 'light'}
      />
    </div>
  );
}