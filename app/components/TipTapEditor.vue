<template>
  <div v-if="editor" class="border border-gray-300 rounded overflow-hidden bg-white">
    <!-- Toolbar -->
    <div class="border-b border-gray-200 bg-gray-50 p-2 flex flex-wrap gap-1">
      <button
        @click="editor.chain().focus().toggleBold().run()"
        :disabled="!editor.can().chain().focus().toggleBold().run()"
        :class="{ 'is-active': editor.isActive('bold') }"
        class="px-3 py-1.5 bg-white border border-gray-300 rounded hover:bg-gray-100 font-bold"
      >
        B
      </button>
      <button
        @click="editor.chain().focus().toggleItalic().run()"
        :disabled="!editor.can().chain().focus().toggleItalic().run()"
        :class="{ 'bg-gray-300': editor.isActive('italic') }"
        class="px-3 py-1.5 bg-white border border-gray-300 rounded hover:bg-gray-100 italic"
      >
        I
      </button>
      <button
        @click="editor.chain().focus().toggleStrike().run()"
        :disabled="!editor.can().chain().focus().toggleStrike().run()"
        :class="{ 'bg-gray-300': editor.isActive('strike') }"
        class="px-3 py-1.5 bg-white border border-gray-300 rounded hover:bg-gray-100 line-through"
      >
        S
      </button>

      <div class="w-px h-8 bg-gray-300 mx-1"></div>

      <button
        @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
        :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }"
        class="px-3 py-1.5 bg-white border border-gray-300 rounded hover:bg-gray-100"
      >
        H1
      </button>
      <button
        @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
        :class="{ 'bg-gray-300': editor.isActive('heading', { level: 2 }) }"
        class="px-3 py-1.5 bg-white border border-gray-300 rounded hover:bg-gray-100"
      >
        H2
      </button>
      <button
        @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
        :class="{ 'bg-gray-300': editor.isActive('heading', { level: 3 }) }"
        class="px-3 py-1.5 bg-white border border-gray-300 rounded hover:bg-gray-100"
      >
        H3
      </button>

      <div class="w-px h-8 bg-gray-300 mx-1"></div>

      <button
        @click="editor.chain().focus().toggleBulletList().run()"
        :class="{ 'bg-gray-300': editor.isActive('bulletList') }"
        class="px-3 py-1.5 bg-white border border-gray-300 rounded hover:bg-gray-100"
      >
        • List
      </button>
      <button
        @click="editor.chain().focus().toggleOrderedList().run()"
        :class="{ 'bg-gray-300': editor.isActive('orderedList') }"
        class="px-3 py-1.5 bg-white border border-gray-300 rounded hover:bg-gray-100"
      >
        1. List
      </button>
      <button
        @click="editor.chain().focus().toggleBlockquote().run()"
        :class="{ 'bg-gray-300': editor.isActive('blockquote') }"
        class="px-3 py-1.5 bg-white border border-gray-300 rounded hover:bg-gray-100"
      >
        Quote
      </button>
      <button
        @click="editor.chain().focus().toggleCodeBlock().run()"
        :class="{ 'is-active': editor.isActive('codeBlock') }"
        class="px-3 py-1.5 bg-white border border-gray-300 rounded hover:bg-gray-100"
      >
        code block
      </button>
      <button
        @click="editor.chain().focus().setHorizontalRule().run()"
        class="px-3 py-1.5 bg-white border border-gray-300 rounded hover:bg-gray-100"
      >
        horizontal rule
      </button>
      <div class="w-px h-8 bg-gray-300 mx-1"></div>
      <button
        @click="editor.chain().focus().undo().run()"
        :disabled="!editor.can().chain().focus().undo().run()"
        class="px-3 py-1.5 bg-white border border-gray-300 rounded hover:bg-gray-100"
      >
        undo
      </button>
      <button
        @click="editor.chain().focus().redo().run()"
        :disabled="!editor.can().chain().focus().redo().run()"
        class="px-3 py-1.5 bg-white border border-gray-300 rounded hover:bg-gray-100"
      >
        redo
      </button>
    </div>

    <!-- Editor Content -->
    <TiptapEditorContent :editor="editor" class="p-4 min-h-64" />
  </div>
</template>

<script setup>
const editor = useEditor({
  content: '<p>Start writing your note...</p>',
  extensions: [TiptapStarterKit]
})

onBeforeUnmount(() => {
  unref(editor).destroy()
})
</script>

<style>
/* TipTap Editor Styles */
.tiptap {
  outline: none;
}

.tiptap h1 {
  font-size: 2em;
  font-weight: bold;
  margin: 0.67em 0;
}

.tiptap h2 {
  font-size: 1.5em;
  font-weight: bold;
  margin: 0.75em 0;
}

.tiptap h3 {
  font-size: 1.25em;
  font-weight: 600;
  margin: 0.83em 0;
}

.tiptap p {
  margin: 0.5em 0;
  line-height: 1.6;
}

.tiptap ul,
.tiptap ol {
  padding-left: 1.5rem;
  margin: 1em 0;
}

.tiptap ul {
  list-style-type: disc;
}

.tiptap ol {
  list-style-type: decimal;
}

.tiptap li {
  margin: 0.25em 0;
}

.tiptap blockquote {
  border-left: 4px solid #e5e7eb;
  padding-left: 1rem;
  margin: 1em 0;
  font-style: italic;
  color: #6b7280;
}

.tiptap strong {
  font-weight: bold;
}

.tiptap em {
  font-style: italic;
}

.tiptap s {
  text-decoration: line-through;
}
</style>
