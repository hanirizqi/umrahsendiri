// Nuxt Content v3 stores parsed markdown as a "minimark" tree: each node is
// [tag, props, ...children], where a child is either a string (text) or another node.
type MinimarkNode = string | [string, Record<string, unknown>, ...MinimarkNode[]]

interface MinimarkBody {
  type?: string
  value?: MinimarkNode[]
}

function extractFromNode(node: MinimarkNode): string {
  if (typeof node === 'string') return node
  const [, , ...children] = node
  return children.map(extractFromNode).join(' ')
}

export function extractPlainText(body: MinimarkBody | undefined): string {
  if (!body?.value) return ''
  return body.value.map(extractFromNode).join(' ')
}
