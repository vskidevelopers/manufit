// components/ui/RichTextEditor.tsx
'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import { Button } from '@/components/ui/button';
import {
    Bold, Italic, List, ListOrdered, Link as LinkIcon, Image as ImageIcon, Undo, Redo, Code,
} from 'lucide-react';
import { useEffect } from 'react';

interface RichTextEditorProps {
    content: string;
    onChange: (content: string) => void;
    placeholder?: string;
}

export function RichTextEditor({ content, onChange, placeholder = 'Write a description...' }: RichTextEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: { levels: [2, 3] }, // Only allow h2, h3
            }),
            Image.configure({ inline: true, allowBase64: false }),
            Link.configure({ openOnClick: false, HTMLAttributes: { class: 'text-blue-600 underline' } }),
        ],
        content,
        editorProps: {
            attributes: {
                class: 'prose prose-sm max-w-none focus:outline-none min-h-[120px] p-3',
            },
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
    });

    // Sync external content changes to editor
    useEffect(() => {
        if (editor && content !== editor.getHTML()) {
            editor.commands.setContent(content);
        }
    }, [content, editor]);

    if (!editor) return <div className="h-32 animate-pulse bg-slate-100 rounded-md" />;

    const addImage = () => {
        const url = window.prompt('Enter image URL');
        if (url) editor.chain().focus().setImage({ src: url }).run();
    };

    const addLink = () => {
        const url = window.prompt('Enter link URL');
        if (url) editor.chain().focus().setLink({ href: url }).run();
    };

    return (
        <div className="border rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-blue-500/20">
            {/* Toolbar */}
            <div className="flex flex-wrap gap-1 p-2 bg-slate-50 border-b">
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    disabled={!editor.can().chain().focus().toggleBold().run()}
                    aria-label="Bold"
                >
                    <Bold className={`h-4 w-4 ${editor.isActive('bold') ? 'text-blue-600' : ''}`} />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    disabled={!editor.can().chain().focus().toggleItalic().run()}
                    aria-label="Italic"
                >
                    <Italic className={`h-4 w-4 ${editor.isActive('italic') ? 'text-blue-600' : ''}`} />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    aria-label="Bullet List"
                >
                    <List className={`h-4 w-4 ${editor.isActive('bulletList') ? 'text-blue-600' : ''}`} />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    aria-label="Numbered List"
                >
                    <ListOrdered className={`h-4 w-4 ${editor.isActive('orderedList') ? 'text-blue-600' : ''}`} />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={addLink}
                    aria-label="Add Link"
                >
                    <LinkIcon className={`h-4 w-4 ${editor.isActive('link') ? 'text-blue-600' : ''}`} />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={addImage}
                    aria-label="Add Image"
                >
                    <ImageIcon className="h-4 w-4" />
                </Button>
                <div className="w-px h-6 bg-slate-200 mx-1" />
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().chain().focus().undo().run()}
                    aria-label="Undo"
                >
                    <Undo className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={!editor.can().chain().focus().redo().run()}
                    aria-label="Redo"
                >
                    <Redo className="h-4 w-4" />
                </Button>
            </div>

            {/* Editor Content */}
            <EditorContent editor={editor} placeholder={placeholder} />
        </div>
    );
}