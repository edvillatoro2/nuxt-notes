<template>
  <div class="flex md:flex-row flex-col-reverse h-screen p-8 gap-8">
    <div
      class="flex w-full flex-col gap-4 md:w-1/3 p-8 bg-[#464D77]/40 rounded text-white overflow-y-scroll"
    >
      <div class="relative mb-12 cursor-pointer flex group justify-end">
        <div @click="deleteNote" class="p-2 hover:bg-red-500/40 bg-red-600 rounded relative">
          <Icon name="flat-color-icons:full-trash" size="36" />
          <span
            class="absolute top-2.5 left-3 w-7 h-2 bg-[#5A6091] rounded-sm origin-left transition-transform duration-600 group-hover:-rotate-45"
          ></span>
          <!-- <span class="font-medium text-sm">
            Delete {{ selectedNotes.length > 0 ? ` ${selectedNotes.length}` : '' }} note{{
              selectedNotes.length > 1 ? 's' : ''
            }}
          </span> -->
        </div>
      </div>
      <div v-for="note in notes" class="flex flex-col gap-4">
        <div class="capitalize font-semibold tracking-widest text-4xl">
          <NuxtTime :datetime="note?.updatedAt" relative numeric="auto" relative-style="long" />
        </div>

        <div
          @click="toggleNotes(note)"
          :class="{ 'bg-[#6f7acc]': selectedNotes.includes(note.id) }"
          class="cursor-pointer truncate rounded p-2 bg-[#5A6091] hover:bg-[#6f7acc]"
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
          class="text-sm bg-red-500 font-semibold hover:bg-red-600 cursor-pointer px-3 py-2 rounded text-white"
        >
          Logout
        </button>
      </div>
      <div class="mb-2">
        <div @click="saveNote" class="cursor-pointer">
          <Icon
            name="streamline-color:send-email-flat"
            size="24"
            :class="['text-gray-400 mx-auto', isSending ? 'animate-paperplane' : '']"
          />
        </div>
      </div>

      <!-- Editor Section -->
      <ClientOnly>
        <div
          class="p-8 rounded"
          style="
            background: #b05446;
            background: linear-gradient(
              141deg,
              rgba(176, 84, 70, 0.5) 0%,
              rgba(154, 255, 3, 0.3) 50%,
              rgba(129, 128, 168, 0.55) 69%
            );
          "
        >
          <TipTapEditor
            ref="editorRef"
            :initial-content="currentNoteContent"
            :note-id="currentNoteId ?? undefined"
            @contentUpdate="handleContentUpdate"
          />
        </div>
      </ClientOnly>
    </div>
  </div>
</template>

<script setup lang="ts">
// Apply auth middleware
// definePageMeta({
//   middleware: 'auth'
// })

interface Note {
  title: string
  id: number
  content: string
  userId: number
  createdAt: string
  updatedAt: string
}

const notes = ref<Note[]>([])
const activeNote = ref<Note | null>(null)
const currentNoteId = ref<number | null>(null)
const currentNoteContent = ref('')
const editorRef = ref(null)
const currentContent = ref({ html: '', text: '' })
const isSending = ref(false)
const selectedNotes = ref<number[]>([])

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

//toggle note selection for deletion
const toggleNotes = (note: Note) => {
  const index = selectedNotes.value.indexOf(note.id)
  if (index > -1) {
    // already selected, remove from selection
    selectedNotes.value.splice(index, 1)

    // if currently active note is deselected, clear editor
    if (currentNoteId.value === note.id) {
      currentNoteId.value = null
      currentNoteContent.value = ''
      currentContent.value = { html: '', text: '' }
      activeNote.value = null
    }
  } else {
    // not selected, add to selection
    selectedNotes.value.push(note.id)

    //load selected note into editor
    loadNote(note)
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
}

const saveNote = async () => {
  // check if content is empty
  const emptyContent = currentContent.value.text.trim()

  if (!emptyContent || emptyContent === '') {
    alert('Cannot save empty note.')
    return
  }

  //animation trigger
  isSending.value = true

  try {
    // extract title from first 30 chars
    const title = currentContent.value.text.substring(0, 30) || 'Untitled'

    const res = await $fetch('/api/notes', {
      method: 'POST',
      body: {
        content: currentContent.value.text,
        id: currentNoteId.value,
        title: title
      }
    })
    if (res?.success) {
      await loadNotes()
      // update currentNoteId if new note
      if (!currentNoteId.value && res.note?.id) {
        currentNoteId.value = res.note.id
      }

      // reset animation
      setTimeout(() => {
        isSending.value = false
      }, 950)
      alert('Note saved successfully!')
    } else {
      isSending.value = false
      alert('Failed to save note.')
    }
  } catch (error) {
    console.error('Error saving note:', error)
    isSending.value = false
    alert('An error occurred while saving the note.')
  }
}

const deleteNote = async () => {
  // if notes are selected, delete them all
  if (selectedNotes.value.length > 0) {
    const count = selectedNotes.value.length
    if (!confirm(`Delete ${count} note${count > 1 ? 's' : ''}?`)) return

    try {
      await Promise.all(
        selectedNotes.value.map((id) => $fetch(`/api/notes/${id}`, { method: 'DELETE' }))
      )

      if (currentNoteId.value && selectedNotes.value.includes(currentNoteId.value)) {
        editorRef.value?.clearContent()
        currentNoteId.value = null
        currentNoteContent.value = ''
        currentContent.value = { html: '', text: '' }
      }

      selectedNotes.value = []
      await loadNotes()
      alert(`${count} note${count > 1 ? 's' : ''} deleted!`)
    } catch (error) {
      console.error('Error:', error)
    }
    return
  }

  // delete current note
  if (!currentNoteId.value) {
    alert('No note selected.')
    return
  }

  if (confirm('Delete this note?')) {
    try {
      await $fetch(`/api/notes/${currentNoteId.value}`, { method: 'DELETE' })
      editorRef.value?.clearContent()
      currentNoteId.value = null
      currentNoteContent.value = ''
      currentContent.value = { html: '', text: '' }
      await loadNotes()
      alert('Note deleted!')
    } catch (error) {
      console.error('Error:', error)
    }
  }
}
</script>

<style scoped>
@keyframes paperplane {
  0% {
    transform: translate(0, 0) rotate(0deg) scale(1);
  }

  25% {
    transform: translate(40px, -30px) rotate(20deg);
  }

  50% {
    transform: translate(80px, 0) rotate(360deg);
  }

  75% {
    transform: translate(40px, 30px) rotate(380deg);
  }

  100% {
    transform: translate(0, 0) rotate(360deg) scale(1);
  }
}

.animate-paperplane {
  animation: paperplane 0.95s ease-in-out forwards;
  will-change: transform;
}
</style>
