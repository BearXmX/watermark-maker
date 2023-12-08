const download = (params: { href?: string; name?: string }) => {
  const a = document.createElement('a')

  a.href = params.href!

  a.download = params.name!

  a.target = '_blank'

  document.body.appendChild(a)

  a.click()

  a.remove()
}

export { download }
