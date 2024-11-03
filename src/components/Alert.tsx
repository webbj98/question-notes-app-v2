import { AlertTypes } from '../../shared/typings/model';
import './Alert.css';

// Make alert types
const Alert: React.FC<{message: string, type: string}> = ({message, type}) => {

    let style = ''

    // Since we are using className of a css, I'm having the name of styles hardcoded to avoid
    // the changing of the AlertTypes breaking the alert styling
    if (type === AlertTypes.Error) {
        style = 'error';
    } else if (type === AlertTypes.Success) {
        style = 'success';
    }
    return (
        <div className={`alert ${style}`}>
            {message}
        </div>
    )

}

export default Alert;