import { useEffect } from 'voby'

import { useScript } from './useScript'

// it's an example, use your types instead
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const jQuery: any

export default function Component() {
    // Load the script asynchronously
    const status = useScript(`https://code.jquery.com/jquery-3.5.1.min.js`, {
        removeOnUnmount: false,
    })

    useEffect(() => {
        if (typeof jQuery !== 'undefined') {
            // jQuery is loaded => print the version
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            alert(jQuery.fn.jquery)
        }
    })

    return (
        <div>
            <p>{`Current status: ${status}`}</p>

            {status() === 'ready' && <p>You can use the script here.</p>}
        </div>
    )
}
