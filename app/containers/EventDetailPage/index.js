import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as EventDetailActions from './actions'
import * as CreateEventFeedbackActions from '../CreateEventFeedback/actions'
import { EventDetail } from '../../components/EventDetail'

export class EventDetailPage extends React.Component {
  componentDidMount() {
    const { id, user } = this.props
    this.props.getEventForms(user.get('id'), id)
  }

  componentDidUpdate(prevProps) {
    const { id, user, getEventForms } = this.props
    // fetch event feedback forms if it's a different event
    // or if the user has just been authenticated
    if (id !== prevProps.id || (user.get('id') && !prevProps.user.get('id'))) {
      getEventForms(user.get('id'), id)
    }
  }

  render() {
    const form1 = this.props.eventForms && this.props.eventForms[0]
    const form2 = this.props.eventForms && this.props.eventForms[1]
    const preEventFormReplied = Boolean(
      (form1 && form2) || (form1 && 'familiarWithCompany' in form1)
    )
    const postEventFormReplied = Boolean(
      form2 || (form1 && !('familiarWithCompany' in form1))
    )

    const companyName = this.props.event.companyName

    return (
      <EventDetail
        id={this.props.id}
        event={this.props.event}
        user={this.props.user.toJS()}
        onRemoveEvent={this.props.onRemoveEvent}
        preEventFormReplied={preEventFormReplied}
        postEventFormReplied={postEventFormReplied}
        onGenerateFeedback={this.props.setFeedbackCompanyName(companyName)}
      />
    )
  }
}

EventDetailPage.propTypes = {
  id: PropTypes.string.isRequired,
  event: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  onRemoveEvent: PropTypes.func.isRequired,
  getEventForms: PropTypes.func.isRequired,
  eventForms: PropTypes.array,
  setFeedbackCompanyName: PropTypes.func.isRequired,
}

function mapStateToProps(state) {
  return {
    user: state.getIn(['global', 'user']),
    eventForms: state.getIn(['eventFeedbackForm', 'eventForms']),
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    { ...EventDetailActions, ...CreateEventFeedbackActions },
    dispatch
  )
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EventDetailPage)
