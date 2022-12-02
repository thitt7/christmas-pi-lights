import React, {useState, useEffect, useRef} from 'react'

const Lights = (props: any) => {
    const source = props.source
    const context = props.context

    const handleClick = () => {
        console.log(props)
        console.log('context inside lights component', context)
        console.log('source inside lights component', source)
        props.pause()
    }

    return (
        <button onClick={handleClick}>Click Me</button>
    )

}

export default Lights