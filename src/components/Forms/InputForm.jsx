import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';

export default function InputForm({ type, labelName, placeholder, errorMassage }) {
      return (
            <Form.Group as={Col} md="12" controlId={`validationCustom-${labelName}`} className="mb-3">
                  <Form.Label>{labelName}</Form.Label>
                  <Form.Control
                        as={type === 'textarea' ? 'textarea' : 'input'}
                        type={type !== 'textarea' ? type : undefined}
                        rows={type === 'textarea' ? 4 : undefined}
                        required
                        placeholder={placeholder}
                  />
                  <Form.Control.Feedback type="invalid">
                        {errorMassage}
                  </Form.Control.Feedback>
            </Form.Group>
      );
}