import ReactGA from 'react-ga'
import * as Sentry from '@sentry/browser'

export const initializeThirdParty = () => {
  if (isProduction) {
    ReactGA.initialize(process.env.GA_TOKEN)
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
    })
  }
}

export const trackPageView = url => {
  if (isProduction) {
    ReactGA.pageview(url)
  }
}

export const trackEvent = (category, action) => {
  if (isProduction) {
    ReactGA.event({
      category,
      action,
    })
  }
}

export const dateStringFromTimestamp = timestamp => {
  const date = new Date(timestamp)
  return date.toISOString().substr(0, 10)
}

export const timeStringFromTimestamp = timestamp => {
  const date = new Date(timestamp)
  return (
    paddTimeNumber(date.getHours().toString()) +
    ':' +
    paddTimeNumber(date.getMinutes().toString())
  )
}

export const paddTimeNumber = number => {
  return number.length < 2 ? '0' + number : number
}

const isProduction = process.env.NPM_CONFIG_PRODUCTION === 'true'

const isValidElement = elem => elem.name && elem.value

// Only take into account text-like inputs and checked radios/checkboxes
const isValidValue = elem =>
  !['checkbox', 'radio'].includes(elem.type) || elem.checked

/**
 * Utility function for converting form data to an object.
 *
 * @param {HTMLFormControlsCollection} formElements
 */
export function formToObject(formElements) {
  const formData = Array.from(formElements).reduce((data, elem) => {
    if (isValidElement(elem) && isValidValue(elem)) {
      let value

      // if multiple values exist with the same name, save them in an array
      if (elem.type === 'checkbox' || data[elem.name]) {
        const existingValues = data[elem.name]
        if (Array.isArray(existingValues)) {
          value = [...data[elem.name], elem.value]
        } else {
          // If the old value is not an array, using the spread operator
          // will destroy the value: 14 -> '1', '4' for example
          value = [existingValues, elem.value]
        }
      } else {
        value = elem.value
      }

      return {
        ...data,
        [elem.name]: value,
      }
    }

    return data
  }, {})

  return formData
}
