export default (res, redirectLocation) => {
  res.set('Cache-Control', 'private, no-cache, no-store, must-revalidate')
  res.set('Expires', '-1')
  res.set('Pragma', 'no-cache')
  res.redirect(302, redirectLocation)
}
