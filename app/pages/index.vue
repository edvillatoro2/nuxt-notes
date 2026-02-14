<template>
  <div class="flex md:flex-row flex-col-reverse h-screen lg:p-8 lg:gap-8 p-0 gap-0">
    <div
      class="flex w-full flex-col gap-4 md:w-1/3 md:p-8 p-4 bg-[#464D77]/40 rounded text-white overflow-y-scroll"
    >
      <div
        v-gsap.splitText.chars.stagger.from="{ opacity: 0, y: 80 }"
        class="lg:text-8xl hidden lg:flex justify-center font-bold tracking-widest text-outline text-[#cdcffa]"
      >
        Notes
      </div>

      <div class="relative flex justify-between">
        <!-- New Note Button -->
        <div
          @click="newNote"
          class="inline-flex items-center justify-center md:text-4xl text-2xl p-2 cursor-pointer group transition-all duration-600 ease-out bg-white/0 border border-white/5 shadow-[0_4px_30px_rgba(0,0,0,0.1)] backdrop-blur-[3.1px] hover:bg-white/10 hover:border-white/80 hover:shadow-[0_4px_8px_rgba(0,0,0,0.525)] active:scale-95 text-[#9AFF03] hover:text-[#9AFF03]/80 rounded relative"
        >
          <Icon name="material-symbols:note-add" />
        </div>

        <div
          @click="deleteNote"
          class="inline-flex items-center justify-center md:text-4xl text-2xl p-2 cursor-pointer group transition-all duration-600 ease-out bg-white/0 border border-white/5 shadow-[0_4px_30px_rgba(0,0,0,0.1)] backdrop-blur-[3.1px] hover:bg-white/10 hover:border-white/80 hover:shadow-[0_4px_8px_rgba(0,0,0,0.525)] active:scale-95 text-[#CF5C36] hover:text-[#cf5c36b4] rounded relative"
        >
          <Icon name="flat-color-icons:full-trash" />
          <span
            class="absolute md:top-2.5 top-2 left-3 md:w-7 md:h-2 w-4 h-1.5 bg-[#5A6091] rounded-sm origin-left transition-transform duration-600 group-hover:-rotate-45"
          />
        </div>
      </div>

      <div v-for="note in displayNotes" :key="note.id" class="flex flex-col gap-4">
        <div class="capitalize font-semibold tracking-tight md:tracking-widest text-xl md:text-4xl">
          <template v-if="note.id === -1"> New Note </template>
          <template v-else>
            <NuxtTime :datetime="note?.updatedAt" relative numeric="auto" relative-style="long" />
          </template>
        </div>

        <div
          @click="note.id !== -1 ? toggleNote(note) : undefined"
          :class="{
            'bg-[#6f7acc]/80': selectedNotes.includes(note.id),
            'cursor-default': note.id === -1,
            'cursor-pointer': note.id !== -1
          }"
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

    <div class="md:w-2/3 w-full md:p-8 md:py-20 p-4">
      <div class="mb-4 flex justify-between">
        <div @click="saveNote" class="cursor-pointer group inline-flex items-end transition">
          <Icon
            name="streamline-color:send-email-flat"
            size="24"
            :class="[
              'mx-auto transition duration-200',
              'group-hover:brightness-110 group-hover:saturate-125',
              isSending ? 'animate-paperplane' : ''
            ]"
          />
        </div>
        <button
          @click="handleLogout"
          class="font-semibold cursor-pointer px-3 py-2 rounded transition-all duration-600 ease-out bg-white/0 border border-white/5 shadow-[0_4px_30px_rgba(0,0,0,0.1)] backdrop-blur-[3.1px] hover:bg-white/10 hover:border-white/80 hover:shadow-[0_4px_8px_rgba(0,0,0,0.525)] active:scale-95 text-[#CF5C36] hover:text-[#cf5c36b4]"
        >
          Logout
        </button>
      </div>

      <!-- Editor Section -->
      <ClientOnly>
        <div
          class="p-2 rounded"
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
const { open: openModal } = useModal()

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
const isCreatingNew = ref(false)

const { logout, user } = useAuth()

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
const toggleNote = (note: Note) => {
  const index = selectedNotes.value.indexOf(note.id)
  if (index > -1) {
    // already selected, remove from selection and clear editor if it's the active note
    selectedNotes.value = []
    currentNoteId.value = null
    currentNoteContent.value = ''
    currentContent.value = { html: '', text: '' }
    activeNote.value = null
  } else {
    // mark as selected
    selectedNotes.value = [note.id]

    // load note into editor
    loadNote(note)
  }
}

// load selected note content into editor
const loadNote = (note: Note) => {
  // clear any selections when loading a note for editing
  activeNote.value = note.id ? note : null
  currentNoteId.value = note.id
  currentNoteContent.value = note.content
  currentContent.value = {
    html: note.content,
    text: note.content
  }
}

const handleLogout = async () => {
  await logout()
}

// handle content update from TipTapEditor
const handleContentUpdate = (content: { html: string; text: string }) => {
  currentContent.value = content
}

const saveNote = async () => {
  // check if content is empty
  const emptyContent = currentContent.value.text?.trim() || ''
  const htmlContent = currentContent.value.html?.trim() || ''

  const isEmptyHtml = !htmlContent || htmlContent === '<p></p>' || htmlContent === ''
  const isEmptyText = !emptyContent || emptyContent === ''

  if (isEmptyHtml && isEmptyText) {
    openModal({
      title: 'Empty Note',
      message: 'Cannot save an empty note. Please add some content before saving.'
    })
    return
  }

  //animation trigger
  isSending.value = true

  try {
    // extract title from first 30 chars
    const title = currentContent.value.text.substring(0, 30) || 'Untitled'

    // send content to server, if currentNoteId exists, update note, otherwise create new note
    const res = await $fetch('/api/notes', {
      method: 'POST',
      body: {
        content: currentContent.value.html,
        id: currentNoteId.value,
        title: title
      }
    })
    if (res?.success) {
      await loadNotes()

      //clear draft note state
      isCreatingNew.value = false

      // update currentNoteId if new note
      if (!currentNoteId.value && res.note?.id) {
        currentNoteId.value = res.note.id
        selectedNotes.value = [res.note.id]
      }

      // reset animation
      setTimeout(() => {
        isSending.value = false
      }, 950)
      openModal({
        title: 'Save Successful',
        message: 'Note saved successfully!'
      })
    } else {
      isSending.value = false
      openModal({
        title: 'Save Failed',
        message: 'Failed to save note.'
      })
    }
  } catch (error) {
    console.error('Error saving note:', error)
    isSending.value = false
    openModal({
      title: 'Error Occured',
      message: 'An error occurred while saving the note.'
    })
  }
}

// create a new note
const newNote = () => {
  // clear selections and editor
  selectedNotes.value = [-1]

  // mark as creating new note to trigger draft note in sidebar
  isCreatingNew.value = true

  //clear editor
  activeNote.value = null
  currentNoteId.value = null
  currentNoteContent.value = ''
  currentContent.value = { html: '', text: '' }

  //clear editor content and focus
  if (editorRef.value) {
    editorRef.value.clearContent()
  }
}

const displayNotes = computed(() => {
  if (isCreatingNew.value) {
    // add draft note at top
    const draftNote: Note = {
      id: -1, // temporary ID for draft
      title: currentContent.value.text.substring(0, 30) || 'type new note...',
      content: currentContent.value.html || '',
      userId: user.value?.id || 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    return [draftNote, ...notes.value]
  }
  return notes.value
})

const deleteNote = async () => {
  // if notes are selected, delete them all
  if (selectedNotes.value.length > 0) {
    const count = selectedNotes.value.length

    openModal({
      title: 'Confirm Deletion',
      message: 'Are you sure you want to delete this note?',
      confirmText: 'Delete',
      action: async () => {
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

          // success message
          openModal({
            title: 'Success',
            message: 'Note successfully deleted!'
          })
        } catch (error) {
          console.error('Error:', error)
          selectedNotes.value = []
          openModal({
            title: 'Error',
            message: 'Failed to delete notes. Please try again.'
          })
        }
      }
    })
    return
  }

  // delete current note
  if (!currentNoteId.value) {
    openModal({
      title: 'No Note Selected',
      message: 'Please select a note to delete.'
    })
    return
  }

  openModal({
    title: 'Delete Note',
    message: 'Are you sure you want to delete this note?',
    confirmText: 'Delete',
    action: async () => {
      try {
        await $fetch(`/api/notes/${currentNoteId.value}`, { method: 'DELETE' })
        editorRef.value?.clearContent()
        currentNoteId.value = null
        currentNoteContent.value = ''
        currentContent.value = { html: '', text: '' }
        await loadNotes()

        openModal({
          title: 'Success',
          message: 'Note deleted successfully!'
        })
      } catch (error) {
        console.error('Error:', error)
        openModal({
          title: 'Error',
          message: 'Failed to delete note. Please try again.'
        })
      }
    }
  })
}
</script>

<style scoped>
.text-outline {
  color: transparent;
  -webkit-text-stroke: 1px white;
  text-shadow: -4px -4px white;
}
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
