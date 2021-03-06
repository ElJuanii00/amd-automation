import React, { useContext, useState } from 'react';
import { Link, makeStyles, Box, Container, Drawer, Button, IconButton, Divider, Grid, Typography, Badge, ButtonGroup } from "@material-ui/core"
import MenuIcon from '@material-ui/icons/Menu';
import CloseIcon from '@material-ui/icons/Close';
import { ShopContext } from "../context/shopContext"
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import useDocumentScrollThrottled from './../atoms/useDocumentScrollThrottled'

const useStyles = makeStyles((theme) => ({
    header: {
        backgroundColor: "white",
        [theme.breakpoints.down('sm')]: {
            padding: "0.75rem 0",
        },
        transition: "transform 0.3s ease",  
    },
    headerWrapper:{
        [theme.breakpoints.down('sm')]: {
            justifyContent: "center",
        },
    },
    nav:{
        height: "5rem",
        [theme.breakpoints.down('sm')]: {
            display: "none",
        },
    },
    navList: {
        display: "flex",
        height: "100%",
        margin: "0",
        [theme.breakpoints.down('sm')]: {
            padding: "2rem 0 0",
            flexDirection: "column",
            justifyContent: "flex-start",
        },
    },
    navListItem: {
        padding: "0rem 1rem",
        height: "100%",
        alignItems: "center", 
        display: "flex",
        textTransform: "capitalize",
        cursor: "pointer",
        color: "#222",
        '&:hover': {
            textDecoration: "none",
            backgroundColor: "#fab700",
            color: "white",
        },
        [theme.breakpoints.down('sm')]: {
            padding: "1rem 1rem",
            display: "block",
            color: "white",
            textAlign: "start",
            paddingLeft: "2rem",
        },
    },
    hamburgerButton: {
        display: "none",
        alignItems: "center",
        [theme.breakpoints.down('sm')]: {
            display: "flex",
        },
        "& .MuiDrawer-paperAnchorLeft": {
            width: "15rem",
            [theme.breakpoints.down('sm')]: {
                display: "flex",
                justifyContent: "center",
            },
            backgroundColor: "#0e0e0e",
        },
    },
    checkoutDrawer: {
        "& .MuiDrawer-paperAnchorRight": {
            padding: "1.5rem 2.5rem",
            width: "25rem",
            justifyContent: "flex-start",
            backgroundColor: "#0e0e0e",
            [theme.breakpoints.down('sm')]: {
                width: "100%",
            },
        }
    },
    checkoutNavList: {
        display: "flex",
        margin: "0",
        padding: "0",
        flexDirection: "column",
        justifyContent: "flex-start",
    },
    checkoutNavListItem: {
        padding: "1rem 0rem",
        height: "100%",
        display: "flex",
        textTransform: "capitalize",
        cursor: "pointer",
        color: "#222",
        '&:hover': {
            textDecoration: "none",
            backgroundColor: "#fab700",
            color: "white",
        },
    },
    checkoutButton: {
        width: "100%",
        outline: "none",
        fontSize: ".75rem",
        borderRadius: "0",
        border: "none",
        backgroundColor: "#fab700",
        color: "white",
        "&:hover": {
            backgroundColor: "#C08000",
        },
    },
    headerLogo: {
        width: "10rem",
        [theme.breakpoints.down('sm')]: {
            width: "5rem",
        },
    },
    shadow: {
        boxShadow: '0 9px 9px -9px rgba(0, 0, 0, 0.3)',
    },
    hidden: {
        transform: 'translateY(-110%)',
    },
}));


const Header = (props) => {
    const classes = useStyles();
    const [stateLeft, setStateLeft] = React.useState({left: false});
    const [stateRight, setStateRight] = React.useState({right: false});
    const [shouldHideHeader, setShouldHideHeader] = useState(false);
    const [shouldShowShadow, setShouldShowShadow] = useState(false);
    const { checkout, addItemToCheckout, removeItemToCheckout, isCartOpen, closeCart } = useContext(ShopContext)

    const MINIMUM_SCROLL = 80;
    const TIMEOUT_DELAY = 400;

    const shadowStyle = shouldShowShadow ? classes.shadow : null;
    const hiddenStyle = shouldHideHeader ? classes.hidden : null;

    useDocumentScrollThrottled(callbackData => {
        const { previousScrollTop, currentScrollTop } = callbackData;
        const isScrolledDown = previousScrollTop < currentScrollTop;
        const isMinimumScrolled = currentScrollTop > MINIMUM_SCROLL;

        setShouldShowShadow(currentScrollTop > 2);

        setTimeout(() => {
        setShouldHideHeader(isScrolledDown && isMinimumScrolled);
        }, TIMEOUT_DELAY);
    });

    const toggleDrawer = (anchor, open, item) => (event) => {
        if (item !== undefined){
            if(item.index !== 'checkout'){
                props.onClick(`/${item.index}`, '')
            } else{
                toggleCloseDrawerLeft('right', true)
            }
        }
        setStateLeft({[anchor]: open})
    };
    const toggleDrawerRight = (anchor, open) => (event) => {
        closeCart()
        setStateRight({[anchor]: open})
    };
    
    const toggleCloseDrawerLeft = (anchor, open) => {
        setStateRight({[anchor]: open})
    }

    const BagItem = ({item}) => {
        return(
            <li style={{listStyle: "none", marginBottom: "1rem"}}>
                <Grid container spacing={3}>
                    <Grid item xs={4}>
                        <Badge color="secondary" badgeContent={item.quantity}>
                            <figure style={{height: "6rem", width: "100%", margin: "0", backgroundColor: "white"}}>
                                <img width="100%" height="100%" style={{objectFit: "contain"}} src={item.variant.image.src} alt=""/>
                            </figure>
                        </Badge>
                    </Grid>
                    <Grid item xs={4}>
                        <Typography style={{color: 'white', fontSize: "0.9rem", textTransform: "capitalize", marginBottom: '1rem'}} variant="subtitle1">{item.title}</Typography>
                        <ButtonGroup>
                            <Button style={{borderColor: 'white'}} onClick={() => {item.quantity <= 1 ? removeItemToCheckout(item.id) : addItemToCheckout(item.variant.id, -1);}}>
                                <RemoveIcon style={{color: 'white'}} fontSize="small" />
                            </Button>
                            <Button style={{borderColor: 'white'}} onClick={() => {addItemToCheckout(item.variant.id, 1)}}>
                                <AddIcon style={{color: 'white'}} fontSize="small" />
                            </Button>
                        </ButtonGroup>
                    </Grid>
                    <Grid item xs={4}>
                        <Typography style={{color: 'white', fontSize: "0.9rem"}} variant="subtitle1">${item.variant.price}</Typography>
                    </Grid>
                </Grid>
            </li>
        )
    }

    return (
        <Box className={`${classes.header} ${shadowStyle} ${hiddenStyle}`} position="sticky" top={0} left={0} right={0} zIndex={1000}>
            <Container fixed>
                <Box className={classes.headerWrapper} display="flex" justifyContent="space-between" alignItems="center">
                    <img className={classes.headerLogo} onClick={() => props.onClick('/', '')} style={{cursor: 'pointer'}} src="https://raw.githubusercontent.com/ElJuanii00/AMD_Autoamtion/master/images_originals/amd_logo_transparent.png" alt=""/>
                    <nav className={classes.nav}>
                        <ul className={classes.navList}>
                            {props.pageList.map( item => {
                                return (
                                    <li key={ item.id } style={{listStyle: "none"}}><Link onClick={item.index !== 'checkout' ? () => props.onClick(`/${item.index}`, '') : toggleDrawerRight('right', true)} className={classes.navListItem}>{ item.index === '' ? 'Home' : (item.icon ? item.icon : item.index) }</Link></li>
                                )
                            })}
                        </ul>
                    </nav>
                    <Button className={classes.hamburgerButton} style={{position: 'absolute', right: "0", color: '#222'}} onClick={toggleDrawer('left', true)}><MenuIcon/></Button>
                    <Drawer className={classes.hamburgerButton} anchor={'left'} open={stateLeft['left']} onClose={toggleDrawer('left', false)}>
                        <ul className={classes.navList}>
                            {props.pageList.map( item => {
                                return (
                                    <li key={ item.id } style={{listStyle: "none"}}><Link onClick={toggleDrawer('left', false, item)} className={classes.navListItem}>{ item.index === '' ? 'Home' : (item.icon ? item.icon : item.index) }</Link></li>
                                )
                            })}
                        </ul>
                    </Drawer>
                    <Drawer className={classes.checkoutDrawer} anchor={'right'} open={stateRight['right'] || isCartOpen} onClose={toggleDrawerRight('right', false)}>
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Typography style={{color: 'white'}} variant="h6">Bag</Typography>
                            <IconButton style={{padding: "0"}} onClick={toggleDrawerRight('right', false)}>
                                <CloseIcon style={{color: 'white'}}/>
                            </IconButton>
                        </Box>
                        <Divider style={{backgroundColor: 'white', margin: "1rem 0"}}/>
                        <Box height="100%" display="flex" flexDirection="column" justifyContent="space-between">
                            <ul className={classes.checkoutNavList}>
                                {checkout.lineItems && checkout.lineItems.map(item =>{
                                    return(
                                        <BagItem key={item.id} item={item}/>
                                    )
                                })}
                            </ul>
                            <Link style={{textDecoration: 'none'}} href={checkout.webUrl} target="_blank" rel="noopener noreferrer"><Button className={classes.checkoutButton} variant="contained">Checkout</Button></Link>
                        </Box>
                    </Drawer>
                </Box>
            </Container>
        </Box>
    )
}

export default Header


