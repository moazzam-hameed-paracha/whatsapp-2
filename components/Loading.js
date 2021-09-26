import Image from 'next/image'
import { Circle } from 'better-react-spinkit'

function Loading() {
    return (
        <center style={{
            display: 'grid',
            placeItems: 'center',
            height: '100vh',
        }}>
            <div><Image
                src="/logos/Whatsapp-logo-on-transparent-background-PNG-(3).png"
                alt=""
                style={{
                    marginBottom: "10px",
                }}
                height={200}
                width={200}
            /></div>
            <Circle color="#3CBC28" size={60} />
        </center>
    )
}

export default Loading
