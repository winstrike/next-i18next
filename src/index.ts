import { withNamespaces } from 'react-i18next'

import createConfig from './config/create-config'
import { NextI18NextConfig } from './config/default-config'

import createI18NextClient from './create-i18next-client'

import { appWithTranslation } from './hocs/app-with-translation'
import { withConfig } from './hocs/index'
import { consoleMessage, ConsoleMessageTypes } from './utils/console-message'
import { Link, Trans } from './components/index'

export default class NextI18Next {

  config: NextI18NextConfig
  consoleMessage: (messageType: ConsoleMessageTypes, message: string) => void;
  i18n: any
  appWithTranslation: boolean

  constructor(userConfig) {
    this.config = createConfig(userConfig)
    this.consoleMessage = consoleMessage.bind(this)
    this.i18n = createI18NextClient(this.config)
    this.appWithTranslation = appWithTranslation.bind(this)
    this.withNamespaces = withNamespaces

    const nextI18NextConfig = { config: this.config, i18n: this.i18n }
    this.Trans = withConfig(Trans, nextI18NextConfig)
    this.Link = withConfig(Link, nextI18NextConfig)
  }

}
