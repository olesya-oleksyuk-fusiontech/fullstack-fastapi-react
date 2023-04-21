import React from 'react';
import { Alert } from 'react-bootstrap';

const Message = ({
  variant, styleOptions, classOpt, children,
}) => (
  <Alert variant={variant} style={styleOptions} className={classOpt}>
    {children}
  </Alert>
);

Message.defaultProps = {
  variant: 'secondary',
};

export default Message;
