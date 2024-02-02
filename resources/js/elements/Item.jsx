const Item = ({name, value, warn, selector = "pencil", action}) => {


    return (
        <div className="item">
            <span className="item-name">{name}</span>
            <div className="item-value">
                <span>{value}</span>
                {warn ? <span className="item-warn">({warn})</span> : ''}
                <div className="item-line"/>
            </div>
            {action ? (
                <>
                    {(selector === "pencil") ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                             strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                             className="item-edit"
                             onClick={() => action()}>
                            <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                        </svg>
                    ) : (
                        <span className="item-edit splash" onClick={() => action()}>{selector}</span>
                    )}
                </>
            ) : ''}
        </div>
    )
}

export default Item
