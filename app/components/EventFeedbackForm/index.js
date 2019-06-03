import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Button from 'components/Button'
import styles from './styles.css'
import { preEventQuestions, postEventQuestions } from './template'
import * as EventActions from 'containers/Events/actions'
import { formToObject } from 'utils'
import { saveEventForm } from 'api'

const scaleQuestion = (scale, name, labels, prevAnswer) => {
  const radios = []
  for (let i = 1; i < scale + 1; i++) {
    radios.push(
      <label className={styles.horizontalRadioLabel} key={i}>
        <div>{i}</div>
        <div>
          <input
            type='radio'
            key={name + i}
            name={name}
            value={i}
            defaultChecked={prevAnswer && prevAnswer === i}
            required
          />
        </div>
      </label>
    )
  }
  return (
    <div className={styles.inputGroup}>
      <div>
        <div>{labels[0]}</div>
      </div>
      {radios}
      <div>
        <div>{labels[1]}</div>
      </div>
    </div>
  )
}

const choiceQuestion = (name, labels, labelValues, prevAnswer) => {
  const radios = []
  for (const [index, label] of labels.entries()) {
    radios.push(
      <label className={styles.verticalRadioLabel} key={name + label}>
        <div>
          <input
            type='radio'
            name={name}
            value={labelValues[index]}
            defaultChecked={prevAnswer && prevAnswer === labelValues[index]}
            required
          />
        </div>
        <div>{label}</div>
      </label>
    )
  }
  return radios
}

const textQuestion = (name, prevAnswer) => {
  return (
    <label>
      <textarea name={name} defaultValue={prevAnswer || ''} required />
    </label>
  )
}

const formatQuestion = (question, prevAnswer) => {
  let content
  switch (question.type) {
    case 'choice':
      content = choiceQuestion(
        question.name,
        question.labels,
        question.labelValues,
        prevAnswer
      )
      break
    case 'scale':
      content = scaleQuestion(5, question.name, question.labels, prevAnswer)
      break
    case 'response':
      content = textQuestion(question.name, prevAnswer)
      break
    default:
      break
  }

  return (
    <fieldset disabled={prevAnswer} key={question.title}>
      <h2>{question.title}</h2>
      {content}
    </fieldset>
  )
}

class EventFeedbackForm extends Component {
  componentDidMount() {
    this.props.getEvents()
  }

  handleSubmit = (eventId, preEvent) => {
    return e => {
      e.preventDefault()

      const formdata = formToObject(e.target.elements)

      for (const data in formdata) {
        if (!isNaN(Number(formdata[data]))) {
          formdata[data] = Number(formdata[data])
        } else if (formdata.data === 'true') {
          formdata[data] = true
        } else if (formdata.data === 'false') {
          formdata[data] = false
        }
      }

      formdata.preEvent = preEvent ? true : false
      formdata.eventId = eventId

      saveEventForm(formdata)
      this.props.history.push(`/events/${eventId}`)
    }
  }

  render() {
    const { events } = this.props
    const eventId = this.props.match.params.id

    if (events.length < 1) {
      return <div className={styles.container} />
    }

    const preEvent =
      this.props.location.pathname &&
      this.props.location.pathname.includes('pre_form')

    const questions = preEvent ? preEventQuestions : postEventQuestions

    let previousAnswers
    if (preEvent) {
      previousAnswers =
        this.props.eventForms[0] &&
        'familiarWithCompany' in this.props.eventForms[0] &&
        this.props.eventForms[0]
    } else {
      previousAnswers =
        this.props.eventForms[1] ||
        (this.props.eventForms[0] &&
          !('familiarWithCompany' in this.props.eventForms[0]) &&
          this.props.eventForms[0])
    }

    const form = questions.map(question =>
      previousAnswers && question.name in previousAnswers
        ? formatQuestion(question, previousAnswers[question.name])
        : formatQuestion(question)
    )

    return (
      <div className={styles.container}>
        <form
          className={styles.form}
          onSubmit={this.handleSubmit(eventId, preEvent)}
        >
          <h1>
            {
              this.props.events.find(
                event => event.id === this.props.match.params.id
              ).companyName
            }
            : {preEvent ? 'Pre' : 'Post'} Event feedback
          </h1>
          {form}
          <div className={styles.submitWrapper}>
            <Button
              disabled={Boolean(previousAnswers)}
              wrapper
              color='primary'
              type='submit'
            >
              Submit
            </Button>
          </div>
        </form>
      </div>
    )
  }
}

EventFeedbackForm.propTypes = {
  user: PropTypes.object.isRequired,
  events: PropTypes.array.isRequired,
  location: PropTypes.object.isRequired,
  getEvents: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  eventForms: PropTypes.array.isRequired,
}

function mapStateToProps(state) {
  return {
    user: state.getIn(['global', 'user']).toJS(),
    events: state.getIn(['events', 'items']).toJS(),
    eventForms: state.getIn(['eventFeedbackForm', 'eventForms']),
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ ...EventActions }, dispatch)
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EventFeedbackForm)
