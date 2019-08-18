// @flow
import React from 'react'
import { FormattedMessage } from 'react-intl'
import messages from './messages'
import styles from './styles.css'
import Logo from 'static/img/logo/studs20.svg'
import Button from 'components/Button'
import { Link } from 'react-router-dom'

function HomePageHeader() {
  return (
    <div className={styles.header}>
      <div className={styles.header_content}>
        <img className={styles.logo} src={Logo} />
        <div className={styles.header_text}>
          <h3>
            <FormattedMessage {...messages.intro.about} />
          </h3>
        </div>
        <div className={styles.buttons}>
          <Link to='/about'>
            <Button color='gold'>
              <FormattedMessage {...messages.intro.application} />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default HomePageHeader
