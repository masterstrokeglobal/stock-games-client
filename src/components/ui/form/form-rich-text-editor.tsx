'use client';
import { Toggle } from '@/components/ui/toggle';
import { type Editor as EditorType } from '@tiptap/react';
import clsx from 'clsx';
import {
    Bold,
    Heading1,
    Heading2,
    Italic,
    List,
    ListOrdered,
    Minus,
    TextQuote as Quote,
    Strikethrough
} from 'lucide-react';

const Editor = ({ editor }: { editor: EditorType | null }) => {

  if (!editor) return null;

  return (
    <div className="flex flex-wrap gap-x-3 border-b border-gray-200 py-2 bg-white">
      {/* Bold */}
      <Toggle
        size="sm"
        pressed={editor.isActive('bold')}
        className={clsx(
          'hover:bg-gray-100 data-[state=on]:bg-gray-200 data-[state=on]:text-gray-900',
          editor.isActive('bold') ? 'bg-gray-200 text-gray-900' : 'text-gray-600'
        )}
        onPressedChange={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold className="h-4 w-4" />
      </Toggle>

      {/* Italic */}
      <Toggle
        size="sm"
        pressed={editor.isActive('italic')}
        className={clsx(
          'hover:bg-gray-100 data-[state=on]:bg-gray-200 data-[state=on]:text-gray-900',
          editor.isActive('italic') ? 'bg-gray-200 text-gray-900' : 'text-gray-600'
        )}
        onPressedChange={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic className="h-4 w-4" />
      </Toggle>

      {/* Strikethrough */}
      <Toggle
        size="sm"
        pressed={editor.isActive('strike')}
        className={clsx(
          'hover:bg-gray-100 data-[state=on]:bg-gray-200 data-[state=on]:text-gray-900',
          editor.isActive('strikethrough') ? 'bg-gray-200 text-gray-900' : 'text-gray-600'
        )}
        onPressedChange={() => editor.chain().focus().toggleStrike().run()}
      >
        <Strikethrough className="h-4 w-4" />
      </Toggle>

      {/* Heading 2 */}
      <Toggle
        size="sm"
        pressed={editor.isActive('heading', { level: 2 })}
        className={clsx(
          'hover:bg-gray-100 data-[state=on]:bg-gray-200 data-[state=on]:text-gray-900',
          editor.isActive('h2') ? 'bg-gray-200 text-gray-900' : 'text-gray-600'
        )}
        onPressedChange={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      >
        <Heading1 className="h-4 w-4" />
      </Toggle>

      {/* Heading 3 */}
      <Toggle
        size="sm"
        pressed={editor.isActive('heading', { level: 3 })}
        className={clsx(
          'hover:bg-gray-100 data-[state=on]:bg-gray-200 data-[state=on]:text-gray-900',
          editor.isActive('h3') ? 'bg-gray-200 text-gray-900' : 'text-gray-600'
        )}
        onPressedChange={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
      >
        <Heading2 className="h-4 w-4" />
      </Toggle>

      {/* Unordered List */}
      <Toggle
        size="sm"
        pressed={editor.isActive('bulletList')}
        className={clsx(
          'hover:bg-gray-100 data-[state=on]:bg-gray-200 data-[state=on]:text-gray-900',
          editor.isActive('ul') ? 'bg-gray-200 text-gray-900' : 'text-gray-600'
        )}
        onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
      >
        <List className="h-4 w-4" />
      </Toggle>

      {/* Ordered List */}
      <Toggle
        size="sm"
        pressed={editor.isActive('orderedList')}
        className={clsx(
          'hover:bg-gray-100 data-[state=on]:bg-gray-200 data-[state=on]:text-gray-900',
          editor.isActive('ol') ? 'bg-gray-200 text-gray-900' : 'text-gray-600'
        )}
        onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrdered className="h-4 w-4" />
      </Toggle>

      {/* Blockquote */}
      <Toggle
        size="sm"
        pressed={editor.isActive('blockquote')}
        className={clsx(
          'hover:bg-gray-100 data-[state=on]:bg-gray-200 data-[state=on]:text-gray-900',
          editor.isActive('blockquote') ? 'bg-gray-200 text-gray-900' : 'text-gray-600'
        )}
        onPressedChange={() => editor.chain().focus().toggleBlockquote().run()}
      >
        <Quote className="h-4 w-4" />
      </Toggle>

      {/* Horizontal Rule */}
      <Toggle
        size="sm"
        pressed={editor.isActive('horizontalRule')}
        className={clsx(
          'hover:bg-gray-100 data-[state=on]:bg-gray-200 data-[state=on]:text-gray-900',
          editor.isActive('horizontalRule') ? 'bg-gray-200 text-gray-900' : 'text-gray-600'
        )}
        onPressedChange={() => editor.commands.setHorizontalRule()}
      >
        <Minus className="h-4 w-4" />
      </Toggle>

    </div>
  );
};

export default Editor;