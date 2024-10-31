import './Alert.css';

// Make alert types
const Alert: React.FC<{message: string, type: string}> = ({message, type}) => {

    let style = ''
    if (type === 'error') {
        style = 'error';
    } else if (type === 'success') {
        style = 'success'
    }
    return (
        <div className={`alert ${style}`}>
            {message}
        </div>
    )

}

export default Alert;