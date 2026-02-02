<template>
  <div class="flex md:flex-row flex-col h-screen">
    <div class="flex w-full flex-col gap-4 md:w-1/3 p-8 bg-[#464D77] text-white">
      <div @click="deleteNote" class="relative mb-12 cursor-pointer flex justify-end group">
        <Icon name="flat-color-icons:full-trash" size="36" class="absolute right-0" />
        <span
          class="absolute top-0.25 right-0.75 w-7 h-2 bg-black rounded-sm origin-left transition-transform duration-600 group-hover:-rotate-45"
        ></span>
      </div>
      <div v-for="note in notes" class="flex flex-col gap-4">
        <div class="capitalize font-semibold tracking-widest text-4xl">
          <NuxtTime :datetime="note?.updatedAt" relative numeric="auto" relative-style="long" />
        </div>

        <div
          @click="loadNote(note)"
          :class="{ 'bg-[#6b72a8]': activeNote?.id === note.id }"
          class="cursor-pointer truncate rounded p-2 bg-[#5A6091] hover:bg-[#6b72a8]"
        >
          <ul style="list-style: circle; list-style-position: inside">
            <li class="">
              {{ note?.title || 'Untitled' }}
            </li>
          </ul>
          <div class="text-[0.725rem] font-semibold">
            <NuxtTime :datetime="note?.updatedAt" hour="2-digit" minute="2-digit" locale="en-US" />
          </div>
        </div>
      </div>
    </div>

    <div class="md:w-2/3 w-full p-8 py-20">
      <div class="mb-12 flex justify-end">
        <button
          @click="handleLogout"
          class="text-sm bg-red-500 hover:bg-red-600 cursor-pointer px-3 py-1 rounded text-white"
        >
          Logout
        </button>
      </div>
      <div class="mb-2">
        <div @click="saveNote">
          <Icon
            name="streamline-color:send-email-flat"
            size="24"
            class="text-gray-400 cursor-pointer mx-auto transition-transform duration-900 hover:translate-x-full hover:rotate-x-50 rotate-z-45"
          />
        </div>
      </div>

      <!-- Editor Section -->
      <ClientOnly>
        <div>
          <TipTapEditor
            ref="editorRef"
            :initial-content="currentNoteContent"
            :note-id="currentNoteId"
            @contentUpdate="handleContentUpdate"
          />
        </div>
      </ClientOnly>
    </div>
  </div>
</template>

<script setup lang="ts">
// Apply auth middleware
definePageMeta({
  middleware: 'auth'
})

interface Note {
  title: string
  id: number
  content: string
  userId: number
  createdAt: string
  updatedAt: string
}

const notes = ref<Note[]>([])
// const showEditor = ref(false)
const activeNote = ref<Note | null>(null)
const currentNoteId = ref<number | null>(null)
const currentNoteContent = ref('')
const editorRef = ref(null)
const currentContent = ref({ html: '', text: '' })

onMounted(async () => {
  await loadNotes()
})

// load note from server
const loadNotes = async () => {
  try {
    const res = await $fetch('/api/notes')
    if (res?.success && res?.notes) {
      notes.value = res.notes
    }
  } catch (error) {
    console.error('Error loading notes:', error)
  }
}

// load selected note content into editor
const loadNote = (note: Note) => {
  activeNote.value = note.id ? note : null
  currentNoteId.value = note.id
  currentNoteContent.value = note.content
  currentContent.value = { html: note.content, text: note.content }
}

const { logout, user } = useAuth()

const handleLogout = async () => {
  await logout()
}

// handle content update from TipTapEditor
const handleContentUpdate = (content: { html: string; text: string }) => {
  currentContent.value = content
  console.log('Content updated:', content)
}

const saveNote = async () => {
  if (!currentContent.value.html || currentContent.value.html === '') {
    alert('Cannot save empty note.')
    return
  }
  try {
    // extract title from first 30 chars
    const title = currentContent.value.text.substring(0, 30) || 'Untitled'

    const res = await $fetch('/api/notes', {
      method: 'POST',
      body: {
        content: currentContent.value.text,
        noteId: currentNoteId.value,
        title: title
      }
    })
    if (res?.success) {
      alert('Note saved successfully!')
      await loadNotes()
      // update currentNoteId if new note
      if (!currentNoteId.value) {
        currentNoteId.value = res.note.id
      }
    } else {
      alert('Failed to save note.')
    }
  } catch (error) {
    console.error('Error saving note:', error)
  }
}

const deleteNote = async () => {
  if (!currentNoteId.value) {
    alert('No note selected to delete.')
    return
  }
  if (confirm('Are you sure you want to delete this note?')) {
    try {
      const res = await $fetch(`/api/notes/${currentNoteId.value}`, {
        method: 'DELETE'
      })
      if (res?.success) {
        //clear editor
        // Clear editor
        if (editorRef.value?.clearContent) {
          editorRef.value.clearContent()
        }
        // reset editor
        currentNoteId.value = null
        currentNoteContent.value = ''
        currentContent.value = { html: '', text: '' }

        //reload notes
        await loadNotes()
        alert('Note deleted successfully!')
      } else {
        alert('Failed to delete note.')
      }
    } catch (error) {
      console.error('Error deleting note:', error)
    }
  }
}
</script>

<style scoped>
@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-2px);
  }
  50% {
    transform: translateX(2px);
  }
  75% {
    transform: translateX(-2px);
  }
}

.hover-shake:hover {
  animation: shake 0.5s ease-in-out;
}
</style>
