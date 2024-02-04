const Button = ({id, onClick, children}) => {

    return (
        <div className="button button-default" id={id} onClick={onClick}>{children}</div>
    )
}

export default Button
