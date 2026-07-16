interface ContentNode {
  type?: string
  value?: string
  children?: ContentNode[]
}

export function extractPlainText(node: ContentNode | ContentNode[] | undefined): string {
  if (!node) return ''
  if (Array.isArray(node)) return node.map(extractPlainText).join(' ')
  if (node.type === 'text' && typeof node.value === 'string') return node.value
  if (Array.isArray(node.children)) return extractPlainText(node.children)
  return ''
}
