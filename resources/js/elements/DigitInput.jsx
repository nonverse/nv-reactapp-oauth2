import {Field} from "formik";

const DigitInput = ({length = 4, password, name, validate, label, error, onLast}) => {

    function changeFocus(e) {
        if (e.target.value.length >= e.target.getAttribute("maxlength")) {
            e.target.nextElementSibling.focus();
        }
    }

    return (
        <Field name={name} validate={validate}>
            {({field: {value}, form: {setFieldValue}}) => (
                <div className={`digit-input-wrapper ${error ? 'has-error' : ''}`}>
                    <span className="digit-input-label">{label}</span>
                    <div className="digit-input">
                        {[...Array(length)].map(digit => (
                            <input type={password ? 'password' : 'text'}
                                //key={`${name}-digit-${Math.random().toString()}`}
                                // TODO Adding key, causes input to lose focus
                                   maxLength={1}
                                   onChange={e => {
                                       setFieldValue(name, `${value}${e.target.value}`)
                                       //TODO If previous code digit is changed, update corresponding digit
                                   }}
                                   onInput={(e) => {
                                       if (e.target.nextSibling) {
                                           changeFocus(e)
                                       } else {
                                           if (onLast) {
                                               onLast()
                                           }
                                       }
                                   }}/>
                        ))}
                    </div>
                    <span className="digit-input-error">{error}</span>
                </div>
            )}
        </Field>
    )
}

export default DigitInput
