import PropTypes from 'prop-types'
import { Box } from '@mui/material'
import { SimplePageLayout } from '../SimplePageLayout'
import './style.scss'

Error.propTypes = {
    code: PropTypes.number.isRequired,
    message: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired
}

export function Error({ code, message, image }) {
    return (
        <SimplePageLayout>
            <Box className="c-error">
                <Box className="c-error__content">
                    <Box className="c-error__content-info">
                        <Box className="c-error__content-info-id" component="h3">{code} </Box>
                        <Box className="c-error__content-info-message">{message} </Box>
                    </Box>
                    <img className="c-error__content-image" src={image} alt="error image" />
                </Box>
            </Box>
        </SimplePageLayout>
    )
}
