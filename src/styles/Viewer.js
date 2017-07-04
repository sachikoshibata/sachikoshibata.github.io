export default {
  component: {
    position: 'fixed',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    overflow: 'auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    flexShrink: 0,
    flexGrow: 0,
    backgroundColor: '#000',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center center',
    backgroundSize: 'contain'
  },
  navi_left: {
    position: 'fixed',
    top: 20,
    left: 20
  },
  navi: {
    position: 'fixed',
    top: 20,
    right: 20
  },
  naviItem: {
    display: 'inline-block',
    minWidth: 15,
    backgroundColor: '#fff',
    marginLeft: 10,
    padding: 5,
    textDecoration: 'none',
    textAlign: 'center'
  },
  info: {
    boxSizing: 'border-box',
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    color: '#fff',
    position: 'fixed',
    bottom: 20,
    left: 20
  },
  progress: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0
  }
}
