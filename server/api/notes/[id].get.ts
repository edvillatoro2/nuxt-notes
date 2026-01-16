export default defineEventHandler(async (e) => {
  // Get the note id from URL (e.g., /api/notes/abc123)
  const id = getRouterParam(e, 'id')

  const note = await prisma.note.findUnique({
    // Find the note with this specific id
    where: { id: id }
  })
  // If no note found, return 404 error
  if (!note) {
    throw createError({ statusCode: 404, statusMessage: 'Note not found' })
  }
  // Return the note
  return note
})
