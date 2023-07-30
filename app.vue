<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<style lang="scss">

@import '@/styles/media.scss';
// @import '@/styles/wp-css/style.css';

@import url('https://fonts.googleapis.com/css?family=Roboto Slab');

*{
  margin: 0;
  padding: 0;
  font-family: 'Roboto Slab', serif;
  box-sizing: border-box;
  overflow: hidden;
}

a {
  color: inherit;
  text-decoration: underline;

  &:hover {
    font-weight: bold;
    color: $hover-color-dark;
  }
}

.text {
  width: 100%;
  padding: 0 15vw;
  // overflow: visible;
  font-size: 18px;

  @media (max-width: $bpw-phone) {
    padding: 0;
  }
}

.content {
  color: black;
  background-color: rgba(255, 255, 255, 0.6);
  border-radius: 10px;
  padding: 50px;
}

.overlay {
  position: fixed;
  bottom: 0;
  width: 100vw;
  height: 100vh;
  z-index: 10;
  overflow-y: scroll;
}

.underlay {
  width: 100vw;
  height: 100vh;
  z-index: 1;
  .cover {
    position: absolute;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.footer {
  margin-top: 120px;
  margin-bottom: 10px;

  #copyright > * {
    flex-basis: 50%;
  }

  #copyright > :last-child {
    text-align: right;
  }
}

.article {
  > * {
    margin-bottom: 20px;
    max-width: 100%;
  }

  > :last-child {
    margin-bottom: 100px;
  }

  > ul {
    margin-left: 50px;
    ul {
      margin-left: 30px;
    }
  }

  .has-text-align-center {
    text-align: center;
  }

  .has-text-align-right {
    text-align: right;
  }
  
  > figure, .wp-block-cover, .wp-block-file {
    margin-left: 30px;
    max-width: 80%;
    height: fit-content;
    width: auto;

    * {
      max-width: 100%;
      max-height: 60vh;
      width: auto;
      height: auto;;
    }

    audio {
      height: 50px;
      width: 100%;
    }

    iframe {
      width: 100%;
      height: 60vh;
    }

  }

  .wp-block-file {
    display: flex;
    height: fit-content;

    > * {
      vertical-align: middle;
    }

    .wp-block-file__button {
      color: white;
      text-decoration: none;
      height: 2em;
      font-size: 13px;
      margin: 0 10px;
      padding: 5px 2em 0 2em;
      border-radius: 1em;
      background-color: rgba(0, 0, 0, 0.9);
    }
  }

  > figcaption {
    font-size: 12px;
    width: 50%;
  }

  blockquote {
    > p {
      margin-bottom: 20px;
    }

    > cite {
      display: block;
      width: 100%;
      padding-left: 30px;
      padding-right: 10vw;
    }
  }
}

#aboutPage {
  > * {
    margin-bottom: 20px;
  }

  figure{
    width: 100%;
    height: fit-content;
    width: auto;
    display: flex;
    justify-content: center;

    * {
      max-width: 100%;
      max-height: 60vh;
      width: auto;
      height: auto;;
    }
  }
}

#teamPage {
  > * {
    figure {
      height: 400px;
      width: 300px;

      img {
        height: 100%;
        width: 100%;
        object-fit: cover;
      }

      flex: 0 0 auto;
    }

    .wp-block-media-text__content {  
      padding: 50px;
      width: 100%;
      flex: 1;
      @media (max-width: $bpw-tablet) {
        padding: 20px 0;
      }
    }

    display: flex;
    align-items: center;
    margin-bottom: 20px;

    @media (max-width: $bpw-tablet) {
      flex-direction: column;
    }

  }
}

/* width */
::-webkit-scrollbar {
  width: 5px;
}

/* Track */
::-webkit-scrollbar-track {
  background: #ffffffb0;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #000000a4;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #000000;
}

</style>

