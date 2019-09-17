import React, { useState } from 'react'
import PropTypes from 'prop-types'
import MemberImageTime from '../MemberImageTime'
import Button from 'components/Button'

import styles from './styles.css'

const EditCommentCard = ({ comment, saveNewComment, cancelEditingComment }) => {
  const [text, setText] = useState(comment.text)
  return (
    <div className={styles.edit_comment_container}>
      <MemberImageTime picture='cristian' timestamp={comment.timestamp} />
      <div className={styles.edit_comment_card}>
        <input
          className={styles.edit_input}
          value={text}
          onChange={event => setText(event.target.value)}
        />
        <div className={styles.card_actions}>
          <Button
            color='primary'
            className={styles.small_button}
            onClick={() => saveNewComment(comment.id, text)}
          >
            Save
          </Button>
          <Button
            className={styles.small_button}
            onClick={() => cancelEditingComment(comment.id)}
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  )
}

EditCommentCard.propTypes = {
  comment: PropTypes.object.isRequired,
  saveNewComment: PropTypes.func.isRequired,
  cancelEditingComment: PropTypes.func.isRequired,
}

export default EditCommentCard
