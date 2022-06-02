const Typography = (theme, borderRadius, fontFamily) => ({
    fontFamily,
    h8: {
        fontWeight: 300,
        color: theme.palette.grey[500],
        fontSize: '0.75rem'
    },
    h7: {
        fontWeight: 300,
        color: theme.palette.grey[500],
        fontSize: '0.85rem'
    },
    h6: {
        fontWeight: 500,
        color: theme.palette.grey[650],
        fontSize: '0.85rem'
    },
    h5: {
        fontSize: '1rem',
        color: theme.palette.grey[650],
        fontWeight: 500
    },
    h4: {
        fontSize: '1.1rem',
        color: theme.palette.grey[600],
        fontWeight: 500
    },
    h3: {
        fontSize: '1.25rem',
        color: theme.palette.grey[600],
        fontWeight: 500
    },
    h2: {
        fontSize: '1.5rem',
        color: theme.palette.grey[600],
        fontWeight: 700
    },
    h1: {
        fontSize: '2.125rem',
        color: theme.palette.grey[600],
        fontWeight: 300
    },
    subtitle1: {
        fontSize: '0.875rem',
        fontWeight: 200,
        color: theme.palette.text.clientProfile
    },
    clientNotes: {
        fontSize: '0.775rem',
        fontWeight: 200,
        color: theme.palette.text.dark
    },
    passesData: {
        fontSize: '0.75rem',
        fontWeight: 200,
        color: theme.palette.text.dark
    },
    subtitle2: {
        fontSize: '0.75rem',
        fontWeight: 400,
        color: theme.palette.text.secondary
    },
    sectionSubHeaders: {
        fontSize: '0.8rem',
        fontWeight: 400,
        color: theme.palette.secondary[800]
    },
    packageHeaders: {
        fontSize: '0.775rem',
        fontWeight: 500,
        color: theme.palette.secondary[800]
    },
    sectionData: {
        fontSize: '0.75rem',
        fontWeight: 500,
        color: theme.palette.text.primary
    },
    sectionDataSecondary: {
        fontSize: '0.75rem',
        fontWeight: 350,
        color: theme.palette.text.clientProfile
    },
    sectionClassTitle: {
        fontSize: '0.85rem',
        fontWeight: 500,
        color: theme.palette.secondary.main
    },
    tableValue: {
        fontWeight: 900,
        color: theme.palette.tableValues.main
    },
    tileHeader: {
        fontWeight: 500,
        color: theme.palette.tileHeaders.header
    },
    tileRevenue: {
        fontSize: '1.8rem',
        fontWeight: 900,
        color: theme.palette.tileHeaders.main
    },
    tileSubheader: {
        fontSize: '0.75rem',
        fontWeight: 400,
        color: theme.palette.tileHeaders.main
    },
    caption: {
        fontSize: '0.75rem',
        color: theme.palette.text.secondary,
        fontWeight: 400
    },
    body1: {
        fontSize: '0.875rem',
        fontWeight: 400,
        lineHeight: '1.334em'
    },
    body2: {
        letterSpacing: '0em',
        fontWeight: 400,
        lineHeight: '1.5em',
        color: theme.palette.text.primary
    },
    button: {
        textTransform: 'capitalize'
    },
    customInput: {
        marginTop: 1,
        marginBottom: 1,
        '& > label': {
            top: 23,
            left: 0,
            color: theme.palette.grey[500],
            '&[data-shrink="false"]': {
                top: 5
            }
        },
        '& > div > input': {
            padding: '30.5px 14px 11.5px !important'
        },
        '& legend': {
            display: 'none'
        },
        '& fieldset': {
            top: 0
        }
    },
    mainContent: {
        backgroundColor: theme.palette.mode === 'dark' ? theme.palette.dark[800] : theme.palette.primary.light,
        width: '100%',
        minHeight: 'calc(100vh - 88px)',
        flexGrow: 1,
        padding: '16px',
        marginTop: '88px',
        marginRight: '20px',
        borderRadius: `${borderRadius}px`
    },
    menuCaption: {
        fontSize: '0.875rem',
        fontWeight: 500,
        color: theme.palette.grey[600],
        padding: '6px',
        textTransform: 'capitalize',
        marginTop: '10px'
    },
    subMenuCaption: {
        fontSize: '0.6875rem',
        fontWeight: 500,
        color: theme.palette.text.secondary,
        textTransform: 'capitalize'
    },
    contentSpacing: {
        marginTop: '10px',
        marginLeft: '10px'
    },
    commonAvatar: {
        cursor: 'pointer',
        borderRadius: '8px'
    },
    smallAvatar: {
        width: '22px',
        height: '22px',
        fontSize: '1rem'
    },
    mediumAvatar: {
        width: '34px',
        height: '34px',
        fontSize: '1.2rem'
    },
    largeAvatar: {
        width: '44px',
        height: '44px',
        fontSize: '1.5rem'
    }
});

export default Typography;
