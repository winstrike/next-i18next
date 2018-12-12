import React from 'react'
import { Trans } from 'react-i18next'
import { i18n, Link, withNamespaces } from '../i18n'

import Title from '../components/Title'
import Footer from '../components/Footer'

class Homepage extends React.Component {
  render() {
    const { t } = this.props
    return (
      <React.Fragment>
        <Title />

        {/* Works... */}
        <Trans i18n={i18n} i18nKey='h1' />

        {/* Does not work unless i18n is explicitly passed in */}
        {/* <Trans i18nKey='h1' /> */}

        <button onClick={() => i18n.changeLanguage(i18n.language === 'en' ? 'de' : 'en')}>
          {t('change-locale')}
        </button>
        <Link href='/second-page'>
          <a>{t('to-second-page')}</a>
        </Link>
        <Footer />
      </React.Fragment>
    )
  }
}

export default withNamespaces('common')(Homepage)
