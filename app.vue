<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script>
export default {
  head: {
    meta: [
      { name: 'viewport', content: 'width=device-width, user-scalable=no' },
    ]
  }
}
</script>

<style lang="scss">

@import '@/styles/media.scss';
@import '@/styles/style.css';


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
    color: $hover-color;
  }
}

.text {
  width: 100%;
  padding: 0 20vw;
  font-size: 18px;

  @media (max-width: $bpw-tablet) {
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
  width: 100vw;
  height: 100vh;
  overflow-y: scroll;
}

.footer {
  margin-top: 70px;
  margin-bottom: 30px;

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
    margin-bottom: 70px;
  }

  ul {
    margin-left: 30px;
  }

  .has-text-align-center {
    text-align: center;
  }

  .has-text-align-right {
    text-align: right;
  }
  
  // figure, .wp-block-file {
  figure {
    width: 100%;
    height: fit-content;
    width: auto;

    img {
      width: 100%;
      height: auto;
      border-radius: 20px;
    }

    iframe {
      width: 100%;
      height: min(50vw, 80vh);
      border-radius: 20px;
    }
  }

  // .wp-block-file {
  //   display: flex;
  //   height: fit-content;

  //   > * {
  //     vertical-align: middle;
  //   }

  //   .wp-block-file__button {
  //     color: white;
  //     text-decoration: none;
  //     height: 2em;
  //     font-size: 13px;
  //     margin: 0 10px;
  //     padding: 5px 2em 0 2em;
  //     border-radius: 1em;
  //     background-color: rgba(0, 0, 0, 0.9);
  //   }
  // }

  figcaption {
    font-size: 14px;
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

    * {
      width: 100%;
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

