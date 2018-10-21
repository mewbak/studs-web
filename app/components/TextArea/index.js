// @flow
import React from 'react'

type Props = {
  name?: string,
  value?: string,
  onChange?: Function,
}

class TextArea extends React.Component<Props> {
  render() {
    const { name, value, onChange } = this.props
    return (
      <textarea
        name={name}
        value={value}
        onChange={onChange}
      />
    )
  }
}

export default TextArea
