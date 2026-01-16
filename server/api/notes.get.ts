export default defineEventHandler(async () => {
  const notes = await prisma.note.findMany({
    orderBy: { updatedAt: 'desc' }
  })
  return notes
})
