import { useState, useEffect } from "react";
import { makeStyles, Hidden } from "@material-ui/core";
import { Box } from "@material-ui/core";

import PlayCircleFilledWhiteIcon from "@material-ui/icons/PlayCircleFilledWhite";
import IconButton from "@material-ui/core/IconButton";
import SingleLineGridList from "./components/SingleLineGridList";


export default function App() {
  // Hooks
  const [listaDeArchivos, setListaDeArchivos] = useState([]);
  const [archivoActual, setArchivoActual] = useState(null);
  const [timer, setTimer] = useState(false);

  // useStyle
  const width1 = "100vw";
  const height1 = "100vh";

  const useStyle = makeStyles({
    App: {
      background: `url(${archivoActual}) no-repeat center fixed`,
      backgroundSize: "cover",
      overflow: "hidden",
      width: width1,
      height: height1,
      boxSizing: "border-box"
    }
  });
  const classes = useStyle();

  // Funciones
  function handleDrop(e) {
    e.preventDefault();
    const archivos = e.dataTransfer.files;
    procesarArchivos(archivos);
  }

  function procesarArchivos(archivos) {
    const arr = Array.from(archivos);
    const mapa = arr.map(archivo => {
      let urlFile = URL.createObjectURL(archivo);
      return urlFile;
    })
    setListaDeArchivos(mapa)

  }

// BUSCAR LA FORMA DE HACER TIMER OFF SI !FULLSCREEN

  function handlePlayClick(e) {
    setTimer(true);
    if (!document.fullscreenElement){
      document.documentElement.requestFullscreen()
    } 
  }

  // Hacer una funcion para cancelar todo

  /* function fullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  } */

  function handleBoxClick(event) {
    if (event.target !== document.querySelector(".MuiSvgIcon-root")) {
      if (timer === true) {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        }
        setTimer(false);
        setArchivoActual(null);
      }
    }
  }


  // useEffect
  useEffect(() => {
    const interval = setInterval(() => {
      if (timer && document.fullscreenElement) {
        const indice = listaDeArchivos.length;
        const random = Math.floor(Math.random() * (indice - 0)) + 0;
        setArchivoActual(listaDeArchivos[random]);
      } else {
        clearInterval(interval);
        setTimer(false);
        setArchivoActual(null);
      }
    }, 1000);
    return () => {
      clearInterval(interval)
      
    };
  }, [timer]);

  return (
    <Box
      className={classes.App}
      textAlign="center"
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      onClick={handleBoxClick}>
      <Hidden xsUp={timer}>
        <IconButton aria-label="play">
          <PlayCircleFilledWhiteIcon
            onClick={handlePlayClick}
            style={{
              backgroundColor: "white",
              width: "100px",
              height: "100",
              borderRadius: "50%"
            }}
          />
        </IconButton>
        <h1>Arrastra las fotos a la pantalla</h1>
        <Box
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between"
          }}>
          <SingleLineGridList tileData={listaDeArchivos} />
        </Box>
      </Hidden>
    </Box>
  );
}
