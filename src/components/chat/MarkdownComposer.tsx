import { forwardRef, useEffect, useImperativeHandle } from "react";
import { EditorContent, useEditor, useEditorState } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Markdown } from "@tiptap/markdown";
import Placeholder from "@tiptap/extension-placeholder";
import CharacterCount from "@tiptap/extension-character-count";

export type MarkdownComposerHandle = {
  getMarkdown: () => string;
  clear: () => void;
  focus: () => void;
};

type Props = {
  initialMarkdown: string;
  disabled: boolean;
  onChange: (markdown: string) => void;
};

/**
 * Editor visual com atalhos Markdown nativos do Tiptap.
 *
 * É carregado sob demanda ao abrir o chat. O componente pai conserva
 * o rascunho em Markdown, permitindo recolher/reabrir o editor sem perder
 * formatação ou enviar HTML para o backend.
 */
export const MarkdownComposer = forwardRef<MarkdownComposerHandle, Props>(
  function MarkdownComposer({ initialMarkdown, disabled, onChange }, ref) {
    const editor = useEditor({
      extensions: [
        StarterKit.configure({
          link: { openOnClick: false, autolink: false, linkOnPaste: false },
        }),
        Markdown,
        Placeholder.configure({ placeholder: "Pergunte sobre a reforma..." }),
        CharacterCount.configure({ limit: 1800 }),
      ],
      content: initialMarkdown,
      contentType: "markdown",
      immediatelyRender: false,
      editorProps: {
        attributes: {
          role: "textbox",
          "aria-label": "Mensagem para o Reforminha",
          "aria-multiline": "true",
          "aria-describedby": "reforminha-editor-help",
          spellcheck: "true",
          className:
            "min-h-10 px-3 py-2 text-sm leading-relaxed text-ink outline-none",
        },
      },
      onUpdate: ({ editor: current }) => onChange(current.getMarkdown()),
    });

    // A instância do editor não provoca re-render a cada transação.
    // Observar o estado do ProseMirror atualiza os botões imediatamente após
    // clicar, trocar a seleção ou entrar/sair de um trecho formatado.
    const formatting = useEditorState({
      editor,
      selector: ({ editor: current }) => ({
        bold: current?.isActive("bold") ?? false,
        italic: current?.isActive("italic") ?? false,
        heading: current?.isActive("heading", { level: 2 }) ?? false,
        bulletList: current?.isActive("bulletList") ?? false,
        orderedList: current?.isActive("orderedList") ?? false,
        code: current?.isActive("code") ?? false,
      }),
    });

    useEffect(() => {
      editor?.setEditable(!disabled);
    }, [editor, disabled]);

    useEffect(() => {
      editor?.commands.focus();
    }, [editor]);

    useImperativeHandle(
      ref,
      () => ({
        getMarkdown: () => editor?.getMarkdown() ?? "",
        clear: () => {
          editor?.commands.clearContent();
        },
        focus: () => {
          editor?.commands.focus();
        },
      }),
      [editor],
    );

    const controls = [
      {
        label: "Negrito",
        title: "Negrito (Ctrl+B)",
        text: "B",
        className: "font-bold",
        active: formatting?.bold,
        action: () => editor?.chain().focus().toggleBold().run(),
      },
      {
        label: "Itálico",
        title: "Itálico (Ctrl+I)",
        text: "I",
        className: "italic",
        active: formatting?.italic,
        action: () => editor?.chain().focus().toggleItalic().run(),
      },
      {
        label: "Título",
        title: "Título de seção",
        text: "H",
        className: "font-semibold",
        active: formatting?.heading,
        action: () => editor?.chain().focus().toggleHeading({ level: 2 }).run(),
      },
      {
        label: "Lista com marcadores",
        title: "Lista com marcadores",
        text: "•",
        className: "font-semibold",
        active: formatting?.bulletList,
        action: () => editor?.chain().focus().toggleBulletList().run(),
      },
      {
        label: "Lista numerada",
        title: "Lista numerada",
        text: "1.",
        className: "font-semibold",
        active: formatting?.orderedList,
        action: () => editor?.chain().focus().toggleOrderedList().run(),
      },
      {
        label: "Código",
        title: "Código",
        text: "</>",
        className: "font-mono text-[10px]",
        active: formatting?.code,
        action: () => editor?.chain().focus().toggleCode().run(),
      },
    ];

    return (
      <div className="chat-md-composer min-w-0 flex-1 overflow-hidden rounded-xl border border-line-strong bg-white focus-within:outline-2 focus-within:outline-accent">
        <div
          role="toolbar"
          aria-label="Formatar mensagem"
          className="flex flex-wrap items-center gap-0.5 border-b border-line px-1.5 py-1"
        >
          {controls.map((button) => (
            <button
              key={button.label}
              type="button"
              title={button.title}
              aria-label={button.label}
              aria-pressed={button.active ?? false}
              disabled={disabled || !editor}
              onMouseDown={(event) => event.preventDefault()}
              onClick={button.action}
              className={
                "flex size-8 items-center justify-center rounded-md text-xs text-brand hover:bg-soft disabled:opacity-40 " +
                button.className +
                (button.active ? " bg-soft ring-1 ring-line-strong" : "")
              }
            >
              {button.text}
            </button>
          ))}
        </div>
        <EditorContent
          editor={editor}
          className="max-h-28 min-h-12 overflow-y-auto"
        />
      </div>
    );
  },
);
