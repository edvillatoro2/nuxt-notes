export default defineEventHandler(async (e) => {
  // Get the note id from URL
  const id = getRouterParam(e, 'id')
  // Get the new title/content from request body
  const body = await readBody<{ title: string; content: string }>(e)
  const note = await prisma.note.update({
    // Find the note by id
    where: { id: id },
    // Update it with new data (title, content)
    data: body
  })
  // Return updated note
  return note
})
