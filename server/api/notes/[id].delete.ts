export default defineEventHandler(async (e) => {
  // Get the note id from URL
  const id = getRouterParam(e, 'id')
  await prisma.note.delete({
    // Delete the note with this id
    where: { id: id }
  })
  // Confirm deletion succeeded
  return { success: true }
})
