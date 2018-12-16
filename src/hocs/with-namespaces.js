import { withNamespaces } from 'react-i18next'

export default function (namespaces = [], options = {}) {
  console.log('---------- withNamespaces ----------', namespaces) // eslint-disable-line
  return withNamespaces(namespaces, options)
}
